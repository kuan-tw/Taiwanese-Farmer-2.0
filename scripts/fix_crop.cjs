const fs = require('fs');
let content = fs.readFileSync('src/components/CropComparison.tsx', 'utf8');

content = content.replace(
  `      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">`,
  `      )}\n      <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">`
);

content = content.replace(
`        })}
      </div>
      )}
    </div>
  );
};`,
`        })}
      </div>
    </div>
  );
};`
);

fs.writeFileSync('src/components/CropComparison.tsx', content);
