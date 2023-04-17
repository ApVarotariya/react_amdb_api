import axios from "axios";
import React, { useState, useEffect } from "react";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";
import { Triangle } from "react-loader-spinner";

const Main = () => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const movies = await axios.get(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}`
    );
    setMovies(movies.data.results);
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <>
      <div className="moviecard_main">
        <div className="container-fluid">
          <div className="row">
            <h1 className="text-center fw-lighter page_heading my-3 text-black">
              Trending Movies
            </h1>
            {isLoading ? (
              <Triangle
                height="80"
                width="80"
                color="#eac56b"
                ariaLabel="triangle-loading"
                wrapperStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                visible={true}
              />
            ) : (
              <>
                  {movies.map((c) => {
                  return (
                    <MovieBox
                      key={c.id}
                      id={c.id}
                      title={c.title || c.original_name}
                      poster={c.poster_path || c.backdrop_path}
                      date={c.first_air_date || c.release_date}
                      vote_average={c.vote_average}
                      media_type={c.media_type}
                      overview={c.overview}
                      vote_count={c.vote_count}
                      popularity={c.popularity}
                    />
                  );
                })}
              </>
            )}
          </div>
          <CustomPagination setPage={setPage} />
        </div>
      </div>
    </>
  );
};

export default Main;
