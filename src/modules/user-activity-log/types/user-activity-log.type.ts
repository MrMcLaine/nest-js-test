export interface UserActivityLog {
    userId: number;
    timestamp: string;
    requestMethod: string;
    requestUrl: string;
    requestBody?: any;
    requestParams?: any;
    requestQuery?: any;
}
