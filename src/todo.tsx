import { StrictMode,  useEffect,  useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import Supabase from './supabaseClient'
import './todo.css'

function Todo() {
    type TodoItem = {
        id: number
        text: string
        description: string
    }

    const [list, setList] = useState<TodoItem[]>([])

    const listRef = useRef(list)
    useEffect(() => {
        listRef.current = list
    }, [list])

    useEffect(() => {
        const raw = localStorage.getItem('list')
        if (raw) {
            const parsed = JSON.parse(raw) as any[]
            const normalized = parsed.map(item => ({ ...item, description: item.description ?? "" }))
            setList(normalized)
            listRef.current = normalized
        }
    }, [])


    function addToList() {
        const value = document.querySelector<HTMLInputElement>('.input')
        if (value?.value) {
            const newItem = { id: Date.now(), text: value.value, description: "" }
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
    function editTitle(index:number) {
        let org = document.querySelector(`.t${index}`) as HTMLParagraphElement
        if (org) {
            let value = org.innerHTML.replace(/<.*$/g, '')
            org.innerHTML = `<input value='${value}' class="titleInput i${index}" placeholder="New Title" /><button class="editTitle btn">Edit</button>`
            document.querySelector<HTMLButtonElement>('.btn')?.addEventListener('click', () => editTitleFinish(index))
        }
    }

    function editTitleFinish(index:number) {
        let value = document.querySelector(`.i${index}`) as HTMLInputElement
        let title = value.value
        let outerTitle = document.querySelector(`.t${index}`)
        if (outerTitle) outerTitle.innerHTML = `${title} <button class='editTitle c${index}'>Edit</button>`
        document.querySelector(`.c${index}`)?.addEventListener('click', () => editTitle(index))
        const newlist = list.map(item => item.id === index ? { ...item, text: title } : item)
        setList(newlist)
        localStorage.setItem('list', JSON.stringify(newlist))
    }
    function editDes(num:number) {
        let org = document.querySelector(`.x${num}`) as HTMLParagraphElement
        if (org) {
            const current = listRef.current.find(i => i.id === num)?.description ?? ""
            org.innerHTML = `<input value='${current}' class="desInput a${num}" placeholder="New Description" /><button class="editTitle btn-des-${num}">Edit</button>`
            document.querySelector<HTMLButtonElement>(`.btn-des-${num}`)?.addEventListener('click', () => editDesFinish(num))
        }
    }
    function editDesFinish(num:number) {
        let value = document.querySelector(`.a${num}`) as HTMLInputElement
        let desc = value.value
        let container = document.querySelector(`.x${num}`)
        if (container) container.innerHTML = `${desc}<button class='editTitle d${num}'>Edit</button>`
        document.querySelector(`.d${num}`)?.addEventListener('click', () => editDes(num))
        const updated = listRef.current.map(item => item.id === num ? { ...item, description: desc } : item)
        setList(updated)
        localStorage.setItem('list', JSON.stringify(updated))
    }
    return <>
        <button className='log-out' onClick={ async () => {await Supabase.auth.signOut(); window.location.reload()}}>log out</button>
        <div className="title"> <p>Todo list</p> <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px'}}><input className='input' type="text" placeholder='add to todo list' onKeyDown={e => {e.key === 'Enter' && addToList()}}/><button onClick={() => addToList()} className='addButton'>add</button></div></div>
        <div className="items">
            {list.map((item, index) => (
                <div className='item' key={item.id}>
                    <input className='circle-toogle' type='checkbox'/>
                    <div className="innerItem">
                        <div className={`innerTitle t${item.id}`}>{item.text}<button className='editTitle' onClick={() => editTitle(item.id)}>Edit</button></div>
                        <div className={`innerDes x${item.id}`}>{item.description ? item.description : 'description...'}<button onClick={() =>editDes(item.id)} className='editTitle'>Edit</button></div>
                    </div>
                    <button onClick={() => removeFromList(index)} className='deleteButton'>Delete</button>
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