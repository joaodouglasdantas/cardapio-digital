import type { CartItem, CartLine, CheckoutInfo, Complements, OpeningHours, Product, StoreConfig } from './types'

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

/** Mesma combinação de produto + complementos = mesma linha na sacola. */
export const lineKey = (productId: string, free: string[] = [], extras: string[] = []) =>
  [productId, [...free].sort().join('+'), [...extras].sort().join('+')].join('|')

/** Junta as linhas guardadas com os dados do cardápio (produto, preços). */
export function resolveCart(lines: CartLine[], products: Product[], complements: Complements): CartItem[] {
  return lines.flatMap((line) => {
    const product = products.find((p) => p.id === line.productId)
    if (!product) return []
    const extras = line.extras
      .map((id) => complements.extras.find((e) => e.id === id))
      .filter((e) => e !== undefined)
    const unitPrice = product.price + extras.reduce((s, e) => s + e.price, 0)
    return [{ key: line.key, product, quantity: line.quantity, free: line.free, extras, unitPrice }]
  })
}

export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

/** Texto curto com as escolhas de uma linha (ex.: "Granola, Banana · + Nutella"). */
export function describeChoices(item: Pick<CartItem, 'free' | 'extras'>) {
  const parts = []
  if (item.free.length) parts.push(item.free.join(', '))
  if (item.extras.length) parts.push('+ ' + item.extras.map((e) => e.name).join(', '))
  return parts.join(' · ')
}

/** Monta o texto do pedido e devolve o link do WhatsApp. */
export function buildWhatsAppLink(store: StoreConfig, items: CartItem[], info: CheckoutInfo) {
  const subtotal = cartSubtotal(items)
  const fee = info.mode === 'entrega' ? store.deliveryFee : 0
  const itemLines = items.flatMap((i) => [
    `${i.quantity}x ${i.product.name} · ${formatPrice(i.unitPrice * i.quantity)}`,
    i.free.length ? `   Complementos: ${i.free.join(', ')}` : null,
    i.extras.length
      ? `   Adicionais: ${i.extras.map((e) => `${e.name} (+${formatPrice(e.price)})`).join(', ')}`
      : null,
  ])
  const lines = [
    `*Novo pedido · ${store.name}*`,
    '',
    ...itemLines,
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
