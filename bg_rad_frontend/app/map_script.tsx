import { MapContainer, Marker, TileLayer, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { LatLngExpression } from "leaflet";

function CenterMap({pos, scale}:{pos:LatLngExpression, scale:number}){
    const map = useMap();
    if(map.getSize().x > 1){
        map.setView(pos, scale)
    }
    return<></>
}

export default function leafletMap({pos, scale}:{pos:LatLngExpression, scale:number}){
    return (
        <MapContainer 
            center={pos}
            zoom={scale}
            scrollWheelZoom={false}
            className="map"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={pos}/>
            <CenterMap pos={pos} scale={scale}/>
        </MapContainer>
    );
}