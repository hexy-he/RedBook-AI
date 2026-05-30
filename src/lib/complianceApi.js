async function postJson(path, payload) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || `请求失败：${response.status}`)
  }
  return data
}

export function loadIntentOptions({ title, body }) {
  return postJson('/api/intent', { title, body })
}

export function runComplianceCheck({ title, body, intent }) {
  return postJson('/api/check', { title, body, intent })
}

export function sendComplianceQuestion({ title, body, intent, message }) {
  return postJson('/api/chat', { title, body, intent, message })
}
