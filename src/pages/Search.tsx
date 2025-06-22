import React, { useState, useEffect } from "react";
import { Portal } from "@ark-ui/react";
import { createListCollection, Select, Button, Text, Heading } from "@chakra-ui/react";
import { getTDXToken } from "../Token.tsx";

type Station = {
  StationID: string;
  StationName: { Zh_tw: string };
};

type TimetableResult = {
  TrainInfo: {
    TrainNo: string;
    TrainTypeName: { Zh_tw: string };
  };
  StopTimes: Array<{
    StationID: string;
    StationName: { Zh_tw: string };
    ArrivalTime: string;
    DepartureTime: string;
  }>;
};

const Search: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [fromStation, setFromStation] = useState<string | null>(null);
  const [toStation, setToStation] = useState<string | null>(null);
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10); // yyyy-MM-dd
  });
  const [results, setResults] = useState<TimetableResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [trainTypes, setTrainTypes] = useState<string[]>([]);
  const [selectedTrainType, setSelectedTrainType] = useState<string>("");

  useEffect(() => {
    async function fetchStations() {
      const token = await getTDXToken();
      const res = await fetch("https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Station?%24format=JSON", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStations(data.Stations || []);
    }
    fetchStations();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromStation || !toStation || !date) return;
    setLoading(true);
    const token = await getTDXToken();
    const url = `https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/DailyTrainTimetable/OD/${fromStation}/to/${toStation}/${date}?%24format=JSON`;
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
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center pt-10">
      <form
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
        onSubmit={handleSearch}
      >
        <Heading textAlign={"center"}>查詢火車班表</Heading>

        <Text mb="2">出發站</Text>
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
          onValueChange={e => setFromStation(e.value[0] ?? null)}
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

        <Text mb="2">到達站</Text>
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
          onValueChange={e => setToStation(e.value[0] ?? null)}
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

        <Text mb="2">出發日期</Text>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border border-blue-300 rounded-lg p-3 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <Button
          mt="4"
          mb="2"
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition duration-200 shadow-md"
          disabled={loading}
        >
          {loading ? "查詢中..." : "查詢班次"}
        </Button>

        {/* 車種篩選 */}
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

        <div className="mt-16">
          <h3 className="text-blue-600 font-semibold mb-6">查詢結果</h3>
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
                return (
                  <li key={i} className="py-5 flex justify-between items-center">
                    <span className="text-blue-800">
                      {r.TrainInfo.TrainTypeName.Zh_tw} {r.TrainInfo.TrainNo}
                    </span>
                    <span className="text-blue-500">
                      {fromStop.DepartureTime} - {toStop.ArrivalTime}
                    </span>
                  </li>
                );
              })
              .filter(Boolean)}
            {results.filter(r => {
              const fromIdx = r.StopTimes.findIndex(s => s.StationID === fromStation);
              const toIdx = r.StopTimes.findIndex(s => s.StationID === toStation);
              return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
            }).length === 0 && !loading && (
                <li className="text-gray-400 py-5">無資料</li>
              )}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default Search;
