import { useState, useRef } from 'react'
import { SwipeableItem } from './SwipeableItem'
import { useTranslation } from 'react-i18next'

export interface SwipeableListItem {
  id?: number
  userId: number
  name?: string
  createdAt?: Date
  quantity?: number
  expiredDate?: Date
  tag?: string
  [key: string]: any
}

interface SwipeableListProps {
  items: SwipeableListItem[]
  onAdd: (name: string, additionalData?: any) => Promise<SwipeableListItem | null>
  onDelete: (itemId: number) => Promise<boolean>
  onEdit: (itemId: number, name: string, additionalData?: any) => Promise<SwipeableListItem | null>
  hasExpiredDate?: boolean
  emptyStateText?: string
  emptyStateSubtitle?: string
  addButtonText?: string
  addPlaceholder?: string
  className?: string
}

export function SwipeableList({
  items,
  onAdd,
  onDelete,
  onEdit,
  hasExpiredDate = false,
  emptyStateText,
  emptyStateSubtitle,
  addButtonText,
  addPlaceholder,
  className = ""
}: SwipeableListProps) {
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [inputExpiryDate, setInputExpiryDate] = useState<string>('')
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const expiryInputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const handleBlur = async () => {
    if (!showInput) {
      setShowInput(true)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    } else if (inputValue) {
      const additionalData = hasExpiredDate ? { expiredDate: inputExpiryDate ? new Date(inputExpiryDate) : undefined } : {}
      const newItem = await onAdd(inputValue, additionalData)
      if (newItem) {
        setInputValue('')
        setInputExpiryDate('')
        setShowInput(false)
      }
    } else {
      setShowInput(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleBlur()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setInputValue('')
      setInputExpiryDate('')
      setShowInput(false)
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    await onDelete(itemId)
  }

  const handleEditItem = async (itemId: number, newName: string, newExpiredDate: string) => {
    const additionalData = hasExpiredDate ? { expiredDate: newExpiredDate ? new Date(newExpiredDate) : undefined } : {}
    await onEdit(itemId, newName, additionalData)
  }

  const handleEditingChange = (itemId: number, isEditing: boolean) => {
    setEditingItemId(isEditing ? itemId : null)
  }

  return (
    <div className={`h-[calc(100vh-12rem)] overflow-y-auto bg-white/90 dark:bg-gray-900/80 p-2 sm:p-4 md:p-6 rounded-2xl shadow-xl backdrop-blur-sm ${className}`}>
      <main className='space-y-2 sm:space-y-3 max-w-md mx-auto'>
        {items.length === 0 && !showInput && (
          <div className="text-center py-12 animate-slide-in">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {emptyStateText || t('common.emptyState')}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {emptyStateSubtitle || t('common.emptyStateSubtitle')}
            </p>
          </div>
        )}
        
        {items.map((item) => (
          <SwipeableItem 
            key={item.id} 
            item={item} 
            hasExpiredDate={hasExpiredDate}
            onDelete={handleDeleteItem} 
            onEdit={handleEditItem}
            isEditing={editingItemId === item.id}
            onEditingChange={(isEditing) => handleEditingChange(item.id!, isEditing)}
          />
        ))}
        
        {showInput && (
          <div className="flex bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-slide-in">
            <input 
              ref={inputRef}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white' 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur} 
              onKeyDown={handleKeyDown}
              placeholder={addPlaceholder || t('common.addNewItem')}
            />
            {hasExpiredDate && (
              <input
                ref={expiryInputRef}
                type="date"
                value={inputExpiryDate}
                onChange={(e) => setInputExpiryDate(e.target.value)}
                onKeyDown={handleKeyDown}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}
          </div>
        )}
      </main>
      <footer className='mt-6 flex justify-center'>
        <button 
          onClick={() => setShowInput(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          {addButtonText || t('common.addItem')}
        </button>
      </footer>
    </div>
  )
}