import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";

const MOVIES_API =
  "https://api.themoviedb.org/3/discover/movie?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}";
const Movies = () => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [numOfPages, setNumOfPages] = useState();

  const fetchData = async () => {
    const movies = await axios.get(MOVIES_API);
    setMovies(movies.data.results);
    setNumOfPages(movies.data.total_pages);
    // console.log(movies.data.results);
    // console.log(movies);
  };
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <h1 className="text-center fw-lighter page_heading mb-5">
            Discover Movies
          </h1>
          {movies.map((movie) => {
            return <MovieBox key={movie.id} movie={movie} />;
          })}
        </div>
        {numOfPages > 1 && (
          <CustomPagination setPage={setPage} numOfPages={numOfPages} />
        )}
      </div>
    </>
  );
};
export default Movies;
