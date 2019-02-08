L.PtvLayer.prototype.runRequest = function (url, request, token, handleSuccess, handleError) {
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? 'Bearer ' + token : ''
        }
    })
    .then(res => res.json())
    .then(res => handleSuccess(res))
    .catch(err => handleError(err));
}

L.PtvLayer.TruckAttributes.prototype.getRequest = function (world1, world2, width, height) {
    const request = L.PtvLayer.prototype.getRequest.call(this, world1, world2, width, height);
    request.layers = [{
        '$type': 'FeatureLayer',
        'name': 'PTV_TruckAttributes',
        'visible': true,
        'objectInfos': 'REFERENCEPOINT'
    }
    ];
    request.callerContext.properties[0].value = 'truckattributes';
    return request;
}