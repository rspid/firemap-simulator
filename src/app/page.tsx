"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const MapComponent = dynamic(() => import("../components/Map"), {
  ssr: false,
});

const MyPage = () => {
  const [sensors, setSensors] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/sensor/active");
        setSensors(response.data);
      } catch (error) {
        console.error("Erreur lors de la requête à votre API", error);
      }
    };
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 20000); // 10000 millisecondes = 10 secondes

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const data = { sensors };

  return (
    <div>
      <MapComponent data={data} />
    </div>
  );
};

export default MyPage;
