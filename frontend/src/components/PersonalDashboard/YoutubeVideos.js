import React, { useState, useEffect } from 'react';
import axios from 'axios';

function YouTubeVideos() {
  const [videos, setVideos] = useState([]);
  //const apiKey = 'AIzaSyACxhfb9ar8WpOWlqiDR72Vo1_JQiaheng';  // Replace YOUR_API_KEY with your actual YouTube Data API key
  const apiKey = 'AIzaSyDGoeZzoW1kgGU8aefldET2jYgZ43DvkRc';
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            part: 'snippet',
            maxResults: 10,
            q: 'Personal Finance',
            type: 'video',
            regionCode: 'IN',
            videoDuration: 'medium',
            videoSyndicated: 'true',
            videoEmbeddable: 'true',
            key: apiKey
          }
        });
        console.log(response.data);
        setVideos(response.data.items);
        
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div style={{ display: 'flex', overflowX: 'scroll' }} className='w-28'>
      {videos.map(video => (
        <div key={video.id.videoId} style={{ minWidth: '200px', margin: '10px' }}>
          {/* Embed YouTube video using iframe */}
          <iframe
            width="100%"
            height="200"
            src={`https://www.youtube.com/embed/${video.id.videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.snippet.title}
          ></iframe>
          <p>{video.snippet.title}</p>
        </div>
      ))}
    </div>
  );
}

export default YouTubeVideos;

