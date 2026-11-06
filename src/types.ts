export type Product = {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  /** URL da foto. Se ficar vazio, aparece um placeholder colorido. */
  image?: string
  tag?: 'Mais pedido' | 'Novidade' | 'Promoção'
}

export type Category = {
  id: string
  name: string
}

export type OpeningHours = {
  /** 0 = domingo, 6 = sábado */
  days: number[]
  open: string // "17:00"
  close: string // "23:30"
}

export type StoreConfig = {
  name: string
  tagline: string
  /** Número com DDI e DDD, só dígitos. Ex.: 5584999999999 */
  whatsapp: string
  address: string
  hours: OpeningHours[]
  deliveryFee: number
  minOrder: number
  paymentMethods: string[]
}

export type CartItem = {
  product: Product
  quantity: number
}

export type CheckoutInfo = {
  name: string
  mode: 'entrega' | 'retirada'
  address: string
  payment: string
  change: string
  notes: string
}
