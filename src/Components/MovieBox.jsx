import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import dateFormat from "dateformat";
import { unavailable } from "./README";
import { Link } from "react-router-dom";

const API_IMG = "https://image.tmdb.org/t/p/original";

const MovieBox = ({ id, title, date, media_type, vote_average, poster }) => {
  return (
    <>
      <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 moviecard">
        <Card>
          <Card.Img
            variant="top"
            src={poster ? API_IMG + poster : unavailable}
            alt={title}
            className="movie-backdrop-poster"
          />
          <Card.Body>
            <Card.Title>
              <h3>
                <strong>
                  <span>{title}</span>
                </strong>
                <span>{vote_average}</span>
              </h3>
              <div className="d-flex justify-content-between align-items-start">
                <p style={{ fontSize: "12px" }}>
                  <span>{dateFormat(date, "mmmm dS, yyyy")}</span>
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
    </>
  );
};

export default MovieBox;
