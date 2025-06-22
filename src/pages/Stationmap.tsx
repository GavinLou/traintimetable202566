import { useState, useEffect } from "react";
import { Box, Image, Flex, Heading, Select, createListCollection } from "@chakra-ui/react";
import { Portal } from "@ark-ui/react";
import { getTDXToken } from "../Token.tsx";

type ExitMapURL = {
    MapName: { Zh_tw: string; En: string };
    MapURL: string;
    FloorLevel: string;
};

type Station = {
    StationID: string;
    StationName: { Zh_tw: string; En: string };
    ExitMapURLs: ExitMapURL[];
};

export default function Stationmap() {
    const [stations, setStations] = useState<Station[]>([]);
    const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
    const [selectedMapIdx, setSelectedMapIdx] = useState<string | null>(null);

    useEffect(() => {
        async function fetchExits() {
            const token = await getTDXToken();
            const res = await fetch("https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/StationExit?%24format=JSON", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setStations(data.StationExits || []);
        }
        fetchExits();
    }, []);

    const selectedStation = stations.find((s) => s.StationID === selectedStationId);
    const exitMaps = selectedStation?.ExitMapURLs || [];
    const selectedMap = selectedMapIdx !== null ? exitMaps[Number(selectedMapIdx)] : undefined;


    return (
        <Box maxW="lg" mx="auto" mt={8} p={6} bg="white" borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>車站地圖查詢</Heading>
            <Flex gap={4} mb={4}>
                {/* 車站選單 */}
                <Select.Root
                    collection={createListCollection({
                        items: stations.map((station) => ({
                            label: station.StationName.Zh_tw,
                            value: station.StationID,
                        }))
                    })}
                    width="200px"
                    value={[selectedStationId ?? ""]}
                    onValueChange={(e) => {
                        setSelectedStationId(e.value[0] ?? null);
                        setSelectedMapIdx(null);
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="請選擇車站" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {stations.map((station) => (
                                    <Select.Item item={{ value: station.StationID, label: station.StationName.Zh_tw }} key={station.StationID}>
                                        {station.StationName.Zh_tw}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>

                {/* 出口地圖選單 */}
                <Select.Root
                    width="200px"
                    collection={createListCollection({
                        items: exitMaps.map((map, idx) => ({
                            value: String(idx),
                            label: map.MapName.Zh_tw || "地圖",
                        }))
                    })}
                    value={[selectedMapIdx ?? ""]}
                    onValueChange={e => setSelectedMapIdx(e.value[0] ?? null)}
                    disabled={!selectedStation}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="請選擇出口地圖" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {exitMaps.map((map, idx) => (
                                    <Select.Item item={{ value: String(idx), label: map.MapName.Zh_tw || "地圖" }} key={idx}>
                                        {map.MapName.Zh_tw || "地圖"}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Flex>
            {selectedMap && (
                <Box mt={4} textAlign="center">
                    {selectedMap.MapURL ? (
                        <Image
                            src={selectedMap.MapURL}
                            alt={selectedMap.MapName.Zh_tw || "地圖"}
                            maxH="1000px"
                            maxW="100%"
                            mx="auto"
                        />
                    ) : (
                        <Box fontSize="2xl" color="gray.400" py={20}>無</Box>
                    )}
                    <Box mt={2} color="gray.600">{selectedMap.MapName.Zh_tw || "地圖"}</Box>
                </Box>
            )}
        </Box>
    );
}