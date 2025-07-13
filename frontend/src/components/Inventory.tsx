import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { SwipeableList } from './SwipeableList'
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

interface AdditionalData {
  expiredDate?: Date
}

export function Inventory() {
  const { user } = useAuth()
  const [items, setItems] = useState<Item[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    const loadItems = async () => {
      setItems(await fetchItems())
    }      
    if (user) {        
      loadItems()
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

  const addNewItem = async (name: string, additionalData?: AdditionalData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log(t('errors.noTokenFound'))
        return null
      }

      const response = await fetch(`http://localhost:4000/api/items`, {
        method: 'POST',
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
        const errorData = await response.json()        
        if (errorData.error.includes('Unique constraint failed on the fields: (`name`)')) {
          throw new Error('DUPLICATE_NAME')
        } else {
          throw new Error('ADD_FAILED')
        }
      }

      const newItem = await response.json()
      setItems(prevItems => [...prevItems, newItem])
      return newItem

    } catch (error) {
      if (error instanceof Error && error.message === 'DUPLICATE_NAME') {
        console.error(t('errors.itemNameAlreadyExists'))
        alert(t('errors.itemNameAlreadyExists'))
      } else {
        console.error(t('errors.addItemFailed'), error)
        alert(t('errors.addItemFailed'))
      }
      return null
    }
  }

  const deleteItem = async (itemId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log(t('errors.noTokenFound'))
        return false
      }  
      const response = await fetch(`http://localhost:4000/api/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to delete item')
      }
      setItems(prevItems => prevItems.filter(item => item.id !== itemId))
      return true
    } catch (error) {
      console.error("Error deleting item:", error)
      return false
    }
  }

  const editItem = async (itemId: number, name: string, additionalData?: AdditionalData) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
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
        body: JSON.stringify({
          name,
          ...additionalData
        })
      })
      if (!response.ok) {
        throw new Error('Failed to edit item')
      }
      const updatedItem = await response.json()
      setItems(prevItems => prevItems.map(item => item.id === itemId ? updatedItem : item))
      return updatedItem
    } catch (error) {
      console.error("Error editing item:", error)
      return null
    }
  }

  return (
    <SwipeableList
      items={items}
      onAdd={addNewItem}
      onDelete={deleteItem}
      onEdit={editItem}
      hasExpiredDate={true}
      emptyStateText={t('inventory.emptyState')}
      emptyStateSubtitle={t('inventory.emptyStateSubtitle')}
      addButtonText={t('inventory.addItem')}
      addPlaceholder={t('inventory.addNewItem')}
    />
  )
} 