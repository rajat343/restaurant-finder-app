import axios from "axios";
import { useState, useEffect } from "react";

function UserReviews() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/user_restaurant_intercations/get_user_restaurant_interactions_from_user_id",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews.");
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-600">You haven't submitted any reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li
              key={review._id}
              className="mb-4 bg-white shadow-sm shadow-gray-300 rounded-lg p-4 border border-gray-200"
            >
              <h3 className="text-lg font-semibold">
                <a
                  href={`/restaurants/${review.restaurant_id}`}
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {review.restaurant_details.name}
                </a>
              </h3>
              <div className="text-gray-700 my-2 flex items-center">
                <strong className="text-gray-700">Rating:</strong>
                <span className="text-yellow-500 ml-2">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </span>
              </div>
              <p className="text-sm text-gray-500 my-3">{review.review}</p>
              {review.review_photos && review.review_photos.length > 0 && (
                <div className="flex gap-2">
                  {review.review_photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Review ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">
                Reviewed on:{" "}
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserReviews;
