
import { useEffect, useState } from "react";
import { Box, Card, CardContent, FormControlLabel, Grid, Paper, Stack, Switch, TextField } from "@mui/material";
import { MemoryModel } from "../../../models/memory/memory/memoryModel";
import { IOptions } from "../../../context/FormSelect";
import { blue, purple, yellow } from "@mui/material/colors";
import { styled } from '@mui/material/styles';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

type ICaptionKeyPair = { caption: string, key: string, order: number }
type IColumnValuePair = { column: string, value: string | boolean | undefined | null, order: number, isChanged: boolean }

const memoryCaptionKeyPairs: ICaptionKeyPair[] = [
    {
        caption: 'Title',
        key: 'title',
        order: 1
    },
    {
        caption: 'Organization',
        key: 'organizationId',
        order: 2
    },
    {
        caption: 'Memory Type',
        key: 'memoryTypeId',
        order: 3
    },
    {
        caption: 'Environment Type',
        key: 'environmentTypeId',
        order: 4
    },
    {
        caption: 'Username',
        key: 'userName',
        order: 5
    },
    {
        caption: 'Email',
        key: 'email',
        order: 7
    },
    {
        caption: 'Is username encrypted',
        key: 'isUserNameSecure',
        order: 6
    },
    {
        caption: 'Is email encrypted',
        key: 'isUEmailSecure',
        order: 8
    },
    {
        caption: 'Host/IP Address',
        key: 'hostOrIpAddress',
        order: 9
    },
    {
        caption: 'Is host/IP address encrypted',
        key: 'isHostOrIpAddressSecure',
        order: 10
    },
    {
        caption: 'Port',
        key: 'port',
        order: 11
    },
    {
        caption: 'Is port encrypted',
        key: 'isPortSecure',
        order: 12
    },
    {
        caption: 'Password',
        key: 'password',
        order: 13
    },
    {
        caption: 'Description',
        key: 'description',
        order: 14
    },
    {
        caption: 'Is active',
        key: 'active',
        order: 15
    },
]

type IMemoryHistoryItemProps = {
    memory: MemoryModel,
    prevMemory?: MemoryModel,
    organizationOptions: IOptions[],
    memoryTypeOptions: IOptions[],
    environmentTypeOptions: IOptions[]
}
const MemoryHistoryItem: React.FC<IMemoryHistoryItemProps> = ({ memory, prevMemory, organizationOptions, memoryTypeOptions, environmentTypeOptions }) => {
    const [memoryData, setMemoryData] = useState<IColumnValuePair[]>([])

    useEffect(() => {
        type ObjectKey = keyof MemoryModel;
        let data: IColumnValuePair[] = [];
        let keys = Object.keys(memory);

        keys.forEach(key => {
            let captionKeyPair = memoryCaptionKeyPairs.find(k => k.key === key)
            if (captionKeyPair) {
                const objectKey = key as ObjectKey;
                let value = memory[objectKey]
                let isChanged = false;

                if (prevMemory) {
                    let preValue = prevMemory[objectKey]
                    isChanged = preValue !== value;
                }

                if (key === 'organizationId' && typeof value === 'string') {
                    let organization = organizationOptions.find(o => o.value === value);
                    if (organization && typeof organization.text === 'string') {
                        value = organization.text
                    }
                }
                if (key === 'memoryTypeId' && typeof value === 'string') {
                    let memoryType = memoryTypeOptions.find(o => o.value === value);
                    if (memoryType && typeof memoryType.text === 'string') {
                        value = memoryType.text
                    }
                }

                if (key === 'environmentTypeId' && typeof value === 'string') {
                    let environmentType = environmentTypeOptions.find(o => o.value === value);
                    if (environmentType && typeof environmentType.text === 'string') {
                        value = environmentType.text
                    }
                }
                data.push({ column: captionKeyPair.caption, value: value, order: captionKeyPair.order, isChanged: isChanged })
            }
        })
        setMemoryData(data.sort((a, b) => a.order - b.order))
    }, [memory, prevMemory])

    return (

        <Card elevation={0}>
            <CardContent>
                <Box sx={{ border: 1, borderColor:  purple[300], borderRadius: 6, p: 2 }}>
                    <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 1, sm: 1, md: 2, lg: 3 }}>
                        {memoryData.map((row) => (
                            <Grid item xs={1} sm={1} md={1} lg={1}>
                                <Item sx={{ bgcolor: row.isChanged ? yellow[100] : '' }} elevation={1}>
                                    <Stack direction='row' spacing={1}>
                                        {
                                            typeof row.value === 'boolean' ?
                                                <FormControlLabel disabled                                                    
                                                    control={<Switch checked={row.value}  />}
                                                    label={row.column}
                                                />
                                                :
                                                <TextField
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    label={row.column}
                                                    value={row.value ? row.value : ' '}
                                                    fullWidth
                                                    variant="outlined"
                                                    size='small'
                                                />

                                        }
                                    </Stack>

                                </Item>
                            </Grid>
                        ))
                        }
                    </Grid>
                </Box>
                <Box sx={{
                    marginTop: 2,
                    marginBottom: -2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    {
                        prevMemory && <KeyboardDoubleArrowUpIcon color='secondary' />
                    }
                </Box>
            </CardContent>
        </Card >
    );
}


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default MemoryHistoryItem