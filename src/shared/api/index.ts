import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import i18n from 'i18next';
import { v4 as uuidv4 } from 'uuid';
import ApiError from './error/ApiError';


// consider later, the case when services are growing into multiple services
const baseURL = 'https://localhost:4000';

const baseApi = axios.create({
    baseURL: baseURL,
});
// let isRefreshing = false;

baseApi.interceptors.request.use(async (config) => {
    console.log("[API] Request", config);
    const token = 'ff'
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['X-Client-Version'] = DeviceInfo.getVersion()
    config.headers['X-Platform'] = Platform.OS
    config.headers['Accept-Language'] = i18n.language

    // idempotency key for post and put requests
    if (['post', 'put'].includes(config.method!)) {
        config.headers['Idempotency-Key'] = uuidv4()
    }
    if (__DEV__) {
        console.log(`[API] -> ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
        });
    }
    return config
})
//add retry login later
baseApi.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config
        if (err.reponse) {
            const { status, data } = err.response;
            throw new ApiError(status, data.code, data.message, data)
        }

        // request was made but no response
        if(err.request){
            throw new ApiError(0, 'NETWORK_ERROR', 'Network error', err.request)
        }

        // neither request failed nor response
        throw new ApiError(0, 'UNKNOWN_ERROR', 'Unknown error', err.message)
    }
)

export default baseApi;