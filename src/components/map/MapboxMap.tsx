"use client";

import { useEffect, useRef } from "react";

interface MapboxMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export function MapboxMap({ latitude, longitude, zoom = 10 }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;

    import("mapbox-gl").then(({ default: mapboxgl }) => {
      import("mapbox-gl/dist/mapbox-gl.css" as any);
      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/light-v11",
        center: [longitude, latitude],
        zoom,
      });

      mapRef.current = map;

      map.on("load", () => {
        new mapboxgl.Marker({ color: "#0f1f3d" })
          .setLngLat([longitude, latitude])
          .addTo(map);
        map.addControl(new mapboxgl.NavigationControl(), "top-right");
        map.scrollZoom.disable();
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return <div ref={mapContainer} className="w-full h-full" style={{ minHeight: "340px", background: "#e8e8e8" }} />;
}
