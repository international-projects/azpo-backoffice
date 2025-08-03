import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellUser({ params, onViewRow }) {
  // Handle different avatar formats from API
  const getAvatarUrl = (avatar) => {
    if (typeof avatar === 'string') {
      return avatar;
    }
    if (avatar && typeof avatar === 'object') {
      return avatar.url || avatar.secure_url || '';
    }
    return '';
  };

  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.name}
        src={getAvatarUrl(params.row.avatar)}
        sx={{ width: 48, height: 48, mr: 2 }}
      />

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.name}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.email}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function RenderCellRole({ params }) {
  return (
    <Chip
      label={params.row.role}
      size="small"
      color={params.row.role === 'ADMIN' ? 'error' : 'default'}
      variant="soft"
    />
  );
}

// ----------------------------------------------------------------------

export function RenderCellStatus({ params }) {
  const isDisabled = params.row.disabled;

  return (
    <Label variant="soft" color={isDisabled ? 'error' : 'success'}>
      {isDisabled ? 'Disabled' : 'Active'}
    </Label>
  );
}

// ----------------------------------------------------------------------

export function RenderCellCreatedAt({ params }) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.createdAt)}</Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdAt)}
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function RenderCellPhone({ params }) {
  return (
    <Box component="span" sx={{ typography: 'body2' }}>
      {params.row.phone || 'N/A'}
    </Box>
  );
}
