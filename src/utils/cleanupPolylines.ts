export const cleanupPolylines = (polylineRef: Record<string, google.maps.Polyline>) => {
  Object.values(polylineRef).forEach((poly) => poly.setMap(null));
};