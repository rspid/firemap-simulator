import { Sensor } from "@/server/types";
import "leaflet/dist/leaflet.css";
import React from "react";
import { Circle, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

type MapType = {
  data: {
    sensors?: Sensor[];
  };
};

const Map = ({ data }: MapType) => {
  const { sensors } = data;
  return (
    <div>
      <MapContainer
        center={[45.763377, 4.861766]}
        zoom={14}
        style={{ height: "100vh", width: "100vw" }}
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png" />
        {sensors?.map((sensor) => (
          <Circle
            key={sensor.id}
            center={[sensor.latitude, sensor.longitude]}
            radius={sensor.intensity * 20}
            color={"#FF4901"}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
