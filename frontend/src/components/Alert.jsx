import { useState, useEffect } from 'react';
import { IoMdClose, IoMdCheckmarkCircle, IoMdCloseCircle, IoMdWarning, IoMdInformationCircle } from 'react-icons/io';

const Alert = ({
  type = 'toast',
  variant = 'info',
  title,
  message,
  duration = 3000,
  onClose,
  onAccept,
  onCancel,
  show = true
}) => {
  const [visible, setVisible] = useState(show);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setVisible(show);
    setProgress(100);
  }, [show]);

  useEffect(() => {
    if (type === 'toast' && visible) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 50));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [visible, type, duration]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  const handleAccept = () => {
    if (onAccept) onAccept();
    handleClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    handleClose();
  };

  if (!visible) return null;

  const variants = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      progressBg: 'bg-green-500',
      icon: <IoMdCheckmarkCircle className="w-6 h-6 text-green-600" />,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      progressBg: 'bg-red-500',
      icon: <IoMdCloseCircle className="w-6 h-6 text-red-600" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      progressBg: 'bg-yellow-500',
      icon: <IoMdWarning className="w-6 h-6 text-yellow-600" />,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      progressBg: 'bg-blue-500',
      icon: <IoMdInformationCircle className="w-6 h-6 text-blue-600" />,
    },
  };

  const currentVariant = variants[variant];

  if (type === 'toast') {
    return (
      <div className="fixed bottom-22 left-0 right-0 md:top-auto md:bottom-4 md:left-4 md:right-auto md:w-auto z-50 animate-in slide-in-from-bottom md:slide-in-from-left duration-300 font-quicksand md:px-0">
        <div className={`${currentVariant.bg} ${currentVariant.border} border md:rounded-lg shadow-lg md:min-w-100 md:max-w-md overflow-hidden`}>
          <div className="p-3 md:p-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex-shrink-0">
                {currentVariant.icon}
              </div>
              <div className="flex-1">
                {title && (
                  <h3 className={`font-semibold ${currentVariant.text} mb-1 text-sm md:text-base`}>
                    {title}
                  </h3>
                )}
                <p className={`text-xs md:text-sm ${currentVariant.text}`}>
                  {message}
                </p>
              </div>
              <button
                onClick={handleClose}
                className={`flex-shrink-0 ${currentVariant.text} hover:opacity-70 transition-opacity flex items-center justify-center`}
              >
                <IoMdClose className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
          <div className="h-1 bg-gray-200">
            <div
              className={`h-full ${currentVariant.progressBg} transition-all duration-50 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200 font-quicksand">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={handleCancel}
        />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full animate-in zoom-in-95 duration-200">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {currentVariant.icon}
              </div>
              <div className="flex-1">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                  </h3>
                )}
                <p className="text-sm text-gray-600">
                  {message}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Alert;