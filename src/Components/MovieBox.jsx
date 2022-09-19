import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import dateFormat from "dateformat";
import { unavailable } from "./README";
import Credits from "./Credits";
import TrailerVideo from "./TrailerVideo";

const API_IMG = "https://image.tmdb.org/t/p/w300/";

const MovieBox = ({ id,title,date,media_type,vote_average,poster,popularity,vote_count,overview }) => {
  const [show, setShow] = useState(false);

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
                  <span>
                    {dateFormat(
                     date,
                      "mmmm dS, yyyy"
                    )}
                  </span>
                </p>
                <p style={{ fontSize: "12px" }}>
                  {media_type === "tv" ? "TV Series" : "Movie"}
                </p>
              </div>
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
          aria-labelledby="example-custom-modal-styling-title">
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              <h1> {title}</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              <Card.Img
                variant="top"
                src={
                  poster ? API_IMG + poster : unavailable
                }
                alt=""
                className="movie-backdrop-poster"
              />
              <Card.Body>
                <Card.Text>
                  <span>
                    <strong>Realese Date :</strong>
                    {dateFormat(
                      date,
                      "mmmm dS, yyyy"
                    )}
                  </span>
                </Card.Text>
                <Card.Text>
                  <span>
                    <strong>Imdb Rating :</strong> {vote_average}
                  </span>
                </Card.Text>
                <Card.Text>
                  <p className="card-movie-overview">
                    <strong>Overview :</strong>
                    {overview}
                  </p>
                </Card.Text>
                <Card.Text>
                  <p>
                    <strong>popularity :</strong> {popularity}
                  </p>
                </Card.Text>
                <Card.Text>
                  <p>
                    <strong>Total No. of Votes :</strong> {vote_count}
                  </p>
                </Card.Text>
                <div>
        <Credits  media_type={ media_type} id={ id} poster={poster}/>
        </div>
                <TrailerVideo  media_type={ media_type} id={ id}/>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default MovieBox;
