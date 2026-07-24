const fs = require('fs');
const satori = require('satori').default || require('satori');
const { Resvg } = require('@resvg/resvg-js');
const React = require('react');

async function main() {
  const fontData = fs.readFileSync('public/fonts/NotoSansCJKtc-Bold.otf');
  const svg = await satori(
    {
      type: 'div',
      props: {
        children: '測試圖卡 (Test Image Card)',
        style: {
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          color: 'blue'
        }
      }
    },
    {
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
    }
  );
  
  const resvg = new Resvg(svg, {
    background: 'rgba(255, 255, 255, 1)',
  });
  const pngData = resvg.render().asPng();
  fs.writeFileSync('test.png', pngData);
  console.log('generated test.png');
}
main().catch(console.error);
