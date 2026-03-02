/**
 * 暗色轮廓 Silhouette - 主脚本文件
 */

// ==========================================
// DOM 元素获取
// ==========================================
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const langSwitch = document.getElementById('lang-switch');
const particles = document.getElementById('particles');
const tabBtns = document.querySelectorAll('.tab-btn');

// ==========================================
// 导航栏滚动效果
// ==========================================
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// ==========================================
// 移动端菜单切换
// ==========================================
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

navToggle.addEventListener('click', toggleMobileMenu);

// 点击导航链接后关闭移动菜单
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// ==========================================
// 平滑滚动与导航高亮
// ==========================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ==========================================
// 粒子效果 - 星光
// ==========================================
function createParticles() {
    if (!particles) return;
    
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // 随机位置
        particle.style.left = Math.random() * 100 + '%';
        
        // 随机大小（星光点）
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // 随机动画延迟（减少延迟，让粒子更快出现）
        particle.style.animationDelay = Math.random() * 8 + 's';
        
        // 随机动画时长
        particle.style.animationDuration = (Math.random() * 8 + 8) + 's';
        
        // 星光颜色（亮色，像星星一样）
        const colors = [
            'rgba(255, 255, 255, 0.95)',
            'rgba(255, 255, 255, 0.85)',
            'rgba(200, 220, 255, 0.9)',
            'rgba(180, 200, 255, 0.85)',
            'rgba(255, 240, 200, 0.8)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        
        // 添加发光效果
        particle.style.boxShadow = `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}`;
        
        particles.appendChild(particle);
    }
}

// ==========================================
// Tab 切换功能
// ==========================================
function initTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 获取父元素来确定是哪组 tabs
            const tabGroup = btn.parentElement;
            const tabType = btn.dataset.tab;
            
            // 更新按钮状态
            tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 根据 tab 类型更新内容
            if (tabGroup.classList.contains('events-tabs')) {
                renderEvents(tabType);
            } else if (tabGroup.classList.contains('gallery-tabs')) {
                // 切换照片/视频显示
                switchGalleryContent(tabType);
            }
        });
    });
}

// ==========================================
// 切换画廊内容（照片/视频）
// ==========================================
function switchGalleryContent(type) {
    const photosContent = document.getElementById('photos-content');
    const videosContent = document.getElementById('videos-content');
    
    if (!photosContent || !videosContent) return;
    
    if (type === 'photos') {
        photosContent.style.display = 'grid';
        videosContent.style.display = 'none';
    } else if (type === 'videos') {
        photosContent.style.display = 'none';
        videosContent.style.display = 'grid';
    }
}

// ==========================================
// 滚动动画（Intersection Observer）
// ==========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.section-header, .member-card, .album-card, .event-card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 添加动画完成样式
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ==========================================
// 语言切换
// ==========================================
langSwitch.addEventListener('click', () => {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    updateLangSwitchDisplay(newLang);
});

function updateLangSwitchDisplay(lang) {
    const current = langSwitch.querySelector('.lang-current');
    const other = langSwitch.querySelector('.lang-other');
    
    if (lang === 'zh') {
        current.textContent = '中';
        other.textContent = 'EN';
    } else {
        current.textContent = 'EN';
        other.textContent = '中';
    }
}

// ==========================================
// 初始化
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    // 创建粒子效果
    createParticles();
    
    // 初始化 Tab 切换
    initTabs();
    
    // 等待数据加载完成
    await loadData();
    
    // 渲染组件
    renderMembers();
    renderAlbums();
    renderEvents('upcoming');
    renderGallery('photos');
    
    // 初始化滚动动画（在渲染完成后）
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
    
    // 应用语言设置
    const savedLang = getCurrentLanguage();
    setLanguage(savedLang);
    updateLangSwitchDisplay(savedLang);
    
    // 初始导航栏状态
    handleNavbarScroll();
});

// ==========================================
// 鼠标跟随光晕效果（可选）
// ==========================================
function initMouseGlow() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: absolute;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 0;
        transition: opacity 0.3s ease;
    `;
    hero.appendChild(glow);
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
    });
    
    hero.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
    
    hero.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
    });
}

// 可选：启用鼠标光晕效果
// initMouseGlow();
