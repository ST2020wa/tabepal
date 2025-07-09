import { useEffect, useRef, useState } from "react"
import { SwipeableItem } from "./SwipeableItem"
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

  export function ShoplistItem() {
    const { user } = useAuth()
    const { id } = useParams();
    const shoplistId = parseInt(id!);
    const inputRef = useRef<HTMLInputElement>(null)
    const [showInput, setShowInput] = useState(false)  
    const [inputValue, setInputValue] = useState('')
    const [shoplistItems, setShoplistItems] = useState<ShoplistItem[]>([])
    const [editingshoplistItem, setEditingshoplistItem] = useState<number | null>(null)
    const { t } = useTranslation()


    useEffect(()=>{
      const loadItems = async ()=>{
        setShoplistItems(await fetchShoplistItems());
      }      
      if(user && shoplistId){        
        loadItems();
      }
    }, [])

    const fetchShoplistItems = async ()=>{
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
      }catch (error){
        console.error("Error fetching shoplist items:", error)
        return []
      }
    }

    const addNewShoplistItem = async ()=>{
      try{
        const token = localStorage.getItem('token')
        if(!token){
          console.log(t('errors.noTokenFound'))
          return []
        }
    
        const response = await fetch(`http://localhost:4000/api/shoplist-items`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: inputValue,
            shoplistId: shoplistId
          })
        })
          if(!response.ok){
            throw new Error('Failed to add shoplist item')
          }
          const newShoplistItem = await response.json()
          return newShoplistItem;
      }catch(error){
        console.error("Error adding shoplist item:", error)
        return []
      }
    }

    const deleteShoplistItem = async (shoplistItemId:number)=>{  
      try{
        const token = localStorage.getItem('token')
        if(!token){
          console.log(t('errors.noTokenFound'))
          return []
        }  
        const response = await fetch(`http://localhost:4000/api/shoplist-items/${shoplistItemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        if(!response.ok){
          throw new Error('Failed to delete shoplist item')
        }
        const data = await response.json()
        return data
      }catch(error){  
        console.error("Error deleting shoplist item:", error)
        return []
      }
    }

    const handleDeleteShoplistItem = async (shoplistItemId:number)=>{
      const result = await deleteShoplistItem(shoplistItemId)
      if(result){
        setShoplistItems(prevShoplistItems => prevShoplistItems.filter(shoplistItem => shoplistItem.id !== shoplistItemId))
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
        const newItem = await addNewShoplistItem();
        setShoplistItems(prevItems => [...prevItems, newItem]);
        setInputValue('');
        setShowInput(false);
      }else{
        setShowInput(false);
      }
    }

    const handleEditingChange = (shoplistItemId: number, isEditing: boolean) => {
      setEditingshoplistItem(isEditing ? shoplistItemId : null)
    }

    const editShoplistItem = async (shoplistItemId:number, updatedData: Partial<ShoplistItem>)=>{
      try{
        const token = localStorage.getItem('token')
        if(!token){
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
          body: JSON.stringify(updatedData)
        })
        if(!response.ok){
          throw new Error('Failed to edit shoplist item')
        }
        const data = await response.json()
        return data
      }catch(error){
        console.error("Error editing shoplist item:", error)
        return []
      }
    }

    const handleEditShoplistItem = async (shoplistItemId:number, newShoplistItemName:string)=>{  
      const result = await editShoplistItem(shoplistItemId, {name: newShoplistItemName})
      if(result){
        setShoplistItems(prevShoplistItems => prevShoplistItems.map(shoplistItem => shoplistItem.id === shoplistItemId ? result : shoplistItem))
      }
    }

    return (
      <div className="h-[calc(100vh-12rem)] overflow-y-auto bg-white/90 dark:bg-gray-900/80 p-2 sm:p-4 md:p-6 rounded-2xl shadow-xl backdrop-blur-sm">
        <main className='space-y-2 sm:space-y-3 max-w-md mx-auto'>
          {/* 空状态显示 */}
          {shoplistItems.length === 0 && !showInput && (
            <div className="text-center py-12 animate-slide-in">
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t('shoplist.emptyState')}</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">{t('shoplist.emptyStateSubtitle')}</p>
            </div>
          )}
          
          {/* 项目列表 */}
          {shoplistItems.map((item, id) => (
            <SwipeableItem 
              key={id} 
              item={item} 
              hasExpiredDate={false}
              onDelete={handleDeleteShoplistItem} 
              onEdit={handleEditShoplistItem}
              isEditing={editingshoplistItem === item.id}
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
                placeholder={t('shoplist.addNewShoplistItem')}
              />
            </div>
          )}
        </main>
        <footer className='mt-6 flex justify-center'>
          <button 
            onClick={() => setShowInput(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            {t('shoplist.addItem')}
          </button>
        </footer>
      </div>
    )
  }