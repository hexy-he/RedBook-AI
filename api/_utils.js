export function apiRoute(handler) {
  return async function route(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }

    try {
      const payload = typeof req.body === 'object' && req.body ? req.body : {}
      const data = await handler(payload)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  }
}
