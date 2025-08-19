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
    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'Due-Today' | 'Priority'>('All')

    useEffect(() => {
    (async () => {
        const { data: { user } } = await Supabase.auth.getUser()
        if (!user?.id) return

        const { data } = await Supabase
        .from('todo')
        .select('list')
        .eq('user_id', user.id)
        .maybeSingle()

        setList((data?.list ?? []) as TodoItem[])
    })()
    }, [])


    function addToList() {
        const value = document.querySelector<HTMLInputElement>('.input')
        if (!value?.value)  return

        const newItem = { id: Date.now(), text: value.value, description: "", createdAt: new Date().toISOString(), dueDate: undefined, toggled: false, pri: 'low' }
        const newList = [newItem, ...list]
        setList(newList)
        saveListToDB(newList as TodoItem[])
        value.value = ''        
    }
    async function saveListToDB(list: TodoItem[]) {
        const { data: { user }} = await Supabase.auth.getUser()
        if (!user?.id) throw new Error('Not signed in')

        const { error } = await Supabase
            .from('todo')
            .upsert({ user_id: user.id, list },
            { onConflict: 'user_id'}
            )
        if (error) throw error
    }

    
    function removeFromList(index:number) {
        const newList = list.filter((_, i) => i !== index)
        setList(newList)
        saveListToDB(newList as TodoItem[])
    }
    const priorityOrder: Record<string, number> = { high: 0, med: 1, low: 2 }
    const filteredList = filter === 'Completed' ? list.filter(i => i.toggled) : filter === 'Active' ? list.filter(i => !i.toggled) : filter === 'Due-Today' ?  list.filter(i => i.dueDate === `${new Date().getFullYear()}-${String(Number(new Date().getMonth())+1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`) : filter === 'Priority' ? [...list].sort((a,b) => {return priorityOrder[a.pri] - priorityOrder[b.pri]}) : list

    return <>
        <button className='log-out' onClick={ async () => {await Supabase.auth.signOut(); window.location.reload()}}>Log out</button>

        <div className="title">
            <p>Todo list</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr' }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <button style={{ padding: '5px 10px', marginBottom: '5px', backgroundColor: 'rgba(0,0,0,0.1)', border: 'solid 1px rgba(0,0,0,0.1)', boxShadow: '2px 2px 4px rgba(0,0,0,0.1)', borderRadius: '4px', cursor: 'pointer'}} onClick={() => {let newList = list.map(it => ({...it, toggled: true})); setList(newList); saveListToDB(newList)}}>Toggle All</button>
                    <button style={{ padding: '5px 10px', width: '85px',backgroundColor: 'rgba(0,0,0,0.1)', border: 'solid 1px rgba(0,0,0,0.1)', boxShadow: '2px 2px 4px rgba(0,0,0,0.1)', borderRadius: '6px', cursor: 'pointer'}} onClick={() => {let removedToggled = list.map(it => (it.toggled? "" : it)); let newList = removedToggled.filter(item => item !== ''); setList(newList); saveListToDB(newList)}}>Delete Completed</button>
                </div>

                <div className='addTodoInput'>
                    <input className='input' type="text" placeholder='Add to todo list' onKeyDown={e => {e.key === 'Enter' && addToList()}}/>
                    <button onClick={() => addToList()} className='addButton'>Add</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <label htmlFor='filter'>filter</label>
                    <select id="filter" value={filter} onChange={e => setFilter(e.target.value as typeof filter)}>
                        <option value="All">All</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Due-Today">Due today</option>
                        <option value="Priority">Priority</option>
                    </select>
                </div>

            </div>
        </div>


        <div className="items">
            {
            filteredList.map((item, index) => (
                <div className='item' key={item.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                        <input className='circle-toogle' checked={item.toggled ? true : false} type='checkbox' onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, toggled: e.target.checked } : it); setList(newList); saveListToDB(newList as TodoItem[])}}/>
                        <div className="innerItem">
                            <div className={`innerTitle`}><input onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, text: e.target.value } : it); setList(newList); saveListToDB(newList as TodoItem[])}} className='titleInput' type="text" value={item.text} placeholder='Add Title..'/></div>
                            <div className={`innerDes`}><textarea onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, description: e.target.value } : it); setList(newList); saveListToDB(newList as TodoItem[])}} className='desInput' placeholder='Description...' value={item.description ? item.description: ''}/></div>
                        </div>
                        <div style={{display: 'flex', width: '78px', height: '100%', flexDirection: 'column'}}>
                            <label className='pri' htmlFor="pri">Priority</label>
                            <select className='priSel' id="pri" onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, pri: e.target.value } : it); setList(newList); saveListToDB(newList as TodoItem[])}} value={item.pri ? item.pri : ''}>
                                <option value="low">Low</option>
                                <option value="med">Mediuem</option>
                                <option value="high">High</option>
                            </select>
                            <button onClick={() => removeFromList(index)} className='deleteButton'>Delete</button>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'center', paddingBottom: '8px', marginTop: '8px'}}><p>Created: {new Date(item.createdAt).getDate()}/{new Date(item.createdAt).getMonth() + 1}/{new Date(item.createdAt).getFullYear()}</p><p>Due: <input className='dateInput' type="date" onChange={e =>{let newList = list.map((it, i) => i === index ? { ...it, dueDate: e.target.value } : it); setList(newList); saveListToDB(newList as TodoItem[])}} value={item.dueDate ? item.dueDate : ""} /></p></div>
                </div>
            ))
            }
        </div>
    </>
}


createRoot(document.getElementById('todoRoot')!).render(
  <StrictMode>
    <Todo />
  </StrictMode>,
)