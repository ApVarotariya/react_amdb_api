import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";
import { Link } from "react-router-dom";

const PopularPeople = (props) => {
  const [page, setPage] = useState(1);
  const [popularPeople, setPopularPeople] = useState([]);
  const { cardLimit = 20, showPagination = true, showButton = false } = props;

  const fetchData = async () => {
    const popularPeople = await axios.get(
      `https://api.themoviedb.org/3/person/popular?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setPopularPeople(popularPeople.data.results);
    // console.log(popularPeople);
  };
  useEffect(() => {
    fetchData();
  }, [page]);
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            Popular People
          </h1>
          {showButton === true && (
            <div className="show_more_btn_main">
              <div className="show_more_btn">
                <Link
                  to={`/trending`}
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
            {popularPeople?.slice(0, cardLimit).map((c) => {
              return (
                <MovieBox
                  key={c.id}
                  id={c.id}
                  title={c.name}
                  poster={c.profile_path}
                  vote_average={c.vote_average}
                  media_type="person"
                  overview={c.overview}
                  vote_count={c.vote_count}
                  popularity={c.popularity}
                />
              );
            })}
          </div>
        </div>
        {/* <CustomPagination setPage={setPage} /> */}
      </div>
    </>
  );
};

export default PopularPeople;
