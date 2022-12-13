import React, { FC, useEffect, useState } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, DialogProps, TextField, Stack, MenuItem } from '@mui/material'
import { PinCodeModel } from '../../../models/account/pin-code.model';
import { checkPinCode } from '../../../network/services/accountService';
import { AxiosResponse } from 'axios';
import { FinalResponse } from '../../../models/final-response';
import { SingleResponse } from '../../../models/single-response';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

export type IPinCodeDialogProps = {
    setPinCodeChecked: React.Dispatch<React.SetStateAction<boolean>>;
    pinCodeExpiration: number,
    setPinCodeExpiration: React.Dispatch<React.SetStateAction<number>>;
} & DialogProps;
const PinCodeDialog: FC<IPinCodeDialogProps> = ({ open, setPinCodeChecked, pinCodeExpiration: duration, setPinCodeExpiration: setDuration }) => {

    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const [code, setCode] = useState<string>('')
    const [apiResponse, setApiResponse] = useState<any>()

    const onSendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        fetchPinCode()
    }

    const fetchPinCode = () => {
        setLoading(true)
        checkPinCode({ code: code })
            .then((response: AxiosResponse<FinalResponse<SingleResponse<PinCodeModel>>>) => {
                setApiResponse(response.data)
            })
            .catch(err => {
                console.log('error', err)
            }).finally(() => {
                setLoading(false)
            });
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as string;
        setCode(value)
    }

    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as unknown as number;
        setDuration(value)
    }

    useEffect(() => {
        if (apiResponse) {
            if (apiResponse.success) {
                setPinCodeChecked(true)
            }
            else {
                const message = apiResponse?.message;
                console.log('error message', message)
            }
        }
    }, [apiResponse]);

    return (
        <>
            <Dialog
                fullWidth={true}
                //maxWidth='md'
                open={open}
                onClose={() => setCode('')}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-desc'>
                <DialogTitle sx={{ alignContent: 'center' }}>Pin Code Verification</DialogTitle>
                <DialogContent  >
                    <Stack spacing={2} >
                        <Stack spacing={2} >
                            <DialogContentText>
                                You must enter pin code for exposing private data.
                            </DialogContentText>
                        </Stack>
                        <Stack spacing={2} direction='row'>
                            <TextField 
                                id="pincode"
                                label="Pin Code"
                                color='secondary'
                                type="text"
                                variant="outlined"
                                value={code}
                                onChange={handleChange}
                                sx={{ width: '50%' }}
                                autoComplete="off"
                                autoFocus
                            />
                            <TextField label='Expires In '
                                select
                                value={duration}
                                onChange={handleDurationChange}
                                
                                color='secondary'
                                sx={{ width: '50%' }}
                            >
                                <MenuItem value={1}>1 Minute</MenuItem>
                                <MenuItem value={2}>2 Minute</MenuItem>
                                <MenuItem value={3}>3 Minute</MenuItem>
                                <MenuItem value={10}>10 Minute</MenuItem>
                            </TextField>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate('/memory')} color='primary'>Back To List</Button>
                    <LoadingButton loading={loading} onClick={onSendClick} color='success' loadingPosition='start'>Verify</LoadingButton>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default PinCodeDialog