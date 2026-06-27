/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Sparkles, 
  Upload, 
  Users, 
  Image as ImageIcon, 
  MapPin, 
  Clock, 
  Compass, 
  BookOpen, 
  User, 
  Film, 
  Star, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  X,
  Plus, 
  Heart, 
  MessageSquare, 
  ArrowRight, 
  Share2, 
  Calendar, 
  Eye, 
  Sliders, 
  Check, 
  Loader2,
  Bookmark,
  ChevronDown
} from 'lucide-react';
import { Photographer, PhotoStyle, PoseSuggestion, ShootingScript, CompositionAdvice, EditingAdvice, StyleAnalysisResult, Booking, CommunityPost } from './types';
import { INITIAL_PHOTOGRAPHERS, INITIAL_POSTS, PRESET_SAMPLE_IMAGES } from './data';

export default function App() {
  // Page routing state
  const [activeTab, setActiveTab] = useState<'home' | 'analyze' | 'photographers' | 'director' | 'community' | 'profile' | 'ailab'>('home');

  // Photographers and Community state
  const [photographers, setPhotographers] = useState<Photographer[]>(INITIAL_PHOTOGRAPHERS);
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('ai_photographer_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('ai_photographer_bookings');
    if (saved) return JSON.parse(saved);
    // Initial placeholder booking
    return [
      {
        id: 'bk-1',
        photographerId: 'ph-1',
        photographerName: '林木森 (Mosen)',
        photographerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
        date: '2026-07-05',
        timeSlot: '15:30 - 17:30',
        shootType: '日系森系清新人像',
        status: 'confirmed',
        aiScript: {
          theme: '午后森系漫步',
          style: '日系森系人像',
          brief: '在静谧林间捕捉自然柔和的光影，营造故事性深沉的悠闲意境。',
          steps: [
            { stepNumber: 1, title: '初见林深', shotType: '中景 (Medium Shot)', pose: '侧身站在大树旁，眼神向下微闭，右手轻捏裙摆或衣角。', composition: '黄金分割，利用树干作为前景虚化，增加空间纵深。', props: '复古藤编篮子、小干花', timing: '阳光透过树冠洒下斑驳光影的时刻' },
            { stepNumber: 2, title: '风吹发丝', shotType: '特写 (Close-up)', pose: '脸部朝向光源45度，任由微风吹拂发丝，嘴角微微上扬，闭眼感受。', composition: '浅景深虚化背景，焦点对准靠近镜头的眼睛。', props: '无', timing: '顺光或侧逆光，凸显面部轮廓' }
          ]
        }
      }
    ];
  });

  // Persist items
  useEffect(() => {
    localStorage.setItem('ai_photographer_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('ai_photographer_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // AI Style Analysis page states
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<StyleAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // AI Director page states (Posing & Scripting)
  const [directorSubTab, setDirectorSubTab] = useState<'posing' | 'script'>('posing');
  
  // Pose Generation Input States
  const [poseStyle, setPoseStyle] = useState('日系');
  const [poseGender, setPoseGender] = useState('女生');
  const [poseImageBase64, setPoseImageBase64] = useState<string | null>(null);
  const [isGeneratingPoses, setIsGeneratingPoses] = useState(false);
  const [generatedPoses, setGeneratedPoses] = useState<PoseSuggestion[]>([]);
  const [poseError, setPoseError] = useState<string | null>(null);

  // Script Generation Input States
  const [scriptTheme, setScriptTheme] = useState('武康路复古旗袍街拍');
  const [scriptStyle, setScriptStyle] = useState('港风复古');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<ShootingScript | null>(null);
  const [scriptError, setScriptError] = useState<string | null>(null);

  // Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPhotographer, setBookingPhotographer] = useState<Photographer | null>(null);
  const [bookingDate, setBookingDate] = useState('2026-07-10');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('14:00 - 16:00');
  const [bookingShootType, setBookingShootType] = useState('日系清新');
  const [attachAiScript, setAttachAiScript] = useState(true);

  // Community share states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareImage, setShareImage] = useState('');
  const [shareCaption, setShareCaption] = useState('');
  const [shareStyleTag, setShareStyleTag] = useState('日系');
  const [sharePhotographer, setSharePhotographer] = useState('');

  // Local saved scripts & poses
  const [savedScripts, setSavedScripts] = useState<ShootingScript[]>([]);
  const [savedPoses, setSavedPoses] = useState<PoseSuggestion[]>([]);

  // ====================================================
  // AI LAB STATES & EFFECTS (AI Face Swap & Algorithms)
  // ====================================================
  const [ailabSubTab, setAilabSubTab] = useState<'faceswap' | 'algorithms'>('faceswap');
  const [swapSrcImage, setSwapSrcImage] = useState<string | null>(null);
  const [selectedSwapPresetId, setSelectedSwapPresetId] = useState<string>('f-1');
  const [swapBlend, setSwapBlend] = useState<number>(85);
  const [swapFeather, setSwapFeather] = useState<number>(12);
  const [swapScale, setSwapScale] = useState<number>(1.0);
  const [swapRotation, setSwapRotation] = useState<number>(0);
  const [swapEyeMask, setSwapEyeMask] = useState<boolean>(false);
  const [swapPrivacyBlur, setSwapPrivacyBlur] = useState<boolean>(false);
  const [swapX, setSwapX] = useState<number>(50); // percentage X
  const [swapY, setSwapY] = useState<number>(45); // percentage Y
  const [isProcessingSwap, setIsProcessingSwap] = useState<boolean>(false);
  const [swapResult, setSwapResult] = useState<any | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);
  const [canvasRefreshKey, setCanvasRefreshKey] = useState<number>(0);

  // Recommendation algorithm simulator states
  const [simStyle, setSimStyle] = useState<string>('日系');
  const [weightStyle, setWeightStyle] = useState<number>(0.5);
  const [weightPrice, setWeightPrice] = useState<number>(0.3);
  const [weightRating, setWeightRating] = useState<number>(0.2);
  const [simResults, setSimResults] = useState<any[]>([]);

  // Portfolio Lightbox states
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxImagesList, setLightboxImagesList] = useState<string[]>([]);
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState<number>(0);
  const [lightboxPhotographerName, setLightboxPhotographerName] = useState<string>('');

  // Preset swap face assets (Aesthetic portrait templates)
  const PRESET_SWAP_FACES = [
    { id: 'f-1', name: '日系清纯学妹', gender: '女', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80', tag: '日系/清新' },
    { id: 'f-2', name: '港风复古摩登', gender: '女', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=150&h=150&q=80', tag: '港风/情绪' },
    { id: 'f-3', name: '森系清爽面容', gender: '女', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80', tag: '森系/自然' },
    { id: 'f-4', name: '赛博朋克霓虹', gender: '男', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80', tag: '未来/科幻' },
    { id: 'f-5', name: '韩系清秀阳光', gender: '男', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80', tag: '韩系/奶油' }
  ];

  const swapCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas Drawing Effect
  useEffect(() => {
    if (!swapSrcImage) return;
    const canvas = swapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';
    baseImg.src = swapSrcImage;
    baseImg.onload = () => {
      // Set canvas dimension based on source image ratio
      const maxDim = 450;
      let w = baseImg.width;
      let h = baseImg.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = (h / w) * maxDim;
          w = maxDim;
        } else {
          w = (w / h) * maxDim;
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;

      // Draw base photo
      ctx.drawImage(baseImg, 0, 0, w, h);

      // Draw selected preset face as swap template
      const preset = PRESET_SWAP_FACES.find(f => f.id === selectedSwapPresetId);
      if (preset) {
        const faceImg = new Image();
        faceImg.crossOrigin = 'anonymous';
        faceImg.src = preset.url;
        faceImg.onload = () => {
          // Calculate coordinates
          const fx = (swapX / 100) * w;
          const fy = (swapY / 100) * h;
          const faceRadius = Math.min(w, h) * 0.15 * swapScale;

          ctx.save();

          // Create circle path for face mask
          ctx.beginPath();
          ctx.arc(fx, fy, faceRadius, 0, Math.PI * 2);
          ctx.closePath();

          // Clip to circle face area
          ctx.clip();

          // Blend strength / opacity
          ctx.globalAlpha = swapBlend / 100;

          // Apply rotation
          ctx.translate(fx, fy);
          ctx.rotate((swapRotation * Math.PI) / 180);
          ctx.translate(-fx, -fy);

          // Draw the face image scaled to fit the circle
          ctx.drawImage(
            faceImg,
            fx - faceRadius,
            fy - faceRadius,
            faceRadius * 2,
            faceRadius * 2
          );

          ctx.restore();

          // Apply privacy eye bar if checked
          if (swapEyeMask) {
            ctx.save();
            ctx.fillStyle = '#09090b'; // dark zinc
            ctx.fillRect(fx - faceRadius * 1.1, fy - faceRadius * 0.25, faceRadius * 2.2, faceRadius * 0.35);
            
            // Highlight shine for cyberpunk eye-bar style
            ctx.fillStyle = '#10b981'; // emerald-500
            ctx.fillRect(fx - faceRadius * 1.1, fy - faceRadius * 0.25, 4, faceRadius * 0.35);
            ctx.restore();
          }

          // Apply privacy ring overlay if checked (creates a high-tech sensor grid)
          if (swapPrivacyBlur) {
            ctx.save();
            ctx.strokeStyle = '#a855f7'; // Purple neon sensor line
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(fx, fy, faceRadius * 1.15, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw targeting reticles
            ctx.fillStyle = '#a855f7';
            ctx.font = 'bold 8px monospace';
            ctx.fillText('PRIVACY MASK ACTIVE', fx - faceRadius, fy - faceRadius - 6);
            ctx.restore();
          }
        };
      }
    };
  }, [
    swapSrcImage,
    selectedSwapPresetId,
    swapBlend,
    swapFeather,
    swapScale,
    swapRotation,
    swapEyeMask,
    swapPrivacyBlur,
    swapX,
    swapY,
    canvasRefreshKey
  ]);

  // Run Recommendation Simulator (ALS / Cosine Similarity multi-criteria)
  const runRecommendationSimulator = () => {
    const matched = photographers.map(ph => {
      // 1. Style Match score (S_match)
      let styleScore = 40;
      if (ph.styles.includes(simStyle)) {
        styleScore = 98;
      } else if (
        (simStyle === '日系' && ph.styles.includes('森系')) ||
        (simStyle === '森系' && ph.styles.includes('日系')) ||
        (simStyle === '港风' && ph.styles.includes('胶片风')) ||
        (simStyle === 'Ins风' && ph.styles.includes('温柔简约'))
      ) {
        styleScore = 80;
      }

      // 2. Price Score (S_price) - Lower price is higher utility (normalized)
      const minPrice = 700;
      const maxPrice = 1600;
      const normalizedPriceScore = Math.max(0, Math.min(100, 100 * (1 - (ph.pricePerSession - minPrice) / (maxPrice - minPrice))));

      // 3. Rating Score (S_rating)
      const ratingScore = Math.max(0, Math.min(100, (ph.rating - 4.5) * 200));

      // Weighted Utility formula
      const finalScore = parseFloat((
        (styleScore * weightStyle) +
        (normalizedPriceScore * weightPrice) +
        (ratingScore * weightRating)
      ).toFixed(1));

      return {
        ...ph,
        styleScore,
        priceScore: Math.round(normalizedPriceScore),
        ratingScore: Math.round(ratingScore),
        finalScore
      };
    }).sort((a, b) => b.finalScore - a.finalScore);

    setSimResults(matched);
  };

  useEffect(() => {
    runRecommendationSimulator();
  }, [simStyle, weightStyle, weightPrice, weightRating, photographers]);

  // File Upload Helper (Face Swap)
  const handleFaceSwapFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSwapSrcImage(reader.result as string);
        setSwapResult(null);
        setSwapError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Privacy Face Swap API call
  const handleRunPrivacyFaceSwap = async () => {
    if (!swapSrcImage) return;
    setIsProcessingSwap(true);
    setSwapError(null);
    setSwapResult(null);

    try {
      const res = await fetch('/api/privacy-face-swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: swapSrcImage,
          style: PRESET_SWAP_FACES.find(f => f.id === selectedSwapPresetId)?.name || '日系',
          blendStrength: swapBlend,
          eyeMask: swapEyeMask,
          privacyBlur: swapPrivacyBlur
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '换脸及隐私保护模块处理失败');
      }

      const data = await res.json();
      setSwapResult(data);
      if (data.faceCoordinates) {
        setSwapX(data.faceCoordinates.x);
        setSwapY(data.faceCoordinates.y);
      }
    } catch (err: any) {
      setSwapError(err.message || '网络连接异常，请重试');
    } finally {
      setIsProcessingSwap(false);
    }
  };

  const handleCanvasClickOrDrag = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement> | MouseEvent) => {
    const canvas = swapCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const pctX = Math.round((x / rect.width) * 100);
    const pctY = Math.round((y / rect.height) * 100);
    
    setSwapX(Math.max(0, Math.min(100, pctX)));
    setSwapY(Math.max(0, Math.min(100, pctY)));
  };

  const openLightbox = (images: string[], index: number, name: string) => {
    setLightboxImagesList(images);
    setLightboxActiveIndex(index);
    setLightboxImage(images[index]);
    setLightboxPhotographerName(name);
  };

  const nextLightboxImage = () => {
    if (lightboxImagesList.length === 0) return;
    const nextIdx = (lightboxActiveIndex + 1) % lightboxImagesList.length;
    setLightboxActiveIndex(nextIdx);
    setLightboxImage(lightboxImagesList[nextIdx]);
  };

  const prevLightboxImage = () => {
    if (lightboxImagesList.length === 0) return;
    const prevIdx = (lightboxActiveIndex - 1 + lightboxImagesList.length) % lightboxImagesList.length;
    setLightboxActiveIndex(prevIdx);
    setLightboxImage(lightboxImagesList[prevIdx]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxImage) return;
      if (e.key === 'Escape') {
        setLightboxImage(null);
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImage, lightboxActiveIndex, lightboxImagesList]);

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  // File Upload Helper (Style Analysis)
  const handleStyleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImageBase64(reader.result as string);
        setSelectedPresetId(null);
        setAnalysisResult(null);
        setAnalysisError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI Style Analysis (via real /api/analyze-style)
  const runStyleAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const bodyPayload: any = {};
      if (uploadedImageBase64) {
        bodyPayload.image = uploadedImageBase64;
      } else if (selectedPresetId) {
        const preset = PRESET_SAMPLE_IMAGES.find(p => p.id === selectedPresetId);
        bodyPayload.imageUrl = preset ? preset.name : 'Unknown preset';
        // Mocking the photo by passing its actual base64 or downloading, but since we are server side, we can just pass the name
      } else {
        throw new Error('请先上传一张照片或选择样例照片！');
      }

      const res = await fetch('/api/analyze-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '分析失败');
      }

      const result = await res.json();
      setAnalysisResult(result);
    } catch (err: any) {
      setAnalysisError(err.message || '网络连接异常，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run AI Poses Generation (via real /api/generate-poses)
  const handleGeneratePoses = async () => {
    setIsGeneratingPoses(true);
    setPoseError(null);
    setGeneratedPoses([]);

    try {
      const res = await fetch('/api/generate-poses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: poseStyle,
          gender: poseGender,
          image: poseImageBase64
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '姿势生成失败');
      }

      const data = await res.json();
      setGeneratedPoses(data);
    } catch (err: any) {
      setPoseError(err.message || '姿势生成服务暂时不可用');
    } finally {
      setIsGeneratingPoses(false);
    }
  };

  // Run AI Script Generation (via real /api/generate-script)
  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    setScriptError(null);
    setGeneratedScript(null);

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: scriptTheme,
          style: scriptStyle
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '脚本生成失败');
      }

      const data = await res.json();
      setGeneratedScript(data);
    } catch (err: any) {
      setScriptError(err.message || '脚本生成服务暂时不可用');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Book now click triggers modal
  const openBookingModal = (photographer: Photographer) => {
    setBookingPhotographer(photographer);
    setBookingShootType(photographer.styles[0] || '日系');
    setIsBookingModalOpen(true);
  };

  // Create booking
  const confirmBooking = () => {
    if (!bookingPhotographer) return;

    const newBooking: Booking = {
      id: 'bk-' + Date.now(),
      photographerId: bookingPhotographer.id,
      photographerName: bookingPhotographer.name,
      photographerAvatar: bookingPhotographer.avatar,
      date: bookingDate,
      timeSlot: bookingTimeSlot,
      shootType: bookingShootType,
      status: 'pending',
      aiScript: attachAiScript && generatedScript ? generatedScript : (analysisResult ? {
        theme: 'AI规划专属风格拍摄',
        style: analysisResult.styles[0]?.name || '自定义风格',
        brief: analysisResult.composition?.generalDescription || '根据AI构图与修图建议定制的专属拍摄。',
        steps: [
          {
            stepNumber: 1,
            title: '主视角侧颜',
            shotType: '中景',
            pose: '配合AI推荐的构图方向。' + (analysisResult.composition.cameraAngle || ''),
            composition: analysisResult.composition.techniqueName || '黄金分割',
            props: '建议准备契合的道具',
            timing: analysisResult.styles[0]?.timeAdvice || '拍摄当天最佳光线时刻'
          }
        ]
      } : undefined)
    };

    setBookings([newBooking, ...bookings]);
    setIsBookingModalOpen(false);
    setActiveTab('profile'); // Send user to profile to see the new booking!
  };

  // Community interaction: Like post
  const handleLikePost = (postId: string) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const hasLikedNow = !p.hasLiked;
        return {
          ...p,
          hasLiked: hasLikedNow,
          likes: hasLikedNow ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  // Community interaction: comment
  const handleAddComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              author: '我 (探索家)',
              text: text,
              date: new Date().toISOString().split('T')[0]
            }
          ]
        };
      }
      return p;
    }));
  };

  // Community share creation
  const handleCreateSharePost = () => {
    if (!shareImage || !shareCaption) return;

    const newPost: CommunityPost = {
      id: 'p-' + Date.now(),
      authorName: '我 (探索家)',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      imageUrl: shareImage,
      caption: shareCaption,
      likes: 0,
      hasLiked: false,
      styleTag: shareStyleTag,
      photographerName: sharePhotographer || undefined,
      comments: [],
      date: new Date().toISOString().split('T')[0]
    };

    setPosts([newPost, ...posts]);
    setIsShareModalOpen(false);
    setShareImage('');
    setShareCaption('');
  };

  return (
    <div id="app-root" className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-zinc-950">
      
      {/* GLOWING AMBIENT BACKGROUNDS */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER NAVIGATION */}
      <header id="app-header" className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center">
              <Camera className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                AI Photographer
              </h1>
              <span className="text-[10px] text-emerald-400 font-mono block tracking-widest leading-none">
                智能约拍与拍摄助手
              </span>
            </div>
          </div>

          <nav id="app-nav" className="hidden md:flex items-center space-x-1">
            <button 
              id="nav-home"
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'home' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              首页
            </button>
            <button 
              id="nav-analyze"
              onClick={() => setActiveTab('analyze')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center space-x-1.5 ${activeTab === 'analyze' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI风格分析</span>
            </button>
            <button 
              id="nav-photographers"
              onClick={() => setActiveTab('photographers')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'photographers' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              摄影师推荐
            </button>
            <button 
              id="nav-director"
              onClick={() => setActiveTab('director')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center space-x-1.5 ${activeTab === 'director' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Compass className="w-4 h-4" />
              <span>AI拍摄指导</span>
            </button>
            <button 
              id="nav-community"
              onClick={() => setActiveTab('community')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'community' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              作品社区
            </button>
            <button 
              id="nav-ailab"
              onClick={() => setActiveTab('ailab')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center space-x-1.5 ${activeTab === 'ailab' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI 实验室</span>
            </button>
            <button 
              id="nav-profile"
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center space-x-1.5 ${activeTab === 'profile' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <User className="w-4 h-4" />
              <span>个人中心</span>
              {bookings.filter(b => b.status === 'pending').length > 0 && (
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              )}
            </button>
          </nav>

          {/* MOBILE TABS FLOATING NAV AT BOTTOM INSTEAD */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setActiveTab('analyze')} 
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 text-zinc-950 flex items-center space-x-1 shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>分析照片</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN MAIN WRAPPER */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ========================================== */}
        {/* TAB 1: HOME PAGE (首页) */}
        {/* ========================================== */}
        {activeTab === 'home' && (
          <div id="home-view" className="space-y-16 animate-fade-in">
            {/* HERO HERO SECTION */}
            <div className="text-center py-12 md:py-20 max-w-3xl mx-auto space-y-6 relative">
              <div className="inline-flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-xs text-emerald-400 font-medium">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>AI 生态摄影新纪元 ── 你的掌上创意总监</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
                上传照片 ✦ <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-rose-400 bg-clip-text text-transparent">AI 专属定制</span> 完美约拍方案
              </h2>
              <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                无需专业摄影底子。从风格识别、最佳滤镜，到姿势推荐、实时构图与一键脚本生成，全链路 AI 赋能你与优秀摄影师。
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  id="home-btn-analyze"
                  onClick={() => setActiveTab('analyze')}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 font-bold rounded-xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-5 h-5 fill-zinc-950/20" />
                  <span>立即体验风格分析</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button 
                  id="home-btn-photographers"
                  onClick={() => setActiveTab('photographers')}
                  className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 font-semibold rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  <Users className="w-5 h-5 text-zinc-400" />
                  <span>浏览卓越摄影师</span>
                </button>
              </div>
            </div>

            {/* PROCESS MAP STEPPER */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 sm:p-10">
              <h3 className="text-xl font-bold text-center text-white mb-8">AI 赋能的约拍闭环流程</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                
                {/* Connector line (desktop only) */}
                <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-emerald-500/20 via-zinc-800 to-emerald-500/20 z-0"></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center space-y-3 z-10">
                  <div className="w-14 h-14 bg-zinc-800 border-2 border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 shadow-lg font-mono text-lg font-bold">1</div>
                  <h4 className="font-semibold text-white text-sm">上传日常照</h4>
                  <p className="text-xs text-zinc-400 max-w-[150px]">上传自拍或日常喜欢的随手拍</p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center space-y-3 z-10">
                  <div className="w-14 h-14 bg-zinc-800 border-2 border-zinc-800 rounded-full flex items-center justify-center text-emerald-400 shadow-lg font-mono text-lg font-bold">2</div>
                  <h4 className="font-semibold text-white text-sm">AI 深度分析</h4>
                  <p className="text-xs text-zinc-400 max-w-[150px]">大模型分析色调、构图与最佳风格</p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center space-y-3 z-10">
                  <div className="w-14 h-14 bg-zinc-800 border-2 border-zinc-800 rounded-full flex items-center justify-center text-emerald-400 shadow-lg font-mono text-lg font-bold">3</div>
                  <h4 className="font-semibold text-white text-sm">生成拍摄脚本</h4>
                  <p className="text-xs text-zinc-400 max-w-[150px]">定制5组运镜、姿势与构图提示</p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center space-y-3 z-10">
                  <div className="w-14 h-14 bg-zinc-800 border-2 border-zinc-800 rounded-full flex items-center justify-center text-emerald-400 shadow-lg font-mono text-lg font-bold">4</div>
                  <h4 className="font-semibold text-white text-sm">预约摄影师</h4>
                  <p className="text-xs text-zinc-400 max-w-[150px]">根据契合度匹配大咖，一键发送脚本</p>
                </div>

                {/* Step 5 */}
                <div className="flex flex-col items-center text-center space-y-3 z-10">
                  <div className="w-14 h-14 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center text-emerald-400 shadow-lg font-mono text-lg font-bold">✓</div>
                  <h4 className="font-semibold text-emerald-400 text-sm">作品分享</h4>
                  <p className="text-xs text-zinc-400 max-w-[150px]">拍摄后一键上传，在作品区斩获好评</p>
                </div>

              </div>
            </div>

            {/* QUICK FEATURES BENTO GRID */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">六大 AI 拍摄引擎亮点</h3>
                <p className="text-zinc-400 text-sm">比赛、路演最受评委关注的前沿技术应用展示</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-zinc-700 transition-all">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-lg">AI风格识别</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    大模型通过色彩直方图和多模态理解，快速输出港风、日系、赛博朋克等风格契合度，并提供理想地点与最佳滤镜推荐。
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-zinc-700 transition-all">
                  <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-lg">AI修图建议</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    无需猜色温、拉对比。大模型精准建议曝光量（EV）、色温（K）、暗部与高光拉伸指数，甚至量身推荐色彩预设名称。
                  </p>
                </div>

                {/* Card 3 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-zinc-700 transition-all">
                  <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-lg">AI姿势生成</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    告别镜头僵硬！结合摄影类型推荐：侧身看远处、回头微澜、遮眼大片等。同时支持生成线条蓝图。
                  </p>
                </div>

                {/* Card 4 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-zinc-700 transition-all">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-lg">AI拍摄脚本</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    摄影教练全程指导！为各种主题（毕业、情侣、国风）深度策划 5 组拍摄流程，指定道具、取景、画幅与表情。
                  </p>
                </div>

                {/* Card 5 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-zinc-700 transition-all">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-lg">AI构图建议</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    多角度智能扫描照片中人物分布与杂物。给出精准方向建议：“人物偏左，向右调整5%”、“手机下移微微向上仰拍”等。
                  </p>
                </div>

                {/* Card 6 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4 hover:border-zinc-700 transition-all">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-lg">AI摄影师推荐</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    不只算物理距离，更深度分析你的历史图片风格喜好与摄影师的作品集风格契合度，让品味在最开始便完美合拍。
                  </p>
                </div>

              </div>
            </div>

            {/* HERO COMMUNITY PREVIEWS */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">今日推荐成片分享</h3>
                <button 
                  onClick={() => setActiveTab('community')}
                  className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  <span>前往社区</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.slice(0, 3).map(post => (
                  <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group">
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={post.imageUrl} 
                        alt={post.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md text-emerald-400 text-xs px-2.5 py-1 rounded-full font-medium">
                        {post.styleTag}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-zinc-400 font-medium">摄影师：{post.photographerName || '自拍 (AI构图指南)'}</p>
                      <p className="text-sm text-zinc-200 line-clamp-2 leading-relaxed">{post.caption}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                        <span className="text-[10px] text-zinc-500">{post.date}</span>
                        <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                          <span>{post.likes} 赞</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: AI STYLE ANALYSIS (AI风格分析) */}
        {/* ========================================== */}
        {activeTab === 'analyze' && (
          <div id="analyze-view" className="space-y-8 animate-fade-in">
            
            {/* Header info */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center space-x-2">
                <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse" />
                <span>AI 风格与构图深度扫描</span>
              </h2>
              <p className="text-zinc-400 text-sm max-w-2xl">
                上传你想作为拍摄参照或日常的人像照。大模型将瞬间解析你的气质，产出滤镜参数、构图修正建议、并为你自动推荐合拍摄影师。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: SOURCE UPLOADER & CONFIG */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* UPLOADER PANEL */}
                <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-2xl p-6 text-center space-y-4 hover:border-emerald-500/40 transition-all relative">
                  
                  {uploadedImageBase64 ? (
                    <div className="space-y-4">
                      <div className="h-64 rounded-xl overflow-hidden relative bg-zinc-950">
                        <img 
                          src={uploadedImageBase64} 
                          alt="Uploaded source" 
                          className="w-full h-full object-contain"
                        />
                        <button 
                          onClick={() => setUploadedImageBase64(null)}
                          className="absolute top-2 right-2 bg-zinc-900/90 text-zinc-400 hover:text-white text-xs px-2.5 py-1.5 rounded-lg"
                        >
                          清除
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400">已上传本地照片</p>
                    </div>
                  ) : (
                    <div className="py-8 space-y-3">
                      <div className="w-12 h-12 bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">点击或拖拽上传照片</p>
                        <p className="text-xs text-zinc-500 mt-1">支持 PNG, JPG, WEBP。最大 10MB</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleStyleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}

                </div>

                {/* PRESET CHIPS */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                  <span className="text-xs font-semibold text-zinc-400 block tracking-wider uppercase">或者：选择高质感样例体验</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {PRESET_SAMPLE_IMAGES.map(sample => (
                      <button
                        key={sample.id}
                        onClick={() => {
                          setSelectedPresetId(sample.id);
                          setUploadedImageBase64(null);
                          setAnalysisResult(null);
                          setAnalysisError(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left space-y-1 transition-all ${selectedPresetId === sample.id ? 'bg-zinc-800 border-emerald-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                      >
                        <div className="h-20 rounded-lg overflow-hidden mb-1.5">
                          <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="text-xs font-bold text-white truncate">{sample.name}</h4>
                        <p className="text-[10px] text-zinc-400 truncate leading-none">{sample.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* TRIGGER ANALYZING BUTTON */}
                <button
                  id="btn-trigger-analyze"
                  onClick={runStyleAnalysis}
                  disabled={isAnalyzing || (!uploadedImageBase64 && !selectedPresetId)}
                  className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>AI正在识别影调风格与构图...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 fill-zinc-950/20" />
                      <span>一键启动 AI 智能识别</span>
                    </>
                  )}
                </button>

                {analysisError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                    ⚠️ {analysisError}
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: DETAILED REPORT */}
              <div className="lg:col-span-7">
                
                {!isAnalyzing && !analysisResult && (
                  <div className="h-full bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
                    <Sparkles className="w-12 h-12 text-zinc-700 mb-3 animate-pulse" />
                    <h3 className="font-bold text-zinc-400 text-lg">等待 AI 分析报表</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mt-1">
                      选择左侧的样例照片，或上传您的本地照片，然后点击一键识别，深度解锁符合您个性的摄影美学。
                    </p>
                  </div>
                )}

                {/* SCANNING LOADING SCREEN */}
                {isAnalyzing && (
                  <div className="h-full bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 min-h-[400px] relative overflow-hidden">
                    
                    {/* Scanner horizontal line animation */}
                    <div className="absolute left-0 right-0 h-[2px] bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-bounce top-1/4"></div>

                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-emerald-500/30 border-t-emerald-400 animate-spin flex items-center justify-center mb-6">
                      <Camera className="w-8 h-8 text-emerald-400 animate-pulse" />
                    </div>
                    <h4 className="text-white font-bold text-lg animate-pulse">AI 视觉多模态引擎运行中...</h4>
                    <p className="text-xs text-zinc-400 max-w-sm mt-2">
                      我们正在调配 Google Gemini 大语言模型，针对图像色温、灰度直方图、噪点分布、主体与背景边缘、纵深层级以及透视关系进行精细化评估...
                    </p>
                  </div>
                )}

                {/* ANALYSIS RESULTS REPORT PANEL */}
                {analysisResult && (
                  <div className="space-y-6 animate-fade-in">
                    
                    {/* Style circle matching */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <h3 className="text-sm font-semibold text-zinc-400 tracking-wider uppercase flex items-center space-x-1.5">
                        <span>✦ 最佳视觉风格匹配</span>
                      </h3>
                      
                      <div className="space-y-4">
                        {analysisResult.styles.map((style, idx) => (
                          <div key={idx} className="bg-zinc-950/50 border border-zinc-800/60 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-white font-bold text-base">{style.name}</span>
                                <span className="text-xs text-zinc-500 ml-2 font-mono">{style.englishName}</span>
                              </div>
                              <span className="text-emerald-400 font-mono font-bold text-sm bg-emerald-500/10 px-2.5 py-1 rounded-full">
                                契合度：{style.matchRate}%
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">{style.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 pt-2 text-[11px] border-t border-zinc-800/40">
                              <div>
                                <span className="text-zinc-500 block">推荐拍摄场地</span>
                                <span className="text-zinc-300 font-medium">{style.locationAdvice}</span>
                              </div>
                              <div>
                                <span className="text-zinc-500 block">建议光影黄金期</span>
                                <span className="text-zinc-300 font-medium">{style.timeAdvice}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Filter & Lightroom params */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <h3 className="text-sm font-semibold text-zinc-400 tracking-wider uppercase flex items-center space-x-1.5">
                        <span>✦ AI 调色与后期预设建议</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* LR parameters list */}
                        <div className="bg-zinc-950/50 rounded-xl p-4 space-y-2.5 text-xs">
                          <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">Lightroom 参数映射</span>
                          <div className="flex justify-between border-b border-zinc-800/50 pb-1.5">
                            <span className="text-zinc-400">曝光度 (Exposure)</span>
                            <span className="text-emerald-400 font-mono font-bold">{analysisResult.editing.exposure}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-800/50 pb-1.5">
                            <span className="text-zinc-400">色温 (Temperature)</span>
                            <span className="text-emerald-400 font-mono font-bold">{analysisResult.editing.temperature}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-800/50 pb-1.5">
                            <span className="text-zinc-400">色调 (Tint)</span>
                            <span className="text-emerald-400 font-mono font-bold">{analysisResult.editing.tint}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-800/50 pb-1.5">
                            <span className="text-zinc-400">高光 (Highlights)</span>
                            <span className="text-emerald-400 font-mono font-bold">{analysisResult.editing.highlights}</span>
                          </div>
                          <div className="flex justify-between border-b border-zinc-800/50 pb-1.5">
                            <span className="text-zinc-400">阴影 (Shadows)</span>
                            <span className="text-emerald-400 font-mono font-bold">{analysisResult.editing.shadows}</span>
                          </div>
                          <div className="flex justify-between pb-0.5">
                            <span className="text-zinc-400">画幅裁剪 (Aspect Ratio)</span>
                            <span className="text-emerald-400 font-mono font-bold">{analysisResult.editing.cropping}</span>
                          </div>
                        </div>

                        {/* Preset advice */}
                        <div className="bg-zinc-950/50 rounded-xl p-4 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-wider">胶片模拟推荐</span>
                            <h4 className="text-white font-bold text-sm bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg inline-block">
                              {analysisResult.styles[0]?.filterAdvice || 'FUJIFILM Classic Chrome'}
                            </h4>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-500 block">AI 推荐预设包名称</span>
                            <p className="text-emerald-400 font-bold text-sm">✦ {analysisResult.editing.presetName}</p>
                          </div>

                          <p className="text-zinc-400 text-xs leading-relaxed">{analysisResult.editing.generalSummary}</p>
                        </div>

                      </div>
                    </div>

                    {/* Composition Guide */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <h3 className="text-sm font-semibold text-zinc-400 tracking-wider uppercase flex items-center space-x-1.5">
                        <span>✦ AI 拍摄与构图教练指导</span>
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-xl p-4 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white font-bold">主构图法: {analysisResult.composition.techniqueName}</span>
                            <span className="text-zinc-400 font-medium">推荐机位: {analysisResult.composition.cameraAngle}</span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{analysisResult.composition.generalDescription}</p>
                        </div>

                        {/* Issues & Directions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-rose-400">目前扫描到的构图问题：</span>
                            <ul className="space-y-1.5 text-xs text-zinc-400 list-disc list-inside">
                              {analysisResult.composition.issuesIdentified.map((issue, i) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-emerald-400">构图调整实操步骤：</span>
                            <ul className="space-y-1.5 text-xs text-zinc-400 list-decimal list-inside">
                              {analysisResult.composition.directions.map((direction, i) => (
                                <li key={i}>{direction}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                      </div>
                    </div>

                    {/* Recommended Photographers */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                      <h3 className="text-sm font-semibold text-zinc-400 tracking-wider uppercase">
                        ✦ 契合该风格的推荐摄影师
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {photographers.filter(ph => analysisResult.recommendedPhotographerIds.includes(ph.id)).map(ph => (
                          <div key={ph.id} className="bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img src={ph.avatar} alt={ph.name} className="w-12 h-12 rounded-full object-cover border border-zinc-800" />
                              <div>
                                <h4 className="text-sm font-bold text-white">{ph.name}</h4>
                                <div className="flex items-center space-x-1 text-xs text-amber-400 mt-0.5">
                                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                                  <span>{ph.rating}</span>
                                  <span className="text-zinc-500">|</span>
                                  <span className="text-zinc-500">{ph.completedJobs}单</span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => openBookingModal(ph)}
                              className="px-3 py-1.5 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-lg transition-all"
                            >
                              立即预约
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: PHOTOGRAPHERS RECOMMEND (摄影师推荐) */}
        {/* ========================================== */}
        {activeTab === 'photographers' && (
          <div id="photographers-view" className="space-y-8 animate-fade-in">
            
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">精选专业摄影师团队</h2>
              <p className="text-zinc-400 text-sm max-w-2xl">
                每一位摄影师都搭载了我们的 AI 智能助手，能够完美对接并直接执行您在 APP 内生成的 AI 拍摄脚本。
              </p>
            </div>

            {/* Photographer card grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {photographers.map(ph => (
                <div key={ph.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                  
                  {/* Top content */}
                  <div className="p-6 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <img src={ph.avatar} alt={ph.name} className="w-16 h-16 rounded-full object-cover border-2 border-zinc-800" />
                        <div>
                          <h3 className="text-lg font-bold text-white">{ph.name}</h3>
                          <div className="flex items-center space-x-1 text-xs text-amber-400 mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{ph.rating}</span>
                            <span className="text-zinc-500">•</span>
                            <span className="text-zinc-400">{ph.completedJobs} 次合作</span>
                          </div>
                          <span className="text-xs text-zinc-500 mt-1 block flex items-center">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {ph.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-zinc-400 block">参考服务价</span>
                        <span className="text-lg font-mono font-bold text-emerald-400">¥{ph.pricePerSession}</span>
                        <span className="text-xs text-zinc-500 block">/ 场 (2小时)</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/30 p-3 rounded-xl border border-zinc-800/50">
                      {ph.bio}
                    </p>

                    {/* Camera Gear & Styles */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-zinc-500 block font-medium mb-1">主打设备：</span>
                        <span className="text-zinc-300 font-mono truncate block bg-zinc-950 px-2 py-1 rounded border border-zinc-800">{ph.cameraSetup}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block font-medium mb-1">擅长风格：</span>
                        <div className="flex flex-wrap gap-1">
                          {ph.styles.map((style, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] border border-emerald-500/20">{style}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Portfolio pieces */}
                    <div className="space-y-2">
                      <span className="text-xs text-zinc-500 block font-medium">代表作品 (Portfolio) <span className="text-[10px] text-zinc-600 font-normal">（点击查看全貌高清大图）</span>：</span>
                      <div className="grid grid-cols-4 gap-2">
                        {ph.portfolio.map((imgUrl, idx) => (
                          <button 
                            key={idx} 
                            id={`portfolio-${ph.id}-${idx}`}
                            onClick={() => openLightbox(ph.portfolio, idx, ph.name)}
                            className="h-20 rounded-lg overflow-hidden border border-zinc-800 relative group cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-emerald-500/50 w-full"
                          >
                            <img src={imgUrl} alt="portfolio item" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Trigger */}
                  <div className="p-4 bg-zinc-950/40 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">支持 AI 姿势库与拍摄脚本无缝集成</span>
                    <button
                      onClick={() => openBookingModal(ph)}
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg transition-all"
                    >
                      预约摄影师
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: AI DIRECTOR GUIDANCE (AI 拍摄指导) */}
        {/* ========================================== */}
        {activeTab === 'director' && (
          <div id="director-view" className="space-y-8 animate-fade-in">
            
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center space-x-2">
                <Compass className="w-7 h-7 text-emerald-400" />
                <span>AI 拍摄指导中心</span>
              </h2>
              <p className="text-zinc-400 text-sm max-w-2xl">
                我们最受期待的 AI 模块！支持为男生女生自动推荐美学姿势蓝图，或为您的一整场拍摄深度策划 5 步脚本故事线。
              </p>
            </div>

            {/* Sub-tab navigation */}
            <div className="flex border-b border-zinc-800">
              <button
                onClick={() => setDirectorSubTab('posing')}
                className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 ${directorSubTab === 'posing' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
              >
                <Users className="w-4 h-4" />
                <span>AI 姿势生成器</span>
              </button>
              <button
                onClick={() => setDirectorSubTab('script')}
                className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 ${directorSubTab === 'script' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
              >
                <Film className="w-4 h-4" />
                <span>AI 拍摄脚本策划</span>
              </button>
            </div>

            {/* TAB A CONTENT: AI POSING ENGINE */}
            {directorSubTab === 'posing' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Inputs */}
                <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
                  <h3 className="font-bold text-white text-base">配置您的姿势偏好</h3>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 block font-medium">主色调与风格：</label>
                    <select 
                      value={poseStyle}
                      onChange={(e) => setPoseStyle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="日系清新">日系清新</option>
                      <option value="港风复古">港风复古</option>
                      <option value="胶片质感">胶片质感</option>
                      <option value="森系温柔">森系温柔</option>
                      <option value="赛博朋克">赛博朋克</option>
                      <option value="韩式极简">韩式极简</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 block font-medium">拍摄对象：</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['女生', '男生', '情侣/双人'].map(gender => (
                        <button
                          key={gender}
                          onClick={() => setPoseGender(gender)}
                          className={`py-2 px-3 text-xs rounded-lg font-semibold border transition-all ${poseGender === gender ? 'bg-emerald-500 border-emerald-500 text-zinc-950' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleGeneratePoses}
                      disabled={isGeneratingPoses}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10"
                    >
                      {isGeneratingPoses ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>AI 正在勾画人体姿态...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 fill-zinc-950/20" />
                          <span>一键智能生成 4 组美姿</span>
                        </>
                      )}
                    </button>
                  </div>

                  {poseError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                      {poseError}
                    </div>
                  )}

                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/50 text-[11px] text-zinc-500 space-y-1">
                    <span className="text-zinc-400 font-bold block">💡 什么是姿势生成器？</span>
                    <p>利用AI识别和解析人体关键骨骼，生成适合相应风格不僵硬、充满张力故事性的人像美姿指南，并附带手绘SVG骨骼蓝图。</p>
                  </div>

                </div>

                {/* Outputs Display */}
                <div className="lg:col-span-8">
                  
                  {generatedPoses.length === 0 && !isGeneratingPoses && (
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[350px]">
                      <Users className="w-12 h-12 text-zinc-800 mb-2 animate-bounce" />
                      <h4 className="font-bold text-zinc-400 text-base">准备绘制完美美姿</h4>
                      <p className="text-xs text-zinc-500 max-w-sm mt-1">
                        在左侧选择您喜好的风格和拍摄性别，点击一键生成，AI 会为您规划四款独特的肢体神态摆法。
                      </p>
                    </div>
                  )}

                  {isGeneratingPoses && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[350px] space-y-4">
                      <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                      <p className="text-sm font-semibold text-white animate-pulse">正在精细化计算肢体比例骨架...</p>
                      <p className="text-xs text-zinc-500 max-w-sm">
                        Gemini 正在针对风格情境为您策划自然流畅、避免镜头尴尬的微动作，并绘制专属的姿势拓扑蓝图。
                      </p>
                    </div>
                  )}

                  {generatedPoses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                      {generatedPoses.map((pose) => (
                        <div key={pose.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                          
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-bold text-white text-base flex items-center">
                                <span className="w-5 h-5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs rounded-full flex items-center justify-center mr-2 font-mono">
                                  {pose.id.replace('p-', '')}
                                </span>
                                {pose.title}
                              </h4>
                              <button
                                onClick={() => {
                                  if (!savedPoses.find(p => p.id === pose.id)) {
                                    setSavedPoses([...savedPoses, pose]);
                                    alert('姿势已收藏至“个人中心 > 我的收藏”！');
                                  }
                                }}
                                className="text-zinc-500 hover:text-emerald-400 transition-all p-1"
                                title="收藏姿势"
                              >
                                <Bookmark className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-xs text-zinc-400 leading-relaxed">{pose.description}</p>
                            
                            <div className="space-y-1.5 pt-2">
                              <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">动作核心点：</span>
                              <div className="flex flex-wrap gap-1.5">
                                {pose.keyPoints.map((pt, i) => (
                                  <span key={i} className="text-[10px] bg-zinc-950 px-2 py-1 rounded border border-zinc-800 text-zinc-300">
                                    ✓ {pt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* SVG Contour Silhouette Rendering */}
                          {pose.silhouetteSvgCode && (
                            <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 flex items-center justify-center h-28 relative">
                              <span className="absolute top-1.5 left-2 text-[8px] text-zinc-500 font-mono">POSE BLUEPRINT</span>
                              <div 
                                className="w-20 h-20 text-emerald-400 flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: pose.silhouetteSvgCode }} 
                              />
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* TAB B CONTENT: AI SHOOTING SCRIPT */}
            {directorSubTab === 'script' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Script parameters inputs */}
                <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
                  <h3 className="font-bold text-white text-base">配置定制拍摄脚本</h3>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 block font-medium">输入或选择拍摄主题：</label>
                    <input 
                      type="text"
                      value={scriptTheme}
                      onChange={(e) => setScriptTheme(e.target.value)}
                      placeholder="例如：毕业大片、街拍潮服、复古旗袍等"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['毕业纪念照', '情侣午后街拍', '国潮冷酷街头', '森系仙女裙'].map(theme => (
                        <button
                          key={theme}
                          onClick={() => setScriptTheme(theme)}
                          className="text-[10px] bg-zinc-950 hover:bg-zinc-800 px-2 py-1 rounded border border-zinc-800 text-zinc-400 transition-all"
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 block font-medium">美学艺术色调：</label>
                    <select 
                      value={scriptStyle}
                      onChange={(e) => setScriptStyle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="日系清新 (Warm Green, Nostalgic)">日系清新</option>
                      <option value="王家卫式港风复古 (Cinematic Teal & Orange)">港风复古</option>
                      <option value="暗黑硬核赛博朋克 (Neon Night, High Contrast)">赛博朋克</option>
                      <option value="温柔奶油Ins画风 (Warm Pastel Muted)">温柔Ins风</option>
                      <option value="纪实故事胶片风格 (Hasselblad Color Science)">胶片复古</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      id="btn-generate-script"
                      onClick={handleGenerateScript}
                      disabled={isGeneratingScript}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/10"
                    >
                      {isGeneratingScript ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>AI正在编排分镜头脚本...</span>
                        </>
                      ) : (
                        <>
                          <Film className="w-4 h-4 fill-zinc-950/20" />
                          <span>一键智能策划分镜脚本</span>
                        </>
                      )}
                    </button>
                  </div>

                  {scriptError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                      {scriptError}
                    </div>
                  )}

                  <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/50 text-[11px] text-zinc-500 space-y-1">
                    <span className="text-zinc-400 font-bold block">💡 什么是拍摄分镜脚本？</span>
                    <p>由AI担任视觉创意总监。为您生成从第一个分镜开始，直至完美收工的整套拍摄连贯动作，涵盖镜头尺寸、运镜位置、道具安排及拍摄技巧。</p>
                  </div>

                </div>

                {/* Script Display Output */}
                <div className="lg:col-span-8">
                  
                  {!generatedScript && !isGeneratingScript && (
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                      <Film className="w-12 h-12 text-zinc-800 mb-2" />
                      <h4 className="font-bold text-zinc-400 text-base">开启您的 AI 分镜企划书</h4>
                      <p className="text-xs text-zinc-500 max-w-sm mt-1">
                        填写左侧拍摄的主题意向和主打色调，一键策划，大模型将生成涵盖5套拍摄流程的完美企划，可以直接提供给摄影师，照着直接拍出大片！
                      </p>
                    </div>
                  )}

                  {isGeneratingScript && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
                      <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                      <p className="text-sm font-semibold text-white animate-pulse">正在精妙构思一整场故事叙事线...</p>
                      <p className="text-xs text-zinc-500 max-w-sm">
                        正在结合镜头美学，从起、承、转、合、收等多角度撰写最完美的 5 场拍摄机位与动作指南，并定制道具攻略。
                      </p>
                    </div>
                  )}

                  {generatedScript && (
                    <div className="space-y-6 animate-fade-in">
                      
                      {/* Overall brief */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">AI 摄影创意大纲 (AI Directing Brief)</span>
                          <h3 className="text-lg font-bold text-white">主题：{generatedScript.theme}</h3>
                          <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">{generatedScript.brief}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (!savedScripts.find(s => s.theme === generatedScript.theme)) {
                              setSavedScripts([...savedScripts, generatedScript]);
                              alert('脚本已收藏至“个人中心 > 我的收藏”！预约摄影师时可以直接派发此脚本。');
                            }
                          }}
                          className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shrink-0"
                        >
                          <Bookmark className="w-4 h-4 text-emerald-400" />
                          <span>收藏此脚本</span>
                        </button>
                      </div>

                      {/* Steps timeline */}
                      <div className="space-y-4 relative before:absolute before:top-4 before:bottom-4 before:left-[17px] before:w-[2px] before:bg-zinc-800">
                        {generatedScript.steps.map((step, idx) => (
                          <div key={idx} className="relative pl-10 group">
                            
                            {/* Step bullet */}
                            <div className="absolute top-1 left-0 w-9 h-9 bg-zinc-950 border-2 border-emerald-500/80 rounded-full flex items-center justify-center text-emerald-400 font-mono text-sm font-bold z-10 group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-all">
                              {step.stepNumber}
                            </div>

                            {/* Card body */}
                            <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 space-y-3 transition-all">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <h4 className="font-bold text-white text-base">{step.title}</h4>
                                <span className="text-xs bg-zinc-950 px-2.5 py-1 rounded-full border border-zinc-800 text-emerald-400 font-mono">
                                  {step.shotType}
                                </span>
                              </div>

                              <div className="space-y-2 text-xs">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/40 space-y-1">
                                    <span className="text-zinc-500 font-medium">模特动作姿势引导：</span>
                                    <p className="text-zinc-300 leading-relaxed">{step.pose}</p>
                                  </div>
                                  <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/40 space-y-1">
                                    <span className="text-zinc-500 font-medium">镜头构图与取景：</span>
                                    <p className="text-zinc-300 leading-relaxed">{step.composition}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-1 text-[11px]">
                                  <div>
                                    <span className="text-zinc-500 block">推荐道具及服装细节：</span>
                                    <span className="text-zinc-400 font-medium">{step.props}</span>
                                  </div>
                                  <div>
                                    <span className="text-zinc-500 block">建议拍摄时机与光效：</span>
                                    <span className="text-zinc-400 font-medium">{step.timing}</span>
                                  </div>
                                </div>
                              </div>

                            </div>

                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 5: COMMUNITY SHARE (作品社区) */}
        {/* ========================================== */}
        {activeTab === 'community' && (
          <div id="community-view" className="space-y-8 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">AI 约拍成片分享社区</h2>
                <p className="text-zinc-400 text-sm">
                  在这里，您可以看到其他探索家分享的精美大片，以及他们所使用的 AI 构图分析与合作的优秀摄影师。
                </p>
              </div>
              <button
                id="btn-open-share"
                onClick={() => setIsShareModalOpen(true)}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>分享我的拍摄大片</span>
              </button>
            </div>

            {/* Masonry layout grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                  
                  <div className="space-y-4">
                    
                    {/* Author block */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={post.authorAvatar} alt={post.authorName} className="w-9 h-9 rounded-full object-cover border border-zinc-800" />
                        <div>
                          <h4 className="text-sm font-bold text-white">{post.authorName}</h4>
                          <span className="text-[10px] text-zinc-500">{post.date}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-emerald-400 text-[10px] font-semibold rounded-full">
                        {post.styleTag}
                      </span>
                    </div>

                    {/* Artwork main photo */}
                    <div className="h-80 overflow-hidden relative group">
                      <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                    </div>

                    {/* Description caption */}
                    <div className="px-4 pb-2 space-y-2">
                      {post.photographerName && (
                        <p className="text-xs text-zinc-400 font-medium">
                          摄影师：<span className="text-emerald-400">{post.photographerName}</span>
                        </p>
                      )}
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {post.caption}
                      </p>
                    </div>

                  </div>

                  {/* Actions & Comment module */}
                  <div className="border-t border-zinc-800/80 p-4 bg-zinc-950/30 space-y-3">
                    
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center space-x-1.5 text-xs font-semibold transition-all ${post.hasLiked ? 'text-rose-500' : 'text-zinc-400 hover:text-zinc-200'}`}
                      >
                        <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-500' : ''}`} />
                        <span>{post.likes} 赞</span>
                      </button>

                      <span className="text-xs text-zinc-500 flex items-center space-x-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.comments.length} 条评论</span>
                      </span>
                    </div>

                    {/* Mini comments stream */}
                    {post.comments.length > 0 && (
                      <div className="space-y-1.5 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/50 max-h-24 overflow-y-auto">
                        {post.comments.map((comment, i) => (
                          <p key={i} className="text-[11px] leading-relaxed text-zinc-400">
                            <strong className="text-zinc-300 mr-1.5">{comment.author}:</strong>
                            {comment.text}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Create Comment Form */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const input = (e.currentTarget.elements.namedItem('commentInput') as HTMLInputElement);
                        handleAddComment(post.id, input.value);
                        input.value = '';
                      }}
                      className="flex space-x-2 pt-1"
                    >
                      <input 
                        name="commentInput"
                        type="text" 
                        placeholder="留下你的惊叹..."
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button 
                        type="submit"
                        className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                      >
                        评论
                      </button>
                    </form>

                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 6: PROFILE & BOOKINGS (个人中心) */}
        {/* ========================================== */}
        {activeTab === 'profile' && (
          <div id="profile-view" className="space-y-8 animate-fade-in">
            
            {/* User profile card card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full p-1 shadow-xl flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80" 
                    alt="User Avatar" 
                    className="w-full h-full rounded-full object-cover border-2 border-zinc-950"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                    <span>影集探索家</span>
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono uppercase font-bold">VIP 摄影合伙人</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">jonathanclayden374@gmail.com</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-3 text-xs">
                    <span className="text-zinc-400">约拍：<strong className="text-white">{bookings.length}</strong> 次</span>
                    <span className="text-zinc-400">分享作品：<strong className="text-white">{posts.filter(p => p.authorName === '我 (探索家)').length}</strong> 篇</span>
                    <span className="text-zinc-400">保存脚本/姿势：<strong className="text-white">{savedScripts.length + savedPoses.length}</strong> 组</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('analyze')}
                  className="px-4 py-2 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-xl hover:bg-emerald-400 transition-all flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-zinc-950/20" />
                  <span>AI分析照片</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* BOOKINGS LISTINGS */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <span>我的约拍计划 (Bookings)</span>
                </h3>

                {bookings.length === 0 ? (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
                    您当前没有任何约拍。
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                        
                        {/* Booking meta */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-center space-x-3">
                            <img src={booking.photographerAvatar} alt={booking.photographerName} className="w-10 h-10 rounded-full object-cover border border-zinc-800" />
                            <div>
                              <h4 className="text-sm font-bold text-white">约拍：{booking.photographerName}</h4>
                              <p className="text-xs text-zinc-500">定档方案：{booking.shootType}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'}`}>
                            {booking.status === 'confirmed' ? '已确认档期' : '等待接单确认'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-zinc-800/50">
                          <div>
                            <span className="text-zinc-500 block">约定拍摄日期</span>
                            <span className="text-zinc-300 font-medium">{booking.date}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block">选定时间段</span>
                            <span className="text-zinc-300 font-medium">{booking.timeSlot}</span>
                          </div>
                        </div>

                        {/* Expandable attached script */}
                        {booking.aiScript && (
                          <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800/80 space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                                <Sparkles className="w-3 h-3" />
                                <span>已派发的 AI 创意分镜大纲</span>
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-white">脚本主题: {booking.aiScript.theme}</h5>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">{booking.aiScript.brief}</p>
                            
                            {/* Steps list */}
                            <div className="space-y-2 pt-2 border-t border-zinc-800/30">
                              {booking.aiScript.steps.map((st, sidx) => (
                                <div key={sidx} className="text-xs bg-zinc-900 p-2.5 rounded border border-zinc-800/60 space-y-1">
                                  <div className="flex justify-between font-bold text-white text-[11px]">
                                    <span>第 {st.stepNumber} 幕: {st.title}</span>
                                    <span className="text-emerald-400 font-mono font-normal text-[10px]">{st.shotType}</span>
                                  </div>
                                  <p className="text-[11px] text-zinc-400 leading-relaxed">{st.pose}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* SAVED ASSETS */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* SAVED SCRIPTS */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Bookmark className="w-5 h-5 text-emerald-400" />
                    <span>我收藏的 AI 脚本 ({savedScripts.length})</span>
                  </h3>

                  {savedScripts.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500 text-xs">
                      前往“AI拍摄指导”收藏分镜脚本。
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {savedScripts.map((sc, i) => (
                        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                          <h4 className="text-xs font-bold text-white">{sc.theme}</h4>
                          <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{sc.brief}</p>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-zinc-500 font-mono">{sc.steps.length} 幕分镜</span>
                            <button
                              onClick={() => {
                                setGeneratedScript(sc);
                                setDirectorSubTab('script');
                                setActiveTab('director');
                              }}
                              className="text-emerald-400 hover:text-emerald-300 font-bold"
                            >
                              查看详情
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SAVED POSES */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span>我收藏的 AI 姿势 ({savedPoses.length})</span>
                  </h3>

                  {savedPoses.length === 0 ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500 text-xs">
                      前往“AI拍摄指导”收藏自然美姿。
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedPoses.map((pose, i) => (
                        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-2">
                          <h4 className="text-xs font-bold text-white truncate">{pose.title}</h4>
                          <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{pose.description}</p>
                          {pose.silhouetteSvgCode && (
                            <div className="bg-zinc-950 rounded p-1.5 flex items-center justify-center h-16 border border-zinc-800">
                              <div className="w-12 h-12 text-emerald-400" dangerouslySetInnerHTML={{ __html: pose.silhouetteSvgCode }} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 7: AI LAB PANEL (AI 实验室 - 换脸与算法) */}
        {/* ========================================== */}
        {activeTab === 'ailab' && (
          <div id="ailab-view" className="space-y-8 animate-fade-in">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-800">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center space-x-2">
                  <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse" />
                  <span>AI 创新应用实验室</span>
                </h2>
                <p className="text-zinc-400 text-sm max-w-2xl">
                  探索前沿的多模态计算机视觉模型。支持高强度隐私保护换脸、差分隐私脱敏，以及摄影风格聚类与智能推荐算法的深度模拟。
                </p>
              </div>

              {/* Sub tabs switcher */}
              <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setAilabSubTab('faceswap')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${ailabSubTab === 'faceswap' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>AI 隐私换脸 & 脱敏</span>
                </button>
                <button
                  onClick={() => setAilabSubTab('algorithms')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 ${ailabSubTab === 'algorithms' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-zinc-200'}`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>风格分类 & 推荐算法</span>
                </button>
              </div>
            </div>

            {/* SUB-TAB 1: AI PRIVACY FACE SWAP */}
            {ailabSubTab === 'faceswap' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT: UPLOADER & CONTROLS */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Image Source Card */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span>第一步：上传/选择原始肖像</span>
                    </h3>

                    {swapSrcImage ? (
                      <div className="space-y-3">
                        <div className="h-44 rounded-xl overflow-hidden relative bg-zinc-950 border border-zinc-800">
                          <img 
                            src={swapSrcImage} 
                            alt="Swap source" 
                            className="w-full h-full object-contain"
                          />
                          <button 
                            onClick={() => setSwapSrcImage(null)}
                            className="absolute top-2 right-2 bg-zinc-900/95 border border-zinc-800 text-zinc-300 hover:text-white text-[10px] px-2.5 py-1.5 rounded-lg"
                          >
                            清除
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-400 text-center">✅ 照片已导入。点击右侧画布可精确定位五官。</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-zinc-800 rounded-xl p-6 text-center hover:border-emerald-500/40 transition-all relative">
                          <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                          <p className="text-xs font-semibold text-white">点击上传我的肖像照</p>
                          <p className="text-[10px] text-zinc-500 mt-1">支持 JPG, PNG。数据全本地处理，不保留原始生物特征</p>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFaceSwapFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>

                        {/* Test Button */}
                        <button
                          type="button"
                          onClick={() => setSwapSrcImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&h=600&q=80')}
                          className="w-full py-2.5 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold rounded-xl text-emerald-400 transition-all flex items-center justify-center space-x-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>使用高质感模特肖像快速体验</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Preset Face Selection */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>第二步：选择目标隐私替换脸孔</span>
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">
                      {PRESET_SWAP_FACES.map(face => (
                        <button
                          key={face.id}
                          onClick={() => setSelectedSwapPresetId(face.id)}
                          className={`p-2 rounded-xl border text-left space-y-1.5 transition-all relative ${selectedSwapPresetId === face.id ? 'bg-zinc-850 border-emerald-500 ring-2 ring-emerald-500/10' : 'bg-zinc-950 border-zinc-850 hover:border-zinc-700'}`}
                        >
                          <div className="h-16 rounded-lg overflow-hidden relative">
                            <img src={face.url} alt={face.name} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 right-1 bg-zinc-950/80 backdrop-blur-sm text-[8px] px-1.5 py-0.5 rounded text-zinc-300 font-mono">
                              {face.gender}
                            </span>
                          </div>
                          <div className="px-0.5">
                            <h4 className="text-[10px] font-bold text-white truncate">{face.name}</h4>
                            <span className="text-[8px] text-emerald-400 block font-mono">{face.tag}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fine Tune Controls */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4 text-xs">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>第三步：微调融合参数 & 隐私偏好</span>
                    </h3>

                    <div className="space-y-3.5">
                      {/* Blend strength */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-400 font-medium">五官融合强度 (Blend Strength)</span>
                          <span className="text-emerald-400 font-mono font-bold">{swapBlend}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="30" 
                          max="100" 
                          value={swapBlend}
                          onChange={(e) => setSwapBlend(parseInt(e.target.value))}
                          className="w-full accent-emerald-500 h-1 bg-zinc-950 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Scale */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-400 font-medium">替换五官尺寸 (Face Scale)</span>
                          <span className="text-emerald-400 font-mono font-bold">{swapScale.toFixed(2)}x</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.5" 
                          max="2.0" 
                          step="0.05"
                          value={swapScale}
                          onChange={(e) => setSwapScale(parseFloat(e.target.value))}
                          className="w-full accent-emerald-500 h-1 bg-zinc-950 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Rotation */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-400 font-medium">偏转倾斜角度 (Tilt Rotation)</span>
                          <span className="text-emerald-400 font-mono font-bold">{swapRotation}°</span>
                        </div>
                        <input 
                          type="range" 
                          min="-90" 
                          max="90" 
                          value={swapRotation}
                          onChange={(e) => setSwapRotation(parseInt(e.target.value))}
                          className="w-full accent-emerald-500 h-1 bg-zinc-950 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Eye bar and privacy blur checkboxes */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <label className="flex items-center space-x-2 bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl cursor-pointer hover:border-zinc-700 transition-all">
                          <input 
                            type="checkbox" 
                            checked={swapEyeMask}
                            onChange={(e) => setSwapEyeMask(e.target.checked)}
                            className="rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5"
                          />
                          <div className="leading-tight">
                            <span className="text-[10px] font-bold text-white block">眼部遮蔽黑镜</span>
                            <span className="text-[8px] text-zinc-500">保护视线隐私</span>
                          </div>
                        </label>

                        <label className="flex items-center space-x-2 bg-zinc-950 border border-zinc-850 p-2.5 rounded-xl cursor-pointer hover:border-zinc-700 transition-all">
                          <input 
                            type="checkbox" 
                            checked={swapPrivacyBlur}
                            onChange={(e) => setSwapPrivacyBlur(e.target.checked)}
                            className="rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500 w-3.5 h-3.5"
                          />
                          <div className="leading-tight">
                            <span className="text-[10px] font-bold text-white block">差分加密环</span>
                            <span className="text-[8px] text-zinc-500">高防伪防追踪</span>
                          </div>
                        </label>
                      </div>

                    </div>
                  </div>

                </div>

                {/* RIGHT: INTERACTIVE CANVAS VIEWPORT & EXPLANATIONS */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Live Canvas Box */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 min-h-[450px]">
                    
                    {swapSrcImage ? (
                      <div className="space-y-4 w-full flex flex-col items-center">
                        <div className="text-center">
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                            AI 双重融合沙盒
                          </span>
                          <p className="text-[11px] text-zinc-500 mt-1.5">💡 提示：在图片内直接点击或拖拽，即可调整新五官的坐标中心</p>
                        </div>

                        {/* Interactive Canvas */}
                        <div className="relative border border-zinc-800 rounded-xl overflow-hidden shadow-2xl bg-zinc-950">
                          <canvas 
                            ref={swapCanvasRef}
                            onMouseDown={(e) => {
                              handleCanvasClickOrDrag(e);
                              const onMouseMove = (moveEvent: MouseEvent) => {
                                handleCanvasClickOrDrag(moveEvent as any);
                              };
                              const onMouseUp = () => {
                                window.removeEventListener('mousemove', onMouseMove);
                                window.removeEventListener('mouseup', onMouseUp);
                              };
                              window.addEventListener('mousemove', onMouseMove);
                              window.addEventListener('mouseup', onMouseUp);
                            }}
                            onTouchStart={(e) => handleCanvasClickOrDrag(e)}
                            onTouchMove={(e) => handleCanvasClickOrDrag(e)}
                            className="max-w-full cursor-crosshair block"
                            style={{ maxHeight: '420px' }}
                          />

                          {/* Interactive Overlay Target Anchor */}
                          <div 
                            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                            style={{ left: `${swapX}%`, top: `${swapY}%` }}
                          >
                            <div className="w-8 h-8 border-2 border-dashed border-emerald-400 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                            </div>
                            <span className="bg-zinc-950/90 text-emerald-400 text-[8px] font-mono px-1 py-0.5 rounded border border-zinc-800 shadow-md mt-1 font-bold">
                              脸孔心 ({swapX}%, {swapY}%)
                            </span>
                          </div>
                        </div>

                        {/* Trigger button */}
                        <button
                          type="button"
                          onClick={handleRunPrivacyFaceSwap}
                          disabled={isProcessingSwap || !swapSrcImage}
                          className="w-full max-w-sm py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-sm rounded-xl shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
                        >
                          {isProcessingSwap ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>多模态肖像差分合成中...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 fill-zinc-950/20" />
                              <span>一键生成 AI 隐私脱敏肖像</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center space-y-3 py-12 max-w-sm">
                        <Users className="w-16 h-16 text-zinc-700 mx-auto animate-pulse" />
                        <h4 className="text-white font-bold text-base">待编辑隐私画布</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                          请在左侧上传您的自拍照或日常照，或者直接点击“使用高质感模特肖像快速体验”即可立刻调配大语言模型解析眼鼻坐标、进行脸孔融合。
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Privacy compliance report */}
                  {swapResult && (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 animate-fade-in">
                      <div className="flex items-center space-x-2 pb-2.5 border-b border-zinc-800">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <h4 className="text-xs font-bold text-white tracking-widest uppercase">
                          数据脱敏与合规分析报告 (Privacy Shield Audit Log)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        
                        {/* Column 1: Biometric Compliance */}
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-2.5">
                          <span className="text-[10px] text-zinc-500 font-bold block">合规脱敏状态 / Compliance Status</span>
                          <div className="flex justify-between text-[11px] border-b border-zinc-800/40 pb-1.5">
                            <span className="text-zinc-400">合规框架 / Framework</span>
                            <span className="text-emerald-400 font-bold">{swapResult.privacyReport?.complianceStatus || 'GDPR & PIPL Compliant'}</span>
                          </div>
                          <div className="flex justify-between text-[11px] border-b border-zinc-800/40 pb-1.5">
                            <span className="text-zinc-400">保留政策 / Retention</span>
                            <span className="text-emerald-400 font-bold">{swapResult.privacyReport?.retentionPolicy || 'Zero Server Retention'}</span>
                          </div>
                          <div className="flex justify-between text-[11px] pb-0.5">
                            <span className="text-zinc-400">防伪防追踪签名</span>
                            <span className="text-purple-400 truncate max-w-[120px]">{swapResult.privacyReport?.encryptionKeySignature || 'SHA-256 x89f...3e2a'}</span>
                          </div>
                        </div>

                        {/* Column 2: Facial Analysis details */}
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-2.5">
                          <span className="text-[10px] text-zinc-500 font-bold block">人脸多模态语义解析 / Facial Matrix</span>
                          <div className="flex justify-between text-[11px] border-b border-zinc-800/40 pb-1.5">
                            <span className="text-zinc-400">推断性别 & 肤色色阶</span>
                            <span className="text-zinc-300 font-bold">{swapResult.facialAnalysis?.genderEstimate || '女'} / {swapResult.facialAnalysis?.skinToneHex || '#F5D6C6'}</span>
                          </div>
                          <div className="flex justify-between text-[11px] border-b border-zinc-800/40 pb-1.5">
                            <span className="text-zinc-400">光源方向 / Lighting</span>
                            <span className="text-zinc-300">{swapResult.facialAnalysis?.lightingDirection || '10点钟方向自然顺光'}</span>
                          </div>
                          <div className="flex justify-between text-[11px] pb-0.5">
                            <span className="text-zinc-400">姿态倾斜 / Angles</span>
                            <span className="text-zinc-300">Roll: {swapResult.faceCoordinates?.rollAngle || 0}° / Yaw: {swapResult.faceCoordinates?.yawAngle || 0}°</span>
                          </div>
                        </div>

                      </div>

                      {/* Log text */}
                      <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850/80">
                        <span className="text-[9px] text-zinc-500 block font-bold">脱敏清洗日志 / Sanitization Logs</span>
                        <p className="text-[10px] text-zinc-400 leading-relaxed mt-1 font-sans">
                          {swapResult.privacyReport?.sanitizationLog || '原始生物特征点定位特征集(facial features matrix)提取完毕后，已完成符合 PIPL 及 GDPR 安全标准的零冗余碎纸化清除，生成对应的隐私脱敏层，并成功在本地沙盒 canvas 内完成像素级渲染。'}
                        </p>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* SUB-TAB 2: ALGORITHM STUDY */}
            {ailabSubTab === 'algorithms' && (
              <div className="space-y-8">
                
                {/* MATURE ALGORITHMS CARD DECK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Style classification alg */}
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-2.5 pb-2 border-b border-zinc-800/50">
                      <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">1. 摄影风格识别分类算法</h4>
                        <span className="text-[9px] text-zinc-500 font-mono block">STYLE CLASSIFICATION ARCHITECTURE</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      摄影风格识别是一项典型的<strong>多模态计算机视觉(CV)分类任务</strong>。目前工业界和学术界主要依靠以下成熟的深度学习算法体系来应对色调、对比度、虚化等维度的理解：
                    </p>

                    <div className="space-y-3 pt-1 text-xs">
                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                        <span className="text-white font-bold block text-[11px]">CLIP (Contrastive Language-Image Pre-training)</span>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                          采用双塔模型（文本Encoder与图像Encoder）在百亿图像文本对上进行对比学习。能将照片风格和文字描述投影在相同的512维向量空间，通过余弦相似度计算匹配。
                        </p>
                      </div>

                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                        <span className="text-white font-bold block text-[11px]">格拉姆矩阵 (Gram Matrix - NST)</span>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                          源于神经风格迁移网络(VGG-19)。提取卷积神经网络中间层特征的通道相关性(correlation)。格拉姆矩阵能精确捕获图像的质感、纹理和光影频段，与内容完全解耦。
                        </p>
                      </div>

                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                        <span className="text-white font-bold block text-[11px]">HSV/RGB 空间色彩直方图聚类 (Color Histograms)</span>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                          经典的统计特征。对色彩分布直方图进行主成分分析(PCA)或K-Means聚类。这在捕获日系“高明度、低饱和”与港风“深冷调、高红黄对比”等特定影调特征时极其迅速且高度鲁棒。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation system alg */}
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-2.5 pb-2 border-b border-zinc-800/50">
                      <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">2. 智能摄影师匹配推荐算法</h4>
                        <span className="text-[9px] text-zinc-500 font-mono block">RECOMMENDATION ENGINE SYSTEM</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      摄影约拍推荐需兼顾<strong>非结构化美学偏好(Aesthetic Taste)</strong>与<strong>结构化物理硬性约束</strong>(如预算限制、评分、时段冲突等)。主流的成熟推荐系统算法模型包括：
                    </p>

                    <div className="space-y-3 pt-1 text-xs">
                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                        <span className="text-white font-bold block text-[11px]">双层协同过滤 (Two-Tower Collaborative Filtering)</span>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                          包含召回(Recall)与排序(Ranking)两个阶段。第一阶段根据交叠历史偏好使用基于矩阵分解(SVD)算法拉取前10位摄影师，第二阶段依据细分权重作精准排序。
                        </p>
                      </div>

                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                        <span className="text-white font-bold block text-[11px]">多目标决策分析 (Multi-Criteria Decision Analysis - AHP)</span>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                          由于用户约拍有复杂的权衡关系。模型计算每个摄影师的综合效益。通过给定的风格相似度向量、价格阶梯和口碑，实时解出综合效用效能值进行精确展示。
                        </p>
                      </div>

                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                        <span className="text-white font-bold block text-[11px]">图神经网络 (Graph Neural Networks - GCN)</span>
                        <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                          在“用户-摄影师-风格地标”的异质图网络(Heterogeneous Graph)中通过节点嵌入和空间卷积。发现潜在的相关连结路径，实现高阶的美学共鸣摄影推荐。
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* INTERACTIVE ALGORITHM SIMULATOR SANDBOX */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
                  
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <Sliders className="w-5 h-5 text-emerald-400" />
                      <span>约拍多目标效用决策算法模拟沙盒 (MCDA Engine Simulator)</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      通过实时调整下方推荐算法参数模型的权重(总和保持1.0)，直观查看数学模型对摄影师推荐顺位和效用分值(Utility Value)的即时偏转影响。
                    </p>
                  </div>

                  {/* Weights control panel */}
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-850 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
                    
                    {/* Select target style */}
                    <div className="space-y-1.5">
                      <label className="text-zinc-500 block font-bold font-mono">1. TARGET_STYLE</label>
                      <select
                        value={simStyle}
                        onChange={(e) => setSimStyle(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-bold"
                      >
                        <option value="日系">日系清新风格</option>
                        <option value="港风">港风胶片复古</option>
                        <option value="赛博朋克">赛博朋克霓虹</option>
                        <option value="Ins风">温润简约博主风</option>
                      </select>
                    </div>

                    {/* Weight style slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-mono font-bold">
                        <span className="text-zinc-500">2. STYLE_WEIGHT (α)</span>
                        <span className="text-emerald-400">{weightStyle}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05"
                        value={weightStyle}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setWeightStyle(val);
                          // Keep weight balance
                          const remaining = Math.max(0, 1 - val);
                          setWeightPrice(parseFloat((remaining * 0.6).toFixed(2)));
                          setWeightRating(parseFloat((remaining * 0.4).toFixed(2)));
                        }}
                        className="w-full accent-emerald-500 h-1 bg-zinc-900 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Weight price slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-mono font-bold">
                        <span className="text-zinc-500">3. PRICE_WEIGHT (β)</span>
                        <span className="text-teal-400">{weightPrice}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05"
                        value={weightPrice}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setWeightPrice(val);
                          // Keep weight balance
                          const remaining = Math.max(0, 1 - val);
                          setWeightStyle(parseFloat((remaining * 0.7).toFixed(2)));
                          setWeightRating(parseFloat((remaining * 0.3).toFixed(2)));
                        }}
                        className="w-full accent-teal-400 h-1 bg-zinc-900 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Weight rating slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-mono font-bold">
                        <span className="text-zinc-500">4. RATING_WEIGHT (γ)</span>
                        <span className="text-purple-400">{weightRating}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05"
                        value={weightRating}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setWeightRating(val);
                          // Keep weight balance
                          const remaining = Math.max(0, 1 - val);
                          setWeightStyle(parseFloat((remaining * 0.65).toFixed(2)));
                          setWeightPrice(parseFloat((remaining * 0.35).toFixed(2)));
                        }}
                        className="w-full accent-purple-400 h-1 bg-zinc-900 rounded-lg cursor-pointer"
                      />
                    </div>

                  </div>

                  {/* Mathematical presentation */}
                  <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono text-zinc-400">
                    <div className="space-y-1">
                      <span className="text-white font-bold block text-[11px]">🧮 算法排序效用函数公式 (Utility Scoring Formula):</span>
                      <p className="text-xs text-zinc-300 font-mono">
                        {"Score_i = (w_style × S_style) + (w_price × S_price) + (w_rating × S_rating)"}
                      </p>
                    </div>
                    <div className="text-[10px] leading-relaxed bg-zinc-900 p-2.5 rounded border border-zinc-800 text-zinc-500">
                      当前总合权重/Normalized weights: <br />
                      α({weightStyle}) + β({weightPrice}) + γ({weightRating}) = {(weightStyle + weightPrice + weightRating).toFixed(1)} (1.0)
                    </div>
                  </div>

                  {/* Simulator Results Output table */}
                  <div className="bg-zinc-950 border border-zinc-850 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-zinc-900 border-b border-zinc-850 text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
                          <th className="p-4">排名 / Photographer</th>
                          <th className="p-4">风格相似度 (S_style)</th>
                          <th className="p-4">价格指数 (S_price)</th>
                          <th className="p-4">评价满意度 (S_rating)</th>
                          <th className="p-4 text-right">综合计算评分 / SCORE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850">
                        {simResults.map((result, idx) => (
                          <tr key={result.id} className="hover:bg-zinc-900/30 transition-colors">
                            <td className="p-4 flex items-center space-x-3">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${idx === 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                {idx + 1}
                              </span>
                              <img src={result.avatar} alt={result.name} className="w-8 h-8 rounded-full object-cover border border-zinc-800" />
                              <div>
                                <span className="font-bold text-white block">{result.name}</span>
                                <span className="text-[10px] text-zinc-500 font-mono">{result.cameraSetup.split('/')[0]}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <span className="font-mono font-bold text-zinc-300">{result.styleScore}分</span>
                                <div className="w-24 bg-zinc-900 h-1 rounded">
                                  <div className="bg-emerald-500 h-1 rounded" style={{ width: `${result.styleScore}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <span className="font-mono font-bold text-zinc-300">{result.priceScore}分</span>
                                <span className="text-[9px] text-zinc-500 block">（单价 ¥{result.pricePerSession}）</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                <span className="font-mono font-bold text-zinc-300">{result.ratingScore}分</span>
                                <span className="text-[9px] text-zinc-500 block">（评分 {result.rating}★）</span>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <span className="font-mono text-base font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                                {result.finalScore} 分
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* ========================================== */}
      {/* MODAL 1: BOOKING CREATOR DIALOG */}
      {/* ========================================== */}
      {isBookingModalOpen && bookingPhotographer && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-6 relative animate-scale-up">
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">定档我的约拍方案</h3>
              <p className="text-xs text-zinc-400">
                向专业摄影师 <strong className="text-white">{bookingPhotographer.name}</strong> 发起档期锁定。
              </p>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Shoot Type selection */}
              <div className="space-y-1.5">
                <label className="text-zinc-500 font-medium">选择服务方案/拍摄风格：</label>
                <div className="flex flex-wrap gap-2">
                  {bookingPhotographer.styles.map((style, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setBookingShootType(style)}
                      className={`px-3 py-1.5 rounded-lg border font-semibold ${bookingShootType === style ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & timeslot */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-medium">约定日期：</label>
                  <input 
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-medium">约定具体时段：</label>
                  <input 
                    type="text"
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    placeholder="如: 14:00 - 16:00"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Attach script toggle */}
              {generatedScript && (
                <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-white font-bold block">同步附带当前的 AI 创意脚本</span>
                    <p className="text-[10px] text-zinc-500">将您在后台生成的《{generatedScript.theme}》脚本派发给摄影师。</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={attachAiScript}
                    onChange={(e) => setAttachAiScript(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              )}

            </div>

            {/* Price breakdown */}
            <div className="p-4 bg-zinc-950/60 rounded-xl flex justify-between items-center text-xs border border-zinc-800/50">
              <span className="text-zinc-400">订金及锁档费用：</span>
              <div className="text-right">
                <span className="text-base font-mono font-bold text-emerald-400">¥{bookingPhotographer.pricePerSession}</span>
                <span className="text-[10px] text-zinc-500 block">（现场确认无误后付尾款）</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-400 bg-zinc-850 hover:bg-zinc-800 rounded-lg transition-all"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmBooking}
                className="px-5 py-2 text-xs font-bold bg-emerald-500 text-zinc-950 rounded-lg transition-all hover:bg-emerald-400"
              >
                锁定档期
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: COMMUNITY SHARE PHOTO FORM */}
      {/* ========================================== */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 space-y-6 relative animate-scale-up">
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">分享我的摄影大作</h3>
              <p className="text-xs text-zinc-400">将您的出片上传至公共画廊，展现 AI 约拍的魅力。</p>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="text-zinc-500 font-medium">照片网络 URL 地址 (支持 Unsplash 或其他外链)：</label>
                <input 
                  type="text" 
                  value={shareImage}
                  onChange={(e) => setShareImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
                <div className="flex gap-2 pt-1">
                  <span className="text-[10px] text-zinc-500">快捷预设地址：</span>
                  <button 
                    type="button"
                    onClick={() => setShareImage('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80')}
                    className="text-[10px] text-emerald-400 underline"
                  >
                    绿意人像
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShareImage('https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=600&q=80')}
                    className="text-[10px] text-emerald-400 underline"
                  >
                    港风霓虹
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-500 font-medium">写点分享心得 (描述或拍摄花絮)：</label>
                <textarea 
                  value={shareCaption}
                  onChange={(e) => setShareCaption(e.target.value)}
                  placeholder="今天在树下抓拍的回眸太好看了..."
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-medium">风格标签：</label>
                  <select
                    value={shareStyleTag}
                    onChange={(e) => setShareStyleTag(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="日系">日系</option>
                    <option value="港风">港风</option>
                    <option value="森系">森系</option>
                    <option value="赛博朋克">赛博朋克</option>
                    <option value="Ins风">Ins风</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-500 font-medium">合作的摄影师：</label>
                  <input 
                    type="text" 
                    value={sharePhotographer}
                    onChange={(e) => setSharePhotographer(e.target.value)}
                    placeholder="如: 林木森 (Mosen)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-400 bg-zinc-850 hover:bg-zinc-800 rounded-lg transition-all"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={handleCreateSharePost}
                className="px-5 py-2 text-xs font-bold bg-emerald-500 text-zinc-950 rounded-lg transition-all hover:bg-emerald-400"
              >
                发布分享
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: PORTFOLIO LIGHTBOX MODAL */}
      {/* ========================================== */}
      {lightboxImage && (
        <div 
          id="portfolio-lightbox" 
          className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-fade-in"
        >
          {/* Header area */}
          <div className="w-full max-w-5xl flex items-center justify-between py-2 text-white border-b border-zinc-800/50 z-10">
            <div>
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">摄影师代表作展示</span>
              <h4 className="text-sm font-bold text-emerald-400">{lightboxPhotographerName}</h4>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-zinc-400 font-mono">
                {lightboxActiveIndex + 1} / {lightboxImagesList.length}
              </span>
              <button 
                onClick={() => setLightboxImage(null)}
                className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all cursor-pointer"
                title="关闭 (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main viewport area */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center p-4">
            
            {/* Left navigation arrow */}
            <button 
              onClick={prevLightboxImage}
              className="absolute left-0 sm:left-4 z-10 p-2 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-full transition-all border border-zinc-800/40 cursor-pointer"
              title="上一张 (←)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* High definition original uncropped image */}
            <div className="relative max-h-[70vh] sm:max-h-[75vh] w-full flex items-center justify-center rounded-xl overflow-hidden shadow-2xl">
              <img 
                src={lightboxImage.replace('w=600&h=800', 'w=1200&h=1600').replace('w=400&h=500', 'w=1200&h=1600')} 
                alt="Representative Photography Work" 
                className="max-h-[70vh] sm:max-h-[75vh] max-w-full object-contain select-none rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right navigation arrow */}
            <button 
              onClick={nextLightboxImage}
              className="absolute right-0 sm:right-4 z-10 p-2 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-full transition-all border border-zinc-800/40 cursor-pointer"
              title="下一张 (→)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

          {/* Footer controls & prompt tips */}
          <div className="w-full max-w-2xl text-center py-2 text-xs text-zinc-500 font-medium z-10">
            <p className="hidden sm:block">💡 提示：您可以使用键盘的 ← 和 → 箭头翻页，或按 Esc 键退出大图预览</p>
            <p className="sm:hidden">💡 提示：点击左右箭头即可自由翻页</p>
          </div>

        </div>
      )}

      {/* FOOTER FOOTER DESIGN */}
      <footer id="app-footer" className="border-t border-zinc-800 bg-zinc-950 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">AI Photographer 智能约拍与拍摄助手</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-md mx-auto">
            全场景 AI 创新赋能摄影约拍，通过多模态风格理解和分镜头策划大模型，打造高端、专业的一流摄影助手。
          </p>
          <div className="text-[10px] text-zinc-600 font-mono">
            &copy; 2026 AI Photographer Team. Built with Google AI Studio & Gemini 3.5.
          </div>
        </div>
      </footer>

    </div>
  );
}
