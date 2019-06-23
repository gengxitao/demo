;(function () {
    //抽象小绿的下标
    // var index = 0;
    //拿到一个tap的包裹区域    为了获取一个包裹区域的宽度
    var wrap = document.querySelector(".tap-wrap");
    //拿到所有的滑屏元素!!!   它也是我们的滑屏区域!!!
    var contentNodes = document.querySelectorAll(".tap-wrap .tap-content");
    var loadings = document.querySelectorAll(".tap-wrap .tap-content .loading");
    setTimeout(function () {
        for(var i=0;i<loadings.length;i++){
            loadings[i].style.height = contentNodes[0].offsetHeight+"px";
        }
    },20) // 这个时间不能定死 !!!  很有可能20ms之后还是没有渲染到高度
    //批量的给滑屏元素加逻辑
    for(var i=0;i<contentNodes.length;i++){
        contentNodes[i].index=0;
        move(contentNodes[i]);
    }


    // 基本的滑屏逻辑 (防抖动的)
    function move(contentNode) {
        //矫正整个滑屏元素的位置  让它显示主体内容
        transform.css(contentNode,"translateX",-wrap.clientWidth);

        //必要的滑屏参数
        var elePoint={x:0,y:0};
        var startPoint = {x:0,y:0};
        var isX =true;
        var isFirst =true;
        var dis = {x:0,y:0};
        contentNode.addEventListener("touchstart",function (ev) {
            if(contentNode.isJump){
                return;
            }
            contentNode.style.transition="";
            ev = ev || event;
            var touchC = ev.changedTouches[0];
            elePoint.x = transform.css(contentNode,"translateX");
            elePoint.y = transform.css(contentNode,"translateY");
            startPoint.x = touchC.clientX;
            startPoint.y = touchC.clientY;

            isX =true;
            isFirst =true;
        })
        contentNode.addEventListener("touchmove",function (ev) {
            if(contentNode.isJump){
                return;
            }
            if(!isX){
                return;
            }

            ev = ev || event;
            var touchC = ev.changedTouches[0];
            var nowPoint = {x:0,y:0};
            nowPoint.x = touchC.clientX;
            nowPoint.y = touchC.clientY;
            dis.x = nowPoint.x -  startPoint.x;
            dis.y = nowPoint.y -  startPoint.y;

            if(isFirst){
                isFirst = false;
                if(Math.abs(dis.y) > Math.abs(dis.x)){
                    isX = false;
                    return;
                }
            }

            transform.css(contentNode,"translateX" ,elePoint.x+dis.x);
            jump(dis.x,contentNode);
        })
        contentNode.addEventListener("touchend",function (ev) {
            if(contentNode.isJump){
                return;
            }
            ev = ev || event;
            if(Math.abs(dis.x) <= wrap.clientWidth/2){
                contentNode.style.transition="1s transform";
                transform.css(contentNode,"translateX",-wrap.clientWidth)
            }
        })
    }

    // 1/2 跳转(手指没有抬起)
    function jump(disX,contentNode) {
        // 判断手指滑动的距离是否大于wrap宽度的一半
        if(Math.abs(disX) > wrap.clientWidth/2){
            // 进入jump的1/2跳转后   整个手动的滑屏要全部禁止掉!!
            contentNode.isJump = true;
            console.log("jump")
            contentNode.style.transition="1s transform";
            var translateX = disX > 0 ?0:-2*wrap.clientWidth;
            transform.css(contentNode,"translateX",translateX);

            var loadings = contentNode.querySelectorAll(".loading");
            var smallG = contentNode.parentNode.querySelector(".tap-nav .smallG")
            var aNodes = contentNode.parentNode.querySelectorAll(".tap-nav a")

            contentNode.addEventListener("transitionend",end)


            function end() {
                contentNode.removeEventListener("transitionend",end)

                for(var i=0;i<loadings.length;i++){
                    loadings[i].style.opacity=1;
                }

                //小绿要跑起来
                disX > 0 ? contentNode.index--:contentNode.index++;
                if(contentNode.index<0){
                    contentNode.index = aNodes.length-1;
                }else if(contentNode.index > aNodes.length-1){
                    contentNode.index = 0;
                }
                smallG.style.width = aNodes[contentNode.index].offsetWidth+"px";
                transform.css(smallG,"translateX",aNodes[contentNode.index].offsetLeft);


                //发送ajax请求   拿定时器模拟一下
                setTimeout(function () {
                    //通过ajax获取到的后台数据  根据index不一样拿不一样的数据  访问不一样的接口

                    var arr=[
                        ["./img/a.jpg","./img/b.jpg","./img/c.jpg","./img/d.jpg","./img/e.jpg","./img/f.jpg"],
                        ["./img/2/a2.jpg","./img/2/b2.png","./img/2/c2.png","./img/2/d2.png","./img/2/e2.jpg","./img/2/f2.jpg"],
                        ["./img/a.jpg","./img/b.jpg","./img/c.jpg","./img/d.jpg","./img/e.jpg","./img/f.jpg"],
                        ["./img/2/a2.jpg","./img/2/b2.png","./img/2/c2.png","./img/2/d2.png","./img/2/e2.jpg","./img/2/f2.jpg"],
                        ["./img/a.jpg","./img/b.jpg","./img/c.jpg","./img/d.jpg","./img/e.jpg","./img/f.jpg"],
                        ["./img/2/a2.jpg","./img/2/b2.png","./img/2/c2.png","./img/2/d2.png","./img/2/e2.jpg","./img/2/f2.jpg"],
                    ]

                    //进行dom操作
                    var imgs = contentNode.querySelectorAll("img");
                    for(var i=0;i<imgs.length;i++){
                        imgs[i].src = arr[contentNode.index][i];
                    }
                    //将滑屏元素拉回来
                    contentNode.style.transition="";
                    transform.css(contentNode,"translateX",-wrap.clientWidth);
                    //让整个滑屏元素可以继续滑动
                    contentNode.isJump=false;
                },3000)
            }
        }
    }
})()