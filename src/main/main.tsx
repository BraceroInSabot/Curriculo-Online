import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@presentation/App';
import { DependenciesProvider } from '@presentation/context/DependenciesContext';
import '@presentation/styles/global.css';
import { createContainer } from './container';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Elemento #root não encontrado em index.html');

createRoot(rootElement).render(
  <StrictMode>
    <DependenciesProvider value={createContainer()}>
      <App />
    </DependenciesProvider>
  </StrictMode>,
);
