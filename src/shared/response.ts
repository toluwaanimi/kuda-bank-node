import {IResponse} from "./interface";


export class ResponseHandler {
    static success(data: any): Promise<IResponse> {
        return Promise.resolve({
            status : true,
            message : data.Message,
            data : {
                ...data.Data,
                TransactionReference : data?.TransactionReference ? data.TransactionReference : undefined
            },
            meta : {
                ResponseCode : data?.ResponseCode ? data.ResponseCode : undefined,
                RequestReference : data?.RequestReference ? data.RequestReference : undefined
            }
        });
    }

    static error(data: any): Promise<IResponse> {
        const error = data.response.data;
        return Promise.reject({status : false, message : error.message});
    }
}