import { useState, useRef, useEffect } from 'react'
import './ChatWidget.css'

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是邓殷琪的 AI 助手 🤖 你有什么想了解的？',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const quickQuestions = [
    '简要介绍一下自己',
    '关于我的 Fun Facts',
    '过去最难搞的3个客户',
    '我的能力和优势',
  ]

  // 预设问答 - 直接返回，不消耗 token
  const presetAnswers = {
    '简要介绍一下自己': '我是邓殷琪，生态伙伴总监 / AI 实践者。拥有 6 年 B2B 大客户商业化经验，具备成熟的复杂 KA 客户落地与推进方法论。2025 年 11 月启动主动职业转型，系统深化 AI 技术认知，已完成清华大学数字经济研究生考试。',
    '关于我的 Fun Facts': '身为湖南+四川人，却完全不吃辣 🌶️。爱读毛泽东《论持久战》，习惯用宏大视角思考商业问题。对工作和生活都保持高度热情与好奇心，这让我在复杂商业环境中保持战略清醒和独立判断。',
    '过去最难搞的3个客户': '在 6 年 KA 商业化过程中，处理过多个高难度客户：1) 大型国企客户，涉及多部门协调和复杂采购流程；2) 需要深度定制化方案的头部商业客户；3) 对价格敏感但对服务要求极高的中小型企业集团。通过系统的客户管理方法论，最终都实现了成功落地和复购。',
    '我的能力和优势': '1) 战略规划：用宏大视角理解行业趋势和商业机会；2) KA 商业化：6 年经验，客户复购率 80%+；3) AI 技术应用：掌握 Claude Code、Gemini Agent 等前沿技术；4) 团队领导：主导生态伙伴的从 0-1 建设；5) 独立思考：不跟风，深入思考本质。',
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  const scrollToBottom = () => {
    const messageContainer = messagesEndRef.current?.parentElement
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight
    }
  }

  const handleSend = async (userText, isPreset = false) => {
    if (!userText.trim() || isLoading) return

    setInput('')

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText,
    }
    setMessages((prev) => [...prev, userMsg])

    // 检查是否是预设问题
    const presetAnswer = presetAnswers[userText]
    if (presetAnswer && isPreset) {
      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: presetAnswer,
      }
      setMessages((prev) => [...prev, assistantMsg])
      return
    }

    // 自由文本调用 API
    setIsLoading(true)

    try {
      const conversationMessages = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        }))

      conversationMessages.push({
        role: 'user',
        content: userText,
      })

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationMessages }),
      })

      if (!response.ok) throw new Error('请求失败')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
      }
      setMessages((prev) => [...prev, assistantMsg])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter((l) => l.trim())

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            if (parsed.delta) {
              fullText += parsed.delta
              setMessages((prev) => {
                const newMessages = [...prev]
                const lastMsg = newMessages[newMessages.length - 1]
                if (lastMsg && lastMsg.role === 'assistant') {
                  lastMsg.content = fullText
                }
                return newMessages
              })
            }
          } catch (e) {}
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '抱歉，我的大脑暂时开小差了，请稍后再试。',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <h3>邓殷琪的 AI 助手</h3>
      </div>

      {/* 快速问题按钮 */}
      <div className="quick-buttons">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            className="quick-btn"
            onClick={() => handleSend(q, true)}
            disabled={isLoading}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message chat-message-${msg.role}`}
          >
            <div className="chat-bubble">
              {msg.content || (
                <span className="chat-loading">思考中...</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="输入你的问题..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          className="chat-send"
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isLoading}
          title="发送 (Enter)"
        >
          ➜
        </button>
      </div>
    </div>
  )
}
