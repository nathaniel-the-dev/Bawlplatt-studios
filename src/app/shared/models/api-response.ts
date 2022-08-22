export interface Token {
    value: string;
    expires: Date;
}

export interface APIResponse<T = any> {
    status: string;
    data?: { [index: string]: T };
    message?: string;
}
