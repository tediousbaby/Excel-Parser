/**
 * Created with IntelliJ IDEA.
 * User: root
 * Date: 13-11-25
 * Time: 下午9:18
 * To change this template use File | Settings | File Templates.
 */

var fs = require("fs");
var url = require("url");
var util = require("util");
var excelParser = require('excel-parser');
var async = require("async");
var logger = require("log4js").getLogger("ExcelHandler");

/**
 *
 * @param request
 * @param response
 * @param filePath
 * @param number    sheet序号
 */
function parseExcel(request, response, filePath, number){
    logger.info("start to parse excel file, file: " + filePath);

    excelParser.parse({
        inFile: filePath,
        worksheet: number,
        skipEmpty: false
    }, function(err, records){
        fs.unlink(filePath, function(){//上传之后异步删除文件
            logger.info("delete file:" + filePath);
        });

        var result = {
            "ret": true,
            "code": (err ? -1 : 0),
            "message": (err ? "解析Excel文件出错，请检查Excel的内容" : ""),
            "data": records
        };

        if(err){
            logger.error(err);
        }else{
            logger.info("Excel解析结果为：" + records);
        }

        var callbackName = url.parse(request.url, true).query.callback;

        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(callbackName + "(" + JSON.stringify(result) + ")", "UTF-8");
        response.end();
    });
}

/**
 *
 */
function handleHoganTemplate(){

}

exports.parseExcel = parseExcel;