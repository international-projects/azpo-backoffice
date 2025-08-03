import { z } from 'zod';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';

import { useBoolean } from 'src/hooks/use-boolean';

import { createCategory, updateCategory } from 'src/actions/categories';

import { toast } from 'src/components/snackbar';
import { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const CATEGORY_FORM_SCHEMA = z.object({
  title: z.string().min(1, 'Title is required'),
  sub_title: z.string().optional(),
  description: z.string().optional(),
  lang: z.string().min(1, 'Language is required'),
  logo: z.string().optional(),
});

const DEFAULT_VALUES = {
  title: '',
  sub_title: '',
  description: '',
  lang: 'EN',
  logo: '',
};

const LANGUAGE_OPTIONS = [
  { value: 'EN', label: 'English' },
  { value: 'FA', label: 'Farsi' },
];

// ----------------------------------------------------------------------

export function CategoriesFormView({ currentCategory, onClose, onSuccess }) {
  const loading = useBoolean();

  const methods = useForm({
    resolver: zodResolver(CATEGORY_FORM_SCHEMA),
    defaultValues: currentCategory || DEFAULT_VALUES,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data) => {
      try {
        loading.onTrue();

        const response = currentCategory
          ? await updateCategory(currentCategory._id, data)
          : await createCategory(data);

        toast.success(
          currentCategory ? 'Category updated successfully!' : 'Category created successfully!'
        );

        onSuccess?.();
        onClose?.();
      } catch (error) {
        console.error('Error saving category:', error);
        toast.error(error?.message || 'Something went wrong!');
      } finally {
        loading.onFalse();
      }
    },
    [currentCategory, loading, onClose, onSuccess]
  );

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        {currentCategory ? 'Edit Category' : 'Create Category'}
      </Typography>

      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <RHFTextField
                name="title"
                label="Title"
                placeholder="Enter category title"
                required
              />
            </Grid>

            <Grid xs={12} md={4}>
              <Controller
                name="lang"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth error={!!error} required>
                    <InputLabel>Language</InputLabel>
                    <Select {...field} label="Language" placeholder="Select language">
                      {LANGUAGE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid xs={12}>
              <RHFTextField
                name="sub_title"
                label="Sub Title"
                placeholder="Enter category subtitle"
                multiline
                rows={2}
              />
            </Grid>

            <Grid xs={12}>
              <RHFTextField
                name="description"
                label="Description"
                placeholder="Enter category description"
                multiline
                rows={4}
              />
            </Grid>

            <Grid xs={12} md={4}>
              <RHFTextField name="logo" label="Logo" placeholder="Enter category logo" />
            </Grid>

            <Grid xs={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>

                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  disabled={loading.value}
                >
                  {currentCategory ? 'Update' : 'Create'}
                </LoadingButton>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </FormProvider>
    </Card>
  );
}
