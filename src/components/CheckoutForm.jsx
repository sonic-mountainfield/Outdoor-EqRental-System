import React, { useState } from 'react';

// 裝備 ID 對應名稱的字典
const GEAR_NAME_MAP = {
  1: '背包套',
  2: '雨衣',
  3: '雨褲',
  4: '羽絨外套',
  5: '大背包',
  6: '登山杖',
  7: '綁腿',
  8: '頭燈(附電池)',
  9: '登山鞋',
};

// 近期出團列表
const TOUR_OPTIONS = [
 // --- G系列 (五日) ---
  "[G1] 7/11～7/15 富士山五日",
  "[G2] 7/12～7/16 富士山五日",
  "[G3] 7/26～7/30 富士山五日",
  "[G4] 8/19～8/23 富士山五日",
  // --- S系列 (三日) ---
  "[S1] 7/9～7/11 富士山三日",
  "[S2] 7/16～7/18 富士山三日",
  "[S3] 7/23～7/25 富士山三日",
  "[S4] 7/30～8/1 富士山三日",
  "[S5] 8/3～8/5 富士山三日 ",
  "[S6] 8/23～8/25 富士山三日",
  "[S7] 8/27～8/29 富士山三日",
  "[SS] 9/3～9/5 富士山三日",
  "[S8] 9/6～9/8 富士山三日",
  
];

export default function CheckoutForm({ orderData, onBack }) {
  const [formData, setFormData] = useState({
    tour: '',
    name: '',
    phone: '',
    gender: '男',
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 處理訂單送出 (串接 SheetDB 與 EmailJS)
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);

    // 準備通用資料
    const gearNamesString = orderData.gears ? orderData.gears.map(id => GEAR_NAME_MAP[id]).join(', ') : '';
    const currentOrderId = `YY${Date.now()}`; // 產生唯一訂單編號
    const planName = orderData.plan === 'adult9' ? '成人全套九件組' : orderData.plan === 'child9' ? '兒童全套九件組' : '成人自由選七件組';

    // 1. 準備送到 SheetDB 的資料
    const sheetPayload = {
      data: [
        {
          "訂單編號": currentOrderId, 
          "團名與日期": formData.tour,
          "姓名": formData.name,
          "電話": formData.phone,
          "性別": formData.gender,
          "Email": formData.email,
          "選擇方案": planName,
          "裝備清單": gearNamesString,
          "總金額": orderData.price,
          "訂單狀態": "待確認",
          "建立時間": new Date().toLocaleString()
        }
      ]
    };

    // 2. 準備送到 EmailJS 的資料 (對應我們剛剛在範本設定的 {{變數}})
    const emailPayload = {
      service_id: 'service_987gg3b',    // 📝 這裡要換！(例如: service_abc123)
      template_id: 'template_2u17gz6',  // 📝 這裡要換！(例如: template_xyz789)
      user_id: 'gAivgFufM8L44AAow',       // 📝 這裡要換！(從 Account > General 拿到的 Public Key)
      template_params: {
        to_email: formData.email,
        to_name: formData.name,
        order_id: currentOrderId,
        tour: formData.tour,
        plan: planName,
        gears: gearNamesString,
        price: orderData.price
      }
    };

    try {
      // 第一關：把資料存進 Google 表單 (SheetDB - 已經幫你替換好網址了！)
      const sheetResponse = await fetch('https://sheetdb.io/api/v1/0r2rfy0cdm7yk', { 
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(sheetPayload)
      });
      
      if (!sheetResponse.ok) throw new Error('資料庫儲存失敗，請檢查 SheetDB 設定');

      // 第二關：如果資料庫儲存成功，接著呼叫 EmailJS 寄出確認信
      const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload)
      });

      if (!emailResponse.ok) throw new Error('信件寄送失敗，請檢查 EmailJS 代碼是否正確');

      // 兩關都成功，顯示成功畫面！
      setIsSuccess(true);

    } catch (error) {
      console.error("處理失敗:", error);
      alert("抱歉，系統發生錯誤：" + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="bg-emerald-50 p-5 rounded-lg mb-6 border border-emerald-100 flex justify-between items-start shadow-sm">
        <div className="flex-1">
          <span className="text-sm text-gray-500 block mb-1">已選方案</span>
          <span className="font-bold text-emerald-800 text-lg">
            {orderData.plan === 'adult9' ? '成人全套九件組' : orderData.plan === 'child9' ? '兒童全套九件組' : '成人自由選七件組'}
          </span>
          
          {orderData.gears && orderData.gears.length > 0 && (
            <div className="mt-3 bg-emerald-100/50 rounded-md p-3 border border-emerald-200/50">
              <span className="text-sm font-bold text-emerald-800 block mb-1">包含裝備：</span>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                {orderData.gears.map(gearId => (
                  <li key={gearId} className="text-sm text-emerald-700 flex items-center">
                    <span className="mr-1.5 text-emerald-500 text-xs">✓</span>
                    {GEAR_NAME_MAP[gearId]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="text-right ml-4">
          <span className="text-sm text-gray-500 block mb-1">總金額</span>
          <span className="font-bold text-2xl text-emerald-600">NT$ {orderData.price}</span>
        </div>
      </div>

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
            {isSubmitting ? '訂單送出中 (請稍候)...' : '確認無誤，送出訂單'}
          </button>
        </div>
      </form>
    </div>
  );
}
