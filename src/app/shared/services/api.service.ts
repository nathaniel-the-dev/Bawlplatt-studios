import { Injectable } from '@angular/core';
import supabase from '../utils/supabase';
import { BehaviorSubject } from 'rxjs';

interface RequestOptions {
    table: string;
    method: 'select' | 'insert' | 'update' | 'delete';
    data: any;
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    public status$ = new BehaviorSubject<string>('pending');

    constructor() {}

    private handleErrors(err: any) {
        console.log(err);
    }

    async sendRequest(opts: RequestOptions): Promise<any> {
        const query = supabase.from(opts.table);

        this.status$.next('loading');
        const { data, error, statusText } = await (() => {
            switch (opts.method) {
                case 'select':
                    return query.select('*');
                case 'insert':
                    return query.insert(opts.data);
                case 'update':
                    return query.update(opts.data);
                case 'delete':
                    return query.delete().eq('id', opts.data.id);
            }
        })();

        if (error) {
            this.handleErrors(error);
            this.status$.next('error');
        }

        this.status$.next('success');
        return data;
    }
}
