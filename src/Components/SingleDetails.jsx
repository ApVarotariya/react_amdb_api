import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import dateFormat from "dateformat";
import { BASE_API_PROXY_URL, unavailable, unavailableLandscape } from "./README";
import TrailerVideo from "./TrailerVideo";
import Credits from "./Credits";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Accordion, Button, Card } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import GetGradientData from "./GetGradientData";
import MovieStreamPlayer from "./MovieStreamPlayer";
import SeriesStreamPlayer from "./SeriesStreamPlayer";

const API_IMG = "https://image.tmdb.org/t/p/w300";
const API_IMG200 = "https://image.tmdb.org/t/p/w200";

const SingleDetails = () => {
  const { state } = useParams();
  const { id } = useParams();
  const [movies, setMovies] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [season, setSeason] = useState([]);
  const [watchProvider, setWatchProvider] = useState([]);
  const [review, setReview] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [stream, setStream] = useState(null);
  const perPage = 8;
  const [next, setNext] = useState(perPage);
  const [gradient, setGradient] = useState("");
  const [gradientPoster, setGradientPoster] = useState("");

  // 
  const [imdbId, setImdbId] = useState("");
  const [title, setTitle] = useState("");

  const canvasRef = useRef(null);
  const isMobile = window.innerWidth > 767;

const fetchData = async () => {
  try {
    const res = await axios.get(
      `${BASE_API_PROXY_URL}${state}/${id}?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setMovies(res.data);
    setTitle(res.data.title || res.data.name);
  } catch (err) {
    console.error(err);
  }
};

  // const fetchDownloadLink = async () => {
  //   const data = await axios.get(`https://player4u.xyz/embed?key=${title}`);
  //   setStream(data.data);
  //   console.log("Download Link Fetched:", data.data);
  // };

const fetchExternalIds = async () => {
  try {
    const res = await axios.get(
      `${BASE_API_PROXY_URL}${state}/${id}/external_ids?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setImdbId(res.data.imdb_id); 
    console.log(res.data.imdb_id);
  } catch (err) {
    console.error(err);
  }
};


  const fetchSimilar = async () => {
    const res = await axios.get(
      `${BASE_API_PROXY_URL}${state}/${id}/similar?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setSimilar(res.data.results);
  };

  const fetchSeason = async (seasonNumber) => {
    const res = await axios.get(
      `${BASE_API_PROXY_URL}tv/${id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setSeason(res.data.episodes);
  };

  const fetchReview = async () => {
    const res = await axios.get(
      `${BASE_API_PROXY_URL}${state}/${id}/reviews?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setReview(res.data.results);
  };

  const fetchWatchProvider = async () => {
    const res = await axios.get(
      `${BASE_API_PROXY_URL}${state}/${id}/watch/providers?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setWatchProvider(res.data.results.IN);
    // console.log(res.data.results);
  };

  const handleToggleClick = async (seasonNumber) => {
    await fetchSeason(seasonNumber);
    setSelectedSeason(seasonNumber);
  };

  useEffect(() => {
    fetchData();
    fetchSimilar();
    fetchReview();
    fetchWatchProvider();
    fetchExternalIds();
    // fetchDownloadLink();
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
          <div style={{padding:"15px"}}>
            <iframe src={`https://player4u.xyz/embed?key=${title}`}
                width="100%"
                height="300px"
                frameborder="1"
                scrolling="no"
                allowFullScreen>
            </iframe>
          </div>
          )}
          
          {state === "movie" && (
            <MovieStreamPlayer imdbId={imdbId} />
          )}
          {state === "tv" && (
            <SeriesStreamPlayer imdbId={imdbId} />
          )}

          {state === "tv" && (
            <div className="seasonal_data overflow-auto w-100 p-3">
              <Accordion>
                {movies?.seasons
                  ?.slice()
                  .reverse()
                  .map((c) => (
                    <Accordion.Item
                      key={c.season_number}
                      eventKey={c.season_number.toString()}
                    >
                      <Accordion.Header
                        onClick={() => handleToggleClick(c.season_number)}
                      >
                        <LazyLoadImage
                          src={
                            c?.poster_path
                              ? API_IMG + c?.poster_path
                              : unavailable
                          }
                          alt={c?.name}
                          width={50}
                        />
                        <div>
                          <h3>
                            {movies.name || movies.title}&nbsp;({c.name})&nbsp;
                            {c.air_date && (
                              <i>({c.air_date.substring(0, 4)})</i>
                            )}
                            &nbsp;&nbsp;&nbsp;
                            {c.episode_count && (
                              <i>Total Episodes : {c.episode_count}</i>
                            )}
                          </h3>
                          {c.overview !== "" ? (
                            <p>{c.overview}</p>
                          ) : (
                            <p>Data not Available</p>
                          )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="single_season_episode_data">
                          {selectedSeason === c.season_number &&
                            season?.map((s) => (
                              <div
                                key={s.id}
                                className="d-flex align-items-start pb-1 border-bottom mb-3"
                              >
                                <LazyLoadImage
                                  src={
                                    s?.still_path
                                      ? API_IMG + s?.still_path
                                      : unavailableLandscape
                                  }
                                  alt={s?.name}
                                  width={80}
                                />
                                <div>
                                  <h3>
                                    {s.name} &nbsp;
                                    {console.log(s)}
                                    {s.runtime && (
                                      <i>
                                        Runtime :&nbsp;(&nbsp;{s.runtime}
                                        min&nbsp;)
                                      </i>
                                    )}
                                  </h3>
                                  {s.overview !== "" ? (
                                    <p>{s.overview}</p>
                                  ) : (
                                    <p>Data not Available</p>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
              </Accordion>
            </div>
          )}

          {(state === "movie" || state === "tv") && review.length > 0 && (
            <div className="review_sec overflow-auto w-100 p-3">
              <h2 className="similar_title my-4 text-black">
                {state === "movie" ? "Movie" : "TV Series"}&nbsp;Reviews&nbsp;:
              </h2>
              <div className="review_items">
                {review.slice(0, 3).map((r, index) => {
                  return (
                    <div className="review_single_item mb-3" key={index}>
                      <div className="d-flex gap-3 mb-2">
                        <LazyLoadImage
                          variant="top"
                          src={
                            r.author_details.avatar_path
                              ? API_IMG + r.author_details.avatar_path
                              : unavailable
                          }
                          alt={r.author}
                          className="review_auther_poster"
                        />
                        <div>
                          <h5 className="mb-0">
                            <b>{r.author}</b>
                          </h5>
                          <p className="mb-0">@{r.author_details.username}</p>
                        </div>
                      </div>
                      <p className="mb-0">{r.content}</p>
                      <hr />
                      <p className="mb-0">
                        Posted on&nbsp;:&nbsp;
                        <b>
                          {dateFormat(
                            r.updated_at ? r.updated_at : r.created_at,
                            "mmmm dS, yyyy"
                          )}
                        </b>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {TrailerVideo(state, id) && (
            <div className="yt_trailer_videos">
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
