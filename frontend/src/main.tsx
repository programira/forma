
import { createRoot } from 'react-dom/client'
import React from 'react';
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import CssBaseline from '@mui/material/CssBaseline'; // Optional: Normalize styles
import theme from './styles/theme';
import { Provider } from 'react-redux'; // Import Redux Provider
import store from './store/store'; // Import your configured Redux store

createRoot(document.getElementById('root')!).render(
<React.StrictMode>
    <Provider store={store}> {/* Wrap with Redux Provider */}
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* Adds consistent global styles */}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
