import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Same global styles/fonts as src/main.tsx, plus Lane E component styles and
// this lane's own v1.css (loaded last so it wins).
import '../styles/tokens.css';
import '../styles/film.css';
import '../styles/rails.css';
import '../styles/white.css';
import '../components/dom/lane-e.css';
import 'lenis/dist/lenis.css';
import './v1.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
