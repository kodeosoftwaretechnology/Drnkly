import React, { useState, useEffect } from 'react';
import {
  Menu, Search, ShoppingCart, X, User, Settings, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = [
  { name: 'Drinks', image: 'https://plus.unsplash.com/premium_photo-1671244417901-6d0f50085167?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Snacks', image: 'https://plus.unsplash.com/premium_photo-1695558759748-5cad76d7d48e?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Soft Drinks', image: 'https://images.unsplash.com/photo-1452725210141-07dda20225ec?q=80&w=2152&auto=format&fit=crop' },
  { name: 'Ciggarettes', image: 'https://images.unsplash.com/photo-1702306455611-e3360e6ffeee?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Glasses & Plates', image: 'https://images.unsplash.com/photo-1516600164266-f3b8166ae679?q=80&w=2070&auto=format&fit=crop' }
];

const stores = [
  { id: 1, name: "PK Wines", rating: 4.8, image: "https://images.unsplash.com/photo-1597290282695-edc43d0e7129?w=600&h=400&fit=crop", address: "123 Main St", distance: "0.8 miles", openTime: "10:00 AM - 10:00 PM" },
  { id: 2, name: "Sunrise Family Garden Restaurant", rating: 4.5, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop", address: "456 Oak Ave", distance: "1.2 miles", openTime: "11:00 AM - 9:00 PM" }
];

function Dashboard() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        if (token && userId) {
          setIsLoggedIn(true);
          const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserName(response.data.name);
        }
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    };
    fetchUserName();
  }, []);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/products?search=${searchQuery}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes rotate3D {
          0% { transform: rotateY(0deg) rotateX(0deg); }
          50% { transform: rotateY(10deg) rotateX(5deg); }
          100% { transform: rotateY(0deg) rotateX(0deg); }
        }
        .drink-warning {
          animation: rotate3D 4s infinite ease-in-out;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .search-container {
          transition: all 0.3s ease;
          max-width: 140px;
          margin-top: 8px;
        }
        .search-container:focus-within {
          max-width: 400px;
          box-shadow: 0 0 0 3px #cd683944;
          transform: scale(1.05);
        }
        .search-container input {
          font-size: 0.6rem;
          padding: 0.25rem 0.6rem 0.25rem 2rem;
          height: 28px;
          transition: all 0.3s ease;
        }
        .search-container input:focus {
          font-size: 0.85rem;
          height: 38px;
          padding: 0.4rem 0.9rem 0.4rem 2rem;
        }
      `}</style>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-1">
          <div className="flex items-center justify-between h-16">
            <button onClick={toggleMenu} className="p-2 hover:bg-gray-100 rounded-full">
              <Menu size={22} />
            </button>

            <img
              src="../src/pages/logo2.png"
              alt="Drnkly Logo"
              className="h-32 object-contain"
            />

            {/* LOGIN + SEARCH BLOCK */}
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-600"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="text-[#cd6839] text-xs font-medium hover:underline"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/signup')}
                      className="bg-[#cd6839] text-white px-2 py-1 rounded-md text-xs hover:bg-[#b55a31]"
                    >
                      Sign Up
                    </button>
                  </>
                )}
                <button onClick={() => navigate('/cart')} className="p-2 hover:bg-gray-100 rounded-full">
                  <ShoppingCart size={20} />
                </button>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative search-container">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search for drinks..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#cd6839]"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div
          onClick={() => navigate('/products')}
          className="relative mb-8 rounded-2xl overflow-hidden shadow-md cursor-pointer group"
        >
          <img
            src="../src/pages/Banner.jpg"
            alt="The Glenwalk Banner"
            className="w-full h-auto object-cover transition-all duration-1000 ease-in-out scale-100 group-hover:scale-105"
          />
        </div>

        <div className="drink-warning text-center text-[#cd6839] font-bold text-lg md:text-xl hidden md:block mb-8">
          Drink Responsibly – Alcohol consumption is injurious to health 🍷
        </div>

        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => navigate('/products')}
              className="relative overflow-hidden rounded-xl cursor-pointer transform hover:scale-105 transition-transform"
            >
              <img src={category.image} alt={category.name} className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-medium">{category.name}</span>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Nearby Stores</h2>
        <div className="grid gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer"
              onClick={() => navigate('/products')}
            >
              <div className="sm:flex">
                <div className="sm:w-48 h-48 sm:h-auto">
                  <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{store.name}</h3>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{store.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{store.address}</p>
                    <p className="text-gray-600">{store.openTime}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{store.distance}</span>
                    <button className="bg-[#cd6839] text-white px-4 py-2 rounded-lg hover:bg-[#b55a31]">
                      View Store
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleMenu}>
          <div className="absolute top-0 left-0 w-80 h-full bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold">Menu</h2>
              <button onClick={toggleMenu}><X size={24} /></button>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={24} className="text-gray-600" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">{userName || 'Guest User'}</h3>
                <p className="text-sm text-gray-600">View Profile</p>
              </div>
            </div>
            <div className="space-y-4">
              <button onClick={() => navigate('/profile')} className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg">
                <User size={20} className="mr-3" /> My Profile
              </button>
              <button onClick={() => navigate('/order-history')} className="flex items-center w-full p-3 hover:bg-gray-50 rounded-lg">
                <Settings size={20} className="mr-3" /> Order History
              </button>
              <button onClick={handleLogout} className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-lg">
                <LogOut size={20} className="mr-3" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;