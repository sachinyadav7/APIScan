import { create } from 'zustand';
import api from '@/lib/api';
import type { AuthResponse, LoginRequest, SignupRequest, Organization } from '@/lib/types';

interface AuthState {
    user: { id: string; email: string; name: string } | null;
    currentOrg: Organization | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    login: (req: LoginRequest) => Promise<void>;
    signup: (req: SignupRequest) => Promise<void>;
    logout: () => Promise<void>;
    setCurrentOrg: (org: Organization | null) => void;
    hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    currentOrg: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (req) => {
        const { data } = await api.post<{ data: AuthResponse }>('/api/auth/login', req);
        const auth = data.data;
        localStorage.setItem('accessToken', auth.accessToken);
        localStorage.setItem('refreshToken', auth.refreshToken);
        set({
            user: { id: auth.userId, email: auth.email, name: auth.name },
            isAuthenticated: true,
        });
    },

    signup: async (req) => {
        const { data } = await api.post<{ data: AuthResponse }>('/api/auth/signup', req);
        const auth = data.data;
        localStorage.setItem('accessToken', auth.accessToken);
        localStorage.setItem('refreshToken', auth.refreshToken);
        set({
            user: { id: auth.userId, email: auth.email, name: auth.name },
            isAuthenticated: true,
        });
    },

    logout: async () => {
        try {
            await api.post('/api/auth/logout');
        } catch { /* ignore */ }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, currentOrg: null, isAuthenticated: false });
    },

    setCurrentOrg: (org) => set({ currentOrg: org }),

    hydrate: () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                set({
                    user: { id: payload.sub, email: payload.email, name: '' },
                    isAuthenticated: true,
                    isLoading: false,
                });
            } catch {
                set({ isLoading: false });
            }
        } else {
            set({ isLoading: false });
        }
    },
}));
