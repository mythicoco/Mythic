import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'node:fs'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import supabase from './src/supabaseClient.ts'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json())
app.use(cookieParser())


const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'custom'
});

app.use(vite.middlewares)

app.get('/', async (req, res, next) => {
    const token = req.cookies['sb-access-token']
    if (token) {
        const { data, error } = await supabase.auth.getUser(token)
        if (!error && data?.user) {
        return res.redirect('/todoApp')
        }
    }
    const url = '/index.html'
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8')
    html = await vite.transformIndexHtml(url, html)
    res.setHeader('Content-Type', 'text/html')
    res.status(200).end(html)
})

app.get('/reset-password', async (req, res, next) => {
    const url = '/reset-password.html'
    let html = fs.readFileSync(path.join(__dirname, 'reset-password.html'), 'utf-8')
    html = await vite.transformIndexHtml(url, html)
    res.setHeader('Content-type', 'text/html')
    res.status(200).end(html)

})

app.get('/auth/callback', async (req, res, next) => {
    const url = '/auth-callback.html'
    let html = fs.readFileSync(path.join(__dirname, 'auth-callback.html'), 'utf-8')
    html = await vite.transformIndexHtml(url, html)
    res.setHeader('Content-Type', 'text/html')
    res.status(200).end(html)
})

app.post('/api/set-session', async (req, res) => {
  const { access_token } = req.body || {}
  if (!access_token) return res.status(400).json({ error: 'missing access_token' })

  const { data, error } = await supabase.auth.getUser(access_token)
  if (error || !data?.user) return res.status(401).json({ error: 'invalid token' })

  res.cookie('sb-access-token', access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days!!
  })
  res.json({ ok: true })
})

app.post('/api/clear-session', (req, res) => {
  res.clearCookie('sb-access-token')
  res.json({ ok: true })
})


app.get('/todoApp', async (req, res, next) => {
    const token = req.cookies['sb-access-token']
    if (!token) {return res.redirect('/')}
    const {data, error} = await supabase.auth.getUser(token)
    if (error || !data?.user) {
        return res.redirect('/')
    }

    const url = '/todo.html'
    let html = fs.readFileSync(path.join(__dirname, 'todo.html'), 'utf-8')
    html = await vite.transformIndexHtml(url, html)
    res.setHeader('Content-Type', 'text/html')
    res.status(200).end(html)
})

app.listen(3000);
