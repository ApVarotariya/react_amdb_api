import React, { useEffect, useState } from "react";
import { Form, FormControl, Button, Tab, Nav } from "react-bootstrap";
import { Triangle } from "react-loader-spinner";
// import CustomPagination from "./CustomPagination";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import SearchDetails from "./SearchDetails";

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [searchMovies, setSearchMovies] = useState([]);
  const [searchTv, setSearchTv] = useState([]);
  const [searchPerson, setSearchPerson] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedValue, setSelectedValue] = useState('All');
  // const [type, setType] = useState(0);
  // const [numOfPages, setNumOfpages] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const searchMovie = async (e) => {
    setIsLoading(true);
    // e.preventDefault();
    try {
      const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_ACCESS_KEY}&query=${query}&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();
      const moviesArray = data.results.filter(
        (result) => result.media_type === "movie"
      );
      const tvArray = data.results.filter(
        (result) => result.media_type === "tv"
      );
      const personArray = data.results.filter(
        (result) => result.media_type === "person"
      );
      setSearchMovies(moviesArray);
      setSearchTv(tvArray);
      setSearchPerson(personArray);
      setMovies(data.results);
      setIsLoading(false);
    } catch (e) {
      // handle error
      setIsLoading(false);
    }
  };

  const changeHandler = (e) => {
    setQuery(e.target.value);
  };
  const handleSelect = (value) => {
    setSelectedValue(value);
    // console.log(value)
  };
  useEffect(() => {
    // setSearchMovies()
    // setSearchTv()
    // setMovies()
    // setSearchPerson()
  }, [query]);

  return (
    <>
      <div className="moviecard_main search_page_main">
        <div className="container-fluid">
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
                  <Form className="d-flex search-form-main">
                    <FormControl
                      type="search"
                      placeholder="Search Movie"
                      className="me-2"
                      aria-label="search"
                      name="query"
                      value={query}
                      onChange={changeHandler}
                    ></FormControl>
                    <Button
                      variant="success"
                      type="submit"
                      onClick={searchMovie}
                    >
                      Search
                    </Button>
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
                        <Dropdown as={ButtonGroup} onSelect={handleSelect} SelectedValue="All">
                          <Button variant="primary">{selectedValue}</Button>
                          <Dropdown.Toggle
                            split
                            variant="primary"
                            id="dropdown-split-basic"
                          />
                          <Dropdown.Menu>
                            <Dropdown.Item eventKey="All">
                              All
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Movies">
                              Movies
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Tv Series">
                              Tv Series
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Actor/Actress">
                              Actor/Actress
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="mt-5">
                        <h2 className="text-black text-center">
                          Search Results for :
                          <h3 className="search_text-query text-uppercase d-inline-block font-weight-bold">
                            &nbsp;{query}
                          </h3>
                        </h2>
                      </div>
                      <Tab.Content>
                        <Tab.Pane eventKey="All">
                          <div className="row mt-5">
                            {movies && movies.length > 0 ? (
                              movies.map((c) => {
                                return (
                                  <SearchDetails
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
                        <Tab.Pane eventKey="Movies">
                          <div className="row mt-5">
                            {searchMovies && searchMovies.length > 0 ? (
                              searchMovies.map((c) => {
                                return (
                                  <SearchDetails
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
                                  <SearchDetails
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
                                  <SearchDetails
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
                      </Tab.Content>
                    </Tab.Container>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* <CustomPagination setPage={setPage} /> */}
        </div>
      </div>
    </>
  );
};

export default Search;
