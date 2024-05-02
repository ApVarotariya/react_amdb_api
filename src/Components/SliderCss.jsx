import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { unavailable } from "./README";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const API_IMG = "https://image.tmdb.org/t/p/original";

const Main = () => {
  const sliderRef = useRef(null);
  const [trending, setTrending] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    const response = await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_ACCESS_KEY}&page}`);
    setTrending(response.data.results);
    setIsDataLoaded(true);
  };

  useEffect(() => {
    fetchData();
    document.body.classList.add("home");
    return () => {
      document.body.classList.remove("home");
    };
  }, []);

  const handleNextClick = () => {
    sliderRef.current.append(sliderRef.current.children[0]);
  };

  const handlePrevClick = () => {
    sliderRef.current.prepend(sliderRef.current.children[sliderRef.current.children.length - 1]);
  };

  return (
    <>
      <section className="animated_slider">
        <ul ref={sliderRef}>
          {trending.map((t) => {
            return (
              <li className="item" style={{ backgroundImage: t.backdrop_path ? `url(${API_IMG}${t.backdrop_path})` : `url(${unavailable})` }}>
                <div className="content">
                  {console.log(t)}
                  <h2 className="title">{t.original_name || t.original_title}</h2>
                  <p className="description">{t.overview}</p>
                  <Link
                    to={`/${t.media_type}/${t.id}`}
                    as="button"
                    onClick={() => {
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    <Button variant="success">More Details</Button>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <nav className="animated nav">
          <span className="arrowbtn prev" onClick={handlePrevClick}>
            <BsChevronLeft />
          </span>
          <span className="arrowbtn next" onClick={handleNextClick}>
            <BsChevronRight />
          </span>
        </nav>
      </section>
    </>
  );
};

export default Main;
