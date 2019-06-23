(function (w) {
    w.transform={};

    function css(node,type,val){
        if(arguments.length >= 3){
            //设置操作
            var text ="";
            if(!node.transform){
                node.transform ={}
            }
            node.transform[type] = val;

            for(var item in node.transform){
                switch (item)  {
                    case "translateX":
                    case "translateY":
                    case "translateZ":
                        text+= item+"("+node.transform[item]+"px)";
                        break;

                    case "rotateX":
                    case "rotateY":
                    case "rotateZ":
                    case "rotate":
                        text+= item+"("+node.transform[item]+"deg)";
                        break;

                    case "scale":
                        text+= item+"("+node.transform[item]+")";
                        break;
                }
            }

            node.style.transform = text;
        }else if(arguments.length === 2){
            //读取操作
            val = node.transform?node.transform[type]:undefined;

            if(val === undefined){
                val = 0;
                if(type === "scale"){
                    val = 1;
                }
            }
            return val;
        }else{
            throw new Error("该函数至少需要2个参数")
        }
    }

    w.transform.css = css;
})(window)