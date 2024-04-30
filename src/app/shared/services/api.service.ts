import { Injectable } from '@angular/core';
import { AuthUser, createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { RequestOptions, APIResponse } from '../models/api';
import localforage from 'localforage';

localforage.config({
    driver: localforage.INDEXEDDB,
});

const supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_KEY,
    {
        auth: {
            storage: {
                getItem: (key:string) => localforage.getItem(key),
                setItem: (key:string, value:any) => {
                    localforage.setItem(key, value);
                },
                removeItem: (key:string) => localforage.removeItem(key),
            },
        },
    }
);
let authSubscription: any = null;

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    public user: AuthUser | null = null;
    public supabase = supabase;

    constructor() {
        // Ensure auth subscription is initialized once (Singleton)
        if (!authSubscription) {
            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((e, session) => {
                setTimeout(async () => {
                    let user = session?.user;

                    // Store user profile data only on initial session and user updates
                    if (user && e === 'INITIAL_SESSION') {
                        const meta_data = await this.getUserMetaData(user.id);
                        if (meta_data) {
                            const res = await supabase.auth.updateUser({
                                data: {
                                    id: meta_data.id,
                                    name: meta_data.name,
                                    roles: meta_data.roles,
                                    contact_num: meta_data.contact_num,
                                },
                            });
                            user = res.data.user || user;
                        }
                    }

                    this.user = user || null;
                }, 0);
            });
            authSubscription = subscription;
        }
    }

    private handleErrors(err: any) {
        console.error(err);
    }

    async sendRequest(opts: RequestOptions): Promise<APIResponse> {
        const query = supabase.from(opts.table);

        const { status, statusText, data, error } = await (() => {
            switch (opts.method) {
                case 'select':
                    if (opts.data?.['where']) {
                        return query
                            .select(opts.sql || '*')
                            .filter(
                                opts.data?.['where'].field,
                                'eq',
                                opts.data?.['where'].value
                            );
                    }
                    return query.select(opts.sql || '*');
                case 'insert':
                    return query.insert(opts.data);
                case 'update':
                    return query.update(opts.data);
                case 'delete':
                    return query.delete().eq('id', opts.data?.['id']);
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

        switch (true) {
            case statusCode.startsWith('1'):
            case statusCode.startsWith('2'):
            case statusCode.startsWith('3'):
                return 'success';
            case statusCode.startsWith('4'):
            case statusCode.startsWith('5'):
                return 'error';
            default:
                return '';
        }
    }

    /**
     * Retrieves the current user from the Supabase authentication service.
     *
     * @return {Promise<User | null>} The current user object.
     */
    async getCurrentUser(fromSession?: boolean): Promise<AuthUser | null> {
        return !fromSession
            ? (await supabase.auth.getUser()).data.user
            : (await supabase.auth.getSession()).data.session?.user || null;
    }

    async getUserMetaData(user_id: string) {
        const profile = await this.sendRequest({
            method: 'select',
            table: 'profiles',
            sql: '*, roles(title)',
            data: {
                where: {
                    field: 'uuid',
                    value: user_id,
                },
            },
        });
        return profile.data?.[0];
    }

    async logout(): Promise<boolean> {
        const { error } = await supabase.auth.signOut();
        if (error) this.handleErrors(error);
        return Boolean(error);
    }
}
