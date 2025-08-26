'use client';

import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Box, Container, CircularProgress } from '@mui/material';

import { PropertyNewEditForm } from 'src/sections/properties/property-new-edit-form';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.realestate.com/api';

// SWR Fetcher for multiple parallel requests
const multiFetcher = (urls) => Promise.all(urls.map((url) => fetch(url).then((res) => res.json())));

export default function PropertyCreatePage() {
  const searchParams = useSearchParams();

  // Get locale from URL query parameter, default to 'en'
  const urlLocale = searchParams.get('locale');
  const [locale, setLocale] = useState(
    urlLocale && ['en', 'ru'].includes(urlLocale) ? urlLocale : 'en'
  );
  const urls = [
    `${API_BASE_URL}/dashboard/properties/features/${locale}`,
    `${API_BASE_URL}/real-estates/locations/${locale}`,
    `${API_BASE_URL}/dashboard/properties/types/${locale}`,
    `${API_BASE_URL}/dashboard/properties/tags/${locale}`,
    `${API_BASE_URL}/dashboard/properties/landscapes/${locale}`,
    `${API_BASE_URL}/dashboard/properties/heating-types/${locale}`,
    `${API_BASE_URL}/dashboard/properties/house-types`,
  ];

  const { data, error } = useSWR([urls, locale], ([apiUrls]) => multiFetcher(apiUrls));

  const isLoading = !error && !data;

  const options = useMemo(() => {
    if (!data)
      return {
        locs: [],
        types: [],
        tags: [],
        features: [],
        landscapesData: [],
        heating: [],
        typeHouses: [],
      };
    return {
      features: data[0],
      locs: data[1],
      types: data[2],
      tags: data[3],
      landscapesData: data[4],
      heating: data[5],
      typeHouses: data[6],
    };
  }, [data]);

  if (isLoading) {
    return (
      <Container>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return <PropertyNewEditForm options={options} locale={locale} onLocaleChange={setLocale} />;
}
