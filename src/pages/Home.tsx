import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



const Home = () => {
  const [alerts, setAlerts] = useState<string[]>([]);

useEffect(() => {
  fetch("https://jsonplaceholder.typicode.com/todos?_limit=1")
    .then((res) => res.json())
    .then((data) => {
      const last = data[data.length - 1];
      setAlerts([
        last?.title || "測試公告"
      ]);
    })
    .catch(() => setAlerts(["公告載入失敗，請稍後再試"]));
}, []);

  return (
    <div>
      {/* 跑馬燈區塊 */}
      <div className="w-full overflow-hidden bg-blue-100 border-b border-blue-200 mb-6">
        <div className="whitespace-nowrap animate-marquee text-blue-700 py-2 px-4 font-semibold">
          {alerts.length > 0
            ? alerts.map((a, i) => (
                <span key={i} className="mx-8">
                  {a}
                </span>
              ))
            : "載入台鐵公告中..."}
        </div>
      </div>

      {/* 原本內容 */}
      <div className="flex flex-col items-center justify-center gap-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">歡迎使用台鐵時刻表</h2>
        <p className="text-blue-600 text-lg mb-4">
          查詢最新台鐵班次、時刻與車站資訊，簡單快速。
        </p>
        <Link
          to="/search"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
        >
          開始查詢
        </Link>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          min-width: 100%;
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
