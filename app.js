// =============================
// 预设问答 - 直接显示，不消耗 token
// =============================
const PRESETS = {
  intro: {
    label: "简要介绍一下自己",
    answer: `邓殷琪，5年B2B大客户商业化经验，曾任深圳不停科技生态伙伴总监，主导国际KA全链路商业化及全球渠道体系搭建。

**核心数据：** 项目中标率100%，KA复购率超80%，采购周期平均压缩67%，渠道Pipeline贡献占比30%。

**行业覆盖：** 酒店、零售超市、航空等国际KA，最快2周完成CEO级建联。

持有阿里云大模型ACP及云计算ACA认证，深圳大学市场营销本科，目前同时自考上海交大计算机科学与技术。`
  },
  funfacts: {
    label: "关于我的 Fun Facts",
    answer: `• 爱读毛泽东《论持久战》，习惯用战略框架思考商业问题
• 有一双发现美食的雷达，但——身为湖南+四川人，完全不吃辣 🌶️
• 生活能量极高，对工作和生活都保持高度热情与好奇心
• 大四就独立创业，边上课边跑业务，月均GMV 50w+`
  },
  hardclients: {
    label: "过去最难搞的3个客户",
    answer: `**① 从退货到年会主角**
某KA客户曾提出退货，通过重新构建客户关系与价值，最终不仅留住，还在年会开设专场session汇报项目进展——而上一年我们CEO参加年会都只能在门外等候。

**② 1/4价格的价格战**
竞争对手以我方1/4的报价正面竞争某大客户，通过重新构建差异化价值维度，最终成功拿下。

**③ 渠道体系从0搭建**
主导全球1000+潜在经销商全量盘点，从0建立完整渠道体系，销售成本显著降低，渠道Pipeline贡献占比达30%。`
  },
  strengths: {
    label: "我的能力和优势",
    answer: `**读懂决策链：** 能快速识别客户组织内的隐形决策影响者，将中立方转化为支持方，推动复杂局面下的采购决策收敛

**高层对话：** 在无资源背书情况下独立完成高层建联，能用高管语言沟通，而不是停留在执行层

**全链路项目掌控：** 从建联到PoC、首单到复购独立主导，中标率100%，采购周期平均压缩67%

**AI产品落地：** 具备将AI产品价值转化为客户业务语言的能力，能帮客户想清楚"怎么用、用在哪、怎么证明价值"

**快速适应：** 可在短周期内掌握陌生业务场景并形成有效打法`
  }
};

// =============================
// 预设按钮点击 - 不消耗 token
// =============================
function askPreset(key) {
  const preset = PRESETS[key];
  if (!preset) return;
  appendMessage("user", preset.label);
  appendMessage("bot", preset.answer);
}

// =============================
// 主发送函数（流式输出）
// =============================
async function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (!userText) return;

  input.value = "";
  appendMessage("user", userText);

  // 创建 bot 消息气泡，先显示 loading
  const botDiv = createBotBubble();

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: userText }]
      })
    });

    if (!response.ok) throw new Error("请求失败");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let isFirst = true;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(l => l.trim());

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6);
        if (data === "[DONE]") break;

        try {
          const parsed = JSON.parse(data);
          if (parsed.delta) {
            if (isFirst) {
              botDiv.innerHTML = "";
              isFirst = false;
            }
            fullText += parsed.delta;
            botDiv.innerHTML = marked.parse(fullText);
            scrollToBottom();
          }
        } catch (e) {}
      }
    }

  } catch (error) {
    console.error("❌ 请求失败：", error);
    botDiv.innerHTML = "发生错误，请检查后端是否运行";
  }
}

// =============================
// DOM 工具函数
// =============================
function appendMessage(role, text) {
  const messageList = document.getElementById("messageList");
  const div = document.createElement("div");
  div.classList.add("message", role);
  div.innerHTML = marked.parse(text);
  messageList.appendChild(div);
  scrollToBottom();
  return div;
}

function createBotBubble() {
  const messageList = document.getElementById("messageList");
  const div = document.createElement("div");
  div.classList.add("message", "bot");
  div.innerHTML = `<span class="loading-dots">思考中<span>.</span><span>.</span><span>.</span></span>`;
  messageList.appendChild(div);
  scrollToBottom();
  return div;
}

function scrollToBottom() {
  const messageList = document.getElementById("messageList");
  messageList.scrollTop = messageList.scrollHeight;
}

// =============================
// 回车发送
// =============================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });
});