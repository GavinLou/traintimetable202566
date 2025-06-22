import { useEffect, useState } from "react";
import { Box, Flex, Select } from "@chakra-ui/react";
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Portal } from "@ark-ui/react";
import { createListCollection } from "@chakra-ui/react";
import L from "leaflet";
import { getTDXToken } from "../Token.tsx";

type Shape = {
    LineID: string;
    LineName: { Zh_tw: string };
    Geometry: string;
};

type Station = {
    StationID: string;
    StationName: { Zh_tw: string; En: string };
    StationPosition: { PositionLon: number; PositionLat: number };
    StationAddress: string;
    StationURL: string;
};


function parseGeometry(wkt: string): [number, number][][] {
    if (wkt.startsWith("LINESTRING")) {
        const match = wkt.match(/LINESTRING\s*\(([^)]+)\)/);
        if (!match) return [];
        const line = match[1].split(",").map(pair => {
            const [lng, lat] = pair.trim().split(" ").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
                return [lat, lng] as [number, number];
            }
            return null;
        }).filter((coord): coord is [number, number] => coord !== null);
        return [line];
    }
    if (wkt.startsWith("MULTILINESTRING")) {
        const match = wkt.match(/LINESTRING\s*\(([^)]+)\)/);
        if (!match) return [];
        const line = match[1].split(",").map(pair => {
            const [lng, lat] = pair.trim().split(" ").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) {
                return [lat, lng] as [number, number];
            }
            return null;
        }).filter((coord): coord is [number, number] => coord !== null);
        return [line];
    }
    return [];
}


const smallIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [15, 22],
    iconAnchor: [9, 28],
    popupAnchor: [1, -24],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [28, 28],
});

function MapFlyTo({ positions }: { positions: [number, number][][] }) {
    const map = useMap();
    const allPoints = positions.flat();
    if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.flyToBounds(bounds, { padding: [50, 50] });
    }
    return null;
}

export default function Trainmap() {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [stations, setStations] = useState<Station[]>([]);
    const [selectedLineId, setSelectedLineId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            const token = await getTDXToken();
            const [shapeRes, stationRes] = await Promise.all([
                fetch("https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Shape?%24format=JSON", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Station?%24format=JSON", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);
            const shapeData = await shapeRes.json();
            const stationData = await stationRes.json();
            setShapes(shapeData.Shapes || []);
            setStations(stationData.Stations || []);
        }
        fetchData();
    }, []);

    const selectedShape = shapes.find(s => s.LineID === selectedLineId);
    const polylines = selectedShape ? parseGeometry(selectedShape.Geometry) : [];

    return (
        <Box maxW="5xl" mx="auto" mt={8} p={6} bg="white" borderRadius="lg" boxShadow="md">
            <Flex gap={4} mb={4}>
                <Select.Root
                    width="300px"
                    collection={createListCollection({
                        items: shapes.map(shape => ({
                            label: shape.LineName.Zh_tw,
                            value: shape.LineID,
                        }))
                    })}
                    value={[selectedLineId ?? ""]}
                    onValueChange={e => setSelectedLineId(e.value[0] ?? null)}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="請選擇鐵路線" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {shapes.map(shape => (
                                    <Select.Item item={{ value: shape.LineID, label: shape.LineName.Zh_tw }} key={shape.LineID}>
                                        {shape.LineName.Zh_tw}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Flex>
            <MapContainer center={[23.5, 121]} zoom={7} style={{ height: "600px", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {polylines.length > 0 && <MapFlyTo positions={polylines} />}
                {polylines.map((positions, idx) => (
                    <Polyline key={idx} positions={positions} color="blue" weight={8} />
                ))}
                {stations.map(station => (
                    <Marker
                        key={station.StationID}
                        position={[station.StationPosition.PositionLat, station.StationPosition.PositionLon]}
                        icon={smallIcon}
                    >
                        <Popup>
                            <b>{station.StationName.Zh_tw}</b><br />
                            {station.StationAddress}<br />
                            <a href={station.StationURL} target="_blank" rel="noopener noreferrer" style={{ color: "#3182ce" }}>
                                車站官方網站
                            </a>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Box>
    );
}