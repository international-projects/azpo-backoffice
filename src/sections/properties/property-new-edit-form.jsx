import * as z from 'zod';
import useSWR from 'swr';
import { useMemo, useState } from 'react';
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
} from '@mui/material';

import { PropertyNewEditMedia } from './property-new-edit-media';
// Custom Components
import { PropertyNewEditDetails } from './property-new-edit-details';
import { PropertyNewEditFeatures } from './property-new-edit-features';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://api.realestate.com/api';

// SWR Fetcher
const fetcher = (url) => fetch(url).then((res) => res.json());

// Hook to fetch all form options
function usePropertyOptions() {
  const { data, error } = useSWR(`${API_BASE_URL}/dashboard/property-options`, fetcher); // Replace with your actual endpoint
  return {
    options: data || {
      locs: [],
      types: [],
      tags: [],
      features: [],
      heating: [],
      landscapesData: [],
      typeHouses: [],
    },
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

  // Details
  baths: z.number().min(1, 'Required'),
  maxBaths: z.number().optional(),
  beds: z.string().min(1, 'Required'),
  maxBeds: z.number().optional(),
  sqt: z.number().min(1, 'Required'),
  maxSqt: z.number().optional(),
  locationValue: z.string().min(1, 'Location is required'),
  areaValue: z.string().min(1, 'Area is required'),
  typeValue: z.array(z.number()).min(1, 'Type is required'),
  typeUnit: z.array(z.number()).min(1, 'Unit type is required'),

  // Distances
  distShop: z.number().min(1, 'Required'),
  shopType: z.string().min(1, 'Required'),
  distAirport: z.number().min(1, 'Required'),
  airportType: z.string().min(1, 'Required'),
  distHospital: z.number().min(1, 'Required'),
  hospitalType: z.string().min(1, 'Required'),
  distSea: z.number().min(1, 'Required'),
  seaType: z.string().min(1, 'Required'),

  mapLink: z.string().url('Must be a valid URL'),
  floor: z.number().min(0, 'Required'),
  maxFloor: z.number().optional(),
  ageOfBuilding: z.number().min(0, 'Required'),

  // Pricing
  minPrice: z.number().min(1, 'Required'),
  maxPrice: z.number().optional(),
  moneyType: z.enum(['dollar', 'euro', 'ruble']),
  furnished: z.boolean(),

  // Features
  tags: z.array(z.number()).optional(),
  features: z.array(z.number()).optional(),
  heating: z.array(z.number()).optional(),
  landscapes: z.array(z.number()).optional(),
});

export function PropertyNewEditForm({ currentProperty }) {
  const router = useRouter();
  const { options, isLoading: isLoadingOptions } = usePropertyOptions();
  const [isMulti, setIsMulti] = useState(currentProperty?.isMulti || false);

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

  // Watch the isMulti field to conditionally render fields
  const isMultiValue = watch('isMulti');

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Form Data:', data);
      // Example POST request
      // await fetch(`${API_BASE_URL}/dashboard/create/en`, {
      //   method: 'POST',
      //   body: JSON.stringify(data),
      // });
      router.push('/dashboard/properties');
    } catch (error) {
      console.error(error);
    }
  });

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
