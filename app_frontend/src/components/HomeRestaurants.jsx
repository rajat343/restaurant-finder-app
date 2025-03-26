import { useRef, useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { useNavigate } from "react-router-dom";


function HomeRestaurants() {

  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setError(null);

        const response = await fetch(
          "http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/restaurants/get_restaurants",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Fetch error details:', {
            status: response.status,
            statusText: response.statusText,
            body: errorBody
          });
          throw new Error(
            `HTTP error! status: ${response.status}, body: ${errorBody}`
          );
        }

        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } 
    };

    fetchRestaurants();
  }, [location.state]);

  const scrollRef = useRef(null);

 const handleCardClick = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}`); // Navigate to restaurant details page
  };

  // Scroll functions
  function scrollLeft() {
    scrollRef.current.scrollBy({
      left: -600,
      behavior: "smooth",
    });
  }

  function scrollRight() {
    scrollRef.current.scrollBy({
      left: 600,
      behavior: "smooth",
    });
  }

  const handleViewMore = () => {
    navigate("/restaurants", {
      state: { cuisineId: null, cuisineName: "All Restaurants" }, // Pass necessary data here
    });
  };
  const limitedRestaurants = restaurants.slice(0, 8);

  return (
    <div className="mt-24 relative">
      <h2 className="text-3xl font-semibold text-gray-800 mb-12 text-center">
        Explore Restaurants
      </h2>
      <div className="flex items-center">
        {/* Left arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 p-2 bg-white shadow-md rounded-full ml-2"
        >
          &larr;
        </button>

        <div
          ref={scrollRef}
          key={restaurants._id}
          className="flex overflow-x-auto pb-4 mx-12 space-x-8 no-scrollbar scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {limitedRestaurants.map((restaurant, index) => (
            <RestaurantCard
              key={index}
              name={restaurant.name}
              cuisines={restaurant.cuisines}
              image={restaurant.photos[0]}
              rating={restaurant.avg_rating}
              address = {restaurant.location.address}
              zipcode={restaurant.location.zipcode}
              description={restaurant.description}
              onClick={() => handleCardClick(restaurant._id)}
            />
          ))}

          <div className="text-center mt-28">
        <button
          onClick={handleViewMore}
          className="bg-blue-800 text-white hover:bg-blue-900 px-4 py-2 rounded-md font-medium transition-colors"
        >
          View More Restaurants
        </button>
      </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 p-2 bg-white shadow-md rounded-full mr-2"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}

export default HomeRestaurants;


