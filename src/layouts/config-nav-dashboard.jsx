import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  categories: icon('ic-folder'),
  building: icon('ic-building'),
  document: icon('ic-document'),
  customer: icon('ic-customer'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */

  /**
   * Property Management
   */
  {
    subheader: 'Property Management',
    items: [
      {
        title: 'All Properties',
        path: paths.dashboard.properties.root,
        icon: ICONS.building,
        roles: ['full_admin', 'data_entry'],
      },
      /*    {
        title: 'PLP Documents',
        path: paths.dashboard.plpDocs.root,
        icon: ICONS.document,
        roles: ['full_admin'],
      },
      {
        title: 'Customer Requests',
        path: paths.dashboard.customers.root,
        icon: ICONS.customer,
        roles: ['full_admin'],
      }, */
    ],
  },
  /**
   * Management
   */
  /*  {
    subheader: 'Management',
    items: [
      {
        title: 'User Management',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
      },
      {
        title: 'Categories',
        path: paths.dashboard.categories.root,
        icon: ICONS.categories,
      },
    ],
  }, */
];
