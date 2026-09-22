/* ==========================================================
    전역 커스텀 커서 — lerp로 부드럽게 추적
    DOMContentLoaded로 감싸서, 스크립트가 어느 시점에 로드되든
    HTML 요소가 준비된 뒤에만 실행되도록 보장
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor');
    
    if (!cursor){
        console.warn('[cursor] #cursor 요소를 찾지 못했습니다. index.html에 <div id="cursor">가 있는지 확인하세요.');
        return;
    }
    
    const cursorLabel = cursor.querySelector('.cursor__label');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    const easing = 0.18;
    
    window.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor(){
        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // 이벤트 위임(delegation) 방식으로 변경 —
    // 나중에 Work Index 패널이 JS로 동적 렌더링되어도
    // data-cursor 요소를 항상 정확히 감지함
    document.addEventListener('pointerover', (e) => {
        const target = e.target.closest('[data-cursor]');
        if (target){
        cursor.classList.add('is-hovering');
        if (cursorLabel) cursorLabel.textContent = target.dataset.cursor;
        }
    });
    
    document.addEventListener('pointerout', (e) => {
        const target = e.target.closest('[data-cursor]');
        if (target){
        cursor.classList.remove('is-hovering');
        }
    });
    });

    // ---------------------------------------- Work Index - 4분할 패널
const projects = [
    {
        num: '01',
        category: 'Web Design',
        title: 'Sirloin',
        tag: 'Redesign',
        href: './project-sirloin.html',
        thumb: './images/sirloin.jpg', // 준비되면 이미지 경로 입력 (예: assets/img/sirloin/thumb.webp)
    },
    {
        num: '02',
        category: 'Web Design',
        title: 'Herman Miller',
        tag: 'Redesign',
        href: './project-hermanmiller.html',
        thumb: './images/hermanmiller.jpg',
    },
    {
        num: '03',
        category: 'Web Design',
        title: 'Not cute Anymore',
        tag: 'New Identity',
        href: './project-notcuteanymore.html',
        thumb: './images/notcuteanymore2.jpg',
    },
    {
        num: '04',
        category: 'Web Design',
        title: 'Blue Elephant', // 아직 미정
        tag: 'Redesign',
        href: './project-blueelephant.html',
        thumb: './images/blueelephant.jpg',
    },
];

const worksIndex = document.querySelector('.works-index');
    
    if (worksIndex){
    worksIndex.innerHTML = projects.map(p => `
        <a class="works-index__panel" href="${p.href}" data-index="${p.num}" data-cursor="Explore">
            <div class="panel__thumb" style="${p.thumb ? `background-image:url('${p.thumb}')` : ''}"></div>
            <span class="panel__num">${p.num}</span>
            <span class="panel__arrow">↗</span>
            <span class="panel__category">${p.category}</span>
            <span class="panel__title">${p.title}</span>
        ${p.tag ? `<span class="panel__tag">${p.tag}</span>` : ''}
        </a>
    `).join('');
}

/* ==========================================================
    GRAPHIC — 포스터 데이터
    포스터 완성되는 대로 img 경로만 채우면 됨 (빈 문자열이면 회색 박스 유지)
   ========================================================== */
const posters = [
    { num: '01', img: '' },
    { num: '02', img: '' },
    { num: '03', img: '' },
    { num: '04', img: '' },
    { num: '05', img: '' },
];

const graphicListEl = document.querySelector('.graphic__list');
const posterPreviewEl = document.querySelector('.graphic__poster');

/* ---- 배열 기반 렌더링 ---- */
if (graphicListEl){
    graphicListEl.innerHTML = posters.map((p, i) => `
        <li class="graphic__thumb-wrap" data-index="${i}">
        <span class="graphic__num">${p.num}</span>
        <div class="graphic__thumb" style="${p.img ? `background-image:url('${p.img}')` : ''}"></div>
        </li>
    `).join('');
}

/* ---- 중앙 포커스 감지 ----
    read-write batching: 8~10개 항목을 순회하며 "읽기(위치 측정)"와
    "쓰기(클래스 토글)"를 섞어서 하면 매번 강제 리플로우가 발생함.
    그래서 전부 읽어서 계산부터 끝내고, 그다음에 한 번에 몰아서 씀 */
function updateActiveThumb(){
    const items = document.querySelectorAll('.graphic__thumb-wrap');
    if (!items.length || !graphicListEl) return;

    // 1) 읽기만 먼저 — 리스트 컨테이너 자신의 중앙 Y좌표 기준으로 거리 계산
    const containerRect = graphicListEl.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    const distances = Array.from(items).map(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        return Math.abs(itemCenter - containerCenter);
    });

    const closestIndex = distances.indexOf(Math.min(...distances));

  // 2) 쓰기만 나중에 몰아서
    items.forEach((item, i) => {
        item.classList.toggle('is-active', i === closestIndex);
    });

    const active = posters[closestIndex];
    if (active && posterPreviewEl){
        posterPreviewEl.style.backgroundImage = active.img ? `url('${active.img}')` : '';
    }
}

let tickingGraphic = false;
graphicListEl?.addEventListener('scroll', () => {
    if (!tickingGraphic){
        requestAnimationFrame(() => {
        updateActiveThumb();
        tickingGraphic = false;
        });
        tickingGraphic = true;
    }
});

/* 클릭한 썸네일이 화면 중앙으로 부드럽게 스크롤 */
graphicListEl?.addEventListener('click', (e) => {
    const wrap = e.target.closest('.graphic__thumb-wrap');
    if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

/* 최초 로드 시 01번이 활성 상태로 보이도록 1회 실행 */
window.addEventListener('load', updateActiveThumb);