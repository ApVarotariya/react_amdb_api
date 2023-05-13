import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CardCarousel.css";
import axios from "axios";
const API_IMG = "https://image.tmdb.org/t/p/original";
const CardCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [trending, setTrending] = useState([]);

  const fetchData = async () => {
    const trending = await axios.get(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_ACCESS_KEY}&page}`
    );
    setTrending(trending.data.results);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAfterChange = (currentSlide) => {
    setActiveSlide(currentSlide);
  };

  const handleBeforeChange = (currentSlide, nextSlide) => {
    setActiveSlide(nextSlide);
  };

  const settings = {
    dots: true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    afterChange: handleAfterChange,
    beforeChange: handleBeforeChange,
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
                <p>{item.title || item.name}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <div className="active-slide">
        <img
          src={
            trending[activeSlide] &&
            `${API_IMG}${trending[activeSlide].backdrop_path}`
          }
          alt={`Slide ${activeSlide + 1}`}
        />
        <p>{trending[activeSlide]?.title || trending[activeSlide]?.name}</p>
        {console.log(trending[activeSlide]?.title)}
      </div>
    </>
  );
};

export default CardCarousel;
