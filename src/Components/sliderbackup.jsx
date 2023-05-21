import React, { useEffect, useRef, useState } from "react";
import "./CardCarousel.css";
import { Swiper } from "swiper";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import Splitting from "splitting";
import axios from "axios";

SwiperCore.use([Autoplay, Navigation, Pagination]);
const API_IMG = "https://image.tmdb.org/t/p/w500";
const CardCarousel = () => {
  const [trending, setTrending] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [topContent, setTopContent] = useState(null);
  const [bottomContent, setBottomContent] = useState(null);
  const heroElRef = useRef(null);
  const fullSizeWrapElRef = useRef(null);
  const swiperRef = useRef(null);
  const contentFullsizeEls = [];

  const fetchData = async () => {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_ACCESS_KEY}&page}`
    );
    setTrending(response.data.results);
    setIsDataLoaded(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      const heroEl = heroElRef.current;
      const fullSizeWrapEl = fullSizeWrapElRef.current;

      const contentEls = heroEl.querySelectorAll(".swiper .content");
      contentFullsizeEls.length = 0;
      contentEls.forEach((el) => {
        const clone = el.cloneNode(true);
        Splitting({ target: clone, by: "words" });
        clone.classList.add(
          "hero__content",
          "hero__content--hidden",
          "content--hero"
        );
        clone.classList.remove("content--slide");
        contentFullsizeEls.push(clone);

        fullSizeWrapEl.appendChild(clone);
      });

      const slideChange = (swiper) => {
        const total = swiper.slides.length;
        let contentIndex = swiper.realIndex % total;
        if (contentIndex < 0) {
          contentIndex = total + contentIndex;
        }
        console.log(contentIndex);

        const content = contentFullsizeEls[contentIndex];

        if (!content) return;

        setTopContent(content);

        const slideRect =
          swiper.slides[swiper.activeIndex].getBoundingClientRect();
        const parentRect = heroEl.getBoundingClientRect();

        content.style.transition = "none";
        content.style.left = slideRect.left - parentRect.left + "px";
        content.style.top = slideRect.top - parentRect.top + "px";
        content.style.width = slideRect.width + "px";
        content.style.height = slideRect.height + "px";
        content.style.borderRadius = "var(--border-radius, 0)";

        content.getBoundingClientRect();

        content.classList.remove("hero__content--hidden");
        content.classList.add("hero__content--top", "hero__content--grow");

        setTimeout(() => {
          content.style.transition = "";
          content.style.left = "";
          content.style.top = "";
          content.style.width = "";
          content.style.height = "";
          content.style.borderRadius = "";

          const onShowTextEnd = (event) => {
            if (event.target !== event.currentTarget) {
              event.currentTarget.classList.remove("hero__content--show-text");
              event.currentTarget.removeEventListener(
                "transitionend",
                onShowTextEnd
              );
            }
          };

          const onGrowEnd = (event) => {
            event.currentTarget.classList.remove("hero__content--grow");
            event.currentTarget.classList.add("hero__content--show-text");
            event.currentTarget.addEventListener(
              "transitionend",
              onShowTextEnd,
              {
                once: true,
              }
            );
          };

          content.addEventListener("transitionend", onGrowEnd, { once: true });
        }, 0);
      };

      // const swiperInit = (swiper) => {
      //   const total = swiper.slides.length;
      //   let contentIndex = swiper.realIndex % total;
      //   // if (contentIndex < 0) {
      //   //   contentIndex = total + contentIndex;
      //   // }

      //   const content = contentFullsizeEls[contentIndex];
      //   if (!content) return;

      //   setTopContent(content);

      //   const slideRect =
      //     swiper.slides[swiper.activeIndex].getBoundingClientRect();
      //   const parentRect = heroEl.getBoundingClientRect();

      //   content.style.transition = "none";
      //   content.style.left = slideRect.left - parentRect.left + "px";
      //   content.style.top = slideRect.top - parentRect.top + "px";
      //   content.style.width = slideRect.width + "px";
      //   content.style.height = slideRect.height + "px";
      //   content.style.borderRadius = "var(--border-radius, 0)";

      //   content.getBoundingClientRect();

      //   content.classList.remove("hero__content--hidden");
      //   content.classList.add("hero__content--top");

      //   const onShowTextEnd = (event) => {
      //     if (event.target !== event.currentTarget) {
      //       event.currentTarget.removeEventListener(
      //         "transitionend",
      //         onShowTextEnd
      //       );
      //     }
      //   };

      //   content.addEventListener("transitionend", onShowTextEnd, {
      //     once: true,
      //   });
      // };

      const swiper = new Swiper(".swiper", {
        slidesPerView: 4.5,
        spaceBetween: 25,
        speed: 1000,
        simulateTouch: false,
        autoplay: {
          delay: 2000,
        },
        navigation: true,
        pagination: {
          clickable: true,
        },
        loop: true,
        // loopedSlides: 7,
        on: {
          // init: swiperInit,
          slideChange: slideChange,
        },
      });

      swiperRef.current = swiper;
      return () => {
        swiper.destroy();
      };
    }
  }, [isDataLoaded]);

  if (!isDataLoaded) {
    return <div className="text-black">Loading data...</div>;
  }

  return (
    <div className="swiper_main">
      <div className="hero" ref={heroElRef}>
        <div className="hero__fullsize" ref={fullSizeWrapElRef}></div>
        <div className="hero__swiper swiper">
          <div className="swiper-wrapper">
            {trending.map((t) => {
              return (
                <div className="swiper-slide" key={t.id}>
                  <div className="content content--slide">
                    <img
                      className="content__image"
                      src={API_IMG + t?.backdrop_path}
                    />

                    <div className="content__text">
                      <h2 className="content__title">
                        {t?.original_name || t?.original_title}
                      </h2>
                      <p className="content__desc">
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
