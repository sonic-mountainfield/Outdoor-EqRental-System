import React, { useState, useEffect } from 'react';
import GearSelection from './components/GearSelection';
import CheckoutForm from './components/CheckoutForm';
import AdminOrders from './components/AdminOrders';
import FittingForm from './components/FittingForm'; // 新增：引入試穿與合約表單

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState(null);
  
  // 我們將 isAdmin 改為 appMode，這樣可以管理更多種後台模式
  // 預設為 'customer' (顧客端)，其他還有 'admin' (訂單後台), 'fitting' (現場試穿)
  const [appMode, setAppMode] = useState('customer'); 

  // 初始化時檢查網址參數
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    
    if (mode === 'admin') {
      setAppMode('admin');
    } else if (mode === 'fitting') {
      setAppMode('fitting');
    }
  }, []);

  const handleNextStep = (data) => {
    setOrderData(data);
    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  // --- 畫面渲染邏輯 ---

  // 1. 如果是管理員訂單模式
  if (appMode === 'admin') {
    return <AdminOrders />;
  }

  // 2. 如果是現場試穿與合約列印模式
  if (appMode === 'fitting') {
    return <FittingForm />;
  }

  // 3. 預設模式：一般顧客預約流程
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
