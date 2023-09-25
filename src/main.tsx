import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from "@material-tailwind/react"
import { ToastContainer } from 'react-toastify';
import App from './App.tsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
        <ToastContainer
          autoClose={3000}
          hideProgressBar
          position="top-center"
        />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
