/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationProvider, usePathname } from './lib/navigation';
import { PlaneryProvider } from './context/PlaneryContext';
import RootLayout from './app/layout';
import DashboardPage from './app/page';
import EventsPage from './app/events/page';
import CreateEventPage from './app/events/new/page';
import EventDetailPage from './app/events/[id]/page';
import ProvidersPage from './app/providers/page';
import CalendarPage from './app/calendar/page';
import PaymentsPage from './app/payments/page';
import CompaniesPage from './app/companies/page';
import UsersPage from './app/users/page';
import SubscriptionsPage from './app/subscriptions/page';
import SettingsPage from './app/settings/page';
import UiKitPage from './app/ui-kit/page';
import ProfilePage from './app/profile/page';
import NotificationsPage from './app/notifications/page';
import LoginPage from './app/login/page';

function AppRouter() {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <LoginPage />;
  }
  if (pathname === '/' || pathname === '') {
    return <DashboardPage />;
  }
  if (pathname === '/events' || pathname === '/eventos') {
    return <EventsPage />;
  }
  if (pathname === '/events/new' || pathname === '/eventos/nuevo') {
    return <CreateEventPage />;
  }
  if (pathname.startsWith('/events/') || pathname.startsWith('/eventos/')) {
    return <EventDetailPage />;
  }
  if (pathname === '/providers' || pathname === '/proveedores') {
    return <ProvidersPage />;
  }
  if (pathname === '/calendar' || pathname === '/calendario') {
    return <CalendarPage />;
  }
  if (pathname === '/payments' || pathname === '/pagos') {
    return <PaymentsPage />;
  }
  if (pathname === '/companies' || pathname === '/empresas') {
    return <CompaniesPage />;
  }
  if (pathname === '/users' || pathname === '/usuarios') {
    return <UsersPage />;
  }
  if (pathname === '/subscriptions' || pathname === '/suscripciones') {
    return <SubscriptionsPage />;
  }
  if (pathname === '/settings' || pathname === '/configuracion') {
    return <SettingsPage />;
  }
  if (pathname === '/ui-kit') {
    return <UiKitPage />;
  }
  if (pathname === '/profile' || pathname === '/perfil') {
    return <ProfilePage />;
  }
  if (pathname === '/notifications' || pathname === '/notificaciones') {
    return <NotificationsPage />;
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
