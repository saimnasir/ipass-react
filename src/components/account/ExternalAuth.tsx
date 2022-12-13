import { AxiosResponse } from 'axios';
import React, { useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginResult } from '../../models/account/user.model';
import { FinalResponse } from '../../models/final-response';
import { authExternal } from '../../network/services/accountService'

const ExternalAuth = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    let location = useLocation();
    const { user, setUser } = useAuth()

    useEffect(() => {
        let loginResult: LoginResult = {
            accessToken: searchParams.get('t') as string
        }
        setUser(loginResult)
    }, [])

    useEffect(() => {
        if (user) {
            authExternal(location.search).then((response: AxiosResponse<FinalResponse<LoginResult>>) => {
                setUser(response.data.data)
                navigate("/");
            });
        }
    }, [user])

    return (
        <div>Please wait..</div>
    )
}

export default ExternalAuth