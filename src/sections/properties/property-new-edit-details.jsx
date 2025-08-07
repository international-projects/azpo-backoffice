import 'react-quill/dist/quill.snow.css';

import ReactQuill from 'react-quill';
import { Controller, useFormContext } from 'react-hook-form';

// MUI Components
import { Card, Grid, Stack, MenuItem, TextField, CardHeader, CardContent } from '@mui/material';

export function PropertyNewEditDetails({ isMulti, options }) {
  const { control } = useFormContext();
  const { locs, types, typeHouses } = options;

  return (
    <Card>
      <CardHeader title="Property Details" />
      <CardContent>
        <Stack spacing={3}>
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Property Title"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Grid container spacing={2}>
            {/* Baths */}
            <Grid item xs={12} sm={isMulti ? 6 : 12}>
              <Controller
                name="baths"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Bathrooms"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            {isMulti && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="maxBaths"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Max Bathrooms" fullWidth />
                  )}
                />
              </Grid>
            )}

            {/* Beds */}
            <Grid item xs={12} sm={isMulti ? 6 : 12}>
              <Controller
                name="beds"
                control={control}
                render={({ field, fieldState: { error } }) =>
                  isMulti ? (
                    <TextField
                      {...field}
                      type="number"
                      label="Bedrooms"
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  ) : (
                    <TextField
                      {...field}
                      select
                      label="Bedrooms"
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    >
                      {['1', '2', '3', '4', '5', '+5'].map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </TextField>
                  )
                }
              />
            </Grid>
            {isMulti && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="maxBeds"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Max Bedrooms" fullWidth />
                  )}
                />
              </Grid>
            )}

            {/* SQT */}
            <Grid item xs={12} sm={isMulti ? 6 : 12}>
              <Controller
                name="sqt"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Area (sqm)"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            {isMulti && (
              <Grid item xs={12} sm={6}>
                <Controller
                  name="maxSqt"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} type="number" label="Max Area (sqm)" fullWidth />
                  )}
                />
              </Grid>
            )}
          </Grid>

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                placeholder="Write a detailed description..."
              />
            )}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
