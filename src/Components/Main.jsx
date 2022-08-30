import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import MovieBox from "./MovieBox";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import brandLogo from "../images/Logo.png";
import { Triangle } from "react-loader-spinner";

const API_URL =
  "https://api.themoviedb.org/3/movie/popular?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f";

const Main = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    const movies = await axios.get(API_URL);
    setMovies(movies.data.results);
    // console.log(movies.data.results);
    // console.log(movies);
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
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
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <Navbar expand="lg" className="px-0">
                <Navbar.Brand href="#home">
                  <img
                    src={brandLogo}
                    style={{
                      width: "100px",
                      borderRadius: "4px",
                    }}
                  />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    <Nav.Link href="#home">Trending</Nav.Link>
                    <Nav.Link href="#link">TV Series</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
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
          {movies.length > 0 ? (
            <div className="row justify-content-around">
              <h1 className="text-center fw-lighter page_heading mb-5">
                Popular Movies
              </h1>
              {movies.map((movie) => {
                return <MovieBox key={movie.id} movie={movie} />;
              })}
            </div>
          ) : (
            <h1 className="error-search text-white">
              Oooops You must be misspelled!!!
              <br />
              We have Arround 69k results of data
            </h1>
          )}
        </div>
      </div>
    </>
  );
};

export default Main;
