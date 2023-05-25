import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import MovieBox from "./MovieBox";
import CustomPagination from "./CustomPagination";
import { Link } from "react-router-dom";
import GetGradientData from "./GetGradientData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper";
import { unavailableLandscape } from "./README";
import dateFormat from "dateformat";

const API_IMG = "https://image.tmdb.org/t/p/original";
const API_IMG200 = "https://image.tmdb.org/t/p/w200";

const Main = (props) => {
  const sliderRef = useRef(null);
  const [gradient, setGradient] = useState("");
  const [currentSlide, setCurrentSlide] = useState({});
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    cardLimit = 20,
    showPagination = true,
    showButton = false,
    showSlider = true,
  } = props;

  const fetchData = async () => {
    setIsLoading(true);
    const movies = await axios.get(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}`
    );
    setMovies(movies.data.results);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    document.body.classList.add("home");
    return () => {
      document.body.classList.remove("home");
    };
  }, []);

  useEffect(() => {
    let imagePath = API_IMG200 + currentSlide?.backdrop_path;
    const getGradient = async () => {
      const colors = await GetGradientData(imagePath);

      if (colors) {
        const bggradient = `linear-gradient(to top right, rgba(${colors.r},${colors.g},${colors.b},1) 20%, rgba(${colors.r},${colors.g},${colors.b},0) 90%)`;
        setGradient(bggradient);
      }
    };
    getGradient();
  }, [currentSlide]);

  const handleSlideChange = (swiper) => {
    const currentSlideIndex = swiper.realIndex;
    const currentSlide = movies[currentSlideIndex];

    setCurrentSlide(currentSlide);
    if (currentSlide?.backdrop_path) {
      GetGradientData(currentSlide?.backdrop_path);
    }
  };

  return (
    <>
      {showSlider === true && (
        <Swiper
          ref={sliderRef}
          className="home_hero_slider"
          effect={"fade"}
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          onSlideChange={handleSlideChange}
        >
          {movies.slice(0, 5).map((c) => {
            return (
              <SwiperSlide key={c.id}>
                <div
                  style={{
                    width: "100%",
                    minHeight: "100vh",
                    backgroundImage: `url(${
                      API_IMG + c?.backdrop_path ?? unavailableLandscape
                    })`,
                    backgroundSize: "cover",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                  }}
                >
                  <p>
                    <span className="media_type">
                      {c.media_type === "movie" ? "Movie" : "Tv Series"}
                    </span>
                    <span className="release_date">
                      <b>Released on&nbsp;</b>
                      {dateFormat(
                        c.release_date || c.first_air_date,
                        "mmmm dS, yyyy"
                      )}
                    </span>
                  </p>
                  <h1 className="home_slider_title">{c.title || c.name}</h1>
                  <p className="overview">{c.overview}</p>
                  <Link
                    className="learn_more"
                    to={`/${c.media_type}/${c.id}`}
                    onClick={() => {
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    View More
                  </Link>
                  <div
                    style={{
                      backgroundImage: gradient,
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                    }}
                  ></div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
      <div className="moviecard_main">
        <div className="container-fluid">
          <div className="row">
            <h1 className="text-center fw-lighter page_heading my-3 text-black">
              Trending
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
            {isLoading ? (
              <div className="text-black">Loading Data...</div>
            ) : (
              <div className="card_wrapper d-flex flex-wrap">
                {movies.slice(0, cardLimit).map((c) => {
                  return (
                    <MovieBox
                      key={c.id}
                      id={c.id}
                      title={c.title || c.original_name}
                      poster={c.poster_path || c.backdrop_path}
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
            )}
          </div>
          {showPagination === true && <CustomPagination setPage={setPage} />}
        </div>
      </div>
    </>
  );
};

export default Main;
