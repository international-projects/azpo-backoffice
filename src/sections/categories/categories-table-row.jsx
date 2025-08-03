import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';

import {
  RenderCellCategory,
  RenderCellLanguage,
  RenderCellSubTitle,
  RenderCellCreatedAt,
} from './categories-table-row-render';

// ----------------------------------------------------------------------

export function CategoriesTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onEditRow,
  onDeleteRow,
}) {
  const theme = useTheme();
  const confirm = usePopover();

  const handleDelete = () => {
    onDeleteRow();
    confirm.onFalse();
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{
            p: theme.spacing(2, 2.5),
            borderRadius: 2,
            position: 'relative',
            ...(selected && {
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.12),
              },
            }),
          }}
        >
          <Checkbox
            disableRipple
            checked={selected}
            onClick={onSelectRow}
            icon={<Iconify icon="solar:checkbox-blank-circle-outline" />}
            checkedIcon={<Iconify icon="solar:checkbox-circle-bold" />}
          />

          <Stack
            spacing={2}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{ flexGrow: 1, minWidth: 0 }}
          >
            <RenderCellCategory params={{ row }} onViewRow={onViewRow} />

            <RenderCellSubTitle params={{ row }} />

            <RenderCellLanguage params={{ row }} />

            <RenderCellCreatedAt params={{ row }} />
          </Stack>

          <IconButton color="default">
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Box>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
