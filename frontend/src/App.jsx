import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

function App() {
  const [parcels, setParcels] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedParcelId, setSelectedParcelId] = useState(null);
  const [loadingParcel, setLoadingParcel] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/parcels")
      .then((response) => response.json())
      .then((data) => {
        setParcels(data);
      })
      .catch((error) => console.error("Erreur API:", error));
  }, []);

  const loadParcelDetails = async (parcelId) => {
    try {
      setLoadingParcel(true);
      setSelectedParcelId(parcelId);

      const response = await fetch(`http://127.0.0.1:8000/parcels/${parcelId}`);
      const data = await response.json();

      setSelectedParcel(data);
    } catch (error) {
      console.error("Erreur détail parcelle :", error);
    } finally {
      setLoadingParcel(false);
    }
  };

  const getParcelStyle = (feature) => {
    const isSelected = feature.properties.id === selectedParcelId;

    return {
      color: isSelected ? "#dc2626" : "#2563eb",
      weight: isSelected ? 4 : 2,
      fillColor: isSelected ? "#f87171" : "#60a5fa",
      fillOpacity: isSelected ? 0.45 : 0.2,
    };
  };

  const onEachParcel = (feature, layer) => {
    layer.on({
      click: () => {
        loadParcelDetails(feature.properties.id);
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

        {parcels && (
          <GeoJSON
            key={selectedParcelId || "default"}
            data={parcels}
            style={getParcelStyle}
            onEachFeature={onEachParcel}
          />
        )}

        {(selectedParcel || loadingParcel) && (
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: 1000,
              background: "white",
              padding: "16px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              minWidth: "260px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "12px" }}>
              Détail de la parcelle
            </h3>

            {loadingParcel ? (
              <p style={{ margin: 0 }}>Chargement...</p>
            ) : (
              <div style={{ display: "grid", gap: "8px" }}>
                <div>
                  <strong>ID :</strong> {selectedParcel.id}
                </div>
                <div>
                  <strong>Object RID :</strong> {selectedParcel.object_rid}
                </div>
                <div>
                  <strong>Texte :</strong> {selectedParcel.tex}
                </div>
                <div>
                  <strong>Surface :</strong> {selectedParcel.supf}
                </div>
                <div>
                  <strong>SIREN :</strong>{" "}
                  {selectedParcel.siren || "Non renseigné"}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedParcel(null);
                setSelectedParcelId(null);
              }}
              style={{
                marginTop: "14px",
                padding: "8px 12px",
                border: "none",
                borderRadius: "8px",
                background: "#111827",
                color: "white",
                cursor: "pointer",
              }}
            >
              Fermer
            </button>
          </div>
        )}
      </MapContainer>
    </div>
  );
}

export default App;
