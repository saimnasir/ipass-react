
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from '../helpers/localStorage';

enum StatusCode {
    Unauthorized = 401,
    Forbidden = 403,
    TooManyRequests = 429,
    InternalServerError = 500,
}

const headers: Readonly<Record<string, string | boolean>> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
};

// We can use the following function to inject the JWT token through an interceptor
// We get the `accessToken` from the localStorage that we set when we authenticate
const injectToken = (config: AxiosRequestConfig): AxiosRequestConfig => {
    try {
        const token = getToken();

        if (token != null) {
            if (config && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    } catch (error: any) {
        throw new Error(error);
    }
};
const BaseUrl: string = 'https://localhost:7001/api'
class Http {
    private instance: AxiosInstance | null = null;

    private get http(): AxiosInstance {
        return this.instance != null ? this.instance : this.initHttp();
    }

    initHttp() {
        const http = axios.create({
            baseURL: BaseUrl,
            //headers,
            //withCredentials: true,
        });

        http.interceptors.request.use(injectToken, (error) => Promise.reject(error));

        http.interceptors.response.use(
            (response) => response,
            (error) => {
                const { response } = error;
                console.log('http.interceptors.error', error)
                console.log('http.interceptors.response', response)
                return this.handleError(response);
            }
        );

        this.instance = http;
        return http;
    }

    request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
        return this.http.request(config);
    }

    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.http.get<T, R>(url, config);
    }

    post<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.post<T, R>(url, data, config);
    }

    put<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.put<T, R>(url, data, config);
    }

    delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.http.delete<T, R>(url, config);
    }

    redirectExternal(url: string, provider: string) {
        let callback = this.combineWithAppUrl(url)
        let redirectTo = this.combineWithApiUrl(`/account/${provider}?callback=${callback}`);
        console.log('redirectTo', redirectTo)
        document.location.href = redirectTo;
    }

    combineWithApiUrl = (url: string) => {
        if (url.startsWith('/')) {
            return `${BaseUrl}${url}`;
        }
        return `${BaseUrl}/${url}`;
    }
    combineWithAppUrl = (url: string) => {
        if (url.startsWith('/')) {
            return `${window.location.origin}${url}`;
        }
        return `${BaseUrl}/${url}`;
    }

    // Handle global app errors
    // We can handle generic app errors depending on the status code
    private handleError(error: any) {
        const { status } = error;

        switch (status) {
            case StatusCode.InternalServerError: {
                // Handle InternalServerError
                break;
            }
            case StatusCode.Forbidden: {
                // Handle Forbidden
                break;
            }
            case StatusCode.Unauthorized: {
                // Handle Unauthorized
                break;
            }
            case StatusCode.TooManyRequests: {
                // Handle TooManyRequests
                break;
            }
        }

        return Promise.reject(error);
    }
}

export const http = new Http();