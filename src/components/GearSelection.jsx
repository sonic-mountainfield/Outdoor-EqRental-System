import React, { useState } from 'react';

// 1. 引入本地圖片 (請確認路徑與你專案一致)
import imgBackpackCover from '../assets/images/gear/backpack_cover.png';
import imgRaincoat from '../assets/images/gear/raincoat.png';
import imgRainPants from '../assets/images/gear/rain_pants.png';
import imgDownJacket from '../assets/images/gear/down_jacket.png';
import imgLargeBackpack from '../assets/images/gear/large_backpack.png';
import imgTrekkingPole from '../assets/images/gear/trekking_pole.png';
import imgGaiters from '../assets/images/gear/gaiters.png';
import imgHeadlamp from '../assets/images/gear/headlamp.png';
import imgHikingBoots from '../assets/images/gear/hiking_boots.png';

// 2. 更新裝備資料清單
const GEAR_ITEMS = [
  { id: 1, name: '背包套', image: imgBackpackCover },
  { id: 2, name: '雨衣', image: imgRaincoat },
  { id: 3, name: '雨褲', image: imgRainPants },
  { id: 4, name: '羽絨外套', image: imgDownJacket },
  { id: 5, name: '大背包', image: imgLargeBackpack },
  { id: 6, name: '登山杖', image: imgTrekkingPole },
  { id: 7, name: '綁腿', image: imgGaiters },
  { id: 8, name: '頭燈(附電池)', image: imgHeadlamp },
  { id: 9, name: '登山鞋', image: imgHikingBoots },
];

// 💡 定義連動綁定的裝備群組 (輸入任一個ID，就會回傳該綁定群組的所有ID)
const PAIRED_GROUPS = {
  1: [1, 5], // 點背包套 -> 連動大背包
  5: [1, 5], // 點大背包 -> 連動背包套
  2: [2, 3], // 點雨衣 -> 連動雨褲
  3: [2, 3]  // 點雨褲 -> 連動雨衣
};

export default function GearSelection({ onNextStep }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedGears, setSelectedGears] = useState([]);
  const [warningMsg, setWarningMsg] = useState('');

  // 處理方案點擊
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setWarningMsg('');
    // 💡 取消固定必選，切換方案時一律清空已選裝備
    setSelectedGears([]);
  };

  // 處理裝備點擊 (僅在 adult7 方案下有效)
  const toggleGear = (gearId) => {
    if (selectedPlan !== 'adult7') return;

    // 取得該裝備對應的連動群組 (如果沒有連動，就只有自己一個人的陣列)
    const groupToToggle = PAIRED_GROUPS[gearId] || [gearId];
    // 判斷該裝備是否已經被選取
    const isCurrentlySelected = selectedGears.includes(gearId);

    if (isCurrentlySelected) {
      // 💡 取消選取：將綁定群組內的裝備一併移除
      setSelectedGears(selectedGears.filter(id => !groupToToggle.includes(id)));
      setWarningMsg('');
    } else {
      // 💡 新增選取：先檢查剩餘名額夠不夠放進這個群組
      if (selectedGears.length + groupToToggle.length > 7) {
        setWarningMsg(`⚠️ 只能選擇 7 件。此組合需佔用 ${groupToToggle.length} 件名額，請先取消其他裝備。`);
        return;
      }
      // 將綁定群組內的裝備一併加入
      setSelectedGears([...selectedGears, ...groupToToggle]);
      setWarningMsg('');
    }
  };

  const canGoNext = 
    selectedPlan === 'adult9' || 
    selectedPlan === 'child9' || 
    (selectedPlan === 'adult7' && selectedGears.length === 7);

  const handleNext = () => {
    if (!canGoNext) return;
    const orderData = {
      plan: selectedPlan,
      gears: selectedPlan === 'adult7' ? selectedGears : GEAR_ITEMS.map(g => g.id),
      // 💡 價格設定：adult9為4000，其餘(adult7, child9)皆為3500
      price: selectedPlan === 'adult9' ? 4000 : 3500
    };
    if(onNextStep) onNextStep(orderData);
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
            <span className="text-emerald-600 font-semibold">NT$ 3,500</span>
          </div>
        </div>
      </div>

      {/* --- 自由選裝備區 --- */}
      {selectedPlan === 'adult7' && (
        <div className="mb-8 animate-fade-in-down">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/90 py-2 z-10 backdrop-blur-sm">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">2. 挑選 7 件裝備</h2>
              {/* 💡 提示文字更新 */}
              <p className="text-sm text-emerald-600 font-medium mt-1">
                ※ 大背包與背包套、雨衣與雨褲需合併選取
              </p>
            </div>
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
                  <span className={`text-sm font-medium ${isSelected ? 'text-emerald-800' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm">
                      ✓
                    </div>
                  )}

                  {/* 💡 如果是綁定裝備，加上小小的連結圖示或標籤提醒 (視覺優化) */}
                  {(item.id === 1 || item.id === 5) && !isSelected && (
                    <div className="absolute top-2 left-2 text-[10px] text-gray-400 bg-gray-100 px-1 rounded">
                      包套連動
                    </div>
                  )}
                  {(item.id === 2 || item.id === 3) && !isSelected && (
                    <div className="absolute top-2 left-2 text-[10px] text-gray-400 bg-gray-100 px-1 rounded">
                      雨具連動
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
