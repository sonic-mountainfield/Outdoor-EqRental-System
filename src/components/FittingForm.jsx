import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import ContractPrint from './ContractPrint';

const FittingForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    activityDate: '',
    packageType: '',
    items: {
      headlamp: false,
      rainGear: false,
      downJacket: false,
      boots: false,
      backpack: false,
      gaiters: false,
      sticks: false,
    },
    sizes: {
      rainCoat: '',
      rainPants: '',
      downJacket: '',
      boots: '',
    }
  });

  const componentRef = useRef();
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${formData.customerName}_裝備確認書`,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name) => {
    setFormData(prev => ({
      ...prev,
      items: { ...prev.items, [name]: !prev.items[name] }
    }));
  };

  // --- 新增：處理全選與全不選邏輯 ---
  const handleSelectAll = () => {
    // 檢查是否目前所有的裝備都已經被勾選了
    const isAllSelected = Object.values(formData.items).every(val => val === true);
    
    // 建立一個新的 items 物件，將所有裝備設為目前狀態的反向 (全勾 -> 全不勾，反之亦然)
    const newItemsState = {};
    for (let key in formData.items) {
      newItemsState[key] = !isAllSelected;
    }

    setFormData(prev => ({
      ...prev,
      items: newItemsState
    }));
  };

  // 用來判斷目前是否為「全選」狀態，以控制全選勾選框的打勾圖示
  const isAllSelected = Object.values(formData.items).every(val => val === true);

  const handleSizeChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      sizes: { ...prev.sizes, [name]: value }
    }));
  };

  const itemNames = {
    headlamp: '頭燈（附電池）',
    rainGear: '防水外套與褲子',
    downJacket: '羽絨外套',
    boots: '登山鞋',
    backpack: '背包與背包套',
    gaiters: '綁腿',
    sticks: '登山杖',
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-emerald-500 pb-2 inline-block">現場試穿與合約建立</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">客戶姓名</label>
            <input name="customerName" onChange={handleChange} className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-emerald-500 focus:outline-none" type="text" placeholder="輸入客戶姓名" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">活動日期</label>
            <select name="activityDate" onChange={handleChange} className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-emerald-500 focus:outline-none">
              <option value="">請選擇出團日期</option>
              <optgroup label="--- G系列 (五日) ---">
                <option value="[G1] 7/11～7/15 富士山五日">[G1] 7/11～7/15 富士山五日</option>
                <option value="[G2] 7/12～7/16 富士山五日">[G2] 7/12～7/16 富士山五日</option>
                <option value="[G3] 7/26～7/30 富士山五日">[G3] 7/26～7/30 富士山五日</option>
                <option value="[G4] 8/19～8/23 富士山五日">[G4] 8/19～8/23 富士山五日</option>
              </optgroup>
              <optgroup label="--- S系列 (三日) ---">
                <option value="[S1] 7/9～7/11 富士山三日">[S1] 7/9～7/11 富士山三日</option>
                <option value="[S2] 7/16～7/18 富士山三日">[S2] 7/16～7/18 富士山三日</option>
                <option value="[S3] 7/23～7/25 富士山三日">[S3] 7/23～7/25 富士山三日</option>
                <option value="[S4] 7/30～8/1 富士山三日">[S4] 7/30～8/1 富士山三日</option>
                <option value="[S5] 8/3～8/5 富士山三日 ">[S5] 8/3～8/5 富士山三日 </option>
                <option value="[S6] 8/23～8/25 富士山三日">[S6] 8/23～8/25 富士山三日</option>
                <option value="[S7] 8/27～8/29 富士山三日">[S7] 8/27～8/29 富士山三日</option>
                <option value="[SS] 9/3～9/5 富士山三日">[SS] 9/3～9/5 富士山三日</option>
                <option value="[S8] 9/6～9/8 富士山三日">[S8] 9/6～9/8 富士山三日</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-2">租借套餐組合</label>
          <select name="packageType" onChange={handleChange} className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-emerald-500 focus:outline-none">
            <option value="">請選擇套餐</option>
            <option value="成人全套九件組">成人全套九件組</option>
            <option value="兒童全套九件組">兒童全套九件組</option>
            <option value="成人自由選七件組">成人自由選七件組</option>
          </select>
        </div>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          {/* --- 新增：全選按鈕區塊 --- */}
          <div className="flex justify-between items-center mb-4">
            <label className="block text-lg font-bold text-gray-800">裝備明細勾選</label>
            <label className="flex items-center space-x-2 cursor-pointer text-emerald-700 font-bold hover:text-emerald-800 transition">
              <input 
                type="checkbox" 
                checked={isAllSelected} 
                onChange={handleSelectAll} 
                className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-400 rounded" 
              />
              <span>全選 / 全不選</span>
            </label>
          </div>
          {/* ------------------------ */}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(formData.items).map(item => (
              <label key={item} className="flex items-center space-x-3 p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-emerald-50 transition">
                <input type="checkbox" checked={formData.items[item]} onChange={() => handleCheckboxChange(item)} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                <span className="text-gray-700 font-medium">{itemNames[item]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-4">各部位尺寸手動輸入</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(formData.sizes).map(part => {
              const partNames = { rainCoat: '雨衣', rainPants: '雨褲', downJacket: '羽絨衣', boots: '登山鞋' };
              return (
                <div key={part}>
                  <label className="block text-sm font-bold text-blue-800 mb-2">{partNames[part]}</label>
                  <input 
                    onChange={(e) => handleSizeChange(part, e.target.value)}
                    className="w-full border-2 border-blue-200 p-2 rounded focus:border-blue-500 focus:outline-none" 
                    placeholder="輸入尺寸" 
                  />
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={handlePrint}
          className="w-full bg-emerald-600 text-white font-bold text-xl py-4 rounded-lg hover:bg-emerald-700 transition shadow-lg hover:shadow-xl"
        >
          產生並列印雙聯確認書
        </button>
      </div>

      {/* 隱藏的列印元件 */}
      <div className="hidden">
        <ContractPrint ref={componentRef} data={formData} />
      </div>
    </div>
  );
};

export default FittingForm;
