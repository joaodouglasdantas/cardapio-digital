import { useState, type MouseEvent } from 'react'
import type { Complements, Product } from '../types'
import { formatPrice } from '../utils'
import { flyToCart } from '../animations'
import { Placeholder } from './ProductCard'

type Props = {
  product: Product
  complements: Complements
  onClose: () => void
  onConfirm: (free: string[], extras: string[], quantity: number) => void
}

/** Tela para montar o açaí: complementos grátis + adicionais pagos. */
export function AcaiBuilder({ product, complements, onClose, onConfirm }: Props) {
  const limit = product.customize?.free ?? 0
  const [free, setFree] = useState<string[]>([])
  const [extras, setExtras] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  const toggleFree = (name: string) =>
    setFree((cur) => (cur.includes(name) ? cur.filter((n) => n !== name) : cur.length < limit ? [...cur, name] : cur))
  const toggleExtra = (id: string) =>
    setExtras((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]))

  const extrasTotal = extras.reduce((s, id) => s + (complements.extras.find((e) => e.id === id)?.price ?? 0), 0)
  const total = (product.price + extrasTotal) * quantity
  const full = free.length >= limit

  const confirm = (e: MouseEvent<HTMLButtonElement>) => {
    flyToCart(e.currentTarget, product.image)
    onConfirm(free, extras, quantity)
  }

  const chip = (selected: boolean, disabled = false) =>
    `rounded-full px-3.5 py-2 text-sm font-medium transition active:scale-95 ${
      selected
        ? 'bg-acai-800 text-white shadow-md'
        : disabled
          ? 'bg-white text-ink/30 ring-1 ring-acai-100'
          : 'bg-white text-acai-900 ring-1 ring-acai-100 hover:bg-acai-50'
    }`

  return (
    <div className="anim-fade fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-label={`Montar ${product.name}`}
        onClick={(e) => e.stopPropagation()}
        className="anim-sheet flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-cream sm:rounded-3xl"
      >
        <div className="relative h-40 shrink-0 overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full scale-110 object-cover blur-[1px]" />
          ) : (
            <Placeholder product={product} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-acai-950/90 via-acai-950/30 to-transparent" />
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg font-bold text-acai-900 shadow"
          >
            ×
          </button>
          <div className="absolute bottom-3 left-5 right-5 text-white">
            <h2 className="font-display text-2xl font-bold">Monte seu {product.name}</h2>
            <p className="text-sm text-acai-100">{formatPrice(product.price)} · {limit > 0 ? `${limit} complementos grátis` : 'turbine com adicionais'}</p>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {limit > 0 && (
            <section>
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="font-semibold">Complementos grátis</h3>
                <span key={free.length} className={`anim-bump rounded-full px-2.5 py-0.5 text-xs font-bold ${full ? 'bg-emerald-100 text-emerald-800' : 'bg-acai-100 text-acai-800'}`}>
                  {free.length}/{limit}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {complements.free.map((name) => {
                  const selected = free.includes(name)
                  return (
                    <button key={name} onClick={() => toggleFree(name)} disabled={!selected && full} className={chip(selected, !selected && full)}>
                      {selected && '✓ '}
                      {name}
                    </button>
                  )
                })}
              </div>
              {full && <p className="anim-up mt-2 text-xs text-emerald-800">Pronto! Quer mais? Use os adicionais abaixo.</p>}
            </section>
          )}

          <section>
            <h3 className="mb-3 font-semibold">Adicionais</h3>
            <div className="grid grid-cols-2 gap-2">
              {complements.extras.map((x) => {
                const selected = extras.includes(x.id)
                return (
                  <button
                    key={x.id}
                    onClick={() => toggleExtra(x.id)}
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-sm transition active:scale-95 ${
                      selected ? 'bg-sol-100 ring-2 ring-sol-400' : 'bg-white ring-1 ring-acai-100'
                    }`}
                  >
                    <span className="font-medium">{x.name}</span>
                    <span className="text-xs font-semibold text-acai-800">+{formatPrice(x.price)}</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <div className="flex items-center gap-3 border-t border-acai-100 bg-white px-5 py-4">
          <div className="flex items-center gap-1 rounded-full bg-acai-50 p-1 ring-1 ring-acai-100">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Diminuir" className="grid h-8 w-8 place-items-center rounded-full bg-white font-bold text-acai-800 shadow-sm">−</button>
            <span key={quantity} className="anim-bump w-6 text-center font-bold">{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar" className="grid h-8 w-8 place-items-center rounded-full bg-acai-800 font-bold text-white shadow-sm">+</button>
          </div>
          <button
            onClick={confirm}
            className="flex flex-1 items-center justify-between rounded-2xl bg-acai-800 px-5 py-3.5 font-bold text-white shadow-lg transition hover:bg-acai-700 active:scale-[0.98]"
          >
            <span>Adicionar</span>
            <span>{formatPrice(total)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
