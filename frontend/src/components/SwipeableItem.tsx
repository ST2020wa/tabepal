import { useEffect, useRef, useState } from 'react'
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
  isEditing: boolean
}

export function SwipeableItem({ item, onDelete, onEdit }: SwipeableItemProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(item.name || '')
    const inputRef = useRef<HTMLInputElement>(null)
    
  const handlers = useSwipeable({
    onSwipedLeft: async () => {
      await onDelete(item.id!)
    },
    onTap: () => {
        setIsEditing(true)
    }
  })

  const handleSave = async () => {
    if (editValue.trim()) {
      await onEdit(item.id!, editValue.trim())
      setIsEditing(false)
    }
  }

  const handleBlur = () => {
    handleSave()
  }

  const handleCancel = () => {
    setEditValue(item.name || '')
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditing && inputRef.current && !inputRef.current.contains(event.target as Node)) {
        handleSave()
      }
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditing])

  return (
    <div {...handlers} className="cursor-pointer hover:line-through hover:font-bold hover:text-red-500 transition-all duration-200">
            {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      ) : (
        <h2 className="text-lg font-medium">{item.name}</h2>
      )}
    </div>
  )
}