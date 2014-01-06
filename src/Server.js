/**
 * Created with IntelliJ IDEA.
 * User: root
 * Date: 13-11-18
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */

var http = require("http");
var url = require("url");
var logger = require("log4js").getLogger("Server");

/**
 * 启动服务器
 */
function startServer(route, handlerMapping){
    http.createServer(function(request, response){
        route(handlerMapping, request, response);
    }).listen(8888);

    logger.info("Server has started.");
}

exports.startServer = startServer;