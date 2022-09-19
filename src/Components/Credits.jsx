import axios from "axios";
import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { unavailable } from "./README";
import "react-alice-carousel/lib/alice-carousel.css";

const API_IMG = "https://image.tmdb.org/t/p/w300/";

const handleDragStart = (e) => e.preventDefault();

const Credits = ({ id, media_type }) => {
  const [credits, setCredits] = useState([]);

  const items = credits?.map((c) => ( 
    <div className="carouselItem">
      <img
        src={c.profile_path ? API_IMG + c.profile_path : unavailable}
        alt={c?.name}
        onDragStart={handleDragStart}
        className="carouselItem__img"
      />
      <b className="carouselItem__txt">{c?.name}</b>
    </div>
  ));

  const responsive = {
    0: { items: 1 },
    568: { items: 3 },
    1024: { items: 5 },
  };

  const fetchCredits = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f&language=en-US`
    );
    setCredits(data.cast);
    // console.log(data.cast);
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
      autoPlay
    />
    </>
  );
};

export default Credits;