import React, { useState } from 'react';

// 1. 定義所有裝備的公用清單 (9樣)
const ALL_GEARS = [
  "登山雨衣", 
  "登山雨褲", 
  "登山背包(30~35L)", 
  "羽絨外套", 
  "背包套", 
  "綁腿", 
  "頭燈(附電池)", 
  "登山鞋", 
  "登山杖(雙杖)"
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    姓名: '',
    電話: '',
    團名與日期: '',
    選擇方案: '',
    總金額: 0
  });
  
  // 記錄客人目前選了哪些裝備
  const [selectedGears, setSelectedGears] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 處理基本資料輸入 ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- 處理方案變更 ---
  const handlePlanChange = (e) => {
    const planName = e.target.value;
    let price = 0;

    if (planName === "成人九件組") price = 4000;      // 💰 金額請依實際情況修改
    if (planName === "兒童九件組") price = 3000;      // 💰 金額請依實際情況修改
    if (planName === "自由選七件組") price = 3000;    // 💰 金額請依實際情況修改

    setFormData({ ...formData, 選擇方案: planName, 總金額: price });

    // 邏輯判斷：如果是九件組，直接把 9 樣裝備塞進去；如果是七件組，清空讓客人自己選
    if (planName === "成人九件組" || planName === "兒童九件組") {
      setSelectedGears(ALL_GEARS);
    } else {
      setSelectedGears([]);
    }
  };

  // --- 處理七件組的自由勾選邏輯 ---
  const handleGearToggle = (gear) => {
    if (selectedGears.includes(gear)) {
      // 如果已經勾了，就取消勾選
      setSelectedGears(selectedGears.filter(item => item !== gear));
    } else {
      // 如果還沒勾，先檢查是不是已經滿 7 件了
      if (selectedGears.length >= 7) {
        alert("自由選七件組最多只能選擇 7 項裝備喔！");
        return;
      }
      // 沒滿 7 件，加入清單
      setSelectedGears([...selectedGears, gear]);
    }
  };

  // --- 送出表單 ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 七件組防呆：如果選了七件組，但沒有勾滿/勾選裝備，跳出提醒
    if (formData.選擇方案 === "自由選七件組" && selectedGears.length === 0) {
      alert("請至少選擇一項裝備！");
      return;
    }

    setIsSubmitting(true);

    const submissionData = {
      訂單編號: `YY${Date.now()}`,
      建立時間: new Date().toLocaleString('zh-TW'),
      ...formData,
      裝備清單: selectedGears.join(', ') // 轉成字串傳給後台
    };

    try {
      // 📝 這裡請換成你專屬的 SheetDB API 網址
      const SHEETDB_URL = 'https://sheetdb.io/api/v1/0r2rfy0cdm7yk';
      await fetch(SHEETDB_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: submissionData })
      });
      alert('🎉 預約成功！我們已收到您的資料。');
      // 清空表單
      setFormData({ 姓名: '', 電話: '', 團名與日期: '', 選擇方案: '', 總金額: 0 });
      setSelectedGears([]);
    } catch (error) {
      console.error(error);
      alert('❌ 發生錯誤，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-emerald-800 mb-2">⛰️ 岳野登山裝備預約</h1>
          <p className="text-gray-500 text-sm">請填寫以下資料，裝備尺寸將於現場為您量測確認</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 基本資料 (姓名、電話、行程) 略，與之前相同 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">姓名</label>
              <input type="text" name="姓名" value={formData.姓名} onChange={handleInputChange} required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="例：王小明" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">聯絡電話</label>
              <input type="tel" name="電話" value={formData.電話} onChange={handleInputChange} required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="例：0912345678" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">參加行程 (團名與日期)</label>
            <input type="text" name="團名與日期" value={formData.團名與日期} onChange={handleInputChange} required className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="例：[2026/07/01] 富士山A團" />
          </div>

          {/* 選擇方案下拉選單 */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">選擇預約方案</label>
            <select 
              name="選擇方案" 
              value={formData.選擇方案} 
              onChange={handlePlanChange} 
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 font-medium"
            >
              <option value="">-- 請下拉選擇租賃方案 --</option>
              <option value="成人九件組">成人九件組</option>
              <option value="兒童九件組">兒童九件組</option>
              <option value="自由選七件組">自由選七件組 (可任選最多7樣)</option>
            </select>
          </div>

          {/* 動態裝備區塊：九件組 (固定清單) vs 七件組 (自由勾選) */}
          {formData.選擇方案 && (
            <div className={`p-5 rounded-xl border transition-all ${
              formData.選擇方案.includes("九件") ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"
            }`}>
              
              <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                <h4 className="font-bold text-gray-800 text-sm">
                  {formData.選擇方案.includes("九件") ? "📦 方案固定包含以下 9 項裝備：" : "📦 請勾選您需要的裝備："}
                </h4>
                {formData.選擇方案 === "自由選七件組" && (
                  <span className={`text-xs px-2 py-1 rounded font-bold ${
                    selectedGears.length === 7 ? "bg-red-100 text-red-700" : "bg-blue-200 text-blue-800"
                  }`}>
                    已選擇 {selectedGears.length} / 7 項
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {ALL_GEARS.map((gear, index) => {
                  const isNinePiece = formData.選擇方案.includes("九件");
                  const isChecked = selectedGears.includes(gear);

                  return (
                    <label 
                      key={index} 
                      className={`flex items-center space-x-2.5 p-1 rounded transition-colors ${
                        isNinePiece ? "cursor-not-allowed" : "cursor-pointer hover:bg-white"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => !isNinePiece && handleGearToggle(gear)}
                        readOnly={isNinePiece}
                        className={`w-4 h-4 rounded border-gray-300 focus:ring-emerald-500 ${
                          isNinePiece ? "text-emerald-600" : "text-blue-600"
                        }`} 
                      />
                      <span className={`text-sm font-medium ${isChecked ? "text-gray-900" : "text-gray-500"}`}>
                        {gear}
                      </span>
                    </label>
                  );
                })}
              </div>
              
            </div>
          )}

          {/* 金額總計與送出 */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
            <div>
              <p className="text-sm text-gray-500 font-medium">合計金額</p>
              <p className="text-2xl font-black text-emerald-700">NT$ {formData.總金額}</p>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'}`}
            >
              {isSubmitting ? '送出中...' : '確認預約'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
