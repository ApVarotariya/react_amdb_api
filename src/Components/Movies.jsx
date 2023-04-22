import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Movies = (props) => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [numOfPages, setNumOfPages] = useState();
  const {
    cardLimit = 20,
    showPagination = true,
    showGenre = true,
    showButton = false,
  } = props;

  const fetchData = async () => {
    const movies = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${
        process.env.REACT_APP_ACCESS_KEY
      }&page=${page}${
        selectedGenres.length > 0
          ? `&with_genres=${selectedGenres.join(",")}`
          : ""
      }${
        selectedGenres.includes("bollywood") ? "&with_original_language=hi" : ""
      }`
    );
    setMovies(movies.data.results);
    setNumOfPages(movies.data.total_pages);
  };

  const fetchGenres = async () => {
    const genres = await axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=en-US`
    );
    setGenres(genres.data.genres);
  };

  const handleGenreClick = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
    setPage(1);
  };

  const handleRemoveSelectedGenre = (genreId) => {
    setSelectedGenres(selectedGenres.filter((id) => id !== genreId));
    setPage(1);
  };

  const handleBollywoodFilter = () => {
    if (selectedGenres.includes("bollywood")) {
      setSelectedGenres(
        selectedGenres.filter((genre) => genre !== "bollywood")
      );
    } else {
      setSelectedGenres([...selectedGenres, "bollywood"]);
    }
    setPage(1);
  };

  useEffect(() => {
    fetchData();
  }, [page, selectedGenres]);

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            Discover Movies
          </h1>
          {showGenre === true && (
            <div className="d-flex genre_filter_main mb-3">
              <p className="text-black me-2 genre_filter_title">Filter :</p>
              <div>
                <button
                  className={`genrebtn mx-1 my-2 ${
                    selectedGenres.includes("bollywood")
                      ? "btn_selected"
                      : "btn_not_selected"
                  }`}
                  onClick={() => handleBollywoodFilter()}
                >
                  Bollywood
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    className={`genrebtn mx-1 my-2 ${
                      selectedGenres.includes(genre.id)
                        ? "btn_selected"
                        : "btn_not_selected"
                    }`}
                    onClick={() => handleGenreClick(genre.id)}
                  >
                    {genre.name}
                    {selectedGenres.includes(genre.id) && (
                      <FaTimes
                        className="selected-genre-icon"
                        onClick={() => handleRemoveSelectedGenre(genre.id)}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          {showButton === true && (
            <div className="show_more_btn_main">
              <div className="show_more_btn">
                <Link
                  to={`/movies`}
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  Show More
                </Link>
              </div>
            </div>
          )}
          {movies.length > 0 ? (
            movies
              .slice(0, cardLimit)
              .map((movie) => (
                <MovieBox
                  key={movie.id}
                  id={movie.id}
                  title={movie.title || movie.original_name}
                  poster={movie.poster_path}
                  backdrop_path={movie.backdrop_path}
                  date={movie.first_air_date || movie.release_date}
                  vote_average={movie.vote_average}
                  media_type={"movie"}
                  overview={movie.overview}
                  vote_count={movie.vote_count}
                  popularity={movie.popularity}
                />
              ))
          ) : (
            <h2 className="text-black text-center mt-5">
              No matching Combinations.
            </h2>
          )}
        </div>
        {showPagination === true && numOfPages > 1 && (
          <CustomPagination setPage={setPage} numOfPages={numOfPages} />
        )}
      </div>
    </>
  );
};

export default Movies;
