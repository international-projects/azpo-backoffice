'use client';

import useSWR from 'swr';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

import { Box, Container, CircularProgress } from '@mui/material';

import { PropertyNewEditForm } from 'src/sections/properties/property-new-edit-form';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// SWR Fetcher
const fetcher = (url) => fetch(url).then((res) => res.json());
const multiFetcher = (urls) => Promise.all(urls.map((url) => fetch(url).then((res) => res.json())));

export default function PropertyEditPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  // Get locale from URL query parameter, default to 'en'
  const urlLocale = searchParams.get('locale');
  const [locale, setLocale] = useState(
    urlLocale && ['en', 'ru'].includes(urlLocale) ? urlLocale : 'en'
  );

  // Fetch property details and options in parallel
  const urls = [
    `${API_BASE_URL}/dashboard/properties/${id}/${locale}`, // Endpoint for a single property
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

  const propertyDetails = data?.[0];
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
      features: data[1],
      locs: data[2],
      types: data[3],
      tags: data[4],
      landscapesData: data[5],
      heating: data[6],
      typeHouses: data[7],
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

  return (
    <PropertyNewEditForm
      currentProperty={propertyDetails}
      options={options}
      locale={locale}
      onLocaleChange={setLocale}
    />
  );
}
