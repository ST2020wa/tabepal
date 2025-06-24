import { useEffect, useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import type { Item } from './Inventory'

interface SwipeableItemProps {
  item: Item
  onDelete: (itemId: number) => Promise<void>
  onEdit: (itemId: number, newName: string) => Promise<void>
  isEditing: boolean
  onEditingChange: (isEditing: boolean) => void
}

export function SwipeableItem({ item, onDelete, onEdit, isEditing, onEditingChange }: SwipeableItemProps) {
  const [internalIsEditing, setInternalIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.name || '')
  const inputRef = useRef<HTMLInputElement>(null)

  const isCurrentlyEditing = isEditing || internalIsEditing
    
  const handlers = useSwipeable({
    onSwipedLeft: async () => {
      await onDelete(item.id!)
    },
    onTap: () => {
      if (!isCurrentlyEditing) {
        setInternalIsEditing(true)
        onEditingChange(true)
      }
  }
  })

  const handleSave = async () => {
    if (editValue.trim()) {
      await onEdit(item.id!, editValue.trim())
      setInternalIsEditing(false)
      onEditingChange(false)
    }
  }

  const handleBlur = () => {
    handleSave()
  }

  const handleCancel = () => {
    setEditValue(item.name || '')
    setInternalIsEditing(false)
    onEditingChange(false)
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
      if (isCurrentlyEditing && inputRef.current && !inputRef.current.contains(event.target as Node)) {
        handleSave()
      }
    }

    if (isCurrentlyEditing) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCurrentlyEditing])

  return (
    <div {...handlers} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer animate-slide-in">
      {isCurrentlyEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ) : (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800">{item.name}</h2>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  )
}