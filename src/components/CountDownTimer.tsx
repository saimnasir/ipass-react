import { Box, Stack, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useCountdown } from '../hooks/useCountDown';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';


type ICountDownTimerProps = { targetDate: number }
const CountDownTimer: React.FC<ICountDownTimerProps> = ({ targetDate, ...otherPorps }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate);

    return (
        <ShowCounter
            days={days}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
        />
    );
}

type IShowCounterProps = { days: number, hours: number, minutes: number, seconds: number }
const ShowCounter: React.FC<IShowCounterProps> = ({ days, hours, minutes, seconds }) => {
    const [tooltipTitle, setTooltipTitle] = useState<string>('')
    useEffect(() => {
        let tooltip = 'Timer :';
        if (days > 0) {
            tooltip += ` ${days} days`
        }
        if (hours > 0) {
            tooltip += ` ${hours} hours`
        }
        if (minutes > 0) {
            tooltip += ` ${minutes} mins`
        }
        if (seconds > 0) {
            tooltip += ` ${seconds} seconds`
        }
        setTooltipTitle(tooltip)

    }, [days, hours, minutes, seconds])

    return (
        <Tooltip title={tooltipTitle} placement="top"  >
            <Stack direction='row' sx={{ m: 0, p: 0 }}>

                <TimerOutlinedIcon />
                {
                    days > 0 && <>
                        <DateTimeDisplay value={days} type={'Days'} isDanger={false} />:
                    </>
                }
                {
                    hours > 0 && <>
                        <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />:
                    </>
                }
                {
                    minutes > 0 && <>
                        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />:
                    </>
                }
                {
                    seconds > 0 && <>
                        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={seconds < 30} />
                    </>
                }

            </Stack>
        </Tooltip>
    );
};

type IDateTimeDisplayProps = { value: number | undefined, type: string, isDanger: boolean }

const DateTimeDisplay: React.FC<IDateTimeDisplayProps> = ({ value, type, isDanger }) => {
    return (
        <>
            {value && value > 0 && <Stack sx={{ px: 1, m: 0 }} direction='row'>
                <Typography component='p'  >{value < 10 && '0'}{value}</Typography>
            </Stack>}
        </>

    );
};

export default CountDownTimer