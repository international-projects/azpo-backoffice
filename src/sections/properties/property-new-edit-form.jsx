'use client';

import * as z from 'zod';
import useSWR from 'swr';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

// MUI Components
import {
  Box,
  Grid,
  Stack,
  Button,
  Switch,
  Container,
  Typography,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';

import { PropertyNewEditMedia } from './property-new-edit-media';
// Custom Components
import { PropertyNewEditDetails } from './property-new-edit-details';
import { PropertyNewEditFeatures } from './property-new-edit-features';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.realestate.com/api';

// SWR Fetcher for multiple parallel requests
const multiFetcher = (urls) => Promise.all(urls.map((url) => fetch(url).then((res) => res.json())));

// Hook to fetch all form options
function usePropertyOptions() {
  const locale = 'en'; // Or get from context/params
  const urls = [
    `${API_BASE_URL}/dashboard/properties/features/${locale}`,
    `${API_BASE_URL}/real-estates/locations/${locale}`,
    `${API_BASE_URL}/dashboard/properties/types/${locale}`,
    `${API_BASE_URL}/dashboard/properties/tags/${locale}`,
    `${API_BASE_URL}/dashboard/properties/landscapes/${locale}`,
    `${API_BASE_URL}/dashboard/properties/heating-types/${locale}`,
    `${API_BASE_URL}/dashboard/properties/house-types`,
  ];

  const { data, error } = useSWR(urls, multiFetcher);

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

  return {
    options,
    isLoading: !error && !data,
    isError: error,
  };
}

// Validation Schema with Zod
const PropertySchema = z.object({
  isMulti: z.boolean(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  images: z.array(z.any()).min(1, 'At least one image is required'),
  pdfs: z.array(z.any()).optional(),
  baths: z.coerce.number().min(1, 'Required'),
  maxBaths: z.coerce.number().optional(),
  beds: z.string().min(1, 'Required'),
  maxBeds: z.coerce.number().optional(),
  sqt: z.coerce.number().min(1, 'Required'),
  maxSqt: z.coerce.number().optional(),
  locationValue: z.string().min(1, 'Location is required'),
  areaValue: z.string().min(1, 'Area is required'),
  typeValue: z.array(z.number()).min(1, 'Type is required'),
  typeUnit: z.array(z.number()).min(1, 'Unit type is required'),
  distShop: z.coerce.number().min(1, 'Required'),
  shopType: z.string().min(1, 'Required'),
  distAirport: z.coerce.number().min(1, 'Required'),
  airportType: z.string().min(1, 'Required'),
  distHospital: z.coerce.number().min(1, 'Required'),
  hospitalType: z.string().min(1, 'Required'),
  distSea: z.coerce.number().min(1, 'Required'),
  seaType: z.string().min(1, 'Required'),
  mapLink: z.string().url('Must be a valid URL'),
  floor: z.coerce.number().min(0, 'Required'),
  maxFloor: z.coerce.number().optional(),
  ageOfBuilding: z.coerce.number().min(0, 'Required'),
  minPrice: z.coerce.number().min(1, 'Required'),
  maxPrice: z.coerce.number().optional(),
  moneyType: z.enum(['dollar', 'euro', 'ruble']),
  furnished: z.boolean(),
  tags: z.array(z.number()).optional(),
  features: z.array(z.number()).optional(),
  heating: z.array(z.number()).optional(),
  landscapes: z.array(z.number()).optional(),
});

export function PropertyNewEditForm({ currentProperty }) {
  const router = useRouter();
  const { options, isLoading: isLoadingOptions } = usePropertyOptions();

  const defaultValues = useMemo(
    () => ({
      isMulti: currentProperty?.isMulti || false,
      title: currentProperty?.title || '',
      description: currentProperty?.description || '',
      images: currentProperty?.images || [],
      pdfs: currentProperty?.pdfs || [],
      baths: currentProperty?.baths || 1,
      maxBaths: currentProperty?.maxBaths || undefined,
      beds: currentProperty?.beds || '',
      maxBeds: currentProperty?.maxBeds || undefined,
      sqt: currentProperty?.sqt || 0,
      maxSqt: currentProperty?.maxSqt || undefined,
      locationValue: currentProperty?.locationValue || '',
      areaValue: currentProperty?.areaValue || '',
      typeValue: currentProperty?.typeValue || [],
      typeUnit: currentProperty?.typeUnit || [],
      distShop: currentProperty?.distShop || 0,
      shopType: currentProperty?.shopType || 'm',
      distAirport: currentProperty?.distAirport || 0,
      airportType: currentProperty?.airportType || 'km',
      distHospital: currentProperty?.distHospital || 0,
      hospitalType: currentProperty?.hospitalType || 'm',
      distSea: currentProperty?.distSea || 0,
      seaType: currentProperty?.seaType || 'm',
      mapLink: currentProperty?.mapLink || '',
      floor: currentProperty?.floor || 0,
      maxFloor: currentProperty?.maxFloor || undefined,
      ageOfBuilding: currentProperty?.ageOfBuilding || 0,
      minPrice: currentProperty?.minPrice || 0,
      maxPrice: currentProperty?.maxPrice || undefined,
      moneyType: currentProperty?.moneyType || 'dollar',
      furnished: currentProperty?.furnished || false,
      tags: currentProperty?.tags || [],
      features: currentProperty?.features || [],
      heating: currentProperty?.heating || [],
      landscapes: currentProperty?.landscapes || [],
    }),
    [currentProperty]
  );

  const methods = useForm({
    resolver: zodResolver(PropertySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const isMultiValue = watch('isMulti');

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Form Data:', data);
      // Here you would format the data to match the API payload from your old `insertProperty` function
      router.push('/dashboard/properties');
    } catch (error) {
      console.error(error);
    }
  });

  if (isLoadingOptions) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <FormProvider {...methods}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ mb: 3 }}>
          {currentProperty ? 'Edit Property' : 'Add New Property'}
        </Typography>
        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isMultiValue}
                    onChange={(e) => control.setValue('isMulti', e.target.checked)}
                  />
                }
                label="Is this a project (multiple units)?"
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <PropertyNewEditDetails isMulti={isMultiValue} options={options} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <PropertyNewEditMedia />
                <PropertyNewEditFeatures options={options} />
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {currentProperty ? 'Save Changes' : 'Create Property'}
            </Button>
          </Box>
        </form>
      </Container>
    </FormProvider>
  );
}
