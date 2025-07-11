import React, { useEffect, useState } from "react";
import { Form, FormControl, Button, Tab, Nav } from "react-bootstrap";
import { Triangle } from "react-loader-spinner";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import { BASE_API_PROXY_URL, unavailable } from "./README";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import MovieBox from "./MovieBox";

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [searchMovies, setSearchMovies] = useState([]);
  const [searchTv, setSearchTv] = useState([]);
  const [searchPerson, setSearchPerson] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState("All");
  const [searchSuggestion, setSearchSuggestion] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [height, setHeight] = useState(0);

  const API_IMG = "https://image.tmdb.org/t/p/w300";

  const fetchSearchResults = async () => {
    setIsLoading(true);
    const data = await axios.get(
      `${BASE_API_PROXY_URL}search/multi?api_key=${process.env.REACT_APP_ACCESS_KEY}&query=${query}&page=${page}`
    );
    const searchresult = data.data.results;
    const moviesArray = searchresult.filter(
      (result) => result.media_type === "movie"
    );
    const tvArray = searchresult.filter((result) => result.media_type === "tv");
    const personArray = searchresult.filter(
      (result) => result.media_type === "person"
    );
    setSearchMovies(moviesArray);
    setSearchTv(tvArray);
    setSearchPerson(personArray);
    setMovies(searchresult);
    setIsLoading(false);
  };

  const fetchSearchSuggestions = async () => {
    const data = await axios.get(
      `${BASE_API_PROXY_URL}search/multi?api_key=${process.env.REACT_APP_ACCESS_KEY}&query=${query}&page=1`
    );
    const searchresult = data.data.results;
    setSearchSuggestion(searchresult);
  };

  const changeHandler = (e) => {
    setQuery(e.target.value);
  };
  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleInputFocus = (e) => {
    let box = document.querySelectorAll(".suggestion_item");
    let ans = [...box].map((val) => {
      return val;
    });
    let sum = ans.reduce((acc, val) => {
      return (
        acc +
        val.getBoundingClientRect().height +
        parseFloat(getComputedStyle(val).marginTop) +
        parseFloat(getComputedStyle(val).marginBottom)
      );
    }, 0);
    setHeight(sum);
  };

  useEffect(() => {
    handleInputFocus();
  }, [searchSuggestion, query]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 0) {
        fetchSearchSuggestions();
      } else {
        setSearchSuggestion([]);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <>
      <div className="moviecard_main search_page_main">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              {isLoading ? (
                <Triangle
                  height="80"
                  width="80"
                  color="#4fa94d"
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
                  <Form className="d-flex search-form-main position-relative">
                    <FormControl
                      type="search"
                      placeholder="Search Movie"
                      className="me-2"
                      aria-label="search"
                      name="query"
                      value={query}
                      onChange={changeHandler}
                      autoComplete="off"
                    />
                    <Button
                      variant="success"
                      type="submit"
                      onClick={fetchSearchResults}
                    >
                      Search
                    </Button>
                    <div
                      className="search_suggestion position-absolute w-100"
                      style={{ height: `${height}px` }}
                    >
                      {searchSuggestion.slice(0, 5).map((suggest) => {
                        return (
                          <div
                            className="d-flex suggestion_item"
                            key={suggest.id}
                          >
                            <Link
                              to={`/${suggest.media_type}/${suggest.id}`}
                              className="d-flex"
                              onClick={() => {
                                window.scrollTo({
                                  top: 0,
                                  left: 0,
                                  behavior: "smooth",
                                });
                              }}
                            >
                              <LazyLoadImage
                                style={{
                                  width: "40px",
                                  borderRadius: "6px",
                                  marginRight: "20px",
                                }}
                                src={
                                  suggest?.profile_path
                                    ? API_IMG + suggest?.profile_path
                                    : suggest?.poster_path
                                    ? API_IMG + suggest?.poster_path
                                    : unavailable
                                }
                              />
                              <div>
                                <p className="text-black suggestion_title">
                                  {query.length > 0 && (
                                    <>
                                      {(
                                        suggest?.title ||
                                        suggest?.name ||
                                        suggest?.original_name
                                      )
                                        .split(new RegExp(`(${query})`, "gi"))
                                        .map((part, i) =>
                                          part.toLowerCase() ===
                                          query.toLowerCase() ? (
                                            <strong key={i}>{part}</strong>
                                          ) : (
                                            part
                                          )
                                        )}
                                    </>
                                  )}
                                </p>
                                <span className="text-black suggestion_type">
                                  {suggest.media_type === "movie"
                                    ? `Movie${
                                        suggest.original_language
                                          ? ` (${suggest.original_language})`
                                          : ""
                                      }`
                                    : suggest.media_type === "tv"
                                    ? `TV Series${
                                        suggest.original_language
                                          ? ` (${suggest.original_language})`
                                          : ""
                                      }`
                                    : suggest.gender === 0
                                    ? "Not specified"
                                    : suggest.gender === 1
                                    ? "Female"
                                    : suggest.gender === 2
                                    ? "Male"
                                    : ""}
                                </span>
                                <span className="text-black suggestion_release_date">
                                  {suggest.release_date ||
                                  suggest.first_air_date
                                    ? dateFormat(
                                        suggest.release_date ||
                                          suggest.first_air_date,
                                        "mmmm dS, yyyy"
                                      )
                                    : "--"}
                                </span>
                              </div>
                            </Link>
                            <div className="suggestion_knwonfor mt-1">
                              {suggest.media_type === "person" &&
                                suggest?.known_for &&
                                suggest.known_for.map((knownfor) => {
                                  return (
                                    <>
                                      <Link
                                        to={`/${knownfor.media_type}/${knownfor.id}`}
                                        className="d-flex"
                                        key={knownfor.id}
                                        onClick={() => {
                                          window.scrollTo({
                                            top: 0,
                                            left: 0,
                                            behavior: "smooth",
                                          });
                                        }}
                                      >
                                        <p className="ms-4 mt-1 text-black suggestion_title mb-0">
                                          {knownfor?.title ||
                                            knownfor?.original_title ||
                                            knownfor?.name ||
                                            knownfor?.original_name}
                                        </p>
                                      </Link>
                                    </>
                                  );
                                })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Form>
                  <div className="search_by_tabs mt-5">
                    <Tab.Container defaultActiveKey="All">
                      <div className="d-none d-md-block">
                        <Nav
                          variant="pills"
                          className="bg-nav-pills nav-justified mb-0"
                        >
                          <Nav.Item>
                            <Nav.Link eventKey="All">All</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey="Movies">Movies</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey="Tv Series">TV Series</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link eventKey="Actor/Actress">
                              Actor/Actress
                            </Nav.Link>
                          </Nav.Item>
                        </Nav>
                      </div>
                      <div className="d-md-none search_dropdown text-center">
                        <Dropdown as={ButtonGroup} onSelect={handleSelect}>
                          <Button variant="primary">{selectedValue}</Button>
                          <Dropdown.Toggle
                            split
                            variant="primary"
                            id="dropdown-split-basic"
                          />
                          <Dropdown.Menu>
                            <Dropdown.Item
                              eventKey="All"
                              className={
                                selectedValue === "All" ? "selected" : ""
                              }
                            >
                              All
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="Movies"
                              className={
                                selectedValue === "Movies" ? "selected" : ""
                              }
                            >
                              Movies
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="Tv Series"
                              className={
                                selectedValue === "Tv Series" ? "selected" : ""
                              }
                            >
                              Tv Series
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="Actor/Actress"
                              className={
                                selectedValue === "Actor/Actress"
                                  ? "selected"
                                  : ""
                              }
                            >
                              Actor/Actress
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      {query && (
                        <div className="mt-5">
                          <h2 className="text-black text-center">
                            Search Results for :
                            <span className="search_text-query text-uppercase d-inline-block font-weight-bold">
                              &nbsp;{query}
                            </span>
                          </h2>
                        </div>
                      )}
                      <Tab.Content>
                        <Tab.Pane eventKey="All">
                          <div className="row mt-5">
                            {movies && movies.length > 0 ? (
                              movies.map((c) => {
                                return (
                                  <MovieBox
                                    key={c.id}
                                    id={c.id}
                                    title={c.title || c.original_name || c.name}
                                    poster={
                                      c.poster_path ||
                                      c.backdrop_path ||
                                      c.profile_path
                                    }
                                    date={c.first_air_date || c.release_date}
                                    vote_average={c.vote_average}
                                    media_type={c.media_type}
                                    overview={c.overview}
                                    vote_count={c.vote_count}
                                    popularity={c.popularity}
                                    gender={c.gender}
                                  />
                                );
                              })
                            ) : (
                              <h2 className="text-center text-black">
                                Sorry! Nothing to Show.
                              </h2>
                            )}
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="Movies">
                          <div className="row mt-5">
                            {searchMovies && searchMovies.length > 0 ? (
                              searchMovies.map((c) => {
                                return (
                                  <MovieBox
                                    key={c.id}
                                    id={c.id}
                                    title={c.title || c.original_name || c.name}
                                    poster={
                                      c.poster_path ||
                                      c.backdrop_path ||
                                      c.profile_path
                                    }
                                    date={c.first_air_date || c.release_date}
                                    vote_average={c.vote_average}
                                    media_type={c.media_type}
                                    overview={c.overview}
                                    vote_count={c.vote_count}
                                    popularity={c.popularity}
                                  />
                                );
                              })
                            ) : (
                              <h2 className="text-center text-black">
                                Sorry! Nothing to Show.
                              </h2>
                            )}
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="Tv Series">
                          <div className="row mt-5">
                            {searchTv && searchTv.length > 0 ? (
                              searchTv.map((c) => {
                                return (
                                  <MovieBox
                                    key={c.id}
                                    id={c.id}
                                    title={c.title || c.original_name || c.name}
                                    poster={
                                      c.poster_path ||
                                      c.backdrop_path ||
                                      c.profile_path
                                    }
                                    date={c.first_air_date || c.release_date}
                                    vote_average={c.vote_average}
                                    media_type={c.media_type}
                                    overview={c.overview}
                                    vote_count={c.vote_count}
                                    popularity={c.popularity}
                                  />
                                );
                              })
                            ) : (
                              <h2 className="text-center text-black">
                                Sorry! Nothing to Show.
                              </h2>
                            )}
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="Actor/Actress">
                          <div className="row mt-5">
                            {searchPerson && searchPerson.length > 0 ? (
                              searchPerson.map((c) => {
                                return (
                                  <MovieBox
                                    key={c.id}
                                    id={c.id}
                                    title={c.title || c.original_name || c.name}
                                    poster={
                                      c.poster_path ||
                                      c.backdrop_path ||
                                      c.profile_path
                                    }
                                    date={c.first_air_date || c.release_date}
                                    vote_average={c.vote_average}
                                    media_type={c.media_type}
                                    overview={c.overview}
                                    vote_count={c.vote_count}
                                    popularity={c.popularity}
                                    gender={c.gender}
                                  />
                                );
                              })
                            ) : (
                              <h2 className="text-center text-black">
                                Sorry! Nothing to Show.
                              </h2>
                            )}
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
