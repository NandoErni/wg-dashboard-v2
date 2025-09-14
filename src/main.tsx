import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import './global.css'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import App from './App.tsx'
import "./i18n";
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <App />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)