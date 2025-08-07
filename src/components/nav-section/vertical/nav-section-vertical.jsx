import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { NavList } from './nav-list';
import { navSectionClasses } from '../classes';
import { navSectionCssVars } from '../css-vars';
import { NavUl, NavLi, Subheader } from '../styles';

// ----------------------------------------------------------------------

export function NavSectionVertical({
  sx,
  data,
  render,
  slotProps,
  enabledRootRedirect,
  cssVars: overridesVars,
  currentRole,
}) {
  const theme = useTheme();

  const cssVars = {
    ...navSectionCssVars.vertical(theme),
    ...overridesVars,
  };

  return (
    <Stack component="nav" className={navSectionClasses.vertical.root} sx={{ ...cssVars, ...sx }}>
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.map((group) => (
          <Group
            key={group.subheader ?? group.items[0].title}
            subheader={group.subheader}
            items={group.items}
            render={render}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
            currentRole={currentRole}
          />
        ))}
      </NavUl>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Group({ subheader, items, render, slotProps, enabledRootRedirect, currentRole }) {
  const theme = useTheme();

  const filteredItems = items.filter((item) => {
    // If no roles are specified, show the item
    if (!item.roles) {
      return true;
    }
    // If roles are specified, check if current role is included
    return item.roles.includes(currentRole);
  });

  // Don't render the group if no items are visible
  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <NavLi>
      {subheader && (
        <Subheader
          disableSticky
          sx={{
            ...(theme.direction === 'rtl' && {
              '& .MuiTypography-root': { typography: 'caption' },
            }),
          }}
        >
          {subheader}
        </Subheader>
      )}

      <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
        {filteredItems.map((list) => (
          <NavList
            key={list.title}
            data={list}
            render={render}
            depth={1}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
            currentRole={currentRole}
          />
        ))}
      </NavUl>
    </NavLi>
  );
}
