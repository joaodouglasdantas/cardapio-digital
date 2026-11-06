import { useState } from 'react'
import type { CartItem, CheckoutInfo, StoreConfig } from '../types'
import { buildWhatsAppLink, cartSubtotal, describeChoices, formatPrice } from '../utils'

type Props = {
  store: StoreConfig
  items: CartItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (key: string, delta: number) => void
  onClear: () => void
  onSent: () => void
}

const emptyInfo = (payment: string): CheckoutInfo => ({
  name: '',
  mode: 'entrega',
  address: '',
  payment,
  change: '',
  notes: '',
})

export function Cart({ store, items, open, onOpenChange: setOpen, onChange, onClear, onSent }: Props) {
  const [info, setInfo] = useState<CheckoutInfo>(emptyInfo(store.paymentMethods[0]))

  const count = items.reduce((n, i) => n + i.quantity, 0)
  const subtotal = cartSubtotal(items)
  const fee = info.mode === 'entrega' ? store.deliveryFee : 0
  const belowMin = subtotal < store.minOrder
  const missing =
    !info.name.trim() ? 'Informe seu nome' : info.mode === 'entrega' && !info.address.trim() ? 'Informe o endereço' : null

  const set = <K extends keyof CheckoutInfo>(key: K, value: CheckoutInfo[K]) =>
    setInfo((prev) => ({ ...prev, [key]: value }))

  if (count === 0) return null

  const input =
    'w-full rounded-xl border border-acai-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-acai-700 focus:ring-2 focus:ring-acai-100'

  return (
    <>
      {/* barra flutuante */}
      <div className="anim-slide-up fixed inset-x-0 bottom-0 z-30 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => setOpen(true)}
          className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-2xl bg-acai-900 px-5 py-4 text-white shadow-2xl transition active:scale-[0.98]"
        >
          <span className="flex items-center gap-3">
            <span data-cart-badge key={count} className="anim-bump grid h-7 min-w-7 place-items-center rounded-full bg-sol-400 px-2 text-sm font-bold text-acai-950">
              {count}
            </span>
            <span className="font-semibold">Ver sacola</span>
          </span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </button>
      </div>

      {/* gaveta */}
      {open && (
        <div className="anim-fade fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-label="Sua sacola"
            onClick={(e) => e.stopPropagation()}
            className="anim-sheet flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-cream sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-acai-100 px-5 py-4">
              <h2 className="font-display text-xl font-bold text-acai-900">Sua sacola</h2>
              <button onClick={() => setOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-acai-800 hover:bg-acai-50">
                Fechar
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.key} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.product.name}</p>
                      {(item.free.length > 0 || item.extras.length > 0) && (
                        <p className="text-xs leading-snug text-ink/60">{describeChoices(item)}</p>
                      )}
                      <p className="text-sm font-semibold text-acai-800">{formatPrice(item.unitPrice * item.quantity)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-white p-1 ring-1 ring-acai-100">
                      <button onClick={() => onChange(item.key, -1)} aria-label={`Remover um ${item.product.name}`} className="grid h-7 w-7 place-items-center rounded-full font-bold text-acai-800">−</button>
                      <span key={item.quantity} className="anim-bump w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => onChange(item.key, 1)} aria-label={`Adicionar mais um ${item.product.name}`} className="grid h-7 w-7 place-items-center rounded-full bg-acai-800 font-bold text-white">+</button>
                    </div>
                  </li>
                ))}
              </ul>
              <button onClick={onClear} className="text-sm font-medium text-red-700 underline-offset-2 hover:underline">
                Esvaziar sacola
              </button>

              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-acai-50 p-1">
                {(['entrega', 'retirada'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => set('mode', m)}
                    className={`rounded-xl py-2 text-sm font-semibold capitalize transition ${
                      info.mode === m ? 'bg-white text-acai-900 shadow' : 'text-acai-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <input className={input} placeholder="Seu nome" value={info.name} onChange={(e) => set('name', e.target.value)} />
                {info.mode === 'entrega' && (
                  <input className={input} placeholder="Endereço completo (rua, número, bairro)" value={info.address} onChange={(e) => set('address', e.target.value)} />
                )}
                <select className={input} value={info.payment} onChange={(e) => set('payment', e.target.value)}>
                  {store.paymentMethods.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                {info.payment === 'Dinheiro' && (
                  <input className={input} placeholder="Troco para quanto? (opcional)" value={info.change} onChange={(e) => set('change', e.target.value)} />
                )}
                <textarea className={input} rows={2} placeholder="Observações (ex.: sem cebola, troco, ponto de referência)" value={info.notes} onChange={(e) => set('notes', e.target.value)} />
              </div>
            </div>

            <div className="space-y-1 border-t border-acai-100 bg-white px-5 py-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>{info.mode === 'entrega' ? 'Entrega' : 'Retirada'}</span><span>{fee ? formatPrice(fee) : 'Grátis'}</span></div>
              <div className="flex justify-between pt-1 text-base font-bold"><span>Total</span><span>{formatPrice(subtotal + fee)}</span></div>

              {belowMin && (
                <p className="pt-2 text-center text-xs text-amber-800">Pedido mínimo de {formatPrice(store.minOrder)}</p>
              )}
              <a
                href={belowMin || missing ? undefined : buildWhatsAppLink(store, items, info)}
                target="_blank"
                rel="noreferrer"
                onClick={onSent}
                aria-disabled={Boolean(belowMin || missing)}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-bold transition ${
                  belowMin || missing
                    ? 'pointer-events-none bg-gray-200 text-gray-500'
                    : 'bg-[#25D366] text-white shadow-lg hover:brightness-95 active:scale-[0.98]'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3Z" />
                </svg>
                {missing ?? 'Enviar pedido pelo WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
