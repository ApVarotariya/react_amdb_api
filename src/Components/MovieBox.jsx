import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import dateFormat from "dateformat";
import { unavailable } from "./README";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_IMG = "https://image.tmdb.org/t/p/w300";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="col-lg-3 col-md-4 col-sm-6 col-xs-6 moviecard">
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
            {isLoading ? (
              <Skeleton
                height="450px"
                width="100%"
                className="moviebox_poster_skeleton"
              />
            ) : (
              <LazyLoadImage
                src={poster ? API_IMG + poster : unavailable}
                className="movie-backdrop-poster moviebox_poster"
                alt={title}
                height={450}
              />
            )}
            <Card.Body>
              <Card.Title>
                {isLoading ? (
                  <Skeleton height="10px" width="70%" />
                ) : (
                  <h3>
                    <strong>
                      <span>{title}</span>
                    </strong>
                    <span
                      className={
                        vote_average < 5 || popularity < 5 ? "red" : ""
                      }
                    >
                      {vote_average?.toFixed(0) || popularity?.toFixed(0)}
                    </span>
                  </h3>
                )}
                <div className="d-flex justify-content-between align-items-start">
                  {isLoading ? (
                    <Skeleton height="10px" width="70%" />
                  ) : (
                    <p style={{ fontSize: "12px" }}>
                      <span>{dateFormat(date, "mmmm dS, yyyy")}</span>
                    </p>
                  )}
                  {isLoading ? (
                    <Skeleton height="10px" width="100%" />
                  ) : (
                    <p style={{ fontSize: "10px" }}>
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
                  )}
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
                {isLoading ? (
                  <Skeleton height="10px" width="70%" />
                ) : (
                  <Button variant="success">More Details</Button>
                )}
              </Link>
            </Card.Body>
          </Link>
        </Card>
      </div>
    </>
  );
};

export default MovieBox;
