/**
 * P2P Trading Platform Module - Final Stable Version
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
        "CryptoTrader88": [{ id: 1, sender: "them", type: "text", content: "Hello! Is the BTC available?", timestamp: "10:30 AM", status: "read" }],
        "BitcoinPro": [], "CryptoQueen": [], "TradingMaster": []
    }
};

const P2PEngine = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.navigateToPage("market");
    },

    cacheDOM() {
        this.pages = {
            market: document.getElementById("marketPage"),
            messages: document.getElementById("messagesPage"),
            orders: document.getElementById("ordersPage"),
            disputes: document.getElementById("disputesPage")
        };
        this.navButtons = document.querySelectorAll("nav button[data-page]");
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

    // دالة مساعدة للربط الآمن للأحداث
    safeBind(id, event, callback) {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, callback);
    },

    bindEvents() {
        this.navButtons.forEach(btn => {
            btn.onclick = () => this.navigateToPage(btn.dataset.page);
        });

        this.safeBind("backToConversations", "click", () => this.showConversationsList());
        this.safeBind("sendButton", "click", () => this.handleSendMessage());

        if (this.messageInput) {
            this.messageInput.onkeypress = (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            };
        }

        this.safeBind("attachmentButton", "click", () => this.toggleUIComponent('attachmentMenu'));
        this.safeBind("emojiButton", "click", () => this.toggleUIComponent('emojiPicker'));
        this.safeBind("closeEmojiPicker", "click", () => this.hideUIComponent('emojiPicker'));
        this.safeBind("voiceToggle", "click", () => this.toggleVoiceMode());
        this.safeBind("cancelRecording", "click", () => this.stopRecording());
        this.safeBind("sendRecording", "click", () => this.sendVoiceMessage());

        this.initDelegatedClicks();

        document.querySelectorAll(".emoji-option").forEach(btn => {
            btn.onclick = () => {
                if (this.messageInput) {
                    this.messageInput.value += btn.textContent;
                    this.messageInput.focus();
                }
            };
        });
    },

    navigateToPage(pageId) {
        Object.keys(this.pages).forEach(key => {
            if (this.pages[key]) this.pages[key].classList.add("hidden");
        });
        
        if (this.pages[pageId]) this.pages[pageId].classList.remove("hidden");

        this.navButtons.forEach(btn => {
            const isActive = btn.dataset.page === pageId;
            btn.classList.toggle("text-primary", isActive);
            btn.classList.toggle("text-dark-400", !isActive);
        });

        if (pageId !== "messages") this.showConversationsList();
    },

    showChatView(traderName) {
        if (!this.conversationsList || !this.chatView) return;
        this.conversationsList.classList.add("hidden");
        this.chatView.classList.remove("hidden");
        p2pAppData.currentChat = traderName;

        const trader = p2pAppData.traders[traderName];
        const chatNameEl = document.getElementById("chatName");
        if (chatNameEl) chatNameEl.textContent = traderName;
        
        this.loadMessages(traderName);
    },

    loadMessages(traderName) {
        if (!this.messagesContainer) return;
        this.messagesContainer.innerHTML = "";
        const msgs = p2pAppData.messages[traderName] || [];
        msgs.forEach(m => this.renderSingleMessage(m));
        this.scrollToBottom();
    },

    renderSingleMessage(message) {
        if (!this.messagesContainer) return;
        const div = document.createElement("div");
        div.className = message.sender === "me" ? "flex justify-end" : "flex";
        const bubbleBase = `message-bubble ${message.sender === "me" ? "bg-primary rounded-2xl rounded-tr-none" : "bg-dark-800 rounded-2xl rounded-tl-none"} p-4`;
        div.innerHTML = `<div class="${bubbleBase}"><p>${message.content}</p></div>`;
        this.messagesContainer.appendChild(div);
    },

    scrollToBottom() {
        if (this.messagesContainer) this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    },

    showConversationsList() {
        if (this.conversationsList) this.conversationsList.classList.remove("hidden");
        if (this.chatView) this.chatView.classList.add("hidden");
    },

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

    initDelegatedClicks() {
        document.addEventListener("click", (e) => {
            const convItem = e.target.closest(".conversation-item");
            if (convItem) this.showChatView(convItem.dataset.trader);

            const traderBtn = e.target.closest("[data-trader]");
            if (traderBtn && !traderBtn.classList.contains("conversation-item")) {
                this.navigateToPage("messages");
                setTimeout(() => this.showChatView(traderBtn.dataset.trader), 50);
            }
        });
    },

    handleSendMessage() {
        if (!this.messageInput) return;
        const text = this.messageInput.value.trim();
        if (!text || !p2pAppData.currentChat) return;

        const msg = { sender: "me", content: text };
        p2pAppData.messages[p2pAppData.currentChat].push(msg);
        this.renderSingleMessage(msg);
        this.messageInput.value = "";
        this.scrollToBottom();
    }
};

// المشغل الذكي - يفحص وجود marketPage أو أي عنصر أساسي آخر
const startP2PWithRetry = setInterval(() => {
    // جرب البحث عن marketPage، وإذا لم تجده ابحث عن أي عنصر p2p آخر للتأكد
    const essentialEl = document.getElementById("marketPage") || document.querySelector(".p2p-container");
    
    if (essentialEl) {
        P2PEngine.init();
        clearInterval(startP2PWithRetry);
        console.log("P2P Engine Started Successfully");
    }
}, 500);
