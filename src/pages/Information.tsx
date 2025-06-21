import { useState } from "react";

export default function Information() {
    const [selectedStation, setSelectedStation] = useState<string>("");

    const stations = [
        "台北",
        "板橋",
        "桃園",
        "新竹",
        "台中",
        "嘉義",
        "台南",
        "高雄"
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">選擇車站</h2>
                <select
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">請選擇車站</option>
                    {stations.map((station) => (
                        <option key={station} value={station}>
                            {station}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}