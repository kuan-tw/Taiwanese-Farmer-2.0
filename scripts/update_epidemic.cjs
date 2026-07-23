const fs = require('fs');
let code = fs.readFileSync('src/pages/EpidemicDetailPage.tsx', 'utf8');

const renderLinkReplacement = `
  const renderTextWithLinks = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(https?:\\/\\/[^\\s()<>。，、！？；：\\n\\r]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('http')) {
        return (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };
`;

code = code.replace(
  "  const epidemic = location.state?.epidemic as PlantEpidemic;",
  renderLinkReplacement + "\n  const epidemic = location.state?.epidemic as PlantEpidemic;"
);

code = code.replace(
  "{epidemic.Body}",
  "{renderTextWithLinks(epidemic.Body)}"
);

code = code.replace(
  "{epidemic.Prescription.split(/(https?:\\/\\/[^\\s)]+)/g).map((part, i) => {\n                if (part.match(/(https?:\\/\\/[^\\s)]+)/)) {\n                  return (\n                    <a key={i} href={part} target=\"_blank\" rel=\"noopener noreferrer\" className=\"text-blue-500 hover:text-blue-600 underline break-all\">\n                      {part}\n                    </a>\n                  );\n                }\n                return part;\n              })}",
  "{renderTextWithLinks(epidemic.Prescription)}"
);

fs.writeFileSync('src/pages/EpidemicDetailPage.tsx', code);
