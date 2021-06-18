var x_PI = (3.14159265358979324 * 3000.0) / 180.0
var PI = 3.1415926535897932384626
var a = 6378245.0
var ee = 0.00669342162296594323

function calX(lng, z) {
  return Math.floor(Math.pow(2, z - 1) * (lng / 180 + 1))
}
function calY(lat, z) {
  var x = Math.tan((Math.PI * lat) / 180)
  var y = 1 / Math.cos((Math.PI * lat) / 180)
  var q = Math.log(x + y) / Math.PI
  return Math.floor(Math.pow(2, z - 1) * (1 - q))
}
//输入GCJ经纬度 转WGS纬度
function WGSLat(lat, lon) {
  var PI = 3.14159265358979324 //圆周率
  var a = 6378245.0 //克拉索夫斯基椭球参数长半轴a
  var ee = 0.00669342162296594323 //克拉索夫斯基椭球参数第一偏心率平方
  var dLat = transformlat(lon - 105.0, lat - 35.0)
  var radLat = (lat / 180.0) * PI
  var magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  var sqrtMagic = Math.sqrt(magic)
  dLat = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI)
  return lat - dLat
}
//输入GCJ经纬度 转WGS经度
function WGSLon(lat, lon) {
  var PI = 3.14159265358979324 //圆周率
  var a = 6378245.0 //克拉索夫斯基椭球参数长半轴a
  var ee = 0.00669342162296594323 //克拉索夫斯基椭球参数第一偏心率平方
  var dLon = transformlng(lon - 105.0, lat - 35.0)
  var radLat = (lat / 180.0) * PI
  var magic = Math.sin(radLat)
  magic = 1 - ee * magic * magic
  var sqrtMagic = Math.sqrt(magic)
  dLon = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI)
  return lon - dLon
}

function gcj02towgs84(lng, lat) {
  var lat = +lat
  var lng = +lng
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0)
    var dlng = transformlng(lng - 105.0, lat - 35.0)
    var radlat = (lat / 180.0) * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
    var mglat = lat + dlat
    var mglng = lng + dlng
    return [lng * 2 - mglng, lat * 2 - mglat]
  }
}

function out_of_china(lng, lat) {
  var lat = +lat
  var lng = +lng
  // 纬度3.86~53.55,经度73.66~135.05
  return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)
}

function wgs84togcj02(lng, lat) {
  var lat = +lat
  var lng = +lng
  if (out_of_china(lng, lat)) {
    return [lng, lat]
  } else {
    var dlat = transformlat(lng - 105.0, lat - 35.0)
    var dlng = transformlng(lng - 105.0, lat - 35.0)
    var radlat = (lat / 180.0) * PI
    var magic = Math.sin(radlat)
    magic = 1 - ee * magic * magic
    var sqrtmagic = Math.sqrt(magic)
    dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI)
    dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI)
    var mglat = lat + dlat
    var mglng = lng + dlng
    return [mglng, mglat]
  }
}

function transformlng(x, y) {
  var PI = 3.14159265358979324 //圆周率
  var ret =
    300.0 +
    x +
    2.0 * y +
    0.1 * x * x +
    0.1 * x * y +
    0.1 * Math.sqrt(Math.abs(x))
  ret +=
    ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) /
    3.0
  ret +=
    ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0
  ret +=
    ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) *
      2.0) /
    3.0
  return ret
}
//转换纬度所需
function transformlat(x, y) {
  PI = 3.14159265358979324 //圆周率
  ret =
    -100.0 +
    2.0 * x +
    3.0 * y +
    0.2 * y * y +
    0.1 * x * y +
    0.2 * Math.sqrt(Math.abs(x))
  ret +=
    ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) /
    3.0
  ret +=
    ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0
  ret +=
    ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) *
      2.0) /
    3.0
  return ret
}
