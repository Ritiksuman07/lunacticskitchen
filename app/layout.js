import './globals.css';

export const metadata = {
  title: 'Lunatics Kitchen MVP',
  description: 'Mobile-first ordering MVP for Lunatics Kitchen'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
