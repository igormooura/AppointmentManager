const WaitingConfirmationPopUp = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black opacity-70">
      <div className=" h-[200px] bg-gray-400 w-[525px] rounded-md">
        <div className="flex justify-center items-center">
            <p className=" text-white font-light "> Waiting confirmation from admin...</p>
        </div>
      </div>
    </div>
  );
};

export default WaitingConfirmationPopUp;
