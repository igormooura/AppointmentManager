import Background from '@/components/Background/Background';
import UserBox from '@/components/Boxes/UserBox';
import Header from '@/components/Header/Header';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const UserPage = () => {
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (!storedEmail) {
      navigate("/login"); 
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  if (!email) return <div>Loading...</div>;

  return (
    <Background>
      <Header />
      <UserBox email={email} />
    </Background>
  );
};

export default UserPage;
