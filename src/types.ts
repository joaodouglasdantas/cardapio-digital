export type Product = {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  /** URL da foto. Se ficar vazio, aparece um ícone da categoria. */
  image?: string
  tag?: 'Mais pedido' | 'Novidade' | 'Promoção'
  /** Se existir, o produto abre o montador. `free` = quantos complementos grátis. */
  customize?: { free: number }
}

export type Category = {
  id: string
  name: string
}

export type Extra = {
  id: string
  name: string
  price: number
}

/** Complementos do montador de açaí. */
export type Complements = {
  free: string[]
  extras: Extra[]
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

/** Como a sacola é guardada (formato simples, salvo no navegador). */
export type CartLine = {
  key: string
  productId: string
  quantity: number
  free: string[]
  extras: string[] // ids dos adicionais
}

/** Linha da sacola já com produto e preços resolvidos. */
export type CartItem = {
  key: string
  product: Product
  quantity: number
  free: string[]
  extras: Extra[]
  unitPrice: number
}

export type CheckoutInfo = {
  name: string
  mode: 'entrega' | 'retirada'
  address: string
  payment: string
  change: string
  notes: string
}
