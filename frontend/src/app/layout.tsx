import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stock Manager - Sistema de Gestión Inteligente',
  description: 'Plataforma completa de gestión de stock y reservas con autenticación SSO empresarial',
  keywords: ['stock', 'inventario', 'gestión', 'reservas', 'keycloak', 'sso'],
  authors: [{ name: 'FRRe - Facultad Regional Resistencia' }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <div className="relative min-h-screen">
          <div className="ambient-blur" aria-hidden="true" />
          <div className="subtle-grid" aria-hidden="true" />
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

