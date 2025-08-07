import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { NavList } from './nav-list';
import { NavUl, NavLi } from '../styles';
import { Scrollbar } from '../../scrollbar';
import { navSectionClasses } from '../classes';
import { navSectionCssVars } from '../css-vars';

// ----------------------------------------------------------------------

export function NavSectionHorizontal({
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
    ...navSectionCssVars.horizontal(theme),
    ...overridesVars,
  };

  return (
    <Scrollbar
      sx={{ height: 1 }}
      slotProps={{
        content: { height: 1, display: 'flex', alignItems: 'center' },
      }}
    >
      <Stack
        component="nav"
        direction="row"
        alignItems="center"
        className={navSectionClasses.horizontal.root}
        sx={{
          ...cssVars,
          mx: 'auto',
          height: 1,
          minHeight: 'var(--nav-height)',
          ...sx,
        }}
      >
        <NavUl sx={{ flexDirection: 'row', gap: 'var(--nav-item-gap)' }}>
          {data.map((group) => (
            <Group
              key={group.subheader ?? group.items[0].title}
              render={render}
              cssVars={cssVars}
              items={group.items}
              slotProps={slotProps}
              enabledRootRedirect={enabledRootRedirect}
              currentRole={currentRole}
            />
          ))}
        </NavUl>
      </Stack>
    </Scrollbar>
  );
}

// ----------------------------------------------------------------------

function Group({ items, render, slotProps, enabledRootRedirect, cssVars, currentRole }) {
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
      <NavUl sx={{ flexDirection: 'row', gap: 'var(--nav-item-gap)' }}>
        {filteredItems.map((list) => (
          <NavList
            key={list.title}
            depth={1}
            data={list}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            enabledRootRedirect={enabledRootRedirect}
            currentRole={currentRole}
          />
        ))}
      </NavUl>
    </NavLi>
  );
}
