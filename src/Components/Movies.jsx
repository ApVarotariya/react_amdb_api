import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";

const Movies = () => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [numOfPages, setNumOfPages] = useState();

  const fetchData = async () => {
    const movies = await axios.get(

      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}`
    );
    setMovies(movies.data.results);
    setNumOfPages(movies.data.total_pages);
    console.log(movies.data.total_pages);
    console.log(movies.data.results);
    console.log(movies);
  };
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            Discover Movies
          </h1>
          {movies.map((c) => {
            return (
              <MovieBox
                key={c.id}
                id={c.id}
                title={c.title || c.original_name}
                poster={c.poster_path}
                backdrop_path={c.backdrop_path}
                date={c.first_air_date || c.release_date}
                vote_average={c.vote_average}
                media_type={"movie"}
                overview={c.overview}
                vote_count={c.vote_count}
                popularity={c.popularity}
              />
            );
          })}
        </div>
        {numOfPages > 1 && (
          <CustomPagination setPage={setPage} numOfPages={500} />
        )}
      </div>
    </>
  );
};
export default Movies;
