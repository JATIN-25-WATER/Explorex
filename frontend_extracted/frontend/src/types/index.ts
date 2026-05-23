export interface PlaceCard {
  id: string;
  name: string;
  description: string;
  category: string;
  category_icon: string;
  distance_km: number;
  avg_rating: number;
  review_count: number;
  interest_count: number;
  cover_image_url: string | null;
  tags: string[];
  score: number;
}

export interface FeedResponse {
  places: PlaceCard[];
  next_cursor: string | null;
}

export interface UserLocation {
  lat: number;
  lng: number;
  label: string;
}
