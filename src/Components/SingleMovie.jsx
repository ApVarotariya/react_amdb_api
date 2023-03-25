import React, { useState, useEffect, useRef } from "react";
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
  const [bgColor, setBgColor] = useState('');
  const [brightness, setBrightness] = useState(0);
  const [isDarkBg, setIsDarkBg] = useState(false);

  const canvasRef = useRef(null);

  const fetchData = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );
    setMovies(res);
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
  useEffect(() => {
    if(id){
    fetchSimilar();}
  }, [id]);

  function timeConvert(n) {
    var num = n;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + "h " + rminutes + "m";
  }

  useEffect(() => {
    // if (movies) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src =
        "https://cors-anywhere.herokuapp.com/" +
        API_IMG +
        movies?.data?.poster_path;
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

        const gradient = `linear-gradient(to right, rgba(${colors.r},${colors.g},${colors.b},0.8), rgba(255,255,255,0.8))`;
        const element = document.getElementById("single_content_details");
        element.style.background = gradient;
      };

      const section = document.getElementById('section-id');

      // Get the background color of the section
      const bgColor = window.getComputedStyle(section).getPropertyValue('background-color');
      setBgColor(bgColor);
  
      // Convert the color to an RGB array
      const rgb = bgColor.match(/\d+/g);
  
      // Calculate the brightness of the color using the formula (R*299 + G*587 + B*114) / 1000
      const brightness = (rgb[0]*299 + rgb[1]*587 + rgb[2]*114) / 1000;
      setBrightness(brightness);
  
      // Check if the brightness is less than 128 (darker color)
      if (brightness < 1) {
        setIsDarkBg(true);
      }
    // }
  }, [movies]);

  return (
    <>
      <div className="single_content_details_main">
        <div
          className={`section ${isDarkBg ? 'dark-bg' : ''}`} id="section-id"
          style={{
            backgroundImage: `url(${API_IMG + movies?.data?.backdrop_path})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            width: "100%",
            height: "100vh",
          }}
        >
          <div
            className="single_content_details"
            id="single_content_details"
            style={{
              backgroundSize: "cover",
              position: "relative",
              width: "100%",
              height: "100vh",
            }}
          >
            <canvas ref={canvasRef} style={{ display: "none" }} />;
            <div className="details_hero_left">
              <LazyLoadImage
                className="details_postar"
                id="details_postar"
                src={API_IMG + movies?.data?.poster_path}
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
                    return (
                      <span key={c.id}>{(index ? ", " : "") + c.name}</span>
                    );
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
          <h2 className="my-4 text-black">Similar Movies</h2>
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
                      <Link to={`/movie/${id}`}>
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
