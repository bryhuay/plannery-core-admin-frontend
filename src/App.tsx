/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationProvider, usePathname } from './lib/navigation';
import { PlaneryProvider } from './context/PlaneryContext';
import RootLayout from './app/layout';
import DashboardPage from './app/page';
import EventosPage from './app/eventos/page';
import CrearEventoPage from './app/eventos/nuevo/page';
import DetalleEventoPage from './app/eventos/[id]/page';
import ProveedoresPage from './app/proveedores/page';
import CalendarioPage from './app/calendario/page';
import PagosPage from './app/pagos/page';
import EmpresasPage from './app/empresas/page';
import UsuariosPage from './app/usuarios/page';
import SuscripcionesPage from './app/suscripciones/page';
import ConfiguracionPage from './app/configuracion/page';
import UiKitPage from './app/ui-kit/page';
import PerfilPage from './app/perfil/page';
import NotificacionesPage from './app/notificaciones/page';
import LoginPage from './app/login/page';

function AppRouter() {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <LoginPage />;
  }
  if (pathname === '/' || pathname === '') {
    return <DashboardPage />;
  }
  if (pathname === '/eventos') {
    return <EventosPage />;
  }
  if (pathname === '/eventos/nuevo') {
    return <CrearEventoPage />;
  }
  if (pathname.startsWith('/eventos/')) {
    return <DetalleEventoPage />;
  }
  if (pathname === '/proveedores') {
    return <ProveedoresPage />;
  }
  if (pathname === '/calendario') {
    return <CalendarioPage />;
  }
  if (pathname === '/pagos') {
    return <PagosPage />;
  }
  if (pathname === '/empresas') {
    return <EmpresasPage />;
  }
  if (pathname === '/usuarios') {
    return <UsuariosPage />;
  }
  if (pathname === '/suscripciones') {
    return <SuscripcionesPage />;
  }
  if (pathname === '/configuracion') {
    return <ConfiguracionPage />;
  }
  if (pathname === '/ui-kit') {
    return <UiKitPage />;
  }
  if (pathname === '/perfil') {
    return <PerfilPage />;
  }
  if (pathname === '/notificaciones') {
    return <NotificacionesPage />;
  }

  return <DashboardPage />;
}

export default function App() {
  return (
    <NavigationProvider>
      <PlaneryProvider>
        <RootLayout>
          <AppRouter />
        </RootLayout>
      </PlaneryProvider>
    </NavigationProvider>
  );
}
