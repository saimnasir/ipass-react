import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export type IOptions = {
    value: string   | undefined
    text: string | null | undefined
}

type ISelectProps = { name: string; options: IOptions[] } & TextFieldProps;
const FormSelect: FC<ISelectProps> = ({ name, options,  ...otherProps }) => {

    const { control, formState: { errors } } = useFormContext();
    const errorMessage: any = errors[name] ? errors[name]?.message : '';

    return (
        <Controller
            control={control}
            name={name}
            defaultValue=""
            render={({ field }) => (
                <TextField
                    select
                    {...otherProps}
                    {...field}
                    error={!!errors[name]}
                    helperText={errorMessage && errorMessage}
                    sx={{ mb: 2 }}
                >
                    {
                        options.map((option) => {
                            return <MenuItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.text}
                            </MenuItem>
                        })
                    }
                </TextField>
            )}
        />
    );
};

export default FormSelect;