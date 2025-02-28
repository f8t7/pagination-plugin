import React, { useState } from 'react';
import Editor from './Editor.jsx';

function App() {
  const [markdown, setMarkdown] = useState('# Hello, Markdown!\n\nThis is a test.\n\n'.repeat(50));
  const [isPreview,setIsPreview]= useState(false);
  const toggleMode = ()=> setIsPreview(!isPreview);

  return (
    <div className="app">
    <div className="editor-container">
    <button onClick={toggleMode}>
          {isPreview ? '切换到编辑模式' : '切换到预览模式'}
        </button>
        <Editor
          value={markdown}
          onChange={setMarkdown}
          isPreview={isPreview}
        />
    </div>

    </div>
  );
}

export default App;