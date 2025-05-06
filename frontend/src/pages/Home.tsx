import React from 'react';
import Header from '../components/Header/Header';
import AppointmentBox from '../components/AppointmentBox/AppointmentBox';

const Home: React.FC = () => {
    return (
        <div>
            <Header/>
            <AppointmentBox/>
        </div>
    );
};

export default Home;