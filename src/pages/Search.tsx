import React, { useState } from "react";

const stationList: string[] = ["台北", "板橋", "桃園", "新竹", "台中", "嘉義", "台南", "高雄"];

const Search: React.FC = () => {
  const [fromStation, setFromStation] = useState<string>("");
  const [toStation, setToStation] = useState<string>("");
  const [date, setDate] = useState<string>("");
  // 假資料
  const results = [
    { train: "區間車 1234", time: "08:00 - 09:30" },
    { train: "自強號 5678", time: "09:45 - 11:00" },
  ];

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-blue-700 mb-8 text-center">
          查詢火車班表
        </h2>

        <div className="mb-6">
          <label className="block text-blue-800 mb-2 font-medium">出發站</label>
          <select
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            className="w-full border border-blue-300 rounded-lg p-3 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">請選擇出發站</option>
            {stationList.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-blue-800 mb-2 font-medium">到達站</label>
          <select
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            className="w-full border border-blue-300 rounded-lg p-3 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">請選擇到達站</option>
            {stationList.map((station) => (
              <option key={station} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label className="block text-blue-800 mb-2 font-medium">出發日期</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-blue-300 rounded-lg p-3 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
        >
          查詢班次
        </button>

        <div className="mt-8">
          <h3 className="text-blue-600 font-semibold mb-2">查詢結果</h3>
          <ul className="divide-y divide-blue-100">
            {results.map((r, i) => (
              <li key={i} className="py-3 flex justify-between items-center">
                <span className="text-blue-800">{r.train}</span>
                <span className="text-blue-500">{r.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Search;
