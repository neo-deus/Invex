"use client"
import React, { useContext, useState } from "react";
import { CryptoContext } from "@/Context/Cyrpto"; // Check for correct import path
import Link from "next/link";
import Chart from "@/components/GlobalCyrpto/Chart"; // Check for correct import path
import ModalComponent from "@/components/GlobalCyrpto/CoinDetails/ModalComponent"

const CoinTable = () => {
  const { cryptoData,currency, error } = useContext(CryptoContext);
  const [selectedCoin, setSelectedCoin] = useState("");
  console.log(cryptoData);
  // Handling errors or no data scenarios
  if (error && (error.data || error.coinData || error.search)) {
    const errorMessage = error.data || error.coinData || error.search;
    return <div>Error loading data: {errorMessage}</div>; // Display the appropriate error message string
  }

  if (!cryptoData || cryptoData.length === 0) {
    return <div>No data available</div>;
  }


  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);  // Set the selected coin to show in the modal
    console.log(coin);
  };

  const handleCloseModal = () => {
    setSelectedCoin(null);  // Reset the selected coin when the modal is closed
  };

  return (
    <div className="p-5 relative">
      <div className="overflow-x-auto">
        <div className="mx-[5%] overflow-y-auto">
          <table className="table-auto w-full backdrop-blur-md bg-white/20 text-white">
            <thead className="sticky top-0 z-0 border-b-2 text-black bg-yellow-100">
              <tr>
                <th className="px-4 py-2 w-12 text-center">Rank</th>
                <th className="px-4 py-2 w-1/8 text-center">Name</th>
                <th className="px-4 py-2 w-1/8 text-right">Market Cap</th>
                <th className="px-4 py-2 w-1/7 text-right">Price</th>
                <th className="px-4 py-2 w-1/8 text-center">1h</th>
                <th className="px-4 py-2 w-1/8 text-center">24h</th>
                <th className="px-4 py-2 w-1/5 text-center">Price (7 days)</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((coin, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 w-12 text-center">{coin.rank}</td>
                  
                    <td className="px-4 py-2 flex items-center cursor-pointer" onClick={() => handleCoinClick(coin.id)} >
                      <img
                        src={coin.image}
                        alt={`${coin.name} logo`}
                        className="mr-2 w-16 h-16 rounded-full shadow-sm"
                      />
                      {coin.name}
                    </td>
                  
                  <td className="px-4 py-2 w-1/4 text-right">
                    {new Intl.NumberFormat("en-IN", {
                      style: 'currency',
                      currency: currency,
                    }).format(coin.market_cap)}
                  </td>
                  <td className="px-4 py-2 w-1/6 text-right">
                    {new Intl.NumberFormat("en-IN", {
                      style: 'currency',
                      currency: currency,
                    }).format(coin.current_price)}
                  </td>
                  <td className="px-4 py-2 w-1/6 text-center">
                    <span
                      className={`${
                        coin.price_change_percentage_1h_in_currency >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.price_change_percentage_1h_in_currency >= 0
                        ? `▲ ${Math.abs(
                            coin.price_change_percentage_1h_in_currency
                          ).toFixed(2)}%`
                        : `▼ ${Math.abs(
                            coin.price_change_percentage_1h_in_currency
                          ).toFixed(2)}%`}
                    </span>
                  </td>
                  <td className="px-4 py-2 w-1/6 text-center">
                    <span
                      className={`${
                        coin.price_change_percentage_24h_in_currency >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.price_change_percentage_24h_in_currency >= 0
                        ? `▲ ${Math.abs(
                            coin.price_change_percentage_24h_in_currency
                          ).toFixed(2)}%`
                        : `▼ ${Math.abs(
                            coin.price_change_percentage_24h_in_currency
                          ).toFixed(2)}%`}
                    </span>
                  </td>
                  <td className="px-9 py-2 w-1/5 text-center">
                    <div className="overflow-hidden">
                      <Chart
                        sparkline={coin.sparkline_in_7d}
                        priceChange={
                          coin.price_change_percentage_7d_in_currency
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedCoin && <ModalComponent coin={selectedCoin} onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default CoinTable;
