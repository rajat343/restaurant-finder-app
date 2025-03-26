
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const getAuthToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No authentication token found');
            return null;
        }
        return token;
    };

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            setError('Authentication required. Please login.');
            return;
        }

        const fetchRestaurants = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/restaurants/get_user_restaurants`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRestaurants(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            setError('Failed to fetch restaurants');
            setIsLoading(false);
        }
        };
        fetchRestaurants();
    }, []);

    const handleEditRestaurant = (id) => {
        navigate(`/updaterestaurant/${id}`);
    };

    const handleDeleteRestaurant = async (id) => {
        const token = getAuthToken();
        if (!token) {
            setError('Authentication required. Please login.');
            return;
        }

        try {
        await axios.delete(`http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/restaurants/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setRestaurants(restaurants.filter((restaurant) => restaurant._id !== id));
        } catch (error) {
        console.error('Error deleting restaurant:', error);
        setError('Failed to delete restaurant');
        }
    };

    if (isLoading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-red-500">{error}</div>;
    }

    return (
        <>
        <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold my-6">My Restaurants</h1>
        {restaurants.length === 0 ? (
            <p>No restaurants found.</p>
        ) : (
            restaurants.map((restaurant) => (
            <div
                key={restaurant._id}
                className="bg-white shadow rounded-lg p-4 mb-4 flex flex-col"
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">{restaurant.name}</h2>
                    </div>
                    <div className="space-x-2">
                        <button
                            onClick={() => handleEditRestaurant(restaurant._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                        Edit
                        </button>
                        <button
                            onClick={() => handleDeleteRestaurant(restaurant._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                        Delete
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-600">{restaurant.description || 'No description available'}</p>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700 mb-2">Restaurant Details</h3>
                        <div className="space-y-1">
                            <p>
                                <span className="font-semibold">Cuisine: </span>
                                {restaurant.cuisines && restaurant.cuisines.length > 0
                                    ? restaurant.cuisines.map((cuisine) => cuisine.cuisine_name).join(', ')
                                    : 'Not specified'}
                            </p>
                            <p>
                                <span className="font-semibold">Address:</span> {restaurant.location.address || 'Not specified'}
                            </p>
                            <p>
                                <span className="font-semibold">City:</span> {restaurant.location.city || 'Not specified'}
                            </p>
                            <p>
                                <span className="font-semibold">ZIP Code:</span> {restaurant.location.zipcode || 'Not specified'}
                            </p>
                            <p>
                                <span className="font-semibold">Hours:</span> {restaurant.hours_active || 'Not specified'}
                            </p>
                            <p>
                                <span className="font-semibold">Type of Food: </span>
                                {restaurant.type_of_food
                                    ? `Veg: ${restaurant.type_of_food.is_veg ? 'Yes' : 'No'}, Non-Veg: ${restaurant.type_of_food.is_non_veg ? 'Yes' : 'No'}`
                                    : 'Not specified'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            ))
        )}
        </div>
        </>
    );
};

export default UserRestaurants;
