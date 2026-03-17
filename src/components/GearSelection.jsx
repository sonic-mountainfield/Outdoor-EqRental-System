import React, { useState } from 'react';

// 裝備資料清單 (包含真實圖片網址)
const GEAR_ITEMS = [
  { id: 1, name: '背包套', image: 'https://images.unsplash.com/photo-1621245785055-635b54ff52ff?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: '雨衣', image: 'https://images.unsplash.com/photo-1620921430046-e5758b902e5b?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: '雨褲', image: 'https://images.unsplash.com/photo-1616086749968-3e4b7b514e66?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: '羽絨外套', image: 'https://images.unsplash.com/photo-1611036069925-5421c4b81c7f?q=80&w=600&auto=format&fit=crop' },
  { id: 5, name: '大背包', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop' },
  { id: 6, name: '登山杖', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop' },
  { id: 7, name: '綁腿', image: 'https://images.unsplash.com/photo-1617188151246-8149f1f008f1?q=80&w=600&auto=format&fit=crop' },
  { id: 8, name: '頭燈(附電池)', image: 'https://images.unsplash.com/photo-1613149495116-36869e5d4a4d?q=80&w=600&auto=format&fit=crop' },
  { id: 9, name: '登山鞋', image: 'https://images.unsplash.com/photo-1520639889313-7272af179a61?q=80&w=600&auto=format&fit=crop' },
];

export default function GearSelection({ onNextStep }) {
  // 狀態：目前選擇的方案 (adult9, child9, adult7)
  const [selectedPlan, setSelectedPlan] = useState(null);
  // 狀態：自由選的裝備 ID 清單
  const [selectedGears, setSelectedGears] = useState([]);
  // 狀態：警告訊息
  const [warningMsg, setWarningMsg] = useState('');

  // 處理方案點擊
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setWarningMsg('');
    // 如果切換方案，清空已選裝備
    if (plan !== 'adult7') {
      setSelectedGears([]);
    }
  };

  // 處理裝備點擊 (僅在 adult7 方案下有效)
  const toggleGear = (gearId) => {
    if (selectedPlan !== 'adult7') return;

    if (selectedGears.includes(gearId)) {
      // 取消選取
      setSelectedGears(selectedGears.filter(id => id !== gearId));
      setWarningMsg('');
    } else {
      // 新增選取
      if (selectedGears.length >= 7) {
        setWarningMsg('⚠️ 只能選擇 7 件，請先取消其他裝備');
        return;
      }
      setSelectedGears([...selectedGears, gearId]);
    }
  };

  // 判斷是否可以進入下一步
  const canGoNext = 
    selectedPlan === 'adult9' || 
    selectedPlan === 'child9' || 
    (selectedPlan === 'adult7' && selectedGears.length === 7);

  // 當按下下一步時，將資料整理好傳給上一層 (或跳轉頁面)
  const handleNext = () => {
    if (!canGoNext) return;
    const orderData = {
      plan: selectedPlan,
      gears: selectedPlan === 'adult7' ? selectedGears : GEAR_ITEMS.map(g => g.id),
      price: selectedPlan === 'adult9' ? 4000 : selectedPlan === 'child9' ? 3500 : 3000
    };
    // 呼叫父元件傳進來的 function，進入第二頁
    if(onNextStep) onNextStep(orderData);
    console.log("前往下一步，訂單資料：", orderData);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">岳野登山裝備租借系統</h1>

      {/* --- 方案選擇區 --- */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-700">1. 選擇租借方案</h2>
        
        {/* 成人全套 */}
        <div 
          onClick={() => handlePlanSelect('adult9')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPlan === 'adult9' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">成人全套九件組</span>
            <span className="text-emerald-600 font-semibold">NT$ 4,000</span>
          </div>
        </div>

        {/* 兒童全套 */}
        <div 
          onClick={() => handlePlanSelect('child9')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPlan === 'child9' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">兒童全套九件組</span>
            <span className="text-emerald-600 font-semibold">NT$ 3,500</span>
          </div>
        </div>

        {/* 成人自由選 */}
        <div 
          onClick={() => handlePlanSelect('adult7')}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedPlan === 'adult7' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">成人自由選七件組</span>
            <span className="text-emerald-600 font-semibold">NT$ 3,000</span>
          </div>
        </div>
      </div>

      {/* --- 自由選裝備區 (僅在選取 adult7 時顯示) --- */}
      {selectedPlan === 'adult7' && (
        <div className="mb-8 animate-fade-in-down">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/90 py-2 z-10 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-700">2. 挑選 7 件裝備</h2>
            <span className={`font-bold px-3 py-1 rounded-full ${selectedGears.length === 7 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
              已選 {selectedGears.length} / 7
            </span>
          </div>
          
          {warningMsg && <div className="text-red-500 text-sm mb-4 font-medium bg-red-50 p-2 rounded">{warningMsg}</div>}

          <div className="grid grid-cols-3 gap-3">
            {GEAR_ITEMS.map((item) => {
              const isSelected = selectedGears.includes(item.id);
              return (
                <div 
                  key={item.id}
                  onClick={() => toggleGear(item.id)}
                  className={`relative flex flex-col items-center p-2 rounded-xl border-2 cursor-pointer transition-all overflow-hidden
                    ${isSelected ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'}`}
                >
                  <img src={item.image} alt={item.name} className="w-full h-24 object-cover rounded-md mb-2" />
                  <span className={`text-sm font-medium ${isSelected ? 'text-emerald-700' : 'text-gray-700'}`}>{item.name}</span>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- 底部固定按鈕 --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={handleNext}
            disabled={!canGoNext}
            className={`w-full py-3 rounded-lg font-bold text-lg transition-colors
              ${canGoNext 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            下一步：填寫資料
          </button>
        </div>
      </div>
    </div>
  );
}
