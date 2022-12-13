import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { styled } from '@mui/material/styles';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button, Menu, MenuItem, Stack } from '@mui/material';
import UserIcon from '@mui/icons-material/VerifiedUserRounded'
import { useNavigate, useNavigation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginResult } from '../models/account/user.model';

const drawerWidth = 200;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));


const AppNavbar = () => {
    const navigate = useNavigate()
    const { user } = useAuth();
    const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null)
    const open = Boolean(anchorElement)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElement(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorElement(null)
    }

    const handleNavigation = (to: string) => {
        handleClose()
        navigate(to);
    }

    return (
        <AppBar position='fixed' open={true}>
            <Toolbar>
                <Typography sx={{ flexGrow: 1 }}>

                </Typography>
                <Stack direction='row' spacing={2} sx={{
                    display: 'flex-end',
                    alignItems: 'center',
                }}>
                    <Button color='inherit' onClick={() => handleNavigation('/memory')}>Memory</Button>
                    <Button color='inherit' onClick={() => handleNavigation('/organization')}>Organization</Button>
                    {
                        user && (
                            <Button color='inherit' id='resources-button'
                                aria-controls={open ? 'resources-menu' : undefined}
                                aria-haspopup='true'
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                endIcon={<KeyboardArrowDownIcon />}
                            > {user?.userName} </Button>
                        )
                    }
                </Stack>
                <Menu id='resources-menu' anchorEl={anchorElement} open={open}
                    MenuListProps={{ 'aria-labelledby': 'resources-button' }}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    transitionDuration={500}
                >
                    <MenuItem onClick={() => handleNavigation('/profile')} > Profile </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/login')} > Logut </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}

export default AppNavbar