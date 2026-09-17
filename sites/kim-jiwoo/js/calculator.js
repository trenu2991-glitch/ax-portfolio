/**
 * Nutrition & Macro Calculator + Interactive Meal Tray Simulator Logic
 * Designed for Kim Ji-woo's Dietitian Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initMacroCalculator();
  initMealTraySimulator();
});

/* ==========================================================================
   1. BMR & TDEE / Macro Calculator
   ========================================================================== */
function initMacroCalculator() {
  const genderInputs = document.querySelectorAll('input[name="calc_gender"]');
  const ageInput = document.getElementById('calc_age');
  const heightInput = document.getElementById('calc_height');
  const weightInput = document.getElementById('calc_weight');
  const activitySelect = document.getElementById('calc_activity');
  const goalSelect = document.getElementById('calc_goal');

  const bmrDisplay = document.getElementById('calc_bmr_val');
  const tdeeDisplay = document.getElementById('calc_tdee_val');
  const carbDisplay = document.getElementById('calc_carb_val');
  const proteinDisplay = document.getElementById('calc_protein_val');
  const fatDisplay = document.getElementById('calc_fat_val');
  const adviceDisplay = document.getElementById('calc_advice_text');

  function calculate() {
    let gender = 'female';
    genderInputs.forEach(input => {
      if (input.checked) gender = input.value;
    });

    const age = parseFloat(ageInput.value) || 24;
    const height = parseFloat(heightInput.value) || 165;
    const weight = parseFloat(weightInput.value) || 55;
    const activity = parseFloat(activitySelect.value) || 1.55;
    const goal = goalSelect.value;

    // Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    let tdee = bmr * activity;
    let targetCalories = tdee;
    let advice = "";

    if (goal === 'weight_loss') {
      targetCalories -= 400;
      advice = "💡 감량을 위해 하루 약 400 kcal 적자를 유도하며, 근손실 방지를 위해 체중 1kg당 1.4~1.6g 이상의 단백질 섭취를 권장합니다.";
    } else if (goal === 'muscle_gain') {
      targetCalories += 350;
      advice = "💡 근비대를 위해 하루 350 kcal 잉여 에너지를 공급하고, 운동 직후 흡수가 빠른 단백질과 복합 탄수화물을 함께 보충하세요.";
    } else if (goal === 'blood_sugar') {
      advice = "💡 혈당 스파이크 방지를 위해 정제 탄수화물을 줄이고 통곡물과 채소 식이섬유를 식사의 맨 처음에 드시는 '거꾸로 식사법'을 추천합니다.";
    } else {
      advice = "💡 건강한 현상 유지를 위해 규칙적인 3끼 식사와 균형 잡힌 5대 영양소 섭취를 지켜주세요.";
    }

    // Macronutrient breakdown (Carb: 50%, Protein: 25%, Fat: 25%)
    const carbsG = Math.round((targetCalories * 0.50) / 4);
    const proteinG = Math.round((targetCalories * 0.25) / 4);
    const fatG = Math.round((targetCalories * 0.25) / 9);

    if (bmrDisplay) bmrDisplay.textContent = Math.round(bmr).toLocaleString();
    if (tdeeDisplay) tdeeDisplay.textContent = Math.round(targetCalories).toLocaleString();
    if (carbDisplay) carbDisplay.textContent = `${carbsG}g`;
    if (proteinDisplay) proteinDisplay.textContent = `${proteinG}g`;
    if (fatDisplay) fatDisplay.textContent = `${fatG}g`;
    if (adviceDisplay) adviceDisplay.textContent = advice;
  }

  const inputs = [ageInput, heightInput, weightInput, activitySelect, goalSelect];
  inputs.forEach(inp => {
    if (inp) {
      inp.addEventListener('input', calculate);
      inp.addEventListener('change', calculate);
    }
  });
  genderInputs.forEach(radio => radio.addEventListener('change', calculate));

  // Initial run
  calculate();
}

/* ==========================================================================
   2. Interactive Meal Tray Simulator
   ========================================================================== */
async function initMealTraySimulator() {
  const meals = await window.PortfolioAPI.getMeals();

  const slotSelects = {
    rice: document.getElementById('select_slot_rice'),
    soup: document.getElementById('select_slot_soup'),
    main: document.getElementById('select_slot_main'),
    side1: document.getElementById('select_slot_side1'),
    side2: document.getElementById('select_slot_side2')
  };

  const slotNames = {
    rice: document.getElementById('name_slot_rice'),
    soup: document.getElementById('name_slot_soup'),
    main: document.getElementById('name_slot_main'),
    side1: document.getElementById('name_slot_side1'),
    side2: document.getElementById('name_slot_side2')
  };

  const slotCals = {
    rice: document.getElementById('cal_slot_rice'),
    soup: document.getElementById('cal_slot_soup'),
    main: document.getElementById('cal_slot_main'),
    side1: document.getElementById('cal_slot_side1'),
    side2: document.getElementById('cal_slot_side2')
  };

  // Populate dropdown options grouped by category
  Object.keys(slotSelects).forEach(cat => {
    const select = slotSelects[cat];
    if (!select) return;
    select.innerHTML = '';
    const items = meals.filter(m => m.category === cat);
    items.forEach((item, index) => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.textContent = `${item.name} (${item.calories} kcal)`;
      select.appendChild(opt);
    });
  });

  // Calculate & Refresh Tray Totals
  function updateTray() {
    let totalCal = 0;
    let totalCarb = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalSodium = 0;

    let selectedDietTypes = [];

    Object.keys(slotSelects).forEach(cat => {
      const select = slotSelects[cat];
      if (!select) return;
      const itemId = parseInt(select.value);
      const item = meals.find(m => m.id === itemId);
      if (item) {
        totalCal += item.calories;
        totalCarb += item.carbs;
        totalProtein += item.protein;
        totalFat += item.fat;
        totalSodium += item.sodium;
        selectedDietTypes.push(item.diet_type);

        if (slotNames[cat]) slotNames[cat].textContent = item.name;
        if (slotCals[cat]) slotCals[cat].textContent = `${item.calories} kcal`;
      }
    });

    // Update Totals in DOM
    const totalCalEl = document.getElementById('tray_total_cal');
    const carbGEl = document.getElementById('tray_carb_g');
    const proteinGEl = document.getElementById('tray_protein_g');
    const fatGEl = document.getElementById('tray_fat_g');
    const sodiumMgEl = document.getElementById('tray_sodium_mg');

    if (totalCalEl) totalCalEl.textContent = totalCal.toLocaleString();
    if (carbGEl) carbGEl.textContent = `${totalCarb.toFixed(1)}g`;
    if (proteinGEl) proteinGEl.textContent = `${totalProtein.toFixed(1)}g`;
    if (fatGEl) fatGEl.textContent = `${totalFat.toFixed(1)}g`;
    if (sodiumMgEl) sodiumMgEl.textContent = `${Math.round(totalSodium)}mg`;

    // Progress Bar Visual Widths (Assumed benchmark 1 meal: 700 kcal, 90g Carb, 30g Prot, 22g Fat, 800mg Na)
    const carbPercent = Math.min(100, Math.round((totalCarb / 100) * 100));
    const protPercent = Math.min(100, Math.round((totalProtein / 40) * 100));
    const fatPercent = Math.min(100, Math.round((totalFat / 30) * 100));
    const sodPercent = Math.min(100, Math.round((totalSodium / 1000) * 100));

    const carbBar = document.getElementById('bar_carb');
    const protBar = document.getElementById('bar_protein');
    const fatBar = document.getElementById('bar_fat');
    const sodBar = document.getElementById('bar_sodium');

    if (carbBar) carbBar.style.width = `${carbPercent}%`;
    if (protBar) protBar.style.width = `${protPercent}%`;
    if (fatBar) fatBar.style.width = `${fatPercent}%`;
    if (sodBar) sodBar.style.width = `${sodPercent}%`;

    // Dietitian Clinical Judgment evaluation
    const commentTitle = document.getElementById('judgment_title');
    const commentText = document.getElementById('judgment_desc');

    if (totalSodium <= 450) {
      if (commentTitle) commentTitle.innerHTML = '🌿 <strong>[임상 영양 판정] 저나트륨·신장보호 우수 식단</strong>';
      if (commentText) commentText.textContent = `1회 나트륨(${Math.round(totalSodium)}mg)이 500mg 미만으로 제한되어 만성신장질환(CKD) 및 고혈압 환자에게 매우 안전한 치료식 설계입니다.`;
    } else if (totalProtein >= 35) {
      if (commentTitle) commentTitle.innerHTML = '💪 <strong>[영양 판정] 고단백 활력 밸런스 식단</strong>';
      if (commentText) commentText.textContent = `단백질 함량이 ${totalProtein.toFixed(1)}g으로 풍부하여 활동량이 많은 성인 및 회복기 환우의 근육 합성 유지에 탁월합니다.`;
    } else if (totalCarb <= 75 && totalCal <= 650) {
      if (commentTitle) commentTitle.innerHTML = '✨ <strong>[혈당 판정] 저속노화 Low-GI 안정권 식단</strong>';
      if (commentText) commentText.textContent = `식이섬유가 풍부한 통곡물과 양질의 불포화지방이 조화되어 식후 혈당 급상승을 막고 포만감을 오래 유지합니다.`;
    } else {
      if (commentTitle) commentTitle.innerHTML = '🥗 <strong>[영양 판정] 표준 단체급식 영양권장량 충족</strong>';
      if (commentText) commentText.textContent = `총 칼로리 ${totalCal} kcal로 성인 1끼 권장량에 적합하며, 밥·국·주찬·부찬 2종의 조화로운 구성입니다.`;
    }
  }

  // Bind change events to all slots
  Object.values(slotSelects).forEach(select => {
    if (select) select.addEventListener('change', updateTray);
  });

  // Preset Button Click Handlers
  const presetButtons = document.querySelectorAll('.btn-preset');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.dataset.preset; // 'clinical', 'balanced', 'lowgi', 'senior'
      // Set options matching the preset type
      Object.keys(slotSelects).forEach(cat => {
        const matchingItem = meals.find(m => m.category === cat && m.diet_type === type);
        if (matchingItem && slotSelects[cat]) {
          slotSelects[cat].value = matchingItem.id;
        }
      });
      updateTray();
    });
  });

  // Initial trigger with first preset (clinical)
  const defaultPreset = document.querySelector('.btn-preset[data-preset="clinical"]');
  if (defaultPreset) defaultPreset.click();
}
