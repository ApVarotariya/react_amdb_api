import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieBox from "./MovieBox";

const YoutubeVideos = ({ media_type, id }) => {
  const [movies, setMovies] = useState([]);
  const [video, setVideo] = useState();
  const [type, setType] = useState();
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_ACCESS_KEY}&page=${page}`
    );

    setMovies(data.results);
    console.log(data);
  };

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_ACCESS_KEY}`
    );

    setVideo(data.results[0]?.key);
    console.log(data.results.key);
  };
  useEffect(() => {
    fetchData();
    fetchVideo();
  }, [page]);
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-around">
          <h1 className="text-center fw-lighter page_heading mb-5">
            Youtube Videos
          </h1>
          {movies.map((movie) => {
            return (
              <>
                <MovieBox key={movie.id} movie={movie} video={video} />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default YoutubeVideos;
