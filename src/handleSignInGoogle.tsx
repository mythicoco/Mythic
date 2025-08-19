import Supabase from './supabaseClient'

async function handleSignInGoogle() {
    await Supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${location.origin}/Mythic/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  })
}

export default handleSignInGoogle