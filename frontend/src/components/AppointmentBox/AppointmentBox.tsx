import { Calendar } from "@/components/ui/calendar";
import React from "react";

const AppointmentBox = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="max-w-[1240px] mx-auto px-4 flex justify-center items-center">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-5xl 
                      h-[650px] sm:h-[550px] md:h-[600px] lg:h-[650px] bg-gray-200 shadow-xl flex flex-col p-4 my-4 rounded-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>
    </div>
  );
};

export default AppointmentBox;
