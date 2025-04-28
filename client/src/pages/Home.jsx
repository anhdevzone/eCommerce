import React from "react";

const Home = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-6">
      <div className="col-span-5">1</div>
      <div className="col-span-2 row-start-2">2</div>
      <div className="col-span-3 col-start-3 row-start-2">3</div>
      <div className="col-span-5 row-start-3">4</div> 
      <div className="col-span-2 row-start-4">5</div>
      <div className="col-span-3 col-start-3 row-start-4">6</div>
      <div className="col-span-2 row-start-5">7</div>
      <div className="col-span-3 col-start-3 row-start-5">8</div>
    </div>
  );
};

export default Home;
