import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

import { fDate, fTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function RenderCellCategory({ params, onViewRow }) {
  // Handle different logo formats from API
  const getLogoUrl = (logo) => {
    if (typeof logo === 'string') {
      return logo;
    }
    if (logo && typeof logo === 'object') {
      return logo.path || logo.url || logo.secure_url || '';
    }
    return '';
  };

  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        alt={params.row.title}
        src={getLogoUrl(params.row.logo)}
        sx={{ width: 48, height: 48, mr: 2 }}
      >
        {params.row.title?.charAt(0)?.toUpperCase()}
      </Avatar>

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
            {params.row.title}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.sub_title || 'No subtitle'}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function RenderCellLanguage({ params }) {
  const lang = params.row.lang?.toUpperCase() || 'EN';
  
  return (
    <Chip
      label={lang}
      size="small"
      color={lang === 'EN' ? 'primary' : 'default'}
      variant="soft"
    />
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

export function RenderCellSubTitle({ params }) {
  return (
    <Box component="span" sx={{ typography: 'body2' }}>
      {params.row.sub_title || 'N/A'}
    </Box>
  );
} 