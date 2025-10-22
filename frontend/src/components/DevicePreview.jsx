import { useState } from 'react';

const DevicePreview = ({ children, device = 'iphone' }) => {
  if (device === 'iphone') {
    return (
      <div className="flex flex-col items-center gap-4 mb-22">
        <div className="w-[20rem] h-full p-2 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl relative">
          
          <div className="flex-1 h-full rounded-md bg-white overflow-hidden flex flex-col">
            
            <div className="h-3 bg-gray-100 flex items-center justify-between px-1 text-[6px] font-medium text-gray-700">
              <span className='text-[130%]'>9:41</span>
              <div className="flex items-center gap-0.5">
                <div className="w-1 h-2 bg-green-500 rounded-sm"></div>
                <span className='h-2'>100%</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto text-[8px]">
              {children}
            </div>
          </div>
          
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-0.5 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex p-3 flex-col items-center mb-12">
      <div className="w-[40rem] h-full p-3 rounded-lg bg-gradient-to-br from-gray-700 to-gray-800 shadow-2xl">
        
        <div className="w-full h-full rounded-md bg-black p-1">
          
          <div className="w-full h-full rounded-sm bg-white overflow-auto text-[10px]">
            {children}
          </div>
        </div>
        
        <div className="w-6 h-1 bg-gray-600 mx-auto mt-1 rounded-full"></div>
      </div>
    </div>
  );
};

export const DevicePreviewWithSelector = ({ children }) => {
  const [selectedDevice, setSelectedDevice] = useState('iphone');

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setSelectedDevice('iphone')}
          className={`px-3 py-1 rounded-lg font-medium transition-all text-sm ${
            selectedDevice === 'iphone' 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          📱 iPhone
        </button>
        <button
          onClick={() => setSelectedDevice('pc')}
          className={`px-3 py-1 rounded-lg font-medium transition-all text-sm ${
            selectedDevice === 'pc' 
              ? 'bg-green-500 text-white shadow-md' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
        </button>
      </div>

      <DevicePreview device={selectedDevice}>
        {children}
      </DevicePreview>
    </div>
  );
};

export default DevicePreview;