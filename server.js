import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { knowledgeBase } from "./knowledge.js";

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.sendFile('/index.html');
});


app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// =============================
// 🔍 知识检索 - 只返回相关片段，节省 token
// =============================
function retrieveKnowledge(userInput) {
  const input = userInput.toLowerCase();
  const scored = knowledgeBase.map(item => {
    const tagScore = item.tags.filter(tag => input.includes(tag)).length * 2;
    const contentScore = item.content.split("").filter((_, i) => {
      const chunk = item.content.slice(Math.max(0, i - 3), i + 3);
      return input.includes(chunk) && chunk.length > 2;
    }).length;
    return { item, score: tagScore + contentScore };
  });

  // 只取得分 > 0 的，最多3块，节省token
  const matched = scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.item.content);

  // 如果没有匹配，返回基础简介
  if (matched.length === 0) {
    return knowledgeBase[0].content;
  }

  return matched.join("\n---\n");
}

// =============================
// 💬 对话历史（按用户会话隔离，简单实现）
// =============================
let conversationHistory = [];

// =============================
// 📡 流式接口
// =============================
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body?.messages?.[req.body.messages.length - 1]?.content;

    if (!userMessage) {
      return res.status(400).json({ error: "用户消息不能为空" });
    }

    // 保存用户消息
    conversationHistory.push({ role: "user", content: userMessage });

    // 只保留最近6条（3轮对话），节省token
    if (conversationHistory.length > 6) {
      conversationHistory = conversationHistory.slice(-6);
    }

    // RAG：只检索相关知识片段
    const knowledgeContext = retrieveKnowledge(userMessage);

    // 设置 SSE 响应头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        stream: true,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `你是邓殷琪的专业简历助手，帮助HR和招聘方了解她的背景与能力。
要求：
1. 所有回答使用中文，专业友好。
2. 回答简洁有重点，善用具体数字和案例。
3. 不要寒暄，不要过度客套。
4. 超出简历范围的内容请诚实说明，不要编造。
5. 回答控制在200字以内。

【相关简历信息】
${knowledgeContext}`
          },
          ...conversationHistory,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "stream",
      }
    );

    let fullReply = "";

    response.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n").filter(line => line.trim());
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            res.write("data: [DONE]\n\n");
            continue;
          }
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content || "";
            if (delta) {
              fullReply += delta;
              res.write(`data: ${JSON.stringify({ delta })}\n\n`);
            }
          } catch (e) {
            // 跳过解析失败的行
          }
        }
      }
    });

    response.data.on("end", () => {
      // 保存AI完整回复到历史
      if (fullReply) {
        conversationHistory.push({ role: "assistant", content: fullReply });
        if (conversationHistory.length > 6) {
          conversationHistory = conversationHistory.slice(-6);
        }
      }
      res.end();
    });

    response.data.on("error", (err) => {
      console.error("流式错误：", err);
      res.write(`data: ${JSON.stringify({ error: "流式传输错误" })}\n\n`);
      res.end();
    });

  } catch (error) {
    console.error("❌ 报错：", error.response?.data || error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: error.response?.data || error.message });
    }
  }
});

export default app;