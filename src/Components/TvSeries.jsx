import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";

const TvSeries = () => {
  const [page, setPage] = useState(1);
  const [tv, setTv] = useState([]);
  const [hindiTv, setHindiTv] = useState([]);

  const fetchData = async () => {
    const tvData = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}`
    );
    setTv(tvData.data.results);
  };

  const fetchHindiTv = async () => {
    const hindiTvData = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_ACCESS_KEY}&with_original_language=hi`
    );
    setHindiTv(hindiTvData.data.results);
  };

  useEffect(() => {
    if (hindiTv.length > 0) {
      setTv([]);
    } else {
      fetchData();
    }
  }, [page, hindiTv]);

  const handleAllTv = () => {
    setHindiTv([]);
    setPage(1);
  };

  const handleHindiTv = () => {
    fetchHindiTv();
    setPage(1);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            TV Series
          </h1>
          <div className="mt-5 mb-5 text-center">
            {hindiTv.length > 0 ? (
              <button className="genrebtn me-2" onClick={handleAllTv}>
                All TV Series
              </button>
            ) : (
              <button className="genrebtn me-2" onClick={handleHindiTv}>
                Hindi TV Series
              </button>
            )}
          </div>
          {hindiTv.length > 0
            ? hindiTv.map((c) => {
                return (
                  <MovieBox
                    key={c.id}
                    id={c.id}
                    title={c.title || c.original_name}
                    poster={c.poster_path || c.backdrop_path}
                    date={c.first_air_date || c.release_date}
                    vote_average={c.vote_average}
                    media_type={"tv"}
                    overview={c.overview}
                    vote_count={c.vote_count}
                    popularity={c.popularity}
                  />
                );
              })
            : tv.map((c) => {
                return (
                  <MovieBox
                    key={c.id}
                    id={c.id}
                    title={c.title || c.original_name}
                    poster={c.poster_path || c.backdrop_path}
                    date={c.first_air_date || c.release_date}
                    vote_average={c.vote_average}
                    media_type={"tv"}
                    overview={c.overview}
                    vote_count={c.vote_count}
                    popularity={c.popularity}
                  />
                );
              })}
        </div>
        <div className="d-flex justify-content-center mt-4">
          {tv.length > 0 && <CustomPagination setPage={setPage} />}
        </div>
      </div>
    </>
  );
};

export default TvSeries;
