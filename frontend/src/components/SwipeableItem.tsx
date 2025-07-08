import { useEffect, useRef, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ExpiryIndicator } from './ExpiryIndicator'
import type { Item } from './Inventory'

interface SwipeableItemProps {
  item: Item
  onDelete: (itemId: number) => Promise<void>
  onEdit: (itemId: number, newName: string, newExpiredDate: string) => Promise<void>
  isEditing: boolean
  onEditingChange: (isEditing: boolean) => void
  hasExpiredDate?: boolean 
}

export function SwipeableItem({ item, onDelete, onEdit, isEditing, onEditingChange, hasExpiredDate }: SwipeableItemProps) {
  const [internalIsEditing, setInternalIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.name || '')
  const [inputExpiryDate, setInputExpiryDate] = useState<string>('')

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
      await onEdit(item.id!, editValue.trim(), inputExpiryDate)
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

  const handleDateInputClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDateInputTouch = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDateInputMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
  }, [handleSave, isCurrentlyEditing])

  return (
    <div {...handlers} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 cursor-pointer animate-slide-in">
      {isCurrentlyEditing ? (
        <div className='flex items-center space-x-2'>
          <input 
            ref={inputRef} 
            type="text" 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)} 
            onBlur={handleBlur} 
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {hasExpiredDate && (
            <input
              type="date"
              value={inputExpiryDate}
              onChange={(e) => setInputExpiryDate(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={handleDateInputClick}
              onTouchStart={handleDateInputTouch}
              onMouseDown={handleDateInputMouseDown}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">{item.name}</h2>
          {hasExpiredDate && (
            <div className="flex space-x-2">
              <ExpiryIndicator expiredDate={item.expiredDate} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}