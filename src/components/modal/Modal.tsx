// Modal.tsx
import React, { ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  closeText?: string;
  title?: string;
  children: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  closeText = "Close",
  title,
  children,
}: Props) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-md p-6 mx-4 bg-white rounded-md shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside modal
          >
            <div className="flex justify-between items-center border-b pb-2">
              {title && <h2 className="text-xl font-semibold">{title}</h2>}
            </div>
            <div className="mt-4">{children}</div>
            <div className="flex justify-end">
              {onClose && (
                <button
                  onClick={onClose}
                  className="mt-4 bg-indigo-500 text-white py-2 px-4 rounded"
                >
                  {closeText}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
