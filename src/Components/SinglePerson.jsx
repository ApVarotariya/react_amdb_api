import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { unavailable } from "./README";
import dateFormat from "dateformat";
import { Button, Card } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";

const API_IMG = "https://image.tmdb.org/t/p/w500";

const SinglePerson = () => {
  const { id } = useParams();
  const media_type = "person";
  const [movies, setMovies] = useState([]);
  const [credits, setCredits] = useState([]);
  const perPage = 8;
  const [next, setNext] = useState(perPage);
  const handleClick = () => {
    setNext(next + perPage);
  };

  const fetchData = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setMovies(res);
    // console.log(res);
  };
  const fetchCredits = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/credits?api_key=${process.env.REACT_APP_ACCESS_KEY}&language=en-US`
    );
    setCredits(data.cast);
    // console.log(data.cast);
  };

  useEffect(() => {
    fetchData();
    fetchCredits();
  }, [id]);

  // function timeConvert(n) {
  //   var num = n;
  //   var hours = num / 60;
  //   var rhours = Math.floor(hours);
  //   var minutes = (hours - rhours) * 60;
  //   var rminutes = Math.round(minutes);
  //   return rhours + "h " + rminutes + "m";
  // }

  useEffect(() => {
    if (movies) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src =
        "https://cors-anywhere.herokuapp.com/" +
        API_IMG +
        API_IMG +
        movies?.data?.profile_path;
      img.onload = function () {
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

        const gradient = `linear-gradient(to bottom right, rgb(${colors.r},${colors.g},${colors.b}), rgb(255,255,255))`;
        const element = document.getElementById("single_content_details");
        element.style.background = gradient;
      };
    }
  }, [movies]);

  return (
    <>
      <div className="single_content_details_main">
        <div
          className="single_content_details"
          id="single_content_details"
          style={{
            backgroundSize: "cover",
            position: "relative",
            padding: "0 20px 50px 20px",
            width: "100%",
          }}
        >
            <div className="person_details_hero_left">
              <LazyLoadImage
                className="details_postar"
                id="details_postar"
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
            {credits.slice(0, next).map((c) => {
              return (
                <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 moviecard">
                  <Card>
                    <LazyLoadImage
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
                      to={`/movie/${id}`}
                      className="person_details_movie_btn"
                    >
                      <Button variant="success">More Details</Button>
                    </Link>
                  </Card>
                </div>
              );
            })}
            <div className="text-center">
              {next < credits.length && (
                <Button
                  className="btn btn-lg mb-4 load_more_btn"
                  onClick={handleClick}
                >
                  Load more
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SinglePerson;
