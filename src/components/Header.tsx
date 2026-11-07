import { useState } from 'react'
import type { StoreConfig } from '../types'
import { formatPrice, isOpenNow, todayHours } from '../utils'

export function Header({ store }: { store: StoreConfig }) {
  const open = isOpenNow(store.hours)
  const [hasCover, setHasCover] = useState(true)

  return (
    <header className={`relative overflow-hidden bg-acai-800 text-white ${hasCover ? 'min-h-[22rem]' : ''}`}>
      {/* foto de capa (se não carregar, fica só o fundo roxo) */}
      {hasCover && (
        <>
          <img src="/capa.webp" alt="" onError={() => setHasCover(false)} className="anim-kenburns absolute inset-0 h-full w-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-acai-950 via-acai-950/60 to-acai-900/20" />
        </>
      )}
      {/* bolinhas decorativas de açaí (só sem foto de capa) */}
      {!hasCover && (
        <>
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-acai-700/60 anim-float" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-12 h-44 w-44 rounded-full bg-sol-400/90 anim-sunrise" />
          <div aria-hidden className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-acai-900/60 anim-float-slow" />
        </>
      )}

      <div className={`relative mx-auto max-w-3xl px-4 pb-8 ${hasCover ? 'flex min-h-[22rem] flex-col justify-end pt-24' : 'pt-10'}`}>
        <div className="flex items-center gap-3">
          <img src="/logo-animated.svg" alt="" className="anim-pop h-16 w-16 shrink-0 rounded-full shadow-lg ring-2 ring-white/20" />
          <div>
            <h1 className="anim-up font-display text-3xl font-bold leading-tight" style={{ animationDelay: '.15s' }}>{store.name}</h1>
            <p className="anim-up text-sm text-acai-100" style={{ animationDelay: '.3s' }}>{store.tagline}</p>
          </div>
        </div>

        <div className="anim-up mt-5 flex flex-wrap gap-2 text-xs font-medium" style={{ animationDelay: '.45s' }}>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              open ? 'bg-emerald-400 text-emerald-950' : 'bg-white/15 text-white'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${open ? 'anim-pulse bg-emerald-950' : 'bg-red-300'}`} />
            {open ? 'Aberto agora' : 'Fechado agora'}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">Hoje: {todayHours(store.hours)}</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">Entrega {formatPrice(store.deliveryFee)}</span>
        </div>

        <p className="anim-up mt-3 text-xs text-acai-100" style={{ animationDelay: '.6s' }}>{store.address}</p>
      </div>
    </header>
  )
}
