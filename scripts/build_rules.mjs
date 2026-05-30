import fs from 'node:fs'
import path from 'node:path'

const projectRoot = path.resolve(import.meta.dirname, '..')
const defaultInput = '/Users/heyuxuan/Desktop/小红书社区规范_整理版.md'
const inputPath = process.argv[2] || defaultInput
const outputPath =
  process.argv[3] || path.join(projectRoot, 'src', 'data', 'xhsRules.json')

const markdown = fs.readFileSync(inputPath, 'utf8')
const sections = markdown.split(/^## 规则 /m).slice(1)

const parsedRules = sections.map((section, index) => {
  const [headingLine = '', ...rest] = section.split('\n')
  const titleMatch = headingLine.match(/^\d+：(.+?)\s*$/)
  const title = titleMatch?.[1]?.trim() || `规则 ${index + 1}`
  const body = rest.join('\n').trim()
  const source = body.match(/来源图片：`([^`]+)`/)?.[1] || ''
  const ruleText = extractBetween(body, '### 规则说明', '### 案例解读')
  const caseText = extractAfter(body, '### 案例解读')
  const keywords = buildKeywords([title, ruleText, caseText].join('\n'))

  return {
    rule_id: `xhs_${String(index + 1).padStart(3, '0')}`,
    title,
    category: inferCategory(title, ruleText),
    severity: inferSeverity(title, ruleText),
    rule_text: cleanText(ruleText),
    case_text: cleanText(caseText),
    keywords,
    sources: [source].filter(Boolean),
  }
})

const deduped = []
const seen = new Map()
for (const rule of parsedRules) {
  const key = `${rule.title}\n${rule.rule_text}\n${rule.case_text}`
  const existingIndex = seen.get(key)
  if (existingIndex !== undefined) {
    deduped[existingIndex].sources.push(...rule.sources)
    continue
  }
  seen.set(key, deduped.length)
  deduped.push(rule)
}

const rules = deduped.map((rule, index) => ({
  ...rule,
  rule_id: `xhs_${String(index + 1).padStart(3, '0')}`,
}))

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(rules, null, 2)}\n`)
console.log(`Wrote ${rules.length} rules to ${outputPath}`)

function extractBetween(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker)
  if (start === -1) return ''
  const from = start + startMarker.length
  const end = text.indexOf(endMarker, from)
  return text.slice(from, end === -1 ? undefined : end)
}

function extractAfter(text, marker) {
  const start = text.indexOf(marker)
  if (start === -1) return ''
  return text.slice(start + marker.length)
}

function cleanText(text) {
  return text
    .replace(/来源图片：`[^`]+`/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function buildKeywords(text) {
  const normalized = text.replace(/[^\p{Script=Han}A-Za-z0-9&]+/gu, ' ')
  const candidates = normalized.match(/[\p{Script=Han}A-Za-z0-9&]{2,}/gu) || []
  const stop = new Set([
    '平台',
    '内容',
    '规则',
    '相关',
    '可能',
    '包括',
    '进行',
    '用户',
    '小红薯',
    '案例',
    '解读',
    '发布',
    '展示',
  ])
  const counts = new Map()
  for (const word of candidates) {
    if (stop.has(word) || word.length > 16) continue
    counts.set(word, (counts.get(word) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-Hans-CN'))
    .slice(0, 16)
    .map(([word]) => word)
}

function inferCategory(title, text) {
  const source = `${title}\n${text}`
  const categories = [
    ['AI', /AI|Al|人工智能/i],
    ['医疗医美', /医疗|医美|药物|代孕|试管|医保/],
    ['交易与导流', /交易|导流|广告|账号买卖|养号|站外|招聘|兼职/],
    ['未成年人', /未成年|防沉迷|早婚|早孕/],
    ['违法违规', /违法|国家|军警|危险|管制|公共安全/],
    ['互动与隐私', /攻击|隐私|骚扰|网暴|互动/],
    ['色情低俗', /性服务|隐私部位|拍摄角度|色情|擦边/],
    ['虚假与低质', /虚假|谣言|低质|博眼球|引流技巧|标题/],
  ]
  return categories.find(([, pattern]) => pattern.test(source))?.[0] || '社区规范'
}

function inferSeverity(title, text) {
  const source = `${title}\n${text}`
  if (/国家安全|违法|性侵害|未成年|自我伤害|公共安全|管制|诈骗|毒|暴力|泄密/.test(source)) {
    return 'high'
  }
  if (/医疗|医美|金融|交易|导流|隐私|网暴|攻击|虚假|色情|低俗/.test(source)) {
    return 'medium'
  }
  return 'low'
}
