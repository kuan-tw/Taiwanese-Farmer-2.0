const fs = require('fs');

// Patch PriceHistory.tsx
let ph = fs.readFileSync('src/components/PriceHistory.tsx', 'utf8');
ph = ph.replace(/<div className="w-full overflow-x-auto overflow-y-hidden pb-2">\s*<div className="relative min-w-\[600px\] sm:min-w-0 w-full h-\[300px\] sm:h-96">\s*<Line id="price-history-chart" ref={chartRef} options={options} data={data}  \/>\s*<\/div>\s*<\/div>/g, 
`      <div className="hidden sm:block w-full overflow-x-auto overflow-y-hidden pb-2">
        <div className="relative w-full h-96">
          <Line id="price-history-chart" ref={chartRef} options={options} data={data}  />
        </div>
      </div>
      
      <div className="sm:hidden mt-4 space-y-3">
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {[...sortedData].reverse().map((item, idx) => (
            <div key={idx} className={\`p-3 rounded-lg flex justify-between items-center \${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}\`}>
              <div>
                <p className={\`text-sm font-medium \${isDarkMode ? 'text-gray-200' : 'text-gray-800'}\`}>{item.TransDate}</p>
                <p className={\`text-xs \${isDarkMode ? 'text-gray-400' : 'text-gray-500'}\`}>{item.Trans_Quantity.toLocaleString()} kg</p>
              </div>
              <div className="text-right">
                <p className={\`text-sm font-bold \${isDarkMode ? 'text-white' : 'text-gray-900'}\`}>\${item.Avg_Price.toFixed(2)}</p>
                <div className="flex gap-2 text-[10px]">
                  <span className="text-red-500">L: \${item.Lower_Price.toFixed(2)}</span>
                  <span className="text-green-500">H: \${item.Upper_Price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>`);
fs.writeFileSync('src/components/PriceHistory.tsx', ph);

// Patch MarketComparison.tsx
let mc = fs.readFileSync('src/components/MarketComparison.tsx', 'utf8');
mc = mc.replace(/<div className="w-full overflow-x-auto overflow-y-hidden pb-2 mb-6 sm:mb-8">\s*<div className="relative min-w-\[600px\] sm:min-w-0 w-full h-\[300px\] sm:h-96">\s*<Bar id="market-comparison-chart" ref={chartRef} options={marketOptions} data={marketData}  \/>\s*<\/div>\s*<\/div>/g,
`      <div className="hidden sm:block w-full overflow-x-auto overflow-y-hidden pb-2 mb-8">
        <div className="relative w-full h-96">
          <Bar id="market-comparison-chart" ref={chartRef} options={marketOptions} data={marketData}  />
        </div>
      </div>`);
fs.writeFileSync('src/components/MarketComparison.tsx', mc);

// Patch CropComparison.tsx
let cc = fs.readFileSync('src/components/CropComparison.tsx', 'utf8');
cc = cc.replace(/<div className="w-full overflow-x-auto overflow-y-hidden pb-2">\s*<div className="relative min-w-\[600px\] sm:min-w-0 w-full h-\[300px\] sm:h-\[400px\] lg:h-\[500px\]">\s*<Line id="crop-comparison-chart" ref={chartRef} data={data} options={options}  \/>\s*<\/div>\s*<\/div>/g,
`      <div className="hidden sm:block w-full overflow-x-auto overflow-y-hidden pb-2">
        <div className="relative w-full sm:h-[400px] lg:h-[500px]">
          <Line id="crop-comparison-chart" ref={chartRef} data={data} options={options}  />
        </div>
      </div>
      
      <div className="sm:hidden mt-4 space-y-4">
        {aggregatedCrops.map((crop, index) => {
          const latestPrice = crop.data.length > 0 ? crop.data[crop.data.length - 1].Avg_Price : 0;
          return (
            <div key={crop.cropCode} className={\`p-4 rounded-xl border-l-4 \${isDarkMode ? 'bg-gray-700/50' : 'bg-white'}\`} style={{ borderLeftColor: colors[index % colors.length].line }}>
              <div className="flex justify-between items-center mb-2">
                <h4 className={\`font-bold \${isDarkMode ? 'text-white' : 'text-gray-900'}\`}>{crop.cropName}</h4>
                <p className="text-lg font-bold text-blue-500">\${latestPrice.toFixed(2)}</p>
              </div>
              <div className="max-h-40 overflow-y-auto mt-2 space-y-1">
                {[...crop.data].reverse().slice(0, 7).map((d, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{d.TransDate}</span>
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>\${d.Avg_Price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>`);
fs.writeFileSync('src/components/CropComparison.tsx', cc);

