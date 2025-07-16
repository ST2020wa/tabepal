import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import type { Item } from './Inventory'
import type { ShoplistItem } from './Shoplistitem'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { increment, decrement } from '../slices/counterSlice'

const getExpiryStatus = (expiredDate: string | Date | undefined) => {
    if (!expiredDate) return { status: 'no-date', color: 'text-gray-400' }
    
    const today = new Date()
    const expiryDate = new Date(expiredDate)
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { status: 'expired', color: 'text-red-500' }
    } else if (diffDays <= 3) {
      return { status: 'urgent', color: 'text-orange-500' }
    } else if (diffDays <= 7) {
      return { status: 'warning', color: 'text-yellow-500' }
    } else {
      return { status: 'safe', color: 'text-green-500' }
    }
  }

export function Dashboard() {
    const { user } = useAuth()
    const [items, setItems] = useState<Item[]>([])
    const [shopListItems, setShopListItems] = useState<ShoplistItem[]>([])
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const count = useSelector((state: RootState) => state.counter.value)

    useEffect(() => {
        if (user) {
          Promise.all([
            fetchItems().then(setItems),
            fetchShopListItems().then(setShopListItems)
          ])
        }
    }, [user])    
      const fetchItems = async () => {
        try {
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
        } catch (error) {
          console.error("Error fetching items:", error)
          return []
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
          if (!response.ok) throw new Error(t('shoplist.failedToFetch'))
          return await response.json()
        } catch (error) {
          console.error("Error fetching shoplist items:", error)
          return []
        }
      }

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-bold text-white'>Dashboard placeholder</h1>
            
            {/* Add Redux test section */}
            <div className='bg-white/10 p-4 rounded-lg'>
                <h2 className='text-lg font-bold text-white mb-2'>Redux Test</h2>
                <div className='flex items-center gap-4'>
                    <span className='text-white'>Count: {count}</span>
                    <button 
                        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                        onClick={() => dispatch(increment())}
                    >
                        Increment
                    </button>
                    <button 
                        className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                        onClick={() => dispatch(decrement())}
                    >
                        Decrement
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <h2 className='text-lg font-bold text-white'>current inventory</h2>
                <div className='flex flex-col gap-2 text-white'>
                    {items.map((item) => (
                        <div key={item.id}>
                            <h4 className='text-lg'>{item.name}</h4>
                            <p className='text-sm'>{item.quantity}</p>
                            <div className="flex justify-center">
                                <p className={`bg-white/20 w-fit text-sm ${getExpiryStatus(item.expiredDate).color}`}>
                                    {item.expiredDate ? new Date(item.expiredDate).toLocaleDateString() : 'no date'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <h2 className='text-lg font-bold text-white'>shoplists x {shopListItems.length}</h2> 
                <div className='flex flex-col gap-2 text-white'>
                    {shopListItems.map((shoplist) => (
                        <div key={shoplist.id}>
                            <h4 className='text-lg'>[ ] {shoplist.name}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}