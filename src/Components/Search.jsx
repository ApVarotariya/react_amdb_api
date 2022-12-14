import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { Triangle } from "react-loader-spinner";
// import CustomPagination from "./CustomPagination";
import SearchDetails from "./SearchDetails";

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState(0);
  // const [numOfPages, setNumOfpages] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const searchMovie = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    console.log("searching");
    try {
      const url = `https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_ACCESS_KEY}&query=${query}&page=${page}`;
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results);
      console.log(data.results);
      setIsLoading(false);
    } catch (e) {
      // console.log(e);
    }
  };

  const changeHandler = (e) => {
    setQuery(e.target.value);
    console.log(e.target.value);
  };
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
                  <div className="search_by_tabs">
                    {/* <Tabs
                      value={type}
                      onChange={(event, newValue) => {
                        setType(newValue);
                        setPage(1);
                      }}
                      style={{ width: "100%" }}
                    >
                      <Tab
                        style={{ width: "50%", color: "#000" }}
                        label="Search Movie"
                      ></Tab>
                      <Tab
                        style={{ width: "50%", color: "#000" }}
                        label="Search TV Series"
                      ></Tab>
                    </Tabs> */}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="row">
            {movies.map((c) => {
              return (
                <SearchDetails
                  key={c.id}
                  id={c.id}
                  title={c.title || c.original_name || c.name}
                  poster={c.poster_path || c.backdrop_path || c.profile_path}
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
          {/* <CustomPagination setPage={setPage} /> */}
        </div>
      </div>
    </>
  );
};

export default Search;
