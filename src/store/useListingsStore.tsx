import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import create from 'zustand';

import { Listing } from '@/types/listing';

interface ActiveFilter {
  label: string;
  value: number;
}
interface ListingsStore {
  listings: Listing[];
  activeTypeFilter: ActiveFilter | null;
  setListings: (listings: Listing[]) => void;
  setTypeFilter: (type: ActiveFilter | null) => void;

  extraFilterActive: boolean;
  // filter data
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  bathrooms: number;

  setMinPrice: (type: number) => void;
  setMaxPrice: (type: number) => void;
  setBedrooms: (type: number) => void;
  setBathrooms: (type: number) => void;
  setExtraFiilterActive: (active: boolean) => void;
}

const useListingsStoreBase = create<ListingsStore>((set) => ({
  listings: [],
  // filter
  minPrice: 0,
  maxPrice: 0,
  bedrooms: 0,
  bathrooms: 0,
  activeTypeFilter: null,
  setListings: (listings) => set(() => ({ listings })),
  setTypeFilter: (type) => set(() => ({ activeTypeFilter: type })),

  // filter
  setMinPrice: (price) => set(() => ({ minPrice: price })),
  setMaxPrice: (price) => set(() => ({ maxPrice: price })),
  setBedrooms: (room) => set(() => ({ bedrooms: room })),
  setBathrooms: (room) => set(() => ({ bathrooms: room })),
  extraFilterActive: false,
  setExtraFiilterActive: (active) => set(() => ({ extraFilterActive: active })),
}));

const useListingsStore = createSelectorHooks(useListingsStoreBase);

export default useListingsStore;
