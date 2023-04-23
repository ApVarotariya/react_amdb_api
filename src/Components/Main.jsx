import axios from "axios";
import React, { useState, useEffect } from "react";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";
import { Triangle } from "react-loader-spinner";
import { Link } from "react-router-dom";

const Main = (props) => {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { cardLimit = 20, showPagination = true, showButton = false } = props;

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
              Trending
            </h1>
            {showButton === true && (
              <div className="show_more_btn_main">
                <div className="show_more_btn">
                  <Link
                    to={`/trending`}
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
              <div className="card_wrapper d-flex flex-wrap">
                {movies.slice(0, cardLimit).map((c) => {
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
              </div>
            )}
          </div>
          {showPagination === true && <CustomPagination setPage={setPage} />}
        </div>
      </div>
    </>
  );
};

export default Main;
