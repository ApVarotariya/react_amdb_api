import React, { useEffect, useState, useRef } from "react";
import "./CardCarousel.css";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper";
// import Splitting from "https://cdn.skypack.dev/splitting@1.0.6";
import Splitting from "splitting";

const API_IMG = "https://image.tmdb.org/t/p/original";

const CardCarousel = () => {
  const [trending, setTrending] = useState([]);
  const fullSizeWrapEl = useRef(null);
  const heroEl = useRef(null);
  const contentFullsizeEls = useRef([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_ACCESS_KEY}&page}`
      );
      setTrending(response.data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    if (fullSizeWrapEl.current) {
      const contentEls =
        fullSizeWrapEl.current.querySelectorAll(".swiper .content");
      contentFullsizeEls.current = Array.from(contentEls, (el) => {
        const clone = el.cloneNode(true);
        clone.classList.add(
          "hero__content",
          "hero__content--hidden",
          "content--hero"
        );
        clone.classList.remove("content--slide");
        return clone;
      });
    }
    const state = {
      topContent: null,
      bottomContent: null,
    };
    function slideChange(swiper) {
      const total = swiper.slides.length - swiper.loopedSlides * 2;
      const contentIndex = (swiper.activeIndex - swiper.loopedSlides) % total;

      const content = contentFullsizeEls[contentIndex];
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

      const slidetRect =
        swiper.slides[swiper.activeIndex].getBoundingClientRect();
      const parentRect = heroEl.getBoundingClientRect();

      content.style.transition = "none";
      content.style.left = slidetRect.left - parentRect.left + "px";
      content.style.top = slidetRect.top - parentRect.top + "px";
      content.style.width = slidetRect.width + "px";
      content.style.height = slidetRect.height + "px";
      content.style.borderRadius = "var(--border-radius, 0)";

      content.getBoundingClientRect();

      content.classList.remove("hero__content--hidden");
      content.classList.add("hero__content--top", "hero__content--grow");

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
        event.currentTarget.addEventListener("transitionend", onShowTextEnd);
      };

      content.addEventListener("transitionend", onGrowEnd, { once: true });
    }

    function swiperInit(swiper) {
      const total = swiper.slides.length - swiper.loopedSlides * 2;
      const contentIndex = (swiper.activeIndex - swiper.loopedSlides) % total;

      const content = contentFullsizeEls[contentIndex];
      if (!content) return;

      content.classList.remove("hero__content--hidden");
      content.classList.add("hero__content--top");
      state.topContent = content;
    }
  }, [trending]);

  const destroySwiper = (swiper) => {
    swiper.destroy();
  };
  return (
    <div className="swiper_main">
      <div className="hero" ref={heroEl}>
        <div className="hero__fullsize" ref={fullSizeWrapEl}></div>
        <Swiper
          className="hero__swiper"
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={25}
          slidesPerView={3.5}
          navigation
          autoplay={{ delay: 2000 }}
          pagination={{ clickable: true }}
          onSwiper={swiperInit}
          onSlideChange={slideChange}
          onDestroy={destroySwiper}
        >
          {trending.map((s) => {
            return (
              <SwiperSlide key={s.id}>
                <div className="swiper-slide">
                  <div className="content content--slide">
                    <img
                      className="content__image"
                      src={API_IMG + s.backdrop_path}
                      alt={s.original_title || s.original_name}
                    />
                    <div className="content__text">
                      <h2 className="content__title">
                        {s.original_title || s.original_name}
                      </h2>
                      <p className="content__desc">Lorem ipsum dolor</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default CardCarousel;
