import React from 'react';

const ContractPrint = React.forwardRef(({ data }, ref) => {
  // 將英文的裝備 key 轉換成中文顯示
  const itemNames = {
    headlamp: '頭燈（附電池）',
    rainGear: '防水外套與褲子',
    downJacket: '羽絨外套',
    boots: '登山鞋',
    backpack: '背包與背包套',
    gaiters: '綁腿',
    sticks: '登山杖',
  };

  // 單聯的樣板設計
  const ContractSection = ({ type }) => (
    <div className="p-6 border-2 border-gray-800 flex flex-col justify-between min-h-[420px]">
      <div>
        <div className="flex justify-between items-end border-b-2 border-gray-800 pb-3 mb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-600 mb-1 tracking-wide">
              TAKENO 台灣岳野登山有限公司
            </h2>
            <h1 className="text-2xl font-bold tracking-wider">
              裝備租借確認書 - {type === 'pickup' ? '上聯 (取件)' : '下聯 (歸還)'}
            </h1>
          </div>
          <span className="text-sm text-gray-600 mb-1">
            列印日期：{new Date().toLocaleDateString()}
          </span>
        </div>

        {/* 修改：活動名稱單獨一行，姓名與套餐在同一行 */}
        <div className="flex flex-col gap-2 mb-4 bg-gray-50 p-3 rounded">
          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-bold text-gray-700">客戶姓名：</span> {data.customerName}</p>
            <p><span className="font-bold text-gray-700">租借套餐：</span> {data.packageType}</p>
          </div>
          <p><span className="font-bold text-gray-700">活動日期：</span> {data.activityDate}</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold bg-gray-200 p-2 mb-2">已領取裝備明細</h3>
            <ul className="list-disc pl-6 space-y-1">
              {Object.entries(data.items)
                .filter(([_, isChecked]) => isChecked)
                .map(([key]) => (
                  <li key={key} className="text-gray-800 font-medium">{itemNames[key]}</li>
                ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold bg-gray-200 p-2 mb-2">試穿確認尺寸</h3>
            <div className="grid grid-cols-2 gap-2 text-gray-800 font-medium">
              <p>雨衣：{data.sizes.rainCoat || '無'}</p>
              <p>雨褲：{data.sizes.rainPants || '無'}</p>
              <p>羽絨衣：{data.sizes.downJacket || '無'}</p>
              <p>登山鞋：{data.sizes.boots || '無'}</p>
            </div>
            {/* 修改：將下聯備註文字改為「裝備遺失」 */}
            {type === 'return' && (
              <div className="mt-3 border-2 border-red-400 p-2 min-h-[60px]">
                <p className="font-bold text-red-600 text-sm">裝備遺失：</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-around mt-4">
        <div className="border-t border-gray-800 w-40 text-center pt-2 text-sm font-bold">租借人簽名</div>
        <div className="border-t border-gray-800 w-40 text-center pt-2 text-sm font-bold">核對人簽名</div>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="bg-white p-4 font-sans">
      <ContractSection type="pickup" />
      
      <div className="text-center py-1 text-gray-400 border-y-2 border-dashed border-gray-300 my-2">
        ✂ 裁切線 (請沿線對折或剪開)
      </div>
      
      <ContractSection type="return" />
    </div>
  );
});

export default ContractPrint;
