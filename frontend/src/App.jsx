import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";

function App() {
  const [parcels, setParcels] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/parcels")
      .then((response) => response.json())
      .then((data) => {
        setParcels(data);
      })
      .catch((error) => console.error("Erreur API:", error));
  }, []);

  const onEachParcel = (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedParcel(feature.properties);
      },
    });
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapContainer
        center={[49.51, 3.9]}
        zoom={17}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {parcels && <GeoJSON data={parcels} onEachFeature={onEachParcel} />}

        {selectedParcel && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1000,
              background: "white",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              minWidth: "220px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Parcelle sélectionnée</h3>
            <p>
              <strong>ID :</strong> {selectedParcel.id}
            </p>
            <p>
              <strong>Object RID :</strong> {selectedParcel.object_rid}
            </p>
            <p>
              <strong>TEX :</strong> {selectedParcel.tex}
            </p>
            <p>
              <strong>Surface :</strong> {selectedParcel.supf}
            </p>
            <button onClick={() => setSelectedParcel(null)}>Fermer</button>
          </div>
        )}
      </MapContainer>
    </div>
  );
}

export default App;
