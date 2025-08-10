import * as z from 'zod';
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
} from '@mui/material';

import { PropertyNewEditMedia } from './property-new-edit-media';
// Custom Components
import { PropertyNewEditDetails } from './property-new-edit-details';
import { PropertyNewEditFeatures } from './property-new-edit-features';

// Validation Schema with Zod
const PropertySchema = z.object({
  // isMulti: z.boolean(),
  // title: z.string().min(1, 'Title is required'),
  // description: z.string().optional(),
  // images: z.array(z.any()).min(1, 'At least one image is required'),
  // pdfs: z.array(z.any()).optional(),
  // baths: z.coerce.number().min(1, 'Required'),
  // maxBaths: z.coerce.number().optional(),
  // beds: z.string().min(1, 'Required'),
  // maxBeds: z.coerce.number().optional(),
  // sqt: z.coerce.number().min(1, 'Required'),
  // maxSqt: z.coerce.number().optional(),
  // locationValue: z.string().min(1, 'Location is required'),
  // areaValue: z.string().min(1, 'Area is required'),
  // typeValue: z
  //   .union([z.array(z.number()), z.number()])
  //   .refine((val) => (Array.isArray(val) ? val.length > 0 : !!val), {
  //     message: 'Type is required',
  //   }),
  // typeUnit: z
  //   .union([z.array(z.number()), z.number()])
  //   .refine((val) => (Array.isArray(val) ? val.length > 0 : !!val), {
  //     message: 'Unit type is required',
  //   }),
  // distShop: z.coerce.number().min(1, 'Required'),
  // shopType: z.string().min(1, 'Required'),
  // distAirport: z.coerce.number().min(1, 'Required'),
  // airportType: z.string().min(1, 'Required'),
  // distHospital: z.coerce.number().min(1, 'Required'),
  // hospitalType: z.string().min(1, 'Required'),
  // distSea: z.coerce.number().min(1, 'Required'),
  // seaType: z.string().min(1, 'Required'),
  // mapLink: z.string().url('Must be a valid URL'),
  // floor: z.coerce.number().min(0, 'Required'),
  // maxFloor: z.coerce.number().optional(),
  // ageOfBuilding: z.coerce.number().min(0, 'Required'),
  // minPrice: z.coerce.number().min(1, 'Required'),
  // maxPrice: z.coerce.number().optional(),
  // moneyType: z.enum(['dollar', 'euro', 'ruble']),
  // furnished: z.boolean(),
  // tags: z.array(z.number()).optional(),
  // features: z.array(z.number()).optional(),
  // heating: z.array(z.number()).optional(),
  // landscapes: z.array(z.number()).optional(),
});

export function PropertyNewEditForm({ currentProperty, options }) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      isMulti: currentProperty?.is_multi === 1 || false,
      title: currentProperty?.title || '',
      description: currentProperty?.details || '',
      images: currentProperty?.images || [],
      pdfs: currentProperty?.dowloads || [],
      baths: currentProperty?.bathroom || 1,
      maxBaths: currentProperty?.max_bath || undefined,
      beds: currentProperty?.bed_room || '',
      maxBeds: currentProperty?.max_bed || undefined,
      sqt: currentProperty?.metrage || 0,
      maxSqt: currentProperty?.max_sqt || undefined,
      locationValue: currentProperty?.location || '',
      areaValue: currentProperty?.area || '',
      typeValue: currentProperty?.is_multi
        ? currentProperty?.types?.map((t) => t.id) || []
        : currentProperty?.types?.[0]?.id || '',
      typeUnit: currentProperty?.is_multi
        ? currentProperty?.houseTypes?.map((ht) => ht.id) || []
        : currentProperty?.houseTypes?.[0]?.id || '',
      distShop: currentProperty?.dist_shopping || 0,
      shopType: currentProperty?.dist_shopping_type || 'm',
      distAirport: currentProperty?.dist_airport || 0,
      airportType: currentProperty?.dist_airport_type || 'km',
      distHospital: currentProperty?.dist_hospital || 0,
      hospitalType: currentProperty?.dist_hospital_type || 'm',
      distSea: currentProperty?.dist_sea || 0,
      seaType: currentProperty?.dist_sea_type || 'm',
      mapLink: currentProperty?.location_map || '',
      floor: currentProperty?.building_floor || 0,
      maxFloor: currentProperty?.max_floor || undefined,
      ageOfBuilding: currentProperty?.age_of_the_building || 0,
      minPrice: currentProperty?.price_min || 0,
      maxPrice: currentProperty?.price_max || undefined,
      moneyType: currentProperty?.money_type || 'dollar',
      furnished: currentProperty?.furnished_sale === 1 || false,
      tags: currentProperty?.tags?.map((t) => t.id) || [],
      features: currentProperty?.features?.map((f) => f.id) || [],
      heating: currentProperty?.heatingTypes?.map((h) => h.id) || [],
      landscapes: currentProperty?.landscapes?.map((l) => l.id) || [],
    }),
    [currentProperty]
  );

  const methods = useForm({
    resolver: zodResolver(PropertySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    setValue, // Destructure setValue from methods
    formState: { isSubmitting },
  } = methods;

  const isMultiValue = watch('isMulti');

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('Form Data:', data);
      // Here you would format and send the data to your API
      // Differentiate between create and update based on `currentProperty`
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
                    onChange={(e) => setValue('isMulti', e.target.checked)} // Use setValue directly
                    disabled={!!currentProperty} // Disable if editing
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
