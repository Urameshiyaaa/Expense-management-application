import React, {useEffect} from 'react';
import './Notification.css'

interface Notif {
  message: string;
  onClose: () => void;
}

const NotificationF: React.FC<Notif> = ({message, onClose}) => {
  
  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, 2000);
  }, [onClose]);

  return (
    <div className="fixed top-7 left-69 z-[2006] flex items-center w-full max-w-[333px] p-2 text-gray-500 bg-white rounded-lg shadow-lg animation" >

      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 rounded-lg">
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="red" 
            className="w-8 h-8 text-red-500 hover:text-red-600 cursor-pointer"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <div className="ml-3 text-sm font-normal text-gray-800">{message}</div>
    
    </div>
  );
};

export default NotificationF;