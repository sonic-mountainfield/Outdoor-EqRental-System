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
        <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b-4 border-green-500 pb-2 inline-block">現場試穿與合約建立</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">客戶姓名</label>
            <input name="customerName" onChange={handleChange} className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none" type="text" placeholder="輸入客戶姓名" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">活動日期</label>
            <select name="activityDate" onChange={handleChange} className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none">
              <option value="">請選擇日期</option>
              <option value="2024-07-01 玉山團">2024-07-01 玉山團</option>
              <option value="2024-07-15 雪山團">2024-07-15 雪山團</option>
              <option value="2024-08-10 嘉明湖">2024-08-10 嘉明湖</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-2">租借套餐組合</label>
          <select name="packageType" onChange={handleChange} className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 focus:outline-none">
            <option value="">請選擇套餐</option>
            <option value="A方案：新手入門包">A方案：新手入門包</option>
            <option value="B方案：專業百岳裝備">B方案：專業百岳裝備</option>
            <option value="C方案：輕量化單攻">C方案：輕量化單攻</option>
          </select>
        </div>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-lg font-bold text-gray-800 mb-4">裝備明細勾選</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(formData.items).map(item => (
              <label key={item} className="flex items-center space-x-3 p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-green-50 transition">
                <input type="checkbox" checked={formData.items[item]} onChange={() => handleCheckboxChange(item)} className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
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
          className="w-full bg-green-600 text-white font-bold text-xl py-4 rounded-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl"
        >
          產生並列印雙聯確認書
        </button>
      </div>

      <div className="hidden">
        <ContractPrint ref={componentRef} data={formData} />
      </div>
    </div>
  );
};

export default FittingForm;
