const fs = require('fs');
let code = fs.readFileSync('src/components/PriceHistory.tsx', 'utf8');

const target = `      <div className="w-full overflow-x-auto overflow-y-hidden pb-2">`;
const insertion = `      {/* Mobile List View */}
      <div className="sm:hidden mt-6 space-y-3">
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
      </div>

      <div className="hidden sm:block w-full overflow-x-auto overflow-y-hidden pb-2">`;

code = code.replace(target, insertion);
fs.writeFileSync('src/components/PriceHistory.tsx', code);
