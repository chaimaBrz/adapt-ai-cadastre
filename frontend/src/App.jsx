import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";

// Centre la carte automatiquement sur la parcelle trouvée lors d'une recherche
function ZoomToParcel({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center && center.coordinates) {
      const [lng, lat] = center.coordinates;
      map.flyTo([lat, lng], 18);
    }
  }, [center, map]);

  return null;
}

function App() {
  const [parcels, setParcels] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedParcelId, setSelectedParcelId] = useState(null);
  const [loadingParcel, setLoadingParcel] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searchCenter, setSearchCenter] = useState(null);

  // Charge toutes les parcelles au démarrage pour les afficher sur la carte
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
      setSearchError("");

      const parcelResponse = await fetch(
        `http://127.0.0.1:8000/parcels/${parcelId}`,
      );
      const parcelData = await parcelResponse.json();

      const ownerResponse = await fetch(
        `http://127.0.0.1:8000/parcels/${parcelId}/owner`,
      );
      const ownerData = await ownerResponse.json();

      const sireneResponse = await fetch(
        `http://127.0.0.1:8000/parcels/${parcelId}/sirene`,
      );
      const sireneData = await sireneResponse.json();

      setSelectedParcel({
        id: parcelData.id,
        object_rid: parcelData.object_rid,
        tex: parcelData.tex,
        supf: parcelData.supf,
        owner_name: ownerData?.owner_name || "Non renseigné",
        siren: ownerData?.siren || "Non renseigné",
        denomination: sireneData?.denomination || "Non renseigné",
        nom: sireneData?.nom || "Non renseigné",
        prenom: sireneData?.prenom || "Non renseigné",
        categorie_juridique: sireneData?.categorie_juridique || "Non renseigné",
        etat_administratif: sireneData?.etat_administratif || "Non renseigné",
        date_creation: sireneData?.date_creation || "Non renseigné",
      });
    } catch (error) {
      console.error("Erreur détail parcelle :", error);
      setSearchError("Erreur pendant le chargement de la parcelle");
    } finally {
      setLoadingParcel(false);
    }
  };
  // Recherche une parcelle par ID, Object RID ou SIREN
  const handleSearch = async () => {
    const value = searchValue.trim();

    if (!value) {
      setSearchError("Entrez un ID, un Object RID ou un SIREN");
      return;
    }

    try {
      setSearchError("");
      setLoadingParcel(true);

      const response = await fetch(
        `http://127.0.0.1:8000/parcels/search/${encodeURIComponent(value)}`,
      );
      const data = await response.json();

      if (!data) {
        setSelectedParcel(null);
        setSelectedParcelId(null);
        setSearchCenter(null);
        setSearchError("Aucune parcelle trouvée");
        return;
      }

      const ownerResponse = await fetch(
        `http://127.0.0.1:8000/parcels/${data.id}/owner`,
      );
      const ownerData = await ownerResponse.json();

      setSelectedParcel({
        id: data.id,
        object_rid: data.object_rid,
        tex: data.tex,
        supf: data.supf,
        owner_name: ownerData?.owner_name || "Non renseigné",
        siren: ownerData?.siren || "Non renseigné",
      });

      setSelectedParcelId(data.id);
      setSearchCenter(data.center);
    } catch (error) {
      console.error("Erreur recherche :", error);
      setSelectedParcel(null);
      setSelectedParcelId(null);
      setSearchCenter(null);
      setSearchError("Erreur pendant la recherche");
    } finally {
      setLoadingParcel(false);
    }
  };
  // Réinitialise la recherche et l'affichage des détails
  const resetSearch = () => {
    setSearchValue("");
    setSearchError("");
    setSelectedParcel(null);
    setSelectedParcelId(null);
    setSearchCenter(null);
    setLoadingParcel(false);
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

  // Déclenche le chargement des détails lorsqu'une parcelle est cliquée
  const onEachParcel = (feature, layer) => {
    layer.on({
      click: () => {
        loadParcelDetails(feature.properties.id);
      },
    });
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "60px",
          zIndex: 1000,
          background: "white",
          padding: "12px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="ID, Object RID ou SIREN"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            padding: "8px 10px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            minWidth: "180px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 12px",
            border: "none",
            borderRadius: "8px",
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          Rechercher
        </button>

        <button
          onClick={resetSearch}
          style={{
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            background: "white",
            color: "#111827",
            cursor: "pointer",
          }}
        >
          Réinitialiser
        </button>
      </div>

      {searchError && (
        <div
          style={{
            position: "absolute",
            top: "74px",
            left: "60px",
            zIndex: 1000,
            background: "#fee2e2",
            color: "#991b1b",
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #fecaca",
          }}
        >
          {searchError}
        </div>
      )}

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

        {searchCenter && <ZoomToParcel center={searchCenter} />}

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
                  <strong>Propriétaire :</strong> {selectedParcel.owner_name}
                </div>
                <div>
                  <strong>SIREN :</strong>{" "}
                  {selectedParcel.siren || "Non renseigné"}
                </div>
                <div>
                  <strong>Dénomination :</strong> {selectedParcel.denomination}
                </div>
                <div>
                  <strong>Nom :</strong> {selectedParcel.nom}
                </div>
                <div>
                  <strong>Prénom :</strong> {selectedParcel.prenom}
                </div>
                <div>
                  <strong>Catégorie juridique :</strong>{" "}
                  {selectedParcel.categorie_juridique}
                </div>
                <div>
                  <strong>État administratif :</strong>{" "}
                  {selectedParcel.etat_administratif}
                </div>
                <div>
                  <strong>Date de création :</strong>{" "}
                  {selectedParcel.date_creation}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setSelectedParcel(null);
                setSelectedParcelId(null);
                setSearchCenter(null);
                setSearchError("");
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
