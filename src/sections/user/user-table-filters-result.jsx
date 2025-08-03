import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
];

const STATUS_OPTIONS = [
  { value: false, label: 'Active' },
  { value: true, label: 'Disabled' },
];

// ----------------------------------------------------------------------

export function UserTableFiltersResult({ filters, onFilters, onResetFilters, results, onClose }) {
  const handleFilterName = (event) => {
    onFilters('name', event.target.value);
  };

  const handleFilterRole = (event) => {
    onFilters('role', event.target.value);
  };

  const handleFilterStatus = (event) => {
    onFilters('status', event.target.value);
  };

  const hasFilter = !!(filters.name || filters.role || filters.status);

  return (
    <Stack spacing={2.5}>
      {hasFilter && (
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2">
              <strong>{results}</strong>
              <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
                results found
              </Box>
            </Typography>

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
      )}
    </Stack>
  );
}
