/**
 * Created with IntelliJ IDEA.
 * User: root
 * Date: 13-11-18
 * Time: 上午10:27
 * To change this template use File | Settings | File Templates.
 */

var fs = require("fs");
var path = require("path");
var url = require("url");
var excelParse = require("./ExcelHandler");
var formidable = require("formidable");
var logger = require("log4js").getLogger("RequestHandler");

var basePath = path.dirname(__filename);//当前文件路径

/**
 * 访问swf的请求
 * @param request
 * @param response
 */
function swf(request, response){
    logger.info("Request for 'css' was called.....");

    var parseURL = url.parse(request.url, true);
    logger.info(parseURL);

    fs.readFile(path.join(basePath, ".." + parseURL.pathname), function(error, data){
        response.writeHead(200, {"Content-Type": "application/x-shockwave-flash;charset=UTF-8"});
        response.write(error ? "" : data);
        response.end();
    });
}

/**
 * 访问CSS的请求
 * @param request
 * @param response
 */
function css(request, response){
    logger.info("Request for 'css' was called.....");

    var parseURL = url.parse(request.url, true);
    logger.info(parseURL);

    fs.readFile(path.join(basePath, ".." + parseURL.pathname), function(error, data){
        response.writeHead(200, {"Content-Type": "text/css"});
        response.write(error ? "" : data, "UTF-8");
        response.end();
    });
}

/**
 * 访问js的请求
 * @param request
 * @param response
 */
function javascript(request, response){
    logger.info("Request for 'javascript' was called.....");

    var parseURL = url.parse(request.url, true);
    logger.info(parseURL);

    fs.readFile(path.join(basePath, ".." + parseURL.pathname), function(error, data){
        response.writeHead(200, {"Content-Type": "text/javascript"});
        response.write(error ? "" : data, "UTF-8");
        response.end();
    });
}

/**
 * 查看form表单的请求
 * @param request
 * @param response
 */
function form(request, response){
    logger.info("Request for 'form' was called.....");

    fs.readFile(path.join(basePath, "../html/form.html"), function(error, data){
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(error ? "" : data, "UTF-8");
        response.end();
    });
}

/**
 * 处理上传请求，并返回jsonp数据
 * @param request
 * @param response
 */
function upload(request, response){
    logger.info("Request for 'upload' was called.....");

    if(request.method.toLowerCase() !== "post"){
        uploadResult(request, response, {"ret": false, "code": 1, "message": "必须使用POST方式"});
        return;
    }

    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(basePath, "../upload");
    form.keepExtensions = true;

    form.on('field', function(field, value){
        logger.info(field, value);
    });

    form.on('file', function(field, file){
        logger.info(field, file);
    });

    form.on('end', function(){
        logger.info('-> upload done');
    });

    form.parse(request, function(err, fields, files){
        logger.info("upload complete.....");

        fs.exists(files.excelFile.path, function(result){
            if(result){
                excelParse.parseExcel(request, response, files.excelFile.path, parseInt(fields.number, 10));
            }else{
                logger.error("upload file is not exists .....filePath: " + files.excelFile.path);

                uploadResult(request, response, {"ret": false, "code": 2, "message": "上传文件出错，请联系开发人员：ruifeng.lin@qunar.com。"});
            }
        });

    });
}

/**
 *
 * @param request
 * @param response
 * @param message
 */
function uploadResult(request, response, result){
    var callbackName = url.parse(request.url, true).query.callback;

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(callbackName + "(" + JSON.stringify(result) + ")", "UTF-8");
    response.end();

}

exports.swf = swf;
exports.css = css;
exports.js = javascript;
exports.form = form;
exports.upload = upload;