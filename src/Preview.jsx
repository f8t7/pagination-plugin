import React from 'react';
import { marked } from 'marked';

function Preview({ markdown }) {
  const pageHeight = 1123; // A4 高度（像素，96dpi）
  const html = marked(markdown);
  const lines = markdown.split('\n');
  let currentHeight = 0;
  let pages = [];
  let currentPage = [];

  // 简单分页：按行数和假设高度
  lines.forEach((line, index) => {
    const lineHeight = 20; // 假设每行 20px
    currentHeight += lineHeight;

    if (currentHeight >= pageHeight) {
      pages.push({ content: currentPage.join('\n'), startLine: index - currentPage.length });
      currentPage = [line];
      currentHeight = lineHeight;
    } else {
      currentPage.push(line);
    }
  });
  if (currentPage.length) {
    pages.push({ content: currentPage.join('\n'), startLine: lines.length - currentPage.length });
  }

  return (
    <div>
      {pages.map((page, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <div className="page-number">Page {index + 1}</div>
          <div dangerouslySetInnerHTML={{ __html: marked(page.content) }} />
          {index < pages.length - 1 && <div className="page-break" />}
        </div>
      ))}
    </div>
  );
}

export default Preview;