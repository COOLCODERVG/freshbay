import { useEffect, useState, useMemo, useCallback } from "react";
import Map, { Source, Layer, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "pk.eyJ1Ijoidmd1ZGUyMDA5IiwiYSI6ImNtNzZvMXp6YjA4djIybHExenBvZXhxMGcifQ.MFH6I1WXFzVEHU_Oms3iFA";

const countiesLayer = {
  id: "counties",
  type: "fill",
  source: "counties",
  paint: {
    "fill-color": "#088",
    "fill-opacity": 0.8,
  },
};

const highlightLayer = {
  id: "county-highlight",
  type: "fill",
  source: "counties",
  paint: {
    "fill-color": "#f00",
    "fill-opacity": 0.8,
  },
};

const countyData = [
    { "name": "Alameda", "lat": 37.65, "lon": -121.92, "population": 1671329, "foodInsecurity": 8.4, "povertyRate": 9.3, "priority": 0.42 },
    { "name": "Alpine", "lat": 38.58, "lon": -119.82, "population": 1129, "foodInsecurity": 12.1, "povertyRate": 11.5, "priority": 0.68 },
    { "name": "Amador", "lat": 38.35, "lon": -120.77, "population": 40097, "foodInsecurity": 10.3, "povertyRate": 9.8, "priority": 0.54 },
    { "name": "Butte", "lat": 39.67, "lon": -121.60, "population": 211632, "foodInsecurity": 13.2, "povertyRate": 16.5, "priority": 0.72 },
    { "name": "Calaveras", "lat": 38.19, "lon": -120.68, "population": 46286, "foodInsecurity": 9.7, "povertyRate": 10.1, "priority": 0.49 },
    { "name": "Colusa", "lat": 39.14, "lon": -122.02, "population": 21441, "foodInsecurity": 11.5, "povertyRate": 13.2, "priority": 0.63 },
    { "name": "Contra Costa", "lat": 37.93, "lon": -121.97, "population": 1163837, "foodInsecurity": 7.9, "povertyRate": 8.4, "priority": 0.35 },
    { "name": "Del Norte", "lat": 41.74, "lon": -124.20, "population": 27112, "foodInsecurity": 14.6, "povertyRate": 17.8, "priority": 0.80 },
    { "name": "El Dorado", "lat": 38.78, "lon": -120.53, "population": 192843, "foodInsecurity": 7.2, "povertyRate": 7.5, "priority": 0.31 },
    { "name": "Fresno", "lat": 36.75, "lon": -119.77, "population": 1017681, "foodInsecurity": 14.3, "povertyRate": 20.2, "priority": 0.79 },
    { "name": "Glenn", "lat": 39.60, "lon": -122.39, "population": 28693, "foodInsecurity": 12.9, "povertyRate": 15.4, "priority": 0.71 },
    { "name": "Humboldt", "lat": 40.80, "lon": -124.16, "population": 134623, "foodInsecurity": 13.9, "povertyRate": 16.1, "priority": 0.75 },
    { "name": "Imperial", "lat": 32.85, "lon": -115.57, "population": 181827, "foodInsecurity": 16.2, "povertyRate": 23.4, "priority": 0.83 },
    { "name": "Inyo", "lat": 36.60, "lon": -118.06, "population": 18039, "foodInsecurity": 11.6, "povertyRate": 13.7, "priority": 0.62 },
    { "name": "Kern", "lat": 35.37, "lon": -119.02, "population": 900202, "foodInsecurity": 15.1, "povertyRate": 21.9, "priority": 0.81 },
    { "name": "Kings", "lat": 36.08, "lon": -119.81, "population": 152940, "foodInsecurity": 14.8, "povertyRate": 20.5, "priority": 0.79 },
    { "name": "Lake", "lat": 39.10, "lon": -122.76, "population": 64686, "foodInsecurity": 14.3, "povertyRate": 18.7, "priority": 0.77 },
    { "name": "Lassen", "lat": 40.42, "lon": -120.65, "population": 30873, "foodInsecurity": 13.0, "povertyRate": 15.9, "priority": 0.72 },
    { "name": "Los Angeles", "lat": 34.05, "lon": -118.25, "population": 10039107, "foodInsecurity": 12.3, "povertyRate": 13.4, "priority": 0.66 },
    { "name": "Madera", "lat": 37.25, "lon": -119.77, "population": 157327, "foodInsecurity": 14.2, "povertyRate": 19.6, "priority": 0.78 },
    { "name": "Marin", "lat": 38.00, "lon": -122.53, "population": 258826, "foodInsecurity": 6.8, "povertyRate": 6.5, "priority": 0.24 },
    { "name": "Mariposa", "lat": 37.50, "lon": -119.96, "population": 17203, "foodInsecurity": 10.8, "povertyRate": 11.2, "priority": 0.55 },
    { "name": "Mendocino", "lat": 39.31, "lon": -123.49, "population": 86749, "foodInsecurity": 12.7, "povertyRate": 15.3, "priority": 0.70 },
    { "name": "Merced", "lat": 37.30, "lon": -120.48, "population": 277680, "foodInsecurity": 15.0, "povertyRate": 22.1, "priority": 0.82 },
    { "name": "Modoc", "lat": 41.60, "lon": -120.71, "population": 8841, "foodInsecurity": 11.9, "povertyRate": 14.2, "priority": 0.64 },
    { "name": "Mono", "lat": 37.94, "lon": -118.97, "population": 14444, "foodInsecurity": 10.9, "povertyRate": 12.3, "priority": 0.57 },
    { "name": "Monterey", "lat": 36.60, "lon": -121.89, "population": 437325, "foodInsecurity": 13.5, "povertyRate": 17.8, "priority": 0.76 },
    { "name": "Napa", "lat": 38.50, "lon": -122.33, "population": 137744, "foodInsecurity": 9.4, "povertyRate": 10.2, "priority": 0.50 },
    { "name": "Nevada", "lat": 39.30, "lon": -120.76, "population": 99755, "foodInsecurity": 8.6, "povertyRate": 9.9, "priority": 0.46 },
    { "name": "Orange", "lat": 33.72, "lon": -117.87, "population": 3175692, "foodInsecurity": 8.2, "povertyRate": 9.1, "priority": 0.40 }
  ];

export default function HeatMap() {
  const [geojson, setGeojson] = useState(null);
  const [hoverInfo, setHoverInfo] = useState<{
    longitude: number;
    latitude: number;
    countyName: string;
    countyDetails?: any; // Add this line
  } | null>(null);
  const settings = useState({
    scrollZoom: true,
    boxZoom: true,
    dragRotate: true,
    dragPan: true,
    keyboard: true,
    doubleClickZoom: true,
    touchZoomRotate: true,
    touchPitch: true,
    minZoom: 0,
    maxZoom: 6,
    minPitch: 0,
    maxPitch: 85
  });

  useEffect(() => {
    fetch("https://gis-calema.opendata.arcgis.com/datasets/59d92c1bf84a438d83f78465dce02c61_0.geojson")
      .then((response) => response.json())
      .then((data) => {
        setGeojson(data);
      });
  }, []);

  const onHover = useCallback(
    (event: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      const county = event.features && event.features[0];
      if (county) {
        const countyName = county.properties.CountyName;
        const details = countyData.find(c => c.name === countyName);
        setHoverInfo({
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
          countyName: countyName,
          countyDetails: details // Add this line
        });
      } else {
        setHoverInfo(null);
      }
    },
    []
  );

  const selectedCounty = hoverInfo?.countyName || "";
  const filter = useMemo(() => ["in", "CountyName", selectedCounty], [selectedCounty]);

  return (
    <>
      <Map
        initialViewState={{
          latitude: 37.729,
          longitude: -120.36,
          zoom: 6,
          bearing: 0,
          pitch: 30,
        }}
        {...settings}
        style={{ width: "100%", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/light-v10"
        mapboxAccessToken={MAPBOX_TOKEN}
        onMouseMove={onHover}
        interactiveLayerIds={["counties"]}
      >
        {geojson && (
          <Source id="counties" type="geojson" data={geojson}>
            <Layer beforeId="waterway-label" {...countiesLayer} />
            <Layer beforeId="waterway-label" {...highlightLayer} filter={filter} />
          </Source>
        )}
        {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            offset={[0, -10]}
            closeButton={false}
            className="county-info"
          >
            <div>
              <strong>{hoverInfo.countyName}</strong>
              {hoverInfo.countyDetails && (
                <>
                  <div>Population: {hoverInfo.countyDetails.population}</div>
                  <div>Food Insecurity: {hoverInfo.countyDetails.foodInsecurity}%</div>
                  <div>Poverty Rate: {hoverInfo.countyDetails.povertyRate}%</div>
                  <div>Priority: {hoverInfo.countyDetails.priority}</div>
                </>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
}