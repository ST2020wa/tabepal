import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { SwipeableItem } from './SwipeableItem'
import { useTranslation } from 'react-i18next'

export interface Item {
  id?: number
  userId: number
  name?: string
  createdAt?: Date
  quantity?: number
  expiredDate?: Date
  tag?: string
}

export function Inventory() {
  const { user } = useAuth()
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [inputExpiryDate, setInputExpiryDate] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<Item[]>([])
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [showExpiryInput, setShowExpiryInput] = useState(false)
  const expiryInputRef = useRef<HTMLInputElement>(null) // 新增
  const { t } = useTranslation()

  useEffect(()=>{
      const loadItems = async ()=>{
        setItems(await fetchItems());
      }      
      if(user){        
        loadItems();
      }
    }, [])

const fetchItems = async ()=>{
  try{
    if (!user) {
      console.log(t('errors.noUserFound'))
      return []
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      console.log(t('errors.noTokenFound'))
      return []
    }
    const response = await fetch(`http://localhost:4000/api/items?userId=${user.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch items')
    }
    const data = await response.json()
    return data    
  }catch (error){
    console.error("Error fetching items:", error)
    return []
  }
}

const addNewItem = async ()=>{
  try{
    const token = localStorage.getItem('token')
    if(!token){
      console.log(t('errors.noTokenFound'))
      return []
    }

    const response = await fetch(`http://localhost:4000/api/items`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: inputValue,
        expiredDate: inputExpiryDate ? new Date(inputExpiryDate) : undefined
      })
    })
      if(!response.ok){
        throw new Error('Failed to add item')
      }
      const newItem = await response.json()
      return newItem;
  }catch(error){
    console.error("Error adding item:", error)
    return []
  }
}

const deleteItem = async (itemId:number)=>{  
  try{
    const token = localStorage.getItem('token')
    if(!token){
      console.log(t('errors.noTokenFound'))
      return []
    }  
    const response = await fetch(`http://localhost:4000/api/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    if(!response.ok){
      throw new Error('Failed to delete item')
    }
    const data = await response.json()
    return data
  }catch(error){
    console.error("Error deleting item:", error)
    return []
  }
}

const handleDeleteItem = async (itemId:number)=>{
  const result = await deleteItem(itemId)
  if(result){
    setItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }
}

const handleBlur=async ()=>{
  console.log(showInput, inputValue)
  if(!showInput){        
    setShowInput(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }else if(inputValue){
    const newItem = await addNewItem();
    setItems(prevItems => [...prevItems, newItem]);
    setInputValue('');
    setShowInput(false);
  }else{
    setShowInput(false);
  }
}

const handleEditingChange = (itemId: number, isEditing: boolean) => {
  setEditingItemId(isEditing ? itemId : null)
}

const editItem = async (itemId:number, updatedData: Partial<Item>)=>{
  try{
    const token = localStorage.getItem('token')
    if(!token){
      console.log(t('errors.noTokenFound'))
      return null
    }
    const response = await fetch(`http://localhost:4000/api/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    })
    if(!response.ok){
      throw new Error('Failed to edit item')
    }
    const data = await response.json()
    return data
  }catch(error){
    console.error("Error editing item:", error)
    return []
  }
}

const handleEditItem = async (itemId:number, newItemName:string, newExpiredDate:string)=>{  
  const result = await editItem(itemId, {name: newItemName, expiredDate: newExpiredDate ? new Date(newExpiredDate) : undefined})
  if(result){
    setItems(prevItems => prevItems.map(item => item.id === itemId ? result : item))
  }
}

const handleNameBlur = async () => {
  if (!showInput) {
    setShowInput(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  } else if (inputValue && !showExpiryInput) {
    // 如果只输入了名称且没有展开日期输入，直接保存
    const newItem = await addNewItem()
    setItems(prevItems => [...prevItems, newItem])
    setInputValue('')
    setInputExpiryDate('')
    setShowExpiryInput(false)
    setShowInput(false)
  }
}


const handleExpiryBlur = async (e: React.FocusEvent) => {
  // 检查是否点击了日期选择器
  const relatedTarget = e.relatedTarget as HTMLElement
  if (relatedTarget && relatedTarget.type === 'date') {
    return // 如果点击的是日期选择器，不触发保存
  }
  
  if (inputValue) {
    const newItem = await addNewItem()
    setItems(prevItems => [...prevItems, newItem])
    setInputValue('')
    setInputExpiryDate('')
    setShowExpiryInput(false)
    setShowInput(false)
  }
}

const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    if (showExpiryInput) {
      expiryInputRef.current?.blur() // 触发日期输入的 blur
    } else {
      handleNameBlur() // 触发名称输入的 blur
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    setInputValue('')
    setInputExpiryDate('')
    setShowExpiryInput(false)
    setShowInput(false)
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

    return (
      <div className="h-[calc(100vh-12rem)] overflow-y-auto bg-white/90 dark:bg-gray-900/60 p-2 sm:p-4 md:p-6 rounded-2xl shadow-xl backdrop-blur-sm">
        <main className='space-y-2 sm:space-y-3 max-w-md mx-auto'>
          {/* 空状态显示 */}
          {items.length === 0 && !showInput && (
            <div className="text-center py-12 animate-slide-in">
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t('storage.emptyState')}</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">{t('storage.emptyStateSubtitle')}</p>
            </div>
          )}
          
          {/* 项目列表 */}
          {items.map((item, id) => (
            <SwipeableItem 
              key={id} 
              item={item} 
              hasExpiredDate={true}
              onDelete={handleDeleteItem} 
              onEdit={handleEditItem}
              isEditing={editingItemId === item.id}
              onEditingChange={(isEditing) => handleEditingChange(item.id!, isEditing)}
            />
          ))}
          
          {/* 添加输入框 */}
          {showInput && (
            <div className="flex bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-slide-in">
              <input 
                ref={inputRef}
                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white' 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleBlur} 
                placeholder={t('storage.addNewItem')}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={inputExpiryDate}
                  onChange={(e) => setInputExpiryDate(e.target.value)}
                  onBlur={handleExpiryBlur}
                  onKeyDown={handleKeyDown}
                  onClick={handleDateInputClick}
                  onTouchStart={handleDateInputTouch}
                  onMouseDown={handleDateInputMouseDown}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}
        </main>
        <footer className='mt-6 flex justify-center'>
          <button 
            onClick={() => setShowInput(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            {t('storage.addItem')}
          </button>
        </footer>
      </div>
    )
  } 