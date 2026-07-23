const fs = require('fs');
let pl = fs.readFileSync('src/pages/ProductList.tsx', 'utf8');
pl = pl.replace(
  /useEffect\(\(\) => \{\n    if \(location\.state\?\.showEpidemics !== undefined\) \{\n      setShowEpidemics\(location\.state\.showEpidemics\);\n    \} else \{\n      setShowEpidemics\(false\);\n    \}\n  \}, \[location\.state\]\);/,
  `useEffect(() => {
    if (location.state?.reset) {
      setShowEpidemics(false);
      setSearchTerm('');
    } else if (location.state?.showEpidemics !== undefined) {
      setShowEpidemics(location.state.showEpidemics);
    }
  }, [location.state]);`
);
fs.writeFileSync('src/pages/ProductList.tsx', pl);
