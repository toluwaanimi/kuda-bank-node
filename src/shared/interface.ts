export interface IResponse{
    status: boolean;

    message: string;

    data?: [] | Record<string, any>;
}