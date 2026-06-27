/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Photographer, CommunityPost } from './types';

export const INITIAL_PHOTOGRAPHERS: Photographer[] = [
  {
    id: 'ph-1',
    name: '林木森 (Mosen)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    styles: ['日系', '森系', '清新', '自然光'],
    bio: '专注日系森系人像，追求自然真实的表情捕捉。擅长运用午后温暖的逆光，为你记录如同电影定格般的一瞬间。',
    rating: 4.9,
    completedJobs: 142,
    location: '上海 / 共青森林公园 / 世纪公园',
    pricePerSession: 899,
    cameraSetup: 'Fujifilm GFX 50S II / GF 80mm f/1.7',
    portfolio: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&h=500&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=500&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&h=500&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=500&q=80'
    ]
  },
  {
    id: 'ph-2',
    name: '张九龙 (Leon)',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&h=150&q=80',
    styles: ['港风', '胶片风', '复古', '夜景'],
    bio: '复古胶卷狂热追求者。常驻上海霓虹街头，用哈苏与Leica捕捉王家卫式的情绪港风和高对比度都市夜幕。',
    rating: 4.8,
    completedJobs: 98,
    location: '上海 / 乍浦路桥 / 黄河路 / 乍浦路',
    pricePerSession: 1200,
    cameraSetup: 'Leica M6 / Summicron 35mm f/2 / Portra 400',
    portfolio: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&h=500&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&h=500&q=80',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=400&h=500&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&h=500&q=80'
    ]
  },
  {
    id: 'ph-3',
    name: '艾利克斯 (CyberAlex)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80',
    styles: ['赛博朋克', '街拍', '国潮', '复古未来'],
    bio: '擅长合成霓虹美学、光影穿梭与极简未来感。致力于在赛博霓虹和经典国潮街头之间寻找视觉张力。',
    rating: 4.95,
    completedJobs: 165,
    location: '上海 / 陆家嘴 / 滨江大道 / 1933老场坊',
    pricePerSession: 1500,
    cameraSetup: 'Sony A7R V / FE 50mm f/1.2 GM',
    portfolio: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&h=500&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=500&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=500&q=80',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=400&h=500&q=80'
    ]
  },
  {
    id: 'ph-4',
    name: '苏晴子 (Sora)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    styles: ['韩系', '校园', 'Ins风', '温柔简约'],
    bio: '韩式奶油风与甜美校园的完美结合。擅长捕捉最灿烂、清透、温润的笑容，擅长打造治愈而高级的极简博主照片。',
    rating: 4.75,
    completedJobs: 110,
    location: '上海 / 武康路 / 复旦大学周边 / 思南公馆',
    pricePerSession: 799,
    cameraSetup: 'Canon EOS R5 / RF 50mm f/1.2 L',
    portfolio: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&h=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&h=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=800&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&h=800&q=80'
    ]
  }
];

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'p-1',
    authorName: '元气桃子',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    caption: '在世纪公园的夏日逆光人像！感谢 AI 推荐的“金色麦浪”拍摄方案 and 林木森老师的完美捕捉。下午4点的光线真的太温柔了！✨',
    likes: 245,
    hasLiked: false,
    styleTag: '日系',
    photographerName: '林木森 (Mosen)',
    comments: [
      { author: '小林同学', text: '原片直出吗？色彩太赞了！', date: '2026-06-25' },
      { author: '摄影师林木森', text: '多亏了AI生成的侧颜45度看树梢的姿势建议，拍摄效率极高！', date: '2026-06-25' }
    ],
    date: '2026-06-25'
  },
  {
    id: 'p-2',
    authorName: '霓虹浪人',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
    caption: '乍浦路桥下的雨夜红唇，经典复古港风！完全还原了AI分析给出的《花样年华》色彩基调建议。',
    likes: 512,
    hasLiked: true,
    styleTag: '港风',
    photographerName: '张九龙 (Leon)',
    comments: [
      { author: '王家卫粉丝', text: '非常有王导电影的张力和烟火气！', date: '2026-06-26' }
    ],
    date: '2026-06-26'
  },
  {
    id: 'p-3',
    authorName: 'Sora',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=800&q=80',
    caption: '武康路思南公馆一隅，极简温柔的Ins法式日常。穿一件简单的白衬衫，在阳光温暖的角落怎么拍都好看！🤍',
    likes: 189,
    hasLiked: false,
    styleTag: 'Ins风',
    photographerName: '苏晴子 (Sora)',
    comments: [],
    date: '2026-06-27'
  }
];

export const PRESET_SAMPLE_IMAGES = [
  {
    id: 's-1',
    name: '午后林间 (森系日杂)',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    description: '明亮自然、温柔绿意、淡淡逆光'
  },
  {
    id: 's-2',
    name: '霓虹街头 (胶片港风)',
    url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=600&q=80',
    description: '霓虹闪烁、红绿对比、强烈情绪'
  },
  {
    id: 's-3',
    name: '温柔午后 (奶油Ins风)',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    description: '暖白温柔、干净日常、韩风简约'
  },
  {
    id: 's-4',
    name: '废墟边缘 (赛博未来)',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    description: '冷酷硬核、极强对比、科幻街头'
  }
];
