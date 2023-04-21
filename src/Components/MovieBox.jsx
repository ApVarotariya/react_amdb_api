import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import dateFormat from "dateformat";
import { unavailable } from "./README";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

const API_IMG = "https://image.tmdb.org/t/p/original";

const MovieBox = ({
  id,
  title,
  date,
  media_type,
  vote_average,
  poster,
  popularity,
  gender,
}) => {
  return (
    <>
      <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 moviecard">
        <Card>
          <Link
            to={`/${media_type}/${id}`}
            onClick={() => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
              });
            }}
          >
            <LazyLoadImage
              src={poster ? API_IMG + poster : unavailable}
              className="movie-backdrop-poster"
              alt={title}
            />
            <Card.Body>
              <Card.Title>
                <h3>
                  <strong>
                    <span>{title}</span>
                  </strong>
                  <span
                    className={vote_average < 5 || popularity < 5 ? "red" : ""}
                  >
                    {vote_average?.toFixed(1) || popularity?.toFixed(1)}
                  </span>
                </h3>
                <div className="d-flex justify-content-between align-items-start">
                  <p style={{ fontSize: "12px" }}>
                    <span>{dateFormat(date, "mmmm dS, yyyy")}</span>
                  </p>
                  <p style={{ fontSize: "12px" }}>
                    {media_type === "movie"
                      ? "Movie"
                      : media_type === "tv"
                      ? "TV Series"
                      : media_type === "person" &&
                        (gender === 0
                          ? "Not Specified"
                          : gender === 1
                          ? "Actress"
                          : gender === 2
                          ? "Actor"
                          : "")}
                  </p>
                </div>
              </Card.Title>
              <Link
                to={`/${media_type}/${id}`}
                as="button"
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
    </>
  );
};

export default MovieBox;
