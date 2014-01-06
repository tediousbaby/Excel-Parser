/**
 * 辅助按钮的处理：复制+清空
 * Created by szzrzt on 13-12-20.
 */

$(function(){

    /**
     * 复制按钮点击
     */
    $("#uploadForm button.copy").zclip({
        path: "swf/ZeroClipboard.swf",
        copy: function(){
            return $("#uploadForm textarea[name=template]").val();
        },
        clickAfter: false,
        afterCopy: function(){//prevent default behavior
        }
    });

    /**
     * 清空按钮点击
     */
    $("#uploadForm").delegate("button.empty", "click", function(){
        $("#uploadForm textarea[name=template]").val("");
        return false;
    });

    /**
     * 为处理结果中的“复制”按钮绑定复制事件
     */
    $(document).bind("bindCopyForResult", function(){
        $("#js-result-ul div.copy button").each(function(idx, buttonDOM){
            $(buttonDOM).zclip({
                path: "swf/ZeroClipboard.swf",
                copy: function(){
                    return $(this).closest("li.js-item").find("textarea.result_item").val();
                },
                clickAfter: false,
                afterCopy: function(){//prevent default behavior
                }
            });
        });

        $("#js-result-div div.totalcopy button").zclip({
            path: "swf/ZeroClipboard.swf",
            copy: function(){
                return $(this).closest("div.total").find("textarea").val();
            },
            clickAfter: false,
            afterCopy: function(){//prevent default behavior
            }
        });
    });

});
