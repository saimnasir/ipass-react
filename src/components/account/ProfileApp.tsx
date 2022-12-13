import React, { useEffect, useState } from 'react'
import { Box, Divider } from '@mui/material'
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab'
import EditProfile from './EditProfile';
import EditPinCode from './EditPinCode';
import { getProfile } from '../../network/services/accountService';
import { AxiosResponse } from 'axios';
import { FinalResponse } from '../../models/final-response';
import { SingleResponse } from '../../models/single-response';
import { ProfileModel } from '../../models/account/user.model';

const ProfileApp = () => {

  const [selectedTab, setSelectedTab] = React.useState<string>('Profile');
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>()
  const [profile, setProfile] = useState<ProfileModel>()

  useEffect(() => {
    fetchProfile();

  }, [])

  const fetchProfile = () => {
    setLoading(true)
    getProfile()
      .then((response: AxiosResponse<FinalResponse<SingleResponse<ProfileModel>>>) => {
        setProfile(response.data.data.data);
        setApiResponse(response.data)
      })
      .catch(err => {
        console.log('error', err)
      }).finally(() => {
        setLoading(false)
      });
  }

  useEffect(() => {
    // if (apiResponse) {
    //     console.log('apiResponse', apiResponse)
    // }
    if (apiResponse && !apiResponse?.success) {
      const message = apiResponse?.message;
      console.log('error message', message)
    }
  }, [apiResponse]);

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {
        profile ? (<TabContext value={selectedTab}>
          <TabList
            onChange={handleChangeTab}
            centered
            textColor="secondary"
            indicatorColor="secondary"
            sx={{ alignContent: 'center' }}
          >
            <Tab label='Profile' value='Profile' sx={{ alignContent: 'center' }} />
            <Tab label='Pin Code' value='PinCode' sx={{ alignContent: 'center' }} />
          </TabList>
          <Divider color='primary'></Divider>
          <TabPanel value="Profile" >
            <EditProfile profile={profile} setProfile={setProfile} />
          </TabPanel>
          <TabPanel value="PinCode" >
            <EditPinCode profile={profile} setProfile={setProfile}  />
          </TabPanel>

        </TabContext>) : (
          <>Loading..</>
        )

      }

    </Box>
  )
}

export default ProfileApp