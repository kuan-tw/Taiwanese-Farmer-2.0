const fs = require('fs');

let file = fs.readFileSync('src/components/PestDiseaseInfo.tsx', 'utf8');

const parseTextFunc = `
  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    return text.split(/(https?:\\/\\/[^\\s()<>。，、！？；：\\n\\r]+)/g).map((part, i) => {
      if (part.startsWith('http')) {
        let url = part;
        let suffix = '';
        if (url.endsWith('.') || url.endsWith(',')) {
          suffix = url.slice(-1);
          url = url.slice(0, -1);
        }
        return (
          <React.Fragment key={i}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline break-all">
              {url}
            </a>
            {suffix}
          </React.Fragment>
        );
      }
      return part;
    });
  };
`;

file = file.replace(/const diagnosis = diagnoses\[selectedIndex\];/, parseTextFunc + '\n  const diagnosis = diagnoses[selectedIndex];');

file = file.replace(/\{diagnosis\.Question\}/, '{renderTextWithLinks(diagnosis.Question)}');
file = file.replace(/\{diagnosis\.Answer\}/, '{renderTextWithLinks(diagnosis.Answer)}');
file = file.replace(/\{diagnosis\.Provision\}/, '{renderTextWithLinks(diagnosis.Provision)}');

fs.writeFileSync('src/components/PestDiseaseInfo.tsx', file);
