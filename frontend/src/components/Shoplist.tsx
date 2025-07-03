import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { ShoplistItem } from './Shoplistitem'
import { useNavigate } from 'react-router-dom'

export function Shoplist() {
  const { user } = useAuth()
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<ShoplistItem[]>([])
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const navigate = useNavigate();

  useEffect(() => {
    const loadItems = async () => {
      setItems(await fetchShopListItems())
    }
    if (user) {
      loadItems()
    }
  }, [])

  const fetchShopListItems = async () => {
    try {
      if (!user) return []
      
      const token = localStorage.getItem('token')
      if (!token) return []
      
      const response = await fetch(`http://localhost:4000/api/shoplists?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) throw new Error('Failed to fetch shoplist items')
      return await response.json()
    } catch (error) {
      console.error("Error fetching shoplist items:", error)
      return []
    }
  }

  const addNewShoplist = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null

      const response = await fetch(`http://localhost:4000/api/shoplists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: inputValue })
      })
      if (!response.ok) throw new Error('Failed to add shoplist item')
      return await response.json()
    } catch (error) {
      console.error("Error adding shoplist item:", error)
      return null
    }
  }

  const deleteItem = async (itemId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return false

      const response = await fetch(`http://localhost:4000/api/shoplists/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      return response.ok
    } catch (error) {
      console.error("Error deleting shoplist item:", error)
      return false
    }
  }

  //TODO: use this later
  const handleDeleteItem = async (itemId: number) => {
    const success = await deleteItem(itemId)
    if (success) {
      setItems(prevItems => prevItems.filter(item => item.id !== itemId))
    }
  }

  const handleBlur = async () => {
    if (!showInput) {
      setShowInput(true)
      setTimeout(() => inputRef.current?.focus(), 0)
    } else if (inputValue) {
      const newShoplist = await addNewShoplist()
      if (newShoplist) {
        setItems(prevItems => [...prevItems, newShoplist])
        setInputValue('')
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
      setShowInput(false)
    }
  }

  const handleItemClick = (itemId: number) => {
    console.log('itemId', itemId)
    // 点击购物清单项可以进入详情或编辑模式
    setEditingItemId(editingItemId === itemId ? null : itemId)
    navigate(`/shoplist/${itemId}`)
  }

  

  return (
    <div className="h-[calc(100vh-12rem)] overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6 rounded-2xl shadow-xl">
      <main className='max-w-2xl mx-auto'>
        {/* 头部 */}
        {/* <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Shop List</h1>
        </div> */}

        {/* 空状态 */}
        {items.length === 0 && !showInput && (
          <div className="text-center py-12 animate-slide-in">
            <p className="text-gray-500 text-lg">No Shoplist</p>
            <p className="text-gray-400 text-sm mt-2">Click the button below to add</p>
          </div>
        )}

        {/* 两列网格布局 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {items.map((item, id) => {
            const gradients = [
              "bg-gradient-to-br from-blue-400 to-purple-500",
              "bg-gradient-to-br from-green-400 to-blue-500", 
              "bg-gradient-to-br from-pink-400 to-orange-500",
              "bg-gradient-to-br from-yellow-400 to-red-500",
              "bg-gradient-to-br from-indigo-400 to-pink-500",
              "bg-gradient-to-br from-teal-400 to-green-500",
              "bg-gradient-to-br from-orange-400 to-yellow-500"
            ]
            const gradientClass = gradients[id % 7]
            
            return (
              <div
                key={id}
                onClick={() => handleItemClick(item.id!)}
                className={`aspect-square rounded-3xl shadow-lg p-4 m-1 flex flex-col justify-center text-left gap-2 ${gradientClass} cursor-pointer`}
              >
                <h1 className="text-xl font-semibold text-white line-clamp-2">{item.name}</h1>
                  <p className="text-sm text-white/80">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                  </p>
              </div>
            )
          })}
        </div>

        {/* 添加输入框 */}
        {showInput && (
          <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-slide-in">
          <input
            ref={inputRef}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Add new shoplist name"
            autoFocus
          />
        </div>
        )}
      </main>

      <footer className='mt-6 flex justify-center'>
        <button
          onClick={() => setShowInput(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          Add Shoplist
        </button>
      </footer>
    </div>
  )
}