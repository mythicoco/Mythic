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
        pri: string
    }

    const [list, setList] = useState<TodoItem[]>([])

    useEffect(() => {
        const raw = localStorage.getItem('list')
        if (raw) {setList(JSON.parse(raw) as TodoItem[])}
    }, [])


    function addToList() {
        const value = document.querySelector<HTMLInputElement>('.input')
        if (!value?.value)  return

        const newItem = { id: Date.now(), text: value.value, description: "", createdAt: new Date().toISOString(), dueDate: undefined, toggled: false, pri: 'low' }
        const newList = [newItem, ...list]
        setList(newList)
        localStorage.setItem('list', JSON.stringify(newList))
        value.value = ''        
    }
    async function saveListToDB(list: TodoItem[]) {
        const { error } = await Supabase
            .from('todo')
            .upsert({ list }, {onConflict: 'id'})
        if (error) throw error
    }

    
    function removeFromList(index:number) {
        const newList = list.filter((_, i) => i !== index)
        setList(newList)
        localStorage.setItem('list', JSON.stringify(newList))
    } 

    return <>
        <button className='log-out' onClick={ async () => {await Supabase.auth.signOut(); window.location.reload()}}>Log out</button>
        <div className="title"> <p>Todo list</p> <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px'}}><input className='input' type="text" placeholder='Add to todo list' onKeyDown={e => {e.key === 'Enter' && addToList()}}/><button onClick={() => addToList()} className='addButton'>Add</button></div></div>
        <div className="items">
            {list.map((item, index) => (
                <div className='item' key={item.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                        <input className='circle-toogle' checked={item.toggled ? true : false} type='checkbox' onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, toggled: e.target.checked } : it); setList(newList); localStorage.setItem('list', JSON.stringify(newList))}}/>
                        <div className="innerItem">
                            <div className={`innerTitle`}><input onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, text: e.target.value } : it); setList(newList); localStorage.setItem('list', JSON.stringify(newList)); saveListToDB(newList as TodoItem[])}} className='titleInput' type="text" value={item.text} placeholder='Add Title..'/></div>
                            <div className={`innerDes`}><textarea onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, description: e.target.value } : it); setList(newList); localStorage.setItem('list', JSON.stringify(newList))}} className='desInput' placeholder='Description...' value={item.description ? item.description: ''}/></div>
                        </div>
                        <div style={{display: 'flex', width: '78px', height: '100%', flexDirection: 'column'}}>
                            <label className='pri' htmlFor="pri">Priority</label>
                            <select className='priSel' id="pri" onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, pri: e.target.value } : it); setList(newList); localStorage.setItem('list', JSON.stringify(newList))}} value={item.pri ? item.pri : ''}>
                                <option value="low">Low</option>
                                <option value="med">Mediuem</option>
                                <option value="high">High</option>
                            </select>
                            <button onClick={() => removeFromList(index)} className='deleteButton'>Delete</button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center', paddingBottom: '8px', marginTop: '8px'}}><p>Created: {new Date(item.createdAt).getDate()}/{new Date(item.createdAt).getMonth() + 1}/{new Date(item.createdAt).getFullYear()}</p><p>Due: <input className='dateInput' type="date" onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, dueDate: e.target.value } : it); setList(newList); localStorage.setItem('list', JSON.stringify(newList))}} value={item.dueDate ? item.dueDate : ""} /></p></div>
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

