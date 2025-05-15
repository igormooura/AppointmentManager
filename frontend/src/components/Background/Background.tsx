import { ReactNode } from 'react';

const Background = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {children}
    </div>
  );
};

export default Background;
