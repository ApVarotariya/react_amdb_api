import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactPlayer from "react-player";
import { FaPlay } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
            <div key={v.id} style={{ position: "relative" }}>
              <LazyLoadImage
                src={`https://img.youtube.com/vi/${v.key}/hqdefault.jpg`}
                alt={v.name}
                width={400}
                title={v.name}
                style={{ padding: "10px 15px" }}
                onClick={() => handlePlayClick(v)}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  width: "50px",
                }}
              >
                <div className="play-icon">
                  <svg
                    height="100%"
                    version="1.1"
                    viewBox="0 0 68 48"
                    width="100%"
                  >
                    <path
                      className="ytp-large-play-button-bg"
                      d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                      fill="#f00"
                    ></path>
                    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        show={showModal}
        onHide={handleModalClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="">{selectedVideo?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedVideo && (
            <>
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${selectedVideo.key}`}
                width={"100%"}
              />
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TrailerVideo;
