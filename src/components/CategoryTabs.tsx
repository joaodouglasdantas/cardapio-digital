import type { Category } from '../types'

type Props = {
  categories: Category[]
  active: string
  onSelect: (id: string) => void
  search: string
  onSearch: (value: string) => void
}

export function CategoryTabs({ categories, active, onSelect, search, onSearch }: Props) {
  return (
    <nav className="sticky top-0 z-20 border-b border-acai-100 bg-cream/95 backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 pt-3">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar no cardápio..."
          className="w-full rounded-xl border border-acai-100 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-acai-700 focus:ring-2 focus:ring-acai-100"
        />
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === c.id
                  ? 'bg-acai-800 text-white shadow'
                  : 'bg-white text-acai-900 ring-1 ring-acai-100 hover:bg-acai-50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
