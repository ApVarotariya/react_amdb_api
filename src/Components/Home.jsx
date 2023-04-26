import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Triangle } from "react-loader-spinner";
import { unavailableLandscape } from "./README";
import "../Components/Home.css";
import dateFormat from "dateformat";
import Main from "./Main";
import TvSeries from "./TvSeries";
import Movies from "./Movies";
import PopularPeople from "./PopularPeople";
import UpComing from "./Upcoming";
import { Link } from "react-router-dom";
import GetGradientData from "./GetGradientData";
import NowPlaying from "./NowPlaying";

const API_IMG = "https://image.tmdb.org/t/p/original";
const API_IMG200 = "https://image.tmdb.org/t/p/w200";

const Home = () => {
  const sliderRef = useRef(null);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gradient, setGradient] = useState("");
  const [currentSlide, setCurrentSlide] = useState({});

  const fetchData = async () => {
    setIsLoading(true);
    const trending = await axios.get(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_ACCESS_KEY}&page}`
    );
    setTrending(trending.data.results);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
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
    const currentSlide = trending[currentSlideIndex];

    setCurrentSlide(currentSlide);
    if (currentSlide?.backdrop_path) {
      GetGradientData(currentSlide?.backdrop_path);
    }
  };

  return (
    <>
      {isLoading ? (
        <Triangle
          height="80"
          width="80"
          color="#eac56b"
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
          <div style={{ minHeight: "100vh" }}>
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
              {trending.slice(0, 5).map((c) => {
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
          </div>
        </>
      )}
      <Main cardLimit={6} showPagination={false} showButton={true} />
      <TvSeries
        cardLimit={6}
        showPagination={false}
        showHindi={false}
        showButton={true}
      />
      <Movies
        cardLimit={6}
        showPagination={false}
        showGenre={false}
        showButton={true}
      />
      <PopularPeople cardLimit={10} showPagination={false} showButton={false} />
      <UpComing cardLimit={10} showPagination={false} showButton={true} />
      <NowPlaying showPagination={false} showButton={false} />
    </>
  );
};

export default Home;
