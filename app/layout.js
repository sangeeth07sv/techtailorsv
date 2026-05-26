// app/layout.js
import './globals.css'
import { AuthProvider } from '../lib/auth-context'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'Sankirthi Designers - Billing System',
  description: 'Professional tailoring shop billing and customer management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-900 text-dark-100 min-h-screen">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e1e1e',
                color: '#e8e8e8',
                border: '1px solid #2a2a2a',
                fontFamily: 'Lato, sans-serif',
              },
              success: {
                iconTheme: { primary: '#D4AF37', secondary: '#0a0a0a' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
