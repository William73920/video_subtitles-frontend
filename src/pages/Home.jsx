import axios from "axios";
import React, { useEffect, useState } from "react";
import VideoUploadComponent from "../component/VideoUpload";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    axios
      .get(`${import.meta.env.VITE_DB_CONNECTION_URL}/videos`)
      .then((result) => setVideos(result.data))
      .catch((err) => console.log(err));
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_DB_CONNECTION_URL}/video/${id}`
      );

      fetchVideos();
    } catch (error) {
      console.lof(err);
    }
  };

  return (
    <div className="App" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Video Library</h1>
      <VideoUploadComponent fetch={fetchVideos} />
      <ul style={{ listStyle: "none", padding: "0" }}>
        {videos &&
          videos?.map((video) => (
            <div className="video-card">
              <Link to={`/details/${video._id}`} className="video-title">
                {video.title}
              </Link>
              <button
                onClick={() => handleDelete(video._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
      </ul>
    </div>
  );
};

export default Home;
