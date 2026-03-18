import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const printRef = useRef();

  // 📝 這裡請確保與你的 SheetDB API 網址一致
  const SHEETDB_URL = 'https://sheetdb.io/api/v1/0r2rfy0cdm7yk';

  // 1. 從資料庫獲取訂單
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(SHEETDB_URL);
        const data = await res.json();
        setOrders(Array.isArray(data) ? data.reverse() : []);
      } catch (e) { 
        console.error("抓取失敗", e); 
      }
    };
    fetchOrders();
  }, []);

  // 2. 設定列印功能
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `岳野登山合約_${selectedOrder?.姓名}`,
  });

  // 3. 準備列印資料並執行
  const triggerPrint = (order) => {
    setSelectedOrder(order);
    // 給予 300ms 緩衝確保資料填入 DOM
    setTimeout(() => { handlePrint(); }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* 後台頂部管理列 */}
        <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-emerald-600 text-white p-1 rounded">⛰️</span> 岳野登山後台管理
            </h1>
            <p className="text-xs text-gray-400 mt-1">租賃系統 v1.0 | 合約列印模式</p>
          </div>
          <button 
            onClick={() => window.location.href='/'} 
            className="text-sm font-medium text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-all border border-emerald-100"
          >
            ← 返回客戶預約頁
          </button>
        </div>

        {/* 訂單列表表格 */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-sm font-bold text-gray-600">訂單編號/時間</th>
                <th className="p-4 text-sm font-bold text-gray-600">承租人/行程</th>
                <th className="p-4 text-sm font-bold text-gray-600">金額</th>
                <th className="p-4 text-sm font-bold text-gray-600 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-emerald-50 transition-colors">
                  <td className="p-4">
                    <div className="text-xs font-mono text-gray-400">{order.訂單編號}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{order.建立時間}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{order.姓名}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{order.團名與日期}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-emerald-600">NT$ {order.總金額}</span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => triggerPrint(order)} 
                      className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
                    >
                      🖨️ 列印合約
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-20 text-center text-gray-400 italic">目前尚無訂單資料</div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 📥 壓縮版 A4 租賃合約 (僅在列印時顯示) */}
      {/* ========================================================= */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="p-10 text-black font-sans leading-snug bg-white" style={{ width: '210mm' }}>
          
          {/* 1. 頁首標題 */}
          <div className="flex justify-between items-end border-b-4 border-black pb-2 mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tighter">戶外用品租賃合約書</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Outdoor Equipment Rental Agreement</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold">訂單編號：{selectedOrder?.訂單編號}</p>
              <p className="text-[9px] text-gray-400 italic">列印日期：{new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          {/* 2. 客戶與行程資料區 */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-4 text-xs bg-gray-50 p-3 rounded border border-gray-200">
            <p><strong>承租人姓名：</strong> <span className="text-base font-bold underline px-1">{selectedOrder?.姓名}</span></p>
            <p className="text-right"><strong>預約日期：</strong> {selectedOrder?.建立時間?.split(' ')[0]}</p>
            <p><strong>聯絡電話：</strong> {selectedOrder?.電話}</p>
            <p className="text-right"><strong>參加行程：</strong> {selectedOrder?.團名與日期}</p>
          </div>

          {/* 3. 裝備核對清單 (直式勾選區) */}
          <div className="border-2 border-black p-4 rounded-md mb-4 bg-white shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-200 pb-1 mb-3">
              <h3 className="font-bold text-sm bg-black text-white px-2 py-0.5">裝備核對清單 Checklist</h3>
              <p className="text-xs"><strong>方案內容：</strong> {selectedOrder?.選擇方案}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-10 gap-y-1.5 mb-2">
              {selectedOrder?.裝備清單?.split(', ').map((item, index) => (
                <div key={index} className="flex items-center border-b border-gray-100 py-1">
                  {/* 核對小方框 */}
                  <div className="w-4 h-4 border-2 border-black mr-3 flex-shrink-0 bg-white"></div> 
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <div className="text-right text-lg font-black pt-2 border-t border-dotted border-gray-400 mt-2">
              合計租金金額：<span className="text-2xl">NT$ {selectedOrder?.總金額}</span>
            </div>
          </div>

          {/* 4. キャンセル規定 / 取消規定 (中日雙語) */}
          <div className="bg-red-50 p-3 border border-red-200 rounded-md mb-4">
            <h4 className="text-[11px] font-bold text-red-800 mb-1">【キャンセル規定 / 取消規定】</h4>
            <ul className="text-[10px] text-red-700 space-y-1 list-disc pl-4 leading-tight">
              <li>
                出発日の20日前までのキャンセル：レンタル料の10％を申し受けます。<br/>
                <span className="text-[9px] opacity-75">(出發前 20 日以上取消：酌收租金 10% 為手續費)</span>
              </li>
              <li>
                出発日の7日前までのキャンセル：レンタル料の50％を申し受けます。<br/>
                <span className="text-[9px] opacity-75">(出發前 7 日以上取消：酌收租金 50% 為手續費)</span>
              </li>
              <li>
                出発日の3日前以降（当日含む）のキャンセル：レンタル料は返金不可となります。<br/>
                <span className="text-[9px] opacity-75">(出發前 3 日內及當日取消：租金恕不退還)</span>
              </li>
            </ul>
          </div>

          {/* 5. 租賃合約條款 */}
          <div className="p-3 border border-gray-300 rounded-md mb-6 bg-white">
            <h4 className="text-[11px] font-bold mb-1 underline">租賃合約條款 (Rental Terms)</h4>
            <ol className="text-[9px] text-gray-600 space-y-1 list-decimal pl-4 leading-normal">
              <li>承租人已於現場完成裝備測試，確認尺寸合適且功能正常，並由雙方核對數量無誤。</li>
              <li>裝備若發生非正常磨損之損壞、遺失或失竊，承租人同意依原價之 70% 進行賠償。</li>
              <li>承租人提供之護照資料僅供報名行程、申請保險及入山證使用，岳野登山負保密責任。</li>
              <li>裝備領取後，若因個人因素提前歸還，恕不退還剩餘天數之租金。</li>
            </ol>
          </div>

          {/* 6. 簽署區塊 */}
          <div className="mt-12 flex justify-between px-2">
            <div className="border-t-2 border-black pt-1 w-64 text-center">
              <p className="text-sm font-bold">承租者簽署 (尺寸與條款確認)</p>
              <p className="text-[10px] text-gray-400 mt-1 italic italic">Customer Signature</p>
            </div>
            <div className="border-t-2 border-black pt-1 w-64 text-center">
              <p className="text-sm font-bold">岳野登山 經手人簽章</p>
              <p className="text-[10px] text-gray-400 mt-1 italic italic">Staff Signature</p>
            </div>
          </div>
          
          {/* 7. 腳註 */}
          <div className="mt-10 text-[8px] text-gray-400 text-center border-t border-gray-100 pt-2">
            岳野登山公司 | 專業富士山、各國健行行程規劃與裝備租賃服務
          </div>
        </div>
      </div>
    </div>
  );
}
