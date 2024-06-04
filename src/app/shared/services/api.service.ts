import { Injectable } from '@angular/core';
import {
    AuthChangeEvent,
    AuthUser,
    createClient,
    Session,
    User,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import localforage from 'localforage';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

interface Pagination {
    current: number;
    max: number;
    limit: number;
}

localforage.config({
    driver: localforage.INDEXEDDB,
});

const supabase = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_KEY,
    {
        auth: {
            storage: {
                getItem: (key: string) => localforage.getItem(key),
                setItem: (key: string, value: any) => {
                    localforage.setItem(key, value);
                },
                removeItem: (key: string) => localforage.removeItem(key),
            },
            debug(message, ...args) {
                if (!environment.production && environment.debug)
                    console.log(message, ...args);
            },
        },
    }
);

const superAdminClient = createClient(
    environment.SUPABASE_URL,
    environment.SERVICE_ROLE_KEY,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
).auth.admin;

let authSubscription: any = null;

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    public isCustomerAuthenticated$ = new BehaviorSubject<boolean>(false);
    public user$ = new BehaviorSubject<User | null>(null);
    public get user() {
        return this.user$?.getValue();
    }

    public supabase = supabase;
    public superAdmin = superAdminClient;

    constructor(private router: Router) {
        this.handleAuthStateChanges();
    }

    private handleAuthStateChanges() {
        this.onAuthStateChanged(async (e, session) => {
            let user = session?.user;

            // Store user profile data only on initial session and user updates
            if (user) {
                switch (e) {
                    case 'INITIAL_SESSION':
                    case 'TOKEN_REFRESHED':
                        const profile = await this.getUserProfileData(user.id);
                        if (profile && profile.verified_at) {
                            const res = await supabase.auth.updateUser({
                                data: {
                                    profile: {
                                        ...profile,
                                        avatar:
                                            profile.avatar ||
                                            `https://api.dicebear.com/8.x/initials/svg?seed=${profile.name}`,
                                    },
                                },
                            });
                            user = res.data.user || user;
                        }
                        break;
                }
            }

            this.user$.next(user || null);
            this.isCustomerAuthenticated$.next(
                user?.user_metadata?.['profile'].role === 'customer'
            );
        });
    }

    private onAuthStateChanged(
        cb: (e: AuthChangeEvent, session: Session | null) => Promise<void>
    ) {
        // Ensure auth subscription is initialized once (Singleton)
        if (!authSubscription) {
            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((e, session) => {
                setTimeout(() => cb(e, session), 0);
            });
            authSubscription = subscription;
        }
    }

    public async paginateQuery(
        query: any,
        pagination: Pagination
    ): Promise<any> {
        let rangeStart = pagination.limit * (pagination.current - 1);
        let rangeEnd = pagination.limit * pagination.current - 1;

        try {
            const res = await query.range(rangeStart, rangeEnd);
            if (res.error) throw res.error;

            if (res.count === 0 && pagination.current > 1) {
                pagination.current -= 1;
                return await this.paginateQuery(query, pagination);
            }

            pagination.max = Math.ceil((res.count || 1) / pagination.limit);

            return res;
        } catch (error: any) {
            if (error.code === 'PGRST103') {
                pagination.current = 1;
                return await this.paginateQuery(query, pagination);
            }
        }
    }

    private handleErrors(err: any) {
        console.error(err);
    }

    public mapCodeToStatus(code: number): string {
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
     * @param {boolean} fromSession - Whether to retrieve the user from the session.
     * @return {Promise<User | null>} The current user object.
     */
    async getCurrentUser(fromSession?: boolean): Promise<AuthUser | null> {
        return !fromSession
            ? (await supabase.auth.getUser()).data.user
            : (await supabase.auth.getSession()).data.session?.user || null;
    }

    async getUserProfileData(user_id: string) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*, role:roles(title)')
            .eq('uuid', user_id)
            .maybeSingle();
        return profile;
    }

    async logout(redirectTo?: string): Promise<boolean> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            this.handleErrors(error);
            return false;
        }
        this.user$.next(null);
        if (redirectTo) this.router.navigateByUrl(redirectTo);
        return true;
    }
}
