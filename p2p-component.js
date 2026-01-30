// هذا المتغير يحتوي على واجهة الـ P2P كاملة
const p2pTemplate = `
<div class="animate-fade-in p-4 md:p-6">
    <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">P2P Trading Platform</h2>
        <p class="text-gray-600 dark:text-gray-400">تداول مباشر وآمن</p>
    </div>
    
    <div class="bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-gray-200 dark:border-dark-700 overflow-hidden flex flex-col min-h-[550px]">
        <div class="flex-1 p-4" id="p2pInnerContent">
            <div id="p2p-market-view">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-gray-50 dark:bg-dark-900 rounded-xl border dark:border-dark-700">
                        <div class="flex justify-between mb-4 font-bold text-primary"><span>BTC/USDT</span> <span>$52,000</span></div>
                        <button class="w-full bg-primary text-white py-2 rounded-lg">Buy Now</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 border-t dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
            <button onclick="switchP2PTab('market')" class="py-4 text-primary font-bold"><i class="fas fa-store mr-2"></i>Market</button>
            <button onclick="switchP2PTab('chat')" class="py-4 text-gray-400 font-bold border-l dark:border-dark-700"><i class="fas fa-comment-dots mr-2"></i>Chat</button>
        </div>
    </div>
</div>
`;

// دالة الحقن السريع
function initP2P() {
    const container = document.getElementById('p2p');
    if (container && container.innerHTML.trim() === "") {
        container.innerHTML = p2pTemplate;
    }
}
