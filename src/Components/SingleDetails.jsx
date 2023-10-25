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
import GetGradientData from "./GetGradientData";

const API_IMG = "https://image.tmdb.org/t/p/original";
const API_IMG200 = "https://image.tmdb.org/t/p/w200";

const SingleDetails = () => {
  const { state } = useParams();
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [season, setSeason] = useState([]);
  const perPage = 8;
  const [next, setNext] = useState(perPage);
  const [gradient, setGradient] = useState("");
  const [gradientPoster, setGradientPoster] = useState("");

  const canvasRef = useRef(null);
  const isMobile = window.innerWidth > 767;

  const fetchData = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${state}/${id}?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setMovies(res.data);
  };

  const fetchSimilar = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${state}/${id}/similar?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setSimilar(res.data.results);
  };

  const fetchSeason = async (seasonNumber) => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setSeason(res.data.episodes);
    console.log(res.data.episodes);
  };

  useEffect(() => {
    fetchData();
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
    let imagePath;
    if (state === "movie" || state === "tv") {
      imagePath = API_IMG200 + movies?.poster_path;
    } else if (state === "person") {
      imagePath = API_IMG200 + movies?.profile_path;
    }
    const getGradient = async () => {
      const colors = await GetGradientData(imagePath);
      if (colors) {
        if (window.innerWidth > 767) {
          const bggradient = `linear-gradient(to right, rgba(${colors.r},${colors.g},${colors.b},1) calc((50vw - 170px) - 340px), rgba(${colors.r},${colors.g},${colors.b},0.84) 50%,rgba(${colors.r},${colors.g},${colors.b},0.84) 100%)`;
          setGradient(bggradient);
        } else {
          const bggradient = `linear-gradient(to right, rgba(${colors.r},${colors.g},${colors.b},1) 20%, rgba(${colors.r},${colors.g},${colors.b},0.84) 50%,rgba(${colors.r},${colors.g},${colors.b},0.84) 50%)`;
          setGradient(bggradient);
          const postergradient = `linear-gradient(to right, rgba(${colors.r},${colors.g},${colors.b},1) 20%, rgba(${colors.r},${colors.g},${colors.b},0) 50%)`;
          setGradientPoster(postergradient);
        }
      }
      return null;
    };

    getGradient();
  }, [movies]);

  return (
    <>
      {movies && (
        <div
          className={`single_content_details_main ${
            state === "movie" || state === "tv"
              ? "single_main_movie"
              : "single_main_person"
          }`}
          style={{ overflowX: "hidden" }}
        >
          <div className="banner_bg_main">
            <div
              className="either_dark_bg"
              id="either_dark_bg"
              style={{
                ...(isMobile
                  ? {
                      width: "100%",
                      minHeight: "100vh",
                      backgroundImage: `url(${
                        API_IMG + movies?.backdrop_path ?? unavailableLandscape
                      })`,
                      backgroundSize: "cover",
                      position: "relative",
                    }
                  : {}),
              }}
            >
              <div
                className="single_content_details"
                id="single_content_details "
                style={{
                  backgroundImage: gradient,
                  backgroundSize: "cover",
                  position: "relative",
                  width: "100%",
                  minHeight: "100vh",
                }}
              >
                <canvas ref={canvasRef} style={{ display: "none" }} />
                {(state === "movie" || state === "tv") && (
                  <div
                    className="details_hero_left details_hero_left_movie_tv"
                    style={{
                      ...(isMobile
                        ? {}
                        : {
                            width: "100%",
                            minHeight: "100vh",
                            backgroundImage: `url(${
                              API_IMG + movies?.backdrop_path ??
                              unavailableLandscape
                            })`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            position: "relative",
                          }),
                    }}
                  >
                    <div
                      id="details_postar_overlay"
                      style={{
                        backgroundImage: gradientPoster,
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                      }}
                    ></div>
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
                  </div>
                )}
                {state === "person" && (
                  <div className="details_hero_left details_hero_left_person">
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
                    <p className="text-center mt-2">{movies.place_of_birth}</p>
                    <span className="person_details_birth text-center d-block">
                      {dateFormat(movies.birthday, "mmmm dS, yyyy")}
                    </span>
                  </div>
                )}
                {(state === "movie" || state === "tv") && (
                  <div className="details_hero_right position-relative details_hero_right_movie_tv">
                    <h1 className="d-inline-block details_title">
                      {movies.name || movies.title}
                    </h1>
                    <span className="details_air_date">
                      (
                      {dateFormat(
                        movies.release_date || movies.first_air_date,
                        "yyyy"
                      )}
                      )
                    </span>
                    <div>
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
                      {state === "movie" && (
                        <span className="details_runtime">
                          {timeConvert(movies.runtime)}
                        </span>
                      )}
                    </div>
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

                    {state === "movie" && movies.revenue !== 0 && (
                      <p className="details_revenue">
                        Total Revenue: ${(movies.revenue / 1000000).toFixed(0)}
                        Millions
                      </p>
                    )}
                  </div>
                )}
                {state === "person" && (
                  <div className="details_hero_right position-relative details_hero_right_person">
                    <h1 className="d-inline-block details_title">
                      {movies.name || movies.title}
                    </h1>
                    <div className="position-relative w-100 px-0">
                      <p className="details_overview pe-2">
                        Overview : <br />
                        {movies.biography || "Sorry Details not available!"}
                      </p>
                    </div>
                  </div>
                )}
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
          <div className="seasonal_data overflow-auto w-100 p-3 d-flex flex-column">
            {movies?.seasons?.map((c) => {
              const handleToggleClick = async () => {
                await fetchSeason(c.season_number);
              };
              return (
                <>
                  <div
                    className="single_season d-inline-flex align-items-start mb-4 p-3"
                    style={{ border: "1px solid #fff", maxWidth: "50%" }}
                    key={c.season_number}
                  >
                    <LazyLoadImage
                      src={API_IMG + `${c?.poster_path}`}
                      alt={c?.name}
                      width={50}
                      className="me-4"
                    />
                    <div>
                      <h3>
                        {movies.name || movies.title}&nbsp;({c.name})&nbsp;
                        <span>Total Episodes : {c.episode_count}</span>
                        <span>Total Episodes : {c.season_number}</span>
                      </h3>
                      <p>{c.overview}</p>
                    </div>
                    <p
                      className="toggleclick"
                      onClick={() => handleToggleClick(c.season_number)}
                    >
                      &gt;
                    </p>
                  </div>
                  <div className="single_season_episode_data">
                    {season?.map((s) => {
                      return (
                        <>
                          <LazyLoadImage
                            src={API_IMG + `${s?.still_path}`}
                            alt={s?.name}
                            width={50}
                            className="me-4"
                          />
                          <div>
                            <h3>{s.name}</h3>
                            <p>{s.overview}</p>
                            <p>{s.runtime}min</p>
                            <p>Season Number : {s.season_number}</p>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              );
            })}
          </div>
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
                              style={{ zIndex: "9" }}
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
                            <Link
                              style={{
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                left: "0",
                                top: "0",
                                opacity: "0",
                              }}
                              to={`/${state}/${s.id}`}
                              onClick={() => {
                                window.scrollTo({
                                  top: 0,
                                  left: 0,
                                  behavior: "smooth",
                                });
                              }}
                            ></Link>
                          </Card.Body>
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
