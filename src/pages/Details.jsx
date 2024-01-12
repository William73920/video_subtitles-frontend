import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";

const Details = () => {
  const { id } = useParams();
  const [video, setVideo] = useState({});
  const [sub, setSub] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [loading, setLoading] = useState(false);

  const ref = useRef();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    axios
      .get(`${import.meta.env.VITE_DB_CONNECTION_URL}/video/${id}`)
      .then((result) => {
        setVideo(result?.data);
        setSubtitles(result.data.subtitles);
      })
      .catch((err) => console.log(err));
  };

  const handleSubs = () => {
    const newSubtitle = {
      startTime: currentTimestamp,
      content: sub,
      seconds: parseInt(seconds),
    };

    setSubtitles((prevSubtitles) => [...prevSubtitles, newSubtitle]);

    setTimeout(() => {
      setSub("");
    }, 100);
  };

  const handleDelete = () => {
    axios
      .put(
        `${
          import.meta.env.VITE_DB_CONNECTION_URL
        }/video/${id}/delete/subtitles`,
        {
          subtitles: [],
        }
      )
      .then(() => {
        setSubtitles([]);
        console.log("Subtitles state after deletion:", subtitles);
        setCurrentSubtitle("");
        fetchVideos();
      })
      .catch((err) => console.log(err));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_DB_CONNECTION_URL}/videos/${id}/subtitles`,
        { subtitles }
      );

      if (!res.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update subtitles");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    // Iterate through subtitles
    for (const sub of subtitles) {
      // console.log("sub.currentTimestamp:", sub.currentTimestamp);
      // console.log("currentTimestamp:", currentTimestamp);

      if (
        sub.startTime <= currentTimestamp &&
        sub.startTime + sub.seconds >= currentTimestamp
      ) {
        // Set currentSubtitle and break out of the loop
        setCurrentSubtitle(sub.content);
        console.log(sub.content);

        break;
      } else {
        setCurrentSubtitle("");
      }
    }
  }, [currentTimestamp, subtitles]);

  return (
    <div>
      <h1>{video?.title}</h1>
      <p>Stop the video at the point you want to insert your subtitle</p>
      <ReactPlayer
        url={video?.url}
        controls={true}
        ref={ref}
        onProgress={() => setCurrentTimestamp(ref.current.getCurrentTime())}
      />
      {currentSubtitle}

      <textarea
        name="subtitle"
        id="subtitle"
        cols="3"
        rows="4"
        onChange={(e) => setSub(e.target.value)}
        value={sub}
      ></textarea>
      <label htmlFor="endtime">Number of seconds</label>
      <input
        type="number"
        id="endtime"
        onChange={(e) => setSeconds(e.target.value)}
      />
      <button onClick={handleSubs}>Add subs</button>
      <button onClick={handleDelete}>Delete Subs</button>
      {loading ? "Saving" : <button onClick={handleSave}>Save Subs</button>}
    </div>
  );
};

export default Details;
