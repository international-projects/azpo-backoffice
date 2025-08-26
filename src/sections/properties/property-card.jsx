/*
/=================================================================================================
/ FILE: /sections/properties/property-card.jsx
/=================================================================================================
/
/ This component displays a single property card with its images, details, and actions.
/ It uses the CustomPopover for edit/delete actions.
/
*/

import { Icon } from '@iconify/react';

import {
  Box,
  Chip,
  Card,
  Stack,
  MenuItem,
  MenuList,
  CardMedia,
  Typography,
  IconButton,
  ListItemText,
} from '@mui/material';

import { usePopover, CustomPopover } from 'src/components/custom-popover';

function PropertyCard({ property, onEdit, onDelete }) {
  const popover = usePopover();
  const { id, title, images, location, area, price, money_type, bed_room, bathroom, metrage } =
    property;

  // Corrected image URL as requested
  const getImageUrl = (index) =>
    images?.[index]?.file_name
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/files/property-images/${images[index].file_name}`
      : `https://placehold.co/600x400/e0e0e0/333?text=No+Image`;

  const bedRoomCount = parseInt(bed_room, 10) || 0;

  const currencyIcon = {
    dollar: 'mdi:currency-usd',
    euro: 'mdi:currency-eur',
    ruble: 'mdi:currency-rub',
  }[money_type];

  const renderImages = (
    <Box sx={{ p: 1, display: 'flex', gap: 1 }}>
      <Box sx={{ flexGrow: 1, position: 'relative' }}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            top: 8,
            left: 8,
            zIndex: 9,
            borderRadius: 1,
            bgcolor: 'grey.800',
            position: 'absolute',
            p: '2px 6px 2px 4px',
            color: 'common.white',
            typography: 'subtitle2',
          }}
        >
          <Icon icon={currencyIcon} width={16} style={{ marginRight: 4 }} />
          {price}
        </Stack>
        <CardMedia
          component="img"
          image={getImageUrl(0)}
          alt={title}
          sx={{ width: 1, height: 164, borderRadius: 1.5 }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <CardMedia
          component="img"
          image={getImageUrl(1)}
          alt={title}
          sx={{ borderRadius: 1.5, width: 80, height: 80 }}
        />
        <CardMedia
          component="img"
          image={getImageUrl(2)}
          alt={title}
          sx={{ borderRadius: 1.5, width: 80, height: 80 }}
        />
      </Box>
    </Box>
  );

  const renderTexts = (
    <ListItemText
      sx={{ p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5) }}
      primary={`ID: ${id}`}
      secondary={
        <Typography
          variant="subtitle1"
          onClick={onEdit}
          sx={{
            color: 'text.primary',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {title || 'Untitled Property'}
        </Typography>
      }
      primaryTypographyProps={{ typography: 'caption', color: 'text.disabled' }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: 'span',
      }}
    />
  );

  const renderInfo = (
    <Stack
      spacing={1.5}
      sx={{ position: 'relative', p: (theme) => theme.spacing(0, 2.5, 2.5, 2.5) }}
    >
      <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', bottom: 20, right: 8 }}>
        <Icon icon="eva:more-vertical-fill" />
      </IconButton>

      <Stack direction="row" alignItems="center" sx={{ typography: 'body2' }}>
        <Icon
          icon="mingcute:location-fill"
          width={16}
          style={{ marginRight: 8, color: 'error.main' }}
        />
        {location} {area && area !== '0' ? `, ${area}` : ''}
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ typography: 'body2' }}>
        {bedRoomCount > 0 && (
          <Chip
            icon={<Icon icon="mdi:bed-king-outline" />}
            label={`${bedRoomCount}`}
            size="small"
          />
        )}
        {bathroom > 0 && (
          <Chip icon={<Icon icon="mdi:shower" />} label={`${bathroom}`} size="small" />
        )}
        {metrage > 0 && (
          <Chip icon={<Icon icon="mdi:arrow-expand" />} label={`${metrage} sqm`} size="small" />
        )}
      </Stack>
    </Stack>
  );

  return (
    <>
      <Card>
        {renderImages}
        {renderTexts}
        {renderInfo}
      </Card>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              onEdit();
            }}
          >
            <Icon icon="solar:pen-bold" style={{ marginRight: 8 }} />
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              popover.onClose();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <Icon icon="solar:trash-bin-trash-bold" style={{ marginRight: 8 }} />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

// PropTypes validation removed to avoid build errors
// The component expects:
// - property: object with property data
// - onEdit: function to handle edit action
// - onDelete: function to handle delete action

export default PropertyCard;
