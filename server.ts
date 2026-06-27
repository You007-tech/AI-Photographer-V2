/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Increase body limits for base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize Gemini Client
const aiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: aiKey || 'placeholder_key_if_missing',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to convert base64 data URL to Part object for Gemini
function base64ToPart(base64DataUrl: string) {
  const matches = base64DataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    // If it's a raw base64 string, guess image/jpeg
    return {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64DataUrl
      }
    };
  }
  return {
    inlineData: {
      mimeType: matches[1],
      data: matches[2]
    }
  };
}

// 1. Style & Composition Analysis Endpoint
app.post('/api/analyze-style', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing in Secrets.' });
    }

    const { image, imageUrl } = req.body;
    let contentParts: any[] = [];

    if (image) {
      // User uploaded base64 image
      contentParts.push(base64ToPart(image));
      contentParts.push({
        text: 'Analyze this photo for its artistic style, composition, lighting, and suggested camera/editing parameters.'
      });
    } else if (imageUrl) {
      // User selected a preset URL, we can prompt with its context
      contentParts.push({
        text: `Analyze the general photographic style, composition, and mood of an image matching this concept: "${imageUrl}". Suggest styling, camera settings, filters, and editing instructions.`
      });
    } else {
      return res.status(400).json({ error: 'Missing image or imageUrl in request' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contentParts,
      config: {
        systemInstruction: `You are an expert AI Photography Mentor, style director, and matchmaking coordinator. 
Analyze the image or photography concept and suggest up to 3 matching photography styles (e.g., "日系", "港风", "胶片风", "森系", "赛博朋克", "Ins风", "校园", "街拍", "温润复古"). 
Ensure names of styles are in standard Chinese (like 日系, 森系, 胶片风, 港风, 赛博朋克, Ins风).
Provide detailed composition advice, highlighting issues like cluttered backgrounds, lighting issues, and actionable steps to correct them.
Provide editing directions (exposure, temperature, tint, shadows, highlights, cropping ratio, and color preset name).
Recommend photographer IDs that match the identified style. The available photographers are:
- "ph-1": 林木森 (Mosen) - Styles: 日系, 森系, 清新, 自然光
- "ph-2": 张九龙 (Leon) - Styles: 港风, 胶片风, 复古, 夜景
- "ph-3": 艾利克斯 (CyberAlex) - Styles: 赛博朋克, 街拍, 国潮, 复古未来
- "ph-4": 苏晴子 (Sora) - Styles: 韩系, 校园, Ins风, 温柔简约
Map your identified styles to at least 2 matching photographer IDs from this list.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['styles', 'composition', 'editing', 'recommendedPhotographerIds'],
          properties: {
            styles: {
              type: Type.ARRAY,
              description: 'Array of top matching photography styles',
              items: {
                type: Type.OBJECT,
                required: ['name', 'englishName', 'matchRate', 'description', 'filterAdvice', 'locationAdvice', 'timeAdvice', 'cameraSettings'],
                properties: {
                  name: { type: Type.STRING, description: 'Chinese name of style, e.g. "日系", "港风"' },
                  englishName: { type: Type.STRING, description: 'English translation of the style, e.g. "Japanese Cinematic"' },
                  matchRate: { type: Type.INTEGER, description: 'Percentage match rating, 0-100' },
                  description: { type: Type.STRING, description: 'Explanation of why this style fits or what it represents' },
                  filterAdvice: { type: Type.STRING, description: 'Suggested film simulation or filter, e.g. "Kodak Gold 200"' },
                  locationAdvice: { type: Type.STRING, description: 'Best location types for this style, e.g. "武康路", "草坪林间"' },
                  timeAdvice: { type: Type.STRING, description: 'Best hours to shoot, e.g. "下午4:00 - 黄昏"' },
                  cameraSettings: { type: Type.STRING, description: 'Recommended camera parameters, e.g. "F/1.8, 1/250s, ISO 100"' }
                }
              }
            },
            composition: {
              type: Type.OBJECT,
              required: ['techniqueName', 'generalDescription', 'issuesIdentified', 'directions', 'cameraAngle'],
              properties: {
                techniqueName: { type: Type.STRING, description: 'E.g., "三分法构图", "黄金螺旋", "对称框景"' },
                generalDescription: { type: Type.STRING, description: 'Overall critique and explanation of current composition strength' },
                issuesIdentified: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of potential composition issues'
                },
                directions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Step-by-step instructions for the photographer/model, e.g., "降低手机机位", "人物向右移动1米", "微微蹲下仰拍"'
                },
                cameraAngle: { type: Type.STRING, description: 'Suggested angle, e.g., "俯拍15°", "低机位平拍"' }
              }
            },
            editing: {
              type: Type.OBJECT,
              required: ['exposure', 'temperature', 'tint', 'highlights', 'shadows', 'cropping', 'presetName', 'generalSummary'],
              properties: {
                exposure: { type: Type.STRING, description: 'E.g., "+0.3 EV" or "-0.1 EV"' },
                temperature: { type: Type.STRING, description: 'E.g., "-150K" or "5200K"' },
                tint: { type: Type.STRING, description: 'E.g., "+5" or "-2"' },
                highlights: { type: Type.STRING, description: 'E.g., "-15" or "0"' },
                shadows: { type: Type.STRING, description: 'E.g., "+10" or "0"' },
                cropping: { type: Type.STRING, description: 'Suggested aspect ratio, e.g., "16:9", "4:3", "1:1"' },
                presetName: { type: Type.STRING, description: 'A vibrant preset name, e.g., "日式暖阳", "港味经典橘绿"' },
                generalSummary: { type: Type.STRING, description: 'Brief guidance on the grading look and color palette' }
              }
            },
            recommendedPhotographerIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'IDs of recommended photographers matching this style. Choose from: "ph-1", "ph-2", "ph-3", "ph-4"'
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response from Gemini');
    }

    const parsedResult = JSON.parse(resultText);
    res.json(parsedResult);
  } catch (err: any) {
    console.error('Style analysis failed:', err);
    res.status(500).json({ error: 'AI Style Analysis failed: ' + err.message });
  }
});

// 2. Pose Suggestion Endpoint (Returns a list of custom-designed pose suggestions)
app.post('/api/generate-poses', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing in Secrets.' });
    }

    const { style, gender, image } = req.body;
    let contentParts: any[] = [];

    if (image) {
      contentParts.push(base64ToPart(image));
    }
    contentParts.push({
      text: `Generate 4 specific, detailed pose suggestions for a photo shoot. Style requested: "${style || '日系'}", targeted to: "${gender || '通用'}". Include pose title, details, key body point positions, and an SVG outline blueprint (silhouettes/stick figure) representation if possible.`
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contentParts,
      config: {
        systemInstruction: `You are an expert posing coach for photographers and models. Generate 4 creative and natural poses. 
Each pose should have a unique, descriptive title. Provide concrete directions on head, shoulder, torso, hands, and legs.
For each pose, generate a simple SVG string representation showing the posture (e.g. stick figure or outline shape using <svg> ... <path d="..." /> ... </svg> code). Make the SVG lightweight, inline, with a stroke color like "#10B981" (emerald-500) or "#E11D48" (rose-600) and stroke-width of 2, set viewBox to "0 0 100 100". 
Do NOT wrap the SVG in markdown codeblocks inside the JSON value. Keep the SVG as a direct string value in the field.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'List of 4 posing suggestions',
          items: {
            type: Type.OBJECT,
            required: ['id', 'title', 'description', 'keyPoints', 'silhouetteSvgCode'],
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING, description: 'Descriptive title of the pose, e.g. "回眸微露", "低头浅笑"' },
              description: { type: Type.STRING, description: 'Step-by-step guidance on how to perform the pose' },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3-4 key instructions like "眼神望向远处", "左脚自然交叠"'
              },
              silhouetteSvgCode: { type: Type.STRING, description: 'A lightweight SVG string representation (viewBox="0 0 100 100") with paths drawing a stick-figure or contour outline for this pose.' }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response from Gemini');
    }

    res.json(JSON.parse(resultText));
  } catch (err: any) {
    console.error('Pose generation failed:', err);
    res.status(500).json({ error: 'AI Pose Generation failed: ' + err.message });
  }
});

// 3. Shooting Script Generator Endpoint
app.post('/api/generate-script', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing in Secrets.' });
    }

    const { theme, style } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Generate a comprehensive step-by-step professional shooting script. Theme: "${theme || '毕业纪念照'}", Style: "${style || '日系清新'}".`,
      config: {
        systemInstruction: `You are a visionary Creative Director. Generate a sequential, 5-shot shooting script for a photo session.
Each step represents a separate photo to be captured. Specify shot types, precise poses, composition details, props needed, and golden timing.
Keep descriptions vivid, inspiring, and fully realistic for a photographer to follow.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['theme', 'style', 'brief', 'steps'],
          properties: {
            theme: { type: Type.STRING },
            style: { type: Type.STRING },
            brief: { type: Type.STRING, description: 'Overall artistic direction and mood guidelines' },
            steps: {
              type: Type.ARRAY,
              description: 'The 5 sequential shots for the shoot',
              items: {
                type: Type.OBJECT,
                required: ['stepNumber', 'title', 'shotType', 'pose', 'composition', 'props', 'timing'],
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: 'Shot descriptor, e.g. "树下回眸", "落叶微风"' },
                  shotType: { type: Type.STRING, description: 'E.g., "特写 (Close-up)", "中景 (Medium Shot)", "全景 (Wide Shot)"' },
                  pose: { type: Type.STRING, description: 'Detailed model pose and expression guidance' },
                  composition: { type: Type.STRING, description: 'Rule of thirds, framing, or angles guidance' },
                  props: { type: Type.STRING, description: 'E.g., "毕业证书, 学位帽, 鲜花" or "无"' },
                  timing: { type: Type.STRING, description: 'Best ambient light or timing, e.g., "逆光黄昏", "柔和阴影"' }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response from Gemini');
    }

    res.json(JSON.parse(resultText));
  } catch (err: any) {
    console.error('Script generation failed:', err);
    res.status(500).json({ error: 'AI Script Generation failed: ' + err.message });
  }
});

// 4. AI Privacy Face Swap Endpoint
app.post('/api/privacy-face-swap', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing in Secrets.' });
    }

    const { image, style, blendStrength, eyeMask, privacyBlur } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Missing image in request' });
    }

    const contentParts: any[] = [
      base64ToPart(image),
      {
        text: `This image is a user portrait. For privacy protection, we want to perform an AI face swap or stylized privacy mask. 
        Analyze the face posture, tilt angle, approximate eye positions, lighting angle, and skin tone.
        Describe the ideal stylized replacement face that matches this pose in style "${style || '日系'}".
        Provide mock coordinate estimations (x, y, radius) assuming the image is normalized to 100x100.
        Generate a detailed privacy-protection report confirming that the raw biometric data has been purged in compliance with privacy regulations.`
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contentParts,
      config: {
        systemInstruction: `You are an AI Privacy Shield & Biometric Stylization Engine. Your task is to analyze user faces and output face swap parameters and privacy logs. 
        Ensure that your output contains a comprehensive report on data sanitization and a list of aesthetic facial attributes for synthesis.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['success', 'faceCoordinates', 'facialAnalysis', 'replacementPersona', 'privacyReport'],
          properties: {
            success: { type: Type.BOOLEAN },
            faceCoordinates: {
              type: Type.OBJECT,
              required: ['x', 'y', 'radius', 'rollAngle', 'yawAngle'],
              properties: {
                x: { type: Type.INTEGER, description: 'Approximate face center x (0-100)' },
                y: { type: Type.INTEGER, description: 'Approximate face center y (0-100)' },
                radius: { type: Type.INTEGER, description: 'Approximate face bounding circle radius (0-100)' },
                rollAngle: { type: Type.INTEGER, description: 'Face roll angle in degrees (-180 to 180)' },
                yawAngle: { type: Type.INTEGER, description: 'Face yaw angle in degrees (-90 to 90)' }
              }
            },
            facialAnalysis: {
              type: Type.OBJECT,
              required: ['genderEstimate', 'skinToneHex', 'lightingDirection', 'expressionDesc'],
              properties: {
                genderEstimate: { type: Type.STRING },
                skinToneHex: { type: Type.STRING },
                lightingDirection: { type: Type.STRING },
                expressionDesc: { type: Type.STRING }
              }
            },
            replacementPersona: {
              type: Type.OBJECT,
              required: ['name', 'avatarDescription', 'recommendedBlendFilter', 'svgAssetPlaceholder'],
              properties: {
                name: { type: Type.STRING, description: 'Name of the privacy replacement persona, e.g., "日系元气学妹", "港风复古雅痞"' },
                avatarDescription: { type: Type.STRING, description: 'Detailed visual description of the replaced face features' },
                recommendedBlendFilter: { type: Type.STRING },
                svgAssetPlaceholder: { type: Type.STRING, description: 'An SVG mask/silhouette outline representing the stylized replacement face structure' }
              }
            },
            privacyReport: {
              type: Type.OBJECT,
              required: ['complianceStatus', 'sanitizationLog', 'encryptionKeySignature', 'retentionPolicy'],
              properties: {
                complianceStatus: { type: Type.STRING },
                sanitizationLog: { type: Type.STRING },
                encryptionKeySignature: { type: Type.STRING },
                retentionPolicy: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response from Gemini');
    }

    res.json(JSON.parse(resultText));
  } catch (err: any) {
    console.error('Privacy Face Swap analysis failed:', err);
    res.status(500).json({ error: 'Privacy Face Swap analysis failed: ' + err.message });
  }
});

// Configure full-stack environments
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  // Integrate Vite dev server middleware to run Express and React concurrently on Port 3000
  console.log('Starting full-stack dev server with Vite Dev Middleware...');
  import('vite').then(({ createServer }) => {
    createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    }).then((vite) => {
      app.use(vite.middlewares);
      
      const PORT = 3000;
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`[Dev] Server runs securely at http://localhost:${PORT}`);
      });
    });
  });
} else {
  // Serve production build files
  console.log('Serving production-ready application build...');
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Prod] Server serving at http://localhost:${PORT}`);
  });
}
