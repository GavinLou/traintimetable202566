import { useState, useEffect } from "react";
import { Select, Button, Text, Heading, createListCollection } from "@chakra-ui/react";
import { getTDXToken } from "../Token.tsx";
import { Portal } from "@ark-ui/react";

type Station = {
    StationID: string;
    StationName: { Zh_tw: string };
};

type TimetableResult = {
    TrainInfo: {
        TrainNo: string;
        TrainTypeName: { Zh_tw: string };
        TrainTypeCode: string; // Add this line
    };
    StopTimes: Array<{
        StationID: string;
        StationName: { Zh_tw: string };
        ArrivalTime: string;
        DepartureTime: string;
    }>;
};


export default function Buyticket() {
    const [stations, setStations] = useState<Station[]>([]);
    const [fromStation, setFromStation] = useState<string>("");
    const [toStation, setToStation] = useState<string>("");
    const [date, setDate] = useState<string>(() => {
        const d = new Date();
        return d.toISOString().slice(0, 10);
    });
    const [results, setResults] = useState<TimetableResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [trainTypes, setTrainTypes] = useState<string[]>([]);
    const [selectedTrainType, setSelectedTrainType] = useState<string>("");
    const [odFares, setOdFares] = useState<any[]>([]);

    // 取得所有車站
    useEffect(() => {
        async function fetchStations() {
            const token = await getTDXToken();
            const res = await fetch(
                "https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Station?%24format=JSON",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setStations(data.Stations || []);
        }
        fetchStations();
    }, []);

    // 查詢班次
    const handleSearch = async () => {
        if (!fromStation || !toStation || !date) return;
        setLoading(true);
        const token = await getTDXToken();
        // 查詢班次
        const url = `https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/DailyTrainTimetable/OD/${fromStation}/to/${toStation}/${date}?$format=JSON`;
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setResults(data.TrainTimetables || []);
        // 取得所有車種（不重複）
        const types = Array.from(
            new Set((data.TrainTimetables || []).map((r: TimetableResult) => r.TrainInfo.TrainTypeName.Zh_tw))
        );
        setTrainTypes(types as string[]);
        setSelectedTrainType(""); // 查詢後預設顯示全部

        // 查詢票價（只查一次，所有班次都用同一票價）
        const fareUrl = `https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/ODFare/${fromStation}/to/${toStation}?$format=JSON`;
        const fareRes = await fetch(fareUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const fareData = await fareRes.json();
        setOdFares(fareData.ODFares || []);
        setLoading(false);
    };

    // 下載票券檔案
    const handleDownload = (train: TimetableResult, fromStop: any, toStop: any, fare: number | null) => {
        const fromName = fromStop.StationName.Zh_tw;
        const toName = toStop.StationName.Zh_tw;
        const content = `
台鐵訂票
車次：${train.TrainInfo.TrainNo}
車種：${train.TrainInfo.TrainTypeName.Zh_tw}
出發站：${fromName} ${fromStop.DepartureTime}
到達站：${toName} ${toStop.ArrivalTime}
日期：${date}
票價：${fare !== null ? fare + " 元" : "查無"}
        `;
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ticket_${train.TrainInfo.TrainNo}_${date}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // 取得單一班次的票價（用 TrainTypeCode 對應 ODFares 的 TrainType）
    function getFareByTrainType(trainTypeCode: string) {
        const odFare = odFares.find(f => String(f.TrainType) === String(trainTypeCode));
        return odFare?.Fares?.[0]?.Price ?? null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center pt-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <Heading size="lg" textAlign="center" mb={10}>
                    線上訂票
                </Heading>

                <div className="mb-10">
                    <Text mb={2}>出發站</Text>
                    <Select.Root
                        mb="2"
                        width="100%"
                        collection={createListCollection({
                            items: stations.map(station => ({
                                label: station.StationName.Zh_tw,
                                value: station.StationID,
                            })),
                        })}
                        value={[fromStation ?? ""]}
                        onValueChange={e => setFromStation(e.value[0] ?? "")}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="請選擇出發站" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {stations.map(station => (
                                        <Select.Item
                                            item={{
                                                value: station.StationID,
                                                label: station.StationName.Zh_tw,
                                            }}
                                            key={station.StationID}
                                        >
                                            {station.StationName.Zh_tw}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </div>

                <div className="mb-10">
                    <Text mb={2}>到達站</Text>
                    <Select.Root
                        mb="2"
                        width="100%"
                        collection={createListCollection({
                            items: stations.map(station => ({
                                label: station.StationName.Zh_tw,
                                value: station.StationID,
                            })),
                        })}
                        value={[toStation ?? ""]}
                        onValueChange={e => setToStation(e.value[0] ?? "")}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="請選擇到達站" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {stations.map(station => (
                                        <Select.Item
                                            item={{
                                                value: station.StationID,
                                                label: station.StationName.Zh_tw,
                                            }}
                                            key={station.StationID}
                                        >
                                            {station.StationName.Zh_tw}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </div>

                <div className="mb-12">
                    <Text mb={2}>出發日期</Text>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <Button
                    mt="4"
                    colorScheme="blue"
                    size="lg"
                    w="100%"
                    mb={8}
                    onClick={handleSearch}
                    loading={loading}
                    disabled={!fromStation || !toStation}
                >
                    查詢班次
                </Button>
                <div className="mb-8">
                    <Text mb={2}>車種篩選</Text>
                    <Select.Root
                        mb="2"
                        width="100%"
                        collection={createListCollection({
                            items: [
                                { label: "全部", value: "" },
                                ...trainTypes.map(type => ({
                                    label: type,
                                    value: type,
                                })),
                            ],
                        })}
                        value={[selectedTrainType]}
                        onValueChange={e => setSelectedTrainType(e.value[0] ?? "")}
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="全部" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    <Select.Item item={{ value: "", label: "全部" }} key="">
                                        全部
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                    {trainTypes.map(type => (
                                        <Select.Item item={{ value: type, label: type }} key={type}>
                                            {type}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </div>

                <div>
                    <ul className="divide-y divide-blue-100">
                        {results
                            .filter(r => !selectedTrainType || r.TrainInfo.TrainTypeName.Zh_tw === selectedTrainType)
                            .map((r, i) => {
                                const fromIdx = r.StopTimes.findIndex(
                                    s => s.StationID === fromStation
                                );
                                const toIdx = r.StopTimes.findIndex(
                                    s => s.StationID === toStation
                                );
                                if (fromIdx === -1 || toIdx === -1 || fromIdx >= toIdx) return null;
                                const fromStop = r.StopTimes[fromIdx];
                                const toStop = r.StopTimes[toIdx];
                                const fare = getFareByTrainType(r.TrainInfo.TrainTypeCode);
                                return (
                                    <li
                                        key={i}
                                        className="py-5 flex justify-between items-center gap-x-4"
                                    >
                                        <div className="flex-1 flex items-center gap-x-8 whitespace-pre">
                                            <span className="text-blue-800 font-bold">
                                                {r.TrainInfo.TrainTypeName.Zh_tw} {r.TrainInfo.TrainNo}
                                            </span>
                                            <span className="text-blue-500">
                                                {fromStop.DepartureTime} - {toStop.ArrivalTime}
                                            </span>
                                            <span className="text-green-700 font-semibold ml-8">
                                                票價：{fare ? `${fare} 元` : "查無"}
                                            </span>
                                        </div>
                                        <Button
                                            colorScheme="teal"
                                            size="sm"
                                            onClick={() => handleDownload(r, fromStop, toStop, fare)}
                                            disabled={!fare}
                                        >
                                            購買
                                        </Button>
                                    </li>
                                );
                            })
                            .filter(Boolean)}
                        {results.length === 0 && !loading && (
                            <li className="text-gray-400 py-5">無資料</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}