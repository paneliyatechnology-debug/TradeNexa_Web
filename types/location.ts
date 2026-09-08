import type { CatalogListParams, PaginatedResult } from "@/types/catalog";

export interface ApiState {
  id: number;
  country_id: number;
  name: string;
  code: string | null;
  is_active: boolean | number;
  created_at?: string;
}

export interface ApiCity {
  id: number;
  state_id: number;
  name: string;
  is_active: boolean | number;
  created_at?: string;
}

export interface StateListParams extends CatalogListParams {
  country_id?: number;
  code?: string;
}

export interface CityListParams extends CatalogListParams {
  state_id: number;
}

export type StatesPageResult = PaginatedResult<ApiState>;
export interface ApiCountry {
  id: number;
  name: string;
  code: string;
  is_active: boolean | number;
  created_at?: string;
}

export type CountriesPageResult = PaginatedResult<ApiCountry>;

/** India — default country ID. */
export const INDIA_COUNTRY_ID = 4;

/** Result of resolving browser coordinates to platform state/city IDs. */
export interface ResolvedGeoLocation {
  state_id: number;
  city_id: number;
  state_name: string;
  city_name: string;
  lat: number;
  lng: number;
}