import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './reset.css'
import Supabase from './supabaseClient'

function Reset() {
    async function handleReset() {
        const newPassword = (document.querySelector('.input') as HTMLInputElement).value
        if (!newPassword || newPassword.length < 6) {
            alert('Password must be at least 6 characters')
            return
        }
        const { error } = await Supabase.auth.updateUser({ password: newPassword })
        if (error) {
            alert(error.message)
        } else {
            window.location.href = '/'
        }
    }

    return  <>
            <div className="all">
                <p>please enter your new password</p>
                <input className='input' type="password" placeholder='Password'/>
                <p>must be atleast 6 characters</p>
                <button onClick={() => handleReset()} className='button'>change password</button>
            </div>
        </>
}


createRoot(document.getElementById('reset-password')!).render(
  <StrictMode>
    <Reset />
  </StrictMode>,
)
