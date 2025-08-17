import { StrictMode,  useEffect,  useState } from 'react'
import { createRoot } from 'react-dom/client'
import Supabase from './supabaseClient'
import './todo.css'

function Todo() {
    type TodoItem = {
        id: number
        text: string
        description: string
        createdAt: string
        dueDate: string | undefined
        toggled: boolean
    }

    const [list, setList] = useState<TodoItem[]>([])

    useEffect(() => {
        const raw = localStorage.getItem('list')
        if (raw) {setList(JSON.parse(raw) as TodoItem[])}
    }, [])


    function addToList() {
        const value = document.querySelector<HTMLInputElement>('.input')
        if (value?.value) {
            const newItem = { id: Date.now(), text: value.value, description: "", createdAt: new Date().toISOString(), dueDate: undefined, toggled: false }
            const newList = [newItem, ...list]
            setList(newList)
            localStorage.setItem('list', JSON.stringify(newList))
            value.value = ''
            return
        }
    }

    
    function removeFromList(index:number) {
        const newList = list.filter((_, i) => i !== index)
        setList(newList)
        localStorage.setItem('list', JSON.stringify(newList))
    } 

    return <>
        <button className='log-out' onClick={ async () => {await Supabase.auth.signOut(); window.location.reload()}}>log out</button>
        <div className="title"> <p>Todo list</p> <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px'}}><input className='input' type="text" placeholder='add to todo list' onKeyDown={e => {e.key === 'Enter' && addToList()}}/><button onClick={() => addToList()} className='addButton'>add</button></div></div>
        <div className="items">
            {list.map((item, index) => (
                <div className='item' key={item.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                        <input className='circle-toogle' checked={item.toggled ? true : false} type='checkbox' onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, toggled: e.target.checked } : it); setList(newList); localStorage.setItem('list', JSON.stringify(newList))}}/>
                        <div className="innerItem">
                            <div className={`innerTitle`}><input onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, text: e.target.value } : it); setList(newList); localStorage.setItem('list', JSON.stringify(newList))}} className='titleInput' type="text" value={item.text}/></div>
                            <div className={`innerDes`}><textarea onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, description: e.target.value } : it); setList(newList); localStorage.setItem('list', JSON.stringify(newList))}} className='desInput' placeholder='description...' value={item.description ? item.description: ''}/></div>
                        </div>
                        <button onClick={() => removeFromList(index)} className='deleteButton'>Delete</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center', paddingBottom: '8px', marginTop: '8px'}}><p>created: {new Date(item.createdAt).getDate()}/{new Date(item.createdAt).getMonth() + 1}/{new Date(item.createdAt).getFullYear()}</p><p>due: <input className='dateInput' type="date" onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, dueDate: e.target.value } : it); setList(newList); localStorage.setItem('list', JSON.stringify(newList))}} value={item.dueDate ? item.dueDate : ""} /></p></div>
                </div>))}
        </div>
    </>
}


createRoot(document.getElementById('todoRoot')!).render(
  <StrictMode>
    <Todo />
  </StrictMode>,
)


// save

