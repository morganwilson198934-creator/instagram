// ========================================
// Live Chat Widget (with admin reply support)
// ========================================
(function() {
  var CHAT_KEY = 'ig_livechat';
  var visitorId = sessionStorage.getItem('chatVisitorId');
  if (!visitorId) {
    visitorId = 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    sessionStorage.setItem('chatVisitorId', visitorId);
  }

  function getConversations() {
    try { return JSON.parse(localStorage.getItem(CHAT_KEY)) || {}; } catch(e) { return {}; }
  }
  function saveConversations(data) {
    localStorage.setItem(CHAT_KEY, JSON.stringify(data));
  }
  function getMyConversation() {
    var convs = getConversations();
    if (!convs[visitorId]) {
      convs[visitorId] = { id: visitorId, visitor: 'Visitor', startedAt: new Date().toISOString(), unread: 0, messages: [] };
      saveConversations(convs);
    }
    return convs[visitorId];
  }
  function addMsgToStorage(sender, text) {
    var convs = getConversations();
    if (!convs[visitorId]) {
      convs[visitorId] = { id: visitorId, visitor: 'Visitor', startedAt: new Date().toISOString(), unread: 0, messages: [] };
    }
    var msg = { id: Date.now(), sender: sender, text: text, time: new Date().toISOString() };
    convs[visitorId].messages.push(msg);
    if (sender === 'user') convs[visitorId].unread = (convs[visitorId].unread || 0) + 1;
    saveConversations(convs);
    try { channel.postMessage({ type: 'newMessage', visitorId: visitorId, msg: msg }); } catch(e) {}
    return msg;
  }

  var channel;
  try { channel = new BroadcastChannel('ig_chat_channel'); } catch(e) { channel = null; }

  if (channel) {
    channel.onmessage = function(e) {
      if (e.data && e.data.type === 'newMessage' && e.data.visitorId === visitorId && e.data.msg.sender === 'admin') {
        addMessage(e.data.msg.text, 'admin');
      }
      if (e.data && e.data.type === 'adminReply' && e.data.visitorId === visitorId) {
        addMessage(e.data.text, 'admin');
      }
    };
  }

  // Poll for admin replies as fallback
  var lastMsgCount = 0;
  setInterval(function() {
    var conv = getConversations()[visitorId];
    if (!conv) return;
    var msgs = conv.messages;
    if (msgs.length > lastMsgCount) {
      for (var i = lastMsgCount; i < msgs.length; i++) {
        if (msgs[i].sender === 'admin') {
          addMessage(msgs[i].text, 'admin');
        }
      }
      lastMsgCount = msgs.length;
    }
  }, 2000);

  function getResponse(key) {
    if (typeof t === 'function') return t('chat_' + key);
    return agentResponses[key] || '';
  }

  var agentResponses = {
    greeting: function() { return typeof t === 'function' ? [t('chat_greeting1'), t('chat_greeting2')] : ["Hi there! Welcome to Instagram Online Giveaway! I'm your support agent. How can I help you today?", "Hey! Thanks for reaching out. I'm here to help with any questions about the giveaway!"]; },
    "how to enter": function() { return typeof t === 'function' ? t('chat_howtoenter') : "To enter, simply fill out the entry form on our website. It takes less than a minute!"; },
    "when winners": function() { return typeof t === 'function' ? t('chat_whenwinners') : "Winners are announced within 48 hours after the giveaway ends. Make sure notifications are on!"; },
    prize: function() { return typeof t === 'function' ? t('chat_prizes') : "Our grand prize is $320,000! We also give away iPhones, AirPods, Apple Watches, gift cards, and merch bundles."; },
    "claim prize": function() { return typeof t === 'function' ? t('chat_claim') : "If you've won, you'll receive a DM from our official account. Follow the instructions to claim your prize within 7 days."; },
    eligibility: function() { return typeof t === 'function' ? t('chat_eligibility') : "The giveaway is open to all Instagram users aged 18+ with a public account."; },
    contact: function() { return typeof t === 'function' ? t('chat_contact') : "You can reach us by phone at +1 (719) 466-6623 or email admin@instagiveaway.com. Our team responds within 24 hours."; },
    scam: function() { return typeof t === 'function' ? t('chat_scam') : "This is 100% legitimate! We're an official Instagram giveaway. Check our verified winners list for proof!"; },
    help: function() { return typeof t === 'function' ? t('chat_help') : "I can help with questions about entering, prizes, winners, claiming prizes, or anything else about the giveaway!"; },
    default: function() { return typeof t === 'function' ? t('chat_default') : "Thanks for your message! A support agent will review this shortly. In the meantime, check out our FAQ section for instant answers."; }
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
    var lower = msg.toLowerCase();
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

  var cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = 'chat-widget.css';
  document.head.appendChild(cssLink);

  var widget = document.createElement('div');
  widget.innerHTML = '<button class="chat-fab" id="chatFab" aria-label="Open live chat">' +
    '<svg class="fab-chat" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>' +
    '<svg class="fab-close" viewBox="0 0 24 24" style="width:24px;height:24px;fill:#fff"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' +
    '<div class="fab-badge"></div>' +
    '</button>' +
    '<div class="chat-window" id="chatWindow">' +
    '<div class="chat-header">' +
    '<div class="chat-agent-avatar"><div class="online-dot"></div>\u{1F469}\u200D\u{1F4BC}</div>' +
    '<div class="chat-agent-info">' +
    '<div class="chat-agent-name" data-i18n="chat_agent_name">Online Support</div>' +
    '<div class="chat-agent-status" data-i18n="chat_online"><span class="status-dot"></span> Online now</div>' +
    '</div>' +
    '</div>' +
    '<div class="chat-messages" id="chatMessages"></div>' +
    '<div class="chat-quick-replies" id="chatQuickReplies"></div>' +
    '<div class="chat-input-area">' +
    '<input type="text" class="chat-input" id="chatInput" placeholder="Type a message..." data-i18n-placeholder="chat_placeholder" autocomplete="off" />' +
    '<button class="chat-send-btn" id="chatSendBtn" aria-label="Send message">' +
    '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>' +
    '</button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(widget);

  var fab = document.getElementById('chatFab');
  var window_ = document.getElementById('chatWindow');
  var messages = document.getElementById('chatMessages');
  var input = document.getElementById('chatInput');
  var sendBtn = document.getElementById('chatSendBtn');
  var quickRepliesContainer = document.getElementById('chatQuickReplies');
  var isOpen = false;
  var hasGreeted = false;

  function addMessage(text, sender) {
    var msg = document.createElement('div');
    msg.className = 'chat-msg ' + sender;
    var avatarClass = sender === 'user' ? 'msg-avatar user-avatar' : (sender === 'admin' ? 'msg-avatar admin-avatar' : 'msg-avatar');
    var avatarText = sender === 'user' ? (typeof t === 'function' ? t('chat_you') : 'You') : (sender === 'admin' ? '\u{1F464}' : 'S');
    msg.innerHTML = '<div class="' + avatarClass + '">' + avatarText + '</div>' +
      '<div><div class="msg-bubble">' + text.replace(/\n/g, '<br>') + '</div>' +
      '<div class="msg-time">' + getTimeStr() + (sender === 'admin' ? ' \u2022 Support' : '') + '</div></div>';
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    var typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<div class="msg-avatar">S</div><div class="typing-dots"><span></span><span></span><span></span></div>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    var el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  function renderQuickReplies() {
    quickRepliesContainer.innerHTML = '';
    getQuickReplies().forEach(function(text) {
      var btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = text;
      btn.addEventListener('click', function() { sendMessage(text); });
      quickRepliesContainer.appendChild(btn);
    });
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    input.value = '';
    addMessage(text, 'user');
    addMsgToStorage('user', text);
    quickRepliesContainer.innerHTML = '';

    showTyping();
    var delay = 800 + Math.random() * 1200;
    setTimeout(function() {
      hideTyping();
      var response = getAgentResponse(text);
      addMessage(response, 'agent');
      addMsgToStorage('agent', response);
      setTimeout(renderQuickReplies, 300);
    }, delay);
  }

  fab.addEventListener('click', function() {
    isOpen = !isOpen;
    fab.classList.toggle('active', isOpen);
    window_.classList.toggle('open', isOpen);

    if (isOpen && !hasGreeted) {
      hasGreeted = true;
      setTimeout(function() {
        var greetings = typeof agentResponses.greeting === 'function' ? agentResponses.greeting() : agentResponses.greeting;
        addMessage(greetings[0], 'agent');
        addMsgToStorage('agent', greetings[0]);
        setTimeout(renderQuickReplies, 400);
      }, 500);
    }
  });

  sendBtn.addEventListener('click', function() { sendMessage(input.value); });
  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') sendMessage(input.value); });

  document.addEventListener('languageChanged', function() {
    if (isOpen) renderQuickReplies();
  });
})();
