const fs = require('fs');

let pl = fs.readFileSync('src/pages/ProductList.tsx', 'utf8');
pl = pl.replace(
  /const \[showEpidemics, setShowEpidemics\] = useState\(location\.state\?\.showEpidemics \|\| false\);/,
  `const [showEpidemics, setShowEpidemics] = useState(location.state?.showEpidemics || false);

  useEffect(() => {
    if (location.state?.showEpidemics !== undefined) {
      setShowEpidemics(location.state.showEpidemics);
    } else {
      setShowEpidemics(false);
    }
  }, [location.state]);`
);
fs.writeFileSync('src/pages/ProductList.tsx', pl);

