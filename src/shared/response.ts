import {IResponse} from "./interface";


export class ResponseHandler {
    static success(data: any): Promise<IResponse> {
        return Promise.resolve({
            status : true,
            message : data.message,
            data : {
                ...data.data,
            },
        });
    }

    static error(data: any): Promise<IResponse> {
        const error = data.response.data;
        return Promise.reject({status : false, message : error.message});
    }
}