export type MoodTag = 
  | '🥺 Tearjerker' 
  | '☁️ Comfort Watch' 
  | '✨ Mind-Blowing' 
  | '🌸 Feel-Good' 
  | '🍿 Edge of Seat' 
  | '🎨 Aesthetic Gem'
  | '🌙 Late Night Vibe';

export type WatchFormat = 
  | 'Cinema 🎟️' 
  | 'IMAX 📽️' 
  | 'Streaming 💻' 
  | 'Cozy Couch 🛋️' 
  | 'Outdoor Screen 🌌'
  | 'Projector 🎞️';

export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  director: string;
  runtimeMinutes: number;
  genres: string[];
  posterPath: string;
  userRating: number; // 0.5 to 5.0 in half-star steps
  reviewNotes: string;
  dateWatched: string;
  watchFormat?: WatchFormat;
  venue?: string; // e.g., "In Theaters", "Netflix", "4K Blu-ray", "Criterion"
  isRewatch?: boolean; // 🔁 Rewatch indicator
  hashtags?: string[]; // e.g., ["#FilmFestival", "#SummerCinema"]
  moodTags: MoodTag[];
  taggedFriendIds?: string[]; // IDs of friends watched with
  favorite?: boolean;
}

export interface FriendActivity {
  id: string;
  type: 'review' | 'watchlist_add' | 'rating' | 'watch_together';
  movieTitle: string;
  rating?: number;
  comment: string;
  timeAgo: string;
  posterPath?: string;
  likes: number;
  likedByMe?: boolean;
}

export interface Friend {
  id: string;
  name: string;
  handle: string;
  avatar: string; // Path to generated avatar image
  compatibilityScore: number; // e.g. 96%
  isOnline: boolean;
  bio: string;
  favoriteGenres: string[];
  watchedLibrary: Movie[]; // Friend's personal movie catalog
  recentActivities: FriendActivity[];
}

export interface Recommendation {
  id: string;
  title: string;
  releaseYear: number;
  director: string;
  genres: string[];
  moods: MoodTag[];
  matchReason: string;
  posterPath: string;
  matchPercentage: number;
  runtimeMinutes: number;
  savedToWatchlist?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt: string;
  colorClass: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  favoriteGenres: string[];
  joinedDate: string;
  tastePhilosophy: string;
  totalHoursWatched?: number;
  badges: Badge[];
  bannerUrl?: string;
  followersCount?: number;
  followingCount?: number;
  favoriteQuote?: string;
  favoriteQuoteMovie?: string;
  favoriteQuoteCharacter?: string;
  socialLinks?: {
    letterboxd?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

export type ViewMode = 'calendar' | 'timeline' | 'poster_wall' | 'grid';
export type ActiveTab = 'library' | 'friends' | 'discover' | 'profile';
export type SortOption = 'date_desc' | 'date_asc' | 'rating_desc' | 'rating_asc' | 'title_asc';
