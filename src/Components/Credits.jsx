import axios from "axios";
import React, { useEffect, useState } from "react";
import { unavailable } from "./README";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link, useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import dateFormat from "dateformat";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

const API_IMG = "https://image.tmdb.org/t/p/w300/";

const handleDragStart = (e) => e.preventDefault();

const Credits = ({ id, media_type }) => {
  const { state } = useParams();
  const [credits, setCredits] = useState([]);
  const perPage = 8;
  const [next, setNext] = useState(perPage);
  const [disableCarousel, setDisableCarousel] = useState(true);

  const handleClick = () => {
    setNext(next + perPage);
  };

  const fetchCredits = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=en-US`
    );
    setCredits(data.cast);
  };

  useEffect(() => {
    fetchCredits();
  }, [id, state]);

  return (
    <>
      {(state === "movie" || state === "tv") && (
        <Swiper
          className="credit_slider"
          modules={[Autoplay, Navigation]}
          slidesPerView={6}
          speed={2000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
            },
            575: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
            1200: {
              slidesPerView: 6,
            },
          }}
          pagination={{ clickable: true }}
        >
          {credits?.map((c) => {
            return (
              <SwiperSlide className="carouselItem" key={c.id}>
                <Link
                  to={`/person/${credits && c.id}`}
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <LazyLoadImage
                    src={
                      c?.profile_path
                        ? API_IMG + c.profile_path
                        : c?.poster_path
                        ? API_IMG + c.poster_path
                        : unavailable
                    }
                    alt={c?.name}
                    onDragStart={handleDragStart}
                    className="carouselItem__img"
                  />
                  <p className="carouselItem__txt text-black my-1">
                    <strong>{c?.name || c?.original_title}</strong>
                  </p>
                  <b className="carouselItem__txt text-black">{c?.character}</b>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
      {state === "person" && disableCarousel && (
        <div className="d-flex flex-wrap">
          {credits.slice(0, next).map((cp) => (
            <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 moviecard">
              <Card>
                <Link
                  to={`/movie/${cp.id}`}
                  onClick={() => {
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <LazyLoadImage
                    src={
                      cp?.profile_path
                        ? API_IMG + cp.profile_path
                        : cp?.poster_path
                        ? API_IMG + cp.poster_path
                        : unavailable
                    }
                    alt={cp?.name}
                    className="carouselItem__img"
                  />
                  <Card.Body>
                    <Card.Title>
                      <h3>
                        <strong>
                          <span>{cp.title}</span>
                        </strong>
                        <span>{cp.vote_average}</span>
                      </h3>
                      <div className="d-flex justify-content-between align-items-start">
                        <p style={{ fontSize: "12px" }}>
                          <span>
                            {dateFormat(cp.release_date, "mmmm dS, yyyy")}
                          </span>
                        </p>
                        <p style={{ fontSize: "12px" }}>
                          {state === "tv" ? "TV Series" : "Movie"}
                        </p>
                      </div>
                    </Card.Title>
                    <Link
                      to={`/movie/${cp.id}`}
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
                  </Card.Body>
                </Link>
              </Card>
            </div>
          ))}
          <div className="text-center w-100">
            {next < credits.length && (
              <Button
                className="btn btn-lg mb-4 load_more_btn"
                onClick={handleClick}
              >
                Load more
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Credits;
