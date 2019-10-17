import numeral from 'numeral';

const degreesToRadians = degrees => (degrees * Math.PI) / 180;

export default {
  distanceInKmBetweenEarthCoordinates: (latlng1, latlng2) => {
    let { latitude: lat1, longitude: lon1 } = latlng1;
    let { latitude: lat2, longitude: lon2 } = latlng2;
    const earthRadiusKm = 6371;

    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c;

    return Number(numeral(distance).format('0.00'));
  },
  angleFromCoordinate: (latlng1, latlng2) => {
    const { latitude: lat1, longitude: lon1 } = latlng1;
    const { latitude: lat2, longitude: lon2 } = latlng2;
    const p1 = {
      x: lat1,
      y: lon1
    };

    const p2 = {
      x: lat2,
      y: lon2
    };
    // angle in radians
    const angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    // angle in degrees
    const angleDeg = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

    // document.getElementById('rotation').innerHTML ="Rotation : "+ angleDeg;
    return angleDeg;
  }
};
