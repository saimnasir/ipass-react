import React, { useEffect, useState } from 'react';
import { SubmitHandler, FormProvider, useForm } from 'react-hook-form';
import { OrganizationModel } from '../../../models/organization/organization/organizationModel';
import { LoadingButton } from '@mui/lab';
import { Box, Switch, FormControlLabel, DialogProps } from '@mui/material';
import FormInput from '../../../context/FormInput';
import FormSelect, { IOptions } from '../../../context/FormSelect';
import { z, boolean, string, } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import { Action } from '../../../models/enums/Actions';

const formData = z.object({
  id: string(),
  title: string().trim().min(1, 'Title is required'),
  organizationTypeId: string().min(1, 'Organization Type is required'),
  parentOrganizationId: string().nullable(),
  active: boolean().default(true)
});
 

type IOrganizationEditorProps = {
  organizationModel: OrganizationModel,
  onSubmitHandler: SubmitHandler<OrganizationModel>,
  onHandleClose: () => void,
  loading: boolean,
  action: Action,
  parentOrganizationOptions: IOptions[],
  organizationTypeOptions: IOptions[]
} & DialogProps;


const getTitle = (action: Action) => { 
  if (action == Action.Create) {
      return 'Create Organization'
  }
  else if (action == Action.Update) {
      return 'Update Organization'
  } else if (action == Action.Delete) {
      return 'Delete Organization'
  }
  return 'Organization'
}
const OrganizationEditor: React.FC<IOrganizationEditorProps> = ({ parentOrganizationOptions, organizationTypeOptions, action, open, onHandleClose, organizationModel, onSubmitHandler, loading }) => {
  const [createAnother, setCreateAnother] = useState<boolean>(true)
  const [dialogTitle, setDialogTitle] = useState<string>('')
  const methods = useForm<OrganizationModel>({
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
    reset(organizationModel);
    setDialogTitle(getTitle(action))
  }, [organizationModel]);

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
            organizationModel?.title && <Typography color='secondary' sx={{ alignContent: 'center' }} component='h4'>
              {organizationModel.title} </Typography>
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
                sx={{ mb: 2 }}
              />
              <FormSelect
                name='organizationTypeId'
                placeholder='Organization Type'
                required
                fullWidth
                label='Organization Type'
                sx={{ mb: 2 }}
                options={organizationTypeOptions}
              />

              <FormSelect
                name='parentOrganizationId'
                fullWidth
                label='Parent Organization'
                sx={{ mb: 2 }}
                options={parentOrganizationOptions.filter(f => f.value !== organizationModel?.id)}
              ></FormSelect>

              {
                action === Action.Create
                &&
                <FormControlLabel sx={{ width: '50%' }}
                  control={<Switch checked={createAnother} onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => setCreateAnother(checked)} />}
                  label="Create Another" />
              }
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

export default OrganizationEditor