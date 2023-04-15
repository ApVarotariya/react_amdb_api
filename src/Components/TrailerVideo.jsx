import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactPlayer from "react-player";

const TrailerVideo = ({ media_type, id }) => {
  const [videos, setVideos] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideo = async () => {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_ACCESS_KEY}&append_to_response=videos`
    );

    setVideos(data.results);
  };

  const handlePlayClick = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedVideo(null);
    setShowModal(false);
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);

  return (
    <>
      <div className="d-flex w-100 justify-content-between trailer_video_main">
        {videos?.slice(0, 3).map((v) => {
          return (
            <>
              <ReactPlayer
                key={v?.id}
                url={`https://www.youtube.com/watch?v=${v.key}`}
                width={400}
                style={{ padding: "20px" }}
                controls={true}
                onPlay={() => handlePlayClick(v)}
              />
            </>
          );
        })}
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Body>
          {selectedVideo && (
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${selectedVideo.key}`}
              width={"100%"}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TrailerVideo;
