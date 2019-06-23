(function (w) {
    w.tools={};
   function trim(str) {
        // var reg = /^\s+|\s+$/g;
        var reg = /^\s*|\s*$/g;
        str = str.replace(reg,"")
        return str;
    }
    function addClass(node,className) {
        if(node){
            if(node.className){
                //代表className不为空
                var reg = new RegExp("\\s+"+className+"\\s+","i");
                var classStr = " "+node.className+" ";
                if(reg.test(classStr)){
                    //包含目标class
                }else {
                    //不包含目标class
                    node.className += " "+className;
                }
            }else {
                // 代表className为空
                node.className=className;
            }
        }else {
            throw new Error("当前节点不存在")
        }
    }
    function removeClass(node,className) {
        if(node){
            if(node.className){
                var classStr = " "+node.className+" ";
                var reg = new RegExp("\\s+"+(className)+"\\s+","ig");
                node.className =  trim(classStr.replace(reg," "))
                if(!node.className){
                    node.removeAttribute("class")
                }
            }
        }else {
            throw new Error("当前节点不存在");
        }
    }

    w.tools.addClass=addClass;
    w.tools.removeClass=removeClass;
    w.tools.trim=trim;
})(window)