import { useState, useEffect } from "react"
import { SwipeableList } from "./SwipeableList"
import { useAuth } from "../contexts/AuthContext"
import { useParams } from "react-router-dom"
import { useTranslation } from 'react-i18next'

export interface ShoplistItem {
  id?: number
  userId: number
  name?: string
  createdAt?: Date
  quantity?: number
  tag?: string
  shoplistId?: number
  checked?: boolean
}

type AdditionalData = Record<string, never>

export function ShoplistItem() {
  const { user } = useAuth()
  const { id } = useParams()
  const shoplistId = parseInt(id!)
  const [shoplistItems, setShoplistItems] = useState<ShoplistItem[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    const loadItems = async () => {
      setShoplistItems(await fetchShoplistItems())
    }      
    if (user && shoplistId) {        
      loadItems()
    }
  }, [user, shoplistId])

  const fetchShoplistItems = async () => {
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
      const response = await fetch(`http://localhost:4000/api/shoplist-items?shoplistId=${shoplistId}`, {
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
      console.error("Error fetching shoplist items:", error)
      return []
    }
  }

  const addNewShoplistItem = async (name: string, additionalData?: AdditionalData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log(t('errors.noTokenFound'))
        return null
      }

      const response = await fetch(`http://localhost:4000/api/shoplist-items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          shoplistId,
          ...additionalData
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()        
        if (errorData.error.includes('Unique constraint failed on the fields: (`name`)')) {
          throw new Error('DUPLICATE_NAME')
        } else {
          throw new Error('ADD_FAILED')
        }
      }
      
      const newShoplistItem = await response.json()
      setShoplistItems(prevItems => [...prevItems, newShoplistItem])
      return newShoplistItem
    } catch (error) {
      if (error instanceof Error && error.message === 'DUPLICATE_NAME') {
        console.error(t('errors.shoplistItemNameAlreadyExists'))
        alert(t('errors.shoplistItemNameAlreadyExists'))
      } else {
        console.error(t('errors.addShoplistItemFailed'), error)
        alert(t('errors.addShoplistItemFailed'))
      }
      return null
    }
  }

  const deleteShoplistItem = async (shoplistItemId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log(t('errors.noTokenFound'))
        return false
      }  
      const response = await fetch(`http://localhost:4000/api/shoplist-items/${shoplistItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to delete shoplist item')
      }
      setShoplistItems(prevShoplistItems => prevShoplistItems.filter(shoplistItem => shoplistItem.id !== shoplistItemId))
      return true
    } catch (error) {  
      console.error("Error deleting shoplist item:", error)
      return false
    }
  }

  const editShoplistItem = async (shoplistItemId: number, name: string, additionalData?: AdditionalData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log(t('errors.noTokenFound'))
        return null
      }
      const response = await fetch(`http://localhost:4000/api/shoplist-items/${shoplistItemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          ...additionalData
        })
      })
      if (!response.ok) {
        throw new Error('Failed to edit shoplist item')
      }
      const updatedItem = await response.json()
      setShoplistItems(prevShoplistItems => prevShoplistItems.map(shoplistItem => shoplistItem.id === shoplistItemId ? updatedItem : shoplistItem))
      return updatedItem
    } catch (error) {
      console.error("Error editing shoplist item:", error)
      return null
    }
  }

  return (
    <SwipeableList
      items={shoplistItems}
      onAdd={addNewShoplistItem}
      onDelete={deleteShoplistItem}
      onEdit={editShoplistItem}
      hasExpiredDate={false}
      emptyStateText={t('shoplist.emptyState')}
      emptyStateSubtitle={t('shoplist.emptyStateSubtitle')}
      addButtonText={t('shoplist.addItem')}
      addPlaceholder={t('shoplist.addNewShoplistItem')}
    />
  )
}