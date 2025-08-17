import { useState } from "react";
import handleSignInGoogle from "./handleSignInGoogle";
import Supabase from "./supabaseClient";

interface Props {
  emailP: (item: string) => void,
  passwordP: (item: string) => void,
  signUp: (item: boolean) => void,
  signIn: (item: boolean) => void
}
function logIn({ emailP, passwordP, signUp, signIn }: Props) {
  const [login, setLoginIn] = useState(true) 

  async function handleForGetPassword() {
    const email = (document.getElementById('emailInput') as HTMLInputElement)?.value || ''
    if (!email) { alert('Please enter your email first'); return }
    const {error} = await Supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`
    })
    if (error) {alert('please enter a valid email AND dont spam')}  else {
      const fpau = document.querySelector('.fpau') as HTMLElement
      if (fpau) {
        fpau.innerHTML = 'Check your email.'
        fpau.style.display = 'flex'
        fpau.style.alignItems = 'center'
        fpau.style.justifyContent = 'center'
      }
    }
  }

  return (
    <>
        <div className="all">
          <div className="top"><h1 className="all-title">{login ?"Log in":"Register"}</h1></div>

          <div className="eap">
              <p className="title">Email</p>
              <input id="emailInput" className="input" style={{ marginBottom: "25px"}} type="text" placeholder="usernane@gmail.com"/>

              <span className="title">Password<p style={{ fontSize: "15px", marginBottom: "3px"}}>{login ? "" : "(must be 6 characters or more)"}</p></span>
              <input id="passwordInput" className="input password" type="password" placeholder="password" />

              <button onClick={handleForGetPassword} style={{ border: 'none'}} className="Fpassword">{login ? "Forgot password?": ""}</button>
          </div>

          <div className="fpau">
              <button onClick={() => {emailP((document.getElementById('emailInput') as HTMLInputElement).value); passwordP((document.getElementById('passwordInput') as HTMLInputElement).value); if(login === true) {signIn(true); signUp(false)} else {signUp(true);signIn(false)} }} className="signIn">{login ? "Sign in": "Sign up"}</button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}><p>or continue with</p></div>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}><button onClick={handleSignInGoogle} className="google">google</button></div>
              <div style={{ fontSize: "14px", display: "flex", justifyContent: "center", gap: "4px"}}><p>{login ? "dont have an account?": "already have an account?"}</p><button onClick={() => {setLoginIn(login ? false : true)}} style={{ border: "none", cursor: "pointer"}}>{login ?"register":"sign in"}</button></div>
          </div>
      </div>
    </>
  )
}

export default logIn