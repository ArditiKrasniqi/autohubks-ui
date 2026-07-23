export interface CarResponse {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  color: string;
  fuelType: string;
  transmission: string;
  location: string;
  sourceWebsite: string;
  originalListingUrl: string;
  thumbnailUrl: string;
  numberOfSeats: number | null;
  numberOfAccidents: number | null;
  createdAt: string;
  scrapedAt: string;
  clickCount: number;
}

export interface CarDetailResponse {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  color: string;
  fuelType: string;
  transmission: string;
  location: string;
  description: string;
  phoneContact: string;
  sourceWebsite: string;
  originalListingUrl: string;
  imageUrls: string[];
  numberOfSeats: number | null;
  numberOfAccidents: number | null;
  createdAt: string;
  scrapedAt: string;
  clickCount: number;
  sold: boolean;
}

export interface PagedCarResponse {
  cars: CarResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  first: boolean;
  last: boolean;
}

export type SortOption = 'LATEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'MILEAGE_ASC' | 'YEAR_DESC';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'LATEST', label: 'Latest' },
  { value: 'PRICE_DESC', label: 'Price: High to Low' },
  { value: 'PRICE_ASC', label: 'Price: Low to High' },
  { value: 'MILEAGE_ASC', label: 'Mileage: Low to High' },
  { value: 'YEAR_DESC', label: 'Year: Newest' },
];

export interface CarFilterParams {
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  fuelType?: string;
  transmission?: string;
  location?: string;
  sourceWebsite?: string;
  page?: number;
  size?: number;
  sortBy?: SortOption;
}
