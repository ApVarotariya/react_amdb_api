import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const TrailerVideo = ({ media_type, id }) => {
  const [videos, setVideos] = useState();

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_ACCESS_KEY}&append_to_response=videos`
    );

    setVideos(data.results[0]?.key);
    console.log(data.results);
    console.log(videos);
  };
  useEffect(() => {
    fetchVideo();
  }, []);
  return (
    <>
      <Button
        color="secondary"
        target="__blank"
        href={`https://www.youtube.com/watch?v=${videos}`}
      >
        Watch the Trailer
      </Button>
    </>
  );
};
export default TrailerVideo;
