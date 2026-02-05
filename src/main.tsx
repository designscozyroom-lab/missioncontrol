import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './index.css'
import App from './App.tsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {convex ? (
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    ) : (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="font-serif-display text-2xl text-ink-900 mb-4">Mission Control</h1>
          <p className="text-ink-500 mb-4">Convex not configured. Run:</p>
          <code className="bg-ink-900 text-cream-100 px-4 py-2 rounded block">
            npx convex dev
          </code>
        </div>
      </div>
    )}
  </StrictMode>,
)
