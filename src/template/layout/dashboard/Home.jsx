import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
// import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
// import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
// import TextField from '@mui/material/TextField';
// import Tooltip from '@mui/material/Tooltip';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import PropTypes from 'prop-types';
import * as React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import BusinessIcon from '@mui/icons-material/Business';
import ArticleIcon from '@mui/icons-material/Article';
import ScubaDivingIcon from '@mui/icons-material/ScubaDiving';
import SellIcon from '@mui/icons-material/Sell';
import ImportExportIcon from '@mui/icons-material/ImportExport';



const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'my-app',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    title: 'Abstract',
    icon: <ArticleIcon />,
    children: [
      {
        segment: 'my-App/Real-Property-Tax',
        title: 'Real Property Tax',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/General-Fund',
        title: 'General Fund',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/Trust-Fund',
        title: 'Trust Fund',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/community-tax-certificate',
        title: 'Community Tax Certificate',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/other-income-receipts',
        title: 'Other Income Receipts',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    title: 'Business',
    icon: <BusinessIcon />,
    children: [
      {
        segment: 'my-App/business-registration',
        title: 'Business Registration',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/mch',
        title: 'MCH',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/e-bike-trisikad',
        title: 'E_BIKE-TRISIKAD',
        icon: <DescriptionIcon />,
      },

    ]
  },
{
  title: 'Ticket',
    icon: <BookOnlineIcon />,
children: [ 
  {
  segment: 'dive-ticket',
  title: 'DIVING TICKET',
  icon: <ScubaDivingIcon />,
},
{
  segment: 'cash-ticket',
  title: 'CASH TICKET',
  icon: <SellIcon />,
},],
},
   {
    segment: 'calendar',
    title: 'CALENDAR',
    icon: <CalendarMonthIcon />,
  },
  {
    segment: 'import',
    title: 'Import',
    icon: <ImportExportIcon />,
    children: [
      {
        segment: 'my-App/import-general-fund',
        title: 'General Fund',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/import-trust-fund',
        title: 'Trust FUnd',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/import-real-property-tax',
        title: 'Real Property Tax',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/import-cedula  ',
        title: 'Cedula',
        icon: <DescriptionIcon />,
      },
    ]
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    title: 'Reports',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'my-App/business-card',
        title: 'Business Card',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/rpt-card',
        title: 'RPT Card',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/full-report',
        title: 'Full Report',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/rcd',
        title: 'RCD',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/esre',
        title: 'ESRE',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'my-App/collection',
        title: 'Summary of Collection Report',
        icon: <DescriptionIcon />,
      },
    ],
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// function Search() {
//   return (
//     <React.Fragment>
//       <Tooltip title="Search" enterDelay={1000}>
//         <div>
//           <IconButton
//             type="button"
//             aria-label="search"
//             sx={{
//               display: { xs: 'inline', md: 'none' },
//             }}
//           >
//             <SearchIcon />
//           </IconButton>
//         </div>
//       </Tooltip>
//       <TextField
//         label="Search"
//         variant="outlined"
//         size="small"
//         slotProps={{
//           input: {
//             endAdornment: (
//               <IconButton type="button" aria-label="search" size="small">
//                 <SearchIcon />
//               </IconButton>
//             ),
//             sx: { pr: 0.5 },
//           },
//         }}
//         sx={{ display: { xs: 'none', md: 'inline-block' }, mr: 1 }}
//       />
//     </React.Fragment>
//   );
// }

function DemoPageContent({ pathname }) {
  const breadcrumbItems = pathname.split('/').filter(Boolean);

  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',  // Ensure it takes full width
      }}
    >
      {/* Breadcrumbs container */}
      <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="#">
            Home
          </Link>
          {breadcrumbItems.map((item, index) => (
            <Link
              key={item}
              color={breadcrumbItems[breadcrumbItems.length - 1] === item ? 'text.primary' : 'inherit'}
              href={`/${breadcrumbItems.slice(0, index + 1).join('/')}`}
              aria-current={breadcrumbItems[breadcrumbItems.length - 1] === item ? 'page' : undefined}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </Breadcrumbs>
      </Box>
      {/* Content below the breadcrumbs */}
      <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
        <Outlet /> {/* Render nested routes here */}
      </Box>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutAccount(props) {
  const { window } = props;

  const [session, setSession] = React.useState({
    user: {
      name: 'Bharat Kashyap',
      email: 'bharatkashyap@outlook.com',
      image: 'https://avatars.githubusercontent.com/u/19550456',
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: 'Bharat Kashyap',
            email: 'bharatkashyap@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
          },
        });
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);
  
  const location = useLocation();
const navigate = useNavigate();
const pathname = `/my-app${location.pathname.startsWith('/my-app') ? location.pathname.slice(7) : location.pathname}`;

const router = React.useMemo(() => ({
  pathname,
  searchParams: new URLSearchParams(location.search),
  navigate: (path) => {
    const fullPath = path.startsWith('/my-app') ? path : `/my-app${path}`;
    console.log(`Navigating to: ${fullPath}`);
    navigate(fullPath);
  },
}), [pathname, navigate, location.search]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
      // preview-start
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
    // preview-end
  );
}

DashboardLayoutAccount.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutAccount;
