export interface Token {
    value: string;
    expires: Date;
}

export interface QueryOptions {
    filter?: {
        key: string;
        value: string;
    };

    search?: string;

    sort?: {
        key: string;
        value: 'asc' | 'desc';
    }

    page?: string;
    limit?: number;

    [index: string]: any;
}


export interface APIResponse<T = any> {
    status: string;
    // Data properties
    data?: { [index: string]: T };

    // Error properties
    error?: {
        type: string;
        message: string;
        errors?: { [key: string]: string }
    }
}
