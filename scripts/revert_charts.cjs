const fs = require('fs');

// 1. Revert PriceHistory.tsx
let ph = fs.readFileSync('src/components/PriceHistory.tsx', 'utf8');

// Remove the mobile list
ph = ph.replace(/\{isMobile && \(\s*<div className="mt-4 space-y-3">[\s\S]*?<\/div>\s*\)\}/, '');

// Replace the chart wrapping to always show
ph = ph.replace(/\{!isMobile && \(\s*<div className="w-full overflow-x-auto overflow-y-hidden pb-2">\s*<div className="relative w-full h-96">\s*<Line id="price-history-chart" ref={chartRef} options={options} data={data}  \/>\s*<\/div>\s*<\/div>\s*\)\}/, 
`      <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
        <div className="relative min-w-[600px] sm:min-w-0 w-full h-[300px] sm:h-96">
          <Line id="price-history-chart" ref={chartRef} options={options} data={data}  />
        </div>
      </div>`);
fs.writeFileSync('src/components/PriceHistory.tsx', ph);

// 2. Revert MarketComparison.tsx
let mc = fs.readFileSync('src/components/MarketComparison.tsx', 'utf8');

mc = mc.replace(/\{!isMobile && \(\s*<div className="w-full overflow-x-auto overflow-y-hidden pb-2 mb-8">\s*<div className="relative w-full h-96">\s*<Bar id="market-comparison-chart" ref={chartRef} options={marketOptions} data={marketData}  \/>\s*<\/div>\s*<\/div>\s*\)\}/,
`      <div className="w-full overflow-x-auto overflow-y-hidden pb-2 mb-8">
        <div className="relative min-w-[600px] sm:min-w-0 w-full h-[300px] sm:h-96">
          <Bar id="market-comparison-chart" ref={chartRef} options={marketOptions} data={marketData}  />
        </div>
      </div>`);
fs.writeFileSync('src/components/MarketComparison.tsx', mc);

// 3. Revert CropComparison.tsx
let cc = fs.readFileSync('src/components/CropComparison.tsx', 'utf8');

// Remove the mobile list
cc = cc.replace(/\{isMobile && \(\s*<div className="mt-4 space-y-4">[\s\S]*?<\/div>\s*\)\}/, '');

cc = cc.replace(/\{!isMobile && \(\s*<div className="w-full overflow-x-auto overflow-y-hidden pb-2">\s*<div className="relative w-full sm:h-\[400px\] lg:h-\[500px\]">\s*<Line id="crop-comparison-chart" ref={chartRef} data={data} options={options}  \/>\s*<\/div>\s*<\/div>\s*\)\}/,
`      <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
        <div className="relative min-w-[600px] sm:min-w-0 w-full h-[300px] sm:h-[400px] lg:h-[500px]">
          <Line id="crop-comparison-chart" ref={chartRef} data={data} options={options}  />
        </div>
      </div>`);
      
// Fix avgPrice calculation in CropComparison
cc = cc.replace(/const avgPrice = aggregatedCropData.reduce\(\(sum, d\) => sum \+ d.Avg_Price, 0\) \/ aggregatedCropData.length;/,
  `const avgPrice = aggregatedCropData.reduce((sum, d) => sum + Number(d.Avg_Price || 0), 0) / (aggregatedCropData.length || 1);`);

fs.writeFileSync('src/components/CropComparison.tsx', cc);

