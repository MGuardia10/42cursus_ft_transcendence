import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RouterApp from '@/router/RouterApp.tsx'
import { LanguageProvider } from '@/context/Language/LanguageProvider.tsx'
import { NotificationProvider } from '@/context/Notification/NotificationProvider.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <NotificationProvider>
        <main className='max-h-screen width-full font-primary scrollbar scrollbar-thumb-background-secondary scrollbar-track-background-primary overflow-y-scroll'>
          <RouterApp />
        </main>
      </NotificationProvider>
    </LanguageProvider>
  </StrictMode>,
)
