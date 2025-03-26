import PropTypes from "prop-types";

function ProfileOverview({ userData }) {
  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-gray-600 mb-1">Email</h3>
          <p>{userData.email}</p>
        </div>
        <div>
          <h3 className="text-gray-600 mb-1">Contact</h3>
          <p>{userData.phone}</p>
        </div>
        <div>
          <h3 className="text-gray-600 mb-1">With us since</h3>
          <p>{userData.joinDate}</p>
        </div>
      </div>
    </div>
  );
}

ProfileOverview.propTypes = {
  userData: PropTypes.shape({
    location: PropTypes.string,
    joinDate: PropTypes.string,
  }).isRequired,
};

export default ProfileOverview;
