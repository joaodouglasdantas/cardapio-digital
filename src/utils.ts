import type { CartItem, CheckoutInfo, OpeningHours, StoreConfig } from './types'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
export const formatPrice = (value: number) => brl.format(value)

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

/** Diz se a loja está aberta agora, com base nos horários configurados. */
export function isOpenNow(hours: OpeningHours[], now = new Date()) {
  const day = now.getDay()
  const minutes = now.getHours() * 60 + now.getMinutes()
  return hours.some(
    (h) => h.days.includes(day) && minutes >= toMinutes(h.open) && minutes <= toMinutes(h.close),
  )
}

export function todayHours(hours: OpeningHours[], now = new Date()) {
  const h = hours.find((x) => x.days.includes(now.getDay()))
  return h ? `${h.open} às ${h.close}` : 'Fechado hoje'
}

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

/** Monta o texto do pedido e devolve o link do WhatsApp. */
export function buildWhatsAppLink(store: StoreConfig, items: CartItem[], info: CheckoutInfo) {
  const subtotal = cartSubtotal(items)
  const fee = info.mode === 'entrega' ? store.deliveryFee : 0
  const lines = [
    `*Novo pedido · ${store.name}*`,
    '',
    ...items.map((i) => `${i.quantity}x ${i.product.name} · ${formatPrice(i.product.price * i.quantity)}`),
    '',
    `Subtotal: ${formatPrice(subtotal)}`,
    info.mode === 'entrega' ? `Entrega: ${formatPrice(fee)}` : 'Retirada no local',
    `*Total: ${formatPrice(subtotal + fee)}*`,
    '',
    `Nome: ${info.name}`,
    info.mode === 'entrega' ? `Endereço: ${info.address}` : null,
    `Pagamento: ${info.payment}${info.change ? ` (troco para ${info.change})` : ''}`,
    info.notes ? `Observações: ${info.notes}` : null,
  ].filter((l) => l !== null)

  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
}
