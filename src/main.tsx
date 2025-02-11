import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@material-tailwind/react";

import App from './frontend/App';
import Viewer from './frontend/stream';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<div>...</div>}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/stream/:sessionId" element={<Viewer />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);