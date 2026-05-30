const DEFAULT_BASE_URL = 'https://api.deepseek.com'
const DEFAULT_MODEL = 'deepseek-v4-flash'

export async function chatJson({ messages, temperature = 0.2 }) {
  const content = await chatText({ messages, temperature, responseFormat: { type: 'json_object' } })
  return parseJson(content)
}

export async function chatText({ messages, temperature = 0.2, responseFormat } = {}) {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.LLM_API_KEY
  if (!apiKey) {
    const error = new Error('Missing DEEPSEEK_API_KEY')
    error.code = 'NO_API_KEY'
    throw error
  }
  if (!/^[\x20-\x7E]+$/.test(apiKey)) {
    const error = new Error('Invalid DEEPSEEK_API_KEY: key must contain ASCII characters only')
    error.code = 'INVALID_API_KEY'
    throw error
  }

  const baseUrl = (process.env.DEEPSEEK_BASE_URL || process.env.LLM_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
  const model = process.env.DEEPSEEK_MODEL || process.env.LLM_MODEL || DEFAULT_MODEL

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      response_format: responseFormat,
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`LLM request failed ${response.status}: ${detail}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() || ''
}

function parseJson(text) {
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error(`LLM did not return JSON: ${text}`)
    return JSON.parse(match[0])
  }
}
