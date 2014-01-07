/**
 * Created with IntelliJ IDEA.
 * User: root
 * Date: 13-11-18
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */

process.setMaxListeners(0);

var server = require("./Server");
var router = require("./Router");
var requestHandler = require("./RequestHandler");

var handlerMapping = {};
handlerMapping.swf = requestHandler.swf;
handlerMapping.css = requestHandler.css;
handlerMapping.js = requestHandler.js;
handlerMapping.form = requestHandler.form;
handlerMapping.upload = requestHandler.upload;

server.startServer(router.route, handlerMapping);