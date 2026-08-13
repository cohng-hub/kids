/* ==========================================================================
   ClassTree (클래스 트리) - 어린이 메이플스토리풍 SD 개별 마스코트 연동
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

  const CACHE_BUST = '?v=20260731_v27';

  const AVATAR_SHOP_ITEMS = [
    { id: 'item_bird', name: '반짝이는 빛새 펫', icon: '✨', aura: '🕊️', asset: './assets/classtree_avatar_bird.png' + CACHE_BUST, cost: 100, desc: '내 꼬마 마스코트 캐릭터 옆에 빛새 펫이 훨훨 날아다녀요!' },
    { id: 'item_dew', name: '이슬방울 오라 세트', icon: '💧', aura: '💧', asset: '', cost: 50, desc: '내 마스코트 주변에 반짝이는 맑은 이슬 오라가 감싸요!' },
    { id: 'item_lamp', name: '햇살 램프 크라운', icon: '☀️', aura: '☀️', asset: '', cost: 250, desc: '내 마스코트 머리 위에 따뜻한 햇살 조명이 켜져요!' },
    { id: 'item_ribbon', name: '무지개 리본 머리띠', icon: '🎀', aura: '🎀', asset: './assets/classtree_avatar_ribbon.png' + CACHE_BUST, cost: 150, desc: '내 마스코트 머리 위에 커다란 귀요미 리본 착용!' }
  ];

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
    { title: '이번 주 사진 인증 미션 4회 이상 성공', req: '0회 / 4회 진행중', points: 250, emoji: '📸', desc: '사진 인증 마스터 (+학급 성장)' },
    { title: '일주일 동안 칭찬 미션 연속 실천하기', req: '0일 / 7일 진행중', points: 250, emoji: '🌟', desc: '바른 습관 칭찬상' }
  ];

  const TARGET_TOTAL_PHOTOS = 600;

  const THEMES_CATALOG = {
    hangeul: {
      id: 'hangeul',
      category: '한글 / 언어',
      tag: '🔤 한글 말놀이',
      name: '🔤 [한글] 세종대왕 말하는 한글나무',
      desc: '자음/모음 말놀이, 예쁜 말 쓰기, 내 이름 쓰기 1개월 챌린지',
      particles: ['🔤', '✨', '🍃', '🌸', '📜'],
      image: './assets/classtree_3d_seed_character.png' + CACHE_BUST,
      stages: [
        { level: 1, icon: '🌱', image: './assets/classtree_3d_seed_character.png' + CACHE_BUST, name: '1단계: 훈민정음 자음 씨앗', req: '학급 누적 1~60회', desc: '닿소리와 홀소리가 만나는 씨앗 캐릭터 수줍게 미소!', unlocked: true },
        { level: 2, icon: '🌿', image: './assets/classtree_3d_sprout.png' + CACHE_BUST, name: '2단계: 모음 햇살 아기 새싹', req: '학급 누적 120회', desc: '내 이름 쓰기로 연두색 한글 새싹이 돋아납니다.', unlocked: false },
        { level: 3, icon: '🪵', image: './assets/classtree_3d_sapling.png' + CACHE_BUST, name: '3단계: 낱말 꽃 묘목', req: '학급 누적 240회', desc: '예쁜 말 쓰기 실천으로 줄기가 튼튼해집니다.', unlocked: false },
        { level: 4, icon: '🌸', image: './assets/classtree_3d_blossom_tree.png' + CACHE_BUST, name: '4단계: 예쁜 말 참나무', req: '학급 누적 360회', desc: '친구에게 고운 말 인증으로 꽃이 만개합니다.', unlocked: false },
        { level: 5, icon: '🌳', image: './assets/classtree_3d_fruit_tree.png' + CACHE_BUST, name: '5단계: 지혜 문장 한글 대형나무', req: '학급 누적 480회', desc: '동화 말소리 따라하기로 달콤한 낱말 열매 열립니다.', unlocked: false },
        { level: 6, icon: '🏞️', image: './assets/classtree_3d_spring_forest.png' + CACHE_BUST, name: '6단계: 전설의 세종 한글 숲', req: '학급 누적 600회 완수!', desc: '1개월 600회 완료! 교실 대형 한글 보물상자 해금!', unlocked: false }
      ],
      dailyMissions: {
        check: [
          { title: '오늘 가족에게 "사랑해요" 예쁜 말 표현하기', points: 50, emoji: '💖', category: '한글 말놀이 미션' },
          { title: '내 이름 3번 소리 내어 바르게 읽기', points: 50, emoji: '🔤', category: '한글 말놀이 미션' },
          { title: '친구 이름을 다정하고 따뜻하게 불러주기', points: 50, emoji: '👏', category: '한글 말놀이 미션' },
          { title: '잠들기 전 예쁜 말 3가지 말하기', points: 50, emoji: '🌙', category: '한글 말놀이 미션' }
        ],
        photo: [
          { title: '스스로 내 이름 예쁘게 쓴 종이 찍기', points: 100, emoji: '✏️', category: '학급 한글 인증 📸' },
          { title: '동화책 속 가장 마음에 드는 단어 찰칵!', points: 100, emoji: '📖', category: '학급 한글 인증 📸' }
        ]
      }
    },
    number: {
      id: 'number',
      category: '숫자 / 수학',
      tag: '🔢 수 세기 & 정돈',
      name: '🔢 [숫자] 알록달록 수 세기 로봇',
      desc: '1~10 수 세기, 패턴 분류, 신발/장난감 수 정돈 1개월 챌린지',
      particles: ['🔢', '⚡', '🤖', '📐', '✨'],
      image: './assets/classtree_3d_robot_part.png' + CACHE_BUST,
      stages: [
        { level: 1, icon: '🔩', image: './assets/classtree_3d_robot_part.png' + CACHE_BUST, name: '1단계: 꼬마 숫자 나사 부품', req: '학급 누적 1~60회', desc: '숫자 1부터 10까지 센 귀여운 3D 나사 부품 캐릭터!', unlocked: true },
        { level: 2, icon: '🔋', image: './assets/classtree_3d_robot_core.png' + CACHE_BUST, name: '2단계: 123 파워 코어 엔진', req: '학급 누적 120회', desc: '장난감 개수 세기로 코어 에너지가 가동됩니다.', unlocked: false },
        { level: 3, icon: '🤖', image: './assets/classtree_3d_robot.png' + CACHE_BUST, name: '3단계: 계산 척척 수 세기 로봇', req: '학급 누적 240회', desc: '신발 쌍 세기 성공으로 멋진 서핑 로봇 완성.', unlocked: false },
        { level: 4, icon: '🚀', image: './assets/classtree_3d_robot_booster.png' + CACHE_BUST, name: '4단계: 패턴 발사 부스터', req: '학급 누적 360회', desc: '알록달록 패턴 분류 사진 완수로 우주 부스터!', unlocked: false },
        { level: 5, icon: '🛸', image: './assets/classtree_3d_robot_spaceship.png' + CACHE_BUST, name: '5단계: 하이퍼 수학 우주선', req: '학급 누적 480회', desc: '시계 약속 시간 지키기로 파워 합체!', unlocked: false },
        { level: 6, icon: '🌌', image: './assets/classtree_3d_robot_galaxy.png' + CACHE_BUST, name: '6단계: 대우주 숫자 탐사선', req: '학급 누적 600회 완수!', desc: '우주선 발사 준비 완료! 숫자 룰렛 축제 해금!', unlocked: false }
      ],
      dailyMissions: {
        check: [
          { title: '양치하며 마음속으로 1부터 30까지 세기', points: 50, emoji: '🪥', category: '숫자 정돈 미션' },
          { title: '내 신발 바르게 2짝(1쌍) 정리하기', points: 50, emoji: '👟', category: '숫자 정돈 미션' },
          { title: '장난감 다 놀고 5개 이상 제자리에 넣기', points: 50, emoji: '🧸', category: '숫자 정돈 미션' }
        ],
        photo: [
          { title: '알록달록 모양 블록 개수 세어 나열한 사진', points: 100, emoji: '🧩', category: '학급 숫자 인증 📸' },
          { title: '오늘 저녁 식사 시 숟가락/젓가락 수 챙기기', points: 100, emoji: '🥢', category: '학급 숫자 인증 📸' }
        ]
      }
    },
    env: {
      id: 'env',
      category: '환경 / 생태',
      tag: '🌱 환경 지킴이',
      name: '🌱 [환경] 지구를 구하는 그린 챔피언',
      desc: '분리배출, 불 끄기, 물 잠그기, 잔반 없는 그릇 1개월 챌린지',
      particles: ['🌱', '🍃', '🌸', '🚰', '✨'],
      image: './assets/classtree_3d_seed_character.png' + CACHE_BUST,
      stages: [
        { level: 1, icon: '🌱', image: './assets/classtree_3d_seed_character.png' + CACHE_BUST, name: '1단계: 약속 그린 씨앗', req: '학급 누적 1~60회', desc: '지구를 지키는 첫 약속 씨앗이 수줍게 눈떠요.', unlocked: true },
        { level: 2, icon: '🌿', image: './assets/classtree_3d_sprout.png' + CACHE_BUST, name: '2단계: 맑은 이슬 아기 새싹', req: '학급 누적 120회', desc: '양치 물 잠그기 성공으로 맑은 이슬 새싹 자람.', unlocked: false },
        { level: 3, icon: '🪵', image: './assets/classtree_3d_sapling.png' + CACHE_BUST, name: '3단계: 분리배출 척척 묘목', req: '학급 누적 240회', desc: '재활용 분리배출 돕기로 묘목 줄기 튼튼해짐.', unlocked: false },
        { level: 4, icon: '🌸', image: './assets/classtree_3d_blossom_tree.png' + CACHE_BUST, name: '4단계: 에코 플라워 참나무', req: '학급 누적 360회', desc: '빈 그릇 잔반 안 남기기로 꽃이 만개합니다.', unlocked: false },
        { level: 5, icon: '🌳', image: './assets/classtree_3d_fruit_tree.png' + CACHE_BUST, name: '5단계: 싱그러운 환경 대형나무', req: '학급 누적 480회', desc: '방 나갈 때 스위치 끄기로 환경 열매 퐁퐁!', unlocked: false },
        { level: 6, icon: '🏞️', image: './assets/classtree_3d_spring_forest.png' + CACHE_BUST, name: '6단계: 전설의 청정 지구 숲', req: '학급 누적 600회 완수!', desc: '환경 보물상자 해금! 지구 영웅 훈장 수여!', unlocked: false }
      ],
      dailyMissions: {
        check: [
          { title: '양치 중 수도 꼭지 잘 잠그고 컵 사용', points: 50, emoji: '🚰', category: '환경 수호 미션' },
          { title: '외출/방 나갈 때 전등 스위치 끄기', points: 50, emoji: '💡', category: '환경 수호 미션' },
          { title: '종이 한 장 아껴 쓰고 뒷면 드로잉하기', points: 50, emoji: '📄', category: '환경 수호 미션' }
        ],
        photo: [
          { title: '식사 잔반 싹 비운 깨끗한 밥그릇', points: 100, emoji: '🍱', category: '학급 환경 인증 📸' },
          { title: '분리배출 재활용 상자에 바르게 분리한 사진', points: 100, emoji: '♻️', category: '학급 환경 인증 📸' }
        ]
      }
    },
    bio: {
      id: 'bio',
      category: '생물 / 탐구',
      tag: '🐾 신비 동식물',
      name: '🐾 [생물] 신비한 동식물 탐험대',
      desc: '화분 물주기, 반려동물 다정하게 대하기, 생명사랑 1개월 챌린지',
      particles: ['🐾', '🪴', '🐥', '🍃', '✨'],
      image: './assets/classtree_3d_seed_character.png' + CACHE_BUST,
      stages: [
        { level: 1, icon: '🐣', image: './assets/classtree_3d_seed_character.png' + CACHE_BUST, name: '1단계: 탐험 첫 알과 씨앗', req: '학급 누적 1~60회', desc: '생명의 신비로운 귀여운 첫 알 캐릭터.', unlocked: true },
        { level: 2, icon: '🐥', image: './assets/classtree_3d_sprout.png' + CACHE_BUST, name: '2단계: 아기 싹과 아가 동식물', req: '학급 누적 120회', desc: '화분 물주기로 앙증맞은 아기 싹 탄생!', unlocked: false },
        { level: 3, icon: '🦊', image: './assets/classtree_3d_sapling.png' + CACHE_BUST, name: '3단계: 호기심 탐험 묘목', req: '학급 누적 240회', desc: '동식물 나뭇잎 관찰로 푸르름이 짙어져요.', unlocked: false },
        { level: 4, icon: '🌸', image: './assets/classtree_3d_blossom_tree.png' + CACHE_BUST, name: '4단계: 생명사랑 무지개 숲', req: '학급 누적 360회', desc: '생명 존중 인성 미션 성공으로 무지개 피어남.', unlocked: false },
        { level: 5, icon: '🌳', image: './assets/classtree_3d_fruit_tree.png' + CACHE_BUST, name: '5단계: 동식물 보물 동산', req: '학급 누적 480회', desc: '곤충과 동물 다정히 대하기로 달콤 열매 자람.', unlocked: false },
        { level: 6, icon: '👑', image: './assets/classtree_3d_spring_forest.png' + CACHE_BUST, name: '6단계: 전설의 생명 킹덤', req: '학급 누적 600회 완수!', desc: '동식물 보물상자 해금! 생명 탐험 훈장 수여!', unlocked: false }
      ],
      dailyMissions: {
        check: [
          { title: '베란다/교실 화분에 시원한 물 주기', points: 50, emoji: '🪴', category: '생물 탐험 미션' },
          { title: '지나가는 작은 곤충 다치지 않게 보호하기', points: 50, emoji: '🐞', category: '생물 탐험 미션' },
          { title: '강아지/고양이 등 동식물에게 살갑게 인사하기', points: 50, emoji: '🐶', category: '생물 탐험 미션' }
        ],
        photo: [
          { title: '예쁜 식물 잎사귀나 꽃을 관찰하는 모습', points: 100, emoji: '🌿', category: '학급 생물 인증 📸' },
          { title: '좋아하는 동식물 흉내 내며 활짝 웃는 미소', points: 100, emoji: '🦁', category: '학급 생물 인증 📸' }
        ]
      }
    },
    team: {
      id: 'team',
      category: '협동 / 사회성',
      tag: '🤝 다 함께 협동',
      name: '🤝 [협동] 다 함께 영차영차 무지개 다리',
      desc: '양보하기, 함께 쓰기, 줄 서기, 친구 칭찬하기 1개월 챌린지',
      particles: ['🤝', '🌈', '🧱', '🌉', '✨'],
      image: './assets/classtree_3d_puzzle_piece.png' + CACHE_BUST,
      stages: [
        { level: 1, icon: '🧱', image: './assets/classtree_3d_puzzle_piece.png' + CACHE_BUST, name: '1단계: 우정 첫 디딤돌', req: '학급 누적 1~60회', desc: '친구와 첫 양보 미션으로 단단한 우정 디딤돌 놓기.', unlocked: true },
        { level: 2, icon: '👣', image: './assets/classtree_3d_puzzle.png' + CACHE_BUST, name: '2단계: 손잡는 아치 다리', req: '학급 누적 120회', desc: '장난감 순서대로 같이 쓰기로 다리 기둥이 서요.', unlocked: false },
        { level: 3, icon: '🌈', image: './assets/classtree_3d_puzzle_sparkle.png' + CACHE_BUST, name: '3단계: 영차영차 무지개 다리', req: '학급 누적 240회', desc: '친구 도움 칭찬 카드로 알록달록 무지개 다리 완성.', unlocked: false },
        { level: 4, icon: '🌉', image: './assets/classtree_3d_puzzle_frame.png' + CACHE_BUST, name: '4단계: 튼튼한 우정 교량', req: '학급 누적 360회', desc: '줄 바르게 서기 성공으로 교량이 완성됩니다.', unlocked: false },
        { level: 5, icon: '🏰', image: './assets/classtree_3d_puzzle_gold.png' + CACHE_BUST, name: '5단계: 화합의 황금 성채', req: '학급 누적 480회', desc: '학급 모둠 챌린지 성공으로 황금 깃발 부착!', unlocked: false },
        { level: 6, icon: '🎆', image: './assets/classtree_3d_puzzle_diploma.png' + CACHE_BUST, name: '6단계: 전설의 학급 평화 랜드', req: '학급 누적 600회 완수!', desc: '평화 다리 완성! 파티 축제 및 칭찬 훈장 해금!', unlocked: false }
      ],
      dailyMissions: {
        check: [
          { title: '친구에게 장난감 양보하고 순서 기다리기', points: 50, emoji: '🤝', category: '협동 인성 미션' },
          { title: '손 씻거나 이동할 때 제자리에 바르게 줄 서기', points: 50, emoji: '🚶‍♂️', category: '협동 인성 미션' },
          { title: '오늘 반 친구 1명에게 고마움 칭찬하기', points: 50, emoji: '💌', category: '협동 인성 미션' }
        ],
        photo: [
          { title: '친구와 서로 손잡고 사이좋게 웃는 모습', points: 100, emoji: '👫', category: '학급 협동 인증 📸' },
          { title: '모둠 활동 후 다 함께 장난감 싹 정돈한 장면', points: 100, emoji: '🧸', category: '학급 협동 인증 📸' }
        ]
      }
    },
    adapt: {
      id: 'adapt',
      category: '적응 / 기본생활',
      tag: '🎒 신나는 적응',
      name: '🎒 [적응] 두근두근 신나는 유치원 하루',
      desc: '혼자 옷 걸기, 신발 정돈, 인사 예절, 가방 준비 1개월 챌린지',
      particles: ['🎒', '👟', '👕', '👏', '✨'],
      image: './assets/classtree_3d_seed_character.png' + CACHE_BUST,
      stages: [
        { level: 1, icon: '🌱', image: './assets/classtree_3d_seed_character.png' + CACHE_BUST, name: '1단계: 수줍은 신입 씨앗', req: '학급 누적 1~60회', desc: '유치원 생활 첫 걸음을 뗀 수줍은 씨앗 친구.', unlocked: true },
        { level: 2, icon: '🌿', image: './assets/classtree_3d_sprout.png' + CACHE_BUST, name: '2단계: 인사 잘하는 아기 싹', req: '학급 누적 120회', desc: '선생님께 "안녕하세요" 배꼽인사로 싹이 터요.', unlocked: false },
        { level: 3, icon: '👟', image: './assets/classtree_3d_sapling.png' + CACHE_BUST, name: '3단계: 신발 정돈 마스터 묘목', req: '학급 누적 240회', desc: '스스로 신발장에서 신발 가지런히 정리하기.', unlocked: false },
        { level: 4, icon: '🌳', image: './assets/classtree_3d_blossom_tree.png' + CACHE_BUST, name: '4단계: 규칙 지킴이 늠름나무', req: '학급 누적 360회', desc: '옷 걸이에 자기 옷 척 걸어두며 늠름해져요.', unlocked: false },
        { level: 5, icon: '🌟', image: './assets/classtree_3d_fruit_tree.png' + CACHE_BUST, name: '5단계: 자율정돈 100점 대형나무', req: '학급 누적 480회', desc: '내일 유치원 가방 스스로 준비하며 100점 달성!', unlocked: false },
        { level: 6, icon: '🏆', image: './assets/classtree_3d_spring_forest.png' + CACHE_BUST, name: '6단계: 전설의 적응왕 자람 숲', req: '학급 누적 600회 완수!', desc: '스스로 어린이 왕관 수여! 학급 자율왕 상장 해금!', unlocked: false }
      ],
      dailyMissions: {
        check: [
          { title: '선생님과 부모님께 손 흔들며 배꼽 인사하기', points: 50, emoji: '👏', category: '자율 적응 미션' },
          { title: '외출 후 옷 걸이에 내 옷 착 걸어두기', points: 50, emoji: '👕', category: '자율 적응 미션' },
          { title: '내일 가방에 물병과 소지품 미리 준비하기', points: 50, emoji: '🎒', category: '자율 적응 미션' }
        ],
        photo: [
          { title: '신발장에서 내 신발 예쁘게 차란 정돈한 사진', points: 100, emoji: '👟', category: '학급 적응 인증 📸' },
          { title: '유치원 가기 전 스스로 옷 입고 준비한 늠름 포즈', points: 100, emoji: '😊', category: '학급 적응 인증 📸' }
        ]
      }
    },
    digital: {
      id: 'digital',
      category: '디지털 / AI / 코딩',
      tag: '🤖 AI & 언플러그드 코딩',
      name: '🤖 [디지털/AI/코딩] 스마트 AI 로봇과 언플러그드 코딩 탐험대',
      desc: '양치/정리 3단계 코딩 순서도, AI 로봇 학습, 스마트 기기 약속 1개월 챌린지',
      particles: ['🤖', '💻', '🧩', '🚀', '✨'],
      image: './assets/classtree_3d_robot_part.png' + CACHE_BUST,
      stages: [
        { level: 1, icon: '🧩', image: './assets/classtree_3d_robot_part.png' + CACHE_BUST, name: '1단계: 코딩 명령 스위치 칩', req: '학급 누적 1~60회', desc: '1단계-2단계-3단계 순서도 명령 칩으로 시작!', unlocked: true },
        { level: 2, icon: '👓', image: './assets/classtree_3d_robot_core.png' + CACHE_BUST, name: '2단계: 바른자세 스마트 안경', req: '학급 누적 120회', desc: '화면 볼 때 거북목 예방 스트레칭으로 파워 ON!', unlocked: false },
        { level: 3, icon: '🤖', image: './assets/classtree_3d_robot.png' + CACHE_BUST, name: '3단계: 언플러그드 스마트 로봇', req: '학급 누적 240회', desc: '양치 3단계 코딩 순서 실행으로 로봇 완성.', unlocked: false },
        { level: 4, icon: '🚀', image: './assets/classtree_3d_robot_booster.png' + CACHE_BUST, name: '4단계: AI 학습 부스터 우주선', req: '학급 누적 360회', desc: 'AI 친구에게 예쁜 말 가르쳐주기 미션으로 발사!', unlocked: false },
        { level: 5, icon: '🏰', image: './assets/classtree_3d_robot_spaceship.png' + CACHE_BUST, name: '5단계: 미래 ICT 마법 궁전', req: '학급 누적 480회', desc: '스마트 약속 시간 지키기로 미래 궁전 완성.', unlocked: false },
        { level: 6, icon: '🛸', image: './assets/classtree_3d_robot_galaxy.png' + CACHE_BUST, name: '6단계: 전설의 디지털 코딩 탐사대', req: '학급 누적 600회 완수!', desc: '미래 AI 코딩 박사 상장 해금! 룰렛 축제!', unlocked: false }
      ],
      dailyMissions: {
        check: [
          { title: '양치 3단계 순서도 (물받기➔치약짜기➔치카) 실행', points: 50, emoji: '🧩', category: '언플러그드 코딩 미션' },
          { title: '스마트폰/TV 볼 때 30cm 멀리서 바른 자세 유지', points: 50, emoji: '👓', category: '디지털 약속 미션' },
          { title: '오늘 정해진 미디어 약속 시간(30분) 딱 지키기', points: 50, emoji: '⏰', category: '디지털 약속 미션' },
          { title: 'AI 꼬마 로봇 친구에게 "고마워" 예쁜 말 가르치기', points: 50, emoji: '🤖', category: 'AI 로봇 학습 미션' }
        ],
        photo: [
          { title: 'AI 친구에게 가르쳐줄 나의 환한 미소 셀카', points: 100, emoji: '📸', category: '학급 AI 인증 📸' },
          { title: '신발 정돈을 알고리즘 순서(1번-2번-3번)대로 실행한 모습', points: 100, emoji: '👟', category: '학급 코딩 인증 📸' }
        ]
      }
    },
    book: {
      id: 'book',
      category: '그림책 / 언어',
      tag: '📖 그림책 보물기차',
      name: '📖 [그림책] 마법 동화 나라 보물 기차',
      desc: '부모님과 동화책 읽기, 바른 책장 정리, 동화 인물 마음 짐작 1개월 챌린지',
      particles: ['📖', '📚', '🚂', '🌈', '✨'],
      image: './assets/classtree_3d_train_locomotive.png' + CACHE_BUST,
      stages: [
        { level: 1, icon: '🚂', image: './assets/classtree_3d_train_locomotive.png' + CACHE_BUST, name: '1단계: 이야기 첫 장 꼬마 기관차', req: '학급 누적 1~60회', desc: '동화책 첫 장을 여는 상상 꼬마 기관차 출발!', unlocked: true },
        { level: 2, icon: '🚃', image: './assets/classtree_3d_train.png' + CACHE_BUST, name: '2단계: 동화 마을 3칸 연결', req: '학급 누적 120회', desc: '책 읽고 기분 말하기로 알록달록 기차 칸 연결.', unlocked: false },
        { level: 3, icon: '📚', image: './assets/classtree_3d_train_books.png' + CACHE_BUST, name: '3단계: 5칸 지혜 서가 기차', req: '학급 누적 240회', desc: '책 읽은 후 책장에 바르게 꽂기 실천.', unlocked: false },
        { level: 4, icon: '🌈', image: './assets/classtree_3d_train_rainbow.png' + CACHE_BUST, name: '4단계: 10칸 무지개 보물책 열차', req: '학급 누적 360회', desc: '부모님 연계 독서 3권 달성으로 무지개 열차!', unlocked: false },
        { level: 5, icon: '✨', image: './assets/classtree_3d_train_express.png' + CACHE_BUST, name: '5단계: 은하수 상상 특급 열차', req: '학급 누적 480회', desc: '상상 동화 이야기 지어보기로 특급 열차 변신!', unlocked: false },
        { level: 6, icon: '🏝️', image: './assets/classtree_3d_train_treasure.png' + CACHE_BUST, name: '6단계: 전설의 동화 보물섬', req: '학급 누적 600회 완수!', desc: '독서왕 황금 보물상자 열리고 룰렛 파티!', unlocked: false }
      ],
      dailyMissions: {
        check: [
          { title: '오늘 동화책 읽은 후 책장에 예쁘게 정리하기', points: 50, emoji: '📚', category: '그림책 독서 미션' },
          { title: '동화 속 가장 마음에 드는 인물 이름 말해보기', points: 50, emoji: '🧙‍♂️', category: '그림책 독서 미션' },
          { title: '부모님/선생님 목소리로 따뜻하게 책 듣기', points: 50, emoji: '🎧', category: '그림책 독서 미션' }
        ],
        photo: [
          { title: '오늘 부모님과 함께 읽은 동화책 표지 인증', points: 100, emoji: '📖', category: '학급 독서 인증 📸' },
          { title: '책을 읽고 가장 재미있었던 장면 따라 그리기', points: 100, emoji: '🎨', category: '학급 독서 인증 📸' }
        ]
      }
    },
    nature: {
      id: 'nature',
      category: '자연 / 사계절',
      tag: '🌸 사계절 자연',
      name: '🌸 [자연] 오색 빛깔 사계절 탐험대',
      desc: '바깥 놀이 햇살 맞기, 자연물 관찰, 계절 열매/바람 느끼기 1개월 챌린지',
      particles: ['🌸', '🍂', '❄️', '☀️', '✨'],
      image: './assets/classtree_3d_seed_character.png' + CACHE_BUST,
      stages: [
        { level: 1, icon: '🌱', image: './assets/classtree_3d_seed_character.png' + CACHE_BUST, name: '1단계: 계절 기운 듬뿍 씨앗', req: '학급 누적 1~60회', desc: '바람과 햇살을 머금은 3D 대자연 씨앗 친구.', unlocked: true },
        { level: 2, icon: '🌷', image: './assets/classtree_3d_sprout.png' + CACHE_BUST, name: '2단계: 바람 느끼는 꽃봉오리', req: '학급 누적 120회', desc: '바깥 산책으로 어여쁜 꽃봉오리가 맺혀요.', unlocked: false },
        { level: 3, icon: '🪵', image: './assets/classtree_3d_sapling.png' + CACHE_BUST, name: '3단계: 사계절 탐험 묘목', req: '학급 누적 240회', desc: '자연물 나뭇가지/돌멩이 관찰로 묘목 성장.', unlocked: false },
        { level: 4, icon: '🌳', image: './assets/classtree_3d_blossom_tree.png' + CACHE_BUST, name: '4단계: 풍성한 계절 만개나무', req: '학급 누적 360회', desc: '바깥 놀이 사진 인증으로 사계절 꽃이 만발!', unlocked: false },
        { level: 5, icon: '🏞️', image: './assets/classtree_3d_fruit_tree.png' + CACHE_BUST, name: '5단계: 오색 대자연 마법 숲', req: '학급 누적 480회', desc: '자연물 만들기 솜씨로 숲 전체가 오색 빛깔!', unlocked: false },
        { level: 6, icon: '🌌', image: './assets/classtree_3d_spring_forest.png' + CACHE_BUST, name: '6단계: 전설의 오로라 원더랜드', req: '학급 누적 600회 완수!', desc: '대자연 박사 상장 수여 및 숲속 룰렛 축제!', unlocked: false }
      ],
      dailyMissions: {
        check: [
          { title: '오늘 밖에서 15분 이상 따뜻한 햇살 쬐기', points: 50, emoji: '☀️', category: '사계절 탐험 미션' },
          { title: '바람 소리 깊이 들으며 맑은 공기 마시기', points: 50, emoji: '🌬️', category: '사계절 탐험 미션' },
          { title: '길가에 떨어진 예쁜 나뭇잎/열매 구경하기', points: 50, emoji: '🍂', category: '사계절 탐험 미션' }
        ],
        photo: [
          { title: '유치원 마당/놀이터에서 자연물과 찍은 미소', points: 100, emoji: '🏞️', category: '학급 자연 인증 📸' },
          { title: '오늘 하늘 모습이나 예쁜 구름 찰칵 인증', points: 100, emoji: '☁️', category: '학급 자연 인증 📸' }
        ]
      }
    },
    emotion: {
      id: 'emotion',
      category: '인성 / 감정 (SEL)',
      tag: '💖 마음 무지개성',
      name: '💖 [감정] 내 마음을 말해요 마음 무지개 성',
      desc: '내 기분 말하기, 속상할 때 숨 고르기, 칭찬 카드, 감사 표현 1개월 챌린지',
      particles: ['💖', '🌈', '🏰', '👑', '✨'],
      image: './assets/classtree_3d_castle_cabin.png' + CACHE_BUST,
      stages: [
        { level: 1, icon: '🏡', image: './assets/classtree_3d_castle_cabin.png' + CACHE_BUST, name: '1단계: 마음 싹 트는 오두막', req: '학급 누적 1~60회', desc: '내 기분을 솔직히 말하는 아늑한 첫 오두막.', unlocked: true },
        { level: 2, icon: '🧊', image: './assets/classtree_3d_castle_igloo.png' + CACHE_BUST, name: '2단계: 알록달록 기분 이글루', req: '학급 누적 120회', desc: '화날 때 숨 고르기로 따뜻한 이글루 완성.', unlocked: false },
        { level: 3, icon: '🏰', image: './assets/classtree_3d_castle.png' + CACHE_BUST, name: '3단계: 고마움 피어나는 성채', req: '학급 누적 240회', desc: '감사한 마음 표현으로 높은 성채가 솟아나요.', unlocked: false },
        { level: 4, icon: '🌌', image: './assets/classtree_3d_castle_palace.png' + CACHE_BUST, name: '4단계: 감정 오로라 궁전', req: '학급 누적 360회', desc: '칭찬 미션 완수로 마음 오로라 빛 조명!', unlocked: false },
        { level: 5, icon: '👑', image: './assets/classtree_3d_ice_castle.png' + CACHE_BUST, name: '5단계: 무지개 마법성', req: '학급 누적 480회', desc: '서로 마음 보듬어주기로 3D 무지개성 완성!', unlocked: false },
        { level: 6, icon: '💎', image: './assets/classtree_3d_castle_kingdom.png' + CACHE_BUST, name: '6단계: 전설의 감정 크리스탈 왕국', req: '학급 누적 600회 완수!', desc: '마음 왕국 성문 열리고 감정 칭찬 파티 해금!', unlocked: false }
      ],
      dailyMissions: {
        check: [
          { title: '오늘 내 기분(기쁨/설렘/속상) 말로 솔직히 표현', points: 50, emoji: '💖', category: '마음 표현 미션' },
          { title: '화나거나 속상할 때 후-하 깊은 숨 3번 쉬기', points: 50, emoji: '🌬️', category: '마음 표현 미션' },
          { title: '가족/친구에게 "고맙습니다" 먼저 감사 전하기', points: 50, emoji: '🥰', category: '마음 표현 미션' }
        ],
        photo: [
          { title: '오늘 가장 기분 좋은 내 미소 표정 인증', points: 100, emoji: '😊', category: '학급 마음 인증 📸' },
          { title: '친구에게 하트 손모양을 만들며 칭찬해준 장면', points: 100, emoji: '🫰', category: '학급 마음 인증 📸' }
        ]
      }
    }
  };

  const STORAGE_KEY = 'classtree_app_state_v2';

  const SAMPLE_PRESETS = {
    haetsal: {
      name: '☀️ 7세 햇살반 (중급 달성반)',
      user: {
        name: '김행복 어린이',
        class: '7세 햇살반',
        points: 850,
        badges: ['🌱 첫 미소 씨앗 도장', '🔤 한글 말놀이 대장', '⭐ 칭찬 왕국 마스터'],
        equippedItem: 'item_ribbon',
        inventory: ['item_ribbon', 'item_bird', 'item_lamp']
      },
      classPhotoAuthCount: {
        hangeul: 420, number: 380, env: 310, bio: 290, team: 350,
        adapt: 400, digital: 260, book: 480, nature: 340, emotion: 390
      },
      targetPhotos: 600,
      friends: [
        { id: 1, name: '이민수', photo: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&q=80', mission: '자음 카드 10개 맞추기 성공! 🔤', likes: 12, liked: true, time: '5분 전 인증 📸' },
        { id: 2, name: '박지아', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', mission: '예쁜 내 이름 단정한 글씨 쓰기 ✍️', likes: 8, liked: false, time: '20분 전 인증 📸' },
        { id: 3, name: '최도윤', photo: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80', mission: '화살표 블록 코딩 연결 🤖', likes: 15, liked: true, time: '40분 전 인증 📸' },
        { id: 4, name: '정예은', photo: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80', mission: '환경 보호 잔반 Zero 다 먹기 🍱', likes: 7, liked: false, time: '1시간 전 인증 📸' },
        { id: 5, name: '강서준', photo: 'https://images.unsplash.com/photo-1595454223600-91fbddbbf255?auto=format&fit=crop&w=400&q=80', mission: '동화책 읽고 엄마와 퀴즈 풀기 📖', likes: 19, liked: true, time: '2시간 전 인증 📸' }
      ],
      students: [
        { name: '김행복', count: '2/2', status: '오늘 2회 완수 🟢' },
        { name: '이민수', count: '2/2', status: '오늘 2회 완수 🟢' },
        { name: '박지아', count: '2/2', status: '오늘 2회 완수 🟢' },
        { name: '최도윤', count: '1/2', status: '오늘 1회 완료 🟡' },
        { name: '정예은', count: '2/2', status: '오늘 2회 완수 🟢' },
        { name: '강서준', count: '2/2', status: '오늘 2회 완수 🟢' },
        { name: '윤아린', count: '1/2', status: '오늘 1회 완료 🟡' },
        { name: '한지후', count: '0/2', status: '인증 진행중 ⚪' }
      ]
    },
    saessak: {
      name: '🌱 6세 새싹반 (만렙 성취 모범반)',
      user: {
        name: '박희망 어린이',
        class: '6세 새싹반',
        points: 2400,
        badges: ['🌱 첫 미소 씨앗', '👑 학급 칭찬 왕관', '🏆 전설의 클래스트리', '✨ 만점 탐험가'],
        equippedItem: 'item_bird',
        inventory: ['item_bird', 'item_dew', 'item_lamp', 'item_ribbon']
      },
      classPhotoAuthCount: {
        hangeul: 590, number: 600, env: 580, bio: 600, team: 595,
        adapt: 600, digital: 580, book: 600, nature: 590, emotion: 600
      },
      targetPhotos: 600,
      friends: [
        { id: 101, name: '송다은', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', mission: '분리수거 쓰레기 직접 분류하기 ♻️', likes: 24, liked: true, time: '3분 전 인증 📸' },
        { id: 102, name: '임현우', photo: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80', mission: '친구에게 양보하며 사이좋게 놀기 🤝', likes: 30, liked: true, time: '12분 전 인증 📸' },
        { id: 103, name: '오세아', photo: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&q=80', mission: '3분 양치질 깨끗하게 완료 🪥', likes: 18, liked: true, time: '30분 전 인증 📸' }
      ],
      students: [
        { name: '박희망', count: '2/2', status: '오늘 2회 완수 🟢' },
        { name: '송다은', count: '2/2', status: '오늘 2회 완수 🟢' },
        { name: '임현우', count: '2/2', status: '오늘 2회 완수 🟢' },
        { name: '오세아', count: '2/2', status: '오늘 2회 완수 🟢' },
        { name: '권우진', count: '2/2', status: '오늘 2회 완수 🟢' },
        { name: '배소율', count: '2/2', status: '오늘 2회 완수 🟢' }
      ]
    },
    yeolmae: {
      name: '🍎 5세 열매반 (신규 개학 새출발반)',
      user: {
        name: '이사랑 어린이',
        class: '5세 열매반',
        points: 150,
        badges: ['🌱 첫 미소 씨앗'],
        equippedItem: null,
        inventory: []
      },
      classPhotoAuthCount: {
        hangeul: 45, number: 30, env: 20, bio: 10, team: 25,
        adapt: 50, digital: 15, book: 35, nature: 20, emotion: 40
      },
      targetPhotos: 400,
      friends: [
        { id: 201, name: '김태양', photo: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&q=80', mission: '신발장에 스스로 신발 정리 👟', likes: 4, liked: false, time: '1시간 전 인증 📸' },
        { id: 202, name: '장나비', photo: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80', mission: '선생님께 밝게 인사는 기본! 👏', likes: 6, liked: true, time: '2시간 전 인증 📸' }
      ],
      students: [
        { name: '이사랑', count: '1/2', status: '오늘 1회 완료 🟡' },
        { name: '김태양', count: '1/2', status: '오늘 1회 완료 🟡' },
        { name: '장나비', count: '1/2', status: '오늘 1회 완료 🟡' },
        { name: '신유준', count: '0/2', status: '인증 진행중 ⚪' }
      ]
    }
  };

  const state = {
    role: 'SELECT',
    currentView: 'welcome',
    activeThemeId: 'hangeul',
    targetPhotos: 600,

    classPhotoAuthCount: {
      hangeul: 120, number: 120, env: 120, bio: 120, team: 120,
      adapt: 120, digital: 120, book: 120, nature: 120, emotion: 120
    },

    user: {
      name: '김행복 어린이',
      class: '7세 햇살반',
      points: 500,
      badges: ['🌱 첫 미소 씨앗 도장'],
      equippedItem: 'item_ribbon',
      inventory: ['item_ribbon', 'item_bird']
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
      { id: 1, name: '민수 어린이', photo: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&q=80', mission: '자음 카드 맞추기 🔤', likes: 3, liked: false, time: '10분 전 인증 📸' },
      { id: 2, name: '지아 어린이', photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', mission: '내 이름 예쁘게 써보기 ✍️', likes: 5, liked: false, time: '25분 전 인증 📸' },
      { id: 3, name: '도윤 어린이', photo: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80', mission: '화살표 알고리즘 블록 이어보기 🤖', likes: 2, liked: false, time: '1시간 전 인증 📸' }
    ],
    students: [
      { name: '김행복', count: '0/2', status: '오늘 2회 완료' },
      { name: '이민수', count: '0/2', status: '오늘 2회 완료' },
      { name: '박지아', count: '0/2', status: '오늘 1회 진행' },
      { name: '최도윤', count: '0/2', status: '미진행' },
      { name: '정예은', count: '0/2', status: '오늘 2회 완료' }
    ]
  };

  function saveStateToLocalStorage() {
    try {
      const dataToSave = {
        user: state.user,
        activeThemeId: state.activeThemeId,
        targetPhotos: state.targetPhotos,
        classPhotoAuthCount: state.classPhotoAuthCount,
        friends: state.friends,
        students: state.students,
        role: state.role
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function loadStateFromLocalStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) state.user = parsed.user;
        if (parsed.activeThemeId) state.activeThemeId = parsed.activeThemeId;
        if (parsed.targetPhotos) state.targetPhotos = parsed.targetPhotos;
        if (parsed.classPhotoAuthCount) state.classPhotoAuthCount = parsed.classPhotoAuthCount;
        if (parsed.friends) state.friends = parsed.friends;
        if (parsed.students) state.students = parsed.students;
        if (parsed.role) state.role = parsed.role;
      }
    } catch (e) {
      console.warn('LocalStorage load failed:', e);
    }
  }

  function loadPresetData(presetKey) {
    const preset = SAMPLE_PRESETS[presetKey];
    if (!preset) return;

    state.user = JSON.parse(JSON.stringify(preset.user));
    state.classPhotoAuthCount = JSON.parse(JSON.stringify(preset.classPhotoAuthCount));
    state.targetPhotos = preset.targetPhotos;
    state.friends = JSON.parse(JSON.stringify(preset.friends));
    state.students = JSON.parse(JSON.stringify(preset.students));

    rotateDailyMissions();
    rotateWeeklyMissions();
    saveStateToLocalStorage();
    render();

    playSFX('fanfare');
    if (window.confetti) confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    alert(`📥 [${preset.name}] 데이터가 성공적으로 불러와져 연동되었습니다!`);
  }

  function generateRandomAIData() {
    const randomPhotos = Math.floor(Math.random() * 520) + 60;
    const randomPoints = Math.floor(Math.random() * 1600) + 300;

    state.user.points = randomPoints;
    state.classPhotoAuthCount[state.activeThemeId] = randomPhotos;

    state.students.forEach(s => {
      const completedCount = Math.floor(Math.random() * 3);
      s.count = `${completedCount}/2`;
      s.status = completedCount === 2 ? '오늘 2회 완수 🟢' : completedCount === 1 ? '오늘 1회 완료 🟡' : '인증 진행중 ⚪';
    });

    rotateDailyMissions();
    rotateWeeklyMissions();
    saveStateToLocalStorage();
    render();

    playSFX('fanfare');
    if (window.confetti) confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
    alert(`🎲 AI 무작위 학급 데이터가 생성되어 적용되었습니다!\n(현재 사진 인증: ${randomPhotos}회 / 보유 포인트: ${randomPoints}P)`);
  }

  function importJSONData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.user || parsed.classPhotoAuthCount) {
          if (parsed.user) state.user = parsed.user;
          if (parsed.classPhotoAuthCount) state.classPhotoAuthCount = parsed.classPhotoAuthCount;
          if (parsed.targetPhotos) state.targetPhotos = parsed.targetPhotos;
          if (parsed.friends) state.friends = parsed.friends;
          if (parsed.students) state.students = parsed.students;
          if (parsed.activeThemeId) state.activeThemeId = parsed.activeThemeId;

          saveStateToLocalStorage();
          render();

          playSFX('fanfare');
          if (window.confetti) confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
          alert(`📂 외부 JSON 파일 데이터 불러오기가 완료되었습니다!`);
        } else {
          alert('❌ 클래스트리 데이터 형식이 일치하지 않습니다.');
        }
      } catch (err) {
        alert('❌ JSON 데이터 해석 중 오류 발생: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function exportJSONData() {
    const exportData = {
      version: '2026.1',
      exportedAt: new Date().toISOString(),
      user: state.user,
      activeThemeId: state.activeThemeId,
      targetPhotos: state.targetPhotos,
      classPhotoAuthCount: state.classPhotoAuthCount,
      friends: state.friends,
      students: state.students
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classtree_dataset_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    playSFX('pop');
    alert('💾 백업 JSON 파일 다운로드가 실행되었습니다!');
  }

  function openDataLoaderModal() {
    playSFX('pop');
    const existing = document.querySelector('.data-loader-modal-backdrop');
    if (existing) existing.remove();

    const modalHtml = `
      <div class="modal-backdrop data-loader-modal-backdrop" style="z-index: 9999;">
        <div class="modal-content-card" style="max-width: 350px; text-align: left; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 2px solid #E2E8F0; padding-bottom: 10px;">
            <div style="font-weight: 900; font-size: 16px; color: #1E293B;">📥 학급 데이터 불러오기 모듈</div>
            <button id="btn-close-data-modal" style="background: none; border: none; font-size: 18px; cursor: pointer;">❌</button>
          </div>

          <p style="font-size: 12px; color: #64748B; margin-bottom: 14px; line-height: 1.4;">
            원하는 유치원 학급 데이터 세트, AI 무작위 생성 데이터 또는 외부 JSON 파일 데이터를 선택해 불러올 수 있습니다.
          </p>

          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: 800; color: #0284C7; margin-bottom: 6px;">✨ 난이도별 프리셋 데이터 세트 불러오기</div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <button class="btn-modal-preset" data-preset="level1" style="padding: 10px; border-radius: 12px; background: #ECFDF5; border: 1.5px solid #10B981; color: #047857; font-weight: 800; font-size: 12px; text-align: left; cursor: pointer;">
                🌱 1단계 (기초/씨앗) 불러오기 (쉬움 난이도 세트)
              </button>
              <button class="btn-modal-preset" data-preset="level2" style="padding: 10px; border-radius: 12px; background: #F0F9FF; border: 1.5px solid #0284C7; color: #0369A1; font-weight: 800; font-size: 12px; text-align: left; cursor: pointer;">
                🌿 2단계 (보통/줄기) 불러오기 (중급 난이도 세트)
              </button>
              <button class="btn-modal-preset" data-preset="level3" style="padding: 10px; border-radius: 12px; background: #F3E8FF; border: 1.5px solid #A855F7; color: #7E22CE; font-weight: 800; font-size: 12px; text-align: left; cursor: pointer;">
                🌳 3단계 (도전/나무) 불러오기 (도전 난이도 세트)
              </button>
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: 800; color: #7C3AED; margin-bottom: 6px;">🎲 AI 무작위 학급 데이터 생성</div>
            <button id="btn-modal-random-data" style="width: 100%; padding: 10px; border-radius: 12px; background: #F5F3FF; border: 1.5px solid #7C3AED; color: #6D28D9; font-weight: 800; font-size: 12px; cursor: pointer; text-align: center;">
              ⚡ 실시간 무작위 AI 데이터 즉시 불러오기
            </button>
          </div>

          <div style="margin-bottom: 14px;">
            <div style="font-size: 11px; font-weight: 800; color: #059669; margin-bottom: 6px;">📂 외부 JSON 파일 연동 &amp; 백업</div>
            <div style="display: flex; gap: 8px;">
              <button id="btn-modal-import-json" style="flex: 1; padding: 9px; border-radius: 12px; background: #10B981; color: #FFF; border: none; font-weight: 800; font-size: 11px; cursor: pointer;">
                📂 JSON 파일 불러오기
              </button>
              <button id="btn-modal-export-json" style="flex: 1; padding: 9px; border-radius: 12px; background: #059669; color: #FFF; border: none; font-weight: 800; font-size: 11px; cursor: pointer;">
                💾 JSON 내보내기
              </button>
            </div>
            <input type="file" id="modal-json-file-input" accept=".json" style="display: none;">
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid #F1F5F9; padding-top: 10px;">
            <button id="btn-modal-reset-data" style="background: none; border: none; color: #EF4444; font-size: 11px; font-weight: 800; cursor: pointer;">
              🔄 초기 데이터로 리셋
            </button>
            <button class="btn-confirm-full" id="btn-close-data-modal-bottom" style="width: 80px; padding: 6px; font-size: 12px; margin: 0;">닫기</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.querySelector('.data-loader-modal-backdrop');
    const close = () => { if (modal) modal.remove(); };

    document.getElementById('btn-close-data-modal').addEventListener('click', close);
    document.getElementById('btn-close-data-modal-bottom').addEventListener('click', close);

    modal.querySelectorAll('.btn-modal-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.preset;
        loadPresetData(key);
        close();
      });
    });

    document.getElementById('btn-modal-random-data').addEventListener('click', () => {
      generateRandomAIData();
      close();
    });

    const fileInput = document.getElementById('modal-json-file-input');
    document.getElementById('btn-modal-import-json').addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        importJSONData(file);
        close();
      }
    });

    document.getElementById('btn-modal-export-json').addEventListener('click', () => {
      exportJSONData();
    });

    document.getElementById('btn-modal-reset-data').addEventListener('click', () => {
      if (confirm('기본 초기 데이터로 리셋하시겠습니까?')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    });
  }

  function rotateDailyMissions() {
    const theme = THEMES_CATALOG[state.activeThemeId] || THEMES_CATALOG['hangeul'];
    const themeDaily = theme.dailyMissions || DAILY_MISSION_BANK;
    const checks = [...(themeDaily.check || DAILY_MISSION_BANK.check)].sort(() => 0.5 - Math.random()).slice(0, 3);
    const photos = [...(themeDaily.photo || DAILY_MISSION_BANK.photo)].sort(() => 0.5 - Math.random()).slice(0, 2);

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
    loadStateFromLocalStorage();
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

    const btnHome = document.getElementById('btn-web-brand-home');
    const btnThemes = document.getElementById('btn-web-nav-themes');
    const btnCert = document.getElementById('btn-web-nav-cert');
    const btnData = document.getElementById('btn-web-nav-data');

    if (btnHome) {
      btnHome.addEventListener('click', () => {
        playSFX('pop');
        switchView('dashboard');
      });
    }

    if (btnThemes) {
      btnThemes.addEventListener('click', () => {
        playSFX('pop');
        switchView('dashboard');
      });
    }

    if (btnCert) {
      btnCert.addEventListener('click', () => {
        openDigitalCertificateModal();
      });
    }

    if (btnData) {
      btnData.addEventListener('click', () => {
        openDataLoaderModal();
      });
    }
  }

  function switchView(viewName) {
    state.currentView = viewName;
    bottomNav.classList.add('hidden');
    render();
  }

  function changeTheme(themeId) {
    playSFX('pop');
    state.activeThemeId = themeId;
    document.body.setAttribute('data-season-theme', themeId);
    rotateDailyMissions();
    rotateWeeklyMissions();
    render();
  }

  function render() {
    appView.innerHTML = '';
    document.body.setAttribute('data-season-theme', state.activeThemeId);

    switch (state.currentView) {
      case 'dashboard': renderDashboardScreen(); break;
      case 'theme-detail': renderThemeDetailScreen(); break;
      case 'teacher': renderTeacherScreen(); break;
      case 'profile': renderProfileScreen(); break;
      case 'tv': renderTVScreen(); break;
      default: renderDashboardScreen();
    }
  }

  function renderDashboardScreen() {
    const html = `
      <div class="dashboard-screen" style="padding: 10px 4px;">
        <!-- Web Hero Banner Section -->
        <div style="background: linear-gradient(135deg, #ECFDF5 0%, #F0F9FF 100%); border: 1.5px solid #A7F3D0; padding: 24px 28px; border-radius: 24px; margin-bottom: 24px; text-align: center; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.08);">
          <span style="background: #10B981; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 14px; letter-spacing: 0.5px; text-transform: uppercase;">Web Platform Edition</span>
          <h2 style="font-size: 24px; font-weight: 900; color: #065F46; margin: 10px 0 6px 0; letter-spacing: -0.3px;">🎨 유치원 10대 테마 세상을 선택하세요</h2>
          <p style="font-size: 13px; color: #047857; margin: 0; font-weight: 500;">원하는 테마 카드를 클릭하여 3D 마스코트와 함께하는 1개월 챌린지 놀이를 시작하세요!</p>
        </div>

        <!-- 🎨 Web Responsive 10-Theme Multi-column Grid -->
        <div class="theme-grid-compact">
          ${Object.values(THEMES_CATALOG).map((t, idx) => {
            const currentStage = t.stages[0];
            const displayTitle = t.name.includes('] ') ? t.name.split('] ')[1] : t.name;

            return `
              <button class="theme-compact-btn" data-id="${t.id}">
                <div class="compact-btn-header">
                  <span class="compact-btn-badge">${idx < 9 ? '0' + (idx + 1) : (idx + 1)}</span>
                  <span class="compact-btn-tag">${t.tag}</span>
                </div>
                
                <img src="${currentStage.image}" alt="${t.name}" class="compact-btn-img">
                
                <div class="compact-btn-title">${displayTitle}</div>
                <div class="compact-btn-category">${t.category}</div>
                
                <div class="compact-btn-play-tag">
                  <span>▶ 놀이 시작</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;

    appView.innerHTML = html;

    appView.querySelectorAll('.theme-compact-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const themeId = btn.dataset.id;
        enterThemePlayWorld(themeId);
      });
    });
  }

  function enterThemePlayWorld(themeId) {
    playSFX('pop');
    state.activeThemeId = themeId;
    saveStateToLocalStorage();
    switchView('theme-detail');
  }

  function renderThemeDetailScreen() {
    const theme = THEMES_CATALOG[state.activeThemeId] || THEMES_CATALOG['hangeul'];
    const photos = state.classPhotoAuthCount[state.activeThemeId] || 0;
    const targetPhotos = state.targetPhotos || 600;

    let currentStageIndex = 0;
    const step = Math.floor(targetPhotos / 5);
    if (photos >= targetPhotos) currentStageIndex = 5;
    else if (photos >= step * 4) currentStageIndex = 4;
    else if (photos >= step * 3) currentStageIndex = 3;
    else if (photos >= step * 2) currentStageIndex = 2;
    else if (photos >= step * 1) currentStageIndex = 1;
    else currentStageIndex = 0;

    const activeStage = (theme.stages && theme.stages[currentStageIndex]) || theme.stages[0];

    const currentLevel = state.currentLevel || 1;
    const levelBadge = currentLevel === 1 ? '🌱 1단계 (기초)' : currentLevel === 2 ? '🌿 2단계 (보통)' : '🌳 3단계 (도전)';

    const html = `
      <div class="theme-play-screen">
        <div class="top-bar" style="margin-bottom: 14px;">
          <button class="icon-btn" id="btn-back-to-hub" style="width: 36px; height: 36px;">🏠</button>
          <span style="font-weight: 900; font-size: 15px;">${theme.tag} 전용 놀이 세상</span>
          <div style="width: 36px;"></div>
        </div>

        <div class="theme-play-hero">
          <div class="particle-field" id="theme-particle-field"></div>
          <div style="display: flex; justify-content: center; gap: 6px; margin-bottom: 4px;">
            <span class="guide-stage-badge badge-unlocked" style="font-size: 11px; padding: 3px 10px;">${theme.category} 놀이 세상</span>
            <span class="guide-stage-badge" style="font-size: 11px; padding: 3px 10px; background: #2563EB; color: #FFF;">${levelBadge}</span>
          </div>

          <h2 style="font-size: 18px; font-weight: 900; margin-top: 6px; color: var(--color-primary-dark);">
            ${theme.name}
          </h2>
          <p style="font-size: 12px; color: var(--color-text-sub); margin-top: 4px;">
            ${activeStage.name} • ${activeStage.desc}
          </p>

          <img src="${activeStage.image}" alt="${activeStage.name}" class="theme-play-img" id="interactive-theme-img">

          <div style="font-size: 12px; font-weight: 800; color: var(--color-primary-dark); margin-top: 8px;">
            ✨ 마스코트를 터치하면 신나는 소리와 이펙트가 나와요!
          </div>
        </div>

        <!-- 🎯 연령별 난이도 1,2,3단계 선택 바 (유치원 공통) -->
        <div style="background: #F8FAFC; border-radius: 16px; padding: 12px; margin-bottom: 14px; text-align: center; border: 1.5px solid #E2E8F0;">
          <div style="font-size: 12px; font-weight: 900; color: #334155; margin-bottom: 8px;">
            🎯 콘텐츠 난이도 단계 선택 (유치원 공통)
          </div>
          <div style="display: flex; gap: 6px;">
            <button class="btn-select-level" data-level="1" style="flex: 1; padding: 8px 4px; border-radius: 12px; font-weight: 800; font-size: 11px; cursor: pointer; border: 2px solid ${currentLevel === 1 ? '#22C55E' : '#CBD5E1'}; background: ${currentLevel === 1 ? '#DCFCE7' : '#FFF'}; color: ${currentLevel === 1 ? '#15803D' : '#64748B'};">
              🌱 1단계 (기초)
            </button>
            <button class="btn-select-level" data-level="2" style="flex: 1; padding: 8px 4px; border-radius: 12px; font-weight: 800; font-size: 11px; cursor: pointer; border: 2px solid ${currentLevel === 2 ? '#3B82F6' : '#CBD5E1'}; background: ${currentLevel === 2 ? '#DBEAFE' : '#FFF'}; color: ${currentLevel === 2 ? '#1D4ED8' : '#64748B'};">
              🌿 2단계 (보통)
            </button>
            <button class="btn-select-level" data-level="3" style="flex: 1; padding: 8px 4px; border-radius: 12px; font-weight: 800; font-size: 11px; cursor: pointer; border: 2px solid ${currentLevel === 3 ? '#A855F7' : '#CBD5E1'}; background: ${currentLevel === 3 ? '#F3E8FF' : '#FFF'}; color: ${currentLevel === 3 ? '#7E22CE' : '#64748B'};">
              🌳 3단계 (도전)
            </button>
          </div>
        </div>

        <!-- 테마별 전용 놀이 활동 구역 -->
        <div class="play-activity-box">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="font-size: 15px; font-weight: 900; color: var(--color-text-main);">🎮 ${theme.tag} 인터랙티브 미션 (${levelBadge})</h3>
            <span style="font-size: 11px; font-weight: 800; background: #FEF08A; color: #854D0E; padding: 2px 8px; border-radius: 10px;">+50P 적립</span>
          </div>

          ${renderThemePlayContent(theme.id, currentLevel)}
        </div>

        <button class="btn-confirm-full" id="btn-return-dashboard" style="margin-top: 10px;">
          🏠 10대 테마 첫 페이지로 돌아가기
        </button>
      </div>
    `;

    appView.innerHTML = html;

    document.getElementById('btn-back-to-hub').addEventListener('click', () => { playSFX('pop'); switchView('dashboard'); });
    document.getElementById('btn-return-dashboard').addEventListener('click', () => { playSFX('pop'); switchView('dashboard'); });

    appView.querySelectorAll('.btn-select-level').forEach(btn => {
      btn.addEventListener('click', () => {
        playSFX('pop');
        state.currentLevel = parseInt(btn.dataset.level);
        saveStateToLocalStorage();
        renderThemeDetailScreen();
      });
    });

    const themeImg = document.getElementById('interactive-theme-img');
    if (themeImg) {
      themeImg.addEventListener('click', (e) => {
        playSFX('pop');
        themeImg.classList.add('bounce');
        setTimeout(() => themeImg.classList.remove('bounce'), 500);

        const field = document.getElementById('theme-particle-field');
        if (field) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.innerText = theme.particles[Math.floor(Math.random() * theme.particles.length)];
          particle.style.left = (e.offsetX || 60) + 'px';
          particle.style.top = (e.offsetY || 60) + 'px';
          field.appendChild(particle);
          setTimeout(() => particle.remove(), 1000);
        }
      });
    }

    bindThemePlayEvents(theme.id);
  }

  function renderThemePlayContent(themeId, level = 1) {
    const levelTag = level === 1 ? '🌱 1단계 (기초)' : level === 2 ? '🌿 2단계 (보통)' : '🌳 3단계 (도전)';

    if (themeId === 'hangeul') {
      const words = level === 1 
        ? [{ text: '사랑', desc: '💖 사-랑' }, { text: '햇살', desc: '☀️ 햇-살' }, { text: '미소', desc: '😊 미-소' }, { text: '친구', desc: '🤝 친-구' }]
        : level === 2 
        ? [{ text: '무지개', desc: '🌈 무-지-개' }, { text: '칭찬왕', desc: '👏 칭-찬-왕' }, { text: '글자나무', desc: '🌱 글-자-나-무' }, { text: '이야기', desc: '📖 이-야-기' }]
        : [{ text: '훈민정음', desc: '📜 훈-민-정-음' }, { text: '세종대왕', desc: '👑 세-종-대-왕' }, { text: '고맙습니다', desc: '💌 고-맙-습-니-다' }, { text: '지혜롭다', desc: '💡 지-혜-롭-다' }];

      return `
        <div style="font-size: 13px; color: #333; line-height: 1.4;">
          <strong>🔤 세종대왕 말놀이 [${levelTag}]:</strong> 아래 예쁜 단어 카드를 완성해보세요!
        </div>
        <div class="interactive-play-area">
          <div style="font-size: 22px; font-weight: 900; letter-spacing: 2px; color: #2563EB; margin-bottom: 8px;" id="hangeul-word-display">
            [ ${words[0].text} ]
          </div>
          <div class="play-choice-grid">
            ${words.map(w => `<button class="play-choice-btn btn-hangeul-quiz" data-word="${w.text}">${w.desc}</button>`).join('')}
          </div>
        </div>
      `;
    } else if (themeId === 'number') {
      const maxCount = level === 1 ? 5 : level === 2 ? 10 : 20;
      return `
        <div style="font-size: 13px; color: #333; line-height: 1.4;">
          <strong>🔢 알록달록 수세 로봇 [${levelTag}]:</strong> 1부터 ${maxCount}까지 터치하며 수세기를 완료하세요!
        </div>
        <div class="interactive-play-area">
          <div style="font-size: 32px; font-weight: 900; color: #7C3AED; margin: 8px 0;" id="number-count-display">
            🤖 카운터: <span id="robot-num-val">1</span> / ${maxCount}
          </div>
          <button id="btn-count-robot-num" data-max="${maxCount}" class="theme-play-btn" style="background: linear-gradient(135deg, #7C3AED 0%, #C084FC 100%);">
            ⚡ 수 세기 카운터 누르기 (+1)
          </button>
        </div>
      `;
    } else if (themeId === 'env') {
      const bins = level === 1
        ? ['♻️ 플라스틱함', '📄 종이함']
        : level === 2
        ? ['♻️ 플라스틱함', '📄 종이함', '🥫 캔/고철함', '🍾 유리함']
        : ['♻️ 플라스틱함', '📄 종이함', '🥫 캔/고철함', '🍾 유리함', '🔋 건전지함', '👕 의류수거함'];
      return `
        <div style="font-size: 13px; color: #333; line-height: 1.4;">
          <strong>🌱 그린 분리수거 [${levelTag}]:</strong> 알맞은 수거함을 터치해 올바르게 분류하세요!
        </div>
        <div class="interactive-play-area">
          <div style="font-size: 24px; margin-bottom: 8px;">🍾 깨끗하게 분리배출 쏙!</div>
          <div class="play-choice-grid">
            ${bins.map(b => `<button class="play-choice-btn btn-env-recycle">${b}</button>`).join('')}
          </div>
        </div>
      `;
    } else if (themeId === 'emotion') {
      return `
        <div style="font-size: 13px; color: #333; line-height: 1.4;">
          <strong>💖 감정 우체국 [${levelTag}]:</strong> 오늘 내 감정 상태를 선택하고 칭찬 처방전을 받으세요!
        </div>
        <div class="interactive-play-area">
          <div class="play-choice-grid">
            <button class="play-choice-btn btn-emotion-pick" data-emo="기쁨">😊 기뻐요!</button>
            <button class="play-choice-btn btn-emotion-pick" data-emo="설렘">🥰 설레요!</button>
            <button class="play-choice-btn btn-emotion-pick" data-emo="속상">😢 속상해요</button>
            <button class="play-choice-btn btn-emotion-pick" data-emo="감사">💌 고마워요</button>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="font-size: 13px; color: #333; line-height: 1.4;">
          <strong>✨ 체험 미션 [${levelTag}]:</strong> 난이도 단계에 맞춰 신나는 체험을 완료해보세요!
        </div>
        <div class="interactive-play-area">
          <button id="btn-generic-play-action" class="theme-play-btn">
            🎉 ${levelTag} 놀이 완료하고 50P 받기!
          </button>
        </div>
      `;
    }
  }

  function bindThemePlayEvents(themeId) {
    appView.querySelectorAll('.btn-hangeul-quiz').forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.word;
        playSFX('fanfare');
        state.user.points += 50;
        saveStateToLocalStorage();
        if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
        alert(`🎉 정답입니다! "${word}" 단어를 완성했습니다! (+50P 적립)`);
      });
    });

    const numBtn = document.getElementById('btn-count-robot-num');
    if (numBtn) {
      let count = 1;
      numBtn.addEventListener('click', () => {
        count++;
        playSFX('coin');
        document.getElementById('robot-num-val').innerText = count;
        if (count % 5 === 0) {
          state.user.points += 50;
          saveStateToLocalStorage();
          if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
          alert(`🎉 수 세기 ${count} 달성! 보너스 50P 적립!`);
        }
      });
    }

    appView.querySelectorAll('.btn-env-recycle').forEach(btn => {
      btn.addEventListener('click', () => {
        playSFX('fanfare');
        state.user.points += 50;
        saveStateToLocalStorage();
        if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
        alert(`♻️ 분리배출 성공! 지구를 구하는 그린 챔피언! (+50P 적립)`);
      });
    });

    appView.querySelectorAll('.btn-emotion-pick').forEach(btn => {
      btn.addEventListener('click', () => {
        const emo = btn.dataset.emo;
        playSFX('fanfare');
        state.user.points += 50;
        saveStateToLocalStorage();
        if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
        alert(`💖 오늘 나의 "${emo}" 마음을 나누어 주어 고마워요! (+50P 따뜻한 마음 처방전 전달)`);
      });
    });

    const genericBtn = document.getElementById('btn-generic-play-action');
    if (genericBtn) {
      genericBtn.addEventListener('click', () => {
        playSFX('fanfare');
        state.user.points += 50;
        saveStateToLocalStorage();
        if (window.confetti) confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
        alert(`🎉 미션 완료! 50P 보상이 적립되었습니다!`);
      });
    }
  }

  function openFullFeedModal() {
    playSFX('pop');

    const modalHtml = `
      <div class="modal-backdrop">
        <div class="feed-modal-card">
          <div class="feed-modal-header">
            <div class="feed-modal-title">
              📸 우리 반 사진 인증 카드뉴스
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
                    <div class="full-feed-user-avatar">🧒</div>
                    <div>
                      <div class="full-feed-user-name">${f.name}</div>
                      <div class="full-feed-time">${f.time || '오늘 인증 📸'}</div>
                    </div>
                  </div>
                  <span class="full-feed-badge-tag">📸 학급성장 +1</span>
                </div>

                <div class="full-feed-img-box">
                  <img src="${f.photo}" alt="${f.name}" class="full-feed-img">
                </div>

                <div class="full-feed-item-body">
                  <div class="full-feed-mission-title">${f.mission || '오늘의 사진 인증 실천'}</div>
                  
                  <div class="full-feed-item-footer">
                    <span class="teacher-stamp-badge">👩‍🏫 참 잘했어요!</span>
                    <button class="like-btn" data-id="${f.id}">
                      ${f.liked ? '❤️' : '🤍'} 칭찬하기 ${f.likes || 0}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <button class="btn-confirm-full" id="btn-modal-feed-done" style="margin-top: 4px;">닫기</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const closeModal = () => {
      playSFX('pop');
      const modal = document.querySelector('.modal-backdrop');
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
          const modal = document.querySelector('.modal-backdrop');
          if (modal) modal.remove();
          openFullFeedModal();
        }
      });
    });
  }

  function openGrowthGuideModal() {
    playSFX('pop');
    const theme = THEMES_CATALOG[state.activeThemeId] || THEMES_CATALOG['hangeul'];

    const modalHtml = `
      <div class="modal-backdrop">
        <div class="modal-content-card" style="max-width: 330px;">
          <h2 style="font-size: 19px; font-weight: 900; margin-bottom: 2px;">📖 ${theme.tag} 도감</h2>
          <p style="font-size: 11px; color: var(--color-text-sub); margin-bottom: 14px;">1개월(${state.targetPhotos}회) 학급 성장 6단계 도감입니다!</p>
          
          <div style="max-height: 360px; overflow-y: auto; padding-right: 4px;">
            ${theme.stages.map(st => `
              <div class="guide-stage-card-rich ${st.unlocked ? 'unlocked' : ''}">
                <div class="guide-stage-img-box">
                  <img src="${st.image}" alt="${st.name}" style="width: 34px; height: 34px; object-fit: contain;">
                </div>
                <div style="flex: 1;">
                  <div style="font-size: 13px; font-weight: 900; color: var(--color-text-main);">
                    ${st.name}
                    <span class="guide-stage-badge ${st.unlocked ? 'badge-unlocked' : 'badge-locked'}">
                      ${st.unlocked ? '진행중' : '잠김'}
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

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('btn-close-guide').addEventListener('click', () => {
      playSFX('pop');
      const modal = document.querySelector('.modal-backdrop');
      if (modal) modal.remove();
    });
  }

  function openSeasonPickerModal() {
    playSFX('pop');
    const modalHtml = `
      <div class="modal-backdrop">
        <div class="modal-content-card" style="max-width: 330px;">
          <h2 style="font-size: 19px; font-weight: 900; margin-bottom: 4px;">🎨 유치원 10대 테마 선택기</h2>
          <p style="font-size: 11px; color: var(--color-text-sub); margin-bottom: 12px;">선생님이 설정한 학급 프로젝트 테마를 둘러보세요!</p>
          
          <div class="season-option-list" style="max-height: 340px; overflow-y: auto;">
            ${Object.values(THEMES_CATALOG).map(t => `
              <button class="season-opt-btn ${state.activeThemeId === t.id ? 'active' : ''}" data-id="${t.id}">
                <div class="season-opt-icon" style="font-size: 24px; display: flex; align-items: center; justify-content: center;">
                  ${t.tag.split(' ')[0]}
                </div>
                <div>
                  <div style="font-size: 13px; font-weight: 900;">${t.name}</div>
                  <div style="font-size: 10px; color: var(--color-text-sub);">${t.category} • 1개월 프로젝트 (${state.targetPhotos}회)</div>
                </div>
              </button>
            `).join('')}
          </div>

          <button class="btn-confirm-full" id="btn-close-season">닫기</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.querySelectorAll('.season-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        changeTheme(id);
        const modal = document.querySelector('.modal-backdrop');
        if (modal) modal.remove();
      });
    });

    document.getElementById('btn-close-season').addEventListener('click', () => {
      playSFX('pop');
      const modal = document.querySelector('.modal-backdrop');
      if (modal) modal.remove();
    });
  }

  function renderMissionsScreen() {
    const theme = THEMES_CATALOG[state.activeThemeId] || THEMES_CATALOG['hangeul'];
    const dailyCompleted = state.dailyMissions.filter(m => m.completed).length;
    const weeklyCompleted = state.weeklyMissions.filter(m => m.completed).length;

    const html = `
      <div class="missions-screen">
        <h2 class="screen-header-title" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <button class="icon-btn" id="btn-go-home-m" title="역할선택" style="width: 34px; height: 34px;">🏠</button>
            <span>📋 ${theme.tag} 실천 미션</span>
          </div>
        </h2>

        <div class="mission-group" style="margin-bottom: 22px;">
          <div class="group-title-row">
            <span class="group-title">☀️ 오늘의 일일 미션 (5가지)</span>
            <button id="btn-refresh-daily" class="${state.dailyRefreshLeft > 0 ? '' : 'disabled'}" style="font-size: 11px; padding: 4px 10px; background: #FFFFFF; border: 1.5px solid var(--color-border); border-radius: 20px; font-weight: 800; cursor: pointer; opacity: ${state.dailyRefreshLeft > 0 ? '1' : '0.5'};">
              🔄 일일 교체 (남은 횟수: ${state.dailyRefreshLeft}/1회)
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
            * 한 달 주간 미션 은행에서 제공되며, 주 2회 교체 가능! (달성률: ${weeklyCompleted}/3)
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
    const theme = THEMES_CATALOG[state.activeThemeId] || THEMES_CATALOG['hangeul'];
    const photos = state.classPhotoAuthCount[state.activeThemeId] || 0;
    const targetPhotos = state.targetPhotos || 600;

    let activeLevelIdx = 0;
    const step = Math.floor(targetPhotos / 5);
    if (photos >= targetPhotos) activeLevelIdx = 5;
    else if (photos >= step * 4) activeLevelIdx = 4;
    else if (photos >= step * 3) activeLevelIdx = 3;
    else if (photos >= step * 2) activeLevelIdx = 2;
    else if (photos >= step * 1) activeLevelIdx = 1;
    else activeLevelIdx = 0;

    const html = `
      <div class="roadmap-screen">
        <div class="roadmap-header-card">
          <button class="icon-btn" id="btn-go-home-r" title="역할선택" style="width: 34px; height: 34px; flex-shrink: 0;">🏠</button>
          <img src="${theme.stages[activeLevelIdx].image}" class="roadmap-header-img" alt="Active Stage Asset">
          <div class="roadmap-title-box">
            <h3>🗺️ ${theme.tag} 로드맵</h3>
            <p>1개월 학급 누적 사진 인증 ${targetPhotos}회 완성 여정!</p>
          </div>
        </div>

        <div class="roadmap-stage-list">
          ${theme.stages.map((st, idx) => {
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
              ${idx < theme.stages.length - 1 ? `<div class="path-connector-line ${idx < activeLevelIdx ? 'active' : ''}"></div>` : ''}
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

    const themeId = state.activeThemeId;
    state.classPhotoAuthCount[themeId] = (state.classPhotoAuthCount[themeId] || 0) + 20;
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

    const theme = THEMES_CATALOG[themeId] || THEMES_CATALOG['hangeul'];
    const photos = state.classPhotoAuthCount[themeId];
    const target = state.targetPhotos || 600;

    if (window.confetti) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }

    const modalHtml = `
      <div class="modal-backdrop">
        <div class="modal-content-card" style="max-width: 330px;">
          <div class="modal-icon-badge">
            <img src="${theme.stages[0].image}" alt="Theme Object">
          </div>
          <h2 class="modal-title">사진 인증 성공! 피드 자동 등록! 🎉</h2>
          <div class="modal-subtext">
            우리 반 피드에 내 사진이 새로 올라갔어요!<br>
            학급 누적 <strong>${photos} / ${target}회</strong> 달성 (+100P 적립)
          </div>

          <div style="background-color: #FFF9E6; border-radius: 14px; padding: 12px; text-align: left; margin-bottom: 16px; border: 1px solid #FFE066;">
            <div style="font-size: 11px; font-weight: 800; color: #B27B00; margin-bottom: 2px;">💌 카카오톡 AI 칭찬 리포트 카드 자동 생성</div>
            <p style="font-size: 12px; color: #333; line-height: 1.4;">
              "오늘 행복 어린이가 <strong>'${theme.tag} 사진 인증'</strong>을 성공하여 학급 피드에 자동 게시되었습니다!"
            </p>
          </div>

          <button class="btn-confirm-full" id="btn-modal-done">확인</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('btn-modal-done').addEventListener('click', () => {
      playSFX('pop');
      const modal = document.querySelector('.modal-backdrop');
      if (modal) modal.remove();
      switchView('dashboard');
    });
  }

  function renderTeacherScreen() {
    const currentTheme = THEMES_CATALOG[state.activeThemeId] || THEMES_CATALOG['hangeul'];
    const photos = state.classPhotoAuthCount[state.activeThemeId] || 0;
    const target = state.targetPhotos || 600;

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
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <span class="guide-stage-badge badge-unlocked" style="font-size: 11px; padding: 3px 8px;">현재 활성 학급 프로젝트</span>
              <h2 style="margin-top: 4px; font-size: 17px; color: var(--color-primary-dark); font-weight: 900;">
                ${currentTheme.name}
              </h2>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 11px; color: var(--color-text-sub);">1개월 목표 설정</span>
              <select id="select-target-goal" style="padding: 4px 8px; border-radius: 8px; font-weight: 800; border: 1px solid var(--color-border); font-size: 12px; margin-top: 2px;">
                <option value="400" ${target === 400 ? 'selected' : ''}>400회 (소규모반)</option>
                <option value="600" ${target === 600 ? 'selected' : ''}>600회 (권장 1달)</option>
                <option value="800" ${target === 800 ? 'selected' : ''}>800회 (대규모반)</option>
              </select>
            </div>
          </div>
          <p style="font-size: 12px; color: var(--color-text-sub); line-height: 1.4;">
            현재 학급 사진 인증: <strong>${photos} / ${target}회 달성</strong> (하루 평균 20~30회 수집중)
          </p>
        </div>

        <button class="tv-mode-btn" id="btn-launch-tv">
          📺 교실 TV 3D 룰렛 &amp; 팡파르 모드 실행
        </button>

        <!-- 🎨 10대 학급 테마 선택 카탈로그 -->
        <div style="background: #FFFFFF; border-radius: 20px; padding: 16px; margin-bottom: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="font-size: 14px; font-weight: 900; color: var(--color-text-main);">🎨 유치원 10대 교육/놀이 테마 선택 보관소</h3>
            <span style="font-size: 10px; color: var(--color-primary-dark); font-weight: 800;">원클릭 바로 전환 ⚡</span>
          </div>
          <p style="font-size: 11px; color: var(--color-text-sub); margin-bottom: 12px;">
            학급 누리과정 및 놀이 주제에 맞춰 이번 달 진행할 테마를 자유롭게 선택해 주세요! (1달 단위 추천)
          </p>

          <div class="teacher-theme-grid" style="display: grid; grid-template-columns: 1fr; gap: 10px; max-height: 320px; overflow-y: auto; padding-right: 4px;">
            ${Object.values(THEMES_CATALOG).map(t => {
              const isActive = state.activeThemeId === t.id;
              return `
                <div class="teacher-theme-card ${isActive ? 'active-card' : ''}" style="border: 2px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}; border-radius: 14px; padding: 12px; background: ${isActive ? 'var(--color-primary-light)' : '#FFF'};">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <span style="font-size: 11px; font-weight: 800; color: var(--color-primary-dark);">${t.category}</span>
                    ${isActive ? `<span style="font-size: 10px; font-weight: 900; background: var(--color-primary); color: #FFF; padding: 2px 8px; border-radius: 10px;">✓ 현재 진행중</span>` : ''}
                  </div>
                  <div style="font-size: 14px; font-weight: 900; color: var(--color-text-main); margin-bottom: 2px;">${t.name}</div>
                  <div style="font-size: 11px; color: var(--color-text-sub); margin-bottom: 8px;">${t.desc}</div>
                  
                  <button class="btn-select-theme" data-id="${t.id}" style="width: 100%; padding: 6px; border-radius: 8px; border: none; font-size: 11px; font-weight: 800; cursor: pointer; ${isActive ? 'background: var(--color-primary-dark); color: #FFF;' : 'background: #F3F4F6; color: #4B5563;'}">
                    ${isActive ? '✓ 이번 달 진행 중인 테마' : '➔ 이 테마로 학급 프로젝트 시작하기'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 📥 데이터 불러오기 & 동기화 섹션 -->
        <div style="background: linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%); border-radius: 20px; padding: 16px; margin-bottom: 18px; border: 2px dashed #0284C7;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 14px; font-weight: 900; color: #0369A1;">📥 학급 데이터 불러오기 &amp; 동기화</h3>
            <span style="font-size: 10px; font-weight: 800; background: #0284C7; color: #FFF; padding: 2px 8px; border-radius: 10px;">샘플/파일 연동</span>
          </div>
          <p style="font-size: 11px; color: #0C4A6E; margin-bottom: 12px; line-height: 1.4;">
            원하는 학급의 성취 데이터 세트, 외부 JSON 데이터 또는 무작위 샘플 데이터를 즉시 불러올 수 있습니다.
          </p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <button class="btn-load-preset-teacher" data-preset="haetsal" style="padding: 9px; border-radius: 12px; background: #FFF; border: 1.5px solid #0284C7; color: #0369A1; font-weight: 800; font-size: 11px; cursor: pointer;">
              ☀️ 7세 햇살반 불러오기
            </button>
            <button class="btn-load-preset-teacher" data-preset="saessak" style="padding: 9px; border-radius: 12px; background: #FFF; border: 1.5px solid #0284C7; color: #0369A1; font-weight: 800; font-size: 11px; cursor: pointer;">
              🌱 6세 새싹반 불러오기
            </button>
            <button class="btn-load-preset-teacher" data-preset="yeolmae" style="padding: 9px; border-radius: 12px; background: #FFF; border: 1.5px solid #0284C7; color: #0369A1; font-weight: 800; font-size: 11px; cursor: pointer;">
              🍎 5세 열매반 불러오기
            </button>
            <button id="btn-load-random-teacher" style="padding: 9px; border-radius: 12px; background: #FFF; border: 1.5px solid #0284C7; color: #0369A1; font-weight: 800; font-size: 11px; cursor: pointer;">
              🎲 무작위 AI 생성 불러오기
            </button>
          </div>
          <div style="display: flex; gap: 8px;">
            <button id="btn-import-json-teacher" style="flex: 1; padding: 8px; border-radius: 12px; background: #0284C7; color: #FFF; border: none; font-weight: 800; font-size: 11px; cursor: pointer;">
              📂 JSON 파일 불러오기
            </button>
            <button id="btn-export-json-teacher" style="flex: 1; padding: 8px; border-radius: 12px; background: #0369A1; color: #FFF; border: none; font-weight: 800; font-size: 11px; cursor: pointer;">
              💾 백업 다운로드
            </button>
          </div>
          <input type="file" id="teacher-json-file-input" accept=".json" style="display: none;">
        </div>

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

    appView.querySelectorAll('.btn-load-preset-teacher').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.preset;
        loadPresetData(key);
      });
    });

    document.getElementById('btn-load-random-teacher').addEventListener('click', generateRandomAIData);
    
    const fileInput = document.getElementById('teacher-json-file-input');
    document.getElementById('btn-import-json-teacher').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) importJSONData(e.target.files[0]);
    });
    document.getElementById('btn-export-json-teacher').addEventListener('click', exportJSONData);

    document.getElementById('select-target-goal').addEventListener('change', (e) => {
      playSFX('pop');
      state.targetPhotos = parseInt(e.target.value);
      saveStateToLocalStorage();
      alert(`🎯 1개월 학급 인증 목표 수량이 ${state.targetPhotos}회로 변경되었습니다!`);
      renderTeacherScreen();
    });

    appView.querySelectorAll('.btn-select-theme').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        changeTheme(id);
        const theme = THEMES_CATALOG[id];
        alert(`🎉 학급 프로젝트 테마가 "${theme.name}"(으)로 변경되었습니다!\n아이들의 홈 화면 및 미션이 신규 테마로 전환됩니다.`);
        renderTeacherScreen();
      });
    });
  }

  function renderTVScreen() {
    const theme = THEMES_CATALOG[state.activeThemeId] || THEMES_CATALOG['hangeul'];
    const photos = state.classPhotoAuthCount[state.activeThemeId] || 0;

    const html = `
      <div style="padding: 24px; text-align: center; background: radial-gradient(circle, var(--color-primary-dark) 0%, #0F3318 100%); color: #FFF; min-height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <h1 style="font-size: 26px; font-weight: 900; color: #FFD23F; margin-bottom: 8px;">🎉 7세 햇살반 '${theme.tag}' ${photos}회 인증!</h1>
        <p style="font-size: 14px; margin-bottom: 16px;">20명 우리 반 아이들의 사진 인증으로 학급 게이지가 쑥쑥 올라갑니다!</p>
        
        <img src="${theme.stages[0].image}" style="width: 180px; height: 180px; animation: float 3s infinite ease-in-out; margin-bottom: 18px;">
        
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

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('btn-modal-done').addEventListener('click', () => {
      playSFX('pop');
      const modal = document.querySelector('.modal-backdrop');
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
    const equippedObj = AVATAR_SHOP_ITEMS.find(x => x.id === state.user.equippedItem);

    const html = `
      <div class="profile-screen">
        <div class="top-bar" style="margin-bottom: 12px;">
          <button class="icon-btn" id="btn-go-home-p" title="역할선택" style="width: 34px; height: 34px;">🏠</button>
          <span style="font-weight: 900; font-size: 14px;">마이페이지 &amp; 포인트 상점</span>
          <div></div>
        </div>

        <div class="profile-card-top" style="position: relative;">
          <!-- 메이플스토리 스타일 SD 개별 마스코트 가꾸기 카드 -->
          <div class="mascot-avatar-container-large">
            <img src="./assets/classtree_avatar_base.png${CACHE_BUST}" class="mascot-base-img-large" alt="내 메이플 마스코트">
            ${equippedObj && equippedObj.id === 'item_bird' ? `<img src="./assets/classtree_avatar_bird.png${CACHE_BUST}" class="mascot-accessory-pet-large" alt="빛새 펫">` : ''}
            ${equippedObj && equippedObj.id === 'item_ribbon' ? `<img src="./assets/classtree_avatar_ribbon.png${CACHE_BUST}" class="mascot-accessory-hat-large" alt="무지개 리본">` : ''}
            ${equippedObj && equippedObj.aura ? `<div class="mascot-aura-effect-large">${equippedObj.aura}</div>` : ''}
          </div>

          <h2 style="font-size: 19px; font-weight: 900; margin-top: 10px;">${state.user.name}</h2>
          <p style="font-size: 12px; color: var(--color-text-sub);">${state.user.class} • 🍁 메이플 꼬마 마스코트</p>
          
          <div class="coin-balance-pill" style="margin-top: 10px;">
            🪙 보유 포인트: <strong style="font-size: 16px;">${state.user.points}P</strong>
          </div>
        </div>

        <button class="role-btn role-btn-child" id="btn-open-digital-cert-profile" style="margin-bottom: 10px; background-color: #FFD23F; color: #3A2500;">
          <span>🏆 1년 수료 디지털 상장 미리보기</span>
          <span>➔</span>
        </button>

        <button class="role-btn role-btn-teacher" id="btn-open-data-loader-p" style="margin-bottom: 18px; background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); color: #FFF;">
          <span>📥 학급 데이터 불러오기 모듈 실행</span>
          <span>⚡</span>
        </button>

        <div class="section-header">
          <h3 class="section-title">🍁 메이플스토리풍 꼬마 마스코트 꾸미기 상점</h3>
        </div>

        <div class="shop-grid" style="margin-bottom: 22px;">
          ${AVATAR_SHOP_ITEMS.map(item => {
            const isEquipped = state.user.equippedItem === item.id;
            const isOwned = state.user.inventory.includes(item.id);

            let btnText = `${item.cost}P 구매/장착`;
            let btnStyle = 'background: var(--theme-header-gradient); color: #FFF;';

            if (isEquipped) {
              btnText = '✓ 장착중 (해제)';
              btnStyle = 'background: #22C55E; color: #FFF; font-weight: 900;';
            } else if (isOwned) {
              btnText = '장착하기';
              btnStyle = 'background: #3B82F6; color: #FFF; font-weight: 900;';
            }

            return `
              <div class="shop-item-card">
                <div class="shop-item-icon">${item.icon}</div>
                <div style="font-weight: 800; font-size: 13px;">${item.name}</div>
                <div style="font-size: 10px; color: var(--color-text-sub); margin-top: 2px; height: 28px; line-height: 1.2;">
                  ${item.desc}
                </div>
                <button class="shop-equip-item-btn" data-id="${item.id}" data-cost="${item.cost}" data-name="${item.name}" style="width: 100%; padding: 7px; border-radius: 12px; font-size: 11px; border: none; margin-top: 8px; cursor: pointer; ${btnStyle}">
                  ${btnText}
                </button>
              </div>
            `;
          }).join('')}
        </div>

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
      </div>
    `;

    appView.innerHTML = html;

    document.getElementById('btn-go-home-p').addEventListener('click', () => { playSFX('pop'); switchView('welcome'); });
    document.getElementById('btn-open-digital-cert-profile').addEventListener('click', openDigitalCertificateModal);
    document.getElementById('btn-open-data-loader-p').addEventListener('click', openDataLoaderModal);

    appView.querySelectorAll('.shop-buy-coupon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cost = parseInt(btn.dataset.cost);
        const title = btn.dataset.title;

        if (state.user.points >= cost) {
          playSFX('fanfare');
          state.user.points -= cost;
          saveStateToLocalStorage();
          if (window.confetti) confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });

          alert(`🎉 축하합니다!\n"${title}" 교환 성공! (${cost}P 차감)\n\n담임선생님과 부모님 모바일 앱으로 모바일 교환 쿠폰이 발송되었습니다.`);
          renderProfileScreen();
        } else {
          playSFX('pop');
          alert(`포인트가 부족해요! (필요: ${cost}P / 현재: ${state.user.points}P)\n미션을 수행하고 포인트를 더 모아보세요.`);
        }
      });
    });

    appView.querySelectorAll('.shop-equip-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const cost = parseInt(btn.dataset.cost);
        const name = btn.dataset.name;

        if (state.user.equippedItem === id) {
          playSFX('pop');
          state.user.equippedItem = null;
          saveStateToLocalStorage();
          alert(`✨ "${name}" 장착을 해제했습니다.`);
          renderProfileScreen();
          return;
        }

        if (state.user.inventory.includes(id)) {
          playSFX('fanfare');
          state.user.equippedItem = id;
          saveStateToLocalStorage();
          alert(`✨ "${name}" 아이템을 내 꼬마 마스코트에 성공적으로 장착했습니다!`);
          renderProfileScreen();
          return;
        }

        if (state.user.points >= cost) {
          playSFX('fanfare');
          state.user.points -= cost;
          state.user.inventory.push(id);
          state.user.equippedItem = id;
          saveStateToLocalStorage();
          if (window.confetti) confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
          alert(`🎉 축하합니다!\n"${name}" 구매 및 내 꼬마 마스코트 장착 완료! (-${cost}P)`);
          renderProfileScreen();
        } else {
          playSFX('pop');
          alert(`포인트가 부족해요! (필요: ${cost}P / 현재: ${state.user.points}P)\n일일/주간 미션을 수행하고 포인트를 더 모아보세요.`);
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

    document.body.insertAdjacentHTML('beforeend', modalHtml);

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
      const modal = document.querySelector('.modal-backdrop');
      if (modal) modal.remove();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
