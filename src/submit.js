import { CONFIG } from './config.js'

export async function submitLead(form) {
  const { callMeBotApiKey, web3FormsAccessKey } = CONFIG.submission

  const message = [
    '📋 طلب تسجيل جديد — Vamos Academy',
    `الاسم: ${form.name}`,
    `الواتساب: ${form.phone}`,
    form.country ? `الدولة: ${form.country}` : null,
    `الكورس: ${form.course}`,
    form.message ? `الرسالة: ${form.message}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const tasks = []

  if (callMeBotApiKey) {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${CONFIG.whatsappNumber}&text=${encodeURIComponent(message)}&apikey=${callMeBotApiKey}`
    tasks.push(
      fetch(url, { mode: 'no-cors' })
        .then(() => ({ ok: true, source: 'callmebot' }))
        .catch(() => ({ ok: false, source: 'callmebot' }))
    )
  }

  if (web3FormsAccessKey) {
    tasks.push(
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          subject: `طلب تسجيل جديد — ${form.course}`,
          name: form.name,
          phone: form.phone,
          country: form.country || '',
          course: form.course,
          message: form.message || '',
        }),
      })
        .then((r) => r.json())
        .then((d) => ({ ok: d.success, source: 'web3forms' }))
        .catch(() => ({ ok: false, source: 'web3forms' }))
    )
  }

  if (tasks.length === 0) {
    console.warn('No submission channel configured. Add callMeBotApiKey or web3FormsAccessKey in src/config.js')
    return { success: false }
  }

  const results = await Promise.all(tasks)
  const anyOk = results.some((r) => r.ok)
  return { success: anyOk, results }
}
