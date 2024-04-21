export interface RequestOptions {
    table: string;
    method: 'select' | 'insert' | 'update' | 'delete';
    data: any;
}

export interface APIResponse {
    status: string;
    data: any;
    error: any;
}
