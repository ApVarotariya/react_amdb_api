import React, { useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "../Components/Home.css";
import Main from "./Main";
import TvSeries from "./TvSeries";
import Movies from "./Movies";
import PopularPeople from "./PopularPeople";
// import UpComing from "./Upcoming";
import NowPlaying from "./NowPlaying";
import CardCarousel from "./CardCarousel";

const Home = () => {
  useEffect(() => {
    document.body.classList.add("home");
    return () => {
      document.body.classList.remove("home");
    };
  }, []);

  return (
    <>
      <CardCarousel />
      <Main cardLimit={8} showPagination={false} showButton={true} showSlider={false} homePage={true} />
      <TvSeries cardLimit={8} showPagination={false} showHindi={false} showButton={true} />
      <Movies cardLimit={8} showPagination={false} showGenre={false} showButton={true} />
      <PopularPeople cardLimit={8} showPagination={false} showButton={false} />
      {/* <UpComing cardLimit={8} showPagination={false} showButton={true} /> */}
      <NowPlaying cardLimit={8} showPagination={false} showButton={true} />
    </>
  );
};

export default Home;
