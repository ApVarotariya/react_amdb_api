import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import MovieBox from "./MovieBox";
import { Triangle } from "react-loader-spinner";

const API_URL =
  "https://api.themoviedb.org/3/movie/popular?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f";

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchMovie = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    // console.log("searching");
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f&query=${query}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      setMovies(data.results);
      setIsLoading(false);
    } catch (e) {
      // console.log(e);
    }
  };
  const changeHandler = (e) => {
    setQuery(e.target.value);
  };
  return (
    <>
      <div className="moviecard_main">
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
                  wrapperClassName=""
                  visible={true}
                />
              ) : (
                <Form
                  className="d-flex search-form-main"
                  onSubmit={searchMovie}
                >
                  <FormControl
                    type="search"
                    placeholder="Search Movie"
                    className="me-2"
                    aria-label="search"
                    name="query"
                    value={query}
                    onChange={changeHandler}
                  ></FormControl>
                  <Button variant="success" type="submit">
                    Search
                  </Button>
                </Form>
              )}
            </div>
          </div>
          <div className="row justify-content-around">
            {movies.map((movie) => {
              return <MovieBox key={movie.id} movie={movie} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
