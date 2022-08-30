import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import dateFormat from "dateformat";
import { unavailable } from "./README";

const API_IMG = "https://image.tmdb.org/t/p/w300/";

const MovieBox = ({ movie }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="col-lg-2 col-md-2 col-sm-4 col-xs-6 moviecard">
        <Card>
          <Card.Img
            variant="top"
            src={movie.poster_path ? API_IMG + movie.poster_path : unavailable}
            alt="There is Supposed to be an Image of Movie Poster"
            className="movie-backdrop-poster"
          />
          <Card.Body>
            <Card.Title>
              <h3>
                <strong>
                  <span>{movie.title ? movie.title : movie.original_name}</span>
                </strong>
                <span>{movie.vote_average}</span>
              </h3>
              <p>
                <span>
                  {dateFormat(
                    movie.release_date
                      ? movie.release_date
                      : movie.first_air_date,
                    "mmmm dS, yyyy"
                  )}
                </span>
              </p>
            </Card.Title>
            <Button variant="success" onClick={() => setShow(true)}>
              More Details
            </Button>
          </Card.Body>
        </Card>
        <Modal
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="modal-90w"
          className="model-main"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              <h1> {movie.title ? movie.title : movie.original_name}</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              <Card.Img
                variant="top"
                src={
                  movie.poster_path ? API_IMG + movie.poster_path : unavailable
                }
                alt=""
                className="movie-backdrop-poster"
              />
              <Card.Body>
                <Card.Text>
                  <span>
                    <strong>Realese Date :</strong>{" "}
                    {dateFormat(
                      movie.release_date
                        ? movie.release_date
                        : movie.first_air_date,
                      "mmmm dS, yyyy"
                    )}
                  </span>
                </Card.Text>
                <Card.Text>
                  <span>
                    <strong>Imdb Rating :</strong> {movie.vote_average}
                  </span>
                </Card.Text>
                <Card.Text>
                  <p className="card-movie-overview">
                    <strong>Overview :</strong>
                    {movie.overview}
                  </p>
                </Card.Text>
                <Card.Text>
                  <p>
                    <strong>popularity :</strong> {movie.popularity}
                  </p>
                </Card.Text>
                <Card.Text>
                  <p>
                    <strong>Avg. Vote :</strong>
                    {movie.vote_average}
                  </p>
                </Card.Text>
                <Card.Text>
                  <p>
                    <strong>Total No. of Votes :</strong> {movie.vote_count}
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default MovieBox;
