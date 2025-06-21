import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
    return (
        <div>
            <MapContainer center={[23.5, 121]} zoom={7} >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[25.0478, 121.5319]}>
                    <Popup>
                        台北車站<br />台鐵便當
                    </Popup>
                </Marker>
                <Marker position={[24.1477, 120.6736]}>
                    <Popup>
                        台中車站<br />台鐵便當
                    </Popup>
                </Marker>
                <Polyline positions={[[25.0478, 121.5319], [24.1477, 120.6736]]} color="blue" />
            </MapContainer>
        </div>
    )
}