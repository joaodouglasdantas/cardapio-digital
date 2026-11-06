import type { StoreConfig } from '../types'
import { formatPrice, isOpenNow, todayHours } from '../utils'

export function Header({ store }: { store: StoreConfig }) {
  const open = isOpenNow(store.hours)

  return (
    <header className="relative overflow-hidden bg-acai-800 text-white">
      {/* bolinhas decorativas de açaí */}
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-acai-700/60" />
      <div aria-hidden className="pointer-events-none absolute bottom-6 right-6 h-12 w-12 rounded-full bg-sol-400/90" />
      <div aria-hidden className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-acai-900/60" />

      <div className="relative mx-auto max-w-3xl px-4 pb-8 pt-10">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sol-400 font-display text-2xl font-bold text-acai-900 shadow-lg">
            {store.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold leading-tight">{store.name}</h1>
            <p className="text-sm text-acai-100">{store.tagline}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
              open ? 'bg-emerald-400 text-emerald-950' : 'bg-white/15 text-white'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${open ? 'bg-emerald-950' : 'bg-red-300'}`} />
            {open ? 'Aberto agora' : 'Fechado agora'}
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">Hoje: {todayHours(store.hours)}</span>
          <span className="rounded-full bg-white/15 px-3 py-1.5">Entrega {formatPrice(store.deliveryFee)}</span>
        </div>

        <p className="mt-3 text-xs text-acai-100">{store.address}</p>
      </div>
    </header>
  )
}
