'use client';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import type { Database, Tables } from '@/types/database';
interface AuthContextType {
    user: User | null;
    profile: Tables<'profiles'> | null;
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: {
    children: ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [supabase] = useState<SupabaseClient<Database>>(() => createClient());
    const fetchProfile = useCallback(async (userId: string): Promise<Tables<'profiles'> | null> => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) {
                if (!error.message.includes('relation') && !error.message.includes('does not exist')) {
                    console.error('Error fetching profile:', error);
                }
                return null;
            }
            return data;
        }
        catch (err) {
            console.error('Error fetching profile:', err);
            return null;
        }
    }, [supabase]);
    const refreshProfile = useCallback(async () => {
        if (user) {
            const profileData = await fetchProfile(user.id);
            setProfile(profileData);
        }
    }, [user, fetchProfile]);
    const signOut = useCallback(async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setSession(null);
            window.location.href = '/login';
        }
        catch (err) {
            console.error('Error signing out:', err);
        }
    }, [supabase]);
    useEffect(() => {
        let mounted = true;
        const initAuth = async () => {
            try {
                const { data: { session: initialSession }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error('Error getting session:', error);
                }
                if (mounted && initialSession?.user) {
                    setSession(initialSession);
                    setUser(initialSession.user);
                    fetchProfile(initialSession.user.id).then(profileData => {
                        if (mounted) {
                            setProfile(profileData);
                        }
                    });
                }
            }
            catch (err) {
                console.error('Error initializing auth:', err);
            }
            finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };
        initAuth();
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            if (!mounted)
                return;
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            if (currentSession?.user) {
                fetchProfile(currentSession.user.id).then(profileData => {
                    if (mounted) {
                        setProfile(profileData);
                    }
                });
            }
            else {
                setProfile(null);
            }
            if (event === 'SIGNED_OUT') {
                setIsLoading(false);
            }
        });
        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [supabase, fetchProfile]);
    return (<AuthContext.Provider value={{
            user,
            profile,
            session,
            isLoading,
            signOut,
            refreshProfile,
        }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
