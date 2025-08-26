'use client';

import dynamic from 'next/dynamic';

// Dynamically import the component to avoid SSR issues
const PropertyCreateContent = dynamic(() => import('./create-content'), {
  ssr: false,
});

export default function PropertyCreatePage() {
  return <PropertyCreateContent />;
}
