import Supabase from "./supabaseClient"

async function handleSignUp(email:string, password:string) {
    const { data, error } = await Supabase.auth.signUp({ email: email.trim().toLowerCase(), password}) // used gpt
    if (error) {
        console.error("Sign Up failed: ", error.message)
        alert('make sure you have a valid email\nand\na password above 6 characters')
        return
    }
    if (data?.user && (data.user.identities?.length ?? 0) === 0) {
        console.log('user already exsits')
        const title = document.querySelector<HTMLElement>('.all-title')
        if (title) {
            title.innerHTML = 'user already exits'
            title.style.color = 'red'
            title.style.fontSize = '27px'
        }
        return
    }
    const fapu = document.querySelector<HTMLElement>('.fpau')
    if (fapu) {
        fapu.innerHTML = 'check your email'
        fapu.style.justifyContent = "center"
    }
    
}

export default handleSignUp