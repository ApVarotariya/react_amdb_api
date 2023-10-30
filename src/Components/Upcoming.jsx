import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import { Link } from "react-router-dom";
import CustomPagination from "./CustomPagination";

const UpComing = (props) => {
  const [page, setPage] = useState(1);
  const [upComing, setUpComing] = useState([]);
  const { cardLimit = 20, showPagination = true, showButton = false } = props;

  const fetchData = async () => {
    const upComing = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_ACCESS_KEY}&original_language=hi&page=1`
    );
    setUpComing(upComing.data.results);
  };
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <>
      <div className="container">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            UpComing Movies
          </h1>
          {showButton === true && (
            <div className="show_more_btn_main">
              <div className="show_more_btn">
                <Link
                  to={`/upComing`}
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
          <div className="card_wrapper d-flex flex-wrap">
            {upComing?.slice(0, cardLimit).map((c) => {
              return (
                <MovieBox
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  date={c.release_date}
                  poster={c.poster_path}
                  vote_average={c.vote_average}
                  media_type="movie"
                  overview={c.overview}
                  vote_count={c.vote_count}
                  popularity={c.popularity}
                />
              );
            })}
          </div>
        </div>
        {showPagination === true && <CustomPagination setPage={setPage} />}
      </div>
    </>
  );
};

export default UpComing;
