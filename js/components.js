/**
 * 暗色轮廓 Silhouette - 组件渲染模块
 */

// ==========================================
// 数据存储
// ==========================================
let membersData = [];
let albumsData = [];
let eventsData = [];
let galleryData = { photos: [], videos: [] };

// ==========================================
// 加载数据
// ==========================================
async function loadData() {
    try {
        const [members, albums, events] = await Promise.all([
            fetch('data/members.json').then(r => r.json()).catch(() => getDefaultMembers()),
            fetch('data/discography.json').then(r => r.json()).catch(() => getDefaultAlbums()),
            fetch('data/events.json').then(r => r.json()).catch(() => getDefaultEvents())
        ]);
        
        membersData = members;
        albumsData = albums;
        eventsData = events;
        
        // 记录数据暂时使用默认占位
        galleryData = getDefaultGallery();
        
        return true;
    } catch (error) {
        console.error('Failed to load data:', error);
        membersData = getDefaultMembers();
        albumsData = getDefaultAlbums();
        eventsData = getDefaultEvents();
        galleryData = getDefaultGallery();
        return false;
    }
}

// ==========================================
// 渲染成员卡片 - 简洁版本，只显示名字和角色
// ==========================================
function renderMembers() {
    const container = document.getElementById('members-grid');
    if (!container) return;
    
    const lang = getCurrentLanguage();
    
    container.innerHTML = membersData.map(member => `
        <div class="member-card member-card-simple">
            <h4 class="member-name">${member.name[lang]}</h4>
            <p class="member-role">${member.role[lang]}</p>
        </div>
    `).join('');
}

// ==========================================
// 渲染专辑卡片 - 网易云唱片风格
// ==========================================
function renderAlbums() {
    const container = document.getElementById('albums-grid');
    if (!container) return;
    
    const lang = getCurrentLanguage();
    
    container.innerHTML = albumsData.map(album => `
        <div class="album-card">
            <div class="album-vinyl-container">
                <!-- 黑胶唱片 -->
                <div class="album-vinyl">
                    <div class="album-vinyl-grooves"></div>
                </div>
                <!-- 专辑封面 -->
                <div class="album-cover">
                    ${album.cover 
                        ? `<img src="${album.cover}" alt="${album.title[lang]}">`
                        : `<div class="album-cover-placeholder">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                           </div>`
                    }
                    <div class="album-play-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div class="album-info">
                <h4 class="album-title">${album.title[lang]}</h4>
            </div>
        </div>
    `).join('');
}

// ==========================================
// 渲染演出列表
// ==========================================
function renderEvents(type = 'upcoming') {
    const container = document.getElementById('events-list');
    if (!container) return;
    
    const lang = getCurrentLanguage();
    const now = new Date();
    
    // 根据类型筛选演出
    const filteredEvents = eventsData.filter(event => {
        const eventDate = new Date(event.date);
        return type === 'upcoming' ? eventDate >= now : eventDate < now;
    });
    
    // 排序：即将到来按日期升序，过往按日期降序
    filteredEvents.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return type === 'upcoming' ? dateA - dateB : dateB - dateA;
    });
    
    if (filteredEvents.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                </svg>
                <p>${type === 'upcoming' ? t('events.noUpcoming') : t('events.noPast')}</p>
                <p style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.6;">${t('events.stayTuned')}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredEvents.map(event => {
        const eventDate = new Date(event.date);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short' });
        const isUpcoming = eventDate >= now;
        
        return `
            <div class="event-card">
                <div class="event-date">
                    <span class="event-day">${day}</span>
                    <span class="event-month">${month}</span>
                </div>
                <div class="event-info">
                    <h4>${event.title[lang]}</h4>
                    <p class="event-venue">${event.venue[lang]}</p>
                    <p class="event-location">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        ${event.location[lang]}
                    </p>
                </div>
                <div class="event-action">
                    ${isUpcoming && event.ticketUrl
                        ? `<a href="${event.ticketUrl}" class="btn btn-primary" target="_blank" rel="noopener">${t('events.getTickets')}</a>`
                        : `<span class="event-status">${t('events.ended')}</span>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// 渲染记录
// ==========================================
function renderGallery(type = 'photos') {
    const container = document.getElementById('gallery-grid');
    if (!container) return;
    
    const lang = getCurrentLanguage();
    const items = type === 'photos' ? galleryData.photos : galleryData.videos;
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    ${type === 'photos' 
                        ? '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>'
                        : '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>'
                    }
                </svg>
                <p>${type === 'photos' ? t('gallery.noPhotos') : t('gallery.noVideos')}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = items.map((item, index) => `
        <div class="gallery-item" data-index="${index}">
            ${item.thumbnail 
                ? `<img src="${item.thumbnail}" alt="${item.caption?.[lang] || ''}" loading="lazy">`
                : `<div class="gallery-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        ${type === 'photos' 
                            ? '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>'
                            : '<path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>'
                        }
                    </svg>
                    <span>${item.caption?.[lang] || (type === 'photos' ? 'Photo' : 'Video')}</span>
                   </div>`
            }
            ${item.caption ? `
                <div class="gallery-overlay">
                    <span class="gallery-caption">${item.caption[lang]}</span>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ==========================================
// 默认数据
// ==========================================
function getDefaultMembers() {
    return [
        {
            name: { zh: "成员 A", en: "Member A" },
            role: { zh: "主唱 / 合成器", en: "Vocals / Synth" },
            bio: { zh: "乐队创始成员", en: "Founding member" },
            avatar: null
        },
        {
            name: { zh: "成员 B", en: "Member B" },
            role: { zh: "吉他", en: "Guitar" },
            bio: { zh: "", en: "" },
            avatar: null
        },
        {
            name: { zh: "成员 C", en: "Member C" },
            role: { zh: "贝斯", en: "Bass" },
            bio: { zh: "", en: "" },
            avatar: null
        },
        {
            name: { zh: "成员 D", en: "Member D" },
            role: { zh: "鼓", en: "Drums" },
            bio: { zh: "", en: "" },
            avatar: null
        }
    ];
}

function getDefaultAlbums() {
    return [
        {
            title: { zh: "首张专辑", en: "First Album" },
            year: "2023",
            trackCount: 8,
            cover: null,
            tracks: []
        },
        {
            title: { zh: "EP 作品", en: "EP Release" },
            year: "2026",
            trackCount: 4,
            cover: null,
            tracks: []
        }
    ];
}

function getDefaultEvents() {
    return [
        {
            date: "2026-04-15",
            title: { zh: "春季巡演 - 北京站", en: "Spring Tour - Beijing" },
            venue: { zh: "MAO Livehouse", en: "MAO Livehouse" },
            location: { zh: "北京", en: "Beijing, China" },
            ticketUrl: "#"
        },
        {
            date: "2026-04-20",
            title: { zh: "春季巡演 - 上海站", en: "Spring Tour - Shanghai" },
            venue: { zh: "育音堂", en: "Yuyintang" },
            location: { zh: "上海", en: "Shanghai, China" },
            ticketUrl: "#"
        },
        {
            date: "2025-12-01",
            title: { zh: "冬季音乐节", en: "Winter Music Festival" },
            venue: { zh: "某音乐节", en: "Music Festival" },
            location: { zh: "深圳", en: "Shenzhen, China" },
            ticketUrl: null
        }
    ];
}

function getDefaultGallery() {
    return {
        photos: [
            { thumbnail: null, full: null, caption: { zh: "演出现场", en: "Live Performance" } },
            { thumbnail: null, full: null, caption: { zh: "后台花絮", en: "Backstage" } },
            { thumbnail: null, full: null, caption: { zh: "乐队合照", en: "Band Photo" } },
            { thumbnail: null, full: null, caption: { zh: "录音室", en: "Studio Session" } },
            { thumbnail: null, full: null, caption: { zh: "演出现场", en: "Live Show" } },
            { thumbnail: null, full: null, caption: { zh: "粉丝见面", en: "Fan Meet" } }
        ],
        videos: [
            { thumbnail: null, url: null, caption: { zh: "MV 预告", en: "MV Teaser" } },
            { thumbnail: null, url: null, caption: { zh: "现场录像", en: "Live Recording" } }
        ]
    };
}

// ==========================================
// 初始化
// ==========================================
(async function initComponents() {
    await loadData();
})();
