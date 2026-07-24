import { generateOGImage } from './server/og.js';
import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";


  export const injectOGTags = async (req: express.Request, html: string) => {
    // If it's a product page
    const match = req.path.match(/^\/product\/([^/]+)/);
    if (match) {
      const cropCode = match[1];
      const ogImageUrl = `https://${req.get('host')}/api/og/${cropCode}`;
      const title = `農產品行情查詢 - ${cropCode}`;
      
      const metaTags = `
        <meta property="og:title" content="${title}" />
        <meta property="og:image" content="${ogImageUrl}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:image" content="${ogImageUrl}" />
      `;
      
      return html.replace('</head>', `${metaTags}</head>`);
    }
    return html;
  };

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // API route to proxy fetch requests to moa.gov.tw
  app.use(async (req, res, next) => {
    if (!req.path.startsWith("/api/proxy")) {
      return next();
    }
    try {
      const subPath = req.path.replace(/^\/api\/proxy\/?/, '');
      const targetUrl = `https://data.moa.gov.tw/api/v1/${subPath}`;
      const url = new URL(targetUrl);
      
      // Append any query parameters from the original request
      Object.entries(req.query).forEach(([key, value]) => {
        if (typeof value === 'string') {
          url.searchParams.append(key, value);
        }
      });

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  
  // OG Image generation route
  app.get('/api/og/:cropCode', async (req, res) => {
    try {
      const { cropCode } = req.params;
      
      // Fetch English Name / Crop Name
      const nameRes = await fetch('https://data.moa.gov.tw/api/v1/CropType/');
      const nameData = await nameRes.json();
      let cropName = cropCode;
      if (nameData && nameData.Data) {
        const cropInfo = Object.values(nameData.Data).find((c: any) => c.CropCode === cropCode);
        if (cropInfo) {
          cropName = (cropInfo as any).CropName;
        }
      }

      // Fetch last 7 days history
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const sY = startDate.getFullYear() - 1911;
      const eY = endDate.getFullYear() - 1911;
      const sDateStr = `${sY}.${(startDate.getMonth()+1).toString().padStart(2, '0')}.${startDate.getDate().toString().padStart(2, '0')}`;
      const eDateStr = `${eY}.${(endDate.getMonth()+1).toString().padStart(2, '0')}.${endDate.getDate().toString().padStart(2, '0')}`;

      const dataRes = await fetch(`https://data.moa.gov.tw/api/v1/AgriProductsTransType/?Start_time=${sDateStr}&End_time=${eDateStr}&CropCode=${cropCode}`);
      const data = await dataRes.json();
      
      let products = [];
      if (data && data.Data) {
        // Aggregate by date
        const grouped = data.Data.reduce((acc: any, curr: any) => {
          if (!acc[curr.TransDate]) {
            acc[curr.TransDate] = { ...curr, totalQty: 0, totalPrice: 0, count: 0 };
          }
          acc[curr.TransDate].totalQty += curr.Trans_Quantity;
          acc[curr.TransDate].totalPrice += curr.Avg_Price * curr.Trans_Quantity;
          acc[curr.TransDate].count += 1;
          return acc;
        }, {});
        products = Object.values(grouped).map((g: any) => ({
          ...g,
          Avg_Price: g.totalPrice / (g.totalQty || 1),
          Trans_Quantity: g.totalQty
        })).sort((a: any, b: any) => a.TransDate.localeCompare(b.TransDate));
      }

      const png = await generateOGImage(cropCode, cropName, products);
      if (png) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(png);
      } else {
        res.status(500).send('Failed to generate image');
      }
    } catch (e) {
      console.error(e);
      res.status(500).send('Error');
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get(['/', '/:path(.*)'], (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
