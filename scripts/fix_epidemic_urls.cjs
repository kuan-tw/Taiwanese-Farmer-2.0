const fs = require('fs');

let file = fs.readFileSync('src/pages/EpidemicDetailPage.tsx', 'utf8');

file = file.replace(
  /\{epidemic\.Prescription\.split\(\/\(https\?:\/\/\\[\^\\s\)\\]\+\)\/g\)\.map\(\(part, i\) => \{[\s\S]*?return part;\s*\}\)\}/,
  `{epidemic.Prescription.split(/(https?:\\/\\/[^\\s()<>。，、！？；：\\n\\r]+)/g).map((part, i) => {
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
              })}`
);

fs.writeFileSync('src/pages/EpidemicDetailPage.tsx', file);
