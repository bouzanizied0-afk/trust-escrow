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

    // --- هنا نضع كود العنوان ---
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        // يذهب للكائن titles ويبحث عن المفتاح (مثلاً 'market') ويأخذ قيمته ('Marketplace')
        pageTitle.textContent = titles[sectionId] || 'Dashboard';
    }
    // ---------------------------

    if (modules[sectionId]) {
        loadModule(sectionId, modules[sectionId]);
    }
}

// دالة تحميل الملفات (تبقى كما هي)
function loadModule(id, fileName) {
    if (document.getElementById('script-' + id)) {
        if (typeof window['init' + id.toUpperCase()] === 'function') {
            window['init' + id.toUpperCase()]();
        }
        return;
    }

    const script = document.createElement('script');
    script.id = 'script-' + id;
    script.src = fileName;
    script.onload = () => {
        if (typeof window['init' + id.toUpperCase()] === 'function') {
            window['init' + id.toUpperCase()]();
        }
    };
    document.body.appendChild(script);
}
