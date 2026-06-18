import { create } from "zustand";
import { set as setLodash } from "lodash";

const useUserStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    loading: false,
    UStore: (key, value) => {
        return new Promise((resolve) => {
            set((state) => {
                const newState = { ...state };
                setLodash(newState, key, value);
                // Resolve after this synchronous set completes
                setTimeout(resolve, 0);
                return newState;
            });
        });
    },
}));

export default useUserStore;