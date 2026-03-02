/**
 * 暗色轮廓 Silhouette - 国际化模块
 */

// 语言包存储
const translations = {
    zh: null,
    en: null
};

// 当前语言
let currentLanguage = 'zh';

// ==========================================
// 加载语言包
// ==========================================
async function loadTranslations() {
    try {
        const [zhResponse, enResponse] = await Promise.all([
            fetch('locales/zh.json'),
            fetch('locales/en.json')
        ]);
        
        translations.zh = await zhResponse.json();
        translations.en = await enResponse.json();
        
        return true;
    } catch (error) {
        console.error('Failed to load translations:', error);
        // 使用内联备用翻译
        translations.zh = getDefaultZhTranslations();
        translations.en = getDefaultEnTranslations();
        return false;
    }
}

// ==========================================
// 获取当前语言
// ==========================================
function getCurrentLanguage() {
    // 优先从 localStorage 获取
    const saved = localStorage.getItem('silhouette-lang');
    if (saved && (saved === 'zh' || saved === 'en')) {
        currentLanguage = saved;
        return saved;
    }
    
    // 其次从浏览器语言推断
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh')) {
        currentLanguage = 'zh';
    } else {
        currentLanguage = 'zh'; // 默认中文
    }
    
    return currentLanguage;
}

// ==========================================
// 设置语言
// ==========================================
function setLanguage(lang) {
    if (lang !== 'zh' && lang !== 'en') {
        console.warn('Unsupported language:', lang);
        return;
    }
    
    currentLanguage = lang;
    localStorage.setItem('silhouette-lang', lang);
    
    // 更新 HTML lang 属性
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    
    // 应用翻译
    applyTranslations();
    
    // 重新渲染动态内容
    if (typeof renderMembers === 'function') renderMembers();
    if (typeof renderAlbums === 'function') renderAlbums();
    if (typeof renderEvents === 'function') {
        const activeTab = document.querySelector('.events-tabs .tab-btn.active');
        renderEvents(activeTab?.dataset.tab || 'upcoming');
    }
    if (typeof renderGallery === 'function') {
        const activeTab = document.querySelector('.gallery-tabs .tab-btn.active');
        renderGallery(activeTab?.dataset.tab || 'photos');
    }
}

// ==========================================
// 应用翻译到页面
// ==========================================
function applyTranslations() {
    const lang = translations[currentLanguage];
    if (!lang) {
        console.warn('Translations not loaded for:', currentLanguage);
        return;
    }
    
    // 获取所有带有 data-i18n 属性的元素
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = getNestedValue(lang, key);
        
        if (translation) {
            el.textContent = translation;
        }
    });
}

// ==========================================
// 获取嵌套对象的值
// ==========================================
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

// ==========================================
// 获取翻译文本
// ==========================================
function t(key) {
    const lang = translations[currentLanguage];
    if (!lang) return key;
    
    const value = getNestedValue(lang, key);
    return value || key;
}

// ==========================================
// 默认中文翻译（备用）
// ==========================================
function getDefaultZhTranslations() {
    return {
        nav: {
            home: "首页",
            about: "乐队",
            music: "音乐",
            events: "演出",
            gallery: "记录"
        },
        hero: {
            tagline: "在黑暗中寻找轮廓，在旋律中定义自我",
            description: "独立电子 · Indietronica",
            listenNow: "音乐",
            viewEvents: "演出",
            scrollDown: "向下滚动"
        },
        about: {
            // title: "Band Introduction",
            // subtitle: "About Us",
            storyTitle: "我们的故事",
            storyContent1: "暗色轮廓 Silhouette 成立于2022年夏天，是一支来自南京的独立电子（Indietronica）乐队。暗色是一朵比世界更大的云，我在我的黑暗里，望着虚浮的轮廓，用一支画笔慢慢填满向往的自己。",
            storyContent2: "我们追求干净与简洁的音乐理念，用旋律化的贝斯线条、复古的合成器音色，搭配富有张力的吉他Riff和强烈的节奏，编织出属于暗色轮廓的独特声音。",
            storyContent3: "在黑暗中，轮廓是我们感知存在的方式；在音乐中，轮廓是我们表达情感的语言。",
            photoPlaceholder: "乐队照片",
            membersTitle: "乐队成员"
        },
        music: {
            title: "音乐作品",
            subtitle: "Discography",
            listenOn: "在这些平台收听",
            tracks: "首曲目"
        },
        events: {
            title: "演出行程",
            subtitle: "Tour Dates",
            upcoming: "即将到来",
            past: "过往演出",
            getTickets: "购票",
            ended: "已结束",
            noUpcoming: "暂无即将到来的演出",
            noPast: "暂无过往演出记录",
            stayTuned: "请关注我们的社交媒体获取最新演出信息"
        },
        gallery: {
            title: "记录",
            subtitle: "Memories",
            photos: "照片",
            videos: "视频",
            noPhotos: "暂无照片",
            noVideos: "暂无视频"
        },
        footer: {
            tagline: "在黑暗中寻找轮廓",
            followUs: "关注我们",
            contact: "联系我们",
            rights: "保留所有权利",
            madeWith: "Made by Zoey"
        },
        members: {
            vocal: "主唱",
            guitar: "吉他",
            bass: "贝斯",
            synth: "合成器/键盘",
            drums: "鼓"
        }
    };
}

// ==========================================
// 默认英文翻译（备用）
// ==========================================
function getDefaultEnTranslations() {
    return {
        nav: {
            home: "Home",
            about: "About",
            music: "Music",
            events: "Events",
            gallery: "Gallery"
        },
        hero: {
            tagline: "Finding silhouettes in the dark, defining ourselves in melody",
            description: "Indietronica",
            listenNow: "Listen Now",
            viewEvents: "Tour Dates",
            scrollDown: "Scroll Down"
        },
        about: {
            // title: "About Us",
            // subtitle: "Band Introduction",
            // storyTitle: "Our Story",
            storyContent1: "Silhouette was formed in the summer of 2022, an Indietronica band from China.",
            storyContent2: "We pursue a clean and minimalist musical philosophy, weaving melodic bass lines, vintage synthesizer tones, powerful guitar riffs and strong rhythms into the unique sound of Silhouette.",
            storyContent3: "In the darkness, silhouettes are how we perceive existence; in music, silhouettes are our language of emotion.",
            photoPlaceholder: "Band Photo",
            membersTitle: "Band Members"
        },
        music: {
            title: "Discography",
            subtitle: "音乐作品",
            listenOn: "Listen on",
            tracks: "tracks"
        },
        events: {
            title: "Tour Dates",
            subtitle: "演出行程",
            upcoming: "Upcoming",
            past: "Past Shows",
            getTickets: "Get Tickets",
            ended: "Ended",
            noUpcoming: "No upcoming shows",
            noPast: "No past shows",
            stayTuned: "Follow us on social media for the latest updates"
        },
        gallery: {
            title: "Memories",
            subtitle: "记录",
            photos: "Photos",
            videos: "Videos",
            noPhotos: "No photos yet",
            noVideos: "No videos yet"
        },
        footer: {
            tagline: "Finding silhouettes in the dark",
            followUs: "Follow Us",
            contact: "Contact",
            rights: "All rights reserved",
            madeWith: "Made by Zoey"
        },
        members: {
            vocal: "Vocals",
            guitar: "Guitar",
            bass: "Bass",
            synth: "Synth/Keys",
            drums: "Drums"
        }
    };
}

// ==========================================
// 初始化
// ==========================================
(async function initI18n() {
    // 加载翻译文件
    await loadTranslations();
    
    // 获取并设置当前语言
    const lang = getCurrentLanguage();
    
    // 如果 DOM 已加载，立即应用翻译
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyTranslations();
        });
    } else {
        applyTranslations();
    }
})();
