import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import dateFormat from "dateformat";
import { unavailable } from "./README";
import TrailerVideo from "./TrailerVideo";
import Credits from "./Credits";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button, Card } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";

const API_IMG = "https://image.tmdb.org/t/p/original";

const SingleMovie = () => {
  const { id } = useParams();
  const media_type = "movie";
  const [movies, setMovies] = useState([]);
  const [similar, setSimilar] = useState([]);

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

  const fetchSimilar = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/similar?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setSimilar(res.data.results);
  };
  console.log(similar.title);
  useEffect(() => {
    fetchData();
    fetchSimilar();
  }, [id]);

  function timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "m";
  }
  return (
    <>
      <div className="single_content_details_main">
        <div
          className="single_content_details"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.9)),url(${
              API_IMG + movies?.data?.backdrop_path
            })`,
            backgroundSize: "cover",
            position: "relative",
            padding: "0 20px 50px 20px",
            width: "100%",
            height: "100vh",
          }}
        >
          <div className="details_hero_left">
            <LazyLoadImage
              className="details_postar"
              src={
                movies?.data?.poster_path
                  ? API_IMG + movies?.data?.poster_path
                  : unavailable
              }
              cross-origin="anonymous"
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
          </div>
        </div>
        <div className="single_content_slider">
          <h2 className="my-4 text-black">Characters(Actors) : </h2>
          <Credits media_type={"movie"} id={id} />
        </div>
        <div style={{ color: "#000" }} className="details_page_sidebar">
          <h2 className="my-4 text-center text-black">Fact </h2>
          <div className="d-flex justify-content-between details_page_fact_main">
            <p className="details_website">
              <strong>Official Website :</strong> <br />
              <a href={movies?.data?.homepage}>Click here</a>
            </p>
            <p className="details_pdocuction_com">
              <strong>Production Companies:</strong>
              <br />
              {movies?.data?.production_companies.map((c, index) => {
                return <span key={c.id}>{(index ? " , " : "") + c.name}</span>;
              })}
            </p>
            <p className="details_production_country">
              <strong>Production in Countries:</strong>
              <br />
              {movies?.data?.production_countries.map((c, index) => {
                return <span key={c.id}>{(index ? " , " : "") + c.name}</span>;
              })}
            </p>
          </div>
        </div>
        <TrailerVideo media_type={"movie"} id={id} />
        <div className="row">
          <h2 className="my-4 text-black">
            Similar {media_type ? "Movies" : "Tv Series"}
          </h2>
          {similar &&
            similar.map((s) => {
              return (
                <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 moviecard">
                  <Card>
                    <LazyLoadImage
                      variant="top"
                      src={
                        s.poster_path ? API_IMG + s.poster_path : unavailable
                      }
                      alt={s.title}
                      className="movie-backdrop-poster"
                    />
                    <Card.Body>
                      <Card.Title>
                        <h3>
                          <strong>
                            <span>{s.title}</span>
                          </strong>
                          <span>{s.vote_average}</span>
                        </h3>
                        <div className="d-flex justify-content-between align-items-start">
                          <p style={{ fontSize: "12px" }}>
                            <span>
                              {dateFormat(s.release_date, "mmmm dS, yyyy")}
                            </span>
                          </p>
                          <p style={{ fontSize: "12px" }}>
                            {media_type === "tv" ? "TV Series" : "Movie"}
                          </p>
                        </div>
                      </Card.Title>
                      <Link to={`/${media_type}/${id}`}>
                        <Button variant="success">More Details</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default SingleMovie;
