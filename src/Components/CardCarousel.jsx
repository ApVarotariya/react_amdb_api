import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CardCarousel.css";
import axios from "axios";

const API_IMG = "https://image.tmdb.org/t/p/original";

const CardCarousel = () => {
  const [trending, setTrending] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const fetchData = async () => {
    const trending = await axios.get(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_ACCESS_KEY}&page}`
    );
    setTrending(trending.data.results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSlideChange = (index) => {
    setActiveSlide(index);
  };

  const settings = {
    dots: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    afterChange: handleSlideChange,
  };

  return (
    <>
      <div className="slider_main">
        <div className="slider-container">
          <Slider {...settings}>
            {trending.map((item, index) => (
              <div key={index}>
                <img
                  src={API_IMG + item.backdrop_path}
                  alt={`Slide ${index + 1}`}
                />
                <p className="text-black">{item.title || item.name}</p>
              </div>
            ))}
          </Slider>
        </div>
        {trending[activeSlide] && (
          <div
            className="background-slide"
            style={{
              backgroundImage: `url(${
                API_IMG + trending[activeSlide].backdrop_path
              })`,
            }}
          ></div>
        )}
      </div>
    </>
  );
};

export default CardCarousel;
