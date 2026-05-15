import { put, list } from '@vercel/blob'

const DEFAULT_DATE = '2026-05-15T20:00:00+02:00'
const PASSWORD = 'Admin1313'
const BLOB_PATH = 'workshop-config.json'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── GET: return the current workshop date ──────────────────────
  if (req.method === 'GET') {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.json({ date: DEFAULT_DATE })
    }
    try {
      const { blobs } = await list({ prefix: BLOB_PATH })
      if (!blobs.length) return res.json({ date: DEFAULT_DATE })
      const data = await fetch(blobs[0].url).then((r) => r.json())
      return res.json(data)
    } catch {
      return res.json({ date: DEFAULT_DATE })
    }
  }

  // ── POST: update the workshop date (password protected) ────────
  if (req.method === 'POST') {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(503).json({ error: 'Storage not configured on Vercel yet' })
    }
    const { password, date } = req.body || {}
    if (password !== PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    if (!date) {
      return res.status(400).json({ error: 'Missing date' })
    }
    await put(BLOB_PATH, JSON.stringify({ date }), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    })
    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
