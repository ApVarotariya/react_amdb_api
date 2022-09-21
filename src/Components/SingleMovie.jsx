import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { unavailable } from "./README";
import TrailerVideo from "./TrailerVideo";
import Credits from "./Credits";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const API_IMG = "https://image.tmdb.org/t/p/original";

const SingleMovie = () => {
  const { id } = useParams();
  const media_type = "movie";
  const [movies, setMovies] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setMovies(res);
    // console.log(res);
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  function timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "m";
  }
  const value = 0.66;
  return (
    <>
      <div className="single_content_details_main">
        <div
          className="single_content_details"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.9)),url(${
              API_IMG + movies?.data?.backdrop_path
            })`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            padding: "0 20px 50px 20px",
            width: "100%",
            height: "100vh",
          }}
        >
          <div className="details_hero_left">
            <img
              className="details_postar"
              src={
                movies?.data?.poster_path
                  ? API_IMG + movies?.data?.poster_path
                  : unavailable
              }
              alt={movies?.data?.title || movies?.data?.name}
            />
          </div>
          <div className="details_hero_right position-relative">
            <h1 className="d-inline-block details_title">
              {movies?.data?.name || movies?.data?.title}
            </h1>
            <span className="details_air_date">
              ({movies?.data?.release_date.substring(0, 4)})
            </span>
            <div>
              <span className="details_genre">
                ~&nbsp;
                {movies?.data?.genres.map((c, index) => {
                  return <span key={c.id}>{(index ? ", " : "") + c.name}</span>;
                })}
              </span>
              <span className="details_runtime">
                {timeConvert(movies?.data?.runtime)}
              </span>
            </div>
            <div
              className="details_userscore"
              style={{
                width: 70,
                height: 70,
                background: "#000",
                borderRadius: "50%",
                padding: "5px",
                margin: "20px 0",
              }}
            >
              <CircularProgressbar
                value={movies?.data?.vote_average * 10}
                text={movies?.data?.vote_average.toFixed(1) * 10 + "%"}
              />
            </div>
            <p className="details_tagline">{movies?.data?.tagline}</p>
            <p className="details_overview">{movies?.data?.overview}</p>
            <p className="details_revenue">
              Total Revenue : ${movies?.data?.revenue}
            </p>
            <TrailerVideo media_type={"movie"} id={id} />
          </div>
        </div>
        <div className="single_content_slider">
          <h2 className="my-4 text-black">Characters(Actors) : </h2>
          <Credits media_type={"movie"} id={id} />
        </div>
        <div style={{ color: "#000" }} className="details_page_sidebar">
          <h2 className="my-4 text-center text-black">Fact </h2>
          <div className="d-flex justify-content-between">
            <p className="details_website">
              <strong>Official Website :</strong> <br />{" "}
              {movies?.data?.homepage}
            </p>
            <p className="details_pdocuction_com">
              <strong>Production Companies:</strong>
              <br />
              {movies?.data?.production_companies.map((c, index) => {
                return <span>{(index ? " , " : "") + c.name}</span>;
              })}
            </p>
            <p className="details_production_country">
              <strong>Production in Countries:</strong>
              <br />
              {movies?.data?.production_countries.map((c, index) => {
                return <span>{(index ? " , " : "") + c.name}</span>;
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleMovie;
