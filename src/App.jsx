import React, { useState, useEffect } from 'react';
import GearSelection from './components/GearSelection';
import CheckoutForm from './components/CheckoutForm';
import AdminOrders from './components/AdminOrders'; // 引入你的管理員元件

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 初始化時檢查網址參數
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const handleNextStep = (data) => {
    setOrderData(data);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  // 如果是管理員模式，直接顯示後台
  if (isAdmin) {
    return <AdminOrders />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-emerald-600 text-white p-4 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">岳野登山公司</h1>
          <span className="text-sm bg-emerald-700 px-3 py-1 rounded-full">裝備預約系統</span>
        </div>
      </header>

      <main className="pt-6">
        {currentStep === 1 && <GearSelection onNextStep={handleNextStep} />}
        {currentStep === 2 && <CheckoutForm orderData={orderData} onBack={handleBack} />}
      </main>
    </div>
  );
}
