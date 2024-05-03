"use client";
import React, { useState, useEffect } from "react";
import YouTubeVideos from "./YoutubeVideos";
import axios from "axios";
import Image from "next/image";

const LearningDetails = () => {
  // const [articles, setArticles] = useState([]);

  // useEffect(() => {
  //   const fetchArticles = async () => {
  //     try {
  //       const response = await axios.get('https://newsapi.org/v2/everything', {
  //         params: {
  //           q: 'personal finance management', // Search query
  //           apiKey: '0a24a9ad8e4b4a078c674b91f0b703fe' // Replace 'YOUR_API_KEY' with your actual NewsAPI key
  //         }
  //       });
  //       setArticles(response.data.articles);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error('Error fetching articles:', error);
  //     }
  //   };

  //   fetchArticles();
  // }, []);

  // return (
  //   <div style={{ padding: '20px' }}>
  //     <h1 style={{ color: '#333', marginBottom: '10px' }}>Personal Finance News</h1>
  //     <ul style={{ listStyleType: 'none', padding: 0 }}>
  //       {articles.map(article => (
  //         <li key={article.url} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
  //           <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'white' }}>
  //             <h2>{article.title}</h2>
  //             <p>{article.description}</p>
  //           </a>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const apiKey = "860ae4cb72fa492e8b732f2f4c5ca1f2"; // Replace with your actual API key

  useEffect(() => {
    // Fetch articles from Bing News API
    const fetchArticles = async () => {
      const params = new URLSearchParams({
        q: "Personal Finance Management", // Your query
        count: "5", // Number of results to return
        offset: "0", // Results offset for pagination
        mkt: "en-US", // Market code
        safeSearch: "Off", // Safe search setting
        sortBy: "Relevance",
      });

      try {
        const response = await fetch(
          `https://api.bing.microsoft.com/v7.0/news/search?${params.toString()}`,
          {
            headers: {
              "Ocp-Apim-Subscription-Key": apiKey,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setArticles(data.value); // Update state with fetched articles
          console.log(data.value);
        } else {
          console.error("Error fetching articles:", response.statusText);
        }
      } catch (error) {
        setError("Failed to fetch articles");
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  //if (loading) return <p>Loading...</p>;
  //if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-2 flex-col min-w-96">
      {error && <p>Error loading articles: {error}</p>}
        
       <div className=" flex-col overflow-y-auto no-scrollbar">
        {articles.map((article) => (
          <div
            key={article.url}
            className=" p-2 m-2 w-36 rounded-xl  bg-white max-h-24 overflow-y-auto no-scrollbar"
          >
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              
              <div className=" text-lg text-black font-semibold">
                {article.title}
              </div>
              <p>{article.description}</p>
            </a>
          </div>
        ))}
       
      </div> 
    </div>
  );
};

export default LearningDetails;


{/* {article.image?.thumbnail?.contentUrl && (
                <Image
                  src={article.image.thumbnail.contentUrl}
                  alt="Article image"
                  width={160} // Example width
                  height={100} // Example height, adjust based on your design needs
                  className="rounded"
                />
              )} */}
