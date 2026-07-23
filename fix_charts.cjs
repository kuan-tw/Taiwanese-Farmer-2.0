const fs = require('fs');

function applyFix(filePath, chartTag, isBar = false) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add useState and useEffect if not present
  if (!content.includes('useState(window.innerWidth < 640)')) {
    content = content.replace(/import React, {([^}]+)} from 'react';/, "import React, { $1, useState, useEffect } from 'react';");
    content = content.replace(/const chartRef = useRef<any>\(null\);/, 
      "const chartRef = useRef<any>(null);\n  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);\n  useEffect(() => {\n    const handleResize = () => setIsMobile(window.innerWidth < 640);\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);");
  }

  // PriceHistory & CropComparison (Line), MarketComparison (Bar)
  // We need to replace the hidden sm:block and sm:hidden divs with React conditional rendering
  
  if (filePath.includes('PriceHistory')) {
    content = content.replace(/<div className="hidden sm:block w-full overflow-x-auto overflow-y-hidden pb-2">\s*<div className="relative w-full h-96">\s*<Line id="price-history-chart" ref={chartRef} options={options} data={data}  \/>\s*<\/div>\s*<\/div>/g, 
`      {!isMobile && (
        <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
          <div className="relative w-full h-96">
            <Line id="price-history-chart" ref={chartRef} options={options} data={data}  />
          </div>
        </div>
      )}`);
    content = content.replace(/<div className="sm:hidden mt-4 space-y-3">/g, `{isMobile && (\n      <div className="mt-4 space-y-3">`);
    content = content.replace(/<\/div>\s*<\/div>\s*<div className={`mt-4 p-4 rounded-lg \${isDarkMode \? 'bg-gray-700' : 'bg-gray-50'}`}>\s*<h4/g, `        </div>\n      </div>\n      )}\n\n      <div className={\`mt-4 p-4 rounded-lg \${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}\`}>\n        <h4`);
  }

  if (filePath.includes('MarketComparison')) {
    content = content.replace(/<div className="hidden sm:block w-full overflow-x-auto overflow-y-hidden pb-2 mb-8">\s*<div className="relative w-full h-96">\s*<Bar id="market-comparison-chart" ref={chartRef} options={marketOptions} data={marketData}  \/>\s*<\/div>\s*<\/div>/g, 
`      {!isMobile && (
        <div className="w-full overflow-x-auto overflow-y-hidden pb-2 mb-8">
          <div className="relative w-full h-96">
            <Bar id="market-comparison-chart" ref={chartRef} options={marketOptions} data={marketData}  />
          </div>
        </div>
      )}`);
      
    // For MarketComparison, the table is shown for both, but wait, the table is currently shown for both mobile and desktop.
    // It doesn't have a sm:hidden part for the chart. Let's just make sure the table is fine.
  }

  if (filePath.includes('CropComparison')) {
    content = content.replace(/<div className="hidden sm:block w-full overflow-x-auto overflow-y-hidden pb-2">\s*<div className="relative w-full sm:h-\[400px\] lg:h-\[500px\]">\s*<Line id="crop-comparison-chart" ref={chartRef} data={data} options={options}  \/>\s*<\/div>\s*<\/div>/g, 
`      {!isMobile && (
        <div className="w-full overflow-x-auto overflow-y-hidden pb-2">
          <div className="relative w-full sm:h-[400px] lg:h-[500px]">
            <Line id="crop-comparison-chart" ref={chartRef} data={data} options={options}  />
          </div>
        </div>
      )}`);
    content = content.replace(/<div className="sm:hidden mt-4 space-y-4">/g, `{isMobile && (\n      <div className="mt-4 space-y-4">`);
    content = content.replace(/<\/div>\s*\);\s*}\)}\s*<\/div>\s*<\/div>\s*\);\s*};/g, `          </div>\n          );\n        })}\n      </div>\n      )}\n    </div>\n  );\n};`);
  }

  fs.writeFileSync(filePath, content);
}

applyFix('src/components/PriceHistory.tsx');
applyFix('src/components/MarketComparison.tsx');
applyFix('src/components/CropComparison.tsx');
