import PropTypes from "prop-types";

function RestaurantCard({
  name,
  cuisines,
  image,
  rating,
  address,
  zipcode,
  description,
  onClick
}) {
  return (
    
    <div  onClick={onClick} // Trigger navigation when the card is clicked
      className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow w-60 h-auto flex-shrink-0">
      <img src={image} alt={name} className="w-full h-32 object-cover" />

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{name}</h3>
        <p>
            {cuisines && cuisines.length > 0
                ? cuisines.map((cuisine) => cuisine.cuisine_name).join(', ')
                : ''}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-yellow-500 font-semibold">{rating} ★</span>
        </div>
        <p className="text-gray-600 mt-2 text-sm line-clamp-3">{description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-500 text-sm">{address},{zipcode}</span>
        </div>
      </div>
    </div>
  );
}

RestaurantCard.propTypes = {
  name: PropTypes.string.isRequired,
  cuisines: PropTypes.array,
  image: PropTypes.string.isRequired,
  rating: PropTypes.number,
  address: PropTypes.string.isRequired,
  zipcode: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default RestaurantCard;
