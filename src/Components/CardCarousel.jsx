import React, { useEffect, useRef, useState } from "react";
import "./CardCarousel.css";
import { Swiper } from "swiper";
import axios from "axios";
import SwiperCore, { Autoplay, Navigation } from "swiper";
SwiperCore.use([Autoplay, Navigation]);

const API_IMG = "https://image.tmdb.org/t/p/original";

const CardCarousel = () => {
  const [trending, setTrending] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const heroElRef = useRef(null);
  const fullSizeWrapElRef = useRef(null);
  const swiperRef = useRef(null);
  const progressBar = useRef(null);
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
      contentEls.forEach((el) => {
        const clone = el.cloneNode(true);
        clone.classList.add(
          "hero__content",
          "hero__content--hidden",
          "content--hero"
        );
        clone.classList.remove("content--slide");
        contentFullsizeEls.push(clone);

        fullSizeWrapEl.appendChild(clone);
      });

      const state = {
        bottomContent: null,
        topContent: null,
      };

      const slideChange = (swiper) => {
        const activeIndex = swiper.realIndex;
        const content = contentFullsizeEls[activeIndex];

        if (!content) return;

        if (state.bottomContent) {
          state.bottomContent.classList.remove("hero__content--bottom");
          state.bottomContent.classList.add("hero__content--hidden");
        }

        if (state.topContent) {
          state.topContent.classList.remove("hero__content--top");
          state.topContent.classList.add("hero__content--bottom");
        }

        state.bottomContent = state.topContent;
        state.topContent = content;

        const slideRect =
          swiper.slides[swiper.activeIndex].getBoundingClientRect();
        const parentRect = heroEl.getBoundingClientRect();

        content.style.transition = "none";
        content.style.left = slideRect.left - parentRect.left + "px";
        content.style.top = slideRect.top - parentRect.top + "px";
        content.style.width = slideRect.width + "px";
        content.style.height = slideRect.height + "px";
        content.style.borderRadius = "12px";

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
      const swiperInit = (swiper) => {
        const activeIndex = swiper.realIndex;

        const content = contentFullsizeEls[activeIndex];
        if (!content) return;

        content.style.transition = "none";

        content.getBoundingClientRect();

        content.classList.remove("hero__content--hidden");
        content.classList.add("hero__content--top");
        state.topContent = content;

        const onShowTextEnd = (event) => {
          if (event.target !== event.currentTarget) {
            event.currentTarget.removeEventListener(
              "transitionend",
              onShowTextEnd
            );
          }
        };

        content.addEventListener("transitionend", onShowTextEnd, {
          once: true,
        });
      };
      const onAutoplayTime = (s, time, progress) => {
        var reversedProgress = 1 - progress;
        progressBar.current.style.width = `${reversedProgress * 100}%`;
      };

      if (!swiperRef.current) {
        const swiper = new Swiper(".swiper-container", {
          slidesPerView: 4.5,
          spaceBetween: 20,
          speed: 2000,
          simulateTouch: false,
          autoplay: {
            delay: 2000,
          },
          loop: true,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          on: {
            autoplayTimeLeft: onAutoplayTime,
            init: swiperInit,
            realIndexChange: slideChange,
          },
          breakpoints: {
            480: {
              slidesPerView: 2.5,
            },
            320: {
              slidesPerView: 2.5,
              spaceBetween: 10,
            },
          },
        });
        swiperRef.current = swiper;
      }
    }
    // eslint-disable-next-line
  }, [isDataLoaded]);

  if (!isDataLoaded) {
    return <div class="loading"></div>;
  }

  return (
    <div className="swiper_main">
      <div className="hero" ref={heroElRef}>
        <div className="hero__fullsize" ref={fullSizeWrapElRef}></div>
        <div className="hero__swiper swiper swiper-container">
          <div className="swiper-wrapper">
            {trending.map((t) => {
              return (
                <div className="swiper-slide" key={t.id}>
                  <div className="content content--slide">
                    <img
                      className="content__image"
                      src={API_IMG + t?.backdrop_path}
                      alt={t?.original_name || t?.original_title}
                    />

                    <div className="content__text">
                      <h2 className="content__title">
                        {t?.original_name || t?.original_title}
                      </h2>
                      <p className="content__desc">{t?.overview}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
        <div className="autoplay-progress" slot="container-end">
          <div className="progress-bar" ref={progressBar}></div>
        </div>
      </div>
    </div>
  );
};
export default CardCarousel;
