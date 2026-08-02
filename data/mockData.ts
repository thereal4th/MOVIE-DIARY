import { Movie, Friend, Recommendation, UserProfile } from '../types/diary';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Maya Vardy',
  handle: '@cozy_cineast',
  avatar: '/images/avatars/maya.jpg',
  bio: 'Sipping chamomile tea under cozy knit blankets while rating autumn cinema down to the exact half-star. 🍵✨',
  favoriteGenres: ['Animation', 'Romance', 'Indie', 'Fantasy', 'Period Drama'],
  joinedDate: 'October 2024',
  tastePhilosophy: 'Believes cinema should feel like a warm hug or an aching, beautiful sunset. Prioritizes visual aesthetics and emotional resonance over explosion count.',
  favoriteQuote: 'In another life, I would have really liked just doing laundry and taxes with you.',
  favoriteQuoteMovie: 'Everything Everywhere All at Once (2022)',
  favoriteQuoteCharacter: 'Waymond Wang',
  badges: [
    {
      id: 'badge-1',
      name: 'Half-Star Auteur',
      icon: '🏆',
      description: 'Obsessed with scoring precision down to the exact 0.5 increment.',
      unlockedAt: 'Nov 2024',
      colorClass: 'from-pink-300 via-rose-300 to-amber-200'
    },
    {
      id: 'badge-2',
      name: 'Comfort Watch Specialist',
      icon: '🍵',
      description: 'Logged 5+ feel-good cozy treasures to warm up rainy afternoons.',
      unlockedAt: 'Dec 2024',
      colorClass: 'from-emerald-300 via-teal-300 to-cyan-200'
    },
    {
      id: 'badge-3',
      name: 'Social Movie Nighter',
      icon: '🛋️',
      description: 'Tagged besties across multiple couch screenings and tea nights.',
      unlockedAt: 'Jan 2025',
      colorClass: 'from-purple-300 via-indigo-300 to-blue-200'
    },
    {
      id: 'badge-4',
      name: 'Midnight Archivist',
      icon: '🌙',
      description: 'Recorded late night aesthetic film screenings in Midnight Diary mode.',
      unlockedAt: 'Feb 2025',
      colorClass: 'from-amber-300 via-orange-300 to-red-200'
    },
  ],
  bannerUrl: '/images/posters/past_lives.jpg',
  followersCount: 1284,
  followingCount: 142,
  socialLinks: {
    letterboxd: 'https://letterboxd.com/cozy_cineast',
    twitter: 'https://twitter.com/cozy_cineast',
    instagram: 'https://instagram.com/cozy_cineast',
    website: 'https://mayacinemadiary.com'
  }
};

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'movie-1',
    title: 'My Neighbor Totoro',
    releaseYear: 1988,
    director: 'Hayao Miyazaki',
    runtimeMinutes: 86,
    genres: ['Animation', 'Fantasy', 'Family'],
    posterPath: '/images/posters/totoro.jpg',
    userRating: 5.0,
    reviewNotes: 'The absolute gold standard of comfort films! Curling up with a warm tea while watching the rainfall scene under the giant camphor tree brought instant serenity to my soul. 🍃✨',
    dateWatched: '2026-08-01',
    watchFormat: 'Cozy Couch 🛋️',
    venue: 'Netflix',
    isRewatch: true,
    hashtags: ['#ComfortWatch', '#GhibliMagic', '#SummerCinema'],
    moodTags: ['☁️ Comfort Watch', '🌸 Feel-Good', '🎨 Aesthetic Gem'],
    taggedFriendIds: ['friend-sarah', 'friend-maya'],
    favorite: true
  },
  {
    id: 'movie-2',
    title: 'Past Lives',
    releaseYear: 2023,
    director: 'Celine Song',
    runtimeMinutes: 106,
    genres: ['Romance', 'Drama'],
    posterPath: '/images/posters/past_lives.jpg',
    userRating: 4.5,
    reviewNotes: 'An exquisitely heartbreaking reflection on destiny, love, and the lives left unlived (In-Yun). The silent yearning during that carousel scene in New York left me breathless.',
    dateWatched: '2026-08-08',
    watchFormat: 'Cinema 🎟️',
    venue: 'In Theaters',
    isRewatch: false,
    hashtags: ['#FilmFestival', '#ModernMasterpiece', '#InYun'],
    moodTags: ['🥺 Tearjerker', '✨ Mind-Blowing', '🌙 Late Night Vibe'],
    taggedFriendIds: ['friend-alex'],
    favorite: true
  },
  {
    id: 'movie-3',
    title: 'Little Women',
    releaseYear: 2019,
    director: 'Greta Gerwig',
    runtimeMinutes: 135,
    genres: ['Drama', 'Romance', 'Period'],
    posterPath: '/images/posters/little_women.jpg',
    userRating: 5.0,
    reviewNotes: 'Such a warm, enveloping tapestry of sisterhood, creative ambition, and timeless love! Jo running through the streets with her manuscript is pure cinematic euphoria.',
    dateWatched: '2026-08-08',
    watchFormat: 'Projector 🎞️',
    venue: '4K Blu-ray',
    isRewatch: true,
    hashtags: ['#PeriodDrama', '#Sisterhood', '#AnalogueVibes'],
    moodTags: ['☁️ Comfort Watch', '🌸 Feel-Good', '🎨 Aesthetic Gem'],
    taggedFriendIds: ['friend-sarah'],
    favorite: true
  },
  {
    id: 'movie-4',
    title: 'Dune: Part Two',
    releaseYear: 2024,
    director: 'Denis Villeneuve',
    runtimeMinutes: 166,
    genres: ['Sci-Fi', 'Action', 'Adventure'],
    posterPath: '/images/posters/dune.jpg',
    userRating: 4.5,
    reviewNotes: 'A towering audiovisual sensation! The orange desert vistas and thumping ornithopter designs felt overwhelming in the best way possible on the biggest screen.',
    dateWatched: '2026-08-14',
    watchFormat: 'IMAX 📽️',
    venue: 'IMAX',
    isRewatch: false,
    hashtags: ['#SciFiEpic', '#IMAXExperience', '#DesertVistas'],
    moodTags: ['✨ Mind-Blowing', '🍿 Edge of Seat', '🎨 Aesthetic Gem'],
    taggedFriendIds: ['friend-alex'],
    favorite: false
  },
  {
    id: 'movie-5',
    title: 'Amélie',
    releaseYear: 2001,
    director: 'Jean-Pierre Jeunet',
    runtimeMinutes: 122,
    genres: ['Romance', 'Comedy', 'Indie'],
    posterPath: '/images/posters/amelie.jpg',
    userRating: 5.0,
    reviewNotes: 'Cracking the caramelized sugar on a crème brûlée! This whimsical Parisian fable remains the ultimate remedy for any dreary day.',
    dateWatched: '2026-08-18',
    watchFormat: 'Cozy Couch 🛋️',
    venue: 'Criterion Channel',
    isRewatch: true,
    hashtags: ['#FrenchCinema', '#Whimsy', '#ComfortWatch'],
    moodTags: ['🌸 Feel-Good', '☁️ Comfort Watch', '🎨 Aesthetic Gem'],
    taggedFriendIds: ['friend-maya'],
    favorite: true
  },
  {
    id: 'movie-6',
    title: 'La La Land',
    releaseYear: 2016,
    director: 'Damien Chazelle',
    runtimeMinutes: 128,
    genres: ['Romance', 'Drama', 'Musical'],
    posterPath: '/images/posters/lala_land.jpg',
    userRating: 4.0,
    reviewNotes: 'The twirling jazz bar sequences and violet Los Angeles twilight skies are enchanting, even if the epilogue breaks my heart every time.',
    dateWatched: '2026-08-22',
    watchFormat: 'Streaming 💻',
    venue: 'Apple TV+',
    isRewatch: true,
    hashtags: ['#JazzCinema', '#CityOfStars', '#Romance'],
    moodTags: ['🥺 Tearjerker', '🎨 Aesthetic Gem', '🌙 Late Night Vibe'],
    taggedFriendIds: ['friend-sarah', 'friend-alex'],
    favorite: false
  }
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'friend-sarah',
    name: 'Sarah Film & Tea',
    handle: '@sarah_filmtea',
    avatar: '/images/avatars/sarah.jpg',
    compatibilityScore: 96,
    isOnline: true,
    bio: 'Avid tea collector & studio ghibli enthusiast. Always hunting for comforting autumn soundtracks. 🫖🌿',
    favoriteGenres: ['Animation', 'Indie', 'Period Drama'],
    watchedLibrary: [
      {
        id: 'sarah-m1',
        title: 'Kiki\'s Delivery Service',
        releaseYear: 1989,
        director: 'Hayao Miyazaki',
        runtimeMinutes: 103,
        genres: ['Animation', 'Fantasy'],
        posterPath: '/images/posters/totoro.jpg',
        userRating: 5.0,
        reviewNotes: 'The seaside bakeries and gentle lessons on burnout and creative independence hit so close to home!',
        dateWatched: '2026-07-29',
        watchFormat: 'Cozy Couch 🛋️',
        moodTags: ['☁️ Comfort Watch', '🌸 Feel-Good'],
        favorite: true
      },
      {
        id: 'sarah-m2',
        title: 'Portrait of a Lady on Fire',
        releaseYear: 2019,
        director: 'Céline Sciamma',
        runtimeMinutes: 122,
        genres: ['Romance', 'Drama'],
        posterPath: '/images/posters/little_women.jpg',
        userRating: 5.0,
        reviewNotes: 'Every frame is literally a Renaissance oil painting. The tension around the bonfire is spellbinding.',
        dateWatched: '2026-07-22',
        watchFormat: 'Cinema 🎟️',
        moodTags: ['🎨 Aesthetic Gem', '🥺 Tearjerker'],
        favorite: true
      }
    ],
    recentActivities: [
      {
        id: 'act-1',
        type: 'review',
        movieTitle: 'Kiki\'s Delivery Service',
        rating: 5.0,
        comment: 'Baked cinnamon scones and rewatched this absolute treasure. Nothing cures autumn blues faster! 🍞🧹',
        timeAgo: '2 hours ago',
        posterPath: '/images/posters/totoro.jpg',
        likes: 12,
        likedByMe: true
      },
      {
        id: 'act-2',
        type: 'watch_together',
        movieTitle: 'My Neighbor Totoro',
        rating: 5.0,
        comment: 'Had the warmest watch party with @cozy_cineast last night under matching fluffy throws!',
        timeAgo: '1 day ago',
        posterPath: '/images/posters/totoro.jpg',
        likes: 18,
        likedByMe: false
      }
    ]
  },
  {
    id: 'friend-alex',
    name: 'Alex Rivera',
    handle: '@arivera_cine',
    avatar: '/images/avatars/alex.jpg',
    compatibilityScore: 88,
    isOnline: false,
    bio: 'Visual director & 35mm projector romantic. Drawn to desert architecture and moody sci-fi lighting. 🎞️🌵',
    favoriteGenres: ['Sci-Fi', 'Romance', 'Thriller'],
    watchedLibrary: [
      {
        id: 'alex-m1',
        title: 'Blade Runner 2049',
        releaseYear: 2017,
        director: 'Denis Villeneuve',
        runtimeMinutes: 163,
        genres: ['Sci-Fi', 'Action'],
        posterPath: '/images/posters/dune.jpg',
        userRating: 4.5,
        reviewNotes: 'Roger Deakins created an immortal masterpiece of neon smog and amber holograms.',
        dateWatched: '2026-07-26',
        watchFormat: 'IMAX 📽️',
        moodTags: ['✨ Mind-Blowing', '🎨 Aesthetic Gem', '🌙 Late Night Vibe'],
        favorite: true
      }
    ],
    recentActivities: [
      {
        id: 'act-3',
        type: 'review',
        movieTitle: 'Blade Runner 2049',
        rating: 4.5,
        comment: 'Studied the color grading during the Las Vegas ruins scenes for a creative project. Pure alchemy.',
        timeAgo: '3 days ago',
        posterPath: '/images/posters/dune.jpg',
        likes: 9,
        likedByMe: true
      }
    ]
  },
  {
    id: 'friend-maya',
    name: 'Maya Lin',
    handle: '@mayablossom',
    avatar: '/images/avatars/maya.jpg',
    compatibilityScore: 92,
    isOnline: true,
    bio: 'French new wave romantic & vinyl collector. Looking for movies that feel like sunspots in an antique bookshop. ☀️📚',
    favoriteGenres: ['Romance', 'Indie', 'Comedy'],
    watchedLibrary: [
      {
        id: 'maya-m1',
        title: 'Chungking Express',
        releaseYear: 1994,
        director: 'Wong Kar-wai',
        runtimeMinutes: 102,
        genres: ['Romance', 'Indie', 'Drama'],
        posterPath: '/images/posters/amelie.jpg',
        userRating: 5.0,
        reviewNotes: 'California Dreamin on repeat! The step-printed neon blur of 1990s Hong Kong is intoxicating.',
        dateWatched: '2026-07-30',
        watchFormat: 'Projector 🎞️',
        moodTags: ['🎨 Aesthetic Gem', '🌸 Feel-Good', '🌙 Late Night Vibe'],
        favorite: true
      }
    ],
    recentActivities: [
      {
        id: 'act-4',
        type: 'watchlist_add',
        movieTitle: 'In the Mood for Love',
        comment: 'Adding to our upcoming Sunday terrace projection marathon! Bring your tea glasses 🍵✨',
        timeAgo: '4 hours ago',
        posterPath: '/images/posters/past_lives.jpg',
        likes: 15,
        likedByMe: false
      }
    ]
  }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Kiki\'s Delivery Service',
    releaseYear: 1989,
    director: 'Hayao Miyazaki',
    runtimeMinutes: 103,
    genres: ['Animation', 'Fantasy', 'Family'],
    moods: ['☁️ Comfort Watch', '🌸 Feel-Good', '🎨 Aesthetic Gem'],
    matchReason: 'Shared Taste • Inspired by your recent 5.0★ rating of My Neighbor Totoro & @sarah_filmtea logging this film yesterday!',
    posterPath: '/images/posters/totoro.jpg',
    matchPercentage: 98,
    savedToWatchlist: true
  },
  {
    id: 'rec-2',
    title: 'Chungking Express',
    releaseYear: 1994,
    director: 'Wong Kar-wai',
    runtimeMinutes: 102,
    genres: ['Romance', 'Indie'],
    moods: ['🎨 Aesthetic Gem', '🌸 Feel-Good', '🌙 Late Night Vibe'],
    matchReason: 'Shared Taste • Recommended because you & @mayablossom recently watched aesthetic 90s Romance and indie films together.',
    posterPath: '/images/posters/amelie.jpg',
    matchPercentage: 95,
    savedToWatchlist: false
  },
  {
    id: 'rec-3',
    title: 'Portrait of a Lady on Fire',
    releaseYear: 2019,
    director: 'Céline Sciamma',
    runtimeMinutes: 122,
    genres: ['Romance', 'Drama'],
    moods: ['🎨 Aesthetic Gem', '🥺 Tearjerker', '✨ Mind-Blowing'],
    matchReason: 'Circle Favorite • High taste overlap with @sarah_filmtea who awarded this film an uncompromised 5.0★ masterpiece score.',
    posterPath: '/images/posters/little_women.jpg',
    matchPercentage: 94,
    savedToWatchlist: true
  },
  {
    id: 'rec-4',
    title: 'Arrival',
    releaseYear: 2016,
    director: 'Denis Villeneuve',
    runtimeMinutes: 116,
    genres: ['Sci-Fi', 'Drama'],
    moods: ['✨ Mind-Blowing', '🥺 Tearjerker', '🌙 Late Night Vibe'],
    matchReason: 'Recent Director Match • Because you and @arivera_cine both recently logged Denis Villeneuve\'s monumental direction in Dune: Part Two.',
    posterPath: '/images/posters/dune.jpg',
    matchPercentage: 91,
    savedToWatchlist: false
  }
];
