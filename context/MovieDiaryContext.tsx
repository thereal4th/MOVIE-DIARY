/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, Friend, Recommendation, ActiveTab, ViewMode, SortOption, UserProfile } from '../types/diary';
import { INITIAL_MOVIES, INITIAL_FRIENDS, INITIAL_RECOMMENDATIONS, INITIAL_USER_PROFILE } from '../data/mockData';

export interface CoverCustomization {
  color: string;
  title: string;
  titleColor: string;
  stickers: string[];
}

interface MovieDiaryContextType {
  theme: 'day' | 'midnight';
  toggleTheme: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  diaryState: 'open' | 'closing' | 'closed' | 'opening';
  setDiaryState: (state: 'open' | 'closing' | 'closed' | 'opening') => void;
  coverCustomization: CoverCustomization;
  setCoverCustomization: React.Dispatch<React.SetStateAction<CoverCustomization>>;
  isCustomizeCoverModalOpen: boolean;
  setIsCustomizeCoverModalOpen: (open: boolean) => void;
  movies: Movie[];
  friends: Friend[];
  recommendations: Recommendation[];
  userProfile: UserProfile;
  selectedFriend: Friend | null;
  setSelectedFriend: (friend: Friend | null) => void;
  isLogModalOpen: boolean;
  setIsLogModalOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;
  editingMovie: Movie | null;
  setEditingMovie: (movie: Movie | null) => void;
  prefillMovie: Partial<Movie> | null;
  setPrefillMovie: (prefill: Partial<Movie> | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  // Actions
  addMovie: (movie: Omit<Movie, 'id'>) => void;
  updateMovie: (movie: Movie) => void;
  deleteMovie: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateRating: (id: string, newRating: number) => void;
  likeActivity: (friendId: string, activityId: string) => void;
  toggleWatchlist: (recId: string) => void;
  moveToLibrary: (rec: Recommendation, rating: number, notes: string, taggedFriends?: string[]) => void;
  getTaggedFriends: (friendIds?: string[]) => Friend[];
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const MovieDiaryContext = createContext<MovieDiaryContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'filmory_state_v3_calendar_edition';

export const MovieDiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'day' | 'midnight'>('day');
  const [activeTab, setActiveTab] = useState<ActiveTab>('library');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [diaryState, setDiaryState] = useState<'open' | 'closing' | 'closed' | 'opening'>('open');
  const [coverCustomization, setCoverCustomization] = useState<CoverCustomization>({
    color: 'default',
    title: '',
    titleColor: '#FFFFFF',
    stickers: [],
  });
  const [isCustomizeCoverModalOpen, setIsCustomizeCoverModalOpen] = useState<boolean>(false);
  
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState<boolean>(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [prefillMovie, setPrefillMovie] = useState<Partial<Movie> | null>(null);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortOption, setSortOption] = useState<SortOption>('date_desc');

  // Hydrate from localStorage on initial client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.movies) setMovies(parsed.movies);
        if (parsed.friends) setFriends(parsed.friends);
        if (parsed.recommendations) setRecommendations(parsed.recommendations);
        if (parsed.userProfile) setUserProfile(parsed.userProfile);
        if (parsed.coverCustomization) setCoverCustomization(parsed.coverCustomization);
        if (parsed.theme) {
          setTheme(parsed.theme);
          if (parsed.theme === 'midnight') {
            document.documentElement.classList.add('theme-midnight');
          } else {
            document.documentElement.classList.remove('theme-midnight');
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse localStorage:', e);
    }
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ movies, friends, recommendations, userProfile, theme, coverCustomization })
      );
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [movies, friends, recommendations, userProfile, theme, coverCustomization]);

  const toggleTheme = () => {
    const newTheme = theme === 'day' ? 'midnight' : 'day';
    setTheme(newTheme);
    if (newTheme === 'midnight') {
      document.documentElement.classList.add('theme-midnight');
    } else {
      document.documentElement.classList.remove('theme-midnight');
    }
  };

  const addMovie = (newMovie: Omit<Movie, 'id'>) => {
    const id = `movie-${Date.now()}`;
    const created: Movie = { id, ...newMovie };
    setMovies((prev) => [created, ...prev]);
  };

  const updateMovie = (updated: Movie) => {
    setMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const deleteMovie = (id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m))
    );
  };

  const updateRating = (id: string, newRating: number) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, userRating: newRating } : m))
    );
  };

  const likeActivity = (friendId: string, activityId: string) => {
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id !== friendId) return f;
        const updatedActivities = f.recentActivities.map((act) => {
          if (act.id !== activityId) return act;
          const currentlyLiked = act.likedByMe || false;
          return {
            ...act,
            likedByMe: !currentlyLiked,
            likes: currentlyLiked ? act.likes - 1 : act.likes + 1,
          };
        });
        return { ...f, recentActivities: updatedActivities };
      })
    );
  };

  const toggleWatchlist = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId ? { ...r, savedToWatchlist: !r.savedToWatchlist } : r
      )
    );
  };

  const moveToLibrary = (rec: Recommendation, rating: number, notes: string, taggedFriends?: string[]) => {
    const newMovie: Movie = {
      id: `movie-${Date.now()}`,
      title: rec.title,
      releaseYear: rec.releaseYear,
      director: rec.director,
      runtimeMinutes: rec.runtimeMinutes,
      genres: rec.genres,
      posterPath: rec.posterPath,
      userRating: rating,
      reviewNotes: notes || 'Logged from Shared Circle Recommendations! ✿',
      dateWatched: new Date().toISOString().split('T')[0],
      watchFormat: 'Cozy Couch 🛋️',
      moodTags: rec.moods || ['☁️ Comfort Watch'],
      taggedFriendIds: taggedFriends || [],
      favorite: rating >= 4.5
    };
    setMovies((prev) => [newMovie, ...prev]);
    setRecommendations((prev) => prev.filter((r) => r.id !== rec.id));
    setActiveTab('library');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const getTaggedFriends = (friendIds?: string[]): Friend[] => {
    if (!friendIds || friendIds.length === 0) return [];
    return friendIds
      .map((id) => friends.find((f) => f.id === id))
      .filter((f): f is Friend => f !== undefined);
  };

  return (
    <MovieDiaryContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        diaryState,
        setDiaryState,
        coverCustomization,
        setCoverCustomization,
        isCustomizeCoverModalOpen,
        setIsCustomizeCoverModalOpen,
        movies,
        friends,
        recommendations,
        userProfile,
        selectedFriend,
        setSelectedFriend,
        isLogModalOpen,
        setIsLogModalOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        editingMovie,
        setEditingMovie,
        prefillMovie,
        setPrefillMovie,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        sortOption,
        setSortOption,
        addMovie,
        updateMovie,
        deleteMovie,
        toggleFavorite,
        updateRating,
        likeActivity,
        toggleWatchlist,
        moveToLibrary,
        getTaggedFriends,
        updateUserProfile,
      }}
    >
      {children}
    </MovieDiaryContext.Provider>
  );
};

export const useMovieDiary = () => {
  const context = useContext(MovieDiaryContext);
  if (!context) {
    throw new Error('useMovieDiary must be used within a MovieDiaryProvider');
  }
  return context;
};
