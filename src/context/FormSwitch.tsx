import { FormControlLabel, FormControlLabelProps, FormHelperText, MenuItem, Switch, SwitchProps, TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// type ISwitchProps = { name: string; } & FormControlLabelProps & SwitchProps;
type ISwitchProps = { name: string; } & SwitchProps;
const FormSwitch: FC<ISwitchProps> = ({ name,  ...otherProps }) => {

    const { control, formState: { errors } } = useFormContext();
    const errorMessage: any = errors[name] ? errors[name]?.message : '';

    return (
        <Controller
            control={control}
            name={name}
            defaultValue=""
            render={({ field }) => (
                <>
                    <Switch
                        {...otherProps}
                        {...field}
                        sx={{ mb: 2 }}
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                    />
                    {
                        errorMessage && <FormHelperText >{errorMessage}</FormHelperText>
                    }
                </>

            )}
        />
    );
};

export default FormSwitch;