export const metadata = {
  title: 'Upload Page',
  description: 'Página para subir archivos al Blob Store.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
