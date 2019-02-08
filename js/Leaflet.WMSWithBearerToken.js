const __fetchBlobAndGetUrlAsync = async (url, token) => {
  const result = await fetch(url, {
    headers: {
      'Authorization': token ? 'Bearer ' + token : ''
    }
  });
  return URL.createObjectURL(await result.blob());
};

const __prototypeGetImageUrl = L.NonTiledLayer.WMS.prototype.getImageUrl;
L.NonTiledLayer.WMS.prototype.getImageUrl = null;
L.NonTiledLayer.WMS.prototype.getImageUrlAsync = function (bounds, width, height, key, done) {
  const url = __prototypeGetImageUrl.call(this, bounds, width, height);
  __fetchBlobAndGetUrlAsync(url, this.options.token).then(url => {
    done(key, url, null)
  })
};

L.TileLayer.WMS.prototype.createTile = function (coords, done) {
  const url = this.getTileUrl(coords);
  const img = document.createElement('img');
  __fetchBlobAndGetUrlAsync(url, this.options.token).then(url => {
    img.src = url;
    done(null, img);
  })
  return img;
};
