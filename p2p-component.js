/**
 * P2P Trading Platform Module
 * Version: 1.0.0
 * Organization: Global Standard Clean Code
 */

// 1. القاموس المرجعي للبيانات (Application State)
const p2pAppData = {
    currentPage: "market",
    currentChat: null,
    isRecording: false,
    recordingStartTime: null,
    recordingInterval: null,
    
    // بيانات التجار
    traders: {
        "CryptoTrader88": { name: "CryptoTrader88", status: "online", color: "primary", icon: "user" },
        "BitcoinPro": { name: "BitcoinPro", status: "offline", color: "warning", icon: "user" },
        "CryptoQueen": { name: "CryptoQueen", status: "online", color: "success", icon: "user" },
        "TradingMaster": { name: "TradingMaster", status: "offline", color: "danger", icon: "user" }
    },

    // أرشيف الرسائل
    messages: {
        "CryptoTrader88": [
            { id: 1, sender: "them", type: "text", content: "Hello, I've sent the payment via bank transfer. Please check your account and release the BTC.", timestamp: "10:30 AM", status: "read" },
            { id: 2, sender: "me", type: "text", content: "Payment received, I'm releasing the Bitcoin now. Please confirm once you receive it.", timestamp: "10:32 AM", status: "read" }
        ],
        "BitcoinPro": [
            { id: 1, sender: "them", type: "text", content: "Transaction completed successfully. Let me know if you need anything else.", timestamp: "1 hour ago", status: "read" }
        ],
        "CryptoQueen": [
            { id: 1, sender: "them", type: "image", content: "Payment proof", imageUrl: "https://picsum.photos/300/200?random=1", timestamp: "3 hours ago", status: "delivered" }
        ],
        "TradingMaster": [
            { id: 1, sender: "them", type: "voice", content: "Voice message about trade details", duration: "0:45", timestamp: "Yesterday", status: "delivered" }
        ]
    }
};

// 2. المحرك الأساسي للنظام (Core Engine)
const P2PEngine = {
    
    // تهيئة العناصر
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
        
        // الأجزاء التفاعلية
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
        // التنقل بين الصفحات
        this.navButtons.forEach(btn => {
            btn.addEventListener("click", () => this.navigateToPage(btn.dataset.page));
        });

        // العودة للقائمة
        document.getElementById("backToConversations").onclick = () => this.showConversationsList();

        // إرسال الرسائل
        document.getElementById("sendButton").onclick = () => this.handleSendMessage();
        this.messageInput.onkeypress = (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        };

        // إدارة القوائم (إيموجي، مرفقات)
        document.getElementById("attachmentButton").onclick = () => this.toggleUIComponent('attachmentMenu');
        document.getElementById("emojiButton").onclick = () => this.toggleUIComponent('emojiPicker');
        document.getElementById("closeEmojiPicker").onclick = () => this.hideUIComponent('emojiPicker');

        // النقر على تاجر (من القائمة أو من السوق)
        this.initDelegatedClicks();

        // الصوت
        document.getElementById("voiceToggle").onclick = () => this.toggleVoiceMode();
        document.getElementById("cancelRecording").onclick = () => this.stopRecording();
        document.getElementById("sendRecording").onclick = () => this.sendVoiceMessage();
        
        // الإيموجي
        document.querySelectorAll(".emoji-option").forEach(btn => {
            btn.onclick = () => {
                this.messageInput.value += btn.textContent;
                this.messageInput.focus();
            };
        });
    },

    // 3. منطق الملاحة (Navigation Logic)
    navigateToPage(pageId) {
        Object.keys(this.pages).forEach(key => {
            if(this.pages[key]) this.pages[key].classList.add("hidden");
        });
        
        if(this.pages[pageId]) this.pages[pageId].classList.remove("hidden");

        this.navButtons.forEach(btn => {
            const isActive = btn.dataset.page === pageId;
            btn.classList.toggle("text-primary", isActive);
            btn.classList.toggle("text-dark-400", !isActive);
        });

        if (pageId !== "messages") this.showConversationsList();
    },

    // 4. نظام الدردشة الاحترافي (Advanced Chat System)
    showChatView(traderName) {
        this.conversationsList.classList.add("hidden");
        this.chatView.classList.remove("hidden");
        p2pAppData.currentChat = traderName;

        const trader = p2pAppData.traders[traderName];
        document.getElementById("chatName").textContent = traderName;
        document.getElementById("chatAvatar").innerHTML = `<i class="fas fa-${trader.icon} text-${trader.color} text-lg"></i>`;
        
        const statusCircle = document.getElementById("chatStatus");
        statusCircle.className = `absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-dark-800 ${trader.status === "online" ? "bg-success" : "bg-dark-400"}`;
        
        this.loadMessages(traderName);
        this.messageInput.focus();
    },

    loadMessages(traderName) {
        this.messagesContainer.innerHTML = "";
        const msgs = p2pAppData.messages[traderName] || [];
        msgs.forEach(m => this.renderSingleMessage(m));
        this.scrollToBottom();
    },

    renderSingleMessage(message) {
        const div = document.createElement("div");
        div.className = message.sender === "me" ? "flex justify-end" : "flex";
        
        let content = "";
        const bubbleBase = `message-bubble ${message.sender === "me" ? "bg-primary rounded-2xl rounded-tr-none" : "bg-dark-800 rounded-2xl rounded-tl-none"} p-4`;
        
        if (message.type === "text") {
            content = `<div class="${bubbleBase}"><p>${message.content}</p>${this.getMessageMeta(message)}</div>`;
        } else if (message.type === "image") {
            content = `<div class="${bubbleBase} p-2">
                <img src="${message.imageUrl}" class="w-48 h-32 object-cover rounded-lg mb-2">
                ${this.getMessageMeta(message)}
            </div>`;
        } else if (message.type === "voice") {
            content = `<div class="${bubbleBase}"><div class="flex items-center space-x-3">
                <i class="fas fa-play cursor-pointer"></i>
                <div class="h-1 bg-dark-700 w-24 rounded-full"><div class="h-full bg-white w-2/3"></div></div>
                <span class="text-xs">${message.duration}</span>
            </div>${this.getMessageMeta(message)}</div>`;
        }

        div.innerHTML = content;
        this.messagesContainer.appendChild(div);
    },

    getMessageMeta(m) {
        const ticks = m.sender === "me" ? `<i class="fas fa-check-double ${m.status === 'read' ? 'text-success' : 'text-dark-400'} text-xs ml-1"></i>` : "";
        return `<div class="flex justify-between items-center mt-2">
                    <span class="text-[10px] opacity-70">${m.timestamp}</span>
                    ${ticks}
                </div>`;
    },

    handleSendMessage() {
        const text = this.messageInput.value.trim();
        if (!text || !p2pAppData.currentChat) return;

        const msg = {
            id: Date.now(),
            sender: "me",
            type: "text",
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "sent"
        };

        p2pAppData.messages[p2pAppData.currentChat].push(msg);
        this.renderSingleMessage(msg);
        this.messageInput.value = "";
        this.scrollToBottom();
        this.simulateTraderResponse();
    },

    // 5. محاكاة الذكاء الاصطناعي (Simulation System)
    simulateTraderResponse() {
        this.uiElements.typingIndicator.classList.remove("hidden");
        this.scrollToBottom();

        setTimeout(() => {
            this.uiElements.typingIndicator.classList.add("hidden");
            const replies = ["OK, payment confirmed.", "Please release the assets.", "I'm checking my bank now.", "Thanks for the fast trade!"];
            const replyText = replies[Math.floor(Math.random() * replies.length)];
            
            const reply = {
                id: Date.now(),
                sender: "them",
                type: "text",
                content: replyText,
                timestamp: "Just now",
                status: "read"
            };

            p2pAppData.messages[p2pAppData.currentChat].push(reply);
            this.renderSingleMessage(reply);
            this.scrollToBottom();
        }, 2000);
    },

    // 6. أدوات الصوت والوسائط (Media Logic)
    toggleVoiceMode() {
        this.isVoiceMode = !this.isVoiceMode;
        const icon = document.querySelector("#voiceToggle i");
        if (this.isVoiceMode) {
            icon.className = "fas fa-keyboard text-primary";
            this.messageInput.placeholder = "Recording Mode...";
            this.startRecording();
        } else {
            icon.className = "fas fa-microphone text-dark-400";
            this.messageInput.placeholder = "Type a message...";
            this.stopRecording();
        }
    },

    startRecording() {
        p2pAppData.isRecording = true;
        p2pAppData.recordingStartTime = Date.now();
        this.uiElements.voiceRecorder.classList.remove("hidden");
        
        p2pAppData.recordingInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - p2pAppData.recordingStartTime) / 1000);
            this.uiElements.recordingTime.textContent = `0:${elapsed.toString().padStart(2, '0')}`;
            this.uiElements.recordingVisualizer.style.width = `${30 + Math.random() * 70}%`;
        }, 100);
    },

    stopRecording() {
        p2pAppData.isRecording = false;
        clearInterval(p2pAppData.recordingInterval);
        this.uiElements.voiceRecorder.classList.add("hidden");
    },

    sendVoiceMessage() {
        const msg = {
            id: Date.now(),
            sender: "me",
            type: "voice",
            duration: this.uiElements.recordingTime.textContent,
            timestamp: "Now",
            status: "sent"
        };
        p2pAppData.messages[p2pAppData.currentChat].push(msg);
        this.renderSingleMessage(msg);
        this.stopRecording();
        this.scrollToBottom();
    },

    // 7. وظائف المساعدة (Utility Functions)
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    },

    showConversationsList() {
        this.conversationsList.classList.remove("hidden");
        this.chatView.classList.add("hidden");
        p2pAppData.currentChat = null;
    },

    toggleUIComponent(id) {
        const el = this.uiElements[id];
        const isHidden = el.classList.contains("hidden");
        this.hideUIComponent('attachmentMenu');
        this.hideUIComponent('emojiPicker');
        if (isHidden) el.classList.remove
        if (isHidden) el.classList.remove("hidden");
    },

    hideUIComponent(id) {
        if (this.uiElements[id]) this.uiElements[id].classList.add("hidden");
    },

    // 8. نظام النقر المفوض (Delegated Clicks)
    // هذا الجزء يضمن عمل الأزرار حتى لو تمت إضافتها ديناميكياً
    initDelegatedClicks() {
        document.addEventListener("click", (e) => {
            // فتح دردشة من قائمة المحادثات
            const convItem = e.target.closest(".conversation-item");
            if (convItem) {
                const traderName = convItem.dataset.trader;
                this.showChatView(traderName);
            }

            // فتح دردشة من السوق أو من زر داخل طلب
            const traderBtn = e.target.closest("[data-trader]");
            if (traderBtn && !traderBtn.classList.contains("conversation-item")) {
                const traderName = traderBtn.dataset.trader;
                this.navigateToPage("messages");
                setTimeout(() => this.showChatView(traderName), 50);
            }

            // أزرار التحكم في الطلبات (Release, Cancel, Dispute)
            const actionBtn = e.target.closest(".order-action-btn");
            if (actionBtn) {
                this.handleOrderAction(actionBtn.dataset.action);
            }
        });
    },

    // 9. منطق إدارة الصفقات (Trade Management)
    handleOrderAction(action) {
        const confirmMessages = {
            release: "Are you sure you want to release the cryptocurrency?",
            cancel: "Are you sure you want to cancel this order?",
            dispute: "Open a formal dispute for this transaction?"
        };

        if (confirm(confirmMessages[action])) {
            this.simulateActionProgress(action);
        }
    },

    simulateActionProgress(action) {
        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} process initiated.`);
        if (action === "dispute") {
            this.navigateToPage("disputes");
        } else {
            this.navigateToPage("orders");
        }
    },

    // 10. إرسال الصور (Image Messaging)
    sendImageMessage() {
        if (!p2pAppData.currentChat) return;

        const msg = {
            id: Date.now(),
            sender: "me",
            type: "image",
            content: "Payment Proof",
            imageUrl: `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "sent"
        };

        p2pAppData.messages[p2pAppData.currentChat].push(msg);
        this.renderSingleMessage(msg);
        this.scrollToBottom();
        this.hideUIComponent('attachmentMenu');
        this.simulateTraderResponse();
    }
};

// تشغيل النظام عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    P2PEngine.init();
    
    // ربط خيارات المرفقات بشكل إضافي
    document.querySelectorAll(".attachment-option").forEach(btn => {
        btn.onclick = () => P2PEngine.sendImageMessage();
    });
});
