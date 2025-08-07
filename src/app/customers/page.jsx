'use client';

import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import { paths } from 'src/routes/paths';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';

// ----------------------------------------------------------------------

export default function CustomersPage() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  return (
    <>
      <Helmet>
        <title> Customer Requests | Minimal UI</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <div>
          <h1>Customer Requests</h1>
          <p>Welcome to the Customer Requests page, {user?.username || 'User'}!</p>
          <p>This page is accessible only to full_admin users.</p>
        </div>
      </Container>
    </>
  );
}
