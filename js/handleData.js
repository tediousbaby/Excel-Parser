/**
 * Created with IntelliJ IDEA.
 * User: root
 * Date: 13-11-26
 * Time: 下午4:58
 * To change this template use File | Settings | File Templates.
 */

/**
 *
 * @param data
 * @param resultContainerJQ
 */
window.handleData = function(data, resultContainerJQ){

    var templateString = $.trim($("textarea[name=template]").val());//TODO 将模板匹配符转换为大写
    var template = Hogan.compile(templateString);

    if(data && data.length > 0){
        var alphabetArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        var rowDataTemplate = Hogan.compile('<li class="js-item"><div class="copy"><span>行号：{{IDX}}</span>&nbsp;&nbsp;<button>复制</button></div><textarea class="result_item" cols="20" rows="20">{{ROW}}</textarea></li>');
        var resultULJQ = $("#js-result-ul");
        var resultTextareaJQ = $("#js-result-div textarea");

        var resultHtml = [];
        var resultContentHtml = [];
        $.each(data, function(idx, item){
            var renderData = {};

            $.each(item, function(_i, field){
                renderData["" + alphabetArray[_i]] = field;
            });

            resultHtml.push(rowDataTemplate.render({
                "ROW": template.render(renderData),
                "IDX": idx + 1
            }));

            resultContentHtml.push(template.render(renderData));
            resultContentHtml.push("\n\n");
        });

        resultULJQ.html(resultHtml.join("")).hide();
        resultTextareaJQ.html(resultContentHtml.join(""));
        resultContainerJQ.show();

        $(":input[name=card]").attr("checked", false).val("1").change();
        $(document).trigger("bindCopyForResult");//为“复制”按钮绑定复制事件
    }else{
        resultContainerJQ.hide();
        $(document).trigger("showErrorMessage", ["返回数据为空，请检查"]);
    }
};