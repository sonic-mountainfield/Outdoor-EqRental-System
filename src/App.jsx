import React, { useState } from 'react';
import GearSelection from './components/GearSelection';
import CheckoutForm from './components/CheckoutForm';

export default function App() {
  // 狀態：目前在哪一個步驟 (1: 選擇裝備, 2: 填寫資料)
  const [currentStep, setCurrentStep] = useState(1);
  
  // 狀態：儲存第一頁選好的訂單資料
  const [orderData, setOrderData] = useState(null);

  // 當第一頁按下「下一步」時觸發
  const handleNextStep = (data) => {
    setOrderData(data); // 把第一頁的資料存起來
    setCurrentStep(2);  // 切換到第二頁
  };

  // 當第二頁按下「返回重選」時觸發
  const handleBack = () => {
    setCurrentStep(1);  // 切換回第一頁
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* 簡單的導覽列 */}
      <header className="bg-emerald-600 text-white p-4 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">岳野登山公司</h1>
          <span className="text-sm bg-emerald-700 px-3 py-1 rounded-full">裝備預約系統</span>
        </div>
      </header>

      {/* 根據 currentStep 決定要顯示哪一頁 */}
      <main className="pt-6">
        {currentStep === 1 && (
          <GearSelection onNextStep={handleNextStep} />
        )}
        
        {currentStep === 2 && (
          <CheckoutForm orderData={orderData} onBack={handleBack} />
        )}
      </main>
    </div>
  );
}
