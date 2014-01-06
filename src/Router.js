/**
 * Created with IntelliJ IDEA.
 * User: root
 * Date: 13-11-18
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */

var url = require("url");
var logger = require("log4js").getLogger("Router");

function route(handlerMapping, request, response){
    var pathName = url.parse(request.url).pathname;

    logger.info("to route a request for: " + pathName);

    var splitArray = pathName.split("/");
    if(typeof handlerMapping[splitArray[1]] === "function"){
        handlerMapping[splitArray[1]](request, response);
    }else{
        logger.error("No request handler found for " + pathName);
        response.writeHeader(404, "text/html");
        response.end();
    }
}

exports.route = route;
