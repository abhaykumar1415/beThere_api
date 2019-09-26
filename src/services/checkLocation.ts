const offices = Object.freeze({
  pune: {
    lat: 18.5622951,
    lng: 73.9070875
  }
})

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
}

const getDistanceFromLatLonInM = (lat1,lon1,lat2,lon2) => {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  d = d * 1000;
  return d;
}

const isValidDistance = (userLat, userLng) => {
  let distance = getDistanceFromLatLonInM(offices.pune.lat, offices.pune.lng, userLat, userLng);
  console.log("IsValidDistance ", distance);
  return distance < 50 ? true : false;
}

const CheckDistance = {isValidDistance}

export default CheckDistance;
