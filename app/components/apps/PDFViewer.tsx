import React from 'react';

export default function PDFViewer() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <iframe 
        src="https://drive.google.com/file/d/15CVRIhP6VVB5kUqO5F8Q3rXjhrVvOvqI/preview" 
        width="100%" 
        height="100%" 
        style={{ border: 'none', flexGrow: 1 }} 
        title="Resume PDF Viewer"
        allow="autoplay"
      />
    </div>
  );
}
