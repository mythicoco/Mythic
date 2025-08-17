import Supabase from "./supabaseClient"

async function handleSignIn(email:string, password:string) {
    const { data, error} = await Supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password}) // used gpt
    if (error) {
        console.error("Signin failed: ", error.message)
        const title = document.querySelector<HTMLElement>('.all-title')
        if (title) {
            alert('wrong email or password')
        }
        return
    }
    console.log("signed in user")
    const access_token = data.session?.access_token
    if (!access_token) {console.warn('ops! no access token');return} 

    await fetch('/api/set-session', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ access_token })
    })

    window.location.href = './todoApp'
    
}

export default handleSignIn