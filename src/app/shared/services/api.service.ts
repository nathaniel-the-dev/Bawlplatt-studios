import { Injectable } from '@angular/core';
import { User, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { RequestOptions, APIResponse } from '../models/api';
import localforage from 'localforage';

localforage.config({
    driver: localforage.INDEXEDDB
});

const supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_KEY,
    {
        auth: {
            storage: {
                  getItem: (key)=>localforage.getItem(key),
                  setItem:(key, value)=> {localforage.setItem(key, value)},
                  removeItem: (key) =>localforage.removeItem(key)
            },
        },
    }
);

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    public user: User | null = null;

    constructor() {}

    private handleErrors(err: any) {
        console.error(err);
    }

    async sendRequest(opts: RequestOptions): Promise<APIResponse> {
        const query = supabase.from(opts.table);

        const { status, statusText, data, error } = await (() => {
            switch (opts.method) {
                case 'select':
                    return query
                        .select('*')
                        .order('created_at', { ascending: false });
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
        }

        return {
            status: statusText || this.mapCodeToStatus(status),
            data,
            error,
        };
    }

    private mapCodeToStatus(code: number): string {
        const statusCode = code.toString();

        if (statusCode.startsWith('2')) return 'success';
        if (statusCode.startsWith('3')) return 'success';

        if (statusCode.startsWith('4')) return 'error';
        if (statusCode.startsWith('5')) return 'error';

        return '';
    }

    // Auth
    async login(creds: {
        email: string;
        password: string;
    }): Promise<APIResponse> {
        const { data, error } = await supabase.auth.signInWithPassword(creds);

        if (error) {
            return {
                status: 'error',
                data: null,
                error,
            };
        }

        this.user = data.user;
        return { status: 'success', data, error: null };
    }

    async getCurrentUser() {
        return (await supabase.auth.getUser()).data.user;
    }

    async autoLogin(){
        this.user  = await this.getCurrentUser();
    }

    async logout(): Promise<boolean> {
        const { error } = await supabase.auth.signOut();
        if (error) this.handleErrors(error);

        this.user = null;

        return Boolean(error);
    }
}
