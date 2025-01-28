import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solicitud de alta',
  description: 'Registrarse en página de la Municipalidad de Chamical.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        backgroundColor: '#fcfcfc',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </main>
  );
}
