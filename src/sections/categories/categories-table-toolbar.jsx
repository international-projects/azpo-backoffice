import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const LANGUAGE_OPTIONS = [
  { value: 'all', label: 'All Languages' },
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'fr', label: 'French' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'cn', label: 'Chinese' },
];

// ----------------------------------------------------------------------

export function CategoriesTableToolbar({
  filters,
  onFilters,
  languageOptions = LANGUAGE_OPTIONS,
  onResetFilters,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterLanguage = useCallback(
    (event) => {
      onFilters('language', event.target.value);
    },
    [onFilters]
  );

  const handleSearch = useCallback(() => {
    onFilters('name', searchQuery);
  }, [onFilters, searchQuery]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search categories..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            select
            label="Language"
            value={filters.language}
            onChange={handleFilterLanguage}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: { maxHeight: 220 },
                },
              },
            }}
            sx={{
              maxWidth: { md: 240 },
            }}
          >
            {languageOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:more-vertical-fill" />}
        >
          Actions
        </Button>
      </Stack>

      {onResetFilters && (
        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      )}
    </>
  );
}
