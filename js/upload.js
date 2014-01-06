/**
 * Created with IntelliJ IDEA.
 * User: root
 * Date: 13-11-26
 * Time: 下午4:23
 * To change this template use File | Settings | File Templates.
 */

$(function(){

    var fileInputJQ = $(":input[name=excelFile]");
    var uploadButtonJQ = $(":submit[name=submit]");
    var errorTipJQ = $("#js-error");
    var fileFormatExp = new RegExp("\\.xls$|\\.xlsx$", "i");
    var callbackNameExp = new RegExp("^window.__handleUploadResponseData");
    var iframeJQ = $("iframe[name=js-iframe]");
    var formJQ = $("#uploadForm");

    var resultContainerJQ = $("#js-result-container");

    /**
     * 解决某些浏览器的bug：修改文件后，不触发change
     */
    fileInputJQ.click(function(){
        setTimeout(function(){
            fileInputJQ.blur();//用blur以触发change
        }, 0);
    });

    /**
     * 文件发生变化时
     */
    fileInputJQ.change(function(){
        if(fileFormatExp.test($.trim(fileInputJQ.val()))){
            uploadButtonJQ.removeAttr("disabled");
            errorTipJQ.text("").css("visibility", "hidden");
        }else{
            uploadButtonJQ.attr("disabled", true);
            errorTipJQ.css("visibility", "visible").html('请选择正确的文件类型！');
        }
    });

    /**
     * 点击上传按钮时
     */
    uploadButtonJQ.click(function(){
        if(_check()){
            resultContainerJQ.hide();
            _showUploadProgressDialog(true);
            formJQ.submit();

            return true;
        }

        return false;
    });

    /**
     * 当iframe收到数据时，对返回值进行处理
     */
    iframeJQ.load(function(){
        var data = $.trim(iframeJQ.contents().find('body').text());
        if(data === ""){
            return;
        }

        if(callbackNameExp.test(data)){//回调函数名称校验
            window.eval(data);
        }else{
            errorTipJQ.css("visibility", "visible").html("内部错误，请联系开发人员：ruifeng.lin@qunar.com。");
        }
    });

    /**
     * 校验sheet 数量是否合法
     * @private
     */
    function _check(){
        if(fileInputJQ.val() === ""){
            errorTipJQ.css("visibility", "visible").html("请先选择Excel文件");
            return false;
        }

        var value = $.trim($(":input[name=number]").val());
        if(value === ""){
            errorTipJQ.css("visibility", "visible").html("sheet序号不可为空");
            return false;
        }

        if(/^[1-9]d*/.test(value) === false){
            errorTipJQ.css("visibility", "visible").html("sheet数量必须为正整数");
            return false;
        }

        errorTipJQ.css("visibility", "hidden");
        return true;
    }

    /**
     * 展示处理进度的提示
     * @param flag
     * @private
     */
    function _showUploadProgressDialog(flag){
        $(document).trigger("showErrorMessage", ["上传处理中....."]);
    }

    /**
     * 展示错误消息
     */
    $(document).bind("showErrorMessage", function(event, message){
        errorTipJQ.text(message).css("visibility", "visible");
    });

    /**
     * 是否以卡片形式浏览结果
     */
    $(document).delegate(":input[name=card]", "change", function(){
        var thisJQ = $(this);
        if(thisJQ.val() === "0"){
            $("#js-result-ul").show();
            $("#js-result-div").hide();

            thisJQ.val("1");
        }else{
            $("#js-result-ul").hide();
            $("#js-result-div").show();

            thisJQ.val("0");
        }
    });

    window.__handleUploadResponseData = function(result){
        if(result.ret){
            switch(result.code){
                case 0 : //解析成功
                    $(document).trigger("showErrorMessage", [""]);

                    window.handleData(result.data, resultContainerJQ);
                    break;

                case -1://解析出错
                case 1://没有使用post方式上传
                case 2://上传后，服务端无法读取文件
                    $(document).trigger("showErrorMessage", [result.message]);
                    resultContainerJQ.hide();
            }
        }else{
            $(document).trigger("showErrorMessage", ["服务端处理出错！"]);
        }
    };
});

