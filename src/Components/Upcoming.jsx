import React, { useState, useEffect } from "react";
import axios from "axios";
import Hammer from "hammerjs";
import MovieBox from "./MovieBox";
const API_IMG = "https://image.tmdb.org/t/p/w300";
const UpComing = (props) => {
  const [page, setPage] = useState(1);
  const [upComing, setUpComing] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchData = async () => {
    const upComingData = await axios.get(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_ACCESS_KEY}&original_language=hi&page=1`
    );
    setUpComing(upComingData.data.results);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    const hammer = new Hammer(document.querySelector(".slider_main"));
    hammer.on("swipeleft", () => circularSlide("left"));
    hammer.on("swiperight", () => circularSlide("right"));

    return () => {
      hammer.destroy();
    };
  }, [currentIndex]);

  const updateClasses = (centerIndex) => {
    const cards = document.querySelectorAll(".carousel-card");

    cards.forEach((element, index) => {
      const card = element;
      card.classList.remove(
        "card-transform-origin-left",
        "card-transform-origin-right",
        "bg-position-right",
        "bg-position-left",
        "shrink-to-prev-or-next",
        "grow-card-full",
        "centerCard",
        "add-margin-animate-left",
        "outsideViewPort",
        "next-next-off-focus",
        "prevCard",
        "nextCard"
      );

      if (index === centerIndex) {
        card.classList.add(
          "card-transform-origin-left",
          "bg-position-right",
          "shrink-to-prev-or-next",
          "bg-position-left",
          "grow-card-full",
          "centerCard"
        );
      } else if (index === centerIndex - 1) {
        card.classList.add(
          "card-transform-origin-right",
          "card-transform-origin-left",
          "bg-position-left",
          "shrink-to-prev-or-next",
          "add-margin-animate-left",
          "prevCard"
        );
      } else if (index === centerIndex - 2) {
        card.classList.add("outsideViewPort");
      } else if (index === centerIndex + 1) {
        card.classList.add(
          "card-transform-origin-left",
          "bg-position-right",
          "next-next-off-focus",
          "nextCard"
        );
      } else {
        card.classList.add("outsideViewPort", "card-transform-origin-left");
      }
    });
  };

  const circularSlide = (direction) => {
    const totalCards = document.querySelectorAll(".carousel-card").length;

    if (direction === "left") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalCards);
    } else if (direction === "right") {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + totalCards) % totalCards);
    }

    if (currentIndex === 0) {
      const clonedItems = document
        .querySelectorAll(".carousel-card:nth-child(n + " + totalCards + ")")
        .cloneNode(true);
      document.querySelector(".slider_main").prepend(...clonedItems);
    } else if (currentIndex === totalCards - 1) {
      const clonedItems = document
        .querySelectorAll(".carousel-card:nth-child(-n + " + totalCards + ")")
        .cloneNode(true);
      document.querySelector(".slider_main").append(...clonedItems);
    }

    updateClasses(currentIndex);
  };

  return (
    <>
      <div className="container">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading my-3 text-black">
            Upcoming Movies
          </h1>
          <div className="slider_main">
            {upComing?.map((c) => {
              return (
                <div
                  className="carousel-card"
                  style={{ backgroundImage: `url(${API_IMG}${c.poster_path})` }}
                >
                  <div className="card_wrapper d-flex flex-wrap">
                    <h2>{c.title}</h2>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpComing;
