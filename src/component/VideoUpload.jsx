// VideoUploadComponent.js

import React, { useState } from "react";
import axios from "axios";

const VideoUploadComponent = ({ fetch }) => {
  const [video, setVideo] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedVideo = event.target.files[0];

    if (selectedVideo && selectedVideo.size <= 100 * 1024 * 1024) {
      setVideo(selectedVideo);
    } else {
      alert("File size should be less than or equal to 100 MB");
      event.target.value = null;
    }
  };

  const handleUpload = async () => {
    try {
      // Upload video to Cloudinary
      setLoading(true);
      const formData = new FormData();
      formData.append("file", video);
      formData.append("upload_preset", "video_uploads");

      const cloudinaryResponse = await axios.post(
        `${import.meta.env.VITE_CLOUDINARY_CONNECTION_URL}`,
        formData
      );

      const videoUrl = cloudinaryResponse.data.secure_url;

      await axios.post(`${import.meta.env.VITE_DB_CONNECTION_URL}/upload`, {
        title,
        url: videoUrl,
      });

      console.log("Video uploaded successfully!");
      fetch();
      setLoading(false);
      setVideo(null);
    } catch (error) {
      console.error("Error uploading video:", error.message);
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={handleUpload} disabled={video ? false : true}>
        {console.log(video)}
        Upload Video
      </button>
      {loading && "Uploading"}
    </div>
  );
};

export default VideoUploadComponent;
