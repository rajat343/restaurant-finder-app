import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomeCuisines() {
  const [cuisines, setCuisines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch('http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/cuisines/get_cuisines');
        if (!response.ok) {
          throw new Error('Failed to fetch cuisines');
        }
        const data = await response.json();
        setCuisines(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCuisines();
  }, []);

  
  const handleCuisineClick = (cuisine) => {
    navigate("/cuisinerestaurants", { 
      state: { 
        cuisineName: cuisine.name, 
        cuisineId: cuisine._id  
      } 
    });
  };

  // Scroll left
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-12">
          Loading Cuisines...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-semibold text-red-600 mb-12">
          Error: {error}
        </h2>
      </div>
    );
  }

  return (
    <div className="relative mt-16">
      <h2 className="text-3xl font-semibold text-gray-800 mb-12 text-center">
        Explore Cuisines
      </h2>
      <div className="flex items-center">
        {/* Left arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 p-3 bg-white shadow-md rounded-full ml-2 hover:bg-gray-100 transition-all text-gray-600 hover:text-gray-800 hover:shadow-lg"
        >
          ←
        </button>

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-4 mx-12 space-x-8 no-scrollbar scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {cuisines.map((cuisine) => (
            <div
              key={cuisine._id}
              onClick={() => handleCuisineClick(cuisine)}
              className="cursor-pointer bg-white shadow-md p-4 rounded-lg w-60 flex-shrink-0 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="overflow-hidden rounded-t-md">
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  className="w-full h-32 object-cover rounded-t-md hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="mt-2 font-bold text-lg text-gray-800 text-center">
                {cuisine.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1 text-center">
                {cuisine.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 p-3 bg-white shadow-md rounded-full mr-2 hover:bg-gray-100 transition-all text-gray-600 hover:text-gray-800 hover:shadow-lg"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default HomeCuisines;