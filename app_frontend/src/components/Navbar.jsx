import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for token and user type in localStorage
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("is_admin") === 'true';
        
        setIsLoggedIn(!!token);
        setUserType(isAdmin ? 'admin' : 'user');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("is_admin");
        setIsLoggedIn(false);
        setUserType(null);
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
                {/* Logo */}
                <Link to="/home" className="text-2xl font-bold text-gray-800">
                    FoodieHub
                </Link>

                {/* Right Section */}
                <div className="flex flex-wrap md:flex-nowrap items-center space-y-4 md:space-y-0 md:space-x-8 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="w-full md:w-auto flex-grow md:flex-grow-0">
                        <SearchBar />
                    </div>

                    {/* Links */}
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                        {isLoggedIn ? (
                            <>
                                {userType === 'user' && (
                                    <>
                                        <Link
                                            to="/userrestaurants"
                                            className="underline text-blue-600 hover:text-blue-700"
                                        >
                                            View Your Restaurants
                                        </Link>
                                        <Link
                                            to="/addrestaurant"
                                            className="underline text-blue-600 hover:text-blue-700"
                                        >
                                            Add Restaurant
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="underline text-blue-600 hover:text-blue-700"
                                        >
                                            My Profile
                                        </Link>
                                    </>
                                )}
                                {userType === 'admin' && (
                                    <Link
                                        to="/removerestaurant"
                                        className="underline text-blue-600 hover:text-blue-700"
                                    >
                                        Manage Restaurants
                                    </Link>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

