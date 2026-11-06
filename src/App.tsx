import { useEffect, useMemo, useRef, useState } from 'react'
import data from './data/menu.json'
import type { CartLine, Category, Complements, Product, StoreConfig } from './types'
import { Header } from './components/Header'
import { CategoryTabs } from './components/CategoryTabs'
import { ProductCard } from './components/ProductCard'
import { Cart } from './components/Cart'
import { AcaiBuilder } from './components/AcaiBuilder'
import { Helper, type HelperStage } from './components/Helper'
import { observeReveal } from './animations'
import { lineKey, resolveCart } from './utils'

const store = data.store as StoreConfig
const complements = data.complements as Complements
const categories = data.categories as Category[]
const products = data.products as Product[]
const CART_KEY = 'cardapio-cart-v2'

function loadCart(): CartLine[] {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export default function App() {
  const [lines, setLines] = useState<CartLine[]>(loadCart)
  const [active, setActive] = useState(categories[0].id)
  const [search, setSearch] = useState('')
  const [building, setBuilding] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [helperStage, setHelperStage] = useState<HelperStage>('welcome')
  const sections = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(lines))
    } catch {
      /* navegador sem armazenamento: a sacola só não fica salva */
    }
  }, [lines])

  // anima os cards quando entram na tela
  useEffect(() => observeReveal(), [search])

  // destaca a categoria visível enquanto a pessoa rola a página
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-140px 0px -60% 0px' },
    )
    Object.values(sections.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [search])

  const addLine = (productId: string, free: string[] = [], extras: string[] = [], quantity = 1) => {
    const key = lineKey(productId, free, extras)
    setLines((cur) =>
      cur.some((l) => l.key === key)
        ? cur.map((l) => (l.key === key ? { ...l, quantity: l.quantity + quantity } : l))
        : [...cur, { key, productId, free, extras, quantity }],
    )
    setHelperStage('added')
  }

  const changeLine = (key: string, delta: number) =>
    setLines((cur) =>
      cur.map((l) => (l.key === key ? { ...l, quantity: l.quantity + delta } : l)).filter((l) => l.quantity > 0),
    )

  const items = useMemo(() => resolveCart(lines, products, complements), [lines])
  const countOf = (productId: string) =>
    lines.filter((l) => l.productId === productId).reduce((n, l) => n + l.quantity, 0)

  const openBuilder = (p: Product) => {
    setBuilding(p)
    setHelperStage('builder')
  }
  const openCart = (open: boolean) => {
    setCartOpen(open)
    if (open) setHelperStage('cart')
  }

  const term = search.trim().toLowerCase()
  const filtered = term
    ? products.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(term))
    : products

  const goTo = (id: string) => {
    setSearch('')
    setActive(id)
    requestAnimationFrame(() => {
      const el = sections.current[id]
      if (el) window.scrollTo({ top: el.offsetTop - 130, behavior: 'smooth' })
    })
  }

  return (
    <div className="min-h-screen pb-28">
      <Header store={store} />
      <CategoryTabs categories={categories} active={active} onSelect={goTo} search={search} onSearch={setSearch} />

      <main className="mx-auto max-w-3xl px-4">
        {categories.map((cat) => {
          const list = filtered.filter((p) => p.categoryId === cat.id)
          if (list.length === 0) return null
          return (
            <section key={cat.id} id={cat.id} ref={(el) => { sections.current[cat.id] = el }} className="pt-6">
              <h2 className="mb-3 font-display text-2xl font-bold text-acai-900">{cat.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {list.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    quantity={countOf(p.id)}
                    onAdd={() => addLine(p.id)}
                    onRemove={() => changeLine(lineKey(p.id), -1)}
                    onCustomize={() => openBuilder(p)}
                  />
                ))}
              </div>
            </section>
          )
        })}

        {filtered.length === 0 && (
          <p className="py-16 text-center text-ink/60">Nada encontrado para “{search}”.</p>
        )}

        <footer className="mt-12 border-t border-acai-100 py-6 text-center text-xs text-ink/50">
          Cardápio digital de demonstração · dados fictícios
        </footer>
      </main>

      <Cart
        store={store}
        items={items}
        open={cartOpen}
        onOpenChange={openCart}
        onChange={changeLine}
        onClear={() => setLines([])}
        onSent={() => setHelperStage('sent')}
      />

      {building && (
        <AcaiBuilder
          product={building}
          complements={complements}
          onClose={() => setBuilding(null)}
          onConfirm={(free, extras, quantity) => {
            addLine(building.id, free, extras, quantity)
            setBuilding(null)
          }}
        />
      )}

      <Helper stage={helperStage} overlay={Boolean(building) || cartOpen} cartBar={lines.length > 0} />
    </div>
  )
}
