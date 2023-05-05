import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import { Link } from "react-router-dom";
import CustomPagination from "./CustomPagination";

const NowPlaying = (props) => {
  const [page, setPage] = useState(1);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [language, setLanguage] = useState("en-US");
  const { cardLimit = 20, showPagination = true, showButton = false } = props;

  useEffect(() => {
    const fetchNowPlaying = async (language) => {
      const globalUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=${language}&page=${page}`;
      const hindiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_ACCESS_KEY}&with_original_language=hi&page=${page}`;
      try {
        const response =
          language === "en-US"
            ? await axios.get(globalUrl)
            : await axios.get(hindiUrl);
        setNowPlaying(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNowPlaying(language);
  }, [language]);

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading my-3 text-black now_playing_title">
            Now in Theaters
            <select value={language} onChange={handleChange}>
              <option value="en-US">Global</option>
              <option value="hi">India</option>
            </select>
          </h1>
          {showButton === true && (
            <div className="show_more_btn_main">
              <div className="show_more_btn">
                <Link
                  to="/in-theaters-now"
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
            {nowPlaying?.slice(0, cardLimit).map((c) => {
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

export default NowPlaying;
