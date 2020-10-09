const RESTAPI_TYPES = {
    GET: 1,
    GET_ID: 2,
    POST: 3,
    PUT: 4,
    DELETE: 5
}
Object.freeze(RESTAPI_TYPES);

module.exports = {
    RESTAPI_TYPES,
    ALL_RESTAPI_TYPES: [
        RESTAPI_TYPES.GET,
        RESTAPI_TYPES.GET_ID,
        RESTAPI_TYPES.POST,
        RESTAPI_TYPES.PUT,
        RESTAPI_TYPES.DELETE
    ]
}