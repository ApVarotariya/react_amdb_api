import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ReactPlayer from "react-player/lazy";

const TrailerVideo = ({ media_type, id }) => {
  const [videos, setVideos] = useState();

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_ACCESS_KEY}&append_to_response=videos`
    );

    setVideos(data.results);
  };
  useEffect(() => {
    fetchVideo();
  }, []);
  return (
    <>
      {/* <Button
        key={videos?.id}
        className="trailer_btn"
        target="__blank"
        href={`https://www.youtube.com/watch?v=${videos[0].key}`}
      >
        Watch the Trailer
      </Button> */}
      <div className="d-flex w-100">
        {videos?.slice(0, 3).map((v) => {
          return (
            <>
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${v.key}`}
                width={400}
                style={{ padding: "20px" }}
              />
              {/* <p>{v.key}</p> */}
            </>
          );
        })}
      </div>
    </>
  );
};
export default TrailerVideo;
