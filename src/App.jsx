import React, { useState } from 'react';
import Editor from './Editor.jsx';
import Preview from './Preview.jsx';

function App() {
  const [markdown, setMarkdown] = useState('# Hello, Markdown!\n\nThis is a test.\n\n'.repeat(50));

  return (
    <div className="app">
      <div className="editor">
        <Editor value={markdown} onChange={setMarkdown} />
      </div>
      <div className="preview">
        <Preview markdown={markdown} />
      </div>
    </div>
  );
}

export default App;