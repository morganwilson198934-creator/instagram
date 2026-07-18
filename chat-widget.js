// ========================================
// Live Chat Widget
// ========================================
(function() {
  // Agent responses mapping
  const agentResponses = {
    greeting: [
      "Hi there! Welcome to Instagram Online Giveaway! I'm Sarah, your support agent. How can I help you today?",
      "Hey! Thanks for reaching out. I'm here to help with any questions about the giveaway!"
    ],
    "how to enter": "To enter the giveaway, simply:\n\n1. Like our latest Instagram post\n2. Follow our account\n3. Tag 3 friends in the comments\n4. Share the post to your story for bonus entries\n\nYou can also fill out the entry form on our website for a guaranteed spot!",
    "when winners": "Winners are announced every week on our Instagram page! Make sure you have notifications turned on so you don't miss it. You can also check the Winning List page anytime to see past winners.",
    prize: "We have amazing prizes this season!\n\n🏆 iPhone 16 Pro Max\n🎧 AirPods Pro 2\n⌚ Apple Watch SE\n🛍️ $100 Gift Cards\n🎮 Merch Bundles\n\nTotal prize pool: $320,000!",
    "claim prize": "If you've won, congratulations! Here's what to do:\n\n1. Check your Instagram DMs - we'll message you directly\n2. Reply to confirm your identity\n3. Provide your shipping details\n4. Your prize will arrive within 14 business days\n\nNeed help? I'm right here!",
    eligibility: "The giveaway is open to all users aged 18+ in America and Europe. You need a public Instagram account to be eligible for prize fulfillment.",
    contact: "You can reach us through:\n\n📞 Phone: +1 (800) 555-0199\n📧 Email: support@yourgiveaway.com\n💬 Live Chat: Right here!\n\nWe're available Mon-Fri, 9AM-6PM EST.",
    scam: "This is 100% legitimate! We're verified by Instagram and all our winners are publicly listed on the Winning List page. Check out the real winner stories and testimonials on our site!",
    help: "I can help you with:\n\n• How to enter the giveaway\n• Prize information\n• Winner announcements\n• Claiming your prize\n• Account eligibility\n• Contact information\n\nJust type your question or tap one of the quick options below!",
    default: "Thanks for your message! I'm here to help. Could you tell me more about what you're looking for? You can also try one of the quick reply options below."
  };

  const quickReplies = [
    "How to enter?",
    "What are the prizes?",
    "When are winners?",
    "How to claim?",
    "Is it legit?"
  ];

  function getTimeStr() {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  function getAgentResponse(msg) {
    const lower = msg.toLowerCase();
    if (lower.match(/\b(hi|hello|hey|good morning|good evening|what'?s up|sup)\b/)) return agentResponses.greeting[Math.floor(Math.random() * agentResponses.greeting.length)];
    if (lower.match(/how.*(enter|join|participate|sign up|register)/)) return agentResponses["how to enter"];
    if (lower.match(/when.*(winner|announce|result)/)) return agentResponses["when winners"];
    if (lower.match(/prize|reward|win|iphone|airpod|watch|gift card|merch/)) return agentResponses.prize;
    if (lower.match(/claim|collect|receive|get.*prize|shipping|deliver/)) return agentResponses["claim prize"];
    if (lower.match(/eligib|qualify|who.*can|age|requirement|country|region/)) return agentResponses.eligibility;
    if (lower.match(/contact|phone|email|reach|call|speak|talk.*agent/)) return agentResponses.contact;
    if (lower.match(/legit|real|fake|scam|trust|honest|genuine|real\?/)) return agentResponses.scam;
    if (lower.match(/help|support|assist|what can|how do|question/)) return agentResponses.help;
    return agentResponses.default;
  }

  // Build widget DOM
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = 'chat-widget.css';
  document.head.appendChild(cssLink);

  const widget = document.createElement('div');
  widget.innerHTML = `
    <button class="chat-fab" id="chatFab" aria-label="Open live chat">
      <svg class="fab-chat" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      <svg class="fab-close" viewBox="0 0 24 24" style="width:24px;height:24px;fill:#fff"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      <div class="fab-badge"></div>
    </button>
    <div class="chat-window" id="chatWindow">
      <div class="chat-header">
        <div class="chat-agent-avatar">
          👩‍💼
          <div class="online-dot"></div>
        </div>
        <div class="chat-agent-info">
          <div class="chat-agent-name">Sarah — Support Agent</div>
          <div class="chat-agent-status"><span class="status-dot"></span> Online now</div>
        </div>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-quick-replies" id="chatQuickReplies"></div>
      <div class="chat-input-area">
        <input type="text" class="chat-input" id="chatInput" placeholder="Type a message..." autocomplete="off" />
        <button class="chat-send-btn" id="chatSendBtn" aria-label="Send message">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(widget);

  const fab = document.getElementById('chatFab');
  const window_ = document.getElementById('chatWindow');
  const messages = document.getElementById('chatMessages');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const quickRepliesContainer = document.getElementById('chatQuickReplies');
  let isOpen = false;
  let hasGreeted = false;

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    const avatarClass = sender === 'user' ? 'msg-avatar user-avatar' : 'msg-avatar';
    const avatarText = sender === 'user' ? 'You' : 'S';
    msg.innerHTML = `
      <div class="${avatarClass}">${avatarText}</div>
      <div>
        <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
        <div class="msg-time">${getTimeStr()}</div>
      </div>
    `;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.id = 'typingIndicator';
    typing.innerHTML = `
      <div class="msg-avatar">S</div>
      <div class="typing-dots"><span></span><span></span><span></span></div>
    `;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  function renderQuickReplies() {
    quickRepliesContainer.innerHTML = '';
    quickReplies.forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = text;
      btn.addEventListener('click', () => sendMessage(text));
      quickRepliesContainer.appendChild(btn);
    });
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    input.value = '';
    addMessage(text, 'user');
    quickRepliesContainer.innerHTML = '';

    showTyping();
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      hideTyping();
      const response = getAgentResponse(text);
      addMessage(response, 'agent');
      setTimeout(renderQuickReplies, 300);
    }, delay);
  }

  // Toggle
  fab.addEventListener('click', () => {
    isOpen = !isOpen;
    fab.classList.toggle('active', isOpen);
    window_.classList.toggle('open', isOpen);

    if (isOpen && !hasGreeted) {
      hasGreeted = true;
      setTimeout(() => {
        addMessage(agentResponses.greeting[0], 'agent');
        setTimeout(renderQuickReplies, 400);
      }, 500);
    }
  });

  // Send
  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(input.value);
  });
})();
