import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogProps, Typography } from '@mui/material'
import Box from "@mui/material/Box";
import { OrganizationTypeModel } from "../../../models/organization/organization-type/organizationTypeModel";
import { z, boolean, string, } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, FormProvider, useForm } from 'react-hook-form';
import FormInput from "../../../context/FormInput";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save'

const formData = z.object({
    id: string(),
    title: string().trim().min(1, 'Title is required'),
    active: boolean().default(true)
  });  

export type CrudAction = 'edit' | 'new' | undefined;

type IOrganizationTypeEditorProps = {
    organizationTypeModel: OrganizationTypeModel,
    onSubmitHandler: SubmitHandler<OrganizationTypeModel>,
    onHandleClose: () => void,
    loading: boolean,
    action: CrudAction
} & DialogProps;


const getTitle = (action: CrudAction) => {
    if (action?.toString() === 'new') {
        return 'Create Organization Type'
    }
    else if (action?.toString() === 'edit') {
        return 'Update Organization Type'
    }
    return 'Organization Type'
}

const OrganizationTypeEditor: React.FC<IOrganizationTypeEditorProps> = ({ action, open, onHandleClose, organizationTypeModel, onSubmitHandler, loading }) => {
    const [dialogTitle] = useState<string>(getTitle(action))
    const methods = useForm<OrganizationTypeModel>({
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
        reset(organizationTypeModel);
    }, [organizationTypeModel]);

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
                        organizationTypeModel?.title && <Typography color='secondary' sx={{ alignContent: 'center' }} component='h4'>
                            {organizationTypeModel.title} </Typography>
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

export default OrganizationTypeEditor