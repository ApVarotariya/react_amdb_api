import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import dateFormat from "dateformat";
import { unavailable, unavailableLandscape } from "./README";
import TrailerVideo from "./TrailerVideo";
import Credits from "./Credits";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button, Card } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";

const API_IMG = "https://image.tmdb.org/t/p/original";
const API_IMG300 = "https://image.tmdb.org/t/p/w300";

const SingleDetails = () => {
  const { state } = useParams();
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [similar, setSimilar] = useState([]);
  const perPage = 8;
  const [next, setNext] = useState(perPage);
  const [isDarkBg, setIsDarkBg] = useState(false);

  const canvasRef = useRef(null);

  const fetchData = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${state}/${id}?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setMovies(res.data);
  };
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchSimilar = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${state}/${id}/similar?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setSimilar(res.data.results);
  };
  useEffect(() => {
    fetchSimilar();
  }, [id]);

  const handleClick = () => {
    setNext(next + perPage);
  };

  function timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "m";
  }

  useEffect(() => {
    const dynamicImage = API_IMG300 + movies?.poster_path;

    const getImageData = async () => {
      try {
        const response = await fetch(`${dynamicImage}`);
        const blob = await response.blob();
        const img = await createImageBitmap(blob);

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = { r: 0, g: 0, b: 0 };
        const pixelCount = imageData.data.length / 4;

        for (let i = 0; i < imageData.data.length; i += 4) {
          colors.r += imageData.data[i];
          colors.g += imageData.data[i + 1];
          colors.b += imageData.data[i + 2];
        }

        colors.r = Math.round(colors.r / pixelCount);
        colors.g = Math.round(colors.g / pixelCount);
        colors.b = Math.round(colors.b / pixelCount);

        const gradient = `linear-gradient(to right, rgba(${colors.r},${colors.g},${colors.b},1) calc((50vw - 170px) - 340px), rgba(${colors.r},${colors.g},${colors.b},0.84) 50%,rgba(${colors.r},${colors.g},${colors.b},0.84) 100%)`;
        const element = document.getElementById("single_content_details");
        element.style.background = gradient;
      } catch (error) {
        console.error("eror", error);
      }
    };
    getImageData();
  }, [movies]);

  return (
    <>
      {movies && (
        <div
          className="single_content_details_main"
          style={{ overflowX: "hidden" }}
        >
          <div className="banner_bg_main">
            <div
              className={`either_dark_bg ${isDarkBg ? "dark-bg" : ""}`}
              id="either_dark_bg"
              style={{
                backgroundImage: `url(${
                  API_IMG + movies?.backdrop_path
                    ? API_IMG + movies?.backdrop_path
                    : unavailableLandscape
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                position: "relative",
                width: "100%",
                minHeight: "100vh",
              }}
            >
              <div
                className="single_content_details"
                id="single_content_details"
                style={{
                  backgroundSize: "cover",
                  position: "relative",
                  width: "100%",
                  minHeight: "100vh",
                }}
              >
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <div className="details_hero_left">
                  <LazyLoadImage
                    className="details_postar"
                    id="details_postar"
                    src={
                      API_IMG +
                      `${
                        movies?.poster_path
                          ? movies?.poster_path
                          : movies?.profile_path
                      }`
                    }
                    alt={movies?.title || movies?.name}
                  />
                  {state === "person" && (
                    <>
                      <p className="text-center mt-2 text-black">
                        {movies.place_of_birth}
                      </p>
                      <span className="person_details_birth text-center text-black">
                        <p>{dateFormat(movies.birthday, "mmmm dS, yyyy")}</p>
                      </span>
                    </>
                  )}
                </div>
                <div className="details_hero_right position-relative">
                  {(state === "movie" || state === "tv") && (
                    <h1 className="d-inline-block details_title">
                      {movies.name || movies.title}
                    </h1>
                  )}
                  {state === "person" && (
                    <>
                      <h1 className="d-inline-block details_title text-black">
                        {movies.name || movies.title}
                      </h1>
                      <div className="details_hero_right position-relative w-100 px-0 text-black">
                        <p className="details_overview pe-2">
                          Overview : <br />
                          {movies.biography || "Sorry Details not available!"}
                        </p>
                      </div>
                    </>
                  )}
                  {(state === "movie" || state === "tv") && (
                    <span className="details_air_date">
                      (
                      {dateFormat(
                        movies.release_date || movies.first_air_date,
                        "yyyy"
                      )}
                      )
                    </span>
                  )}
                  <div>
                    {(state === "movie" || state === "tv") && (
                      <span className="details_genre">
                        ~&nbsp;
                        {movies.genres?.map((c, index) => {
                          return (
                            <span key={index}>
                              {(index ? ", " : "") + c.name}
                            </span>
                          );
                        })}
                      </span>
                    )}
                    {state === "movie" && (
                      <span className="details_runtime">
                        {timeConvert(movies.runtime)}
                      </span>
                    )}
                  </div>
                  {(state === "movie" || state === "tv") && (
                    <>
                      <div
                        className="details_userscore"
                        style={{
                          width: 50,
                          height: 50,
                          background: "#000",
                          borderRadius: "50%",
                          padding: "4px",
                          margin: "20px 0",
                        }}
                      >
                        <CircularProgressbar
                          value={movies.vote_average * 10}
                          text={movies?.vote_average?.toFixed(1) * 10 + "%"}
                        />
                      </div>
                      <p className="details_tagline">{movies?.tagline}</p>
                      <p className="details_overview">{movies?.overview}</p>
                    </>
                  )}
                  {state === "movie" && (
                    <p className="details_revenue">
                      Total Revenue : $
                      {(movies.revenue / 1000000).toFixed(0) + " Millions"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {(state === "movie" || state === "tv") && (
            <>
              <div className="single_content_slider">
                <h2 className="my-4 text-black">Cast : </h2>
                <Credits media_type={state} id={id} />
              </div>
              <div style={{ color: "#000" }} className="details_page_sidebar">
                <h2 className="my-4 text-center text-black">Fact </h2>
                <div className="d-flex justify-content-between details_page_fact_main">
                  <p className="details_website">
                    <strong>Official Website :</strong> <br />
                    <a href={movies.homepage}>Click here</a>
                  </p>
                  <p className="details_pdocuction_com">
                    <strong>Production Companies:</strong>
                    <br />
                    {movies.production_companies?.map((c, index) => {
                      return (
                        <span key={index}>{(index ? " , " : "") + c.name}</span>
                      );
                    })}
                  </p>
                  <p className="details_production_country">
                    <strong>Production in Countries:</strong>
                    <br />
                    {movies.production_countries?.map((c, index) => {
                      return (
                        <span key={index}>{(index ? " , " : "") + c.name}</span>
                      );
                    })}
                  </p>
                </div>
              </div>
            </>
          )}
          {(state === "movie" || state === "tv") && (
            <div className="yt_trailer_videos">
              <h2
                className="similar_title my-4 text-black w-100"
                style={{ padding: "0 15px" }}
              >
                Trailer Videos :
              </h2>
              <TrailerVideo media_type={state} id={id} />
            </div>
          )}
          <div className="row" style={{ margin: "0", justifyContent: "start" }}>
            <h2 className="similar_title my-4 text-black">
              Similar&nbsp;
              {state === "movie"
                ? "Movie"
                : state === "tv"
                ? "TV Series"
                : "Movies of Actor"}
              &nbsp;:
            </h2>
            {(state === "movie" || state === "tv") && (
              <>
                {similar && similar.length > 0 ? (
                  similar.slice(0, next).map((s) => {
                    return (
                      <div
                        className="col-lg-2 col-md-3 col-sm-4 col-xs-6 moviecard"
                        key={s.id}
                      >
                        <Card>
                          <Link
                            to={`/${state}/${s.id}`}
                            onClick={() => {
                              window.scrollTo({
                                top: 0,
                                left: 0,
                                behavior: "smooth",
                              });
                            }}
                          >
                            <LazyLoadImage
                              variant="top"
                              src={
                                s.poster_path
                                  ? API_IMG + s.poster_path
                                  : unavailable
                              }
                              alt={s.title}
                              className="movie-backdrop-poster"
                            />
                            <Card.Body>
                              <Card.Title>
                                <h3>
                                  <strong>
                                    <span>{s.title || s.name}</span>
                                  </strong>
                                  <span>{s.vote_average.toFixed(1)}</span>
                                </h3>
                                <div className="d-flex justify-content-between align-items-start">
                                  <p style={{ fontSize: "12px" }}>
                                    <span>
                                      {dateFormat(
                                        s.release_date,
                                        "mmmm dS, yyyy"
                                      )}
                                    </span>
                                  </p>
                                  <p style={{ fontSize: "12px" }}>
                                    {state === "tv" ? "TV Series" : "Movie"}
                                  </p>
                                </div>
                              </Card.Title>
                              <Link
                                as="button"
                                to={`/${state}/${s.id}`}
                                onClick={() => {
                                  window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: "smooth",
                                  });
                                }}
                              >
                                <Button variant="success">More Details</Button>
                              </Link>
                            </Card.Body>
                          </Link>
                        </Card>
                      </div>
                    );
                  })
                ) : (
                  <h2 className="text-center text-black">
                    Sorry! Nothing to Show.
                  </h2>
                )}
                <div className="text-center">
                  {next < similar.length && (
                    <Button
                      className="btn btn-lg mb-4 load_more_btn"
                      onClick={handleClick}
                    >
                      Load more
                    </Button>
                  )}
                </div>
              </>
            )}

            {state === "person" && <Credits media_type={state} id={id} />}
          </div>
        </div>
      )}
    </>
  );
};

export default SingleDetails;
