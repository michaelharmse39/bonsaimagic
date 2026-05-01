import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  slug: string
}

interface WishlistStore {
  items: WishlistItem[]
  count: number
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  hasItem: (id: string) => boolean
  clear: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      addItem: (item) => {
        if (get().hasItem(item.id)) return
        set((s) => ({ items: [...s.items, item], count: s.count + 1 }))
      },
      removeItem: (id) => set((s) => ({
        items: s.items.filter((i) => i.id !== id),
        count: s.count - 1,
      })),
      hasItem: (id) => get().items.some((i) => i.id === id),
      clear: () => set({ items: [], count: 0 }),
    }),
    { name: 'bm-wishlist' }
  )
)
