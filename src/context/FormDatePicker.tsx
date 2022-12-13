import { TextField, TextFieldProps } from '@mui/material';
import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { FC, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type IFormDatePicker = { name: string; required: boolean, label: string, inputFormat: string }
const FormDatePicker: FC<IFormDatePicker> = ({ name, required, label, inputFormat, ...otherProps }) => {

    const { control, formState: { errors } } = useFormContext();
    const errorMessage: any = errors[name] ? errors[name]?.message : '';


    return (
        <Controller
            control={control}
            name={name}
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
                <DesktopDatePicker
                    value={value}
                    onChange={onChange}
                    {...otherProps}
                    renderInput={(params) =>
                        <TextField
                            fullWidth
                            required={required}
                            {...params}
                            error={!!errors[name]}
                            helperText={errorMessage}
                            sx={{ mb: 2 }}
                            onBlur={onBlur}
                            value={value} />
                    }
                />
            )}
        />
    );
};

export default FormDatePicker; 