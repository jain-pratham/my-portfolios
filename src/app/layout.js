import './globals.css';
import BackgroundFX from '@/components/BackgroundFX';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BackgroundFX />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
