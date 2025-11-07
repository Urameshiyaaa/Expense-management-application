import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Auth } from './authentication/AuthState.tsx';


const ggClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "481430223598-jb0aqb7uvcbhinbik98plj5uoc6d02qe.apps.googleusercontent.com";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={ggClientId}>
      <Auth>
        <App />
      </Auth>
    </GoogleOAuthProvider>
  </StrictMode>
)
