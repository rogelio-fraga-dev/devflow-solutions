import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';

interface Ripple { x: number; y: number; t0: number; }

/**
 * Fundo 3D interativo da landing: malha de ondas em perspectiva
 * (projeção 3D real em Canvas 2D, zero dependências).
 *
 * - A malha flui continuamente em direção à câmera (movimento constante)
 * - O cursor levanta e ilumina os pontos próximos; a câmera inclina junto
 * - Clique/toque emite uma ondulação circular que percorre a malha
 * - Cores da marca: #4F46E5 (fundo) → #D2C5FF (primeiro plano)
 *
 * Performance: loop em requestAnimationFrame fora da NgZone, DPR limitado
 * a 2, pausa quando fora do viewport ou aba oculta. Com
 * prefers-reduced-motion renderiza um único frame estático.
 */
@Component({
  selector: 'df-hero-wave',
  standalone: true,
  template: `<canvas #cv aria-hidden="true"></canvas>`,
  styles: [`
    :host { position: absolute; inset: 0; display: block; pointer-events: none; z-index: 4; }
    canvas { width: 100%; height: 100%; display: block; }
  `]
})
export class HeroWaveComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cv') cvRef!: ElementRef<HTMLCanvasElement>;

  private zone = inject(NgZone);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);

  private ctx: CanvasRenderingContext2D | null = null;
  private raf = 0;
  private running = false;
  private reduced = false;
  private pointerFine = true;

  private W = 0;
  private H = 0;
  private cols = 90;
  private rows = 42;

  private t = 0;
  private last = 0;

  /* ponteiro (px de tela) + versão suavizada normalizada para a câmera */
  private px = -9999;
  private py = -9999;
  private smx = 0;
  private smy = 0;
  private ripples: Ripple[] = [];

  private io?: IntersectionObserver;
  private inView = true;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.pointerFine = window.matchMedia('(any-pointer: fine)').matches || !window.matchMedia('(pointer: coarse)').matches;

    const canvas = this.cvRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;

    this.resize();

    if (this.reduced) {
      this.t = 2.5;
      this.render(0);
      return;
    }

    this.zone.runOutsideAngular(() => {
      window.addEventListener('resize', this.onResize, { passive: true });
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
      document.addEventListener('visibilitychange', this.onVisibility);

      this.io = new IntersectionObserver(entries => {
        this.inView = entries[0]?.isIntersecting ?? true;
        this.syncLoop();
      }, { threshold: 0.02 });
      this.io.observe(this.host.nativeElement);

      this.start();
    });
  }

  ngOnDestroy(): void {
    this.stop();
    this.io?.disconnect();
    if (typeof window === 'undefined' || this.reduced) return;
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerdown', this.onPointerDown);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  /* ── controle do loop ── */

  private start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private syncLoop(): void {
    if (this.reduced) return;
    if (this.inView && !document.hidden) this.start();
    else this.stop();
  }

  private onVisibility = (): void => this.syncLoop();
  private onResize = (): void => this.resize();

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.pointerFine) return;
    this.px = e.clientX;
    this.py = e.clientY;
  };

  private onPointerDown = (e: PointerEvent): void => {
    if (this.ripples.length >= 5) this.ripples.shift();
    this.ripples.push({ x: e.clientX, y: e.clientY, t0: this.t });
  };

  private resize(): void {
    const canvas = this.cvRef.nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = this.host.nativeElement.clientWidth;
    this.H = this.host.nativeElement.clientHeight;
    canvas.width = Math.round(this.W * dpr);
    canvas.height = Math.round(this.H * dpr);
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

    /* densidade proporcional à tela (menos pontos no mobile) */
    this.cols = Math.round(Math.min(104, Math.max(46, this.W / 15)));
    this.rows = Math.round(Math.min(46, Math.max(26, this.H / 22)));

    if (this.reduced) this.render(0);
  }

  /* ── render ── */

  private frame = (now: number): void => {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.t += dt;
    this.render(dt);
    this.raf = requestAnimationFrame(this.frame);
  };

  private render(dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const { W, H, t } = this;

    /* câmera segue o ponteiro com suavização */
    const tx = this.px > -999 ? this.px / W - 0.5 : 0;
    const ty = this.py > -999 ? this.py / H - 0.5 : 0;
    const k = dt > 0 ? 1 - Math.pow(0.0025, dt) : 1;
    this.smx += (tx - this.smx) * k;
    this.smy += (ty - this.smy) * k;

    ctx.clearRect(0, 0, W, H);

    const f = H * 0.86;                          // distância focal
    const cx = W / 2 - this.smx * 70;            // parallax horizontal
    const horizon = H * 0.34 - this.smy * 46;    // inclinação vertical
    const camH = 150;                            // altura da câmera sobre o plano

    const spacing = 26;
    const zoff = (t * 42) % spacing;             // fluxo contínuo rumo à câmera
    const spreadX = Math.max(W * 1.9, 1500);

    this.ripples = this.ripples.filter(r => t - r.t0 < 1.6);
    const px = this.px, py = this.py;
    const boosted: number[] = [];                // [x, y, size] dos pontos iluminados

    for (let i = 0; i < this.rows; i++) {
      const z = 90 + i * spacing - zoff;
      if (z < 40) continue;

      const dn = Math.min(1, Math.max(0, (z - 90) / (this.rows * spacing)));   // 0 perto → 1 longe
      const near = 1 - dn;

      /* cor da linha por profundidade: #D2C5FF (perto) → #4F46E5 (longe) */
      const r = Math.round(79 + (210 - 79) * near);
      const g = Math.round(70 + (197 - 70) * near);
      const b = Math.round(229 + (255 - 229) * near);
      const alpha = 0.05 + 0.4 * near * near;

      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();

      const dotEvery = 3;
      const dotSize = 0.8 + near * 2.0;

      for (let j = 0; j < this.cols; j++) {
        const xw = (j / (this.cols - 1) - 0.5) * spreadX;

        /* superfície: 3 ondas senoidais sobrepostas */
        const wave =
          26 * Math.sin(xw * 0.011 + t * 1.1) +
          20 * Math.cos(z * 0.016 - t * 0.7) +
          10 * Math.sin((xw + z) * 0.006 + t * 0.5);

        let sx = cx + (xw * f) / z;
        let sy = horizon + ((camH + wave) * f) / z;

        /* interação: o cursor ergue e ilumina a malha ao redor */
        let lift = 0;
        if (px > -999) {
          const dx = sx - px, dy = sy - py;
          lift = 46 * Math.exp(-(dx * dx + dy * dy) / 33800);
        }

        /* ondulações de clique percorrendo a malha */
        for (const rp of this.ripples) {
          const age = t - rp.t0;
          const ring = age * 520;
          const dx = sx - rp.x, dy = sy - rp.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const band = (d - ring) / 46;
          lift += 34 * Math.exp(-band * band) * (1 - age / 1.6);
        }

        sy -= lift * near;

        if (j === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);

        if (j % dotEvery === 0) {
          if (lift > 7) boosted.push(sx, sy, dotSize + 0.8);
          else {
            ctx.moveTo(sx + dotSize, sy);
            ctx.arc(sx, sy, dotSize, 0, 6.2832);
            ctx.moveTo(sx, sy);
          }
        }
      }
      ctx.stroke();
    }

    /* pontos iluminados pela interação, em lilás da marca */
    if (boosted.length) {
      ctx.fillStyle = 'rgba(210,197,255,0.9)';
      ctx.beginPath();
      for (let i = 0; i < boosted.length; i += 3) {
        ctx.moveTo(boosted[i] + boosted[i + 2], boosted[i + 1]);
        ctx.arc(boosted[i], boosted[i + 1], boosted[i + 2], 0, 6.2832);
      }
      ctx.fill();
    }
  }
}
