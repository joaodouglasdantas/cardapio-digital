const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Faz uma "bolinha" com a foto (ou cor) do produto voar do botão até a sacola.
 * Usa a Web Animations API, sem bibliotecas.
 */
export function flyToCart(from: HTMLElement, image?: string) {
  if (prefersReducedMotion()) return

  const start = from.getBoundingClientRect()
  const size = 56
  const dot = document.createElement('div')
  Object.assign(dot.style, {
    position: 'fixed',
    left: `${start.left + start.width / 2 - size / 2}px`,
    top: `${start.top + start.height / 2 - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '9999px',
    zIndex: '60',
    pointerEvents: 'none',
    boxShadow: '0 10px 25px rgba(42,13,51,.35)',
    border: '3px solid #fff',
    background: image ? `#5b1f6b url(${image}) center/cover` : '#5b1f6b',
  })
  document.body.appendChild(dot)

  // a barra da sacola pode ter acabado de aparecer: mede no próximo quadro
  requestAnimationFrame(() => {
    const badge = document.querySelector('[data-cart-badge]')
    const end = badge?.getBoundingClientRect() ?? {
      left: 40,
      top: window.innerHeight - 60,
      width: 0,
      height: 0,
    }
    const dx = end.left + end.width / 2 - (start.left + start.width / 2)
    const dy = end.top + end.height / 2 - (start.top + start.height / 2)

    const anim = dot.animate(
      [
        { transform: 'translate(0,0) scale(.6)', opacity: 0 },
        { transform: 'translate(0,-30px) scale(1.1)', opacity: 1, offset: 0.2 },
        { transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 80}px) scale(.9)`, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) scale(.25)`, opacity: 0.9 },
      ],
      { duration: 750, easing: 'cubic-bezier(.45,.05,.4,1)' },
    )
    anim.onfinish = () => dot.remove()
    anim.oncancel = () => dot.remove()
  })
}

/** Revela elementos com [data-reveal] quando entram na tela, em cascata. */
export function observeReveal(root: ParentNode = document) {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-visible)'))
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'))
    return () => {}
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io.unobserve(e.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px' },
  )
  els.forEach((el) => io.observe(el))
  return () => io.disconnect()
}
