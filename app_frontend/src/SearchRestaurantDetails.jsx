import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

const SearchRestaurantDetails = () => {
    const [restaurant, setRestaurant] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [searchParams] = useSearchParams();
    const placeId = searchParams.get("place_id");

    useEffect(() => {
        if (!placeId || !window.google) return;

        const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
        );

        const request = {
        placeId: placeId,
        fields: [
            "name",
            "formatted_address",
            "rating",
            "photos",
            "opening_hours",
            "reviews",
        ],
        };

        service.getDetails(request, (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setRestaurant(result);
        } else {
            console.error("Failed to fetch details:", status);
        }
        });
    }, [placeId]);

    if (!restaurant) {
        return <div>Loading...</div>;
    }

    const averageRating = restaurant.rating || 0;
    const nextImage = () => {
        if (restaurant.photos?.length) {
        setCurrentImageIndex((currentImageIndex + 1) % restaurant.photos.length);
        }
    };

    const prevImage = () => {
        if (restaurant.photos?.length) {
        setCurrentImageIndex((currentImageIndex - 1 + restaurant.photos.length) % restaurant.photos.length);
        }
    };

    return (
        <div className="bg-gray-100 text-gray-800">
        {/* Carousel Section */}
        <div className="relative w-full h-[400px] overflow-hidden">
            {restaurant.photos?.length > 0 ? (
            <>
                <img
                src={restaurant.photos[currentImageIndex].getUrl()}
                alt={`Restaurant ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                />
                <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white rounded-full p-2"
                >
                <FaChevronLeft />
                </button>
                <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white rounded-full p-2"
                >
                <FaChevronRight />
                </button>
            </>
            ) : (
            <div className="w-full h-full flex justify-center items-center bg-gray-200">
                <p>No images available</p>
            </div>
            )}

            {/* Name, Ratings, and Address */}
            <div className="absolute bottom-6 left-0 right-0 max-w-screen-lg mx-auto bg-black bg-opacity-50 text-white p-4 rounded-lg">
            <h1 className="text-5xl font-bold">{restaurant.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-2xl">
                <span className="flex text-yellow-400">
                {"★".repeat(Math.round(averageRating))}
                {"☆".repeat(5 - Math.round(averageRating))}
                </span>
                <span>{averageRating}</span>
            </div>
            <p className="text-lg mt-2">{restaurant.formatted_address}</p>
            </div>
        </div>

        <div className="max-w-screen-lg mx-auto py-6 px-4 flex flex-col md:flex-row gap-6">
            {/* Location & Hours Section */}
            <div className="md:w-2/3 border-b md:border-b-0 md:border-r border-gray-300">
                <h3 className="font-bold text-2xl mb-4">Location</h3>
                <div className="flex items-center mb-2">
                    <FaMapMarkerAlt className="text-gray-600 mr-2" />
                    <p>{restaurant.formatted_address}</p>
            </div>
            <iframe
                title="map"
                src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
                restaurant.name
                )}&key=AIzaSyDbh4TUoUx0xcA-SuUFawsptvj57ogjnuU`}
                className="w-full h-52 p-2 pr-4"
                allowFullScreen=""
                loading="lazy"
            ></iframe>
            </div>

            <div className="md:w-1/3 border-b md:border-b-0 border-gray-300">
                <h3 className="font-bold text-2xl mb-4">Hours</h3>
                {restaurant.opening_hours && (
                    <div className="flex items-center mb-4">
                
                    <ul>
                        {restaurant.opening_hours.weekday_text.map((day, index) => (
                        <li key={index}>{day}</li>
                        ))}
                    </ul>
                    </div>
                )}
            </div>
        </div>

        <hr className="border-gray-300 my-2 max-w-screen-lg mx-auto" />

        {/* Reviews Section */}
        {restaurant.reviews?.length > 0 && (
            <div className="max-w-screen-lg mx-auto py-4 px-4 my-4">
            <h3 className="font-bold text-2xl mb-4">User Reviews</h3>
            {restaurant.reviews?.map((review, index) => (
                <div
                key={index}
                className="border-b border-gray-300 p-4 mb-4 bg-white shadow-sm shadow-gray-300 rounded-lg"
                >
                {/* User Details and Rating */}
                <div className="flex items-center">
                    <h4 className="font-semibold">{review.author_name || "Anonymous"}</h4>
                    <span className="text-yellow-500 ml-2">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                    </span>
                </div>

                {/* Review Text */}
                <p className="text-gray-700 mt-1">{review.text}</p>
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default SearchRestaurantDetails;
