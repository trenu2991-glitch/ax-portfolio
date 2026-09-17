/**
 * API Client module for Kim Ji-woo's Dietitian Portfolio.
 * Connects to SQLite REST API when server is running, 
 * with automatic fallback to client-side Mock/LocalStorage when opened as static file.
 */

const API_BASE_URL = window.location.origin.includes('http') ? window.location.origin : 'http://localhost:8000';

// Fallback Mock Data in case the backend server isn't currently running
const FALLBACK_PROJECTS = [
  {
    id: 1,
    title: "만성 신장질환(CKD) 단계별 맞춤 치료식 식단 설계 및 임상 가이드",
    category: "clinical",
    subtitle: "2025 전국 대학생 영양식단 경진대회 최우수상 (보건복지부 후원)",
    tags: "임상영양, 신장질환, 저칼륨조리법, 치료식단, 질환가이드",
    summary: "신장 기능 저하 환자를 위해 칼륨 1,200mg/일, 나트륨 2,000mg/일 이하로 엄격히 통제하면서도 환자의 식사 만족도와 단백질 필요량을 충족시키는 4주 순환 임상 식단표 및 채소 수침 전처리 표준 가이드라인 개발.",
    detail_md: `
### 1. 프로젝트 배경 및 목적
만성 콩팥병(CKD 3~4기) 환자는 단백질, 칼륨, 인, 나트륨 섭취의 정밀한 제한이 필수적입니다. 그러나 과도한 식사 제한은 환자의 식욕 저하와 영양실조(PEW)를 야기합니다. 이에 **맛과 영양, 임상 안전성을 동시에 충족하는 28일 순환 식단**을 개발하였습니다.

### 2. 핵심 수행 내용
- **채소류 칼륨 용출 전처리 표준화 실험**: 채소 얇게 썰기 + 2시간 미온수 침지 + 3분 끓는 물 데치기를 통해 채소 속 칼륨을 평균 54.3% 감량하는 조리 매뉴얼 확립.
- **인/단백질 비율(P/P Ratio) 최적화**: 난백(달걀 흰자), 우둔살 등 생물가가 높고 인 함량이 낮은 급원식품 선별 배합.
- **환자 및 보호자 맞춤 리플렛 제작**: 어려운 임상 영양용어를 알기 쉬운 신호등 영양표시제로 시각화.

### 3. 성과 및 산출물
- 2025 전국 대학생 영양식단 경진대회 **최우수상** 수상
- 병원 임상영양팀 자문 평가 '실제 현장 즉시 도입 가능성 우수' 평점 4.9/5.0
    `,
    image_path: "media/dish-ckd.svg",
    badge: "최우수상 수상",
    date_period: "2025.03 - 2025.08 (6개월)"
  },
  {
    id: 2,
    title: "대학병원 500인 단체급식 영양관리 및 HACCP 위생 동선 개선",
    category: "foodservice",
    subtitle: "상급종합병원 영양팀 8주 현장 실습 우수 프로젝트",
    tags: "단체급식, HACCP, 식단작성, 대량조리, 위생관리, 원가절감",
    summary: "500인 규모 종합병원 직원 및 입원 환자 급식을 대상으로 검수부터 조리, 배식, 세척까지 전 공정 CCP 위생 위해요소를 분석하고 교차오염 방지 동선 재설계 및 1식 5찬 균형식단 45일치 작성.",
    detail_md: `
### 1. 현장 이슈 발굴
- 조리실 내 세척 구역과 가열 조리 구역 간 작업 동선 중첩으로 인한 교차오염 리스크(CCP-1) 발견.
- 잔반량 분석 결과 특정 나물 및 볶음류 반찬의 폐기율이 28%에 달해 식재료비 누수 확인.

### 2. 해결 솔루션
- **HACCP 구역 분리 3색 테이핑 & 동선 일원화**: 전처리, 가열조리, 배식 대기 구역을 시각적으로 구분하여 작업자 교차오염 방지율 100% 달성.
- **선호도 반영 메뉴 믹스 리엔지니어링**: 조리법(튀김/찜/볶음/무침)의 중복을 배제하고 천연 소스(유자청, 사과양파 드레싱) 도입으로 잔반율 11.4%로 급감.
- **영양사 검수 매뉴얼 개정**: 중심온도계 디지털 로깅 체크시트 구축.
    `,
    image_path: "media/dish-hospital.svg",
    badge: "우수 실습생",
    date_period: "2025.06 - 2025.08 (2개월)"
  },
  {
    id: 3,
    title: "2030 직장인 혈당 스파이크 방지 '저속노화 Low-GI' 도시락 R&D",
    category: "rd",
    subtitle: "식품 캡스톤 디자인 은상 & 산학협력 푸드테크 런칭",
    tags: "식품R&D, 혈당케어, Low-GI, 탄단지밸런스, 레시피개발",
    summary: "급격한 혈당 상승(혈당 스파이크)과 식곤증을 호소하는 현대 직장인을 타깃으로 GI 지수 55 이하 복합 탄수화물과 식이섬유, 수비드 불포화지방 단백질로 설계한 밀키트/도시락 7종 개발.",
    detail_md: `
### 1. 제품 기획 배경
- 당류 과다 섭취 및 정제 탄수화물 위주의 식습관으로 2030 세대의 당뇨 전단계(공복혈당장애) 비율 급증.
- '건강하면서도 든든하고 맛있는' 지속 가능한 저속노화 일상식을 제안.

### 2. 영양학적 설계 전략
- **탄단지 황금비율 (45 : 30 : 25)**: 과도한 탄수화물 제한 대신 저항성 전분(발아현미, 귀리, 렌틸콩)으로 포만감 유지.
- **거꾸로 식사법(채-단-탄) 유도 패키징**: 1단(그린 샐러드) -> 2단(수비드 연어) -> 3단(잡곡밥) 순서 섭취 유도 전용 트레이 디자인.
- **관능평가 및 GI 분석**: 공인시험기관 의뢰 결과 추정 GI 48.2 도출.
    `,
    image_path: "media/dish-lowgi.svg",
    badge: "산학협력 선정",
    date_period: "2024.09 - 2024.12 (4개월)"
  },
  {
    id: 4,
    title: "노인복지관 연하곤란(삼킴장애) 맞춤 연식 레시피 개발 및 영양교실",
    category: "community",
    subtitle: "지역사회 영양 봉사 프로젝트 (어르신 30인 실증)",
    tags: "지역사회영양, 연하장애, IDDSI, 노인영양, 식이지도",
    summary: "치아 손실 및 저작/연하 기능이 저하된 독거 어르신 30명을 위해 국제 연하장애 식이표준(IDDSI) Level 4에 부합하는 부드럽고 질식 위험 없는 연식 15종 및 맞춤형 영양 교육 실시.",
    detail_md: `
### 1. 대상자 특성 파악
- 서울시 성북구 노인종합복지관 이용 어르신 중 연하곤란 위험군 30명 대상.
- 흡인성 폐렴 위험과 영양 결핍(근감소증) 방지가 급선무.

### 2. 레시피 및 영양중재
- **점도증진제 황금 비율화**: 무스, 퓨레 조리 시 이물감 없는 최적 점도 수치화.
- **천연 풍미 증진 조리**: 다시마, 표고 감칠맛 베이스로 염도 0.5% 이하 유지.
- **1:1 영양상담 및 식사일기 피드백 진행**.
    `,
    image_path: "media/dish-senior.svg",
    badge: "봉사 우수상",
    date_period: "2024.03 - 2024.06 (4개월)"
  }
];

const FALLBACK_MEALS = [
  // RICE
  { id: 1, name: "수침 백미밥 (저칼륨)", category: "rice", calories: 310, carbs: 68, protein: 5.5, fat: 0.6, sodium: 5, diet_type: "clinical" },
  { id: 2, name: "발아현미 귀리밥", category: "rice", calories: 330, carbs: 62, protein: 8.2, fat: 2.5, sodium: 12, diet_type: "balanced" },
  { id: 3, name: "3색 퀴노아 렌틸콩밥", category: "rice", calories: 295, carbs: 52, protein: 11.5, fat: 3.8, sodium: 8, diet_type: "lowgi" },
  { id: 4, name: "단호박 두부 타락죽", category: "rice", calories: 240, carbs: 42, protein: 9.8, fat: 4.2, sodium: 45, diet_type: "senior" },

  // SOUP
  { id: 5, name: "데친 무 맑은 쇠고기탕", category: "soup", calories: 75, carbs: 4.5, protein: 8.2, fat: 2.4, sodium: 210, diet_type: "clinical" },
  { id: 6, name: "얼큰 쇠고기 콩나물국", category: "soup", calories: 115, carbs: 6.2, protein: 11.0, fat: 4.8, sodium: 380, diet_type: "balanced" },
  { id: 7, name: "토마토 채소 렌틸스튜", category: "soup", calories: 140, carbs: 18.0, protein: 6.5, fat: 3.2, sodium: 280, diet_type: "lowgi" },
  { id: 8, name: "순두부 들깨 보양탕", category: "soup", calories: 130, carbs: 5.0, protein: 9.5, fat: 7.8, sodium: 250, diet_type: "senior" },

  // MAIN
  { id: 9, name: "단호박 찜닭가슴살", category: "main", calories: 220, carbs: 12.0, protein: 26.5, fat: 5.2, sodium: 190, diet_type: "clinical" },
  { id: 10, name: "안동식 간장 닭찜", category: "main", calories: 290, carbs: 16.5, protein: 24.0, fat: 12.0, sodium: 420, diet_type: "balanced" },
  { id: 11, name: "수비드 생연어 스테이크", category: "main", calories: 260, carbs: 2.0, protein: 25.0, fat: 16.5, sodium: 180, diet_type: "lowgi" },
  { id: 12, name: "소고기 영양 무스", category: "main", calories: 195, carbs: 3.5, protein: 18.0, fat: 10.5, sodium: 230, diet_type: "senior" },

  // SIDE 1
  { id: 13, name: "데친 청경채 팽이무침", category: "side1", calories: 35, carbs: 4.2, protein: 2.1, fat: 0.8, sodium: 90, diet_type: "clinical" },
  { id: 14, name: "해물 부추전", category: "side1", calories: 145, carbs: 15.0, protein: 6.2, fat: 6.5, sodium: 240, diet_type: "balanced" },
  { id: 15, name: "아보카도 토마토 샐러드", category: "side1", calories: 110, carbs: 6.0, protein: 2.5, fat: 9.0, sodium: 75, diet_type: "lowgi" },
  { id: 16, name: "사과 시금치 영양 겔", category: "side1", calories: 65, carbs: 12.0, protein: 1.5, fat: 0.2, sodium: 40, diet_type: "senior" },

  // SIDE 2
  { id: 17, name: "저염 오이소박이", category: "side2", calories: 25, carbs: 4.0, protein: 1.0, fat: 0.3, sodium: 110, diet_type: "clinical" },
  { id: 18, name: "숙성 포기김치", category: "side2", calories: 30, carbs: 5.0, protein: 1.8, fat: 0.5, sodium: 260, diet_type: "balanced" },
  { id: 19, name: "알룰로스 수제 오이피클", category: "side2", calories: 20, carbs: 4.5, protein: 0.4, fat: 0.1, sodium: 80, diet_type: "lowgi" },
  { id: 20, name: "부드러운 계란찜", category: "side2", calories: 85, carbs: 1.5, protein: 7.2, fat: 5.5, sodium: 160, diet_type: "senior" }
];

const PortfolioAPI = {
  // Fetch Projects (SQLite or Fallback)
  async getProjects() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`);
      if (!res.ok) throw new Error("Server error");
      const json = await res.json();
      return json.data || FALLBACK_PROJECTS;
    } catch (e) {
      console.info("Using local fallback projects data (SQLite offline/static mode)");
      return FALLBACK_PROJECTS;
    }
  },

  // Fetch Meals for Simulator
  async getMeals() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/meals`);
      if (!res.ok) throw new Error("Server error");
      const json = await res.json();
      return json.data || FALLBACK_MEALS;
    } catch (e) {
      console.info("Using local fallback meals data");
      return FALLBACK_MEALS;
    }
  },

  // Submit Inquiry (SQLite or LocalStorage)
  async submitInquiry(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Submission failed");
      return await res.json();
    } catch (e) {
      // Local fallback
      const list = JSON.parse(localStorage.getItem("jiwoo_inquiries") || "[]");
      const record = { ...data, id: Date.now(), created_at: new Date().toISOString() };
      list.push(record);
      localStorage.setItem("jiwoo_inquiries", JSON.stringify(list));
      return {
        status: "success",
        message: "문의가 안전하게 접수되었습니다! 김지우 영양사가 신속히 확인하고 연락드리겠습니다.",
        inquiry_id: record.id
      };
    }
  }
};

window.PortfolioAPI = PortfolioAPI;
