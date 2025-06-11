import { AxiosError } from "axios"

export const getErrorMessage = (error: any) => {
    const axiosErr = error as AxiosError<{ message?: string }>;
    return axiosErr?.response?.data?.message ?? ""
}