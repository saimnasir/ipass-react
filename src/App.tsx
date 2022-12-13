import './App.css';
import { Box, CssBaseline, PaletteMode, Stack, Typography } from '@mui/material';
import { IPassDrawer } from './components/IPassDrawer';
import AppNavbar from './components/AppNavbar';
import { Routes, Route } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styled, useTheme, ThemeProvider, createTheme, Theme, CSSObject } from '@mui/material/styles';
import { useState } from 'react';
import MemoryList from './components/memory/memory/MemoryList';
import MemoryDashboard from './components/dashBoard/MemoryDashboard';
import MemoryTypeList from './components/memory/memory-type/MemoryTypeList';
import MemoryApp from './components/memory/MemoryApp';
import LoginApp from './components/account/LoginApp';
import NewMemory from './components/memory/memory/NewMemory'; 
import EnvironmentTypeList from './components/environment-type/EnvironmentTypeList';
import NewEnvironmentType from './components/environment-type/EnvironmentTypeEditor';
import EnvironmentApp from './components/memory/EnvironmentApp';
import OrganizationApp from './components/organization/OrganizationApp';
import OrganizationList from './components/organization/organization/OrganizationList';
import OrganizationTypeList from './components/organization/organization-type/OrganizationTypeList';
import ProfileApp from './components/account/ProfileApp';
import HomeApp from './components/HomeApp';
import ExternalAuth from './components/account/ExternalAuth';
import MemoryHistory from './components/memory/memory/MemoryHistory';
import EditMemory from './components/memory/memory/EditMemory';
import ReadMemory from './components/memory/memory/ReadMemory';
import { useAuth } from './context/AuthContext'; 


function App() {

  const [mode, setMode] = useState<PaletteMode | undefined>('light')
  const theme = useTheme();
  const { user } = useAuth();
  return (
    <ThemeProvider
      theme={createTheme({
        components: {
          MuiListItemButton: {
            defaultProps: {
              disableTouchRipple: true,
            },
          },
        },
        palette: {
          mode: mode,
          // primary: { main: 'rgb(102, 157, 246)' },
          // background: { paper: 'rgb(5, 30, 52)' },
        },
      })}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          {
            user && (
              <>
                <AppNavbar />
                <IPassDrawer mode={mode} setMode={setMode} />
              </>
            )}
          <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
            <Routes>
              <Route path="/" element={<HomeApp />} />
              <Route path="login" element={<LoginApp />} />
              <Route path="profile" element={<ProfileApp />} />
              <Route path="external-auth" element={<ExternalAuth />} />
              <Route path="dashboard" element={<MemoryDashboard />} />

              <Route path="memory" element={<MemoryApp />}>
                <Route index element={<MemoryList />} />
                <Route path="new" element={<NewMemory />} />
                <Route path="edit/:id" element={<EditMemory />} />
                <Route path="read/:id" element={<ReadMemory />} />
                <Route path="history/:id" element={<MemoryHistory />} />
                <Route path="type" element={<MemoryTypeList />} />           
                {/* <Route path="type/edit/:id" element={<EditMemoryType />} />
                <Route path="type/read/:id" element={<ReadMemoryType />} /> */}
              </Route>

              <Route path="organization" element={<OrganizationApp />}>
                <Route index element={<OrganizationList />} />
                <Route path="type" element={<OrganizationTypeList />} />
              </Route>

              <Route path="environment-type" element={<EnvironmentApp />}>
                <Route index element={<EnvironmentTypeList />} />
              </Route>

            </Routes>
          </Box>
        </ Box>
      </LocalizationProvider>
    </ThemeProvider >
  );
}


export default App;
