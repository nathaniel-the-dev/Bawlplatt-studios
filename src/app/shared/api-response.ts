export interface APIResponse<T = any> {
    status: string;
    data?: { [index: string]: T };
    message?: string;
}
