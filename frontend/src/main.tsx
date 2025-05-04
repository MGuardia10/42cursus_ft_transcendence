import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RouterApp from '@/router/RouterApp.tsx'
import { LanguageProvider } from '@/context/Language/LanguageProvider.tsx'
import { NotificationProvider } from '@/context/Notification/NotificationProvider.tsx'
import { AuthProvider } from '@/context/Auth/AuthProvider'
import './index.css'
import { FriendsProvider } from './context/Friends/FriendsProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <LanguageProvider>
        <FriendsProvider>
          <NotificationProvider>
            <main className='max-h-screen width-full font-primary scrollbar scrollbar-thumb-background-secondary scrollbar-track-background-primary overflow-y-scroll'>
              <RouterApp />
            </main>
          </NotificationProvider>
        </FriendsProvider>
      </LanguageProvider>
    </AuthProvider>
  </StrictMode>,
)
