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

  // 添加鼠标长按相关状态
  const [mousePressStartTime, setMousePressStartTime] = useState(0)
  const [mousePressTimer, setMousePressTimer] = useState<NodeJS.Timeout | null>(null)
  
  // 添加删除确认相关状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ShoplistItem | null>(null)

  useEffect(() => {
    const loadItems = async () => {
      setItems(await fetchShopListItems())
    }
    if (user) {
      loadItems()
    }
  }, [])

   // 鼠标按下事件
   const handleMouseDown = (item: ShoplistItem) => {
    console.log('🖱️ Mouse DOWN on item:', item.name)
    setMousePressStartTime(Date.now())
    
    const timer = setTimeout(() => {
      console.log('⏰ Long press detected for item:', item.name)
      // 使用浏览器原生确认对话框
      if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
        handleDeleteItem(item.id!)
      }
    }, 500) // 500ms 长按时间
    
    setMousePressTimer(timer)
  }

  // 鼠标松开事件
  const handleMouseUp = (item: ShoplistItem) => {
    console.log('🖱️ Mouse UP on item:', item.name)
    
    const pressDuration = Date.now() - mousePressStartTime
    console.log('⏱️ Press duration:', pressDuration, 'ms')
    
    if (pressDuration < 500) {
      console.log('👆 Short click detected for item:', item.name)
      // 短按逻辑 - 进入详情页面
      navigate(`/shoplist/${item.id}`)
    } else {
      console.log('🔒 Long press completed for item:', item.name)
      // 长按已经在 timer 中处理了
    }
    
    // 清除定时器
    if (mousePressTimer) {
      clearTimeout(mousePressTimer)
      setMousePressTimer(null)
    }
  }

  // 鼠标离开事件
  const handleMouseLeave = (item: ShoplistItem) => {
    console.log('�� Mouse LEFT item:', item.name)
    // 鼠标离开时取消长按
    if (mousePressTimer) {
      clearTimeout(mousePressTimer)
      setMousePressTimer(null)
      console.log('❌ Long press cancelled due to mouse leave')
    }
  }

  // 右键菜单事件处理
  const handleContextMenu = (e: React.MouseEvent, item: ShoplistItem) => {
    e.preventDefault() // 阻止默认右键菜单
    console.log('🖱️ Right click on item:', item.name)
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      handleDeleteItem(item.id!)
    }
  }

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
    console.log('📱 Touch click on item ID:', itemId)
    navigate(`/shoplist/${itemId}`)
  }

  // 确认删除
  const confirmDelete = async () => {
    if (itemToDelete) {
      await handleDeleteItem(itemToDelete.id!)
      setShowDeleteConfirm(false)
      setItemToDelete(null)
    }
  }

  // 取消删除
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setItemToDelete(null)
  }

  return (
    <div className="h-[calc(100vh-12rem)] overflow-y-auto bg-gray-900/80 p-2 sm:p-4 md:p-6 rounded-2xl shadow-xl backdrop-blur-sm">
      <main className='max-w-2xl mx-auto'>
        {/* 空状态 */}
        {items.length === 0 && !showInput && (
          <div className="text-center py-12 animate-slide-in">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No Shoplist</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Click the button below to add</p>
          </div>
        )}

        {/* 两列网格布局 */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {items.map((item, id) => {
            const gradients = [
              "bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700",
              "bg-gradient-to-br from-green-400 to-blue-500 dark:from-green-600 dark:to-blue-700", 
              "bg-gradient-to-br from-pink-400 to-orange-500 dark:from-pink-600 dark:to-orange-700",
              "bg-gradient-to-br from-yellow-400 to-red-500 dark:from-yellow-600 dark:to-red-700",
              "bg-gradient-to-br from-indigo-400 to-pink-500 dark:from-indigo-600 dark:to-pink-700",
              "bg-gradient-to-br from-teal-400 to-green-500 dark:from-teal-600 dark:to-green-700",
              "bg-gradient-to-br from-orange-400 to-yellow-500 dark:from-orange-600 dark:to-yellow-700"
            ]
            const gradientClass = gradients[id % 7]
            
            return (
              <div
                key={id}
                className={`aspect-square rounded-3xl shadow-lg p-4 m-1 flex flex-col justify-center text-left gap-2 ${gradientClass} cursor-pointer select-none`}
                onClick={() => handleItemClick(item.id!)}
                onMouseDown={() => handleMouseDown(item)}
                onMouseUp={() => handleMouseUp(item)}
                onMouseLeave={() => handleMouseLeave(item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
                style={{ 
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  WebkitTouchCallout: 'none'
                }}
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
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-slide-in">
          <input
            ref={inputRef}
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
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