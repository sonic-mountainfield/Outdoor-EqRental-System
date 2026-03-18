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
    documentTitle: `岳野登山合約_${selectedOrder?.姓名}`,
  });

  const triggerPrint = (order) => {
    setSelectedOrder(order);
    setTimeout(() => { handlePrint(); }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="bg-emerald-600 text-white p-1 rounded">⛰️</span> 岳野登山後台管理
            </h1>
            <p className="text-xs text-gray-400 mt-1">租賃系統 v2.1 | 雙頁連動合約模式</p>
          </div>
          <button onClick={() => window.location.href='/'} className="text-sm font-medium text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-all border border-emerald-100">
            ← 返回客戶預約頁
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-sm font-bold text-gray-600">訂單編號</th>
                <th className="p-4 text-sm font-bold text-gray-600">承租人/行程</th>
                <th className="p-4 text-sm font-bold text-gray-600">金額</th>
                <th className="p-4 text-sm font-bold text-gray-600 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-emerald-50 transition-colors">
                  <td className="p-4 text-xs font-mono text-gray-400">{order.訂單編號}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-800">{order.姓名}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{order.團名與日期}</div>
                  </td>
                  <td className="p-4 font-bold text-emerald-600">NT$ {order.總金額}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => triggerPrint(order)} className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-emerald-700 active:scale-95 transition-all">
                      🖨️ 列印兩頁合約
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="p-20 text-center text-gray-400 italic">目前尚無訂單資料</div>}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 📥 列印版型 (強制作為兩頁 A4 列印) */}
      {/* ========================================================= */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="text-black font-sans bg-white" style={{ width: '210mm' }}>
          
          {/* ===================== 第一頁：裝備點收與尺寸確認 ===================== */}
          <div className="p-10 flex flex-col justify-between" style={{ height: '295mm' }}>
            
            {/* 上半部內容 */}
            <div>
              <div className="flex justify-between items-end border-b-4 border-black pb-2 mb-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tighter">戶外用品租賃確認單 (1/2)</h1>
                  <p className="text-xs text-gray-500 uppercase font-mono">Equipment Checklist & Size Confirmation</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">訂單編號：{selectedOrder?.訂單編號}</p>
                </div>
              </div>
              
              {/* 客戶與行程資料 */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-6 text-sm bg-gray-50 p-4 rounded border border-gray-200">
                <p><strong>承租人姓名：</strong> <span className="text-lg font-bold underline px-1">{selectedOrder?.姓名}</span></p>
                <p className="text-right"><strong>預約日期：</strong> {selectedOrder?.建立時間?.split(' ')[0]}</p>
                <p><strong>聯絡電話：</strong> {selectedOrder?.電話}</p>
                <p className="text-right"><strong>參加行程：</strong> {selectedOrder?.團名與日期}</p>
              </div>

              {/* 裝備核對清單 (直式勾選區) */}
              <div className="border-2 border-black p-4 rounded-md mb-6 bg-white shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
                  <h3 className="font-bold text-sm bg-black text-white px-2 py-1">裝備核對清單 Checklist</h3>
                  <p className="text-sm font-bold text-emerald-700">合計金額：NT$ {selectedOrder?.總金額}</p>
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-2 mb-2">
                  {selectedOrder?.裝備清單?.split(', ').map((item, index) => (
                    <div key={index} className="flex items-center border-b border-gray-100 py-1">
                      <div className="w-5 h-5 border-2 border-black mr-3 flex-shrink-0 bg-white"></div> 
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 現場尺寸確認區 (整合成人與兒童) */}
              <div className="border-2 border-gray-400 p-4 rounded-md mb-6 bg-gray-50">
                <h3 className="font-bold text-sm mb-3 border-b border-gray-300 pb-2">📏 現場尺寸確認 (現場試穿後由工作人員勾選)</h3>
                <div className="grid grid-cols-2 gap-6 text-xs leading-relaxed">
                  {/* 成人用 */}
                  <div className="border-r border-gray-300 pr-4">
                    <p className="font-bold border-b border-gray-200 mb-2">【成人用套組】</p>
                    <div className="flex gap-4 mb-2">
                      <span className="flex items-center gap-1"><div className="w-3 h-3 border border-black bg-white"></div> 男性用</span>
                      <span className="flex items-center gap-1"><div className="w-3 h-3 border border-black bg-white"></div> 女性用</span>
                    </div>
                    <p className="mb-1">服裝：(男) S/M/L/XL/XXL ｜ (女) S/M/L/XL</p>
                    <p className="mb-3">確認尺寸：<span className="inline-block w-32 border-b border-black"></span></p>
                    <p className="mb-1">鞋子：(男) 25.5-31.0 ｜ (女) 23.5-25.5  (公分)</p>
                    <p>確認尺寸：<span className="inline-block w-32 border-b border-black"></span></p>
                  </div>
                  {/* 兒童用 */}
                  <div className="pl-2">
                    <p className="font-bold border-b border-gray-200 mb-2">【兒童用套組】</p>
                    <div className="flex gap-4 mb-2">
                      <span className="flex items-center gap-1"><div className="w-3 h-3 border border-black bg-white"></div> 男孩款</span>
                      <span className="flex items-center gap-1"><div className="w-3 h-3 border border-black bg-white"></div> 女孩款</span>
                    </div>
                    <p className="mb-1">服裝：110 / 120 / 130 / 140 / 150</p>
                    <p className="mb-3">確認尺寸：<span className="inline-block w-32 border-b border-black"></span></p>
                    <p className="mb-1">鞋子：18.0 - 25.0 (公分)</p>
                    <p>確認尺寸：<span className="inline-block w-32 border-b border-black"></span></p>
                  </div>
                </div>
              </div>

              {/* 取消規定概要 */}
              <div className="bg-red-50 p-3 border border-red-200 rounded-md">
                <h4 className="text-xs font-bold text-red-800 mb-1">【キャンセル規定 / 取消規定】</h4>
                <p className="text-[10px] text-red-700 leading-tight">
                  20日前取消：收取 10% ｜ 7日前取消：收取 50% ｜ 3日前至當日取消：恕不退還 (100%)。
                </p>
              </div>
            </div>

            {/* 第一頁底部：換頁簽署提示 與 岳野品牌腳註 */}
            <div>
              <div className="border-t-4 border-gray-800 pt-4 mt-6 text-center">
                <p className="text-xl font-black text-gray-800 tracking-widest mb-1">
                  ➡ 正式合約條款將於第二頁簽署
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  (Please proceed to Page 2 for the formal contract and signatures)
                </p>
              </div>
              
              <div className="text-[10px] text-gray-400 text-center border-t border-gray-200 pt-2 font-medium tracking-wide">
                岳野登山公司 | SORANOSHITA 裝備合作 | 專業富士山、日本健行行程規劃與裝備租賃服務
              </div>
            </div>
          </div>

          {/* ===================== 第二頁：正式合約與簽署 ===================== */}
          <div className="p-10 flex flex-col justify-between" style={{ height: '295mm', pageBreakBefore: 'always' }}>
            
            {/* 上半部：合約條款 */}
            <div>
              {/* 🌟 亮點修改：讓第二頁也有對齊的標題與訂單編號 🌟 */}
              <div className="flex justify-between items-end border-b-4 border-black pb-2 mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tighter">戶外用品租賃合約書 (2/2)</h2>
                  <p className="text-xs text-gray-500 uppercase font-mono">SORANOSHITA Rental Agreement</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">訂單編號：{selectedOrder?.訂單編號}</p>
                </div>
              </div>

              <div className="text-xs text-gray-800 leading-loose space-y-4">
                <p>SORANOSHITA股份有限公司（以下簡稱「甲方」）與 <strong>{selectedOrder?.姓名}</strong>（以下簡稱「乙方」）就戶外用品租賃事宜，締結以下合約。</p>
                
                <div className="grid grid-cols-1 gap-2 pl-2">
                  <p><strong>第1條 (合約目的)</strong>：甲方向乙方出租乙方所選定的戶外用品，乙方承租該物品，並在規定期間使用後歸還。</p>
                  <p><strong>第2條 (租賃物品)</strong>：本合約的租賃物品詳細內容記載於第一頁「裝備核對清單」。</p>
                  <p><strong>第3條 (租賃期間)</strong>：租賃期間為約定之配送日至歸還日。乙方應於屆滿日前依指定方式歸還。</p>
                  <p><strong>第4條 (租金)</strong>：乙方應於甲方指定期限前支付約定之租金。</p>
                  <p><strong>第5條 (配送與歸還)</strong>：由Yamato運輸宅配便進行。乙方應以相同包裝狀態歸還，無需清洗。</p>
                  <p><strong>第6條 (使用注意事項)</strong>：乙方應以善良管理人的注意使用及保管。不得轉租、轉讓、用於非原用途或改造。</p>
                  <p><strong>第7條 (損壞、遺失)</strong>：因乙方故意或過失造成損壞遺失時，應賠償修理費或物品價格。本合約含損傷保險，但「遺失」不在保險範圍內。</p>
                  <p><strong>第8條 (延遲歸還)</strong>：超過租賃期間歸還時，應支付超過天數對應的延遲費用。</p>
                  <p><strong>第9條 (取消)</strong>：出發日20天前取消收取租金10%；7天前收取50%；3天前起(含當日)不予退款。</p>
                  <p><strong>第10條 (免責事項)</strong>：因使用物品造成之損害，除甲方重大過失外，甲方不承擔任何責任。</p>
                  <p><strong>第11條 (個人資料)</strong>：甲方僅將資料用於履行本合約及改善服務，未經同意不向第三方揭露。</p>
                  <p><strong>第12條 (合約解除)</strong>：乙方違反本合約時，甲方可不經催告解除合約，並要求立即歸還物品。</p>
                  <p><strong>第13條 (管轄法院)</strong>：關於本合約的一切爭議，以甲方總公司所在地管轄法院為專屬合意管轄法院。</p>
                </div>
              </div>

              <div className="mt-8 p-4 border border-gray-300 rounded bg-gray-50 text-[10px] text-gray-600">
                <p className="font-bold mb-1">【甲方（出租人）】</p>
                <p>公司名稱：SORANOSHITA股份有限公司 ｜ 代表人：代表董事</p>
                <p>地址：〒403-0017 日本山梨縣富士吉田市新西原5-2-1</p>
              </div>
            </div>

            {/* 第二頁底部：最終簽署區 與 岳野品牌腳註 */}
            <div className="mb-4">
              <p className="text-sm mb-8 font-bold text-gray-800">
                為證明本合約的締結，雙方已確認第一頁之裝備與尺寸無誤，並同意上述所有條款。
              </p>
              
              <div className="flex justify-between px-4 mb-10">
                <div className="border-t-2 border-black pt-2 w-64">
                  <p className="text-lg font-bold text-center">乙方 (承租人) 簽署</p>
                  <p className="text-xs text-gray-400 mt-1 text-center">Customer Signature</p>
                  <div className="mt-6 text-sm text-gray-500 text-center">簽署日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</div>
                </div>
                
                <div className="border-t-2 border-black pt-2 w-64">
                  <p className="text-lg font-bold text-center">甲方 (經手人) 簽章</p>
                  <p className="text-xs text-gray-400 mt-1 text-center">Staff Signature</p>
                  <div className="mt-6 text-sm text-gray-500 text-center">簽署日期：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日</div>
                </div>
              </div>

              {/* 🌟 品牌腳註 (保留於頁底) */}
              <div className="text-[10px] text-gray-400 text-center border-t border-gray-200 pt-2 font-medium tracking-wide">
                岳野登山公司 | SORANOSHITA 裝備合作 | 專業富士山、日本健行行程規劃與裝備租賃服務
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
