import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './frontend/App';
import Viewer from './frontend/stream';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/stream/:sessionId" element={<Viewer/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);