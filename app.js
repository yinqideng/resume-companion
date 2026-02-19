function sendMessage() {
    const input = document.getElementById("userInput");
    const messageList = document.getElementById("messageList");

    const userText = input.value.trim();
    if (!userText) return;

    // 显示用户消息
    const userMsg = document.createElement("div");
    userMsg.classList.add("message", "user");
    userMsg.textContent = userText;
    messageList.appendChild(userMsg);

    // 清空输入框
    input.value = "";

    // 模拟 bot 回复（Day 3 接入真实 AI）
    setTimeout(() => {
        const botMsg = document.createElement("div");
        botMsg.classList.add("message", "bot");
        botMsg.textContent = "谢谢你的问题！AI 功能将在 Day 1 接入，敬请期待 🚀";
        messageList.appendChild(botMsg);
        messageList.scrollTop = messageList.scrollHeight;
    }, 500);

    messageList.scrollTop = messageList.scrollHeight;
}

// 按 Enter 键发送
document.getElementById("userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});
