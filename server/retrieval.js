import rules from '../src/data/xhsRules.json' with { type: 'json' }

const INDEX = buildIndex(rules)

export function retrieveRules(query, limit = 10) {
  const text = normalize(expandQuery(query))
  if (!text) return []

  const queryTerms = tokenize(text)
  const queryVector = vectorize(text)

  return INDEX.map((item) => {
    const keywordScore = scoreKeywords(item, queryTerms, text)
    const vectorScore = cosine(queryVector, item.vector)
    const severityBoost = keywordScore > 0.12 ? (item.rule.severity === 'high' ? 0.04 : item.rule.severity === 'medium' ? 0.02 : 0) : 0
    const titleBoost = text.includes(normalize(item.rule.title)) ? 0.45 : 0
    return {
      ...item.rule,
      score: Number((keywordScore * 0.68 + vectorScore * 0.28 + severityBoost + titleBoost).toFixed(4)),
      keyword_score: Number(keywordScore.toFixed(4)),
      vector_score: Number(vectorScore.toFixed(4)),
    }
  })
    .filter((rule) => rule.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

function expandQuery(query) {
  const text = String(query || '')
  const expansions = []
  if (/测评|横评|对比|推荐指数|踩雷|避雷|其余都是雷|不好用|乱找|啰里八嗦|拉踩|贬低/.test(text)) {
    expansions.push('测评 虚假测评 横向测评 拉踩 贬低 低质营销 攻击 负面评价 种草 避雷')
  }
  if (/加微信|私信|联系方式|朋友圈|报价|进群|站外|链接|二维码/.test(text)) {
    expansions.push('导流 站外 引导交易 联系方式 私信 二维码 外部群组')
  }
  if (/代孕|试管|胎儿|医保|问诊|医美|整形|药/.test(text)) {
    expansions.push('医疗 医美 医疗违法服务 医疗违规营销 高风险药物')
  }
  if (/未成年|孩子|儿童|学生|早恋|早孕|防沉迷/.test(text)) {
    expansions.push('未成年人 防沉迷 早婚早孕 未成年保护')
  }
  if (/AI|人工智能|deepseek|gpt|gemini|豆包|模型/i.test(text)) {
    expansions.push('AI 人工智能 生成内容 标识')
  }
  return [text, ...expansions].join('\n')
}

export function compactRuleForPrompt(rule) {
  return [
    `规则ID：${rule.rule_id}`,
    `标题：${rule.title}`,
    `类别：${rule.category}`,
    `严重程度：${rule.severity}`,
    `规则说明：${clip(rule.rule_text, 620)}`,
    rule.case_text ? `案例：${clip(rule.case_text, 360)}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

function buildIndex(rawRules) {
  return rawRules.map((rule) => {
    const searchable = [
      rule.title,
      rule.category,
      rule.rule_text,
      rule.case_text,
      ...(rule.keywords || []),
    ].join('\n')
    return {
      rule,
      text: normalize(searchable),
      terms: tokenize(searchable),
      vector: vectorize(searchable),
    }
  })
}

function scoreKeywords(item, queryTerms, queryText) {
  let score = 0
  const matched = new Set()
  for (const term of queryTerms) {
    if (term.length < 2) continue
    if (item.text.includes(term)) {
      matched.add(term)
      score += term.length >= 4 ? 0.16 : 0.08
    }
  }

  for (const keyword of item.rule.keywords || []) {
    const normalizedKeyword = normalize(keyword)
    if (normalizedKeyword && queryText.includes(normalizedKeyword)) {
      matched.add(normalizedKeyword)
      score += 0.45
    }
  }

  if (queryText.includes(normalize(item.rule.title))) score += 0.5
  return Math.min(1, score + matched.size * 0.02)
}

function tokenize(text) {
  const normalized = normalize(text)
  const words = normalized.match(/[\p{Script=Han}A-Za-z0-9&]{2,}/gu) || []
  const grams = []
  for (const word of words) {
    if (/^[A-Za-z0-9&]+$/.test(word)) {
      grams.push(word)
      continue
    }
    if (word.length <= 4) {
      grams.push(word)
      continue
    }
    for (let i = 0; i < word.length - 1; i += 1) {
      grams.push(word.slice(i, i + 2))
    }
    for (let i = 0; i < word.length - 2; i += 1) {
      grams.push(word.slice(i, i + 3))
    }
  }
  return [...new Set(grams)]
}

function vectorize(text) {
  const vector = new Map()
  for (const token of tokenize(text)) {
    vector.set(token, (vector.get(token) || 0) + 1)
  }
  return vector
}

function cosine(left, right) {
  let dot = 0
  let leftNorm = 0
  let rightNorm = 0
  for (const value of left.values()) leftNorm += value * value
  for (const value of right.values()) rightNorm += value * value
  for (const [token, value] of left.entries()) dot += value * (right.get(token) || 0)
  if (!leftNorm || !rightNorm) return 0
  return dot / Math.sqrt(leftNorm * rightNorm)
}

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

function clip(text, maxLength) {
  const value = String(text || '').trim()
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}
