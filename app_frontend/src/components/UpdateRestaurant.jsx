
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateRestaurant = () => {
    const { id } = useParams(); // Get restaurant ID from route
    const navigate = useNavigate(); // To navigate after update

    const [restaurantData, setRestaurantData] = useState({
        name: "",
        description: "",
        contact_info: { p_n: "", email: "" },
        location: { address: "", zipcode: "", city: "" },
        type_of_food: { is_veg: false, is_non_veg: false },
        hours_active: "",
        photos: [],
        restaurant_average_price: 'LOW',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch previous restaurant data on page load
    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await axios.get(
                    `http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/restaurants/${id}`
                );
                setRestaurantData(response.data.restaurant);
            } catch (err) {
                setError("Error fetching restaurant data");
            }
        };
        fetchRestaurant();
    }, [id]);

    const handleDeleteImage = (imageUrl) => {
    setRestaurantData((prev) => ({
        ...prev,
        photos: prev.photos.filter((photo) => photo !== imageUrl), // Remove the selected photo
    }));
    setSuccess("Image removed successfully!");
};

    const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) {
            alert("No files selected!");
            return;
        }
        const formDataToSubmit = new FormData();

        files.forEach((file) => {
            formDataToSubmit.append("files", file);
        });

        const folderName = "restaurants"; // Replace this with the actual folder name
        formDataToSubmit.append("folder_name", folderName);

        try {
            const response = await axios.post(
                "http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/upload",
                formDataToSubmit,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const uploadedPhotos = response.data.files.map((file) => file.url);

            // Update the photos in restaurantData
            setRestaurantData((prev) => ({
                ...prev,
                photos: [...prev.photos, ...uploadedPhotos],
            }));
            setSuccess("Photos uploaded successfully!");
        } catch (error) {
            console.error("Error uploading photos:", error);
            alert("Failed to upload photos");
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setRestaurantData((prev) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setRestaurantData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle checkbox change
    const handleCheckboxChange = (field) => {
        setRestaurantData((prev) => ({
            ...prev,
            type_of_food: {
                ...prev.type_of_food,
                [field]: !prev.type_of_food[field],
            },
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                "http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/restaurants/update_restaurant",
                {
                    restaurant_id: id,
                    update_query: restaurantData,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess("Restaurant updated successfully!");
            setTimeout(() => navigate("/userrestaurants"), 2000); // Redirect after success
        } catch (err) {
            setError("Failed to update restaurant. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Update Restaurant</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <form
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto bg-white shadow-md p-6 rounded-md"
            >
                {/* Name */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={restaurantData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={restaurantData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    ></textarea>
                </div>

                {restaurantData?.contact_info && (
                    <div className="mb-4">
                        <label className="block font-medium mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="contact_info.p_n"
                            value={restaurantData.contact_info.p_n}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="contact_info.email"
                        value={restaurantData.contact_info?.email || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Location */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Address</label>
                    <input
                        type="text"
                        name="location.address"
                        value={restaurantData.location?.address || ''}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block font-medium mb-1">City</label>
                        <input
                            type="text"
                            name="location.city"
                            value={restaurantData.location?.city || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block font-medium mb-1">Zipcode</label>
                        <input
                            type="text"
                            name="location.zipcode"
                            value={restaurantData.location?.zipcode || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* Hours Active */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Hours Active</label>
                    <input
                        type="text"
                        name="hours_active"
                        value={restaurantData.hours_active}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Restaurant Average Price</label>
                    <select
                        name="restaurant_average_price"
                        value={restaurantData.restaurant_average_price}
                        onChange={handleChange}
                        style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                        }}
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="PREMIUM">Premium</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Upload Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={handlePhotoUpload}
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Display Current Images */}
                <div className="grid grid-cols-2 gap-4">
                    {restaurantData.photos.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={image}
                                alt={`Restaurant image ${index + 1}`}
                                className="w-full h-40 object-cover rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteImage(image)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                {/* Food Type */}
                <div className="mb-4 flex gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={restaurantData.type_of_food?.is_veg || ''}
                            onChange={() => handleCheckboxChange("is_veg")}
                        />
                        Vegetarian
                    </label>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={restaurantData.type_of_food?.is_non_veg || ''}
                            onChange={() => handleCheckboxChange("is_non_veg")}
                        />
                        Non-Vegetarian
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Restaurant"}
                </button>
            </form>
        </div>
        </>
    );
};

export default UpdateRestaurant;
