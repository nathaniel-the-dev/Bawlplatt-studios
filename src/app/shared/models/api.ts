export interface RequestOptions {
    table: string;
    method: 'select' | 'insert' | 'update' | 'delete';
    data?: Record<string, any>;
    sql?: string;
}

export interface APIResponse {
    status: string;
    data: any;
    error: any;
}
