import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const Toast = ({ type = "success", message, duration = 4000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const config = {
    success: {
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500/50",
      textColor: "text-green-200",
      icon: <CheckCircle size={20} className="text-green-400" />,
    },
    error: {
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500/50",
      textColor: "text-red-200",
      icon: <AlertCircle size={20} className="text-red-400" />,
    },
    info: {
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/50",
      textColor: "text-blue-200",
      icon: <Info size={20} className="text-blue-400" />,
    },
  };

  const style = config[type] || config.info;

  return (
    <div className="fixed top-4 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
      <div
        className={`${style.bgColor} border ${style.borderColor} rounded-lg p-4 flex items-center gap-3 backdrop-blur-md max-w-md shadow-lg`}
      >
        {style.icon}
        <p className={`${style.textColor} text-sm flex-1`}>{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
