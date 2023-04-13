import React, { useState } from "react";
import { Form, FormControl, Button, Tab, Nav, Card } from "react-bootstrap";
import { Triangle } from "react-loader-spinner";
// import CustomPagination from "./CustomPagination";
import SearchDetails from "./SearchDetails";

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [searchMovies, setSearchMovies] = useState([]);
  const [searchTv, setSearchTv] = useState([]);
  const [searchPerson, setSearchPerson] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  // const [type, setType] = useState(0);
  // const [numOfPages, setNumOfpages] = useState();
  const [isLoading, setIsLoading] = useState(false);

const searchMovie = async (e) => {
  setIsLoading(true);
  e.preventDefault();
  try {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_ACCESS_KEY}&query=${query}&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();
    const moviesArray = data.results.filter((result) => result.media_type === "movie");
    const tvArray = data.results.filter((result) => result.media_type === "tv");
    const personArray = data.results.filter((result) => result.media_type === "person");
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
  }

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
                    <Tab.Container defaultActiveKey="allresult">
                      {/* <Card> */}
                        {/* <Card.Body> */}
                          <Nav
                            variant="pills"
                            className="bg-nav-pills nav-justified mb-0"
                          >
                            <Nav.Item>
                              <Nav.Link eventKey="allresult">All</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="movieresult">Movies</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="tvresult">TV Series</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="personresult">
                                Actor/Actress
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                        {/* </Card.Body> */}
                      {/* </Card> */}
                      <div className="mt-5">
                        <h2 className="text-black text-center">
                          Search Results for :
                          <h3 className="search_text-query text-uppercase d-inline-block font-weight-bold">
                            &nbsp;{query}
                          </h3>
                        </h2>
                      </div>
                      <Tab.Content>
                        <Tab.Pane eventKey="allresult">
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
                        <Tab.Pane eventKey="movieresult">
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
                        <Tab.Pane eventKey="tvresult">
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
                        <Tab.Pane eventKey="personresult">
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
