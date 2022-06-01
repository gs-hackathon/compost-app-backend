var api_route = "/api/v" + process.env.API_VER;
var RoutesWithJWT = [{
    id: 0,
    name: "API_USER_ROUTE",
    route: api_route + "/user",
    function: require("../routes/user"),
}];
var RoutesWithOuthJWT = [{
        id: 0,
        name: "API_INDEX_ROUTE",
        route: api_route,
        function: require("../routes/index"),
    },
    {
        id: 1,
        name: "API_AUTHENTICATE_ROUTE",
        route: api_route + "/auth",
        function: require("../routes/auth"),
    }
];
module.exports = { RoutesWithOuthJWT, RoutesWithJWT };