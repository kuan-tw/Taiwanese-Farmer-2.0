const fs = require('fs');
let code = fs.readFileSync('src/pages/ProductDetailPage.tsx', 'utf8');

const backReplacement = `  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };`;

if (!code.includes('const handleBack')) {
  code = code.replace(
    "  const navigate = useNavigate();",
    "  const navigate = useNavigate();\n" + backReplacement
  );
  code = code.replace(/onClick=\{\(\) => navigate\(-1\)\}/g, "onClick={handleBack}");
  fs.writeFileSync('src/pages/ProductDetailPage.tsx', code);
}
