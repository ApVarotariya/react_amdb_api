import React, { useEffect, useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import MovieBox from "./MovieBox";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Triangle } from "react-loader-spinner";
import CustomPagination from "./CustomPagination";

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
      const url = `https://api.themoviedb.org/3/search/${
        type ? "tv" : "movie"
      }?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f&query=${query}&page=${page}`;

      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results);
      // setNumOfpages(data.total_pages);
      setIsLoading(false);
    } catch (e) {
      // console.log(e);
    }
  };
  // useEffect(() => {
  //   searchMovie();
  // }, [page,query]);

  const changeHandler = (e) => {
    setQuery(e.target.value);
    console.log(e.target.value);
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
                    <Tabs
                      value={type}
                      onChange={(event, newValue) => {
                        setType(newValue);
                        setPage(1);
                      }}
                      style={{ width: "100%" }}
                    >
                      <Tab
                        style={{ width: "50%", color: "#fff" }}
                        label="Search Movie"
                      ></Tab>
                      <Tab
                        style={{ width: "50%" }}
                        label="Search TV Series"
                      ></Tab>
                    </Tabs>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="row">
            {movies.map((c) => {
              return  <MovieBox key={c.id} id={c.id} title={c.title || c.original_name} 
              poster={c.poster_path || c.backdrop_path} date={c.first_air_date || c.release_date} 
              vote_average={c.vote_average} media_type={type ? "tv" : "movie"}
               overview={c.overview} vote_count={c.vote_count} popularity={c.popularity}/>;
            })}
          </div>
          <CustomPagination setPage={setPage} />
        </div>
      </div>
    </>
  );
};

export default Search;
