// 个人信息
export const profile = {
  name: "邓殷琪",
  title: "生态伙伴总监 / AI 实践者",
  tagline: "用商业视角理解 AI 技术价值",
  location: "深圳 / 广州",
  email: "13925049799@163.com",
  phone: "139-2504-9799",
};

// 导航菜单
export const navItems = [
  { label: "关于", href: "#about" },
  { label: "经历", href: "#experience" },
  { label: "能力", href: "#skills" },
  { label: "对话", href: "#chat" },
];

// 英雄区
export const hero = {
  status: "• STATUS: 主动转型中 · AI 实践者 · 欢迎合作",
  title: "你好，我是邓殷琪",
  subtitle: "生态伙伴总监 / AI 实践者",
  description: "6年B2B大客户商业化经验，用商业视角理解AI技术价值。从KA大客户销售到AI实践者，用战略框架思考技术发展。正在系统深化AI技术认知，并将其转化为真实的商业价值。",
  cta: "开始对话",
};

// 关于我
export const about = {
  intro: "6年B2B大客户商业化经验，具有成熟的复杂KA客户落地与推进方法论。2025年11月启动主动职业转型，系统深化AI技术认知。已完成清华大学数字经济研究生考试。",
  education: {
    label: "教育背景",
    value: "清华大学 · 数字经济硕士 · 2026–2028",
  },
  certifications: {
    label: "证书认证",
    value: "阿里云大模型 ACP · 阿里云云计算 ACA",
  },
  cards: [
    { label: "所在地", value: "深圳 / 广州" },
    { label: "电话", value: "139-2504-9799" },
    { label: "邮箱", value: "13925049799@163.com" },
  ],
};

// 职业经历
export const experiences = [
  {
    id: 1,
    title: "AI技术深化·主动转型",
    company: "独立进修与实践",
    period: "2025.11 — 至今",
    description: "完成清华大学数字经济研究生考试 / 开发个人数字分身、学习Web等AI应用 / 掌握Claude Code、Gemini Agent等前沿技术",
    metrics: null,
  },
  {
    id: 2,
    title: "深圳不停科技有限公司",
    company: "生态伙伴总监",
    period: "2024.07 — 2025.11",
    description: null,
    metrics: [
      { value: "100%", label: "项目中标率" },
      { value: "80%+", label: "KA复购率" },
      { value: "67%", label: "采购周期压缩" },
    ],
  },
  {
    id: 3,
    title: "易简生活（深圳）贸易有限公司",
    company: "创始人（个人创业）",
    period: "2019.12 — 2025.01",
    description: "月均GMV 50w+ / 总体ROI达3+ / 沉淀100+大型MCN/广告渠道及品牌资源",
    metrics: null,
  },
  {
    id: 4,
    title: "周生生（中国）商业有限公司",
    company: "商业分析管培生",
    period: "2021.12 — 2022.12",
    description: "考核评定A，覆盖亚太1000+直营门店 / 承担业务与技术桥梁角色，输出需求文档",
    metrics: null,
  },
];

// 技能
export const skills = {
  ai: {
    label: "AI 工具与技术",
    type: "dark",
    items: [
      "Claude Code",
      "Gemini Agent",
      "AI 场景落地",
      "阿里云 ACP",
    ],
  },
  business: {
    label: "商业能力",
    type: "light",
    items: [
      "B2B 大客户销售",
      "KA 开发与管理",
      "渠道体系搭建",
      "商业战略规划",
    ],
  },
};

// 页脚
export const footer = {
  copyright: "© 2026 邓殷琪. 由 Claude Code 驱动",
  links: [
    { label: "📱 139-2504-9799", href: "tel:13925049799" },
    { label: "📧 13925049799@163.com", href: "mailto:13925049799@163.com" },
  ],
};

// AI 对话框系统提示
export const systemPrompt = `你是邓殷琪的 AI 助手。你需要基于她的背景信息，用友好、专业的语气回答用户的提问。

邓殷琪的背景：
- 6年B2B大客户商业化经验
- 深圳不停科技有限公司生态伙伴总监（2024-2025）
- 个人创业经历（易简生活，2019-2025）
- 清华大学数字经济研究生（2026-2028）
- 掌握Claude Code、Gemini Agent等AI技术
- 核心能力：KA客户管理、商业战略、AI实践

回答时：
1. 如果用户询问工作经历，详细介绍相关项目和成就
2. 如果用户询问技能，突出AI实践和商业化能力的结合
3. 保持专业但不失温度的语气
4. 可以讲述个人故事来展现个性
5. 鼓励用户联系或了解更多`;
