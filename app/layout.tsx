import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Springdale Floral PWA', description: 'Modern florist PWA with AI custom bouquet builder and order dashboard.', manifest: '/manifest.webmanifest' };
export const viewport: Viewport = { themeColor: '#7f5b4b' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}<script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));}`}} /></body></html>}
