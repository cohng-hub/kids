/* ==========================================================================
   ClassTree (클래스 트리) - 사진 인증 시 자동 피드 등록 & 프레임 모달 연동
   ========================================================================== */

(function() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playSFX(type) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;

    if (type === 'pop') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'coin') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'shutter') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'fanfare') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const t = now + idx * 0.1;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    }
  }

  function getMobileContainer() {
    return document.getElementById('mobile-frame') || document.body;
  }

  const DAILY_MISSION_BANK = {
    check: [
      { title: '잠들기 전 3분 치카치카 양치하기', points: 50, emoji: '🪥', category: '개인 포인트 적립' },
      { title: '외출/방 나갈 때 전등 스위치 끄기', points: 50, emoji: '💡', category: '개인 포인트 적립' },
      { title: '신발장에서 혼자 신발 바르게 정리하기', points: 50, emoji: '👟', category: '개인 포인트 적립' },
      { title: '외출 후 스스로 옷 걸이에 착 걸어두기', points: 50, emoji: '👕', category: '개인 포인트 적립' },
      { title: '장난감 다 놀고 장난감함에 넣기', points: 50, emoji: '🧸', category: '개인 포인트 적립' },
      { title: '선생님과 부모님께 "다녀왔습니다" 인사', points: 50, emoji: '👏', category: '개인 포인트 적립' },
      { title: '식사 후 내 물컵 싱크대에 두기', points: 50, emoji: '🥛', category: '개인 포인트 적립' },
      { title: '내일 유치원 가방 스스로 준비하기', points: 50, emoji: '🎒', category: '개인 포인트 적립' },
      { title: '외출 후 30초 이상 깨끗이 손 씻기', points: 50, emoji: '🧼', category: '개인 포인트 적립' },
      { title: '가족에게 "사랑해요" 예쁜 말 표현하기', points: 50, emoji: '💖', category: '개인 포인트 적립' }
    ],
    photo: [
      { title: '식사 잔반 남기지 않고 다 먹은 밥그릇', points: 100, emoji: '🍱', category: '학급 성장 인증 📸' },
      { title: '양치 중 수도 잠그고 컵 사용하는 장면', points: 100, emoji: '🚰', category: '학급 성장 인증 📸' },
      { title: '베란다/교실 화원에 시원한 물 주기', points: 100, emoji: '🪴', category: '학급 성장 인증 📸' },
      { title: '부모님과 함께 읽은 동화책 표지 인증', points: 100, emoji: '📖', category: '학급 성장 인증 📸' },
      { title: '내 방 책상 위 바르고 깨끗하게 정돈하기', points: 100, emoji: '🧹', category: '학급 성장 인증 📸' },
      { title: '오늘 가장 예쁘게 웃는 내 미소 셀카 인증', points: 100, emoji: '😊', category: '학급 성장 인증 📸' }
    ]
  };

  const WEEKLY_MISSION_BANK = [
    { title: '일일 미션 주 5일 이상 연속 실천하기', req: '0일 / 5일 진행중', points: 300, emoji: '📅', desc: '주간 개근 도장 (개인 P 적립)' },
    { title: '부모님과 주간 동화책 3권 이상 읽기', req: '0권 / 3권 진행중', points: 250, emoji: '📚', desc: '가정 연계 독서 챌린지' },
    { title: '우리 반 친구에게 주간 칭찬 카드 전달', req: '0회 / 1회 진행중', points: 200, emoji: '💌', desc: '학급 인성 칭찬 왕' },
    { title: '이번 주 사진 인증 미션 4회 이상 성공', req: '0회 / 4회 진행중', points: 250, emoji: '📸', desc: '사진 인증 마스터 (+학급 성장)' },
    { title: '일주일 동안 잠들기 전 양치 개근하기', req: '0일 / 7일 진행중', points: 250, emoji: '🪥', desc: '치카치카 개근상' },
    { title: '이번 주 3일 이상 식사 잔반 안 남기기', req: '0일 / 3일 진행중', points: 250, emoji: '🍱', desc: '환경 지킴이 챌린지' },
    { title: '주간 신발 바르게 정리하기 4회 실천', req: '0회 / 4회 진행중', points: 200, emoji: '👟', desc: '정돈 습관 칭찬상' },
    { title: '주간 장난감 정리정돈 5회 스스로 하기', req: '0회 / 5회 진행중', points: 250, emoji: '🧸', desc: '자율 정리 왕' },
    { title: '이번 주 베란다/교실 화분 3회 물 주기', req: '0회 / 3회 진행중', points: 200, emoji: '🪴', desc: '생명 사랑 칭찬상' },
    { title: '친구와 양보하고 사이좋게 놀기 2회', req: '0회 / 2회 진행중', points: 200, emoji: '🤝', desc: '우정 배려 마스터' },
    { title: '선생님과 어르신께 먼저 인사하기 5회', req: '0회 / 5회 진행중', points: 200, emoji: '👏', desc: '예의 바른 어린이' },
    { title: '친구에게 고마운 마음 나눔 실천하기', req: '0회 / 1회 진행중', points: 250, emoji: '🎁', desc: '나눔 기쁨 칭찬상' }
  ];

  const CACHE_BUST = '?v=20260730_v21';
  const TARGET_TOTAL_PHOTOS = 1200;

  const SEASONS_DATA = {
    tree: {
      id: 'tree',
      seasonTag: '🌸 봄 시즌 (3~5월)',
      name: '🌸 [봄] 싱그러운 환경나무 캠페인',
      term: '1학기 봄 (3~5월)',
      levelText: '1단계: 땅 속 미소 씨앗',
      image: './assets/classtree_3d_seed_character.png' + CACHE_BUST,
      particles: ['🌸', '🍃', '🌱', '🌸', '✨'],
      stages: [
        { level: 1, icon: '🌱', image: './assets/classtree_3d_seed_character.png' + CACHE_BUST, name: '1단계: 땅 속 미소 씨앗', req: '학급 누적 1~120회 인증', desc: '봄기운 속 약속 씨앗 캐릭터가 수줍게 미소 지어요.', unlocked: true },
        { level: 2, icon: '🌿', image: './assets/classtree_3d_sprout.png' + CACHE_BUST, name: '2단계: 파릇파릇 아기 새싹', req: '학급 누적 240회 인증 달성', desc: '양치 물 잠그기 실천으로 연두색 새싹 캐릭터가 돋아납니다.', unlocked: false },
        { level: 3, icon: '🪵', image: './assets/classtree_3d_sapling.png' + CACHE_BUST, name: '3단계: 튼튼한 어린 묘목', req: '학급 누적 480회 인증 달성', desc: '잔반 안 남기기 습관으로 묘목 캐릭터 줄기가 굵어집니다.', unlocked: false },
        { level: 4, icon: '🌸', image: './assets/classtree_3d_blossom_tree.png' + CACHE_BUST, name: '4단계: 개화기 참나무', req: '학급 누적 720회 인증 달성', desc: '반 전체의 사진 인증 성공으로 봄 벚꽃이 만개합니다.', unlocked: false },
        { level: 5, icon: '🌳', image: './assets/classtree_3d_fruit_tree.png' + CACHE_BUST, name: '5단계: 무성한 열매 대형나무', req: '학급 누적 960회 인증 달성', desc: '불 끄기 사진 인증으로 달콤한 환경 열매가 풍성해집니다.', unlocked: false },
        { level: 6, icon: '🏞️', image: './assets/classtree_3d_spring_forest.png' + CACHE_BUST, name: '6단계: 울창한 전설의 봄 숲', req: '학급 누적 1,200회 완수!', desc: '학급 사진 인증 1,200회 완성! 교실 TV 대형 보물상자 해금!', unlocked: false }
      ]
    },
    robot: {
      id: 'robot',
      seasonTag: '🌊 여름 시즌 (5~7월)',
      name: '🌊 [여름] 청량한 안전로봇 우주선 캠페인',
      term: '1학기 여름 (5~7월)',
      levelText: '1단계: 꼬마 나사 & 조각 부품',
      image: './assets/classtree_3d_robot_part.png' + CACHE_BUST,
      particles: ['🌊', '☀️', '🛟', '💦', '⚡'],
      stages: [
        { level: 1, icon: '🔩', image: './assets/classtree_3d_robot_part.png' + CACHE_BUST, name: '1단계: 꼬마 나사 & 조각 부품', req: '학급 누적 1~120회 인증', desc: '여름철 안전 수칙을 배운 귀여운 3D 나사 부품 캐릭터!', unlocked: true },
        { level: 2, icon: '🔋', image: './assets/classtree_3d_robot_core.png' + CACHE_BUST, name: '2단계: 청정 파워 코어 엔진', req: '학급 누적 240회 인증 달성', desc: '손 씻기 성공으로 시원한 블루 코어 에너지가 가동됩니다.', unlocked: false },
        { level: 3, icon: '🤖', image: './assets/classtree_3d_robot.png' + CACHE_BUST, name: '3단계: 여름 서핑 안전로봇', req: '학급 누적 480회 인증 달성', desc: '횡단보도 손들기로 파도 타는 안전 로봇 캐릭터 완성.', unlocked: false },
        { level: 4, icon: '🚀', image: './assets/classtree_3d_robot_booster.png' + CACHE_BUST, name: '4단계: 초음속 워터 부스터', req: '학급 누적 720회 인증 달성', desc: '물놀이 안전 사진 완수로 우주 부스터 장착!', unlocked: false },
        { level: 5, icon: '🛸', image: './assets/classtree_3d_robot_spaceship.png' + CACHE_BUST, name: '5단계: 하이퍼 파워 우주선', req: '학급 누적 960회 인증 달성', desc: '모든 장비 합체로 악당 불결 몬스터 퇴치!', unlocked: false },
        { level: 6, icon: '🌌', image: './assets/classtree_3d_robot_galaxy.png' + CACHE_BUST, name: '6단계: 대우주 안전 탐사선', req: '학급 누적 1,200회 완수!', desc: '우주선 발사 준비 완료! 실물 룰렛 축제 해금!', unlocked: false }
      ]
    },
    train: {
      id: 'train',
      seasonTag: '🍁 가을 시즌 (8~10월)',
      name: '🍁 [가을] 단풍 독서 보물 기차 캠페인',
      term: '2학기 가을 (8~10월)',
      levelText: '1단계: 칙칙폭폭 꼬마 기관차',
      image: './assets/classtree_3d_train_locomotive.png' + CACHE_BUST,
      particles: ['🍁', '🍂', '🌾', '🌰', '🚂'],
      stages: [
        { level: 1, icon: '🚂', image: './assets/classtree_3d_train_locomotive.png' + CACHE_BUST, name: '1단계: 칙칙폭폭 꼬마 기관차', req: '학급 누적 1~120회 인증', desc: '가을 독서의 계절, 귀여운 3D 꼬마 기관차가 출발합니다.', unlocked: true },
        { level: 2, icon: '🚃', image: './assets/classtree_3d_train.png' + CACHE_BUST, name: '2단계: 단풍빛 3칸 연결', req: '학급 누적 240회 인증 달성', desc: '예쁜 말 쓰기 미션으로 단풍빛 기차 칸이 이어집니다.', unlocked: false },
        { level: 3, icon: '📚', image: './assets/classtree_3d_train_books.png' + CACHE_BUST, name: '3단계: 5칸 지혜 서가 기차', req: '학급 누적 480회 인증 달성', desc: '바른 책 정리로 지혜의 책장 칸이 늘어납니다.', unlocked: false },
        { level: 4, icon: '🌈', image: './assets/classtree_3d_train_rainbow.png' + CACHE_BUST, name: '4단계: 10칸 무지개 보물기차', req: '학급 누적 720회 인증 달성', desc: '가을 결실의 계절! 반 친구들 모두 기차에 승차합니다.', unlocked: false },
        { level: 5, icon: '✨', image: './assets/classtree_3d_train_express.png' + CACHE_BUST, name: '5단계: 은하수 독서 특급 열차', req: '학급 누적 960회 인증 달성', desc: '가을 밤하늘 은하수를 달리는 특급 열차로 변신!', unlocked: false },
        { level: 6, icon: '🏝️', image: './assets/classtree_3d_train_treasure.png' + CACHE_BUST, name: '6단계: 전설의 지혜 보물섬', req: '학급 누적 1,200회 완수!', desc: '황금 보물상자가 열리고 학급 보물 룰렛 축제!', unlocked: false }
      ]
    },
    castle: {
      id: 'castle',
      seasonTag: '❄️ 겨울 시즌 (11~12월)',
      name: '❄️ [겨울] 눈꽃 디즈니 마법 성 캠페인',
      term: '2학기 겨울 (11~12월)',
      levelText: '1단계: 눈 덮인 아늑한 오두막집',
      image: './assets/classtree_3d_castle_cabin.png' + CACHE_BUST,
      particles: ['❄️', '💎', '✨', '🧊', '☃️'],
      stages: [
        { level: 1, icon: '❄️', image: './assets/classtree_3d_castle_cabin.png' + CACHE_BUST, name: '1단계: 눈 덮인 아늑한 오두막집', req: '학급 누적 1~120회 인증', desc: '겨울 인사 예절을 배우며 눈 덮인 3D 꼬마 오두막집 탄생!', unlocked: true },
        { level: 2, icon: '🏡', image: './assets/classtree_3d_castle_igloo.png' + CACHE_BUST, name: '2단계: 정겨운 눈꽃 이글루 마을', req: '학급 누적 240회 인증 달성', desc: '심부름 돕기 사진 인증으로 이글루 마을 완성!', unlocked: false },
        { level: 3, icon: '🏰', image: './assets/classtree_3d_castle.png' + CACHE_BUST, name: '3단계: 시계탑 얼음 성채', req: '학급 누적 480회 인증 달성', desc: '따뜻한 온기 나누기로 높다란 성채가 솟아납니다.', unlocked: false },
        { level: 4, icon: '🌌', image: './assets/classtree_3d_castle_palace.png' + CACHE_BUST, name: '4단계: 은하수 얼음 궁전', req: '학급 누적 720회 인증 달성', desc: '사진 미션 완수로 오로라 빛 은하수 조명이 켜집니다.', unlocked: false },
        { level: 5, icon: '👑', image: './assets/classtree_3d_ice_castle.png' + CACHE_BUST, name: '5단계: 디즈니 눈꽃 마법성', req: '학급 누적 960회 인증 달성', desc: '3D 디즈니 스타일 눈꽃 마법성 완성!', unlocked: false },
        { level: 6, icon: '💎', image: './assets/classtree_3d_castle_kingdom.png' + CACHE_BUST, name: '6단계: 전설의 크리스탈 얼음 왕국', req: '학급 누적 1,200회 완수!', desc: '성문이 활짝 열리고 눈꽃 왕국 파티 개최!', unlocked: false }
      ]
    },
    puzzle: {
      id: 'puzzle',
      seasonTag: '🎓 졸업/수료 시즌 (1~2월)',
      name: '🎓 [졸업/수료] 1년 추억 퍼즐 캠페인',
      term: '수료 및 진급 (1~2월)',
      levelText: '1단계: 첫 추억 퍼즐 조각',
      image: './assets/classtree_3d_puzzle_piece.png' + CACHE_BUST,
      particles: ['🎓', '🏆', '👑', '🧩', '🎉'],
      stages: [
        { level: 1, icon: '🧩', image: './assets/classtree_3d_puzzle_piece.png' + CACHE_BUST, name: '1단계: 첫 추억 퍼즐 조각', req: '학급 누적 1~120회 인증', desc: '귀여운 3D 1년 추억의 첫 퍼즐 조각을 맞춥니다.', unlocked: true },
        { level: 2, icon: '🖼️', image: './assets/classtree_3d_puzzle.png' + CACHE_BUST, name: '2단계: 25% 진급 액자', req: '학급 누적 240회 인증 달성', desc: '사진 인증으로 1년 모습 1/4 완성.', unlocked: false },
        { level: 3, icon: '🌟', image: './assets/classtree_3d_puzzle_sparkle.png' + CACHE_BUST, name: '3단계: 50% 추억 반짝이', req: '학급 누적 480회 인증 달성', desc: '친구들과의 1년 추억 사진들이 선명해집니다.', unlocked: false },
        { level: 4, icon: '🎖️', image: './assets/classtree_3d_puzzle_frame.png' + CACHE_BUST, name: '4단계: 75% 황금 액자 프레임', req: '학급 누적 720회 인증 달성', desc: '형님 반 진급 완수로 영예로운 황금 리본 부착.', unlocked: false },
        { level: 5, icon: '🏆', image: './assets/classtree_3d_puzzle_gold.png' + CACHE_BUST, name: '5단계: 100% 황금 성공 퍼즐', req: '학급 누적 960회 인증 달성', desc: '1년 모든 캠페인이 하나로 뭉친 황금 퍼즐!', unlocked: false },
        { level: 6, icon: '👑', image: './assets/classtree_3d_puzzle_diploma.png' + CACHE_BUST, name: '6단계: 전설의 졸업 디지털 상장', req: '학급 누적 1,200회 완수!', desc: '수료식 날 감동의 전원 졸업 상장 수여!', unlocked: false }
      ]
    }
  };

  const state = {
    role: 'SELECT',
    currentView: 'welcome',
    activeSeasonKey: 'tree',

    classPhotoAuthCount: { tree: 120, robot: 120, train: 120, castle: 120, puzzle: 120 },

    user: {
      name: '김행복 어린이',
      class: '7세 햇살반',
      points: 100,
      badges: ['🌱 첫 미소 씨앗 도장'],
      equippedItems: []
    },

    dailyRefreshLeft: 1,
    weeklyRefreshLeft: 2,

    dailyMissions: [],
    weeklyMissions: [],

    realCoupons: [
      { id: 'c1', title: '🍦 주말 칭찬 아이스크림 쿠폰', cost: 1500, type: 'parent', desc: '부모님이 마트에서 좋아하는 아이스크림 사주기!', emoji: '🍦' },
      { id: 'c2', title: '🎡 1시간 자유 놀이시간 쿠폰', cost: 2000, type: 'parent', desc: '숙제 없이 마음껏 노는 1시간 자유 쿠폰!', emoji: '🎡' },
      { id: 'c3', title: '🎁 교실 럭키 드로우 보물상자 뽑기권', cost: 2500, type: 'class', desc: '선생님 오프라인 보물상자에서 보물 뽑기!', emoji: '🎁' },
      { id: 'c4', title: '👑 일주일 학급 칭찬왕 왕관 착용권', cost: 3000, type: 'class', desc: '일주일 동안 유치원에서 황금 왕관 쓰기!', emoji: '👑' }
    ],
    friends: [
      { id: 1, name: '민수 어린이', photo: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&q=80', mission: '식사 잔반 남기지 않고 다 먹기 🍱', likes: 3, liked: false, time: '10분 전 인증 📸' },
      { id: 2, name: '지아 어린이', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', mission: '화원에 시원한 물 주기 🪴', likes: 5, liked: false, time: '25분 전 인증 📸' },
      { id: 3, name: '도윤 어린이', photo: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80', mission: '양치 물 잠그고 컵 사용 🚰', likes: 2, liked: false, time: '1시간 전 인증 📸' }
    ],
    students: [
      { name: '김행복', count: '0/2', status: '오늘 2회 완료' },
      { name: '이민수', count: '0/2', status: '오늘 2회 완료' },
      { name: '박지아', count: '0/2', status: '오늘 1회 진행' },
      { name: '최도윤', count: '0/2', status: '미진행' },
      { name: '정예은', count: '0/2', status: '오늘 2회 완료' }
    ]
  };

  function rotateDailyMissions() {
    const checks = [...DAILY_MISSION_BANK.check].sort(() => 0.5 - Math.random()).slice(0, 3);
    const photos = [...DAILY_MISSION_BANK.photo].sort(() => 0.5 - Math.random()).slice(0, 2);

    state.dailyMissions = [
      ...checks.map((item, idx) => ({ id: idx + 1, ...item, type: 'check', completed: false })),
      ...photos.map((item, idx) => ({ id: idx + 4, ...item, type: 'photo', completed: false }))
    ];
  }

  function rotateWeeklyMissions() {
    const selected = [...WEEKLY_MISSION_BANK].sort(() => 0.5 - Math.random()).slice(0, 3);
    state.weeklyMissions = selected.map((item, idx) => ({
      id: 101 + idx,
      ...item,
      type: 'weekly',
      completed: false
    }));
  }

  const appView = document.getElementById('app-view');
  const bottomNav = document.getElementById('bottom-nav');

  function init() {
    rotateDailyMissions();
    rotateWeeklyMissions();
    bindEvents();
    render();
  }

  function bindEvents() {
    bottomNav.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        playSFX('pop');
        const view = btn.dataset.view;
        switchView(view);
      });
    });
  }

  function switchView(viewName) {
    state.currentView = viewName;
    bottomNav.querySelectorAll('.nav-item').forEach(btn => {
      if (btn.dataset.view === viewName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (viewName === 'welcome' || viewName === 'camera' || viewName === 'tv') {
      bottomNav.classList.add('hidden');
    } else {
      bottomNav.classList.remove('hidden');
    }

    render();
  }

  function changeSeason(seasonKey) {
    playSFX('pop');
    state.activeSeasonKey = seasonKey;
    document.body.setAttribute('data-season-theme', seasonKey);
    render();
  }

  function render() {
    appView.innerHTML = '';
    document.body.setAttribute('data-season-theme', state.activeSeasonKey);

    switch (state.currentView) {
      case 'welcome': renderWelcomeScreen(); break;
      case 'dashboard': renderDashboardScreen(); break;
      case 'missions': renderMissionsScreen(); break;
      case 'roadmap': renderRoadmapScreen(); break;
      case 'camera': renderCameraScreen(); break;
      case 'teacher': renderTeacherScreen(); break;
      case 'profile': renderProfileScreen(); break;
      case 'tv': renderTVScreen(); break;
      default: renderWelcomeScreen();
    }
  }

  function renderWelcomeScreen() {
    const season = SEASONS_DATA[state.activeSeasonKey];
    const html = `
      <div class="welcome-screen">
        <div class="brand-header">
          <div class="brand-logo">🌱 CLASS TREE</div>
          <h1 class="welcome-title">환영해요!<br>클래스트리예요 🌱</h1>
        </div>
        <div class="hero-3d-card">
          <img src="./assets/classtree_3d_seed_character.png${CACHE_BUST}" alt="3D Seed Character" class="hero-3d-img">
        </div>
        <div class="role-btn-group">
          <button class="role-btn role-btn-child" id="btn-role-child">
            <span>🧒 어린이로 시작</span>
            <span>➔</span>
          </button>
          <button class="role-btn role-btn-teacher" id="btn-role-teacher">
            <span>👩‍🏫 선생님으로 시작</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    `;

    appView.innerHTML = html;

    document.getElementById('btn-role-child').addEventListener('click', () => {
      playSFX('pop');
      state.role = 'STUDENT';
      switchView('dashboard');
    });

    document.getElementById('btn-role-teacher').addEventListener('click', () => {
      playSFX('pop');
      state.role = 'TEACHER';
      switchView('teacher');
    });
  }

  function renderDashboardScreen() {
    const season = SEASONS_DATA[state.activeSeasonKey];
    const photos = state.classPhotoAuthCount[state.activeSeasonKey];
    const progress = Math.min(100, Math.floor((photos / TARGET_TOTAL_PHOTOS) * 100));

    let currentStageIndex = 0;
    if (photos >= 1200) currentStageIndex = 5;
    else if (photos >= 960) currentStageIndex = 4;
    else if (photos >= 720) currentStageIndex = 3;
    else if (photos >= 480) currentStageIndex = 2;
    else if (photos >= 240) currentStageIndex = 1;
    else currentStageIndex = 0;

    const activeStage = season.stages[currentStageIndex];

    const html = `
      <div class="dashboard-screen">
        <div class="top-bar">
          <div class="class-badge">
            <button class="icon-btn" id="btn-go-home" title="역할선택" style="margin-right: 2px;">
              🏠
            </button>
            <span>7세 햇살반 (20명)</span>
          </div>
          
          <div style="display: flex; gap: 6px;">
            <button class="season-selector-btn" id="btn-open-guide-modal" style="background-color: var(--color-primary-light); color: var(--color-primary-dark); border-color: var(--color-primary-dark);">
              <span>📖 성장의 도감</span>
            </button>
            <button class="season-selector-btn" id="btn-open-season-picker">
              <span>${season.seasonTag.split(' ')[0]} ${season.seasonTag.split(' ')[1]}</span>
              <span>▼</span>
            </button>
          </div>
        </div>

        <div class="main-tree-card">
          <div class="particle-field" id="particle-field"></div>
          <div class="season-title-pill">
            ${season.seasonTag} • ${activeStage.name}
          </div>
          
          <div class="tree-display" id="interactive-tree">
            <img src="${activeStage.image}" alt="${activeStage.name}">
          </div>

          <div class="progress-card">
            <div class="progress-header">
              <span>📸 학급 누적 사진 인증</span>
              <span class="highlight">${photos} / ${TARGET_TOTAL_PHOTOS}회 (${progress}%)</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width: ${progress}%;"></div>
            </div>
            <p class="progress-subtext">
              * <strong>사진 인증 미션 완료시에만</strong> 학급 성장이 진행됩니다! (일반 미션은 개인 P 적립)
            </p>
          </div>
        </div>

        <div class="action-grid">
          <button class="action-card action-card-primary" id="btn-open-camera">
            <div class="action-icon" style="background: rgba(255,255,255,0.3); font-size: 20px;">📸</div>
            <span class="action-title">오늘의 사진<br>인증하기 (+학급성장)</span>
          </button>
          <button class="action-card action-card-secondary" id="btn-teacher-msg">
            <div class="action-icon" style="background: #FFF9E6; font-size: 20px;">💬</div>
            <span class="action-title">선생님 칭찬<br>한마디</span>
          </button>
        </div>

        <div class="feed-section">
          <div class="section-header">
            <h3 class="section-title">우리 반 친구들 사진 인증 피드</h3>
            <button class="link-more" id="btn-open-full-feed" style="background: none; border: none; font-size: 11px; color: var(--color-primary-dark); font-weight: 800; cursor: pointer;">
              모두보기 ➔
            </button>
          </div>
          <div class="feed-scroll">
            ${state.friends.map(f => `
              <div class="feed-card">
                <div class="feed-img-wrapper">
                  <img src="${f.photo}" alt="${f.name}" class="feed-img">
                  <span class="feed-tag">Photo Auth +1</span>
                </div>
                <div class="feed-footer">
                  <div class="feed-user">
                    <div class="feed-avatar">👤</div>
                    <span>${f.name}</span>
                  </div>
                  <button class="like-btn" data-id="${f.id}">${f.liked ? '❤️' : '🤍'} ${f.likes || ''}</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    appView.innerHTML = html;

    document.getElementById('btn-go-home').addEventListener('click', () => { playSFX('pop'); switchView('welcome'); });
    document.getElementById('btn-open-guide-modal').addEventListener('click', openGrowthGuideModal);
    document.getElementById('btn-open-season-picker').addEventListener('click', openSeasonPickerModal);
    document.getElementById('btn-open-camera').addEventListener('click', () => { playSFX('pop'); switchView('camera'); });
    document.getElementById('btn-open-full-feed').addEventListener('click', openFullFeedModal);
    document.getElementById('btn-teacher-msg').addEventListener('click', () => {
      playSFX('pop');
      alert(`💌 담임선생님의 ${season.seasonTag} 칭찬 메시지:\n"햇살반 어린이들! 사진 인증으로 학급 누적 1,200회 도전해서 TV 보물상자를 엽시다!"`);
    });

    const treeElem = document.getElementById('interactive-tree');
    treeElem.addEventListener('click', (e) => {
      playSFX('pop');
      treeElem.classList.add('bounce');
      setTimeout(() => treeElem.classList.remove('bounce'), 500);

      const field = document.getElementById('particle-field');
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.innerText = season.particles[Math.floor(Math.random() * season.particles.length)];
      particle.style.left = (e.offsetX || 80) + 'px';
      particle.style.top = (e.offsetY || 80) + 'px';
      field.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    });

    appView.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playSFX('pop');
        const id = parseInt(btn.dataset.id);
        const f = state.friends.find(x => x.id === id);
        if (f) {
          f.liked = !f.liked;
          f.likes = f.liked ? (f.likes + 1) : Math.max(0, f.likes - 1);
          renderDashboardScreen();
        }
      });
    });
  }

  // 우리 반 친구들 사진 인증 피드 전체보기 전용 모달!
  function openFullFeedModal() {
    playSFX('pop');

    const modalHtml = `
      <div class="modal-backdrop">
        <div class="feed-modal-card">
          <div class="feed-modal-header">
            <div class="feed-modal-title">
              📸 우리 반 친구들 사진 인증 피드
            </div>
            <button class="icon-btn" id="btn-close-full-feed" style="width: 32px; height: 32px;">✕</button>
          </div>

          <div class="feed-filter-tabs">
            <button class="feed-filter-btn active">전체 보기 (${state.friends.length})</button>
            <button class="feed-filter-btn">☀️ 오늘 인증</button>
            <button class="feed-filter-btn">👑 인기 인증</button>
          </div>

          <div class="feed-modal-grid">
            ${state.friends.map(f => `
              <div class="full-feed-item-card">
                <div class="full-feed-item-header">
                  <div class="full-feed-user-info">
                    <div class="full-feed-user-avatar">👤</div>
                    <span class="full-feed-user-name">${f.name}</span>
                  </div>
                  <span class="full-feed-time">${f.time || '오늘 인증 📸'}</span>
                </div>

                <div class="full-feed-img-box">
                  <img src="${f.photo}" alt="${f.name}" class="full-feed-img">
                  <span class="full-feed-badge-tag">학급성장 +1</span>
                </div>

                <div class="full-feed-item-body">
                  <div class="full-feed-mission-title">${f.mission || '오늘의 사진 인증 실천'}</div>
                  
                  <div class="full-feed-item-footer">
                    <span class="teacher-stamp-badge">👩‍🏫 참 잘했어요! 도장 부착</span>
                    <button class="like-btn" data-id="${f.id}" style="font-size: 12px; font-weight: 800; background: #FFF0F5; border: 1px solid #FFB6C1; padding: 4px 10px; border-radius: 16px; color: #E6005C; cursor: pointer;">
                      ${f.liked ? '❤️' : '🤍'} 칭찬하기 ${f.likes || 0}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <button class="btn-confirm-full" id="btn-modal-feed-done">닫기</button>
        </div>
      </div>
    `;

    getMobileContainer().insertAdjacentHTML('beforeend', modalHtml);

    const closeModal = () => {
      playSFX('pop');
      const modal = getMobileContainer().querySelector('.modal-backdrop');
      if (modal) modal.remove();
      renderDashboardScreen();
    };

    document.getElementById('btn-close-full-feed').addEventListener('click', closeModal);
    document.getElementById('btn-modal-feed-done').addEventListener('click', closeModal);

    document.querySelectorAll('.modal-backdrop .like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playSFX('pop');
        const id = parseInt(btn.dataset.id);
        const f = state.friends.find(x => x.id === id);
        if (f) {
          f.liked = !f.liked;
          f.likes = f.liked ? (f.likes + 1) : Math.max(0, f.likes - 1);
          const modal = getMobileContainer().querySelector('.modal-backdrop');
          if (modal) modal.remove();
          openFullFeedModal();
        }
      });
    });
  }

  function openGrowthGuideModal() {
    playSFX('pop');
    const season = SEASONS_DATA[state.activeSeasonKey];

    const modalHtml = `
      <div class="modal-backdrop">
        <div class="modal-content-card" style="max-width: 330px;">
          <h2 style="font-size: 19px; font-weight: 900; margin-bottom: 2px;">📖 ${season.seasonTag} 도감</h2>
          <p style="font-size: 11px; color: var(--color-text-sub); margin-bottom: 14px;">2달(20명 학급) 누적 사진 인증 1,200회 완성 6단계 도감입니다!</p>
          
          <div style="max-height: 360px; overflow-y: auto; padding-right: 4px;">
            ${season.stages.map(st => `
              <div class="guide-stage-card-rich ${st.unlocked ? 'unlocked' : ''}">
                <div class="guide-stage-img-box">
                  <img src="${st.image}" alt="${st.name}" style="width: 34px; height: 34px; object-fit: contain;">
                </div>
                <div style="flex: 1;">
                  <div style="font-size: 13px; font-weight: 900; color: var(--color-text-main);">
                    ${st.name}
                    <span class="guide-stage-badge ${st.unlocked ? 'badge-unlocked' : 'badge-locked'}">
                      ${st.unlocked ? '1단계 진행중' : '잠김'}
                    </span>
                  </div>
                  <div style="font-size: 10px; color: var(--color-primary-dark); font-weight: 800; margin-top: 1px;">
                    🎯 필요 조건: ${st.req}
                  </div>
                  <div style="font-size: 11px; color: var(--color-text-sub); margin-top: 3px; line-height: 1.3;">
                    ${st.desc}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <button class="btn-confirm-full" id="btn-close-guide" style="margin-top: 14px;">확인</button>
        </div>
      </div>
    `;

    getMobileContainer().insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('btn-close-guide').addEventListener('click', () => {
      playSFX('pop');
      const modal = getMobileContainer().querySelector('.modal-backdrop');
      if (modal) modal.remove();
    });
  }

  function openSeasonPickerModal() {
    playSFX('pop');
    const modalHtml = `
      <div class="modal-backdrop">
        <div class="modal-content-card" style="max-width: 330px;">
          <h2 style="font-size: 19px; font-weight: 900; margin-bottom: 4px;">🗓️ 유치원 4계절 + 졸업 선택기</h2>
          <p style="font-size: 11px; color: var(--color-text-sub); margin-bottom: 12px;">봄, 여름, 가을, 겨울 및 졸업 테마를 선택해 보세요!</p>
          
          <div class="season-option-list">
            ${Object.values(SEASONS_DATA).map(s => `
              <button class="season-opt-btn ${state.activeSeasonKey === s.id ? 'active' : ''}" data-id="${s.id}">
                <div class="season-opt-icon">
                  <img src="${s.image}" style="width: 34px; height: 34px; object-fit: contain;">
                </div>
                <div>
                  <div style="font-size: 13px; font-weight: 900;">${s.name}</div>
                  <div style="font-size: 10px; color: var(--color-text-sub);">${s.term} • 학급 누적 1,200회 도달</div>
                </div>
              </button>
            `).join('')}
          </div>

          <button class="btn-confirm-full" id="btn-close-season">닫기</button>
        </div>
      </div>
    `;

    getMobileContainer().insertAdjacentHTML('beforeend', modalHtml);

    document.querySelectorAll('.season-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        changeSeason(id);
        const modal = getMobileContainer().querySelector('.modal-backdrop');
        if (modal) modal.remove();
      });
    });

    document.getElementById('btn-close-season').addEventListener('click', () => {
      playSFX('pop');
      const modal = getMobileContainer().querySelector('.modal-backdrop');
      if (modal) modal.remove();
    });
  }

  function renderMissionsScreen() {
    const season = SEASONS_DATA[state.activeSeasonKey];
    const dailyCompleted = state.dailyMissions.filter(m => m.completed).length;
    const weeklyCompleted = state.weeklyMissions.filter(m => m.completed).length;

    const html = `
      <div class="missions-screen">
        <h2 class="screen-header-title" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="icon-btn" id="btn-go-home-m" title="역할선택" style="width: 34px; height: 34px;">🏠</button>
            <span>📋 실천 미션 대시보드</span>
          </div>
        </h2>

        <div class="mission-group" style="margin-bottom: 22px;">
          <div class="group-title-row">
            <span class="group-title">☀️ 오늘의 일일 미션 (5가지)</span>
            <button id="btn-refresh-daily" class="${state.dailyRefreshLeft > 0 ? '' : 'disabled'}" style="font-size: 11px; padding: 4px 10px; background: #FFFFFF; border: 1.5px solid var(--color-border); border-radius: 20px; font-weight: 800; cursor: pointer; opacity: ${state.dailyRefreshLeft > 0 ? '1' : '0.5'};">
              🔄 일일 교체 (오늘 남은 횟수: ${state.dailyRefreshLeft}/1회)
            </button>
          </div>
          <p style="font-size: 11px; color: var(--color-text-sub); margin-bottom: 10px;">
            * <strong>체크 미션(3개)</strong>: 개인 포인트 적립 (+50P)<br>
            * <strong>사진 인증(2개)</strong>: 개인 포인트 (+100P) &amp; <strong>학급 성장 게이지 상승!</strong>
          </p>

          ${state.dailyMissions.map(m => `
            <div class="mission-item-card">
              <div class="mission-info">
                <div class="mission-icon" style="font-size: 22px;">${m.emoji}</div>
                <div>
                  <div class="mission-text-title">${m.title}</div>
                  <div style="font-size: 11px; color: var(--color-text-sub);">
                    <span style="color: var(--color-primary-dark); font-weight: 800;">+${m.points}P</span> • ${m.category}
                  </div>
                </div>
              </div>

              ${m.type === 'check' ? `
                <button class="mission-action-btn ${m.completed ? 'btn-completed' : 'btn-upload'}" id="btn-check-daily-${m.id}" data-id="${m.id}">
                  ${m.completed ? '✓ 완료 (+50P)' : '체크 하기'}
                </button>
              ` : `
                <button class="mission-action-btn ${m.completed ? 'btn-completed' : 'btn-upload'}" id="btn-upload-daily-${m.id}" data-id="${m.id}">
                  ${m.completed ? '✓ 완료 (+100P)' : '📸 인증하기 (학급성장)'}
                </button>
              `}
            </div>
          `).join('')}
        </div>

        <div class="mission-group">
          <div class="group-title-row">
            <span class="group-title">🗓️ 이번 주 주간 미션 (3가지)</span>
            <button id="btn-refresh-weekly" style="font-size: 11px; padding: 4px 10px; background: #FFFFFF; border: 1.5px solid var(--color-border); border-radius: 20px; font-weight: 800; cursor: pointer; opacity: ${state.weeklyRefreshLeft > 0 ? '1' : '0.5'};">
              🔄 주간 교체 (이번 주 남은 횟수: ${state.weeklyRefreshLeft}/2회)
            </button>
          </div>
          <p style="font-size: 11px; color: var(--color-text-sub); margin-bottom: 10px;">
            * 한 달 12종 주간 은행에서 제공되며, 주 2회 교체 가능! (달성률: ${weeklyCompleted}/3)
          </p>

          ${state.weeklyMissions.map(m => `
            <div class="mission-item-card" style="background: linear-gradient(135deg, #FFFFFF 0%, #FFFDF0 100%); border-color: #FFE066;">
              <div class="mission-info">
                <div class="mission-icon" style="font-size: 22px; background: #FFF9E6;">${m.emoji}</div>
                <div>
                  <div class="mission-text-title">${m.title}</div>
                  <div style="font-size: 11px; color: #B27B00; font-weight: 800;">
                    +${m.points}P • ${m.req}
                  </div>
                  <div style="font-size: 10px; color: var(--color-text-sub); margin-top: 2px;">
                    ${m.desc}
                  </div>
                </div>
              </div>
              <button class="mission-action-btn ${m.completed ? 'btn-completed' : 'btn-upload'}" style="${m.completed ? '' : 'background: #FF8811; color: #FFF;'}" id="btn-weekly-${m.id}" data-id="${m.id}">
                ${m.completed ? '✓ 완료' : '진행하기'}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    appView.innerHTML = html;

    document.getElementById('btn-go-home-m').addEventListener('click', () => { playSFX('pop'); switchView('welcome'); });

    document.getElementById('btn-refresh-daily').addEventListener('click', () => {
      if (state.dailyRefreshLeft > 0) {
        playSFX('pop');
        state.dailyRefreshLeft -= 1;
        rotateDailyMissions();
        alert('🔄 오늘의 일일 미션이 무작위로 교체되었습니다!\n(오늘 남은 교체 횟수: 0회)');
        renderMissionsScreen();
      } else {
        playSFX('pop');
        alert('⚠️ 일일 미션 교체는 하루에 1회만 가능합니다!');
      }
    });

    document.getElementById('btn-refresh-weekly').addEventListener('click', () => {
      if (state.weeklyRefreshLeft > 0) {
        playSFX('pop');
        state.weeklyRefreshLeft -= 1;
        rotateWeeklyMissions();
        alert(`🔄 이번 주 주간 미션이 무작위로 교체되었습니다!\n(이번 주 남은 교체 횟수: ${state.weeklyRefreshLeft}회)`);
        renderMissionsScreen();
      } else {
        playSFX('pop');
        alert('⚠️ 주간 미션 교체는 이번 주 2회만 가능합니다!');
      }
    });

    state.dailyMissions.filter(m => m.type === 'check').forEach(m => {
      const btn = document.getElementById(`btn-check-daily-${m.id}`);
      if (btn) {
        btn.addEventListener('click', () => {
          playSFX('coin');
          m.completed = !m.completed;
          if (m.completed) {
            state.user.points += m.points;
            if (window.confetti) confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
            alert(`✅ 개인 실천 미션 완료! (+${m.points}P 개별 포인트 적립)\n* 학급 성장은 사진 인증 시 증가합니다.`);
          }
          renderMissionsScreen();
        });
      }
    });

    state.dailyMissions.filter(m => m.type === 'photo').forEach(m => {
      const btn = document.getElementById(`btn-upload-daily-${m.id}`);
      if (btn) {
        btn.addEventListener('click', () => {
          playSFX('pop');
          switchView('camera');
        });
      }
    });

    state.weeklyMissions.forEach(m => {
      const btn = document.getElementById(`btn-weekly-${m.id}`);
      if (btn) {
        btn.addEventListener('click', () => {
          playSFX('coin');
          if (!m.completed) {
            m.completed = true;
            state.user.points += m.points;
            alert(`🎉 주간 미션 "${m.title}" 달성 완료! (+${m.points}P 개인 포인트 보상)`);
            renderMissionsScreen();
          } else {
            alert('이미 이번 주 달성을 완료하셨습니다!');
          }
        });
      }
    });
  }

  function renderRoadmapScreen() {
    const season = SEASONS_DATA[state.activeSeasonKey];
    const photos = state.classPhotoAuthCount[state.activeSeasonKey];

    let activeLevelIdx = 0;
    if (photos >= 1200) activeLevelIdx = 5;
    else if (photos >= 960) activeLevelIdx = 4;
    else if (photos >= 720) activeLevelIdx = 3;
    else if (photos >= 480) activeLevelIdx = 2;
    else if (photos >= 240) activeLevelIdx = 1;
    else activeLevelIdx = 0;

    const html = `
      <div class="roadmap-screen">
        <div class="roadmap-header-card">
          <button class="icon-btn" id="btn-go-home-r" title="역할선택" style="width: 34px; height: 34px; flex-shrink: 0;">🏠</button>
          <img src="${season.stages[activeLevelIdx].image}" class="roadmap-header-img" alt="Active Stage Asset">
          <div class="roadmap-title-box">
            <h3>🗺️ ${season.seasonTag} 로드맵</h3>
            <p>20명 학급 누적 사진 인증 1,200회 완성 여정!</p>
          </div>
        </div>

        <div class="roadmap-stage-list">
          ${season.stages.map((st, idx) => {
            let statusClass = 'locked';
            let badgeTag = `<span class="roadmap-status-badge badge-status-locked">🔒 L${st.level} 잠김</span>`;

            if (idx < activeLevelIdx) {
              statusClass = 'completed';
              badgeTag = `<span class="roadmap-status-badge badge-status-completed">✓ L${st.level} 클리어</span>`;
            } else if (idx === activeLevelIdx) {
              statusClass = 'active';
              badgeTag = `<span class="roadmap-status-badge badge-status-active">⭐ L${st.level} 진행중</span>`;
            }

            return `
              <div class="roadmap-node-card ${statusClass}">
                <div class="roadmap-node-art">
                  <img src="${st.image}" alt="${st.name}">
                </div>
                <div class="roadmap-node-info">
                  <div class="roadmap-level-tag">LEVEL ${st.level} STAGE</div>
                  <div class="roadmap-node-name">${st.name}</div>
                  <div class="roadmap-node-desc">${st.desc}</div>
                </div>
                ${badgeTag}
              </div>
              ${idx < season.stages.length - 1 ? `<div class="path-connector-line ${idx < activeLevelIdx ? 'active' : ''}"></div>` : ''}
            `;
          }).join('')}
        </div>
      </div>
    `;

    appView.innerHTML = html;

    document.getElementById('btn-go-home-r').addEventListener('click', () => { playSFX('pop'); switchView('welcome'); });
  }

  function renderCameraScreen() {
    const html = `
      <div class="camera-view">
        <div class="camera-guide-card">
          📸 오늘의 인증 미션을 촬영하고 학급 성장 게이지를 올려보세요!
        </div>

        <div class="viewfinder-box">
          <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80" class="camera-sim-bg" alt="Camera Preview">
          <div class="viewfinder-frame">
            <span style="color: #FFF; font-weight: 700; background: rgba(0,0,0,0.6); padding: 4px 12px; border-radius: 20px;">
              멋진 실천 장면을 맞춰주세요
            </span>
          </div>
        </div>

        <div class="voice-record-box" id="voice-record-container">
          <div style="font-size: 12px; font-weight: 800; color: var(--color-text-main);">
            🎙️ 아이 음성 자랑하기 (터치하여 녹음)
          </div>
          <button class="voice-btn" id="btn-record-voice">🎙️</button>
          <div class="audio-wave hidden" id="audio-wave-anim">
            <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
          </div>
          <p style="font-size: 11px; color: var(--color-text-sub);" id="voice-status-text">버튼을 눌러 음성을 녹음하세요</p>
        </div>

        <div class="camera-controls">
          <button class="icon-btn" id="btn-camera-close">✕</button>
          <button class="shutter-btn" id="btn-take-photo">📸</button>
          <button class="icon-btn" id="btn-gallery">🖼️</button>
        </div>
      </div>
    `;

    appView.innerHTML = html;

    const micBtn = document.getElementById('btn-record-voice');
    const waveAnim = document.getElementById('audio-wave-anim');
    const statusText = document.getElementById('voice-status-text');
    let isRecording = false;

    micBtn.addEventListener('click', () => {
      playSFX('pop');
      isRecording = !isRecording;
      if (isRecording) {
        micBtn.classList.add('recording');
        waveAnim.classList.remove('hidden');
        statusText.innerText = '녹음 중... "나 오늘 물 잘 잠갔어요!"';
      } else {
        micBtn.classList.remove('recording');
        waveAnim.classList.add('hidden');
        statusText.innerText = '✅ 음성 녹음이 완료되었습니다!';
      }
    });

    document.getElementById('btn-camera-close').addEventListener('click', () => { playSFX('pop'); switchView('dashboard'); });
    document.getElementById('btn-take-photo').addEventListener('click', triggerSuccessModal);
    document.getElementById('btn-gallery').addEventListener('click', triggerSuccessModal);
  }

  function triggerSuccessModal() {
    playSFX('shutter');
    setTimeout(() => playSFX('fanfare'), 300);

    state.classPhotoAuthCount[state.activeSeasonKey] += 20;
    state.user.points += 100;

    // 사진 인증 클리어 시 피드에 자동 등록!
    const newPost = {
      id: Date.now(),
      name: state.user.name,
      photo: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=400&q=80',
      mission: '오늘의 사진 인증 미션 완수 📸',
      likes: 1,
      liked: true,
      time: '방금 전 인증 📸'
    };
    state.friends.unshift(newPost);

    const season = SEASONS_DATA[state.activeSeasonKey];
    const photos = state.classPhotoAuthCount[state.activeSeasonKey];

    if (window.confetti) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }

    const modalHtml = `
      <div class="modal-backdrop">
        <div class="modal-content-card" style="max-width: 330px;">
          <div class="modal-icon-badge">
            <img src="${season.stages[0].image}" alt="Season Object">
          </div>
          <h2 class="modal-title">사진 인증 성공! 피드 자동 등록! 🎉</h2>
          <div class="modal-subtext">
            우리 반 피드에 내 사진이 새로 올라갔어요!<br>
            학급 누적 <strong>${photos} / ${TARGET_TOTAL_PHOTOS}회</strong> 달성 (+100P 적립)
          </div>

          <div style="background-color: #FFF9E6; border-radius: 14px; padding: 12px; text-align: left; margin-bottom: 16px; border: 1px solid #FFE066;">
            <div style="font-size: 11px; font-weight: 800; color: #B27B00; margin-bottom: 2px;">💌 카카오톡 AI 칭찬 리포트 카드 자동 생성</div>
            <p style="font-size: 12px; color: #333; line-height: 1.4;">
              "오늘 행복 어린이가 <strong>'사진 인증 미션'</strong>을 성공하여 학급 피드에 자동 게시되었습니다!"
            </p>
          </div>

          <button class="btn-confirm-full" id="btn-modal-done">확인</button>
        </div>
      </div>
    `;

    getMobileContainer().insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('btn-modal-done').addEventListener('click', () => {
      playSFX('pop');
      const modal = getMobileContainer().querySelector('.modal-backdrop');
      if (modal) modal.remove();
      switchView('dashboard');
    });
  }

  function renderTeacherScreen() {
    const photos = state.classPhotoAuthCount[state.activeSeasonKey];
    const html = `
      <div class="teacher-screen">
        <div class="top-bar" style="margin-bottom: 14px;">
          <button class="icon-btn" id="btn-go-home-t" title="역할선택" style="width: 34px; height: 34px;">🏠</button>
          <span style="font-weight: 900; font-size: 14px;">선생님 전용 대시보드</span>
          <button class="season-selector-btn" id="btn-switch-child-mode" style="background: var(--color-primary); color: #FFFFFF; border: none;">
            <span>🧒 어린이 모드로</span>
          </button>
        </div>

        <div class="teacher-header">
          <h2>👩‍🏫 7세 햇살반 학급 사진 인증 관리</h2>
          <p>2달 챌린지 현재 학급 누적: <strong>${photos} / 1,200회 인증 달성</strong> (하루 평균 40회 목표)</p>
        </div>

        <button class="tv-mode-btn" id="btn-launch-tv">
          📺 교실 TV 3D 룰렛 & 팡파르 모드 실행
        </button>

        <button class="role-btn role-btn-child" id="btn-open-digital-cert" style="margin-bottom: 10px;">
          <span>🏆 모바일 1년 수료 디지털 상장 보기</span>
          <span>➔</span>
        </button>

        <button class="role-btn role-btn-teacher" id="btn-print-pdf-report" style="margin-bottom: 18px;">
          <span>📄 학급 A4 종이 상장 인쇄 (교사 전용)</span>
          <span>🖨️</span>
        </button>

        <div class="student-list-card">
          <h3 style="font-size: 14px; font-weight: 900; margin-bottom: 12px;">학생별 오늘 사진 인증 참여 현황</h3>
          ${state.students.map(s => `
            <div class="student-row">
              <div class="student-info">
                <span>👤 ${s.name} 어린이</span>
              </div>
              <span style="font-weight: 800; color: var(--color-primary-dark);">
                ${s.status}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    appView.innerHTML = html;

    document.getElementById('btn-go-home-t').addEventListener('click', () => { playSFX('pop'); switchView('welcome'); });
    document.getElementById('btn-switch-child-mode').addEventListener('click', () => { playSFX('pop'); state.role = 'STUDENT'; switchView('dashboard'); });
    document.getElementById('btn-launch-tv').addEventListener('click', () => { playSFX('fanfare'); switchView('tv'); });
    document.getElementById('btn-open-digital-cert').addEventListener('click', openDigitalCertificateModal);
    document.getElementById('btn-print-pdf-report').addEventListener('click', () => { playSFX('pop'); window.print(); });
  }

  function renderTVScreen() {
    const season = SEASONS_DATA[state.activeSeasonKey];
    const photos = state.classPhotoAuthCount[state.activeSeasonKey];

    const html = `
      <div style="padding: 24px; text-align: center; background: radial-gradient(circle, var(--color-primary-dark) 0%, #0F3318 100%); color: #FFF; min-height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="font-size: 26px; font-weight: 900; color: #FFD23F; margin-bottom: 8px;">🎉 7세 햇살반 학급 사진 인증 ${photos}회!</h1>
        <p style="font-size: 14px; margin-bottom: 16px;">20명 우리 반 아이들의 사진 인증으로 학급 게이지가 쑥쑥 올라갑니다!</p>
        
        <img src="${season.stages[0].image}" style="width: 180px; height: 180px; animation: float 3s infinite ease-in-out; margin-bottom: 18px;">
        
        <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); padding: 18px; border-radius: 20px; border: 2px solid #FFD23F; margin-bottom: 20px; width: 100%;">
          <h3 style="font-size: 16px; color: #FFD23F; margin-bottom: 8px;">🎰 교실 오프라인 럭키 드로우 룰렛</h3>
          <button id="btn-spin-roulette" style="padding: 10px 20px; background: linear-gradient(135deg, #FFD23F 0%, #FF8811 100%); color: #333; font-weight: 900; border: none; border-radius: 30px; cursor: pointer; font-size: 15px;">
            룰렛 돌리기 🎯
          </button>
          <div id="roulette-result" style="font-size: 16px; font-weight: 900; color: #FFF; margin-top: 10px; height: 24px;"></div>
        </div>

        <button id="btn-exit-tv" style="padding: 10px 22px; background-color: #FFF; color: #333; border: none; border-radius: 30px; font-weight: 800; cursor: pointer;">
          교사 관리 화면으로 돌아가기
        </button>
      </div>
    `;

    appView.innerHTML = html;

    if (window.confetti) {
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    }

    document.getElementById('btn-spin-roulette').addEventListener('click', () => {
      playSFX('fanfare');
      const res = document.getElementById('roulette-result');
      res.innerText = '🎲 룰렛 돌아가는 중...';
      setTimeout(() => {
        const rewards = ['🎁 1번 박스 보물상자 뽑기!', '⭐ 학급 칭찬 도장 획득!', '👑 오늘의 칭찬왕 왕관 부착!'];
        res.innerText = rewards[Math.floor(Math.random() * rewards.length)];
      }, 1500);
    });

    document.getElementById('btn-exit-tv').addEventListener('click', () => { playSFX('pop'); switchView('teacher'); });
  }

  function renderProfileScreen() {
    const html = `
      <div class="profile-screen">
        <div class="top-bar" style="margin-bottom: 12px;">
          <button class="icon-btn" id="btn-go-home-p" title="역할선택" style="width: 34px; height: 34px;">🏠</button>
          <span style="font-weight: 900; font-size: 14px;">마이페이지 & 포인트 상점</span>
          <div></div>
        </div>

        <div class="profile-card-top">
          <div class="profile-avatar-big">🧒</div>
          <h2 style="font-size: 19px; font-weight: 900;">${state.user.name}</h2>
          <p style="font-size: 12px; color: var(--color-text-sub);">${state.user.class}</p>
          
          <div class="coin-balance-pill">
            🪙 보유 포인트: <strong style="font-size: 16px;">${state.user.points}P</strong>
          </div>
        </div>

        <button class="role-btn role-btn-child" id="btn-open-digital-cert-profile" style="margin-bottom: 18px; background-color: #FFD23F; color: #3A2500;">
          <span>🏆 1년 수료 디지털 상장 미리보기</span>
          <span>➔</span>
        </button>

        <div class="section-header">
          <h3 class="section-title">🎟️ 실물 보상 쿠폰 상점 (포인트 교환)</h3>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px;">
          ${state.realCoupons.map(c => `
            <div class="mission-item-card" style="background: linear-gradient(135deg, #FFFFFF 0%, #FFFDF0 100%); border-color: #FFE066;">
              <div class="mission-info">
                <div class="mission-icon" style="font-size: 26px; background: #FFF9E6;">${c.emoji}</div>
                <div>
                  <div class="mission-text-title">${c.title}</div>
                  <div style="font-size: 11px; color: #B27B00; font-weight: 800;">
                    ${c.cost} P 교환 가능 • ${c.type === 'parent' ? '🏠 가정 보상' : '🏫 학급 보상'}
                  </div>
                  <div style="font-size: 10px; color: var(--color-text-sub); margin-top: 2px;">
                    ${c.desc}
                  </div>
                </div>
              </div>
              <button class="shop-buy-coupon-btn" data-id="${c.id}" data-cost="${c.cost}" data-title="${c.title}" style="padding: 8px 14px; border-radius: 20px; background: linear-gradient(135deg, #FFD23F 0%, #FF8811 100%); color: #333; font-weight: 900; border: none; cursor: pointer; font-size: 12px;">
                쿠폰 교환
              </button>
            </div>
          `).join('')}
        </div>

        <div class="section-header">
          <h3 class="section-title">✨ 앱 내 아바타 꾸미기 상점</h3>
        </div>

        <div class="shop-grid">
          <div class="shop-item-card">
            <div class="shop-item-icon">✨</div>
            <div style="font-weight: 800; font-size: 13px;">반짝이는 빛새</div>
            <div style="font-size: 11px; color: var(--color-text-sub);">100P</div>
            <button class="shop-buy-btn" data-cost="100">구매/장착</button>
          </div>

          <div class="shop-item-card">
            <div class="shop-item-icon">💧</div>
            <div style="font-weight: 800; font-size: 13px;">이슬방울 세트</div>
            <div style="font-size: 11px; color: var(--color-text-sub);">50P</div>
            <button class="shop-buy-btn" data-cost="50">구매/장착</button>
          </div>

          <div class="shop-item-card">
            <div class="shop-item-icon">☀️</div>
            <div style="font-weight: 800; font-size: 13px;">햇살 램프</div>
            <div style="font-size: 11px; color: var(--color-text-sub);">250P</div>
            <button class="shop-buy-btn" data-cost="250">구매/장착</button>
          </div>

          <div class="shop-item-card">
            <div class="shop-item-icon">🎀</div>
            <div style="font-weight: 800; font-size: 13px;">무지개 리본</div>
            <div style="font-size: 11px; color: var(--color-text-sub);">150P</div>
            <button class="shop-buy-btn" data-cost="150">구매/장착</button>
          </div>
        </div>
      </div>
    `;

    appView.innerHTML = html;

    document.getElementById('btn-go-home-p').addEventListener('click', () => { playSFX('pop'); switchView('welcome'); });
    document.getElementById('btn-open-digital-cert-profile').addEventListener('click', openDigitalCertificateModal);

    appView.querySelectorAll('.shop-buy-coupon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cost = parseInt(btn.dataset.cost);
        const title = btn.dataset.title;

        if (state.user.points >= cost) {
          playSFX('fanfare');
          state.user.points -= cost;
          if (window.confetti) confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });

          alert(`🎉 축하합니다!\n"${title}" 교환 성공! (${cost}P 차감)\n\n담임선생님과 부모님 모바일 앱으로 모바일 교환 쿠폰이 발송되었습니다.`);
          renderProfileScreen();
        } else {
          playSFX('pop');
          alert(`포인트가 부족해요! (필요: ${cost}P / 현재: ${state.user.points}P)\n미션을 수행하고 포인트를 더 모아보세요.`);
        }
      });
    });

    appView.querySelectorAll('.shop-buy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cost = parseInt(btn.dataset.cost);
        if (state.user.points >= cost) {
          playSFX('coin');
          state.user.points -= cost;
          alert('🎉 아이템을 성공적으로 구매하고 내 오브젝트에 장착했습니다!');
          renderProfileScreen();
        } else {
          alert('포인트가 부족해요! 미션을 수행하고 포인트를 더 모아보세요.');
        }
      });
    });
  }

  function openDigitalCertificateModal() {
    playSFX('fanfare');

    if (window.confetti) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
    }

    const modalHtml = `
      <div class="modal-backdrop">
        <div class="modal-content-card" style="max-width: 330px;">
          <div class="digital-cert-card">
            <div class="cert-header-icon">🏆</div>
            <h2 class="cert-title">1년 성취 디지털 상장</h2>
            <div class="cert-subtitle">클래스 트리 (ClassTree) 유치원 학급 챌린지</div>
            
            <div class="cert-info-box">
              <div class="cert-info-row">
                <span style="color: var(--color-text-sub);">어린이 이름</span>
                <strong>김행복 (7세 햇살반)</strong>
              </div>
              <div class="cert-info-row">
                <span style="color: var(--color-text-sub);">학급 누적 인증</span>
                <strong style="color: var(--color-primary-dark);">${state.classPhotoAuthCount[state.activeSeasonKey]} / 1,200회 📸</strong>
              </div>
              <div class="cert-info-row">
                <span style="color: var(--color-text-sub);">보유 포인트</span>
                <strong>${state.user.points} P</strong>
              </div>
            </div>

            <div class="cert-comment-box">
              <strong>💬 담임선생님 칭찬 총평:</strong><br>
              "행복 어린이는 20명 햇살반 친구들과 함께 사진 인증 미션으로 학급 성장을 이루어내는 자랑스러운 어린이입니다!"
            </div>

            <div class="cert-btn-group">
              <button class="cert-action-btn cert-btn-kakao" id="btn-share-kakao">
                💬 카카오톡 공유
              </button>
              <button class="cert-action-btn cert-btn-save" id="btn-save-cert">
                📥 갤러리 저장
              </button>
            </div>
          </div>

          <button class="btn-confirm-full" id="btn-close-cert">닫기</button>
        </div>
      </div>
    `;

    getMobileContainer().insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('btn-share-kakao').addEventListener('click', () => {
      playSFX('pop');
      alert('💬 "김행복 어린이의 1년 성취 디지털 상장"이 가족 카카오톡으로 공유되었습니다!');
    });

    document.getElementById('btn-save-cert').addEventListener('click', () => {
      playSFX('pop');
      alert('📥 디지털 상장 카드가 스마트폰 갤러리에 고화질 이미지로 저장되었습니다!');
    });

    document.getElementById('btn-close-cert').addEventListener('click', () => {
      playSFX('pop');
      const modal = getMobileContainer().querySelector('.modal-backdrop');
      if (modal) modal.remove();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
