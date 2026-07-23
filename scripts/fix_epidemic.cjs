const fs = require('fs');
let code = fs.readFileSync('src/components/EpidemicList.tsx', 'utf8');

code = code.replace(
  `  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }`,
  `  if (loading) {
    return <LoadingSpinner type="epidemic" />;
  }`
);

fs.writeFileSync('src/components/EpidemicList.tsx', code);
