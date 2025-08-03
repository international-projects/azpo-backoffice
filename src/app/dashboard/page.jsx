'use client';

import { useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';

import { OrderDetailsToolbar } from 'src/sections/order/order-details-toolbar';

// ----------------------------------------------------------------------

// export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const [status, setStatus] = useState('pending');
  const tabs = useTabs('content');
  const tabItems = [
    { value: 'content', label: 'Content' },
    { value: 'comments', label: 'Comments' },
    { value: 'history', label: 'History' },
  ];

  const handleChangeStatus = useCallback((newValue) => {
    setStatus(newValue);
  }, []);
  const renderTabs = (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {tabItems.map((tab) => (
        <Tab key={tab.value} iconPosition="end" value={tab.value} label={tab.label} />
      ))}
    </Tabs>
  );

  return (
    <DashboardContent>
      <OrderDetailsToolbar
        backLink="test"
        orderNumber="سفارش 37025"
        createdAt="1404/04/12 - بانک آینده"
        status={status}
        onChangeStatus={handleChangeStatus}
        statusOptions={[
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' },
        ]}
      />
      {renderTabs}
    </DashboardContent>
  );
}
