// 1. الخريطة (خارج الدالة)
const titles = { 
    'dashboard': 'Dashboard', 
    'p2p': 'P2P Trading',
    'messages': 'Messages',
    'market': 'Marketplace',
    'analytics': 'Analytics',
    'settings': 'Settings',
    'help': 'Help & Support'
};

const modules = {
    'p2p': 'p2p-component.js'
};

function switchSection(sectionId) {
    // إخفاء وإظهار الأقسام
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.classList.add('hidden'));
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.remove('hidden');

    // تحديث أزرار القائمة
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) item.classList.add('active');
    });

    // تحديث كود العنوان
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = titles[sectionId] || 'Dashboard';
    }

    // تحميل الموديول
    if (modules[sectionId]) {
        loadModule(sectionId, modules[sectionId]);
    } else {
        // إذا كان القسم p2p محملاً مسبقاً، نتأكد من تشغيله
        if (sectionId === 'p2p' && typeof P2PModule !== 'undefined') {
            P2PModule.init();
        }
    }
} // <--- تم تصحيح القوس هنا

// دالة تحميل الملفات
function loadModule(id, fileName) {
    if (document.getElementById('script-' + id)) {
        // إذا الملف موجود مسبقاً، نشغل الدالة فوراً
        const funcName = 'init' + id.toUpperCase();
        if (typeof window[funcName] === 'function') {
            window[funcName]();
        }
        return;
    }

    const script = document.createElement('script');
    script.id = 'script-' + id;
    script.src = fileName;
    script.onload = () => {
        const funcName = 'init' + id.toUpperCase();
        if (typeof window[funcName] === 'function') {
            window[funcName]();
        }
    };
    document.body.appendChild(script);
}
