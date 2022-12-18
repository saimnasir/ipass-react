import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogProps, Typography } from '@mui/material'
import Box from "@mui/material/Box";
 import { z, boolean, string, } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, FormProvider, useForm } from 'react-hook-form';
import FormInput from "../../context/FormInput";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save'
import { TenantModel } from '../../models/account/tenant';
import { Action } from '../../models/enums/Actions';

const formData = z.object({
    id: string(),
    title: string().trim().min(1, 'Title is required'),
    active: boolean().default(true)
  });  

type ITenantEditorProps = {
    tenantModel: TenantModel,
    onSubmitHandler: SubmitHandler<TenantModel>,
    onHandleClose: () => void,
    loading: boolean,
    action: Action
} & DialogProps;

const getTitle = (action: Action) => { 
    if (action == Action.Create) {
        return 'Create Tenant'
    }
    else if (action == Action.Update) {
        return 'Update Tenant'
    } else if (action == Action.Delete) {
        return 'Delete Tenant'
    }
    return 'Tenant'
}
 
const TenantEditor: React.FC<ITenantEditorProps> = ({ action, open, onHandleClose, tenantModel, onSubmitHandler, loading }) => {
    const [dialogTitle, setDialogTitle] = useState<string>('')
    const methods = useForm<TenantModel>({
        resolver: zodResolver(formData),
    });

    const {
        handleSubmit,
        reset,
        formState: { isSubmitSuccessful, errors }
    } = methods;

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    useEffect(() => {
        reset(tenantModel);
        setDialogTitle(getTitle(action))
    }, [tenantModel]);

    return (
        <>
            <Dialog
                fullWidth={true}
                open={open}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-desc'
                closeAfterTransition={true}
                onClose={onHandleClose}
            >
                <DialogTitle sx={{ alignContent: 'center' }}> 
                    <Typography   sx={{ alignContent: 'center' }} component='h1'>
                        {dialogTitle}</Typography>
                    {
                        tenantModel?.title && <Typography color='secondary' sx={{ alignContent: 'center' }} component='h4'>
                            {tenantModel.title} </Typography>
                    }
                </DialogTitle>
                <DialogContent  >
                    <FormProvider {...methods}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmitHandler)}
                            noValidate
                            autoComplete="off"
                            sx={{
                                m: 2,
                            }}
                        >
                            <FormInput
                                name='title'
                                required
                                fullWidth
                                label='Title'
                                autoFocus
                            />
                            <DialogActions>
                                <Button type='button' onClick={onHandleClose} color='primary'>Discard</Button>
                                <LoadingButton
                                    size='large'
                                    variant='contained'
                                    type='submit'
                                    loading={loading}
                                    color='success'
                                    sx={{ ml: 8 }}
                                    loadingPosition='start'
                                    startIcon={<SaveIcon />}
                                >
                                    Save
                                </LoadingButton>
                            </DialogActions>
                        </Box>
                    </FormProvider>
                </DialogContent>

            </Dialog>

        </>
    )
}

export default TenantEditor