/**
 * P2P Navigation Engine
 * هذا الملف مسؤول عن التحكم في الشريط السفلي والتنقل بين الصفحات
 */

function initP2PNavigation() {
    // 1. جلب الأزرار
    const navButtons = document.querySelectorAll(".p2p-nav-btn");
    
    // 2. جلب الصفحات (ستكون متوفرة بمجرد إضافة قطع الـ HTML لاحقاً)
    const p2pPages = {
        market: document.getElementById("marketPage"),
        messages: document.getElementById("messagesPage"),
        orders: document.getElementById("ordersPage"),
        disputes: document.getElementById("disputesPage")
    };

    // 3. وظيفة تغيير الصفحة
    function switchPage(targetPageId) {
        // أ. تحديث شكل الأزرار
        navButtons.forEach(btn => {
            if (btn.getAttribute("data-page") === targetPageId) {
                btn.classList.add("text-primary");
                btn.classList.remove("text-gray-400");
            } else {
                btn.classList.remove("text-primary");
                btn.classList.add("text-gray-400");
            }
        });

        // ب. إخفاء جميع الصفحات أولاً
        Object.values(p2pPages).forEach(page => {
            if (page) page.classList.add("hidden");
        });

        // ج. إظهار الصفحة المطلوبة فقط
        const targetPage = p2pPages[targetPageId];
        if (targetPage) {
            targetPage.classList.remove("hidden");
            console.log(`Page switched to: ${targetPageId}`);
        }
    }

    // 4. إضافة مستمع الأحداث (Click Event) لكل زر
    navButtons.forEach(button => {
        button.addEventListener("click", function() {
            const pageId = this.getAttribute("data-page");
            switchPage(pageId);
        });
    });

    // 5. تشغيل صفحة "السوق" تلقائياً عند البداية
    switchPage("market");
}

// تشغيل المحرك عند تحميل الصفحة
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initP2PNavigation);
} else {
    initP2PNavigation();
}
