import { Injectable } from '@angular/core';
import { SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

interface RequestOptions {
    table: string;
    method: 'select' | 'insert' | 'update' | 'delete';
    data: any;
}

interface APIResponse {
    status: string;
    data: any;
    error: any;
}

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private supabase: SupabaseClient;

    public user: User | null = null;

    constructor() {
        this.supabase = createClient(
            environment.SUPABASE_URL,
            environment.SUPABASE_KEY
        );

        this.supabase.auth.getUser().then(({ data: { user } }) => {
            this.user = user;
        });
    }

    private handleErrors(err: any) {
        console.log(err);
    }

    async sendRequest(opts: RequestOptions): Promise<APIResponse> {
        const query = this.supabase.from(opts.table);

        const { statusText, data, error } = await (() => {
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
        }

        return {
            status: statusText,
            data,
            error,
        };
    }

    // Auth

    async login(creds: {
        email: string;
        password: string;
    }): Promise<APIResponse> {
        const { data, error } = await this.supabase.auth.signInWithPassword(
            creds
        );

        // TODO: Handle errors and log them in locally
        if (error) {
            return { status: 'error', data: null, error };
        }

        return { status: 'success', data, error: null };
    }

    async logout(): Promise<boolean> {
        const { error } = await this.supabase.auth.signOut();

        if (error) this.handleErrors(error);

        return !!error;
    }
}
