import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CuisineRestaurants() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(5);
  const [restaurants, setRestaurants] = useState([]);
  const [cuisineName, setCuisineName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const cuisineName = location.state?.cuisineName;
        const cuisineId = location.state?.cuisineId;

        if (!cuisineId) {
          throw new Error("Cuisine ID is missing");
        }

        const response = await fetch(
          "http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/restaurants/get_restaurants_from_cuisine",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cuisine_id_arr: [cuisineId]
            }),
          }
        );

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const data = await response.json();
        setRestaurants(data);
        setCuisineName(cuisineName);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [location.state]);

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, restaurants.length));
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Loading Restaurants...
        </h2>
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
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700 transition-all"
      >
        ← Back
      </button>

      {/* Title */}
      {cuisineName && (
        <h1 className="text-2xl font-bold mb-6 text-center">
          {cuisineName} Restaurants
        </h1>
      )}

      {/* No Restaurants Found */}
      {restaurants.length === 0 ? (
        <div className="text-center text-gray-600 text-xl">
          No restaurants found for this cuisine.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Restaurants List */}
          {restaurants.slice(0, visibleCount).map((restaurant) => (
            <div
              key={restaurant._id}
              onClick={() => navigate(`/restaurants/${restaurant._id}`)} // Navigate on click
              className="border-b border-gray-300 p-4 mb-4 bg-white shadow-sm shadow-gray-300 rounded-lg cursor-pointer"
            >
              <div className="flex gap-4">
                {/* Left side - Image */}
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

                {/* Right side - Content */}
                <div className="flex-grow min-w-0">
                  <div className="mb-2">
                    <h2 className="text-xl font-semibold text-left text-blue-600 hover:text-blue-800">
                      {restaurant.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    {/* Food type information */}
                    <span className="font-medium">
                      {restaurant.type_of_food
                        ? restaurant.type_of_food.is_veg &&
                          restaurant.type_of_food.is_non_veg
                          ? "Veg & Non-Veg"
                          : restaurant.type_of_food.is_veg
                          ? "Vegetarian"
                          : "Non-Vegetarian"
                        : "No food type info"}
                    </span>

                    {/* Location information */}
                    {restaurant.location && (
                      <span className="flex items-center">
                        <span className="mx-1">•</span>
                        {restaurant.location.address}, {restaurant.location.city}, {restaurant.location.zipcode}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="text-gray-600 text-left">
                    {restaurant.description || "No description available"}
                  </div>

                  {/* Hours */}
                  {restaurant.hours_active && (
                    <div className="text-sm text-gray-500 mt-2">
                      Hours: {restaurant.hours_active}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* View More Button */}
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

export default CuisineRestaurants;
