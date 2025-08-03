import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CategoriesTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  sx,
  ...other
}) {
  const theme = useTheme();

  const handleRemoveKeyword = () => {
    onFilters('filter', '');
  };

  const handleRemoveLanguage = () => {
    onFilters('lang', '');
  };

  const hasFilter = !!(filters.filter || filters.lang !== '');

  if (!hasFilter) {
    return null;
  }

  return (
    <Stack spacing={1.5} sx={{ p: 2.5, ...sx }} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.filter && (
          <Block label="Search:">
            <Chip size="small" label={filters.filter} onDelete={handleRemoveKeyword} />
          </Block>
        )}

        {filters.lang !== '' && (
          <Block label="Language:">
            <Chip
              size="small"
              label={
                filters.lang === 'en' ? 'English' : filters.lang === 'fa' ? 'فارسی' : filters.lang
              }
              onDelete={handleRemoveLanguage}
            />
          </Block>
        )}

        <Button
          color="error"
          onClick={onResetFilters}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Clear
        </Button>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={0.5} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
