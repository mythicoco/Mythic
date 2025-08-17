import Supabase from './supabaseClient'

async function handleSignInGoogle() {
    await Supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  })
}

export default handleSignInGoogle