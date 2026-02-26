import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/axios';

const usePropertyStore = create(
  persist(
    (set, get) => ({
      properties: [],
      myProperties: [],
      interestedUsersMap: {},
      loading: false,
      error: null,
      lastFetched: null,
      lastMyFetched: null,

      fetchProperties: async (force = false) => {
        const { properties, lastFetched } = get();
        const fiveMinutes = 5 * 60 * 1000;

        if (
          !force &&
          properties.length > 0 &&
          lastFetched &&
          Date.now() - lastFetched < fiveMinutes
        ) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const res = await api.get('/properties');
          set({
            properties: res.data.data,
            loading: false,
            lastFetched: Date.now(),
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to fetch',
            loading: false,
          });
        }
      },

      fetchMyProperties: async (force = false) => {
        const { myProperties, lastMyFetched } = get();
        const fiveMinutes = 5 * 60 * 1000;

        if (
          !force &&
          myProperties.length > 0 &&
          lastMyFetched &&
          Date.now() - lastMyFetched < fiveMinutes
        ) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const res = await api.get('/properties/my');
          set({
            myProperties: res.data.data,
            loading: false,
            lastMyFetched: Date.now(),
          });
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to fetch your properties',
            loading: false,
          });
        }
      },

      clearProperties: () => {
        set({
          properties: [],
          myProperties: [],
          lastFetched: null,
          lastMyFetched: null,
        });
      },
      fetchInterestedUsers: async (propertyId) => {
        set({ loading: true, error: null });
        try {
          const res = await api.get(`/properties/${propertyId}/interested-users`);
          console.log(res);

          set((state) => ({
            interestedUsersMap: {
              ...state.interestedUsersMap,
              [propertyId]: res.data.data,
            },
            loading: false,
          }));
        } catch (err) {
          set({
            error: err.response?.data?.message || 'Failed to fetch interested users',
            loading: false,
          });
        }
      },
    }),
    {
      name: 'property-storage',
      partialize: (state) => ({
        properties: state.properties,
        myProperties: state.myProperties,
        lastFetched: state.lastFetched,
        lastMyFetched: state.lastMyFetched,
        interestedUsersMap: state.interestedUsersMap,
      }),
    },
  ),
);

export default usePropertyStore;
