import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const printRef = useRef();

  // 📝 這裡填入你的 SheetDB API (請沿用原本的即可)
  const SHEETDB_URL = 'https://sheetdb.io/api/v1/0r2rfy0cdm7yk';

  // 1. 從伺服器抓取資料
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(SHEETDB_URL);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data.reverse() : []); // 最新訂單排前面
      } catch (e) { 
        console.error("抓取失敗", e); 
        alert("資料庫連線失敗，請檢查網路設定");
      }
    };
    fetchOrders();
  }, []);

  // 2. 設定列印功能
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `岳野訂單_${selectedOrder?.姓名}_${selectedOrder?.訂單編號}`,
    // 如果需要自定義頁首頁尾，可以在此加入
  });

  // 3. 觸發列印 (先填資料，再啟動列印)
  const triggerPrint = (order) => {
    setSelectedOrder(order);
    setTimeout(() => { handlePrint(); }, 500);
  };

  // --- 介面渲染 ---
  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* 後台標題欄 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white text-3xl p-3 rounded-2xl shadow-inner">⛰️</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">岳野登山 - 裝備租借後台管理</h1>
              <p className="text-gray-500 text-sm">此頁面為管理員列印單據專用，請妥善保管</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href='/'} 
            className="text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-100 transition-colors flex items-center gap-2 border border-emerald-200"
          >
            ← 返回客戶上傳頁
          </button>
        </div>

        {/* 訂單列表區塊 */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">所有預約訂單列表</h2>
          </div>
          
          <table className="w-full text-left border-collapse table-auto">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm whitespace-nowrap">訂單編號</th>
                <th className="p-4 font-semibold text-gray-600 text-sm whitespace-nowrap">客戶資料 / 參加行程</th>
                <th className="p-4 font-semibold text-gray-600 text-sm whitespace-nowrap">方案 / 金額</th>
                <th className="p-4 font-semibold text-gray-600 text-sm whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-emerald-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-500 whitespace-nowrap">{order.訂單編號}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 text-base">{order.姓名}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{order.團名與日期}</div>
                    <div className="text-xs text-gray-400 mt-1">電話: {order.電話}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{order.選擇方案}</div>
                    <div className="text-xl font-black text-emerald-700 mt-0.5">NT$ {order.總金額}</div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button 
                      onClick={() => triggerPrint(order)}
                      className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-medium text-sm hover:bg-emerald-700 shadow-md transition-all flex items-center gap-2"
                    >
                      🖨️ 列印單據
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">📭</div>
              目前尚無訂單資料，請確認客戶是否已開始預約
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 隐藏的列印版型 (這部分不會在網頁上顯示，只在列印 PDF 時出現) */}
      {/* ========================================================= */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="p-12 text-black font-sans leading-relaxed size-letter">
          
          {/* 大標題 */}
          <h1 className="text-4xl font-extrabold border-b-8 border-black pb-5 mb-8 tracking-wider">岳野登山裝備預約確認單</h1>
          
          {/* 客戶基本資料區 */}
          <div className="grid grid-cols-2 gap-y-5 mb-10 text-xl border border-gray-200 p-6 bg-gray-50 rounded-lg">
            <p><strong>訂單編號：</strong> {selectedOrder?.訂單編號}</p>
            <p className="text-right"><strong>預約日期：</strong> {selectedOrder?.建立時間?.split(' ')[0]}</p>
            <p className="border-t pt-3 mt-3"><strong>客戶姓名：</strong> <span className="text-2xl font-black underline">{selectedOrder?.姓名}</span></p>
            <p className="text-right border-t pt-3 mt-3"><strong>聯絡電話：</strong> {selectedOrder?.電話}</p>
            <p className="col-span-2 border-t pt-3 mt-3"><strong>參加行程：</strong> {selectedOrder?.團名與日期}</p>
          </div>

          {/* 租借細目核心區塊 */}
          <div className="border-4 border-black p-8 rounded-2xl mb-12">
            <h3 className="font-bold text-2xl mb-6 border-b-2 border-gray-400 pb-3 tracking-wide">租借細目 (現場清點核對)</h3>
            <p className="mb-6 text-xl"><strong>選擇方案：</strong> <span className="font-medium">{selectedOrder?.選擇方案}</span></p>
            
            {/* 🚀 裝備內容 (直式排列、勾選框、分欄 Grid) */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <p className="font-bold mb-5 text-xl text-emerald-900 border-b-2 border-emerald-200 pb-2">裝備清單核對 Checklist：</p>
              
              {/* 自動根據裝備數量分欄：1 欄 (手機) -> 2 欄 (列印) */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                {selectedOrder?.裝備清單?.split(', ').map((item, index) => (
                  <div key={index} className="flex items-center border-b border-gray-200 py-1.5 hover:bg-emerald-50 transition-colors">
                    {/* 勾選小方框：現場直接用筆勾選 [] */}
                    <div className="w-6 h-6 border-2 border-black mr-4 flex-shrink-0 bg-white"></div> 
                    <span className="text-xl font-medium text-gray-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 合計金額：加大加粗突出 */}
            <div className="text-right text-4xl font-black pt-5 border-t-2 border-black tracking-tight">
              合計金額：<span className="text-emerald-800">NT$ {selectedOrder?.總金額}</span>
            </div>
          </div>

          {/* 簽名確認區塊：預留大幅手寫空間 */}
          <div className="mt-28 flex justify-between gap-10">
            {/* 尺寸確認：強調現場確認，降低退換貨風險 */}
            <div className="border-t-4 border-black pt-3 w-72 text-center text-xl">
              客戶簽名 (尺寸確認)
              <div className="text-sm text-gray-400 mt-1 italic">(現場確認鞋號、雨衣、外套等尺寸合適)</div>
            </div>
            <div className="border-t-4 border-black pt-3 w-72 text-center text-xl">岳野登山 經手人簽章</div>
          </div>
          
          {/* 底部重要提醒 */}
          <div className="mt-12 text-sm text-gray-500 italic border-t border-gray-200 pt-4">
            * 提醒您：裝備領取時請務必當面核對數量與尺寸。租借期間請妥善保管，若有損壞或遺失需依規定賠償。
          </div>
        </div>
      </div>
    </div>
  );
}
