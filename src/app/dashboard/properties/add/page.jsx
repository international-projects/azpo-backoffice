/*
/=================================================================================================
/ FILE: /app/dashboard/properties/new/page.jsx
/=================================================================================================
*/

'use client';

import { PropertyNewEditForm } from 'src/sections/properties/property-new-edit-form';

export default function PropertyCreatePage() {
  // You would fetch the property data here for editing
  // const { property } = useGetProperty(id);
  // return <PropertyNewEditForm currentProperty={property} />;
  return <PropertyNewEditForm />;
}
