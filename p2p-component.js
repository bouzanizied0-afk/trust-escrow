/**
 * P2P Trading Platform Module - Professional Fixed Version
 */

const p2pAppData = {
    currentPage: "market",
    currentChat: null,
    isRecording: false,
    recordingStartTime: null,
    recordingInterval: null,
    traders: {
        "CryptoTrader88": { name: "CryptoTrader88", status: "online", color: "primary", icon: "user" },
        "BitcoinPro": { name: "BitcoinPro", status: "offline", color: "warning", icon: "user" },
        "CryptoQueen": { name: "CryptoQueen", status: "online", color: "success", icon: "user" },
        "TradingMaster": { name: "TradingMaster", status: "offline", color: "danger", icon: "user" }
    },
    messages: {
        "CryptoTrader88": [
            { id: 1, sender: "them", type: "text", content: "Hello! Is the BTC available?", timestamp: "10:30 AM", status: "read" }
        ],
        "BitcoinPro": [], "CryptoQueen": [], "TradingMaster": []
    }
};

const P2PEngine = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        console.log("P2P Engine Initialized");
    },

    cacheDOM() {
        this.pages = {
            market: document.getElementById("marketPage"),
            messages: document.getElementById("messagesPage"),
            orders: document.getElementById("ordersPage"),
            disputes: document.getElementById("disputesPage")
        };
        this.messagesContainer = document.getElementById("messagesContainer");
        this.messageInput = document.getElementById("messageInput");
        this.chatView = document.getElementById("chatView");
        this.conversationsList = document.getElementById("conversationsList");
        
        this.uiElements = {
            attachmentMenu: document.getElementById("attachmentMenu"),
            emojiPicker: document.getElementById("emojiPicker"),
            voiceRecorder: document.getElementById("voiceRecorder"),
            typingIndicator: document.getElementById("typingIndicator"),
            recordingTime: document.getElementById("recordingTime"),
            recordingVisualizer: document.getElementById("recordingVisualizer")
        };
    },

    bindEvents() {
        // زر الإرسال
        const sendBtn = document.getElementById("sendButton");
        if(sendBtn) sendBtn.onclick = () => this.handleSendMessage();

        // الضغط على Enter للإرسال
        if(this.messageInput) {
            this.messageInput.onkeypress = (e) => {
                if (e.key === "Enter") this.handleSendMessage();
            };
        }

        // أزرار القوائم
        const attachBtn = document.getElementById("attachmentButton");
        if(attachBtn) attachBtn.onclick = () => this.toggleUIComponent('attachmentMenu');

        const emojiBtn = document.getElementById("emojiButton");
        if(emojiBtn) emojiBtn.onclick = () => this.toggleUIComponent('emojiPicker');

        const closeEmoji = document.getElementById("closeEmojiPicker");
        if(closeEmoji) closeEmoji.onclick = () => this.hideUIComponent('emojiPicker');

        const backBtn = document.getElementById("backToConversations");
        if(backBtn) backBtn.onclick = () => this.showConversationsList();

        // نظام النقر المفوض (للتجار)
        this.initDelegatedClicks();
        
        // خيارات الإيموجي
        document.querySelectorAll(".emoji-option").forEach(btn => {
            btn.onclick = () => {
                this.messageInput.value += btn.textContent;
                this.messageInput.focus();
            };
        });
    },

    // --- نظام الملاحة ---
    navigateToPage(pageId) {
        Object.keys(this.pages).forEach(key => {
            if(this.pages[key]) this.pages[key].classList.add("hidden");
        });
        if(this.pages[pageId]) this.pages[pageId].classList.remove("hidden");
    },

    // --- نظام الدردشة ---
    showChatView(traderName) {
        if(!this.conversationsList || !this.chatView) return;
        this.conversationsList.classList.add("hidden");
        this.chatView.classList.remove("hidden");
        this.pages.market.classList.add("hidden");
        this.pages.messages.classList.remove("hidden");
        
        p2pAppData.currentChat = traderName;
        document.getElementById("chatName").textContent = traderName;
        
        this.loadMessages(traderName);
    },

    loadMessages(traderName) {
        this.messagesContainer.innerHTML = "";
        const msgs = p2pAppData.messages[traderName] || [];
        msgs.forEach(m => this.renderSingleMessage(m));
        this.scrollToBottom();
    },

    renderSingleMessage(message) {
        const div = document.createElement("div");
        div.className = message.sender === "me" ? "flex justify-end mb-4" : "flex mb-4";
        const bg = message.sender === "me" ? "bg-primary text-white" : "bg-gray-200 dark:bg-dark-700";
        
        div.innerHTML = `
            <div class="${bg} p-3 rounded-2xl max-w-[80%] shadow-sm">
                <p class="text-sm">${message.content}</p>
                <span class="text-[10px] opacity-70 block mt-1">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `;
        this.messagesContainer.appendChild(div);
    },

    handleSendMessage() {
        const text = this.messageInput.value.trim();
        if (!text || !p2pAppData.currentChat) return;

        const msg = { sender: "me", content: text };
        p2pAppData.messages[p2pAppData.currentChat].push(msg);
        this.renderSingleMessage(msg);
        this.messageInput.value = "";
        this.scrollToBottom();
        
        // محاكاة رد التاجر
        setTimeout(() => this.simulateTraderResponse(), 1000);
    },

    simulateTraderResponse() {
        if(!p2pAppData.currentChat) return;
        const msg = { sender: "them", content: "I'm processing your request now. One moment." };
        p2pAppData.messages[p2pAppData.currentChat].push(msg);
        this.renderSingleMessage(msg);
        this.scrollToBottom();
    },

    // --- الأدوات المساعدة ---
    toggleUIComponent(id) {
        const el = this.uiElements[id];
        if (!el) return;
        const isHidden = el.classList.contains("hidden");
        this.hideUIComponent('attachmentMenu');
        this.hideUIComponent('emojiPicker');
        if (isHidden) el.classList.remove("hidden");
    },

    hideUIComponent(id) {
        const el = this.uiElements[id];
        if (el) el.classList.add("hidden");
    },

    scrollToBottom() {
        if(this.messagesContainer) this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    },

    showConversationsList() {
        this.pages.messages.classList.add("hidden");
        this.pages.market.classList.remove("hidden");
        p2pAppData.currentChat = null;
    },

    initDelegatedClicks() {
        document.addEventListener("click", (e) => {
            const traderBtn = e.target.closest("[data-trader]");
            if (traderBtn) {
                const name = traderBtn.getAttribute("data-trader");
                this.showChatView(name);
            }
        });
    }
};

// تشغيل المحرك عند جاهزية الـ HTML
const checkP2P = setInterval(() => {
    if (document.getElementById("marketPage")) {
        P2PEngine.init();
        clearInterval(checkP2P);
    }
}, 500);
