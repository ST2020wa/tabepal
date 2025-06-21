import { useState } from 'react'
import { useSwipeable } from 'react-swipeable'

interface Item {
  id?: number
  userId: number
  name?: string
  createdAt?: Date
  quantity?: number
  expiredDate?: Date
  tag?: string
}

interface SwipeableItemProps {
  item: Item
  onDelete: (itemId: number) => Promise<void>
  onEdit: (itemId: number, newName: string) => Promise<void>
}

export function SwipeableItem({ item, onDelete, onEdit }: SwipeableItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(item.name || '')
    
  const handlers = useSwipeable({
    onSwipedLeft: async () => {
      await onDelete(item.id!)
    },
    onTap: () => {
        setIsEditing(true)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editValue.trim()) {
      await onEdit(item.id!, editValue.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(item.name || '')
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div {...handlers} className="cursor-pointer hover:line-through hover:font-bold hover:text-red-500 transition-all duration-200">
            {isEditing ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            autoFocus
          />
          {/* TODO: 删掉按钮，用鼠标/点击事件去处理保存/取消 */}
          <button
            type="submit"
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            保存
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            取消
          </button>
        </form>
      ) : (
        <h2 className="text-lg font-medium">{item.name}</h2>
      )}
    </div>
  )
}