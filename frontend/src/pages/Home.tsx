import React from "react";
import Header from "../components/Header/Header";
import AppointmentBox from "../components/Boxes/AppointmentBox";
import Background from "@/components/Background/Background";

const Home: React.FC = () => {
  return (
   <Background>
      <Header />
      <AppointmentBox />
   </Background>

  );
};

export default Home;
