'use client';

import { ReactNode } from 'react';
import { ToastProvider } from './ToastProvider';
import ServiceWorkerRegister from './ServiceWorkerRegister';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ServiceWorkerRegister />
      {children}
    </ToastProvider>
  );
}


