import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import { Link } from "react-router-dom";
import CustomPagination from "./CustomPagination";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { Button } from "react-bootstrap";

const NowPlaying = (props) => {
  const [page, setPage] = useState(1);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [language, setLanguage] = useState("Global");
  const { cardLimit = 20, showPagination = true, showButton = false } = props;

  useEffect(() => {
    const fetchNowPlaying = async (language) => {
      const globalUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=en-US&page=${page}`;
      const hindiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_ACCESS_KEY}&with_original_language=hi&page=${page}`;
      try {
        const response =
          language === "Global"
            ? await axios.get(globalUrl)
            : await axios.get(hindiUrl);
        setNowPlaying(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNowPlaying(language);
  }, [language]);

  const handleChange = (value) => {
    setLanguage(value);
  };
  return (
    <>
      <div className="container">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading my-3 text-black now_playing_title">
            Now in Theaters
            <div className="search_dropdown d-inline-block">
              <Dropdown as={ButtonGroup} onSelect={handleChange}>
                <Button variant="primary">{language}</Button>
                <Dropdown.Toggle
                  split
                  variant="primary"
                  id="dropdown-split-basic"
                />
                <Dropdown.Menu>
                  <Dropdown.Item
                    eventKey="Global"
                    className={language === "Global" ? "selected" : ""}
                  >
                    Global
                  </Dropdown.Item>
                  <Dropdown.Item
                    eventKey="India"
                    className={language === "India" ? "selected" : ""}
                  >
                    India
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
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
