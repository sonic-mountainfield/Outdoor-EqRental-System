import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const printRef = useRef();

  // 📝 這裡填入你的 SheetDB API
  const SHEETDB_URL = 'https://sheetdb.io/api/v1/0r2rfy0cdm7yk';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(SHEETDB_URL);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data.reverse() : []);
      } catch (e) { console.error("抓取失敗", e); }
    };
    fetchOrders();
  }, []);

  // 設定列印功能
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `岳野訂單_${selectedOrder?.姓名}`,
  });

  const triggerPrint = (order) => {
    setSelectedOrder(order);
    setTimeout(() => { handlePrint(); }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">岳野登山 - 租借後台管理</h1>
          <button onClick={() => window.location.href='/'} className="text-sm text-blue-600 hover:underline">返回客戶頁</button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm">訂單編號</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">姓名/行程</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">金額</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b hover:bg-emerald-50 transition-colors">
                  <td className="p-4 text-xs font-mono">{order.訂單編號}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{order.姓名}</div>
                    <div className="text-xs text-gray-500">{order.團名與日期}</div>
                  </td>
                  <td className="p-4 font-bold text-emerald-600">NT$ {order.總金額}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => triggerPrint(order)}
                      className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-700 shadow-sm"
                    >
                      列印訂單
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- 隱藏的列印版型 (PDF 樣子) --- */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="p-12 text-black font-sans">
          <h1 className="text-3xl font-bold border-b-4 border-black pb-4 mb-8">岳野登山裝備預約確認單</h1>
          
          <div className="grid grid-cols-2 gap-y-4 mb-10 text-lg">
            <p><strong>訂單編號：</strong> {selectedOrder?.訂單編號}</p>
            <p className="text-right"><strong>預約日期：</strong> {selectedOrder?.建立時間?.split(' ')[0]}</p>
            <p><strong>客戶姓名：</strong> {selectedOrder?.姓名}</p>
            <p className="text-right"><strong>聯絡電話：</strong> {selectedOrder?.電話}</p>
            <p className="col-span-2"><strong>參加行程：</strong> {selectedOrder?.團名與日期}</p>
          </div>

          <div className="border-2 border-black p-6 mb-10">
            <h3 className="font-bold text-xl mb-4 border-b border-gray-300 pb-2">租借細目</h3>
            <p className="mb-2"><strong>選擇方案：</strong> {selectedOrder?.選擇方案}</p>
            <p className="leading-relaxed mb-6"><strong>裝備內容：</strong> {selectedOrder?.裝備清單}</p>
            <div className="text-right text-2xl font-bold pt-4 border-t border-black">
              合計金額：NT$ {selectedOrder?.總金額}
            </div>
          </div>

          <div className="mt-32 flex justify-between">
            <div className="border-t-2 border-black pt-2 w-64 text-center text-lg">客戶簽名 (尺寸確認)</div>
            <div className="border-t-2 border-black pt-2 w-64 text-center text-lg">岳野登山 經手人簽章</div>
          </div>
          
          <div className="mt-10 text-xs text-gray-400 italic">
            * 提醒您：裝備領取時請當面核對數量與尺寸。
          </div>
        </div>
      </div>
    </div>
  );
}
