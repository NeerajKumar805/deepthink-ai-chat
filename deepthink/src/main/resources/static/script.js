let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    let autoScroll = true;

    function initChat() {
      const chatBox = document.getElementById('chat-box');
      chatBox.innerHTML = ''; // Clear the chat box initially
      if (chatHistory.length === 0) {
        // Create a centered greet message container
        const greetContainer = document.createElement('div');
        greetContainer.className = 'greet-message';
        greetContainer.innerHTML = marked.parse("**What can I help with?**");
        chatBox.appendChild(greetContainer);
      } else {
        chatHistory.forEach(msg => {
          chatBox.appendChild(createMessageElement(msg.role, msg.content, msg.timestamp));
        });
      }
      scrollToBottom();
    }

    function createMessageElement(role, content, timestamp) {
      const div = document.createElement('div');
      div.className = `message ${role}-message`;
      div.innerHTML = `
        <div class="message-content">
          ${marked.parse(content)}
          <button class="copy-message-btn btn btn-sm btn-secondary" onclick="copyMessage(this)">
            <i class="fas fa-copy"></i>
          </button>
          <span class="timestamp">${formatTime(timestamp)}</span>
        </div>
      `;
      addCodeActions(div);
      return div;
    }

    function addCodeActions(container) {
      container.querySelectorAll('pre').forEach(pre => {
        pre.style.position = 'relative';
        if (!pre.querySelector('.copy-btn')) {
          const copyBtn = document.createElement('button');
          copyBtn.className = 'copy-btn btn btn-sm btn-secondary';
          copyBtn.innerHTML = '<i class="far fa-copy"></i>';
          copyBtn.onclick = () => copyCode(pre);
          pre.appendChild(copyBtn);
        }
      });
    }

    function copyCode(pre) {
      const code = pre.querySelector('code').innerText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          const btn = pre.querySelector('.copy-btn');
          btn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            btn.innerHTML = '<i class="far fa-copy"></i>';
          }, 2000);
        }).catch(err => console.error("Clipboard API error:", err));
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          const btn = pre.querySelector('.copy-btn');
          btn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            btn.innerHTML = '<i class="far fa-copy"></i>';
          }, 2000);
        } catch (err) {
          console.error("Fallback: Unable to copy", err);
        }
        document.body.removeChild(textarea);
      }
    }

    function copyMessage(btn) {
      const messageContent = btn.parentElement;
      const text = messageContent.innerText.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          btn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i>';
          }, 2000);
        }).catch(err => console.error(err));
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          btn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i>';
          }, 2000);
        } catch (err) {
          console.error("Fallback: Unable to copy", err);
        }
        document.body.removeChild(textarea);
      }
    }

    function clearHistory() {
      localStorage.removeItem('chatHistory');
      chatHistory = [];
      document.getElementById('chat-box').innerHTML = '';
      initChat();
    }

    function downloadChat() {
      const content = chatHistory.map(msg => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = msg.content;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        return `[${formatTime(msg.timestamp)}] ${msg.role.toUpperCase()}: ${textContent}`;
      }).join("\n\n");
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "chat_history.txt";
      a.click();
      URL.revokeObjectURL(url);
    }

    function autoGrow(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }

    function scrollToBottom() {
      const chatBox = document.getElementById('chat-box');
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function handleUserScroll() {
      const chatBox = document.getElementById('chat-box');
      const isNearBottom = chatBox.scrollHeight - chatBox.clientHeight - chatBox.scrollTop < 50;
      autoScroll = isNearBottom;
    }

    function formatTime(isoString) {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function saveHistory() {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    let isSending = false;

    async function sendMessage() {
      if (isSending) return;
      isSending = true;
      const queryInput = document.getElementById('query');
      const query = queryInput.value.trim();
      if (!query) {
        isSending = false;
        return;
      }
      const sendButton = document.getElementById('send-button');
      sendButton.disabled = true;
      const chatBox = document.getElementById('chat-box');

      // Remove the greet message if it exists
      const greetEl = document.querySelector('.greet-message');
      if (greetEl) {
        greetEl.remove();
      }
      
      // Append user message (aligned right)
      const userMsg = {
        role: 'user',
        content: query,
        timestamp: new Date().toISOString()
      };
      chatHistory.push(userMsg);
      saveHistory();
      chatBox.appendChild(createMessageElement('user', query, userMsg.timestamp));
      
      queryInput.value = '';
      setTimeout(scrollToBottom, 0);
      scrollToBottom();

      // Append bot placeholder
      const botMessageDiv = document.createElement('div');
      botMessageDiv.className = 'bot-message';
      botMessageDiv.innerHTML = `
        <strong>Bot:</strong>
        <div class="message-content">Typing...</div>
      `;
      chatBox.appendChild(botMessageDiv);
      const botContent = botMessageDiv.querySelector('.message-content');

      try {
        const response = await fetch(`http://192.168.29.204:8081/api/v2/chat?query=${encodeURIComponent(query)}`, {
          method: "POST"
        });
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = '';

        function read() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              chatBox.removeEventListener('scroll', handleUserScroll);
              botContent.innerHTML = marked.parse(buffer);
              hljs.highlightAll();
              addCodeActions(botMessageDiv);
              sendButton.disabled = false;
              chatHistory.push({
                role: 'bot',
                content: buffer,
                timestamp: new Date().toISOString()
              });
              saveHistory();
              scrollToBottom();
              isSending = false;
              return;
            }
            buffer += decoder.decode(value, { stream: true });
            botContent.innerHTML = marked.parse(buffer);
            hljs.highlightAll();
            addCodeActions(botMessageDiv);
            if (autoScroll) {
              scrollToBottom();
            }
            return read();
          });
        }
        
        chatBox.addEventListener('scroll', handleUserScroll);
        await read();
      } catch (error) {
        console.error("Error:", error);
        botContent.innerHTML = marked.parse("**Error:** Sorry, there was an error processing your request.");
        sendButton.disabled = false;
        isSending = false;
      }
    }

    document.getElementById('query').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }
    });

    initChat();
    hljs.highlightAll();