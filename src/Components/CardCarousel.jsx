import React, { useEffect, useRef, useState } from "react";
import "./CardCarousel.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import Splitting from "splitting";

const CardCarousel = () => {
  const [topContent, setTopContent] = useState(null);
  const [bottomContent, setBottomContent] = useState(null);
  const heroElRef = useRef(null);
  const fullSizeWrapElRef = useRef(null);
  const swiperRef = useRef(null);

  const initializeCarousel = () => {
    const heroEl = heroElRef.current;
    const fullSizeWrapEl = fullSizeWrapElRef.current;
    const contentFullsizeEls = [];

    const contentEls = heroEl.querySelectorAll(".swiper .content");
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
      const total = swiper.slides.length - swiper.loopedSlides * 2;
      const contentIndex = (swiper.activeIndex - swiper.loopedSlides) % total;

      const content = contentFullsizeEls[contentIndex];
      if (!content) return;

      if (bottomContent) {
        bottomContent.classList.remove("hero__content--bottom");
        bottomContent.classList.add("hero__content--hidden");
      }

      if (topContent) {
        topContent.classList.remove("hero__content--top");
        topContent.classList.add("hero__content--bottom");
      }

      setBottomContent(topContent);
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
    };

    const swiperInit = (swiper) => {
      swiperRef.current = swiper;
      const total = swiper.slides.length - swiper.loopedSlides * 2;
      const contentIndex = (swiper.activeIndex - swiper.loopedSlides) % total;

      const content = contentFullsizeEls[contentIndex];
      if (!content) return;

      content.classList.remove("hero__content--hidden");
      content.classList.add("hero__content--top");
      setTopContent(content);
    };

    return { swiperInit, slideChange };
  };

  useEffect(() => {
    const { swiperInit, slideChange } = initializeCarousel();

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once
  return (
    <div className="swiper_main">
      <div className="hero" ref={heroElRef}>
        <div className="hero__fullsize" ref={fullSizeWrapElRef}></div>
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
        >
          <SwiperSlide>
            <div class="swiper-slide">
              <div class="content content--slide">
                <img
                  class="content__image"
                  src="https://images.unsplash.com/photo-1598188306155-25e400eb5078?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGNhdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1200&q=80"
                  alt=""
                />

                <div class="content__text">
                  <h2 class="content__title">Lorem ipsum dolor</h2>
                  <p class="content__desc">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Earum, nobis tempora quam ducimus veritatis sint aut
                    adipisci quibusdam repudiandae autem at! At nihil
                    repudiandae dicta obcaecati
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="swiper-slide">
              <div class="content content--slide">
                <img
                  class="content__image"
                  src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
                  alt=""
                />

                <div class="content__text">
                  <h2 class="content__title">Dolore minus quibusdam</h2>
                  <p class="content__desc">
                    Enim facilis dolorem maiores quis exercitationem vitae
                    numquam fugiat ex cupiditate deserunt praesentium. Nesciunt
                    autem quasi assumenda exercitationem cupiditate.Earum, nobis
                    tempora quam ducimus veritatis sint aut adipisci quibusdam
                    repudiandae autem at!
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="swiper-slide">
              <div class="content content--slide">
                <img
                  class="content__image"
                  src="https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNhdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1200&q=80"
                  alt=""
                />

                <div class="content__text">
                  <h2 class="content__title">Sequi provident ratione</h2>
                  <p class="content__desc">
                    Ipsa quos earum nobis eius voluptates neque dolores mollitia
                    illum quae hic! Aspernatur delectus quas praesentium debitis
                    doloribus velit, fugiat error veritatis est dolorum! Enim,
                    ea optio. Corrupti ab, provident perferendis, doloremque in
                    enim reprehenderit dolorum ea eius ullam eos impedit
                    repellendus.
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="swiper-slide">
              <div class="content content--slide">
                <img
                  class="content__image"
                  src="https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fGNhdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1200&q=80"
                  alt=""
                />

                <div class="content__text">
                  <h2 class="content__title">Aspernatur fugiat qui dolorum</h2>
                  <p class="content__desc">
                    Cupiditate voluptas facere nostrum illum quo mollitia ut
                    natus, maiores ipsam veritatis deserunt dignissimos sed
                    harum perferendis dolores quisquam consequuntur tempore!
                    Quae quos neque ex fuga quis! Deleniti obcaecati quo
                    officiis perferendis repellat inventore! Voluptates, tenetur
                    neque perspiciatis nisi dolorem iure voluptas!
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div class="swiper-slide">
              <div class="content content--slide">
                <img
                  class="content__image"
                  src="https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDF8fGNhdHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1200&q=80"
                  alt=""
                />

                <div class="content__text">
                  <h2 class="content__title">Tempora repellat aliquam</h2>
                  <p class="content__desc">
                    Odio ullam iure quisquam tempora eaque, dolores officia
                    harum, perspiciatis nobis amet vitae optio, deserunt maxime
                    delectus atque laborum iusto voluptatem. Iure facere,
                    mollitia nobis adipisci sapiente et, ea maiores accusantium
                    quos fuga at quam magnam soluta eligendi beatae ipsa a!
                    Assumenda!
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default CardCarousel;
