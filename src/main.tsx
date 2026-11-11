import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MeadowProvider, ToastProvider } from './index';
import Showcase from './pages/Showcase';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MeadowProvider vibe="personal">
      <ToastProvider>
        <Showcase />
      </ToastProvider>
    </MeadowProvider>
  </StrictMode>,
);
