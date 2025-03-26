import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AddRestaurant from "./AddRestaurant";
import AdminRemoveRestaurants from "./AdminRemoveRestaurant";
import CuisineRestaurants from "./CuisineRestaurants";
import Homepage from "./Homepage";
import Login from "./Login";
import ProfilePage from "./components/ProfilePage";
import RestaurantDetails from "./RestaurantDetails";
import SearchRestaurantDetails from "./SearchRestaurantDetails";
import RestaurantOverview from "./RestaurantOverview";
import SignUp from "./SignUp";
import UpdateRestaurant from "./components/UpdateRestaurant";
import UserRestaurants from "./components/UserRestaurants";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addrestaurant" element={<AddRestaurant />} />
        <Route path="/cuisinerestaurants" element={<CuisineRestaurants />} />
        <Route path="/restaurants" element={<RestaurantOverview />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />
        <Route path="/restaurantdetails" element={<SearchRestaurantDetails />} />
        <Route path="/removerestaurant" element={<AdminRemoveRestaurants />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/updaterestaurant/:id" element={<UpdateRestaurant />} />
        <Route path="/userrestaurants" element={<UserRestaurants />} />

      </Routes>
    </Router>
  );
};

export default App;
