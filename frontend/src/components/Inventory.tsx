import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

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
    const [showInput, setShowInput] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const [items, setItems] = useState<Item[]>([
      {
        id: 1,
        userId: 1,
        name: "Apple",
      },
      {
        id: 2,
        userId: 1,
        name: "banana"
      }
    ])

const addItem = ()=>{
  console.log('clicked')
}

const fetchItems = async ()=>{
  try{
    //const responst
  }catch (error){
    console.error("Error fetching items:", error)
    return []
  }
}

const handleAddItem = (e: React.MouseEvent<HTMLDivElement>)=>{
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
        setItems(prevItems => [...prevItems, {
          name: inputValue,
          userId: 1
        }])
        setInputValue("");
        setShowInput(false);
      }else{
        setShowInput(false);
      }
    }
    console.log(items.length);
    
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
        {items.map((item, index) => (
          <div key={index}>
            <h2>{item.name}</h2>
          </div>
        ))}
        {showInput && (
          <div><input className='border border-black' type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} /></div>
        )}
        </main>
        <footer className='border border-blue-500'>
          <button onClick={addItem}>Add Item</button>
        </footer>
      </div>
    )
  } 