export function init(opt) {
  var options = {
    container: null,
    step: 20,
    radius: 3,
    backImg: './images/china.png',
    markers: [],
  }
  options = Object.assign(options, opt)

  let ele = options.container,
    step = options.step,
    radius = options.radius,
    markers = options.markers
  // 加载图片
  var chinaImg = new Image()
  chinaImg.src = options.backImg
  chinaImg.width = options.container.offsetWidth
  chinaImg.height = options.container.offsetHeight
  chinaImg.onload = () => {
    // 加载canvas
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    let width = chinaImg.width
    let height = chinaImg.height
    canvas.width = width
    canvas.height = height
    ctx.drawImage(chinaImg, 0, 0, width, height)
    let imageData = ctx.getImageData(0, 0, width, height)
    drawParticles(ctx, imageData, step, radius)
    ele.append(canvas)
    drawMarkers(ele, markers, width, height)
  }
}

function createParticles(img, step) {
  var result = []
  for (var i = 0; i < img.width; i += step) {
    for (var j = 0; j < img.height; j += step) {
      if (0 !== img.data[4 * (j * img.width + i)]) {
        result.push({ x: i, y: j })
      }
    }
  }
  return result
}

function drawParticles(ctx, img, step, radius) {
  ctx.clearRect(0, 0, img.width, img.height)
  let result = createParticles(img, step)
  for (var i = 0; i < result.length; i++) {
    // ctx.fillRect(result[i].x, result[i].y, 5, 5)
    ctx.fillStyle = '#ccc'
    ctx.beginPath()
    ctx.arc(result[i].x, result[i].y, radius, 0, 2 * Math.PI)
    ctx.fill()
  }
}

function drawMarkers(ele, markers, w, h) {
  for (var i = 0; i < markers.length; i++) {
    let coord = geoCoordToScreenCoord(w, h, markers[i].x, markers[i].y)
    var markerEle = document.createElement('div')
    markerEle.classList.add('marker')
    markerEle.style.top = coord.y + 'px'
    markerEle.style.left = coord.x + 'px'
    ele.append(markerEle)
  }
}

function geoCoordToScreenCoord(w, h, lon, lat) {
  let maxLon = 135.05
  let minLon = 73.33
  let maxLat = 53.123
  let minLat = 18.1
  let scaleX = parseFloat(((maxLon - minLon) * 3600) / w)
  let scaleY = parseFloat(((maxLat - minLat) * 3600) / h)
  lon = parseFloat(lon)
  lat = parseFloat(lat)
  let screenX = parseFloat((lon * 3600) / scaleX)
  let screenY = parseFloat((lat * 3600) / scaleY)
  let minX = parseFloat((minLon * 3600) / scaleX)
  let minY = parseFloat((minLat * 3600) / scaleY)

  return {
    x: parseFloat(((lon - minLon) * 3600) / scaleX),
    y: parseFloat(((maxLat - lat) * 3600) / scaleY),
  }
}
