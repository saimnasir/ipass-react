import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Box, Divider } from '@mui/material'
import Tab from '@mui/material/Tab';
import Login from './Login';
import { TabContext, TabList, TabPanel } from '@mui/lab'
import Register from './Register';
import ExternalAccount from './ExternalAccount';

const LoginApp = () => {

    const [selectedTab, setSelectedTab] = React.useState<string>('Login');
    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };


    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <TabContext value={selectedTab}>
                <TabList
                    onChange={handleChangeTab}
                    centered
                    textColor="secondary"
                    indicatorColor="secondary"
                    sx={{ alignContent: 'center' }}
                >
                    <Tab label='Login' value='Login' sx={{ alignContent: 'center' }} />
                    <Tab label='Register' value='Register' sx={{ alignContent: 'center' }} />
                </TabList>
                <TabPanel value="Login" >
                    <Login />
                </TabPanel>
                <TabPanel value="Register" >
                    <Register />
                </TabPanel>

            </TabContext>
            <ExternalAccount />
        </Box>
    )
}

export default LoginApp