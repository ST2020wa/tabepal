export interface ShoplistItem {
    id?: number
    userId: number
    name?: string
    createdAt?: Date
    quantity?: number
    tag?: string
  }

  export function ShoplistItem() {
    return (
      <div>
        <h1 className="text-white">shoplistitem placeholder</h1>
      </div>
    )
  }