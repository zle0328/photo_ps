import type { PhotoSpecification } from './types'

const bgPalette = ['#438fd8', '#ffffff', '#ff1717', '#63b6e9', '#979ba7', '#a8cff3', '#225c80']

export const specifications: PhotoSpecification[] = [
  { id: 'one-inch', name: '一寸', category: '常用', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, backgrounds: bgPalette, featured: true },
  { id: 'two-inch', name: '二寸', category: '常用', widthMm: 35, heightMm: 49, widthPx: 413, heightPx: 579, dpi: 300, backgrounds: bgPalette, featured: true },
  { id: 'small-one-inch', name: '小一寸', category: '常用', widthMm: 22, heightMm: 32, widthPx: 260, heightPx: 378, dpi: 300, backgrounds: bgPalette, featured: true },
  { id: 'small-two-inch', name: '小二寸', category: '常用', widthMm: 35, heightMm: 45, widthPx: 413, heightPx: 531, dpi: 300, backgrounds: bgPalette, featured: true },
  { id: 'big-one-inch', name: '大一寸', category: '常用', widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567, dpi: 300, backgrounds: bgPalette },
  { id: 'passport', name: '护照签证照', category: '签证', widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567, dpi: 300, backgrounds: ['#ffffff'] },
  { id: 'id-card', name: '身份证', category: '身份证', widthMm: 26, heightMm: 32, widthPx: 358, heightPx: 441, dpi: 350, backgrounds: ['#ffffff'] },
  { id: 'driver-license', name: '驾驶证', category: '驾驶证', widthMm: 22, heightMm: 32, widthPx: 260, heightPx: 378, dpi: 300, backgrounds: ['#ffffff'] },
  { id: 'computer-exam', name: '全国计算机等级考试', category: '考试', widthMm: 33, heightMm: 48, widthPx: 390, heightPx: 567, dpi: 300, minKb: 20, maxKb: 200, backgrounds: ['#63b6e9', '#438fd8', '#ffffff', '#ff1717'] },
  { id: 'cet', name: '四六级考试', category: '考试', widthMm: 33, heightMm: 48, widthPx: 240, heightPx: 320, dpi: 180, minKb: 20, maxKb: 200, backgrounds: ['#438fd8'] },
  { id: 'ntce', name: '教师资格证', category: '考试', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, maxKb: 200, backgrounds: ['#ffffff'] },
  { id: 'student-record', name: '学籍照片', category: '学籍', widthMm: 26, heightMm: 32, widthPx: 307, heightPx: 378, dpi: 300, backgrounds: ['#438fd8', '#ffffff', '#ff1717', '#63b6e9'] },
  { id: 'resume-photo', name: '简历照片', category: '简历照', widthMm: 25, heightMm: 35, widthPx: 295, heightPx: 413, dpi: 300, backgrounds: ['#438fd8', '#ffffff', '#ff1717', '#63b6e9'] },
]
