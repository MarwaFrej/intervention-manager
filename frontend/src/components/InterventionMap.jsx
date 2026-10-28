
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import { MapPin, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";

function InterventionMap({ intervention }) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const address = [
    intervention.street,
    intervention.address,
    intervention.postalCode,
    intervention.city,
    intervention.country,
  ]
    .filter(Boolean)
    .join(", ");

  useEffect(() => {
    let cancelled = false;

    async function geocodeAddress() {
      setLoading(true);
      setError("");
      setPosition(null);

      try {
        const params = new URLSearchParams({
          q: [
            intervention.street,
            intervention.postalCode,
            intervention.city,
            intervention.country,
          ]
            .filter(Boolean)
            .join(", "),
          limit: "1",
        });

        const response = await fetch(
          `https://data.geopf.fr/geocodage/search?${params}`
        );

        if (!response.ok) {
          throw new Error("Service de géolocalisation indisponible.");
        }

        const data = await response.json();
        const feature = data.features?.[0];
        const coordinates = feature?.geometry?.coordinates;

        if (!coordinates || coordinates.length < 2) {
          throw new Error("Adresse introuvable sur la carte.");
        }

        if (!cancelled) {
          setPosition({
            longitude: coordinates[0],
            latitude: coordinates[1],
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Impossible de localiser cette adresse.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (intervention.street && intervention.city) {
      geocodeAddress();
    } else {
      setError("L'adresse de cette intervention est incomplète.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [
    intervention.street,
    intervention.postalCode,
    intervention.city,
    intervention.country,
  ]);

  const itineraryUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Localisation de l'intervention
        </h2>
        <p className="mt-1 text-sm text-slate-500">{address}</p>
      </div>

      {loading && (
        <p className="text-sm text-slate-500">
          Recherche de l'adresse...
        </p>
      )}

      {error && (
        <p className="text-sm text-amber-700">{error}</p>
      )}

      {position && (
        <div className="h-80 overflow-hidden rounded-lg">
          <MapContainer
            key={`${position.latitude}-${position.longitude}`}
            center={[position.latitude, position.longitude]}
            zoom={16}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
              position={[position.latitude, position.longitude]}
            >
              <Popup>{address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <a
        href={itineraryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        <Navigation size={17} />
        Lancer l'itinéraire
      </a>
    </section>
  );
}

export default InterventionMap;
