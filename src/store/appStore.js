import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // Navigation
      activeView: 'analyze',
      setActiveView: (view) => set({ activeView: view }),

      // Active brand in Analyze view
      activeBrand: null,
      setActiveBrand: (brand) => set({ activeBrand: brand }),

      // Benchmark (max 5 brands)
      benchmarkBrands: [],
      addToBenchmark: (brand) => {
        const current = get().benchmarkBrands;
        if (current.length >= 5) return;
        if (current.find(b => b.brand === brand.brand)) return;
        set({ benchmarkBrands: [...current, brand] });
      },
      removeFromBenchmark: (brandName) =>
        set({ benchmarkBrands: get().benchmarkBrands.filter(b => b.brand !== brandName) }),
      clearBenchmark: () => set({ benchmarkBrands: [] }),

      // Saved library
      savedBrands: [],
      saveBrand: (brand) => {
        const current = get().savedBrands;
        if (current.find(b => b.brand === brand.brand)) return;
        set({ savedBrands: [...current, brand] });
      },
      removeSavedBrand: (brandName) =>
        set({ savedBrands: get().savedBrands.filter(b => b.brand !== brandName) }),
      clearLibrary: () => set({ savedBrands: [] }),

      // Settings
      openaiApiKey: '',
      setOpenaiApiKey: (key) => set({ openaiApiKey: key }),

      // Per-brand axis overrides
      axisOverrides: {},
      setAxisOverride: (brandName, axes) =>
        set({ axisOverrides: { ...get().axisOverrides, [brandName]: axes } }),
    }),
    {
      name: 'brand-dna-store',
      partialize: (state) => ({
        savedBrands: state.savedBrands,
        openaiApiKey: state.openaiApiKey,
        axisOverrides: state.axisOverrides,
        benchmarkBrands: state.benchmarkBrands,
      }),
    }
  )
);

export default useAppStore;
