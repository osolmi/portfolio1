window.addEventListener('scroll', () => {
    // ------------------------------------------------------------------
    // 1. 전체 페이지 스크롤 퍼센트 (%) 계산
    // ------------------------------------------------------------------
    const percentEl = document.querySelector('.project__scroll-percent');
    if (percentEl) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const totalPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
        percentEl.textContent = `${totalPercent}%`;
    }

    // ------------------------------------------------------------------
    // 2. 맥북 목업 캡처 이미지 Y축 스크롤 연산 (Sticky 완벽 동기화)
    // ------------------------------------------------------------------
    const mockupSection = document.querySelector('.project__mockup-section');
    const mockupContainer = document.querySelector('.project__laptop-mockup');
    const siteImage = document.querySelector('.project__laptop-site');
    const laptopScreen = document.querySelector('.project__laptop-screen');

    if (!mockupSection || !mockupContainer || !siteImage || !laptopScreen) return;

    // 섹션과 화면의 위치 정보 계산
    const sectionRect = mockupSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // 맥북이 화면 정중앙(50vh)에 고정되는 '실제 Sticky 이동 가능 거리' 연산
    // (섹션 전체 높이) - (화면 높이)
    const totalStickyDistance = mockupSection.offsetHeight - windowHeight;

    // 현재 스크롤이 Sticky 시작 지점부터 얼마나 내려왔는지 계산
    // sectionRect.top이 0이 되는 시점이 맥북 상단이 뷰포트 top에 맞춰지는 지점이므로,
    // top: 50vh + translateY(-50%) 오프셋에 맞춰 스크롤 위치를 보정합니다.
    const currentScroll = -sectionRect.top;

    // Sticky 구역 안에서의 진행도 (0 ~ 1)
    let progress = currentScroll / totalStickyDistance;
    progress = Math.max(0, Math.min(1, progress)); // 0과 1 사이로 픽스

    // 스크롤해야 할 총 이미지 거리 = (캡처 이미지 높이) - (맥북 디스플레이 화면 높이)
    const maxScrollDistance = siteImage.offsetHeight - laptopScreen.offsetHeight;

    if (maxScrollDistance > 0) {
        siteImage.style.transform = `translateY(${-progress * maxScrollDistance}px)`;
    }
});
// 영상 재생 후 역재생 기능
document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('hero-video');
    if (!video) return;

    let isReversing = false;
    let intervalId = null;

    // 영상 재생 이벤트 로직
    video.addEventListener('ended', function() {
        // 정재생이 완료되면 역재생 시작
        if (!isReversing) {
            isReversing = true;
            video.pause();
            
            // 프레임 단위로 currentTime을 감소시켜 역재생 효과 구현
            intervalId = setInterval(function() {
                if (video.currentTime <= 0.1) {
                    clearInterval(intervalId);
                    isReversing = false;
                    video.currentTime = 0;
                    video.play(); // 다시 정재생 시작
                } else {
                    video.currentTime -= 0.04; // 역재생 속도 조절 (약 25fps)
                }
            }, 40); // 약 40ms 간격으로 감속
        }
    });
});