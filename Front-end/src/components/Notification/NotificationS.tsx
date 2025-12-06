import React, {useEffect} from 'react';
import './Notification.css'

interface Notif {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<Notif> = ({message, onClose}) => {
  
  useEffect(() => {
      setTimeout(() => {
        onClose();
      }, 2000);
    }, [onClose]);

  return (
    <div className="fixed top-7 left-69 z-[2006] flex items-center w-full max-w-[222px] p-2 text-gray-500 bg-white rounded-lg shadow-lg animation" >

      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 rounded-lg">
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
        </svg>
      </div>
      
      <div className="ml-3 text-sm font-normal text-gray-800">{message}</div>
    
    </div>
  );
};

export default Notification;