import React, { useEffect, useState } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogProps, Typography } from '@mui/material'
import Box from "@mui/material/Box";
import { MemoryTypeModel } from "../../../models/memory/memory-type/memoryTypeModel";
import { z, boolean, string, } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, FormProvider, useForm } from 'react-hook-form';
import FormInput from "../../../context/FormInput";
import { LoadingButton } from "@mui/lab";
import SaveIcon from '@mui/icons-material/Save'
import { Action } from '../../../models/enums/Actions';

const formData = z.object({
    id: string(),
    title: string().trim().min(1, 'Title is required'),
    organizationTypeId: string().min(1, 'Organization Type is required'),
    parentOrganizationId: string(),
    active: boolean().default(true)
});


type IMemoryTypeEditorProps = {
    memoryTypeModel: MemoryTypeModel,
    onSubmitHandler: SubmitHandler<MemoryTypeModel>,
    onHandleClose: () => void,
    loading: boolean,
    action: Action
} & DialogProps;


const getTitle = (action: Action) => { 
    if (action == Action.Create) {
        return 'Create Memory Type'
    }
    else if (action == Action.Update) {
        return 'Update Memory Type'
    } else if (action == Action.Delete) {
        return 'Delete Memory Type'
    }
    return 'Memory Type'
}

const MemoryTypeEditor: React.FC<IMemoryTypeEditorProps> = ({ action, open, onHandleClose, memoryTypeModel, onSubmitHandler, loading }) => {
    const [dialogTitle, setDialogTitle] = useState<string>('')
    const methods = useForm<MemoryTypeModel>({
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
        reset(memoryTypeModel);
        setDialogTitle(getTitle(action))
    }, [memoryTypeModel]);

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
                    <Typography sx={{ alignContent: 'center' }} component='h1'>
                        {dialogTitle}</Typography>
                    {
                        memoryTypeModel?.title && <Typography color='secondary' sx={{ alignContent: 'center' }} component='h4'>
                            {memoryTypeModel.title} </Typography>
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

export default MemoryTypeEditor