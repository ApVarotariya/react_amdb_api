import axios from "axios";
import React, { useEffect, useState } from "react"
import { Button } from "react-bootstrap";

const TrailerVideo = ({media_type,id}) =>{
    const [videos, setVideos] = useState();

    const fetchVideo = async () => {
        const {data} = await axios.get(
          `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=c94bf057fba6ebfedf3bab9d4ae67b1f&append_to_response=videos`
        );
    
        setVideos(data.results[0]?.key);
        console.log(data.results);
        console.log(videos);
      };
      useEffect(() => {
        fetchVideo();
      }, []);
    return(
        <>
             <Button
              color="secondary"
              target="__blank"
              href={`https://www.youtube.com/watch?v=${videos}`}
            >
              Watch the Trailer
            </Button>
        </>
    )
}
export default TrailerVideo