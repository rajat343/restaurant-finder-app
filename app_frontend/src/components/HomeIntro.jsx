function HomeIntro() {
  return (
    <div
      className="relative h-96 bg-cover bg-center flex items-center justify-start"
      style={{
        backgroundImage:
          "url('https://oceandrive.com/get/files/image/galleries/cozy-dark-mayami.jpg')",
      }}
    >
      <div className="absolute left-4 px-8 py-4 bg-opacity-60 bg-gray-800 text-white rounded-md">
        <h1 className="text-4xl font-bold mb-2">Welcome to FoodieHub</h1>
        <p className="text-md max-w-sm">
          Discover amazing places to eat, find your favorite cuisines, and share
          your experiences with others.
        </p>
      </div>
    </div>
  );
}

export default HomeIntro;
