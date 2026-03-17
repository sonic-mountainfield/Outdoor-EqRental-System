import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const printRef = useRef();

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

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `岳野訂單_${selectedOrder?.姓名}`,
  });

  const triggerPrint = (order) => {
    setSelectedOrder(order);
    setTimeout(() => { handlePrint(); }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* 後台頂部欄 */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-800">岳野登山後台管理</h1>
            <p className="text-xs text-gray-500">管理員列印模式</p>
          </div>
          <button onClick={() => window.location.href='/'} className="text-sm bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all">
            返回客戶頁
          </button>
        </div>

        {/* 訂單列表 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-bold text-gray-600">客戶姓名</th>
                <th className="p-4 text-sm font-bold text-gray-600">參加行程</th>
                <th className="p-4 text-sm font-bold text-gray-600">金額</th>
                <th className="p-4 text-sm font-bold text-gray-600 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b hover:bg-emerald-50">
                  <td className="p-4 font-bold text-gray-800">{order.姓名}</td>
                  <td className="p-4 text-sm text-gray-600">{order.團名與日期}</td>
                  <td className="p-4 font-bold text-emerald-600">NT$ {order.總金額}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => triggerPrint(order)} className="bg-emerald-600 text-white px-4 py-1.5 rounded shadow hover:bg-emerald-700 transition-all">
                      列印單據
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 壓縮版 A4 列印版型 (隱藏區塊) */}
      {/* ========================================================= */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="p-10 text-black font-sans leading-snug">
          
          {/* 頁首標題 */}
          <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
            <h1 className="text-xl font-bold tracking-tight">岳野登山裝備預約確認單</h1>
            <p className="text-[10px] text-gray-500">單據編號：{selectedOrder?.訂單編號}</p>
          </div>
          
          {/* 客戶資訊：兩欄式簡潔排版 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4 text-xs bg-gray-50 p-3 rounded-md border border-gray-200">
            <p><strong>客戶姓名：</strong> <span className="text-base font-bold underline">{selectedOrder?.姓名}</span></p>
            <p className="text-right"><strong>預約日期：</strong> {selectedOrder?.建立時間?.split(' ')[0]}</p>
            <p><strong>聯絡電話：</strong> {selectedOrder?.電話}</p>
            <p className="text-right"><strong>參加行程：</strong> {selectedOrder?.團名與日期}</p>
          </div>

          {/* 租借核心區塊 */}
          <div className="border border-black p-4 rounded-md mb-4">
            <div className="flex justify-between items-center border-b border-gray-300 pb-1 mb-2">
              <h3 className="font-bold text-sm">租借細目 (現場清點核對)</h3>
              <p className="text-xs"><strong>方案：</strong> {selectedOrder?.選擇方案}</p>
            </div>
            
            {/* 裝備勾選清單：壓縮分欄 */}
            <div className="mb-2">
              <p className="font-bold text-[10px] text-emerald-800 mb-2 underline">裝備核對 Checklist：</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                {selectedOrder?.裝備清單?.split(', ').map((item, index) => (
                  <div key={index} className="flex items-center border-b border-gray-100 py-1">
                    <div className="w-4 h-4 border border-black mr-2 flex-shrink-0 bg-white"></div> 
                    <span className="text-xs font-medium text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 金額統計：靠右對齊 */}
            <div className="text-right text-lg font-black pt-2 border-t border-black mt-2">
              合計金額：<span className="text-xl">NT$ {selectedOrder?.總金額}</span>
            </div>
          </div>

          {/* 簽名區塊：減少留白，增加實用性 */}
          <div className="mt-12 flex justify-between px-4">
            <div className="border-t border-black pt-1 w-48 text-center">
              <p className="text-sm font-bold">客戶簽名 (尺寸確認)</p>
              <p className="text-[9px] text-gray-400 leading-none">確認鞋號、雨衣、外套等尺寸合適</p>
            </div>
            <div className="border-t border-black pt-1 w-48 text-center text-sm font-bold">
              岳野登山 經手人簽章
            </div>
          </div>
          
          {/* 法律/聲明提醒：字體最小化 */}
          <div className="mt-8 text-[9px] text-gray-400 italic border-t border-gray-100 pt-2 text-center">
            提醒您：領取時請務必核對數量。租借期間請妥善保管，若有損壞或遺失需依規定賠償。
          </div>
        </div>
      </div>
    </div>
  );
}
