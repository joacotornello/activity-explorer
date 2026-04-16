import React from 'react';
import ReactDOM from 'react-dom/client';

import { QueryProvider } from './app/providers/QueryProvider';
import { initializeI18n } from '@shared/i18n';
import { App } from './app/App';
import '@shared/styles/tokens.css';

initializeI18n();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>,
);
