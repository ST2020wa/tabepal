import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { useSwipeable } from 'react-swipeable'
import { SwipeableItem } from './SwipeableItem'

interface Item {
  id?: number
  userId: number // TODO: user id use email or id?
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
    const inputRef = useRef<HTMLInputElement>(null)
    const [items, setItems] = useState<Item[]>([])
    const [editingItemId, setEditingItemId] = useState<number | null>(null)

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
      console.log('No user found')
      return []
    }
    
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No token found')
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
      console.log('No token found')
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
        name: inputValue
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
      console.log('No token found')
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

const handleAddItem = async (e: React.MouseEvent<HTMLDivElement>)=>{
  // 如果有item正在编辑，则不触发添加功能
  if (editingItemId !== null) {
    return
  }

  const rect = e.currentTarget.getBoundingClientRect()
  const clickY = e.clientY - rect.top
  const main = e.currentTarget.querySelector('main')
  const footer = e.currentTarget.querySelector('footer')

  if (main && footer) {
    const mainBottom = main.getBoundingClientRect().bottom - rect.top
    const footerTop = footer.getBoundingClientRect().top - rect.top
    if (clickY > mainBottom && clickY < footerTop) {
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
  }
}

// 简化的处理编辑状态变化的函数
const handleEditingChange = (itemId: number, isEditing: boolean) => {
  setEditingItemId(isEditing ? itemId : null)
}

const editItem = async (itemId:number, updatedData: Partial<Item>)=>{
  try{
    const token = localStorage.getItem('token')
    if(!token){
      console.log('No token found')
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

const handleEditItem = async (itemId:number, newItemName:string)=>{
  const result = await editItem(itemId, {name: newItemName})
  if(result){
    setItems(prevItems => prevItems.map(item => item.id === itemId ? result : item))
  }
}

    return (
      <div className="h-[calc(100vh-12rem)] overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6 rounded-2xl shadow-xl" onClick={handleAddItem}>
        <main className='space-y-2 sm:space-y-3 max-w-md mx-auto'>
          {/* 空状态显示 */}
          {items.length === 0 && !showInput && (
            <div className="text-center py-12 animate-slide-in">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg">还没有项目</p>
              <p className="text-gray-400 text-sm mt-2">点击下方按钮开始添加</p>
            </div>
          )}
          
          {/* 项目列表 */}
          {items.map((item, id) => (
            <SwipeableItem 
              key={id} 
              item={item} 
              onDelete={handleDeleteItem} 
              onEdit={handleEditItem} 
              isEditing={editingItemId === item.id}
              onEditingChange={(isEditing) => handleEditingChange(item.id!, isEditing)}
            />
          ))}
          
          {/* 添加输入框 */}
          {showInput && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-slide-in">
              <input 
                ref={inputRef}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="添加新项目..."
              />
            </div>
          )}
        </main>
        <footer className='mt-6 flex justify-center'>
          <button 
            onClick={() => setShowInput(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            添加项目
          </button>
        </footer>
      </div>
    )
  } 