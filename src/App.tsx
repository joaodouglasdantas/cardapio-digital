import { useEffect, useMemo, useRef, useState } from 'react'
import data from './data/menu.json'
import type { CartItem, Category, Product, StoreConfig } from './types'
import { Header } from './components/Header'
import { CategoryTabs } from './components/CategoryTabs'
import { ProductCard } from './components/ProductCard'
import { Cart } from './components/Cart'

const store = data.store as StoreConfig
const categories = data.categories as Category[]
const products = data.products as Product[]
const CART_KEY = 'cardapio-cart'

function loadCart(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export default function App() {
  const [cart, setCart] = useState<Record<string, number>>(loadCart)
  const [active, setActive] = useState(categories[0].id)
  const [search, setSearch] = useState('')
  const sections = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch {
      /* navegador sem armazenamento: o carrinho só não fica salvo */
    }
  }, [cart])

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

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
  const remove = (id: string) =>
    setCart((c) => {
      const next = { ...c, [id]: (c[id] ?? 0) - 1 }
      if (next[id] <= 0) delete next[id]
      return next
    })

  const items: CartItem[] = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => ({ product: products.find((p) => p.id === id)!, quantity }))
        .filter((i) => i.product),
    [cart],
  )

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
                {list.map((p) => (
                  <ProductCard key={p.id} product={p} quantity={cart[p.id] ?? 0} onAdd={() => add(p.id)} onRemove={() => remove(p.id)} />
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

      <Cart store={store} items={items} onAdd={add} onRemove={remove} onClear={() => setCart({})} />
    </div>
  )
}
