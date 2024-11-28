
import { createRoot } from 'react-dom/client'
import React from 'react';
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import CssBaseline from '@mui/material/CssBaseline'; // Optional: Normalize styles
import theme from './styles/theme';

createRoot(document.getElementById('root')!).render(
<React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Optional: Adds consistent global styles */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
