import { chatJson, chatText } from './llm.js'
import { compactRuleForPrompt, retrieveRules } from './retrieval.js'

export function complianceApiPlugin() {
  return {
    name: 'xhs-compliance-api',
    configureServer(server) {
      server.middlewares.use('/api/intent', route('POST', handleIntent))
      server.middlewares.use('/api/check', route('POST', handleCheck))
      server.middlewares.use('/api/chat', route('POST', handleChat))
      server.middlewares.use('/api/retrieve', route('POST', handleRetrieve))
    },
  }
}

export async function handleIntent(payload) {
  const draft = formatDraft(payload)
  const rules = retrieveRules(draft, 6)

  try {
    const result = await chatJson({
      messages: [
        systemMessage(),
        {
          role: 'user',
          content: [
            '请阅读这篇小红书草稿，生成 2-3 个“用户最想让读者 get 到什么”的意图选项。',
            '要求：选项必须短、口语化、彼此互斥；不要直接做合规判断；只返回 JSON。',
            'JSON 格式：{"options":[{"id":"short_id","label":"中文选项"}]}',
            '',
            '草稿：',
            draft,
            '',
            '可能相关的规则标题：',
            rules.map((rule) => `${rule.rule_id} ${rule.title}`).join('\n'),
          ].join('\n'),
        },
      ],
    })
    return {
      greeting: '我已读完你的笔记',
      sub: '先确认下，你这篇最想让读者 get 到的是什么？',
      options: normalizeOptions(result.options),
    }
  } catch (error) {
    return {
      greeting: '我已读完你的笔记',
      sub: '先确认下，你这篇最想让读者 get 到的是什么？',
      options: fallbackIntentOptions(payload),
      warning: error.code === 'NO_API_KEY' ? '未配置 DEEPSEEK_API_KEY，当前使用本地兜底意图。' : error.message,
    }
  }
}

export async function handleCheck(payload) {
  const draft = formatDraft(payload)
  const intent = String(payload.intent || '未明确说明')
  const retrievedRules = retrieveRules(`${draft}\n用户意图：${intent}`, 10)
  const promptRules = retrievedRules.map(compactRuleForPrompt).join('\n\n---\n\n')

  try {
    const result = await chatJson({
      messages: [
        systemMessage(),
        {
          role: 'user',
          content: [
            '请基于给定规则，对小红书草稿做发布前合规预检。',
            '只使用给定规则，不要编造规则。结论要谨慎：不确定时说“可能触及”。',
            '如果可能触及多条规则，必须分别列出每条规则及原因。',
            '改进方向必须给出逐条建议，不要把所有建议写成一段。',
            '回答必须是 JSON，格式如下：',
            '{"touched_rules":[{"rule_id":"xhs_001","rule_name":"规则名称","reason":"为什么可能触及该规则","marks":["命中的原文片段"]}],"suggestions":["建议1","建议2"],"matched_rules":["xhs_001"]}',
            '',
            '用户确认的创作意图：',
            intent,
            '',
            '草稿：',
            draft,
            '',
            '检索到的规则：',
            promptRules,
          ].join('\n'),
        },
      ],
      temperature: 0.15,
    })
    return normalizeResult(result, retrievedRules)
  } catch (error) {
    return {
      ...fallbackCheckResult(retrievedRules, intent),
      warning: error.code === 'NO_API_KEY' ? '未配置 DEEPSEEK_API_KEY，当前使用本地检索兜底结果。' : error.message,
    }
  }
}

export async function handleChat(payload) {
  const draft = formatDraft(payload)
  const intent = String(payload.intent || '未明确说明')
  const message = String(payload.message || '').trim()
  const retrievedRules = retrieveRules(`${draft}\n${intent}\n${message}`, 8)
  const promptRules = retrievedRules.map(compactRuleForPrompt).join('\n\n---\n\n')

  try {
    const text = await chatText({
      messages: [
        systemMessage(),
        {
          role: 'user',
          content: [
            '用户正在追问发布前合规问题。请结合草稿、已确认意图和检索到的规则回答。',
            '回答要直接、短，不承诺“改完一定过审”，必要时引用规则标题。',
            '',
            '草稿：',
            draft,
            '',
            '用户意图：',
            intent,
            '',
            '用户追问：',
            message,
            '',
            '相关规则：',
            promptRules,
          ].join('\n'),
        },
      ],
      temperature: 0.25,
    })
    return { text }
  } catch (error) {
    const top = retrievedRules[0]
    return {
      text: top
        ? `从规则「${top.title}」看，建议你把表述改成更具体、可验证的使用体验，避免绝对化、攻击性或引导交易/站外沟通的表达。当前未配置真实 LLM，只返回本地兜底建议。`
        : '当前未检索到足够相关的规则。建议补充具体标题、正文或你想保留的表达点后再问一次。',
      warning: error.code === 'NO_API_KEY' ? '未配置 DEEPSEEK_API_KEY。' : error.message,
    }
  }
}

export async function handleRetrieve(payload) {
  const draft = formatDraft(payload)
  return { rules: retrieveRules(draft, Number(payload.limit) || 10) }
}

function systemMessage() {
  return {
    role: 'system',
    content:
      '你是小红书发布前合规预检助手。你帮助创作者理解社区规则边界，给出可执行修改方向。不要声称自己代表官方最终审核；不要保证一定过审；必须基于提供的规则作答。',
  }
}

function fallbackIntentOptions(payload) {
  const draft = formatDraft(payload)
  if (/测评|对比|横评|推荐|好用|雷|同上|产品|AI|模型/i.test(draft)) {
    return [
      { id: 'recommend', label: '想推荐一个最好用的选择' },
      { id: 'compare', label: '想做多个选项的横向对比' },
    ]
  }
  return [
    { id: 'share_experience', label: '想分享自己的真实经历' },
    { id: 'give_advice', label: '想给读者一些实用建议' },
  ]
}

function fallbackCheckResult(rules, intent) {
  const top = rules[0]
  if (!top) {
    return {
      touched_rules: [],
      suggestions: [
        '补充更完整的标题、正文或具体表达场景后再做预检。',
        '优先检查是否存在绝对化承诺、攻击性措辞、站外导流、医疗金融等高风险表达。',
        '把主观体验写成具体场景和可验证依据，避免空泛评价。',
      ],
      segments: [
        {
          title: '命中哪条规则',
          body: '暂未从本地规则库中检索到高度相关的条款。建议补充更完整的标题和正文后再预检。',
          marks: ['暂未检索到'],
        },
        {
          title: '改进方向',
          body: '优先检查是否存在绝对化承诺、攻击性措辞、站外导流、医疗金融等高风险表达，并把主观体验写成具体场景。',
          marks: ['具体场景'],
        },
      ],
      matched_rules: [],
    }
  }

  return {
    touched_rules: [
      {
        rule_id: top.rule_id,
        rule_name: top.title,
        reason: `这篇可能触及「${top.title}」相关规则。规则关注的是：${clip(top.rule_text, 180)}`,
        marks: [top.title],
      },
    ],
    suggestions: [
      `保留「${intent}」这个核心意图，但把容易触发风险的表达改成更具体、可验证、非攻击性的描述。`,
      '如果涉及交易、医疗、未成年人、隐私或站外导流，要进一步删减或补充资质与边界说明。',
      '避免使用绝对化、情绪化或无事实依据的负面评价。',
    ],
    segments: [
      {
        title: '命中哪条规则',
        body: `这篇可能触及「${top.title}」相关规则。规则关注的是：${clip(top.rule_text, 180)}`,
        marks: [top.title],
      },
      {
        title: '改进方向',
        body: `你确认的意图是「${intent}」。建议保留这个核心意图，但把容易触发风险的表达改成更具体、可验证、非攻击性的描述；如果涉及交易、医疗、未成年人、隐私或站外导流，要进一步删减或补充资质与边界说明。`,
        marks: [intent, '具体、可验证'],
        footnote: '当前为本地检索兜底结果；配置 DeepSeek API Key 后会由 LLM 生成更贴合草稿的判断和建议。',
      },
    ],
    matched_rules: [top.rule_id],
  }
}

function normalizeOptions(options) {
  const cleaned = Array.isArray(options)
    ? options
        .map((option, index) => ({
          id: String(option.id || `intent_${index + 1}`).replace(/[^\w-]/g, '_'),
          label: String(option.label || '').trim(),
        }))
        .filter((option) => option.label)
        .slice(0, 3)
    : []
  return cleaned.length ? cleaned : fallbackIntentOptions({})
}

function normalizeResult(result, retrievedRules) {
  const fallback = fallbackCheckResult(retrievedRules, '未明确说明')
  const touchedRules = normalizeTouchedRules(result.touched_rules, retrievedRules)
  const suggestions = normalizeSuggestions(result.suggestions)
  const segments = Array.isArray(result.segments) && result.segments.length ? result.segments : fallback.segments
  return {
    touched_rules: touchedRules.length ? touchedRules : fallback.touched_rules,
    suggestions: suggestions.length ? suggestions : fallback.suggestions,
    segments: segments.slice(0, 3).map((segment) => ({
      title: String(segment.title || '建议').trim(),
      body: String(segment.body || '').trim(),
      marks: Array.isArray(segment.marks) ? segment.marks.map(String).slice(0, 8) : [],
      footnote: segment.footnote ? String(segment.footnote).trim() : undefined,
    })),
    matched_rules: Array.isArray(result.matched_rules) ? result.matched_rules.map(String) : [],
    retrieved_rules: retrievedRules.map(({ rule_id, title, score, keyword_score, vector_score }) => ({
      rule_id,
      title,
      score,
      keyword_score,
      vector_score,
    })),
  }
}

function normalizeTouchedRules(touchedRules, retrievedRules) {
  if (!Array.isArray(touchedRules)) return []
  return touchedRules
    .map((rule, index) => {
      const matched = retrievedRules.find((item) => item.rule_id === rule.rule_id)
      return {
        rule_id: String(rule.rule_id || matched?.rule_id || `rule_${index + 1}`),
        rule_name: String(rule.rule_name || matched?.title || rule.title || '相关规则').trim(),
        reason: stripListMarkers(String(rule.reason || rule.body || '').trim()),
        marks: Array.isArray(rule.marks) ? rule.marks.map(String).slice(0, 8) : [],
      }
    })
    .filter((rule) => rule.rule_name && rule.reason)
    .slice(0, 5)
}

function normalizeSuggestions(suggestions) {
  if (Array.isArray(suggestions)) {
    return suggestions.map((item) => stripListMarkers(String(item).trim())).filter(Boolean).slice(0, 6)
  }
  if (typeof suggestions !== 'string') return []
  return suggestions
    .split(/\n+/)
    .map((line) => stripListMarkers(line.trim()))
    .filter(Boolean)
    .slice(0, 6)
}

function stripListMarkers(text) {
  return text.replace(/^[-*•]\s*/, '').replace(/^\d+[.、]\s*/, '').trim()
}

function formatDraft(payload) {
  return [`标题：${payload.title || ''}`, `正文：${payload.body || ''}`].join('\n').trim()
}

function route(method, handler) {
  return async (req, res, next) => {
    if (req.method !== method) return next()
    try {
      const payload = await readJson(req)
      const data = await handler(payload)
      sendJson(res, 200, data)
    } catch (error) {
      sendJson(res, 500, { error: error.message })
    }
  }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      if (!body) return resolve({})
      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(data))
}

function clip(text, maxLength) {
  const value = String(text || '').trim()
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}
