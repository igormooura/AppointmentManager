const WaitingConfirmationPopUp = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
      <div className="h-[200px] bg-gray-700 w-[525px] rounded-md flex flex-col justify-center items-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
        <p className="text-white font-light text-xl">
          Waiting confirmation from admin...
        </p>
      </div>
    </div>
  );
};

export default WaitingConfirmationPopUp;
