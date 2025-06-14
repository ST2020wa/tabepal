import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

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


const handleAddItem = async (e: React.MouseEvent<HTMLDivElement>)=>{
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

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  if (inputValue.trim()) {
    setInputValue('')
    setShowInput(false)
  }
}

const handleCancel = () => {
  setInputValue('')
  setShowInput(false)
}
    
    return (
      <div className="h-[calc(100vh-12rem)] overflow-y-auto border border-red-500 flex flex-col justify-between" onClick={handleAddItem}>
        <main className='border border-blue-500'>
          {/* TODO: 预览和添加后显示的顺序问题 */}
        {items.map((item, id) => (
          <div key={id}>
            <h2>{item.name}</h2>
          </div>
        ))}
        {showInput && (
          <div><input className='border border-black' type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} /></div>
        )}
        </main>
        <footer className='border border-blue-500'>
          <button onClick={() => setShowInput(true)}>Add Item</button>
        </footer>
      </div>
    )
  } 