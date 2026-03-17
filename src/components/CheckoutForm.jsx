import React, { useState } from 'react';

// 假設這是你提供的近期出團列表
const TOUR_OPTIONS = [
  "[2026/07/01] 富士山攻頂三天兩夜 A團",
  "[2026/07/15] 富士山攻頂三天兩夜 B團",
  "[2026/08/05] 槍岳縱走五天四夜",
];

export default function CheckoutForm({ orderData, onBack }) {
  // 表單資料狀態
  const [formData, setFormData] = useState({
    tour: '',
    name: '',
    phone: '',
    gender: '男',
    email: ''
  });

  // 提交狀態 (避免重複點擊)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 處理輸入框改變
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 處理訂單送出 (串接 SheetDB)
  const handleSubmit = async (e) => {
    e.preventDefault(); // 防止畫面重整
    setIsSubmitting(true);

    // 1. 準備要送到 SheetDB 的資料格式
    const payload = {
      data: [
        {
          "訂單編號": `YY${Date.now()}`, // 用時間戳記簡單產生一組編號
          "團名與日期": formData.tour,
          "姓名": formData.name,
          "電話": formData.phone,
          "性別": formData.gender,
          "Email": formData.email,
          "選擇方案": orderData.plan,
          "裝備清單": orderData.gears.join(', '), // 把陣列轉成字串，例如 "1, 3, 5, 6"
          "總金額": orderData.price,
          "訂單狀態": "待確認",
          "建立時間": new Date().toLocaleString()
        }
      ]
    };

    try {
      // 2. 呼叫 SheetDB API (請將下方的 URL 換成你自己的 SheetDB API 網址)
      /* const response = await fetch('https://sheetdb.io/api/v1/你的API代碼', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      */

      // 模擬 API 延遲 (測試用，正式上線請刪除這行並解開上面的註解)
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      // 3. 成功後的處理
      setIsSuccess(true);
    } catch (error) {
      console.error("送出失敗:", error);
      alert("抱歉，系統發生錯誤，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 如果成功，顯示成功畫面
  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto p-8 mt-10 bg-white rounded-xl shadow-lg text-center border-t-4 border-emerald-500">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">預約成功！</h2>
        <p className="text-gray-600 mb-6">
          感謝您的預約。我們已經收到您的裝備需求，<br/>
          確認信已發送至您的 Email。<br/>
          <span className="text-emerald-600 font-semibold mt-2 block">提醒您：裝備尺寸將於現場為您量測與試穿。</span>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 pb-10">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700 mr-4">
          ← 返回重選
        </button>
        <h1 className="text-2xl font-bold text-gray-800">填寫個人資料</h1>
      </div>

      {/* 訂單摘要小卡 */}
      <div className="bg-emerald-50 p-4 rounded-lg mb-6 border border-emerald-100 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500 block">已選方案</span>
          <span className="font-bold text-emerald-800">
            {orderData.plan === 'adult9' ? '成人全套九件組' : orderData.plan === 'child9' ? '兒童全套九件組' : '成人自由選七件組'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500 block">總金額</span>
          <span className="font-bold text-xl text-emerald-600">NT$ {orderData.price}</span>
        </div>
      </div>

      {/* 資料填寫表單 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">跟團資訊 *</label>
          <select 
            name="tour" 
            required
            value={formData.tour} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="" disabled>請選擇您參加的行程...</option>
            {TOUR_OPTIONS.map((tour, idx) => (
              <option key={idx} value={tour}>{tour}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">真實姓名 *</label>
          <input 
            type="text" 
            name="name" 
            required
            value={formData.name} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            placeholder="例如：王大明"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">聯絡電話 *</label>
            <input 
              type="tel" 
              name="phone" 
              required
              value={formData.phone} 
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="0912345678"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            >
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">電子郵件 (Email) *</label>
          <input 
            type="email" 
            name="email" 
            required
            value={formData.email} 
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            placeholder="用來接收訂單確認信"
          />
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-bold text-lg text-white transition-all shadow-md
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isSubmitting ? '訂單送出中...' : '確認無誤，送出訂單'}
          </button>
        </div>
      </form>
    </div>
  );
}
