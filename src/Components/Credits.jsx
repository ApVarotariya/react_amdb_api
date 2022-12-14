import axios from "axios";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { unavailable } from "./README";
import "react-alice-carousel/lib/alice-carousel.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const API_IMG = "https://image.tmdb.org/t/p/w300/";

const handleDragStart = (e) => e.preventDefault();

const Credits = ({ id, media_type }) => {
  const [credits, setCredits] = useState([]);

  const fetchCredits = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=en-US`
    );
    setCredits(data.cast);
    console.log(data.cast);
  };

  const items = credits?.map((c) => (
    <div className="carouselItem">
      <Link to={`/person/${credits && c.id}`}>
        <LazyLoadImage
          src={
            c.profile_path
              ? API_IMG + c.profile_path
              : unavailable || c.profile_path
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
    </div>
  ));

  const responsive = {
    0: { items: 1 },
    568: { items: 5 },
    1024: { items: 5 },
  };

  useEffect(() => {
    fetchCredits();
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <AliceCarousel
        mouseTracking
        infinite
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
        // autoPlay
        autoPlayInterval={600}
      />
    </>
  );
};

export default Credits;
