import './globals.css';
import { Providers } from './providers';
import { ConfirmModal } from './(anon)/_components/common/modal/ConfirmModal';
import Header from '@/(anon)/_components/common/header/Header';
import PWAInstallPrompt from '@/(anon)/_components/common/PWAInstallPrompt';
import GuestBanner from '@/(anon)/_components/common/GuestBanner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, viewport-fit=cover'
        />
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icons/apple-touch-icon.png' />
        <link rel='icon' href='/icons/icon-192x192.png' />
      </head>
      <body className='font-sans'>
        <Providers>
          <GuestBanner />
          <Header />
          <div>{children}</div>

          <ConfirmModal />

          {/* 전역 PWA 설치 프롬프트 */}
          <PWAInstallPrompt />

          {/* Toast Container */}
          <ToastContainer
            position='top-right'
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
            className='toast-container'
          />
        </Providers>
      </body>
    </html>
  );
}
