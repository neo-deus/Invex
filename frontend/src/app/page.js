"use client"

import { useRouter } from 'next/navigation';
import axios from 'axios';

import Navbar from "@/components/Navbar";
import Carousal from "@/components/GlobalCyrpto/Carousal";
import CoinTable from "@/components/GlobalCyrpto/CoinTable";
import Filters from "@/components/GlobalCyrpto/Filters";
import { CryptoProvider } from "@/Context/Cyrpto";
import Pagination from "@/components/GlobalCyrpto/Pagination";

const Home = () => {
  const router=useRouter();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await axios.get('/api/users/logout');

      // Redirect to the login page after logout
      localStorage.removeItem("email");
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally handle errors, e.g., show an error message
    }
  };

  return (
    <CryptoProvider>
      <div className="bg-gray-800 min-h-screen">
      
        <div className="relative z-10"> 
          <Navbar />
          <Carousal />
          <Filters />
          <CoinTable />
          <Pagination />
        </div>
      </div>
      <button onClick={handleLogout} className="absolute  right-0 m-4 p-2 bg-red-500 text-white rounded cursor-pointer">Logout</button>
    </CryptoProvider>
  )
}

export default Home;