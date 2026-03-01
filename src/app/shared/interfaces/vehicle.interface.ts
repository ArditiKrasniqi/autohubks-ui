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
  sort?: string;
}
