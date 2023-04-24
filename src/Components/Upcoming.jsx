import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";

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
      <div className="container-fluid">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            UpComing Movies
          </h1>
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
        {/* <CustomPagination setPage={setPage} /> */}
      </div>
    </>
  );
};

export default UpComing;
