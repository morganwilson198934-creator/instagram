// ========================================
// Live Chat Widget
// ========================================
(function() {
  function getResponse(key) {
    if (typeof t === 'function') return t('chat_' + key);
    return agentResponses[key] || '';
  }

  var agentResponses = {
    greeting: function() { return typeof t === 'function' ? [t('chat_greeting1'), t('chat_greeting2')] : ["Hi there! Welcome to Instagram Online Giveaway! I'm Sarah, your support agent. How can I help you today?", "Hey! Thanks for reaching out. I'm here to help with any questions about the giveaway!"]; },
    "how to enter": function() { return typeof t === 'function' ? t('chat_howtoenter') : "To enter..."; },
    "when winners": function() { return typeof t === 'function' ? t('chat_whenwinners') : "Winners..."; },
    prize: function() { return typeof t === 'function' ? t('chat_prizes') : "Prizes..."; },
    "claim prize": function() { return typeof t === 'function' ? t('chat_claim') : "If you've won..."; },
    eligibility: function() { return typeof t === 'function' ? t('chat_eligibility') : "The giveaway..."; },
    contact: function() { return typeof t === 'function' ? t('chat_contact') : "You can reach..."; },
    scam: function() { return typeof t === 'function' ? t('chat_scam') : "This is 100%..."; },
    help: function() { return typeof t === 'function' ? t('chat_help') : "I can help..."; },
    default: function() { return typeof t === 'function' ? t('chat_default') : "Thanks for your message!..."; }
  };

  function getQuickReplies() {
    if (typeof t === 'function') {
      return [t('chat_quick_how'), t('chat_quick_prizes'), t('chat_quick_winners'), t('chat_quick_claim'), t('chat_quick_legit')];
    }
    return ["How to enter?", "What are the prizes?", "When are winners?", "How to claim?", "Is it legit?"];
  }

  function getTimeStr() {
    var lang = (typeof window !== 'undefined' && window.__currentLang) || 'en';
    var localeMap = { en: 'en-US', es: 'es-ES', fr: 'fr-FR', pt: 'pt-BR', de: 'de-DE', it: 'it-IT', ar: 'ar-SA', hi: 'hi-IN', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR', tr: 'tr-TR' };
    return new Date().toLocaleTimeString(localeMap[lang] || 'en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  function getAgentResponse(msg) {
    const lower = msg.toLowerCase();
    if (lower.match(/\b(hi|hello|hey|good morning|good evening|what'?s up|sup)\b/)) { var greetings = typeof agentResponses.greeting === 'function' ? agentResponses.greeting() : agentResponses.greeting; return greetings[Math.floor(Math.random() * greetings.length)]; }
    if (lower.match(/how.*(enter|join|participate|sign up|register)/)) return typeof agentResponses["how to enter"] === 'function' ? agentResponses["how to enter"]() : agentResponses["how to enter"];
    if (lower.match(/when.*(winner|announce|result)/)) return typeof agentResponses["when winners"] === 'function' ? agentResponses["when winners"]() : agentResponses["when winners"];
    if (lower.match(/prize|reward|win|iphone|airpod|watch|gift card|merch/)) return typeof agentResponses.prize === 'function' ? agentResponses.prize() : agentResponses.prize;
    if (lower.match(/claim|collect|receive|get.*prize|shipping|deliver/)) return typeof agentResponses["claim prize"] === 'function' ? agentResponses["claim prize"]() : agentResponses["claim prize"];
    if (lower.match(/eligib|qualify|who.*can|age|requirement|country|region/)) return typeof agentResponses.eligibility === 'function' ? agentResponses.eligibility() : agentResponses.eligibility;
    if (lower.match(/contact|phone|email|reach|call|speak|talk.*agent/)) return typeof agentResponses.contact === 'function' ? agentResponses.contact() : agentResponses.contact;
    if (lower.match(/legit|real|fake|scam|trust|honest|genuine|real\?/)) return typeof agentResponses.scam === 'function' ? agentResponses.scam() : agentResponses.scam;
    if (lower.match(/help|support|assist|what can|how do|question/)) return typeof agentResponses.help === 'function' ? agentResponses.help() : agentResponses.help;
    return typeof agentResponses.default === 'function' ? agentResponses.default() : agentResponses.default;
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
          <div class="chat-agent-name" data-i18n="chat_agent_name">Sarah — Support Agent</div>
          <div class="chat-agent-status" data-i18n="chat_online"><span class="status-dot"></span> Online now</div>
        </div>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-quick-replies" id="chatQuickReplies"></div>
      <div class="chat-input-area">
        <input type="text" class="chat-input" id="chatInput" placeholder="Type a message..." data-i18n-placeholder="chat_placeholder" autocomplete="off" />
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
    const avatarText = sender === 'user' ? (typeof t === 'function' ? t('chat_you') : 'You') : 'S';
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
    getQuickReplies().forEach(text => {
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
        var greetings = typeof agentResponses.greeting === 'function' ? agentResponses.greeting() : agentResponses.greeting;
        addMessage(greetings[0], 'agent');
        setTimeout(renderQuickReplies, 400);
      }, 500);
    }
  });

  // Send
  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(input.value);
  });

  // Update quick replies on language change
  document.addEventListener('languageChanged', function() {
    if (isOpen) renderQuickReplies();
  });
})();
