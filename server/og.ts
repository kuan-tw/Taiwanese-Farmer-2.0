import fs from 'fs';
import path from 'path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

let fontData: Buffer | null = null;

// Helper to generate sparkline for SVG
const generateSparklineElement = (data: number[]) => {
  if (data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  const width = 400;
  const height = 100;
  
  if (min === max) {
    return {
      type: 'path',
      props: {
        d: `M 0 ${height/2} L ${width} ${height/2}`,
        stroke: '#3b82f6',
        strokeWidth: '4',
        fill: 'none'
      }
    };
  }

  const dx = width / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * dx;
    const y = height - ((v - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');

  return {
    type: 'polyline',
    props: {
      points: points,
      stroke: '#3b82f6',
      strokeWidth: '4',
      fill: 'none',
      strokeLinejoin: 'round',
      strokeLinecap: 'round'
    }
  };
};

export const generateOGImage = async (cropCode: string, cropName: string, data: any[]) => {
  if (!fontData) {
    try {
      fontData = fs.readFileSync(path.join(process.cwd(), 'public/fonts/NotoSansCJKtc-Bold.otf'));
    } catch (e) {
      console.error('Failed to load font', e);
      return null;
    }
  }

  // Get recent 7 days
  const recentData = data.slice(-7);
  const prices = recentData.map(d => Number(d.Avg_Price || 0));
  
  const avgPrice = prices.length > 0 ? prices[prices.length - 1] : 0;
  let changeStr = '0%';
  let isUp = true;
  if (prices.length >= 2) {
    const change = ((prices[prices.length - 1] - prices[prices.length - 2]) / prices[prices.length - 2]) * 100;
    isUp = change >= 0;
    changeStr = `${isUp ? '+' : ''}${change.toFixed(1)}%`;
  }
  
  const currentVolume = recentData.length > 0 ? Number(recentData[recentData.length - 1].Trans_Quantity || 0) : 0;

  // React-like elements tree for Satori
  const element = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#f8fafc', // slate-50
        padding: '60px',
        fontFamily: '"Noto Sans TC"',
      },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' },
            children: [
              {
                type: 'div',
                props: {
                  style: { fontSize: 64, fontWeight: 'bold', color: '#0f172a' },
                  children: cropName
                }
              },
              {
                type: 'div',
                props: {
                  style: { fontSize: 32, color: '#64748b', backgroundColor: '#e2e8f0', padding: '12px 24px', borderRadius: '24px' },
                  children: `代碼: ${cropCode}`
                }
              }
            ]
          }
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', marginTop: '60px', gap: '40px' },
            children: [
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#ffffff', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
                  children: [
                    {
                      type: 'div',
                      props: { style: { fontSize: 32, color: '#64748b', marginBottom: '16px' }, children: '平均價格 (kg)' }
                    },
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', alignItems: 'baseline', gap: '16px' },
                        children: [
                          { type: 'div', props: { style: { fontSize: 72, fontWeight: 'bold', color: '#0f172a' }, children: `$${avgPrice.toFixed(1)}` } },
                          { type: 'div', props: { style: { fontSize: 32, fontWeight: 'bold', color: isUp ? '#10b981' : '#ef4444' }, children: changeStr } }
                        ]
                      }
                    }
                  ]
                }
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#ffffff', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
                  children: [
                    {
                      type: 'div',
                      props: { style: { fontSize: 32, color: '#64748b', marginBottom: '16px' }, children: '最新交易量' }
                    },
                    {
                      type: 'div',
                      props: { style: { fontSize: 72, fontWeight: 'bold', color: '#0f172a' }, children: `${currentVolume.toLocaleString()} kg` }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', marginTop: '40px', backgroundColor: '#ffffff', padding: '40px', borderRadius: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
            children: [
              {
                type: 'div',
                props: { style: { fontSize: 32, color: '#64748b', marginBottom: '20px' }, children: '7天價格趨勢' }
              },
              {
                type: 'svg',
                props: {
                  width: '100%',
                  height: '100',
                  viewBox: '0 0 400 100',
                  children: [generateSparklineElement(prices)]
                }
              }
            ]
          }
        }
      ]
    }
  };

  const svg = await satori(element as any, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Noto Sans TC',
        data: fontData,
        weight: 700,
        style: 'normal',
      },
    ],
  });
  
  const resvg = new Resvg(svg, {
    background: 'rgba(248, 250, 252, 1)',
  });
  return resvg.render().asPng();
};
