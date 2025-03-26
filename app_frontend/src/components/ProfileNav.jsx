import PropTypes from "prop-types";

function ProfileNav ({ icon: Icon, label, isActive, onClick }){
        return(
 <li
    onClick={onClick}
    className={`p-3 ${
      isActive ? "bg-gray-100" : "hover:bg-gray-100"
    } rounded-lg cursor-pointer flex items-center gap-3`}
  >
    <Icon />
    <span>{label}</span>
  </li>
        )
}
 

ProfileNav.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ProfileNav;
