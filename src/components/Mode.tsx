import { Button, FormControl, FormControlLabel, FormLabel, PaletteMode, Radio, RadioGroup, Stack } from '@mui/material'
import React, { useEffect } from 'react'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
    mode: PaletteMode | undefined,
    setMode: React.Dispatch<React.SetStateAction<PaletteMode | undefined>>
}

const Mode = <PROPS extends Props,>({ mode, setMode, ...rest }: PROPS) => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const [darkMode, setDarkMode] = React.useState(prefersDarkMode);

    useEffect(() => {
        setDarkMode(prefersDarkMode);
    }, [prefersDarkMode]);
    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
        setMode(!darkMode ? 'light' : 'dark')
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMode(event.target.value as PaletteMode)
    }
    return (
        <Stack spacing={2} sx={{ my: 2 }}>
            {/* <FormControl >
                <FormLabel id='job-experience-group-label'> Mode</FormLabel>
                <RadioGroup name='job-experience-group'
                    aria-aria-labelledby='job-experience-group-label'
                    value={mode}
                    onChange={handleChange}
                    row
                >
                    <FormControlLabel label='Light' value='light'
                        control={<Radio icon={<LightModeIcon />} checked={mode == 'light'} />}
                    /> 
                    <FormControlLabel label='Dark' value='dark'
                        control={<Radio icon={<DarkModeIcon />} checked={mode == 'dark'} />}
                    />

                </RadioGroup>

            </FormControl> */}
            <Button onClick={handleDarkModeToggle}  >{!darkMode ? <LightModeIcon /> : <DarkModeIcon />}</Button>
        </Stack>
    )
}

export default Mode