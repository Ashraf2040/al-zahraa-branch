// components/ToasterProvider.tsx
'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: { minWidth: 260 },
      }}
    />
  );
}
