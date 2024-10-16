//import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);

/* createRoot(document.getElementById('root')).render(
  <App />,
  <StrictMode>
    <App />
  </StrictMode>,
) */
