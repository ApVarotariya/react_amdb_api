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
import LatestTrailers from "./LatestTrailers";

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
    // console.log(trending.data.results);
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

  const getImageData = async (imagePath) => {
    let dynamicImage;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const colors = { r: 0, g: 0, b: 0 };

    dynamicImage = API_IMG200 + imagePath;
    try {
      const response = await fetch(`${dynamicImage}`);
      const blob = await response.blob();
      const img = await createImageBitmap(blob);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixelCount = imageData.data.length / 4;

      for (let i = 0; i < imageData.data.length; i += 4) {
        colors.r += imageData.data[i];
        colors.g += imageData.data[i + 1];
        colors.b += imageData.data[i + 2];
      }

      colors.r = Math.round(colors.r / pixelCount);
      colors.g = Math.round(colors.g / pixelCount);
      colors.b = Math.round(colors.b / pixelCount);
      // const bggradient = `linear-gradient(to right, rgba(${colors.r},${colors.g},${colors.b},1) calc((50vw - 170px) - 340px), rgba(${colors.r},${colors.g},${colors.b},0.84) 50%,rgba(${colors.r},${colors.g},${colors.b},0.84) 100%)`;
      const bggradient = `linear-gradient(to top right, rgba(${colors.r},${colors.g},${colors.b},1) 20%, rgba(${colors.r},${colors.g},${colors.b},0) 90%)`;
      setGradient(bggradient);
    } catch (error) {
      console.error("error", error);
    }
  };
  if (trending[0]?.backdrop_path) {
    getImageData(trending[0]?.backdrop_path);
  }
  const handleSlideChange = (swiper) => {
    const currentSlideIndex = swiper.realIndex;
    const currentSlide = trending[currentSlideIndex];

    setCurrentSlide(currentSlide);
    if (currentSlide.backdrop_path) {
      getImageData(currentSlide.backdrop_path);
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
          <Swiper
            ref={sliderRef}
            className="home_hero_slider"
            effect={"fade"}
            modules={[Navigation, Pagination, EffectFade]}
            spaceBetween={50}
            slidesPerView={1}
            navigation
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
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
                    <h1 className="home_slider_title">
                      {c.title || c.name}
                      <span>
                        (
                        {dateFormat(c.release_date || c.first_air_date, "yyyy")}
                        )
                      </span>
                    </h1>
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
      {/* <LatestTrailers /> */}
    </>
  );
};

export default Home;
