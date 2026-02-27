import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      lastUserFetched: null,

      fetchUser: async (force = false) => {
        const { user, lastUserFetched } = get();
        const tenMinutes = 10 * 60 * 1000;

        if (!force && user && lastUserFetched && Date.now() - lastUserFetched < tenMinutes) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const res = await api.get('/auth/me');
          set({
            user: res.data.data,
            isAuthenticated: true,
            loading: false,
            lastUserFetched: Date.now(),
          });
        } catch (err) {
          set({
            user: null,
            isAuthenticated: false,
            error: err.response?.data?.message || 'Failed to authenticate session',
            loading: false,
          });
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
          }
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          isAuthenticated: false,
          lastUserFetched: null,
          error: null,
        });
      },

      clearAuthError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastUserFetched: state.lastUserFetched,
      }),
    },
  ),
);

export default useAuthStore;
