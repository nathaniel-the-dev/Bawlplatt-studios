import { Injectable } from '@angular/core';
import { AuthUser, createClient, User } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import localforage from 'localforage';
import { BehaviorSubject } from 'rxjs';

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
        },
    }
);
let authSubscription: any = null;

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    public user: User | null = null;
    public user$ = new BehaviorSubject<typeof this.user>(null);

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
                    if (user) {
                        if (
                            e === 'INITIAL_SESSION' ||
                            e === 'TOKEN_REFRESHED'
                        ) {
                            const meta_data = await this.getUserMetaData(
                                user.id
                            );
                            if (meta_data) {
                                const res = await supabase.auth.updateUser({
                                    data: {
                                        id: meta_data.id,
                                        name: meta_data.name,
                                        role: meta_data.role.title,
                                        contact_num: meta_data.contact_num,
                                        avatar:
                                            meta_data.avatar ||
                                            `https://api.dicebear.com/8.x/initials/svg?seed=${meta_data.name}&backgroundColor=000000`,
                                    },
                                });
                                user = res.data.user || user;
                            }
                        }

                        if (e === 'USER_UPDATED') {
                            await supabase
                                .from('profiles')
                                .update({
                                    name: user.user_metadata['name'],
                                    email: user.email,
                                    contact_num:
                                        user.user_metadata['contact_num'],
                                    avatar: user.user_metadata['avatar'],
                                    verified: Boolean(user.email_confirmed_at),
                                })
                                .eq('id', user.id);
                        }
                    }

                    this.user = user || null;
                    this.user$.next(this.user);
                }, 0);
            });
            authSubscription = subscription;
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
     * @return {Promise<User | null>} The current user object.
     */
    async getCurrentUser(fromSession?: boolean): Promise<AuthUser | null> {
        return !fromSession
            ? (await supabase.auth.getUser()).data.user
            : (await supabase.auth.getSession()).data.session?.user || null;
    }

    async getUserMetaData(user_id: string) {
        const profile = await supabase
            .from('profiles')
            .select('*, role:roles(title)')
            .eq('uuid', user_id)
            .limit(1);
        return profile.data?.[0];
    }

    async logout(): Promise<boolean> {
        const { error } = await supabase.auth.signOut();
        if (error) this.handleErrors(error);
        return Boolean(error);
    }
}
