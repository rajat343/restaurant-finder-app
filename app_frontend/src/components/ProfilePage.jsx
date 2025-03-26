import { ProfileIcons } from "./ProfileIcons";
import ProfileNav from "./ProfileNav";
import ProfileOverview from "./ProfileOverview";
import UserReviews from "./UserReviews";
import UserRestaurants from "./UserRestaurants";

import axios from "axios";
import { useState, useEffect } from "react";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Fetch authorization token
        const userId = localStorage.getItem("userId"); // Fetch the user id
        const response = await axios.get(
          `http://cmpe-sjsu-lb-1470530135.us-west-1.elb.amazonaws.com:3001/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token
            },
          }
        );
        const user = response.data;

        // Parse the createdAt string
        const joinDate = user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })
          : "Date unavailable";

        setUserData({
          name: `${user.first_name} ${user.last_name}`,
          email: `${user.email}`,
          phone: `${user.p_n}`,
          joinDate,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const CONTENT_COMPONENTS = {
    profile: userData && <ProfileOverview userData={userData} />,
    reviews: <UserReviews />,
    userRestaurants: <UserRestaurants />,
  };

  const NAV_ITEMS = [
    { id: "profile", label: "Profile overview", icon: ProfileIcons.User },
    { id: "reviews", label: "My Reviews", icon: ProfileIcons.Star },
    { id: "userRestaurants", label: "My Restaurants", icon: ProfileIcons.Restaurant },
  ];

  if (isLoading) {
    return <div className="max-w-6xl mx-auto p-8 bg-white">Loading...</div>;
  }

  if (error) {
    return <div className="max-w-6xl mx-auto p-8 bg-white">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 rounded-2xl border-2 border-slate-100 p-4">
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
              <ProfileIcons.User />
            </div>
            <h1 className="text-2xl font-bold mb-2">{userData.name}</h1>
            <p className="text-gray-500 mb-6">Joined: {userData.joinDate}</p>
            <div className="flex gap-4 mb-8">
            <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                <ProfileIcons.Camera />
              </div>
              <span className="text-sm text-gray-600">Add Photo</span>
            </button>
            </div>
            <nav className="w-full">
              <ul className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <ProfileNav
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                  />
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className="md:col-span-2">{CONTENT_COMPONENTS[activeTab]}</div>
      </div>
    </div>
  );
}

export default ProfilePage;
