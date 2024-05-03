import { createContext, useLayoutEffect, useState } from "react";

// create context object
export const CryptoContext = createContext({});

// create the provider component
export const CryptoProvider = ({ children }) => {
  const [cryptoData, setCryptoData] = useState();
  const [searchData, setSearchData] = useState();
  const [coinData, setCoinData] = useState();
  const [carouselData, setCarouselData] = useState([]);
  const [coinSearch, setCoinSearch] = useState("");

  const [currency, setCurrency] = useState("usd");
  const [sortBy, setSortBy] = useState("market_cap_desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(250);
  const [perPage, setPerPage] = useState(10);


  // This is how you can do error handling by creating one state to store the error,
  // This is only for example purpose and not covered in the video
  // create one state for the error
  const [error, setError] = useState({ data: "", coinData: "", search: "" });
// there can be 3 errors that we can catch from all three functions, also send the error state 
// through value prop

  const getCryptoData = async () => {
    //here we will set an empty string for the data error
    setError({ ...error, data: "" });
    setCryptoData();
    setTotalPages(13220);
    
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinSearch}&order=${sortBy}&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`,
        {headers:{
            "x-cg-demo-api-key": "CG-YkDCZeia3Rt81Xesk36q17Mq",
        }}
      ).then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        let errorResponse = await res.json();
        // here we might get the error so it is best to handle it and throw the error
        // console.log(errorResponse);
        setError({ ...error, data: errorResponse.error });
        throw new Error(errorResponse.error);
      }).then((json) => json);

      // console.log(data);
      setCryptoData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCarouselData = async () => {
    //here we will set an empty string for the data error
    setError({ ...error, data: "" });
    setCarouselData([]);
    
    
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`,
        {headers:{
            "x-cg-demo-api-key": "CG-YkDCZeia3Rt81Xesk36q17Mq",
        }}
      ).then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        let errorResponse = await res.json();
        // here we might get the error so it is best to handle it and throw the error
        // console.log(errorResponse);
        setError({ ...error, data: errorResponse.error });
        throw new Error(errorResponse.error);
      }).then((json) => json);

      // console.log(data);
      setCarouselData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCoinData = async (name) => {
    setCoinData();
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/coins/${name}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=false`,
        {headers:{
            "x-cg-demo-api-key": "CG-YkDCZeia3Rt81Xesk36q17Mq",
        }}
      )
        .then((res) => res.json())
        .then((json) => json);

      // console.log("CoinData", data);
      setCoinData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSearchResult = async (query) => {
    try {
      const data = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${query}`,
        {headers:{
            "x-cg-demo-api-key": "CG-YkDCZeia3Rt81Xesk36q17Mq",
        }}
      )
        .then((res) => res.json())
        .then((json) => json);

      // console.log(data);
      setSearchData(data.coins);
    } catch (error) {
      console.log(error);
    }
  };

  const resetFunction = () => {
    setPage(1);
    setCoinSearch("");
  };

  useLayoutEffect(() => {
    getCryptoData();
  }, [coinSearch, currency, sortBy, page, perPage]);

  useLayoutEffect(()=>{
    getCarouselData()
  },[currency])

  return (
    <CryptoContext.Provider
      value={{
        cryptoData,
        searchData,
        carouselData,
        getSearchResult,
        setCoinSearch,
        setSearchData,
        currency,
        setCurrency,
        sortBy,
        setSortBy,
        page,
        setPage,
        totalPages,
        resetFunction,
        setPerPage,
        perPage,
        getCoinData,
        coinData,
        error
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};