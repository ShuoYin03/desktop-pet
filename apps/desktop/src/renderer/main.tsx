import React from 'react';
import ReactDOM from 'react-dom/client';

const App: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
      <p>Desktop Pet shell ready.</p>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
