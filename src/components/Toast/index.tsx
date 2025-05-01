import { useEffect, useState } from "react";

function Toast({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type?: "info" | "error" | "success";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const base =
    "fixed top-6 right-6 px-4 py-2 rounded shadow text-white z-50 transition-all";
  const variants = {
    info: "bg-blue-600",
    success: "bg-green-600",
    error: "bg-red-600",
  };

  return <div className={`${base} ${variants[type]}`}>{message}</div>;
}

export default Toast;
