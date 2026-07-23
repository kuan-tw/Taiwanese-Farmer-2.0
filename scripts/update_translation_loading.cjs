const fs = require('fs');

const addingData = {
  zh: {
    planting: ['種菜中 請稍後...', '正在為您挑選最新鮮的農產品...', '農夫正在辛勤採收中...'],
    heading_to: ['正在趕往 {market}市場...', '{market}市場的資料正在路上...', '連線至 {market}市場中...'],
    default: ['載入中...', '請稍候片刻...', '正在整理資料...']
  },
  en: {
    planting: ['Planting crops, please wait...', 'Selecting the freshest produce for you...', 'Farmers are harvesting hard...'],
    heading_to: ['Heading to {market} market...', 'Data from {market} market is on the way...', 'Connecting to {market} market...'],
    default: ['Loading...', 'Please wait a moment...', 'Organizing data...']
  },
  ja: {
    planting: ['野菜を栽培中。お待ちください...', '新鮮な農産物を選んでいます...', '農家が一生懸命収穫しています...'],
    heading_to: ['{market}市場へ向かっています...', '{market}市場からのデータが到着中です...', '{market}市場に接続中...'],
    default: ['読み込み中...', '少々お待ちください...', 'データを整理しています...']
  },
  ko: {
    planting: ['채소를 재배하는 중입니다. 잠시만 기다려주세요...', '가장 신선한 농산물을 고르고 있습니다...', '농부들이 열심히 수확 중입니다...'],
    heading_to: ['{market} 시장으로 이동 중...', '{market} 시장의 데이터가 오는 중입니다...', '{market} 시장에 연결 중...'],
    default: ['로딩 중...', '잠시만 기다려주세요...', '데이터를 정리하는 중입니다...']
  },
  id: {
    planting: ['Sedang menanam sayuran, mohon tunggu...', 'Memilih hasil bumi paling segar untuk Anda...', 'Petani sedang memanen dengan giat...'],
    heading_to: ['Menuju pasar {market}...', 'Data dari pasar {market} sedang dalam perjalanan...', 'Menghubungkan ke pasar {market}...'],
    default: ['Memuat...', 'Mohon tunggu sebentar...', 'Mengatur data...']
  },
  ms: {
    planting: ['Sedang menanam sayur, sila tunggu...', 'Memilih hasil pertanian yang paling segar untuk anda...', 'Petani sedang menuai dengan tekun...'],
    heading_to: ['Menuju ke pasar {market}...', 'Data dari pasar {market} sedang dalam perjalanan...', 'Menyambung ke pasar {market}...'],
    default: ['Memuatkan...', 'Sila tunggu sebentar...', 'Menyusun data...']
  },
  th: {
    planting: ['กำลังปลูกผัก กรุณารอสักครู่...', 'กำลังเลือกผลิตผลที่สดใหม่ที่สุดสำหรับคุณ...', 'เกษตรกรกำลังเก็บเกี่ยวอย่างหนัก...'],
    heading_to: ['กำลังมุ่งหน้าไปที่ตลาด {market}...', 'ข้อมูลจากตลาด {market} กำลังมา...', 'กำลังเชื่อมต่อกับตลาด {market}...'],
    default: ['กำลังโหลด...', 'กรุณารอสักครู่...', 'กำลังจัดระเบียบข้อมูล...']
  },
  vi: {
    planting: ['Đang trồng rau, vui lòng đợi...', 'Đang chọn những nông sản tươi nhất cho bạn...', 'Nông dân đang thu hoạch chăm chỉ...'],
    heading_to: ['Đang đi đến chợ {market}...', 'Dữ liệu từ chợ {market} đang được chuyển đến...', 'Đang kết nối với chợ {market}...'],
    default: ['Đang tải...', 'Vui lòng đợi một lát...', 'Đang sắp xếp dữ liệu...']
  }
};

let file = fs.readFileSync('src/utils/translation.ts', 'utf8');

let newLines = [];
let lines = file.split('\n');
let i = 0;

let currentLangIndex = -1;
const languages = ['zh', 'en', 'ja', 'ko', 'id', 'ms', 'th', 'vi'];

while(i < lines.length) {
  const line = lines[i];
  if (line.match(/^  [a-z]{2}: \{/)) {
    currentLangIndex++;
  }
  
  if (line.includes('loading: {') && currentLangIndex !== -1) {
    const tData = addingData[languages[currentLangIndex]];
    newLines.push(`    loading: {`);
    newLines.push(`      planting_0: '${tData.planting[0]}',`);
    newLines.push(`      planting_1: '${tData.planting[1]}',`);
    newLines.push(`      planting_2: '${tData.planting[2]}',`);
    newLines.push(`      heading_to_0: '${tData.heading_to[0]}',`);
    newLines.push(`      heading_to_1: '${tData.heading_to[1]}',`);
    newLines.push(`      heading_to_2: '${tData.heading_to[2]}',`);
    newLines.push(`      default_0: '${tData.default[0]}',`);
    newLines.push(`      default_1: '${tData.default[1]}',`);
    newLines.push(`      default_2: '${tData.default[2]}'`);
    newLines.push(`    },`);
    
    // skip the original lines:
    // planting: '...',
    // heading_to: '...',
    // default: '...'
    // },
    i += 5;
    continue;
  }
  
  newLines.push(line);
  i++;
}

fs.writeFileSync('src/utils/translation.ts', newLines.join('\n'));
