import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { NavList } from './nav-list';
import { NavUl, NavLi } from '../styles';
import { navSectionClasses } from '../classes';
import { navSectionCssVars } from '../css-vars';

// ----------------------------------------------------------------------

export function NavSectionMini({
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
    ...navSectionCssVars.mini(theme),
    ...overridesVars,
  };

  return (
    <Stack component="nav" className={navSectionClasses.mini.root} sx={{ ...cssVars, ...sx }}>
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
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
      <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
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
