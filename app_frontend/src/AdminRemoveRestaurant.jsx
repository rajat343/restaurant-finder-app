
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRemoveRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const isAdmin = localStorage.getItem('is_admin') === 'true';

    useEffect(() => {
        if (!isAdmin) {
            setError("Access denied. Admins only.");
            return;
        }

        const fetchRestaurants = async () => {
            try {
                const response = await axios.get('http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/restaurants/get_restaurants');
                setRestaurants(response.data);
                setFilteredRestaurants(response.data); // Set initial filtered list
            } catch (err) {
                setError("Failed to fetch restaurants.");
            }
        };

        fetchRestaurants();
    }, [isAdmin]);

    const deleteRestaurant = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/restaurants/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Use JWT
                },
            });
            setRestaurants((prev) => prev.filter((restaurant) => restaurant._id !== id));
            
            setFilteredRestaurants((prev) => prev.filter((restaurant) => restaurant._id !== id));
            alert('Restaurant Deleted Successfully')
        } catch (err) {
            setError("Failed to delete restaurant.");
        }
    };



    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchTerm(query);
        if (query === '') {
            setFilteredRestaurants(restaurants); // Show all restaurants if search is cleared
        } else {
            const filtered = restaurants.filter((restaurant) =>
                restaurant.name.toLowerCase().includes(query)
            );
            setFilteredRestaurants(filtered);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setFilteredRestaurants(restaurants); // Reset to show all restaurants
    };

    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold m-8">Manage Restaurants</h1>

            <div className="flex justify-center m-8">
    <div className="relative w-1/2 max-w-lg">
        <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search restaurants..."
            className="w-full px-4 py-2 border rounded border-gray-950"
        />
        {searchTerm && (
            <button
                onClick={clearSearch}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
            >
                &#x2715; {/* Unicode cross symbol */}
            </button>
        )}
    </div>
</div>


                <div className="flex justify-center">
        <div className="w-2/3">
            {filteredRestaurants.length === 0 ? (
                <p className="text-center">No restaurants found.</p>
            ) : (
                <table className="table-auto w-full border-collapse border border-gray-300 my-10">
                    <thead>
                        <tr>
                            <th className="border border-gray-500 px-4 py-2 text-center">Name</th>
                            <th className="border border-gray-500 px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRestaurants.map((restaurant) => (
                            <tr key={restaurant._id}>
                                <td className="border border-gray-500 px-4 py-2 text-center">
                                    {restaurant.name}
                                </td>
                                <td className="border border-gray-500 px-4 py-2 text-center">
                                    <button
                                        onClick={() => deleteRestaurant(restaurant._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
        </div>
    );
};

export default AdminRemoveRestaurants;
