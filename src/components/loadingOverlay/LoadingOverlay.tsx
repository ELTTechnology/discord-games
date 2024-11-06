import React from "react";
import { LoadingSquares } from "@/animations/LoadingSquares";

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
            <LoadingSquares styles="h-[200px]" speed={2} />
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
