import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RestaurantOverview() {
  const location = useLocation();
  const navigate = useNavigate();

  const [visibleCount, setVisibleCount] = useState(8);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useState({
    name: "",
    cuisine: "",
    zipcode: "",
    avgPrice: "",
    rating: "",
  });

  useEffect(() => {
    fetchRestaurants();
  }, [location.state]);

  const fetchRestaurants = async (query = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        "http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/restaurants/get_restaurants",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            find_query: query,
            project_query: {},
            sort_order: { _id: 1 },
            page: 1,
            limit: -1,
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }

      const data = await response.json();
      setRestaurants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };



  const handleSearch = () => {
    const query = {};

    if (searchParams.name) query.name = { $regex: searchParams.name, $options: "i" };
    
    if (searchParams.zipcode) query["location.zipcode"] = searchParams.zipcode;

    // Match the average price to the backend values
    if (searchParams.avgPrice) query.restaurant_average_price = searchParams.avgPrice;

    if (searchParams.rating) query.avg_rating = { $gte: parseFloat(searchParams.rating) };
    query.is_deleted = false;

    fetchRestaurants(query);
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, restaurants.length));
  };

  const handleCardClick = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">Loading Restaurants...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-semibold text-red-600">Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 max-w-5xl mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700 transition-all"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center">Restaurants</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchParams.name}
            onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
            className="p-2 border rounded"
          />
          
          <input
            type="text"
            placeholder="Search by ZIP Code"
            value={searchParams.zipcode}
            onChange={(e) => setSearchParams({ ...searchParams, zipcode: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={searchParams.avgPrice}
            onChange={(e) => setSearchParams({ ...searchParams, avgPrice: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Select Price</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="PREMIUM">Premium</option>
          </select>
          <input
            type="number"
            step="0.1"
            placeholder="Min Rating"
            value={searchParams.rating}
            onChange={(e) => setSearchParams({ ...searchParams, rating: e.target.value })}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center text-gray-600 text-xl">No restaurants found for the search criteria.</div>
      ) : (
        <div className="space-y-6">
          {restaurants.slice(0, visibleCount).map((restaurant, index) => (
            <div
              key={restaurant._id}
              onClick={() => handleCardClick(restaurant._id)}
              className="border-b border-gray-300 p-4 mb-4 bg-white shadow-sm shadow-gray-300 rounded-lg cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="w-48 h-48 flex-shrink-0">
                  <img
                    src={
                      restaurant.photos && restaurant.photos.length > 0
                        ? restaurant.photos[0]
                        : "https://via.placeholder.com/200"
                    }
                    alt={restaurant.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h2 className="text-xl font-semibold text-left">
                    <span className="mr-2">{index + 1}.</span>
                    <span className="text-blue-600 hover:text-blue-800">{restaurant.name}</span>
                  </h2>
                  <div className="text-gray-600 text-left">{restaurant.description || "No description available"}</div>
                </div>
              </div>
            </div>
          ))}
          {visibleCount < restaurants.length && (
            <div className="text-center py-4">
              <button
                onClick={handleViewMore}
                className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                View More ({restaurants.length - visibleCount})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RestaurantOverview;

