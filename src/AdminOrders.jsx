import React, { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const printRef = useRef();

  // 1. 從 SheetDB 抓取所有訂單
  useEffect(() => {
    fetch('https://sheetdb.io/api/v1/0r2rfy0cdm7yk')
      .then(res => res.json())
      .then(data => setOrders(data.reverse())); // 最新訂單排前面
  }, []);

  // 2. 設定列印功能
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const preparePrint = (order) => {
    setSelectedOrder(order);
    // 稍微延遲讓資料填入版型後再啟動列印
    setTimeout(() => { handlePrint(); }, 500);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">岳野登山 - 後台訂單管理</h1>
      
      {/* 訂單列表 */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">訂單編號</th>
            <th className="p-3 border">姓名</th>
            <th className="p-3 border">總金額</th>
            <th className="p-3 border">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.訂單編號} className="hover:bg-gray-50">
              <td className="p-3 border">{order.訂單編號}</td>
              <td className="p-3 border">{order.姓名}</td>
              <td className="p-3 border">NT$ {order.總金額}</td>
              <td className="p-3 border">
                <button 
                  onClick={() => preparePrint(order)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  列印訂單
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 隱藏的列印區塊 (與前一則建議的版型相同) */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="p-10">
          {selectedOrder && (
            <div>
              <h1 className="text-3xl font-bold">岳野登山預約單</h1>
              <p>訂單編號：{selectedOrder.訂單編號}</p>
              <p>客戶姓名：{selectedOrder.姓名}</p>
              <p>租借項目：{selectedOrder.裝備清單}</p>
              <p>總計金額：{selectedOrder.總金額}</p>
              {/* ...其他欄位 */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
