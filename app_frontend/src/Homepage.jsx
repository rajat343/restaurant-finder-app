// App.jsx

import Navbar from "./components/Navbar";
import HomeIntro from "./components/HomeIntro";
import HomeRestaurants from "./components/HomeRestaurants";
import HomeCuisines from "./components/HomeCuisines";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <HomeIntro />
      <div className="container mx-auto p-4 flex-grow">
        <HomeCuisines />
        <HomeRestaurants />
        <Footer />
      </div>
    </div>
  );
}

export default App;
