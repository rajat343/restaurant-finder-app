import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import axios from 'axios';
import { useParams } from "react-router-dom";

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newReview, setNewReview] = useState({
    text: '',
    rating: 0,
    photo: null,
  });

  const { id } = useParams();
  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const response = await axios.get(`http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/restaurants/${id}`);
        const reviewResponse = await axios.get(
          `http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/user_restaurant_intercations/get_user_restaurant_interactions_from_restaurant_id/${id}`,
          { find_query: { restaurant_id: response.data.restaurant._id } }
        );

        setRestaurant({
          ...response.data.restaurant,
          reviews: reviewResponse.data,
        });
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
      }
    };

    fetchRestaurantDetails();
  }, []);

  const nextImage = () => {
    if (restaurant?.photos?.length) {
      setCurrentImageIndex((currentImageIndex + 1) % restaurant.photos.length);
    }
  };

  const prevImage = () => {
    if (restaurant?.photos?.length) {
      setCurrentImageIndex((currentImageIndex - 1 + restaurant.photos.length) % restaurant.photos.length);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    formData.append("folder_name", "review_photos"); // Specify folder for review photos

    try {
      const response = await axios.post("http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/upload", formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedPhotoUrls = response.data.files.map((file) => file.url); // Collect photo URLs
      setNewReview((prev) => ({
        ...prev,
        photo: [...(prev.photo || []), ...uploadedPhotoUrls], // Append new photos to existing
      }));
    } catch (error) {
      console.error("Error uploading photo(s):", error);
      alert("Photo upload failed!");
    }

    e.target.value = ""; // Clear file input field
  };

  const handleSubmitReview = async () => {
    if (!newReview.text || newReview.rating === 0) {
      alert("Please provide a text review and a rating!");
      return;
    }

    const newReviewData = {
      restaurant_id: restaurant._id,
      upsert_query: {
        rating: newReview.rating,
        review: newReview.text,
        review_photos: newReview.photo || [],
      },
    };

    try {
      const token = localStorage.getItem('token'); // Fetch authorization token from localStorage
      await axios.post(
        'http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/user_restaurant_intercations/give_rating',
        newReviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token
          },
        }
      );

      // Clear form and reset state
      setNewReview({ text: '', rating: 0, photo: null });

      // After successfully submitting the review, fetch the updated reviews
      const reviewResponse = await axios.get(
        `http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/user_restaurant_intercations/get_user_restaurant_interactions_from_restaurant_id/${id}`,
        { find_query: { restaurant_id: restaurant._id } }
      );

      // Update the restaurant reviews state with the new review and the existing ones
      setRestaurant((prev) => ({
        ...prev,
        reviews: reviewResponse.data,
      }));
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review!");
    }
  };

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  const averageRating = restaurant.reviews?.length
  ? restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) / restaurant.reviews.length
  : 0;

  return (
    <div className="bg-gray-100 text-gray-800">
      {/* Carousel Section */}
      <div className="relative w-full h-[400px] overflow-hidden">
        {restaurant.photos?.length > 0 ? (
          <>
            <img
              src={restaurant.photos[currentImageIndex]}
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

        {/* Name, Ratings, and Cuisines */}
        <div className="absolute bottom-6 left-0 right-0 max-w-screen-lg mx-auto bg-black bg-opacity-50 text-white p-4 rounded-lg">
          <h1 className="text-5xl font-bold">{restaurant.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-2xl">
            <span className="flex text-yellow-400">
              {'★'.repeat(Math.round(averageRating))}
              {'☆'.repeat(5 - Math.round(averageRating))}
            </span>
            <span>{averageRating}</span>
            <p>({restaurant.reviews?.length || 0} Reviews)</p>
          </div>
          <p className="text-lg mt-2">{restaurant.location.address}, {restaurant.location.city}, {restaurant.location.zipcode}</p>
          <div className="flex flex-wrap gap-4 mt-4">
            {restaurant.cuisines?.length > 0 ? (
              restaurant.cuisines.map((cuisine) => (
                <span
                  key={cuisine.cuisine_id}
                  className="flex items-center text-blue-600 bg-white border border-blue-600 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors duration-200"
                >
                  {cuisine.cuisine_name}
                </span>
              ))
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-lg mx-auto py-6 px-4 flex flex-col md:flex-row gap-6">
        {/* Location & Hours Section */}
        <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-gray-300">
          <h3 className="font-bold text-2xl mb-4">Location & Hours</h3>
          <div className="flex items-center mb-2">
            <FaMapMarkerAlt className="text-gray-600 mr-2" />
            <p>{restaurant.location.address}, {restaurant.location.city}, {restaurant.location.zipcode}</p>
          </div>
          <div className="flex items-center mb-4">
            <FaClock className="text-gray-600 mr-2" />
            <p>{restaurant.hours_active}</p>
          </div>
          <iframe
            title="map"
            src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(`${restaurant.name}, ${restaurant.location.address}`)}&key=AIzaSyDbh4TUoUx0xcA-SuUFawsptvj57ogjnuU`}
            className="w-full h-52 p-2 pr-4"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Write a Review Section */}
        <div className="md:w-1/2">
          <h3 className="font-bold text-2xl mb-4">Write a Review</h3>
          <textarea
            className="w-full h-36 p-2 border border-gray-300 rounded-md mb-4"
            rows="4"
            placeholder="Write your review here..."
            value={newReview.text}
            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
          ></textarea>

          <div className="mb-4 flex flex-col gap-8 md:flex-row justify-between md:items-start">
            <div className="flex flex-col mb-4 md:mb-0">
              <label className="font-bold text-gray-700 mb-1">Rate this restaurant:</label>
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    onClick={() => setNewReview({ ...newReview, rating: index + 1 })}
                    className={`cursor-pointer text-3xl mx-0.5 ${
                      index < newReview.rating ? 'text-yellow-400' : 'text-gray-400'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col w-full md:w-auto">
              <label htmlFor="photoUpload" className="font-bold text-gray-700 mb-1">Upload Photo:</label>
              <input
                id="photoUpload"
                type="file"
                accept="image/*"
                multiple // Allow multiple files
                onChange={handlePhotoUpload}
                className="mb-4"
              />
              <div className="flex flex-wrap gap-2">
                {newReview.photo?.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Uploaded photo ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setNewReview((prev) => ({
                          ...prev,
                          photo: prev.photo.filter((_, i) => i !== index),
                        }))
                      }
                      className="absolute top-1 right-1 border-2 border-white bg-gray-400 text-white rounded-full px-1 text-xs"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmitReview}
            className="bg-blue-600 text-white px-4 py-2 mb-1 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Submit Review
          </button>
        </div>
      </div>

      {restaurant.description && restaurant.reviews?.length > 0 && (
        <hr className="border-gray-300 my-2 max-w-screen-lg mx-auto" />
      )}

      {/* About Section */}
      <div className="max-w-screen-lg mx-auto py-4 px-4 my-4">
        <h3 className="font-bold text-2xl mb-4">About</h3>
        <p className="text-gray-700 text-lg leading-relaxed">
          {restaurant.description}
        </p>
      </div>

      {restaurant.reviews?.length > 0 && (
        <hr className="border-gray-300 my-2 max-w-screen-lg mx-auto" />
      )}

      {/* User Reviews Section */}
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
                <h4 className="font-semibold">
                  {review.user_details?.first_name || "Anonymous"}
                </h4>{" "}
                {/* Display username or fallback to Anonymous */}
                <span className="text-yellow-500 ml-2">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mt-1">{review.review}</p>

              {/* Review Photos */}
              {review.review_photos?.length > 0 && (
                <div className="flex gap-4 mt-3 flex-wrap">
                  {review.review_photos.map((photo, photoIndex) => (
                    <img
                      key={photoIndex}
                      src={photo}
                      alt={`Review photo ${photoIndex + 1}`}
                      className="w-32 h-32 object-cover rounded-md border border-gray-300"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
