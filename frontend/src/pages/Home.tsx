import React from "react";
import Header from "../components/Header/Header";
import AppointmentBox from "../components/AppointmentBox/AppointmentBox";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Header />
      <AppointmentBox />
    </div>
  );
};

export default Home;
