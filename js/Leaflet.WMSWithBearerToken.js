const __fetchBlobAndGetUrlAsync = async (url, token) => {
  const result = await fetch(url, {
    headers: {
      'Authorization': token ? 'Bearer ' + token : ''
    }
  });
  return URL.createObjectURL(await result.blob());
};

L.NonTiledLayer.WMSWithBearerToken = L.NonTiledLayer.WMS.extend({
  getImageUrl: null,
  getImageUrlAsync: function (bounds, width, height, key, done) {
    const url = L.NonTiledLayer.WMS.prototype.getImageUrl.call(this, bounds, width, height);
    __fetchBlobAndGetUrlAsync(url, this.options.token).then(url => {
      done(key, url, null)
    })
  }
});

L.NonTiledLayer.wmsWithBearerToken = function (url, options) {
  return new L.NonTiledLayer.WMSWithBearerToken(url, options);
}

L.TileLayer.WMSWithBearerToken = L.TileLayer.WMS.extend({
  createTile(coords, done) {
    const url = this.getTileUrl(coords);
    const img = document.createElement('img');
    __fetchBlobAndGetUrlAsync(url, this.options.token).then(url => {
      img.src = url;
      done(null, img);
    })
    return img;
  }
});

L.TileLayer.wmsWithBearerToken = function (url, options) {
  return new L.TileLayer.WMSWithBearerToken(url, options);
}
