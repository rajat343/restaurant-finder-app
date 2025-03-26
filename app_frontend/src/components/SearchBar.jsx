import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [placesService, setPlacesService] = useState(null);
  const [priceLevel, setPriceLevel] = useState(null); // Price filter (1: $, 2: $$, etc.)
  const [rating, setRating] = useState(null); // Minimum rating filter

  // Initialize the Google PlacesService
  useEffect(() => {
    if (window.google) {
      const mapElement = document.createElement("div");
      const service = new window.google.maps.places.PlacesService(mapElement);
      setPlacesService(service);
    } else {
      console.error("Google Maps JavaScript API is not loaded.");
    }
  }, []);

  // Handle user input
  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    if (input.length >= 2) {
      fetchResults(input);
    } else {
      setResults([]);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  // Fetch results using Google Places API
  const fetchResults = (input) => {
    if (!placesService) return;

    const request = {
      query: input,
      type: "restaurant",
      minPriceLevel: priceLevel || undefined, // Set price filter
      maxPriceLevel: priceLevel || undefined, // Optional: set same level for min/max
    };

    placesService.textSearch(request, (places, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Filter by rating after fetching results
        const filteredResults = places.filter(
          (place) => !rating || place.rating >= rating
        );
        setResults(filteredResults);
      } else {
        console.error("PlacesService search failed: ", status);
      }
    });
  };

  // Handle user preference changes
  const handlePriceChange = (e) => {
    setPriceLevel(Number(e.target.value));
    if (query.length >= 2) fetchResults(query);
  };

  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
    if (query.length >= 2) fetchResults(query);
  };

  // Handle click on a search result
  const handleResultClick = (placeId) => {
    window.location.href = `/restaurantdetails?place_id=${placeId}`;
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Container for Filters and Search */}
      <div className="flex flex-wrap items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center space-x-4">
          <select
            value={priceLevel || ""}
            onChange={handlePriceChange}
            className="p-2 border rounded-md w-full md:w-auto"
          >
            <option value="">All Prices</option>
            <option value="1">$</option>
            <option value="2">$$</option>
            <option value="3">$$$</option>
            <option value="4">$$$$</option>
          </select>

          <select
            value={rating || ""}
            onChange={handleRatingChange}
            className="p-2 border rounded-md w-full md:w-auto"
          >
            <option value="">All Ratings</option>
            <option value="1">1+ stars</option>
            <option value="2">2+ stars</option>
            <option value="3">3+ stars</option>
            <option value="4">4+ stars</option>
            <option value="5">5 stars</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="flex items-center flex-grow min-w-96 bg-white shadow-md rounded-md p-2">
          <button className="p-2">
            <FiSearch className="text-gray-800 text-xl" />
          </button>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search by cuisine, restaurant, or zipcode..."
            className="flex-grow p-2 text-gray-900 focus:outline-none"
          />
          {query && (
            <button className="p-2" onClick={handleClear}>
              <FiX className="text-gray-600 text-xl" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Results */}
      {results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-10">
          {results.map((result) => (
            <div
              key={result.place_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleResultClick(result.place_id)}
            >
              <p className="font-medium">{result.name}</p>
              <p className="text-sm text-gray-500">{result.formatted_address}</p>
              <p className="text-sm text-gray-500">
                {result.price_level ? `$`.repeat(result.price_level) : "N/A"} -{" "}
                {result.rating ? `${result.rating} ⭐` : "No Rating"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
