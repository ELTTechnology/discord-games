import React from "react";
import animationData from "@/assets/loading_squares.json";
import Lottie from "lottie-react";

interface Props {
  loadingText?: string;
  isOpen: boolean;
}

export const LoadingOverlay = ({ loadingText, isOpen }: Props) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div>
            <Lottie
              className="h-[200px]"
              animationData={animationData}
              loop={true}
            />
            {loadingText && (
              <div className="p-3 text-center text-white text-xl -translate-y-16">
                {loadingText}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
