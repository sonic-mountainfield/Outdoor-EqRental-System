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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-xl font-bold text-gray-800">岳野登山 - 租賃管理系統</h1>
          <button onClick={() => window.location.href='/'} className="text-sm bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 font-bold">返回首頁</button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-bold text-gray-600">承租人</th>
                <th className="p-4 text-sm font-bold text-gray-600">行程</th>
                <th className="p-4 text-sm font-bold text-gray-600 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b hover:bg-emerald-50 transition-colors">
                  <td className="p-4 font-bold">{order.姓名}</td>
                  <td className="p-4 text-sm text-gray-600">{order.團名與日期}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => triggerPrint(order)} className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700">
                      🖨️ 列印兩頁合約 (含條款)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 📥 列印版型 (兩頁式) */}
      {/* ========================================================= */}
      <div style={{ display: 'none' }}>
        <div ref={printRef} className="text-black font-sans leading-tight">
          
          {/* --- 第一頁：概要與核對單 --- */}
          <div className="p-10 mb-20" style={{ minHeight: '297mm' }}>
            <div className="border-b-4 border-black pb-2 mb-6 flex justify-between items-end">
              <h1 className="text-2xl font-bold">戶外用品租賃確認單 (概要)</h1>
              <p className="text-xs font-mono">NO: {selectedOrder?.訂單編號}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm bg-gray-50 p-4 rounded border">
              <p><strong>承租人：</strong> {selectedOrder?.姓名}</p>
              <p className="text-right"><strong>預約日期：</strong> {selectedOrder?.建立時間?.split(' ')[0]}</p>
              <p><strong>電話：</strong> {selectedOrder?.電話}</p>
              <p className="text-right"><strong>行程：</strong> {selectedOrder?.團名與日期}</p>
            </div>

            {/* 直式核對清單 */}
            <div className="border-2 border-black p-4 rounded-md mb-6">
              <h3 className="font-bold text-sm bg-black text-white px-2 py-1 mb-3 inline-block">裝備核對 Checklist</h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-2 mb-4">
                {selectedOrder?.裝備清單?.split(', ').map((item, index) => (
                  <div key={index} className="flex items-center border-b border-gray-100 py-1.5">
                    <div className="w-5 h-5 border-2 border-black mr-3 flex-shrink-0 bg-white"></div>
                    <span className="text-base font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-right text-2xl font-black pt-2 border-t border-black">合計金額：NT$ {selectedOrder?.總金額}</p>
            </div>

            {/* 雙語取消規定概要 */}
            <div className="bg-red-50 p-4 border border-red-200 rounded mb-6">
              <h4 className="text-xs font-bold text-red-800 mb-2">【キャンセル規定 / 取消規定】</h4>
              <ul className="text-[11px] text-red-700 space-y-1">
                <li>● 20日前：10% | ● 7日前：50% | ● 3日前～當日：100% (不退款)</li>
                <li className="italic opacity-80">※ 詳細條款請參閱第二頁「第9條」。</li>
              </ul>
            </div>

            {/* 簽署確認 */}
            <div className="mt-16 text-sm text-gray-700 mb-10">
              <p>承租人聲明：本人已現場完成裝備測試，確認尺寸合適且功能正常，並同意本合約(含背面/第二頁)之所有租賃條款。</p>
            </div>

            <div className="flex justify-between mt-10 px-4">
              <div className="border-t-2 border-black pt-2 w-64 text-center font-bold text-lg">承租人簽署 (尺寸確認)</div>
              <div className="border-t-2 border-black pt-2 w-64 text-center font-bold text-lg">岳野登山 經手人簽章</div>
            </div>
          </div>

          {/* --- 第二頁：正式合約條款 (強制度分頁) --- */}
          <div className="p-10 border-t-2 border-dashed border-gray-300" style={{ minHeight: '297mm', pageBreakBefore: 'always' }}>
            <h2 className="text-center text-xl font-bold mb-6 underline">SORANOSHITA 戶外用品租賃合約條款</h2>
            <div className="text-[10px] text-gray-700 grid grid-cols-1 gap-4 leading-relaxed">
              <div className="space-y-3">
                <p><strong>第1條 (合約目的)</strong>：SORANOSHITA（甲方）出租裝備予乙方，乙方應於租賃期滿歸還。</p>
                <p><strong>第2條 (租賃物品)</strong>：詳見附件核對清單。</p>
                <p><strong>第3條 (租賃期間)</strong>：依預約日期配送與歸還，乙方應依指定方式按時歸還。</p>
                <p><strong>第4條 (租金)</strong>：乙方應於指定期限前支付約定租金。</p>
                <p><strong>第5條 (配送與歸還)</strong>：由Yamato運輸宅配進行。無需清洗，依原包裝狀態歸還。</p>
                <p><strong>第6條 (使用注意事項)</strong>：乙方應盡善良管理人注意義務。嚴禁轉租、改造或非原用途使用。</p>
                <p><strong>第7條 (損壞、污損、遺失)</strong>：故意或過失造成損壞遺失時，應賠償修理費或原價金額。包含損傷保險，但遺失不在保險範圍。</p>
                <p><strong>第8條 (延遲費用)</strong>：超過租賃期間歸還，應支付延遲費用。</p>
                <p><strong>第9條 (取消)</strong>：出發日20天前(10%)、7天前(50%)、3天前起至當日(100%)。</p>
                <p><strong>第10條 (免責事項)</strong>：因使用裝備造成之第三方損害，除甲方重大過失外不負責任。</p>
                <p><strong>第11條 (個人資料)</strong>：僅用於履行合約及服務改善，受個資法保護。</p>
                <p><strong>第12條 (合約解除)</strong>：乙方違約時，甲方可不經催告解除合約並要求歸還。</p>
                <p><strong>第13條 (管轄法院)</strong>：爭議以甲方所在地法院為專屬合意管轄法院。</p>
              </div>
            </div>
            
            <div className="mt-10 p-4 border rounded text-[9px] text-gray-500">
              <p>【甲方資訊】</p>
              <p>地址：〒403-0017 日本山梨縣富士吉田市新西原5-2-1</p>
              <p>公司名稱：SORANOSHITA股份有限公司 | 代表人：代表董事代表</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
