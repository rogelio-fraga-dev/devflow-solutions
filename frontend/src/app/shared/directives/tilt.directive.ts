import { Directive, ElementRef, NgZone, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Tilt 3D em hover (CSS 3D transforms via custom properties).
 * O movimento é calculado fora da zone (sem change detection por frame)
 * e aplicado pelo CSS `.df-tilt` do design system.
 * Desativado para ponteiros grossos (touch) e prefers-reduced-motion.
 */
@Directive({
  selector: '[appTilt]',
  standalone: true
})
export class TiltDirective implements OnInit, OnDestroy {
  /** inclinação máxima em graus */
  tiltMax = input(6);

  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);
  private raf = 0;
  private active = false;

  ngOnInit(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return;
    }

    this.active = true;
    const host = this.el.nativeElement;
    host.classList.add('df-tilt');

    this.zone.runOutsideAngular(() => {
      host.addEventListener('pointerenter', this.onEnter, { passive: true });
      host.addEventListener('pointermove', this.onMove, { passive: true });
      host.addEventListener('pointerleave', this.onLeave, { passive: true });
    });
  }

  ngOnDestroy(): void {
    if (!this.active) return;
    const host = this.el.nativeElement;
    host.removeEventListener('pointerenter', this.onEnter);
    host.removeEventListener('pointermove', this.onMove);
    host.removeEventListener('pointerleave', this.onLeave);
    cancelAnimationFrame(this.raf);
  }

  private onEnter = (): void => {
    const s = this.el.nativeElement.style;
    s.setProperty('--glare', '1');
    s.setProperty('--ty', '-4px');
  };

  private onMove = (e: PointerEvent): void => {
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(() => {
      const host = this.el.nativeElement;
      const rect = host.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const max = this.tiltMax();

      const s = host.style;
      s.setProperty('--ry', `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
      s.setProperty('--rx', `${(-(y - 0.5) * 2 * max).toFixed(2)}deg`);
      s.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
      s.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
    });
  };

  private onLeave = (): void => {
    cancelAnimationFrame(this.raf);
    const s = this.el.nativeElement.style;
    s.setProperty('--rx', '0deg');
    s.setProperty('--ry', '0deg');
    s.setProperty('--ty', '0px');
    s.setProperty('--glare', '0');
  };
}
