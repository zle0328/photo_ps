import type { PhotoSpecification } from '../types/photo'

export const backgroundPalette = ['#438fd8', '#ffffff', '#ff1717', '#63b6e9', '#979ba7', '#a8cff3', '#225c80']

export const categories = ['常用', '签证', '身份证', '社保卡', '医保证', '居住证', '驾驶证', '考试', '学籍', '简历照', '资格证']

export const specifications: PhotoSpecification[] = [
  { id: 'one-inch', name: '一寸', category: '常用', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, backgrounds: backgroundPalette, featured: true },
  { id: 'two-inch', name: '二寸', category: '常用', widthMm: 35, heightMm: 49, widthPx: 413, heightPx: 579, dpi: 300, backgrounds: backgroundPalette, featured: true },
  { id: 'small-one-inch', name: '小一寸', category: '常用', widthMm: 22, heightMm: 32, widthPx: 260, heightPx: 378, dpi: 300, backgrounds: backgroundPalette, featured: true },
  { id: 'small-two-inch', name: '小二寸', category: '常用', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531, dpi: 300, backgrounds: backgroundPalette, featured: true },
  { id: 'big-one-inch', name: '大一寸', category: '常用', widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567, dpi: 300, backgrounds: backgroundPalette },

  { id: 'passport', name: '护照签证照', category: '签证', widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567, dpi: 300, backgrounds: ['#ffffff'] },
  { id: 'hk-macau-pass', name: '港澳通行证', category: '签证', widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567, dpi: 300, backgrounds: ['#ffffff'] },
  { id: 'taiwan-pass', name: '台湾通行证', category: '签证', widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567, dpi: 300, backgrounds: ['#ffffff'] },
  { id: 'us-visa', name: '美国签证', category: '签证', widthMm: 51, heightMm: 51, widthPx: 600, heightPx: 600, dpi: 300, backgrounds: ['#ffffff'] },
  { id: 'japan-visa', name: '日本签证', category: '签证', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531, dpi: 300, backgrounds: ['#ffffff'] },

  { id: 'id-card', name: '身份证', category: '身份证', widthMm: 26, heightMm: 32, widthPx: 358, heightPx: 441, dpi: 350, backgrounds: ['#ffffff'] },

  { id: 'social-security', name: '社保卡', category: '社保卡', widthMm: 26, heightMm: 32, widthPx: 358, heightPx: 441, dpi: 350, backgrounds: ['#438fd8', '#ffffff'] },

  { id: 'medical-insurance', name: '医保证', category: '医保证', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, backgrounds: ['#438fd8', '#ffffff'] },

  { id: 'residence-permit', name: '居住证', category: '居住证', widthMm: 26, heightMm: 32, widthPx: 358, heightPx: 441, dpi: 350, backgrounds: ['#ffffff'] },

  { id: 'driver-license', name: '驾驶证', category: '驾驶证', widthMm: 22, heightMm: 32, widthPx: 260, heightPx: 378, dpi: 300, backgrounds: ['#ffffff'] },

  { id: 'computer-exam', name: '全国计算机等级考试', category: '考试', widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567, dpi: 300, minKb: 20, maxKb: 200, backgrounds: ['#63b6e9', '#438fd8', '#ffffff', '#ff1717'] },
  { id: 'cet', name: '四六级考试', category: '考试', widthMm: 33, heightMm: 48, widthPx: 240, heightPx: 320, dpi: 180, minKb: 20, maxKb: 200, backgrounds: ['#438fd8'] },
  { id: 'civil-service', name: '国考/公务员', category: '考试', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, minKb: 30, maxKb: 200, backgrounds: ['#438fd8', '#ffffff'] },
  { id: 'ntce', name: '教师资格证', category: '考试', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, maxKb: 200, backgrounds: ['#ffffff'] },
  { id: 'judicial-exam', name: '国家司法考试', category: '考试', widthMm: 33, heightMm: 48, widthPx: 413, heightPx: 626, dpi: 300, backgrounds: ['#438fd8', '#ffffff'] },

  { id: 'student-record', name: '学籍照片（307×378）', category: '学籍', widthMm: 26, heightMm: 32, widthPx: 307, heightPx: 378, dpi: 300, backgrounds: ['#438fd8', '#ffffff', '#ff1717', '#63b6e9'] },
  { id: 'student-photo-390', name: '学籍照片（390×480）', category: '学籍', widthMm: 33, heightMm: 41, widthPx: 390, heightPx: 480, dpi: 300, backgrounds: ['#438fd8'] },
  { id: 'student-photo-150', name: '学籍照片（150×200）', category: '学籍', widthMm: 13, heightMm: 17, widthPx: 150, heightPx: 200, dpi: 300, backgrounds: ['#438fd8'] },
  { id: 'student-photo-90', name: '学籍照片（90×120）', category: '学籍', widthMm: 8, heightMm: 10, widthPx: 90, heightPx: 120, dpi: 300, backgrounds: ['#438fd8', '#ffffff', '#ff1717'] },
  { id: 'student-info', name: '大学生图像信息采集', category: '学籍', widthMm: 41, heightMm: 54, widthPx: 480, heightPx: 640, dpi: 300, backgrounds: ['#438fd8', '#ffffff'] },

  { id: 'resume-photo', name: '简历照片证件照', category: '简历照', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, backgrounds: ['#438fd8', '#ffffff', '#ff1717', '#63b6e9'] },

  { id: 'teacher-cert', name: '教师资格证认定', category: '资格证', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, maxKb: 200, backgrounds: ['#ffffff'] },
  { id: 'accounting-cert', name: '会计从业资格证', category: '资格证', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, backgrounds: ['#438fd8', '#ffffff'] },
  { id: 'health-cert', name: '健康证', category: '资格证', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, backgrounds: ['#438fd8', '#ffffff'] },
  { id: 'tour-guide', name: '导游证', category: '资格证', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, backgrounds: ['#438fd8', '#ffffff'] },
]

export const findSpecification = (id: string) => specifications.find((item) => item.id === id) ?? specifications[0]
