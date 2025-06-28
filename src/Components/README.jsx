export const BASE_API_URL = "https://api.themoviedb.org/3/";
export const STREAM_URL_RENDER = "https://amdb-8stream-api.onrender.com";
export const STREAM_URL_VERCEL = "https://amdb-8stream-api.vercel.app";

// Other API ENDPOINTS :
export const API_URL_BOLLYWOOD_MOVIES = (page) =>
  `discover/movie?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=hi-IN&region=IN&sort_by=popularity.desc&page=${page}&primary_release_year=2018&with_original_language=hi`;
export const API_URL_CREDITS = (media_type, id) =>
  `${media_type}/${id}/credits?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=en-US`;
export const API_URL_TRENDING_WEEK =
  "trending/all/week?api_key=${process.env.REACT_APP_ACCESS_KEY}&page}";
export const API_URL_TRENDING_DAY =
  "trending/all/day?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}";
// export const API_URL_DISCOVER_MOVIES =
//   "discover/movie?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}${selectedGenres.length > 0? `&with_genres=${selectedGenres.join(",")}`: ""}${selectedGenres.includes("bollywood") ? "&with_original_language=hi" : ""}";
export const API_URL_GENRE =
  "genre/movie/list?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=en-US";
export const API_URL_POPULAR_MOVIES =
  "movie/popular?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}";
export const API_URL_POPULAR_PEOPLE =
  "person/popular?api_key=${process.env.REACT_APP_ACCESS_KEY}";
export const API_URL_SEARCH_MULTI =
  "search/multi?api_key=${process.env.REACT_APP_ACCESS_KEY}&query=${query}&page=${page}";
export const API_URL_SINGLE_DETAILS =
  "${state}/${id}?api_key=${process.env.REACT_APP_ACCESS_KEY}";
export const API_URL_SINGLE_DETAILS_SIMILAR =
  "${state}/${id}/similar?api_key=${process.env.REACT_APP_ACCESS_KEY}";
export const API_URL_VIDEOS =
  "${media_type}/${id}/videos?api_key=${process.env.REACT_APP_ACCESS_KEY}&append_to_response=videos";
export const API_URL_TV_SERIES_GLOBAL =
  "discover/tv?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}";
export const API_URL_TV_SERIES_INDIAN =
  "discover/tv?api_key=${process.env.REACT_APP_ACCESS_KEY}&with_original_language=hi";
export const API_URL_UPCOMING_MOVIES =
  "movie/upcoming?api_key=${process.env.REACT_APP_ACCESS_KEY}&original_language=hi&page=1";

// IMG not Available
export const unavailable =
  "https://www.movienewz.com/img/films/poster-holder.jpg";

// Landscape IMG not Available
export const unavailableLandscape =
  "https://user-images.githubusercontent.com/10515204/56117400-9a911800-5f85-11e9-878b-3f998609a6c8.jpg";
