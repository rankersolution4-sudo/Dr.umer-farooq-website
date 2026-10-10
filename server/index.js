import express from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads')
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')
const AUTH_FILE = path.join(DATA_DIR, 'auth.json')
const DIST = path.join(__dirname, '..', 'dist')
const PORT = process.env.PORT || 3001

const KEYS = ['doctor', 'contact', 'specialInterests', 'locations', 'diagnosticsFacility', 'videoConsultation', 'services', 'conditionGroups', 'faqs', 'videos', 'gallery', 'posts']

fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const hash = (pw, salt) => crypto.scryptSync(pw, salt, 32).toString('hex')
function loadAuth() {
  if (fs.existsSync(AUTH_FILE)) return JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'))
  const salt = crypto.randomBytes(16).toString('hex')
  const a = { salt, hash: hash(process.env.ADMIN_PASSWORD || 'admin123', salt) }
  fs.writeFileSync(AUTH_FILE, JSON.stringify(a))
  return a
}
let authData = loadAuth()
const sessions = new Map()

function requireAuth(req, res, next) {
  const t = (req.headers.authorization || '').replace('Bearer ', '')
  const exp = sessions.get(t)
  if (!t || !exp || exp < Date.now()) return res.status(401).json({ error: 'Unauthorized' })
  next()
}

const app = express()
app.use(express.json({ limit: '15mb' }))
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }))

app.get('/api/content', (req, res) => {
  res.set('Cache-Control', 'no-store')
  try { res.json(JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'))) } catch { res.json({}) }
})

app.post('/api/login', async (req, res) => {
  const pw = String(req.body?.password || '')
  const a = Buffer.from(hash(pw, authData.salt))
  const b = Buffer.from(authData.hash)
  if (!crypto.timingSafeEqual(a, b)) {
    await new Promise((r) => setTimeout(r, 600))
    return res.status(401).json({ error: 'Wrong password' })
  }
  const token = crypto.randomBytes(24).toString('hex')
  sessions.set(token, Date.now() + 7 * 24 * 3600 * 1000)
  res.json({ token })
})

app.put('/api/content', requireAuth, (req, res) => {
  const body = req.body
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ error: 'Invalid data' })
  const clean = {}
  for (const k of KEYS) if (body[k] !== undefined) clean[k] = body[k]
  const tmp = CONTENT_FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(clean, null, 2))
  fs.renameSync(tmp, CONTENT_FILE)
  res.json({ ok: true })
})

app.post('/api/upload', requireAuth, (req, res) => {
  const m = /^data:image\/(png|jpeg|webp|gif);base64,(.+)$/.exec(String(req.body?.data || ''))
  if (!m) return res.status(400).json({ error: 'Invalid image' })
  const ext = m[1] === 'jpeg' ? 'jpg' : m[1]
  const name = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`
  fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(m[2], 'base64'))
  res.json({ url: `/uploads/${name}` })
})

app.post('/api/password', requireAuth, (req, res) => {
  const pw = String(req.body?.password || '')
  if (pw.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
  const salt = crypto.randomBytes(16).toString('hex')
  authData = { salt, hash: hash(pw, salt) }
  fs.writeFileSync(AUTH_FILE, JSON.stringify(authData))
  res.json({ ok: true })
})

if (fs.existsSync(DIST)) {
  app.use(express.static(DIST))
  app.use((req, res) => res.sendFile(path.join(DIST, 'index.html')))
}

app.use((err, req, res, next) => res.status(err.status || 500).json({ error: err.message }))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))