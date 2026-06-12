import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Scroll reveal: aplica `.df-reveal` e adiciona `.is-visible` quando o
 * elemento entra no viewport (IntersectionObserver, dispara uma única vez).
 * Com prefers-reduced-motion ou sem suporte a IO, o conteúdo aparece direto.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  /** atraso em ms para revelações em cascata */
  revealDelay = input(0);

  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private io?: IntersectionObserver;

  ngOnInit(): void {
    const host = this.el.nativeElement;
    host.classList.add('df-reveal');

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || typeof IntersectionObserver === 'undefined') {
      host.classList.add('is-visible');
      return;
    }

    if (this.revealDelay() > 0) {
      host.style.setProperty('--reveal-delay', `${this.revealDelay()}ms`);
    }

    this.io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            host.classList.add('is-visible');
            this.io?.disconnect();
          }
        }
      },
      { threshold: 0.12 }
    );
    this.io.observe(host);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
