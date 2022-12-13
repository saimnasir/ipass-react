import * as React from 'react';
import { styled, ThemeProvider, createTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon';
import { Button, ListSubheader, Menu, MenuItem, Stack, PaletteMode } from '@mui/material';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import menus, { IPassMenu } from '../AppMenus';
import { amber, blue, blueGrey } from '@mui/material/colors';
import Mode from './Mode';


const FireNav = styled(List)<{ component?: React.ElementType }>({
    '& .MuiListItemButton-root': {
        paddingLeft: 24,
        paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
        fontSize: 20,
    },
});


const CustomDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

type Props = {
    mode: PaletteMode | undefined,
    setMode: React.Dispatch<React.SetStateAction<PaletteMode | undefined>>
}

export const IPassDrawer = <PROPS extends Props,>({ mode, setMode, ...rest }: PROPS) => {

    const [openedMenu, setOpenedMenu] = React.useState<IPassMenu | null>(null);
    const [openedMenuChilds, setOpenedMenuChilds] = React.useState<IPassMenu[]>([]);
    const [selectedChild, setSelectedChild] = React.useState<IPassMenu | null>(null)

    const handleOpen = (app: IPassMenu) => {
        if (app === openedMenu) {
            setOpenedMenu(null)
            return
        }
        setOpenedMenu(app)
    }

    React.useEffect(() => {
        if (openedMenu) {
            setOpenedMenuChilds(openedMenu?.childs)
        } else {
            setOpenedMenuChilds([])
        }
    }, [openedMenu])

    const isOpen = (app: IPassMenu) => {
        return app === openedMenu;
    }

    return (

        <Box sx={{ display: 'flex' }}>
            <CustomDrawer variant="permanent" open={true}                >
                <FireNav component="nav" disablePadding>
                    <ListSubheader>
                        <ListItem button disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                            >
                                <Link
                                    component={RouterLink}
                                    to='/'
                                    underline="none"
                                    color='inherit' sx={{
                                        fontSize: 20
                                    }}>
                                    <ListItemIcon  >
                                        <Stack spacing={2} direction='row'>
                                            <CatchingPokemonIcon /><Typography component='h2'> React Mui</Typography>
                                        </Stack>
                                    </ListItemIcon>

                                </Link>
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                    </ListSubheader>
                    <ListItem button disablePadding sx={{ display: 'block' }} >
                        <ListItemButton >
                            <Mode mode={mode} setMode={setMode} />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    {
                        menus.map((app) => (
                            <>
                                {
                                    app.childs.length === 1 ?
                                        (
                                            <>
                                                <ListItemButton
                                                    alignItems="flex-start"
                                                    onClick={() => handleOpen(app)}
                                                    sx={{
                                                        px: 3,
                                                        pt: 2.5,
                                                        pb: 0,// isOpen(app) ? 0 : 2.5,
                                                        '&:hover, &:focus': { '& svg': { opacity: isOpen(app) ? 1 : 0 } },
                                                    }}
                                                >
                                                    {app.childs.map((child) => (

                                                        <Link
                                                            component={RouterLink}
                                                            to={`${app?.path}${child.path}`}
                                                            underline="none"
                                                            color='inherit'
                                                            onClick={() => setSelectedChild(child)}
                                                        >
                                                            <ListItemText primary={child.title} sx={{ opacity: 1 }} />
                                                        </Link>
                                                    ))}
                                                </ListItemButton>
                                                <Divider key={app.title + app.path} />

                                            </>
                                        )
                                        :
                                        (
                                            <> <ListItemButton
                                                alignItems="flex-start"
                                                onClick={() => handleOpen(app)}
                                                sx={{
                                                    px: 3,
                                                    pt: 2.5,
                                                    pb: 0,// isOpen(app) ? 0 : 2.5,
                                                    '&:hover, &:focus': { '& svg': { opacity: isOpen(app) ? 1 : 0 } },
                                                }}
                                            >
                                                <ListItemText
                                                    primary={app.title}
                                                    primaryTypographyProps={{
                                                        fontSize: 15,
                                                        fontWeight: 'medium',
                                                        lineHeight: '20px',
                                                        mb: '2px',
                                                    }}
                                                    secondary={app.description}
                                                    secondaryTypographyProps={{
                                                        noWrap: true,
                                                        fontSize: 12,
                                                        lineHeight: '16px',
                                                        color: isOpen(app) ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)',
                                                    }}
                                                    sx={{ my: 0 }}
                                                />
                                                <KeyboardArrowDown
                                                    sx={{
                                                        mr: -1,
                                                        opacity: 0,
                                                        transform: isOpen(app) ? 'rotate(-180deg)' : 'rotate(0)',
                                                        transition: '0.2s',
                                                    }}
                                                />
                                            </ListItemButton>
                                                {
                                                    openedMenu && (
                                                        <>
                                                            <List key={openedMenu.title}
                                                                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', ml:2 }}
                                                                component="nav"
                                                                aria-labelledby="nested-list-subheader"
                                                            >
                                                                {
                                                                    isOpen(app) && (
                                                                        <>
                                                                            {openedMenuChilds.map((child) => (
                                                                                <ListItem button key={child.title} disablePadding sx={{ display: 'block' }} >
                                                                                    <ListItemButton
                                                                                        sx={{
                                                                                            minHeight: 48,
                                                                                            justifyContent: 'initial',
                                                                                            px: 2.5,
                                                                                            bgcolor: child === selectedChild ? blueGrey[900] : 'background.paper',
                                                                                            // opacity:  child === selectedChild ? 1 : 0 
                                                                                            '&:hover, &:focus': { bgcolor: blueGrey['A700'] },
                                                                                        }}
                                                                                    >
                                                                                        <Link
                                                                                            component={RouterLink}
                                                                                            to={`${openedMenu.path}${child.path}`}
                                                                                            underline="none"
                                                                                            color='inherit'
                                                                                            onClick={() => setSelectedChild(child)}
                                                                                        >
                                                                                            <ListItemText primary={child.title} sx={{ opacity: 1 }} />
                                                                                        </Link>
                                                                                    </ListItemButton>
                                                                                </ListItem>
                                                                            ))}
                                                                        </>
                                                                    )
                                                                }
                                                            </List>
                                                            <Divider key={openedMenu.title + openedMenu.path} />
                                                        </>
                                                    )
                                                }

                                            </>
                                        )
                                }

                            </>
                        ))
                    }
                    <Divider />

                </FireNav>
            </CustomDrawer>
        </Box>
    );
}
