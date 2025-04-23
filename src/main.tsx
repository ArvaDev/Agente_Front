import './main.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Chat from './assets/pages/chat';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Chat />,
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />  
  </StrictMode>,
)
