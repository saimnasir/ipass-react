import {
    Box,
    Divider,
    ListItemButton,
    Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { LoadingButton } from '@mui/lab';  
import SaveIcon from '@mui/icons-material/Save'

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { IOptions } from '../context/FormSelect';
import { MouseEventHandler } from 'react';

type ITransferProps = {
    saveRight: MouseEventHandler | undefined,
    loading: boolean
}

function not(a: IOptions[], b: IOptions[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: IOptions[], b: IOptions[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const TransferList: React.FC<ITransferProps> = ({ saveRight, loading }) => {

    const [checked, setChecked] = React.useState<IOptions[]>([]);
    const [all, setAll] = React.useState<IOptions[]>([]);
    const [left, setLeft] = React.useState<IOptions[]>([]);
    const [right, setRight] = React.useState<IOptions[]>([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(() => {
        setLeft(getDifference(all, right))
    }, [right]);

    useEffect(() => {
        fetchUserTenants()
    }, [all]);

    const getDifference = (array1: IOptions[], array2: IOptions[]) => {
        return array1.filter(object1 => {
            return !array2.some(object2 => {
                return object1.value === object2.value;
            });
        });
    }

    const handleToggle = (value: IOptions) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const customList = (items: IOptions[], header: string) => (
        <Paper sx={{ width: 300, height: 300, overflow: 'auto' }} elevation={4}>
            <List dense component="div" role="list">
                <Typography variant='h6' align='center'>{header}</Typography>
                <Divider></Divider>
                {items.map((value: IOptions) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItemButton
                            key={value.value}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.text} />
                        </ListItemButton>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );

    return (
        <Box>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item>{customList(left, "Available Tenants")}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="large"
                            onClick={handleAllRight}
                            disabled={left.length === 0}
                            aria-label="move all right"
                        >
                            ≫
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="large"
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
                            &gt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="large"
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
                            &lt;
                        </Button>
                        <Button
                            sx={{ my: 0.5 }}
                            variant="outlined"
                            size="large"
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
                            ≪
                        </Button>

                        <LoadingButton
                            variant='contained'
                            type='button'
                            size="large"
                            loading={loading}
                            color='primary'
                            sx={{ my: 0.5 }}
                            loadingPosition='start'
                            onClick={saveRight}
                            startIcon={<SaveIcon />}
                        >
                            Save
                        </LoadingButton>
                    </Grid>
                </Grid>
                <Grid item>{customList(right, "User Tenants")}</Grid>
            </Grid>
        </Box>
    );
}


export default TransferList

function fetchUserTenants() {
    throw new Error('Function not implemented.');
}

