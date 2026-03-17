export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  entryCount: number;
  createdAt: Date;
}

export interface Entry {
  id: string;
  cityId: string;
  cityName: string;
  country: string;
  photos: string[];
  text: string;
  title: string;
  visitDate: Date;
  createdAt: Date;
}
