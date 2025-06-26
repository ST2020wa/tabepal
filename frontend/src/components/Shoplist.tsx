import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export interface ShopListItem {
  id?: number
  userId: number
  name?: string
  createdAt?: Date
  quantity?: number
  tag?: string
}

export function Shoplist() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showInput, setShowInput] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<ShopListItem[]>([])
  const [editingItemId, setEditingItemId] = useState<number | null>(null)

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

  const addNewItem = async () => {
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
      const newItem = await addNewItem()
      if (newItem) {
        setItems(prevItems => [...prevItems, newItem])
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
    // 点击购物清单项可以进入详情或编辑模式
    setEditingItemId(editingItemId === itemId ? null : itemId)
  }

  return (
    <div className="h-[calc(100vh-12rem)] overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6 rounded-2xl shadow-xl">
      <main className='space-y-3 max-w-md mx-auto'>
        {/* 头部 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">购物清单</h1>
          <p className="text-gray-600 text-sm">管理你的购物需求</p>
        </div>

        {/* 空状态 */}
        {items.length === 0 && !showInput && (
          <div className="text-center py-12 animate-slide-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">还没有购物清单</p>
            <p className="text-gray-400 text-sm mt-2">点击下方按钮开始添加</p>
          </div>
        )}

        {/* 购物清单项 */}
        {items.map((item, id) => (
          <div
            key={id}
            onClick={() => handleItemClick(item.id!)}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer animate-slide-in group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                  {item.createdAt && (
                    <p className="text-sm text-gray-500">
                      创建于 {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: 实现编辑功能
                    console.log('Edit item:', item.id)
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteItem(item.id!)
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
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
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder="添加新的购物清单"
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
          添加清单
        </button>
      </footer>
    </div>
  )
}