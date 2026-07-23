const fs = require('fs');

let file = fs.readFileSync('src/utils/translation.ts', 'utf8');

const languages = ['zh', 'en', 'ja', 'ko', 'id', 'ms', 'th', 'vi'];

const addingData = {
  zh: {
    loading: {
      planting: '種菜中 請稍後...',
      heading_to: '正在趕往 {market}市場...',
      default: '載入中...'
    },
    actions: { random: '隨機作物' }
  },
  en: {
    loading: {
      planting: 'Planting crops, please wait...',
      heading_to: 'Heading to {market} market...',
      default: 'Loading...'
    },
    actions: { random: 'Random Crop' }
  },
  ja: {
    loading: {
      planting: '野菜を栽培中。お待ちください...',
      heading_to: '{market}市場へ向かっています...',
      default: '読み込み中...'
    },
    actions: { random: 'ランダムな作物' }
  },
  ko: {
    loading: {
      planting: '채소를 재배하는 중입니다. 잠시만 기다려주세요...',
      heading_to: '{market} 시장으로 이동 중...',
      default: '로딩 중...'
    },
    actions: { random: '랜덤 작물' }
  },
  id: {
    loading: {
      planting: 'Sedang menanam sayuran, mohon tunggu...',
      heading_to: 'Menuju pasar {market}...',
      default: 'Memuat...'
    },
    actions: { random: 'Tanaman Acak' }
  },
  ms: {
    loading: {
      planting: 'Sedang menanam sayur, sila tunggu...',
      heading_to: 'Menuju ke pasar {market}...',
      default: 'Memuatkan...'
    },
    actions: { random: 'Tanaman Rawak' }
  },
  th: {
    loading: {
      planting: 'กำลังปลูกผัก กรุณารอสักครู่...',
      heading_to: 'กำลังมุ่งหน้าไปที่ตลาด {market}...',
      default: 'กำลังโหลด...'
    },
    actions: { random: 'สุ่มพืช' }
  },
  vi: {
    loading: {
      planting: 'Đang trồng rau, vui lòng đợi...',
      heading_to: 'Đang đi đến chợ {market}...',
      default: 'Đang tải...'
    },
    actions: { random: 'Cây trồng ngẫu nhiên' }
  }
};

let currentLangIndex = -1;

let newLines = [];
let lines = file.split('\n');
let i = 0;

while(i < lines.length) {
  const line = lines[i];
  if (line.match(/^  [a-z]{2}: \{/)) {
    currentLangIndex++;
  }
  
  if (line.includes('epidemic: {') && currentLangIndex !== -1) {
    const tData = addingData[languages[currentLangIndex]];
    newLines.push(`    loading: {`);
    newLines.push(`      planting: '${tData.loading.planting}',`);
    newLines.push(`      heading_to: '${tData.loading.heading_to}',`);
    newLines.push(`      default: '${tData.loading.default}'`);
    newLines.push(`    },`);
  }
  
  if (line.includes('advanced:') && currentLangIndex !== -1) {
    const tData = addingData[languages[currentLangIndex]];
    newLines.push(line + ',');
    newLines.push(`      random: '${tData.actions.random}'`);
    i++;
    continue;
  }
  
  newLines.push(line);
  i++;
}

fs.writeFileSync('src/utils/translation.ts', newLines.join('\n'));
