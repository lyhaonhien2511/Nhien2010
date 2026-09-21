import { Question } from '../types';

export const RED_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Mặt Trời luôn mọc ở hướng nào vào mỗi buổi sáng?',
    options: ['Hướng Đông', 'Hướng Tây', 'Hướng Nam', 'Hướng Bắc'],
    correctIndex: 0,
    explanation: 'Do Trái Đất tự quay từ Tây sang Đông nên ta thấy Mặt Trời mọc ở hướng Đông.',
    category: 'Địa lý'
  },
  {
    id: 2,
    question: 'Loài động vật nào thường được mệnh danh là "Chúa sơn lâm"?',
    options: ['Sư tử', 'Hổ (Cọp)', 'Báo đốm', 'Gấu bắc cực'],
    correctIndex: 1,
    explanation: 'Trong văn hóa Á Đông, Hổ được tôn xưng là Chúa sơn lâm (vua của núi rừng).',
    category: 'Sinh học'
  },
  {
    id: 3,
    question: 'Ở áp suất khí quyển tiêu chuẩn, nước sôi ở bao nhiêu độ C?',
    options: ['80°C', '90°C', '100°C', '120°C'],
    correctIndex: 2,
    explanation: 'Ở áp suất 1 atm, điểm sôi của nước nguyên chất là chính xác 100°C.',
    category: 'Vật lý'
  },
  {
    id: 4,
    question: 'Hành tinh nào có kích thước lớn nhất trong Hệ Mặt Trời?',
    options: ['Sao Hỏa', 'Sao Thổ', 'Sao Hải Vương', 'Sao Mộc'],
    correctIndex: 3,
    explanation: 'Sao Mộc (Jupiter) là hành tinh khí khổng lồ lớn nhất Hệ Mặt Trời.',
    category: 'Thiên văn'
  },
  {
    id: 5,
    question: 'Việt Nam hiện có bao nhiêu tỉnh, thành phố trực thuộc Trung ương giáp biển?',
    options: ['24 tỉnh', '26 tỉnh', '28 tỉnh', '32 tỉnh'],
    correctIndex: 2,
    explanation: 'Việt Nam có 28 tỉnh, thành phố giáp biển trải dài từ Quảng Ninh đến Kiên Giang.',
    category: 'Địa lý Việt Nam'
  },
  {
    id: 6,
    question: 'Một người trưởng thành thông thường có bao nhiêu chiếc răng vĩnh viễn?',
    options: ['28 chiếc', '30 chiếc', '32 chiếc', '36 chiếc'],
    correctIndex: 2,
    explanation: 'Bộ răng vĩnh viễn đầy đủ của người lớn gồm 32 chiếc (bao gồm 4 răng khôn).',
    category: 'Y học'
  },
  {
    id: 7,
    question: 'Kim loại nào có khả năng dẫn điện tốt nhất ở điều kiện thường?',
    options: ['Bạc (Ag)', 'Đồng (Cu)', 'Vàng (Au)', 'Nhôm (Al)'],
    correctIndex: 0,
    explanation: 'Bạc là kim loại dẫn điện tốt nhất, tiếp theo là Đồng và Vàng.',
    category: 'Hóa học'
  },
  {
    id: 8,
    question: 'Quốc gia nào có diện tích lãnh thổ lớn nhất thế giới hiện nay?',
    options: ['Canada', 'Hoa Kỳ', 'Trung Quốc', 'Liên bang Nga'],
    correctIndex: 3,
    explanation: 'Nga là quốc gia lớn nhất thế giới với diện tích hơn 17 triệu km².',
    category: 'Địa lý thế giới'
  },
  {
    id: 9,
    question: 'Hình tam giác có cả 3 cạnh bằng nhau được gọi là tam giác gì?',
    options: ['Tam giác vuông', 'Tam giác cân', 'Tam giác đều', 'Tam giác tù'],
    correctIndex: 2,
    explanation: 'Tam giác đều có 3 cạnh bằng nhau và 3 góc bằng nhau (đều bằng 60°).',
    category: 'Toán học'
  },
  {
    id: 10,
    question: 'Ai là tác giả của tác phẩm thiếu nhi kinh điển "Dế Mèn phiêu lưu ký"?',
    options: ['Nam Cao', 'Tô Hoài', 'Nguyễn Nhật Ánh', 'Xuân Quỳnh'],
    correctIndex: 1,
    explanation: 'Nhà văn Tô Hoài sáng tác "Dế Mèn phiêu lưu ký" vào năm 1941.',
    category: 'Văn học'
  }
];

export const BLUE_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Đỉnh núi nào cao nhất Việt Nam và được mệnh danh là "Nóc nhà Đông Dương"?',
    options: ['Fansipan', 'Tây Côn Lĩnh', 'Bạch Mộc Lương Tử', 'Pu Si Lung'],
    correctIndex: 0,
    explanation: 'Fansipan cao 3.143m tại dãy Hoàng Liên Sơn, là đỉnh núi cao nhất Đông Dương.',
    category: 'Địa lý'
  },
  {
    id: 2,
    question: 'Hành tinh nào nằm ở vị trí gần Mặt Trời nhất trong Hệ Mặt Trời?',
    options: ['Sao Kim', 'Sao Thủy', 'Trái Đất', 'Sao Hỏa'],
    correctIndex: 1,
    explanation: 'Sao Thủy (Mercury) là hành tinh có quỹ đạo gần Mặt Trời nhất.',
    category: 'Thiên văn'
  },
  {
    id: 3,
    question: 'Loài động vật có kích thước và trọng lượng lớn nhất còn sống trên Trái Đất là gì?',
    options: ['Voi châu Phi', 'Cá mập trắng', 'Cá voi xanh', 'Mực khổng lồ'],
    correctIndex: 2,
    explanation: 'Cá voi xanh có thể dài hơn 30 mét và nặng tới 180-200 tấn.',
    category: 'Sinh học'
  },
  {
    id: 4,
    question: 'Châu lục nào có diện tích và dân số lớn nhất trên Trái Đất?',
    options: ['Châu Mỹ', 'Châu Phi', 'Châu Âu', 'Châu Á'],
    correctIndex: 3,
    explanation: 'Châu Á chiếm khoảng 30% tổng diện tích đất liền và hơn 60% dân số thế giới.',
    category: 'Địa lý'
  },
  {
    id: 5,
    question: 'Khí nào chiếm tỉ lệ thể tích lớn nhất trong không khí quyển Trái Đất?',
    options: ['Khí Oxy (O2)', 'Khí Nitơ (N2)', 'Khí Cacbonic (CO2)', 'Khí Argon (Ar)'],
    correctIndex: 1,
    explanation: 'Khí Nitơ chiếm khoảng 78% thể tích bầu khí quyển Trái Đất.',
    category: 'Hóa học'
  },
  {
    id: 6,
    question: 'Thủ đô chính thức của đất nước Nhật Bản là thành phố nào?',
    options: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'],
    correctIndex: 2,
    explanation: 'Tokyo là thủ đô và trung tâm kinh tế, chính trị lớn nhất của Nhật Bản.',
    category: 'Văn hóa'
  },
  {
    id: 7,
    question: 'Cơ quan nội tạng nào đóng vai trò chính trong việc lọc máu và tạo nước tiểu?',
    options: ['Gan', 'Tim', 'Thận', 'Dạ dày'],
    correctIndex: 2,
    explanation: 'Thận lọc khoảng 120-150 lít máu mỗi ngày để loại bỏ chất cặn bã qua nước tiểu.',
    category: 'Y học'
  },
  {
    id: 8,
    question: 'Hình vuông có tổng cộng bao nhiêu trục đối xứng?',
    options: ['2 trục', '3 trục', '4 trục', '8 trục'],
    correctIndex: 2,
    explanation: 'Hình vuông có 4 trục đối xứng: 2 đường trung trực của các cạnh và 2 đường chéo.',
    category: 'Toán học'
  },
  {
    id: 9,
    question: 'Ánh sáng từ Mặt Trời mất khoảng bao lâu để truyền đến Trái Đất?',
    options: ['Khoảng 8 giây', 'Khoảng 8 phút', 'Khoảng 8 giờ', 'Ngay tức thì (0 giây)'],
    correctIndex: 1,
    explanation: 'Với vận tốc 300.000 km/s và khoảng cách ~150 triệu km, ánh sáng mất khoảng 8 phút 20 giây.',
    category: 'Vật lý'
  },
  {
    id: 10,
    question: 'Kim cương - vật liệu cứng nhất trong tự nhiên - được cấu tạo từ nguyên tố nào?',
    options: ['Silic (Si)', 'Sắt (Fe)', 'Carbon (C)', 'Lưu huỳnh (S)'],
    correctIndex: 2,
    explanation: 'Kim cương là một dạng thù hình của Carbon dưới áp suất và nhiệt độ cực cao.',
    category: 'Hóa học',
    team: 'blue'
  }
];

export const STORAGE_KEY_RED = 'tug_of_war_red_questions_v2';
export const STORAGE_KEY_BLUE = 'tug_of_war_blue_questions_v2';

export function loadStoredQuestions(): { red: Question[]; blue: Question[] } {
  if (typeof window === 'undefined') {
    return { red: RED_QUESTIONS, blue: BLUE_QUESTIONS };
  }

  try {
    const rawRed = localStorage.getItem(STORAGE_KEY_RED);
    const rawBlue = localStorage.getItem(STORAGE_KEY_BLUE);

    let red = rawRed ? (JSON.parse(rawRed) as Question[]) : RED_QUESTIONS;
    let blue = rawBlue ? (JSON.parse(rawBlue) as Question[]) : BLUE_QUESTIONS;

    if (!Array.isArray(red) || red.length === 0) red = RED_QUESTIONS;
    if (!Array.isArray(blue) || blue.length === 0) blue = BLUE_QUESTIONS;

    return { red, blue };
  } catch (err) {
    console.error('Failed to load questions from storage:', err);
    return { red: RED_QUESTIONS, blue: BLUE_QUESTIONS };
  }
}

export function saveStoredQuestions(red: Question[], blue: Question[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_RED, JSON.stringify(red));
    localStorage.setItem(STORAGE_KEY_BLUE, JSON.stringify(blue));
  } catch (err) {
    console.error('Failed to save questions to storage:', err);
  }
}

export function resetStoredQuestions(): { red: Question[]; blue: Question[] } {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY_RED);
      localStorage.removeItem(STORAGE_KEY_BLUE);
    } catch (err) {
      console.error(err);
    }
  }
  return { red: [...RED_QUESTIONS], blue: [...BLUE_QUESTIONS] };
}
