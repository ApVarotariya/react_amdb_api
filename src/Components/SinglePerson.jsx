import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { unavailable } from "./README";
import dateFormat from "dateformat";
import { Button, Card } from "react-bootstrap";

const API_IMG = "https://image.tmdb.org/t/p/w500";

const SinglePerson = () => {
  const { id } = useParams();
  const media_type = "person";
  const [movies, setMovies] = useState([]);
  const [credits, setCredits] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setMovies(res);
    console.log(res);
  };
  const fetchCredits = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=en-US`
    );
    setCredits(data.cast);
    console.log(data.cast);
  };

  useEffect(() => {
    fetchData();
    fetchCredits();
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
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            padding: "0 20px 50px 20px",
            width: "100%",
            // height: "100vh",
          }}
        >
          <div className="person_details_hero_left">
            <img
              className="details_postar"
              src={
                movies?.data?.profile_path
                  ? API_IMG + movies?.data?.profile_path
                  : unavailable
              }
              alt={movies?.data?.name || movies?.data?.title}
            />
            <h1 className="d-inline-block details_title">
              {movies?.data?.name || movies?.data?.title}
            </h1>
            <p>{movies.data?.place_of_birth}</p>
            <span className="person_details_birth">
              <p>{movies.data?.birthday}</p>
            </span>
          </div>
          <div className="details_hero_right position-relative">
            <div></div>
            <p className="details_overview">
              Overview : <br />
              {movies.data?.biography || "Sorry Details not available!"}
            </p>
          </div>
        </div>
        <div className="container-fluid">
          <h2 className="my-4 text-black">Related Movie : </h2>
          <div className="row">
            {credits.map((c) => {
              return (
                <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 moviecard">
                  <Card>
                    <Card.Img
                      variant="top"
                      src={
                        c.poster_path ? API_IMG + c.poster_path : unavailable
                      }
                      alt={c.title}
                      className="movie-backdrop-poster"
                    />
                    <p className="person_details_movie_title">
                      {c?.original_title || c?.title}
                    </p>
                    <p className="person_details_movie_air_date">
                      {c.release_date.substring(0, 4) || "----"}
                    </p>
                    <Link
                      to={`/${media_type}/${id}`}
                      className="person_details_movie_btn"
                    >
                      <Button variant="success">More Details</Button>
                    </Link>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePerson;
