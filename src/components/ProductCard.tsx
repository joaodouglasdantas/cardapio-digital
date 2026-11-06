import type { ReactNode } from 'react'
import type { Product } from '../types'
import { formatPrice } from '../utils'

const palettes: Record<string, string> = {
  acai: 'from-acai-800 to-acai-700',
  lanches: 'from-amber-600 to-sol-400',
  porcoes: 'from-orange-700 to-amber-500',
  bebidas: 'from-emerald-700 to-teal-500',
}

/** Ícones simples por categoria, usados enquanto o produto não tem foto. */
const icons: Record<string, ReactNode> = {
  acai: (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 22h32l-3 16a4 4 0 0 1-4 3H15a4 4 0 0 1-4-3L8 22Z" />
      <circle cx="17" cy="16" r="4" /><circle cx="25" cy="13" r="4" /><circle cx="32" cy="17" r="3.5" />
    </svg>
  ),
  lanches: (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20a16 9 0 0 1 32 0Z" /><path d="M7 26h34" /><path d="M9 31h30l-2 5H11l-2-5Z" />
    </svg>
  ),
  porcoes: (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22h24l-3 18H15l-3-18Z" /><path d="M16 22 14 8M22 22l-1-14M28 22l1-13M33 22l3-12" />
    </svg>
  ),
  bebidas: (
    <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 14h22l-3 26H16l-3-26Z" /><path d="M14 22h20" /><path d="M27 14l4-8h5" />
    </svg>
  ),
}

function Placeholder({ product }: { product: Product }) {
  return (
    <div
      className={`relative grid h-full w-full place-items-center overflow-hidden bg-gradient-to-br ${
        palettes[product.categoryId] ?? 'from-acai-800 to-acai-700'
      }`}
    >
      <span aria-hidden className="absolute -right-3 -top-3 h-10 w-10 rounded-full bg-white/15" />
      <span aria-hidden className="absolute -bottom-4 left-2 h-12 w-12 rounded-full bg-black/10" />
      <span className="relative text-white/90">{icons[product.categoryId] ?? icons.acai}</span>
    </div>
  )
}

type Props = {
  product: Product
  quantity: number
  onAdd: () => void
  onRemove: () => void
}

export function ProductCard({ product, quantity, onAdd, onRemove }: Props) {
  return (
    <article className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-acai-100/70">
      <div className="min-w-0 flex-1">
        {product.tag && (
          <span className="mb-1 inline-block rounded-full bg-sol-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
            {product.tag}
          </span>
        )}
        <h3 className="font-semibold leading-snug">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink/60">{product.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-bold text-acai-800">{formatPrice(product.price)}</span>
          {quantity === 0 ? (
            <button
              onClick={onAdd}
              className="rounded-full bg-acai-800 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-acai-700 active:scale-95"
            >
              Adicionar
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full bg-acai-50 p-1 ring-1 ring-acai-100">
              <button
                onClick={onRemove}
                aria-label={`Remover um ${product.name}`}
                className="grid h-7 w-7 place-items-center rounded-full bg-white font-bold text-acai-800 shadow-sm active:scale-90"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-bold">{quantity}</span>
              <button
                onClick={onAdd}
                aria-label={`Adicionar mais um ${product.name}`}
                className="grid h-7 w-7 place-items-center rounded-full bg-acai-800 font-bold text-white shadow-sm active:scale-90"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        {product.image ? (
          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <Placeholder product={product} />
        )}
      </div>
    </article>
  )
}
