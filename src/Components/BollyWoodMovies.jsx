import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";

const BollyWoodMovies = () => {
  const [page, setPage] = useState(1);
  const [bollywoodMovies, setBollywoodMovies] = useState([]);

  const fetchData = async () => {
    const bollywoodMovies = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=hi-IN&region=IN&sort_by=popularity.desc&page=${page}&primary_release_year=2018&with_original_language=hi`
    );
    setBollywoodMovies(bollywoodMovies.data.results);
  };
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            Bollywood Movies
          </h1>
          {bollywoodMovies.map((c) => {
            return (
              <MovieBox
                key={c.id}
                id={c.id}
                title={c.title || c.original_name}
                poster={c.poster_path || c.backdrop_path}
                date={c.first_air_date || c.release_date}
                vote_average={c.vote_average}
                media_type="movie"
                overview={c.overview}
                vote_count={c.vote_count}
                popularity={c.popularity}
              />
            );
          })}
        </div>
        <CustomPagination setPage={setPage} />
      </div>
    </>
  );
};

export default BollyWoodMovies;
