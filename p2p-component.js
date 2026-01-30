const P2PModule = {
    // البيانات الافتراضية
    data: {
        currentPage: "market",
        orders: [
            { id: "TRX-789012", type: "buy", amount: "0.5 BTC", price: "$27,160.25", status: "pending" }
        ]
    },

    // الدالة الرئيسية التي سيستدعيها الـ Router
    init: function() {
        console.log("P2P Module Initializing...");
        this.renderLayout();
        this.showMarket(); 
    },

    // بناء الهيكل الأساسي
    renderLayout: function() {
        const root = document.getElementById('p2p-root');
        if (!root) {
            console.error("Target #p2p-root not found in HTML!");
            return;
        }

        root.innerHTML = `
            <div class="flex flex-col h-full bg-dark-900 animate-fade-in">
                <div class="flex border-b border-dark-800 bg-dark-900 sticky top-0 z-10">
                    <button id="buy-tab" class="flex-1 py-4 font-semibold border-b-2 border-primary text-primary transition-all">Buy</button>
                    <button id="sell-tab" class="flex-1 py-4 font-semibold text-dark-400 hover:text-white transition-all">Sell</button>
                </div>

                <div id="p2p-main-display" class="flex-1 overflow-y-auto p-4 space-y-4 pb-24 scrollbar-hide">
                </div>
            </div>
        `;
        this.bindGlobalEvents();
    },

    // عرض قائمة السوق
    showMarket: function() {
        const display = document.getElementById('p2p-main-display');
        if (!display) return;
        
        display.innerHTML = `
            <div class="space-y-4 animate-fade-in">
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-lg font-bold text-white">Available Offers</h2>
                    <button class="text-primary text-sm"><i class="fas fa-filter mr-1"></i> Filter</button>
                </div>
                
                <div class="bg-dark-800 rounded-xl p-4 border border-dark-700 hover:border-primary/50 transition-all">
                    <div class="flex justify-between items-start mb-3">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
                                <i class="fas fa-user text-primary"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-100">CryptoTrader88</h3>
                                <div class="flex items-center text-xs text-dark-400">
                                    <span class="text-success font-bold">98%</span> • 500+ trades
                                </div>
                            </div>
                        </div>
                        <span class="bg-dark-700 text-primary text-[10px] font-bold px-2 py-1 rounded">Verified</span>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div><p class="text-dark-400 text-xs">Price</p><p class="font-bold text-gray-100">$54,320.50</p></div>
                        <div><p class="text-dark-400 text-xs">Limit</p><p class="font-bold text-gray-100">$500 - $5,000</p></div>
                    </div>
                    
                    <button class="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-transform active:scale-95">
                        Buy Now
                    </button>
                </div>
            </div>
        `;
    },

    // ربط الأحداث
    bindGlobalEvents: function() {
        const buyTab = document.getElementById('buy-tab');
        const sellTab = document.getElementById('sell-tab');

        buyTab?.addEventListener('click', () => {
            buyTab.className = "flex-1 py-4 font-semibold border-b-2 border-primary text-primary transition-all";
            sellTab.className = "flex-1 py-4 font-semibold text-dark-400 hover:text-white transition-all";
            this.showMarket(); 
        });

        sellTab?.addEventListener('click', () => {
            sellTab.className = "flex-1 py-4 font-semibold border-b-2 border-primary text-primary transition-all";
            buyTab.className = "flex-1 py-4 font-semibold text-dark-400 hover:text-white transition-all";
            // دالة عرض البيع
            document.getElementById('p2p-main-display').innerHTML = '<div class="text-center py-10 text-dark-400">No Sell Offers Available</div>';
        });
    }
};

// --- أهم جزء: هذا هو الجسر الذي سيبحث عنه الـ Router الخاص بك ---
window.initP2P = function() {
    P2PModule.init();
};
