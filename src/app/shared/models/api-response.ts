
export interface Token {
    value: string;
    expires: Date;
}

export interface QueryOptions {
    group?: 'complete' | 'incomplete' | 'any' | '';

    filter?: {
        key: string;
        value: string;
    };

    search?: string;

    sort?: {
        key: string;
        value: 'asc' | 'desc';
    }

    page?: number;
    limit?: number;

    [index: string]: any;
}

export interface APIResponse<T = unknown> {
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

