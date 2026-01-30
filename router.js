// خريطة النظام: نحدد اسم القسم واسم الملف التابع له
const modules = {
    'p2p': 'p2p-component.js'
    // 'market': 'market-component.js' <-- ستضيفها لاحقاً هنا
};

// الدالة الرئيسية للتبديل بين الأقسام
function switchSection(sectionId) {
    // أولاً: إخفاء كل الأقسام وإظهار القسم المطلوب
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.classList.add('hidden'));
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // ثانياً: تحديث شكل القائمة الجانبية (Nav Items)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });

    // ثالثاً: التحميل الذكي للملف الخارجي (فقط عند الحاجة)
    if (modules[sectionId]) {
        loadModule(sectionId, modules[sectionId]);
    }

    // تحديث العنوان العلوي
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = { 'dashboard': 'Dashboard', 'p2p': 'P2P Trading' };
        pageTitle.textContent = titles[sectionId] || 'Dashboard';
    }
}

// دالة تحميل الملفات ديناميكياً
function loadModule(id, fileName) {
    // إذا كان الملف محملاً مسبقاً، فقط قم بتشغيل دالة البداية
    if (document.getElementById('script-' + id)) {
        window['init' + id.toUpperCase()](); 
        return;
    }

    // إذا لم يكن محملاً، سنقوم بإنشاء عنصر script وحقنه في الصفحة
    const script = document.createElement('script');
    script.id = 'script-' + id;
    script.src = fileName;
    script.onload = () => {
        console.log(fileName + ' loaded successfully');
        // تشغيل دالة البداية (مثلاً initP2P)
        if (typeof window['init' + id.toUpperCase()] === 'function') {
            window['init' + id.toUpperCase()]();
        }
    };
    document.body.appendChild(script);
}
