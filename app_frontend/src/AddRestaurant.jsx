import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddRestaurant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      zipcode: ''
    },
    cuisines: [],
    typeOfFood: {
      is_veg: false,
      is_non_veg: false
    },
    photos: [],
    hours_active: '',
    contact_info: {
      p_n: '',
      email: ''
    },
    restaurant_average_price: 'LOW',
    average_price_for_2: 10
    
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCuisines, setAvailableCuisines] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await axios.get('http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/cuisines/get_cuisines');
        setAvailableCuisines(response.data);
      } catch (error) {
        console.error('Error fetching cuisines:', error);
        alert('Failed to fetch cuisines');
      }
    };

    fetchCuisines();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleCuisineChange = (cuisineId, cuisineName) => {
    setFormData(prev => {
      // Check if the cuisine already exists in the array
      const isSelected = prev.cuisines.some(c => c._id === cuisineId);

      if (isSelected) {
        // Remove the cuisine if it exists
        return {
          ...prev,
          cuisines: prev.cuisines.filter(c => c._id !== cuisineId),
        };
      } else {
        // Add the cuisine if it does not exist
        return {
          ...prev,
          cuisines: [...prev.cuisines, { _id: cuisineId, name: cuisineName }],
        };
      }
    });
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
    alert("No files selected!");
    return;
  }
    const formDataToSubmit = new FormData();

    files.forEach((file) => {
      formDataToSubmit.append('files', file);
    });

    const folderName = "restaurants"; // Replace this with the actual folder name you want
    formDataToSubmit.append("folder_name", folderName);

    try {
      const response = await axios.post('http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/upload', formDataToSubmit, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Full upload response:', response);

      // On successful upload, update the photos state with URLs
      const uploadedPhotos = response.data.files.map(file => file.url);
      console.log('Uploaded photo URLs:', uploadedPhotos);
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...uploadedPhotos]
      }));
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Failed to upload photos');
  

    }
  };
  const removePhoto = (indexToRemove) => {
    // Remove from preview files
    const updatedPhotoFiles = photoFiles.filter((_, index) => index !== indexToRemove);
    setPhotoFiles(updatedPhotoFiles);

    // Remove from uploaded photo URLs
    const updatedPhotos = formData.photos.filter((_, index) => index !== indexToRemove);
    setFormData(prev => ({
      ...prev,
      photos: updatedPhotos
    }));
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Restaurant name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.location.address) newErrors.address = 'Address is required';
    if (!formData.location.city) newErrors.city = 'City is required';
    if (!formData.location.zipcode) newErrors.zipcode = 'Zipcode is required';
    if (!formData.contact_info.p_n) newErrors.phone = 'Phone number is required';
    if (!formData.contact_info.email) newErrors.email = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        contact_info: {
          p_n: formData.contact_info.p_n,
          email: formData.contact_info.email,
        },
        location: {
          address: formData.location.address,
          zipcode: formData.location.zipcode,
          city: formData.location.city,
        },
        type_of_food: {
          is_veg: formData.typeOfFood.is_veg,
          is_non_veg: formData.typeOfFood.is_non_veg,
        },
        name: formData.name,
        description: formData.description,
        hours_active: formData.hours_active,
        restaurant_average_price: formData.restaurant_average_price,
        average_price_for_2: formData.average_price_for_2,
        cuisines: formData.cuisines.map(cuisine => ({
          cuisine_id: cuisine._id,
          cuisine_name: cuisine.name,
        })),
        photos: formData.photos,
      };

      const response = await axios.post('http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/restaurants/create_restaurant', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(payload);

      // Reset form
      setFormData({
        name: '',
        description: '',
        location: { address: '', city: '', zipcode: '' },
        cuisines: [],
        typeOfFood: { is_veg: false, is_non_veg: false },
        photos: [],
        hours_active: '',
        contact_info: { p_n: '', email: '' },
        restaurant_average_price: 'LOW',
        average_price_for_2: ''
      });

      alert('Restaurant created successfully!');
      setTimeout(() => navigate("/userrestaurants"), 1000);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      alert(`Failed to create restaurant: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Create Restaurant</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Restaurant Name */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Restaurant Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Enter restaurant name"
          />
          {errors.name && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minHeight: '100px',
            }}
            placeholder="Brief restaurant description"
          />
          {errors.description && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.description}</p>}
        </div>

        {/* Address */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Address</label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Street address"
            />
            {errors.address && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.address}</p>}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>City</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="City"
            />
            {errors.city && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.city}</p>}
          </div>
        </div>

        {/* Zipcode */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Zipcode</label>
          <input
            type="text"
            name="location.zipcode"
            value={formData.location.zipcode}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Zipcode"
          />
          {errors.zipcode && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.zipcode}</p>}
        </div>

                {/* Contact Info */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Phone Number</label>
          <input
            type="text"
            name="contact_info.p_n"
            value={formData.contact_info.p_n}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Phone number"
          />
          {errors.phone && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.phone}</p>}
        </div>

                <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            name="contact_info.email"
            value={formData.contact_info.email}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="Email address"
          />
          {errors.email && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Cuisines</label>
          <div className="grid grid-cols-3 gap-3">
            {availableCuisines.map(cuisine => (
              <div key={cuisine._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`cuisine-${cuisine._id}`}
                  checked={formData.cuisines.some(c => c._id === cuisine._id)}
                  onChange={() => handleCuisineChange(cuisine._id, cuisine.name)}
                  className="mr-2 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor={`cuisine-${cuisine._id}`} className="text-gray-700">
                  {cuisine.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Upload Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.photos.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {formData.photos.map((photoUrl, index) => (
                <div key={index} className="relative">
                  <img 
                    src={photoUrl} 
                    alt={`Restaurant preview ${index + 1}`} 
                    className="w-32 h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 border-2 border-white bg-gray-400 text-white rounded-full px-1 text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hours */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Operating Hours</label>
          <input
            type="text"
            name="hours_active"
            value={formData.hours_active}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            placeholder="e.g. 9 AM - 9 PM"
          />
          {errors.hours_active && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.hours_active}</p>}
        </div>


        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Restaurant Average Price</label>
          <select
            name="restaurant_average_price"
            value={formData.restaurant_average_price}
            onChange={handleInputChange}
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

        {/* Average Price for 2 */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Average Price for 2</label>
          <input
            type="number"
            name="average_price_for_2"
            value={formData.average_price_for_2}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="Enter average price for 2"
          />
          {errors.average_price_for_2 && (
            <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.average_price_for_2}</p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Create Restaurant'}
          </button>
        </div>
      </form>
    </div>
    
  );
};

export default AddRestaurant;
