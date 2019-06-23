(function (w) {
    w.slide = {};
    function course(arr) {
        var wrapC = document.querySelector(".course-wrap");
        if(!wrapC){
            return;
        }

        //生成html结构
        var wrapC = document.querySelector(".course-wrap");
        var ulNode = document.createElement("ul");
        //开启3D硬件加速
        transform.css(ulNode,"translateZ",0);
        var liNodes = document.querySelectorAll(".course-wrap > .list > li")
        var wrapP = document.querySelector(".course-wrap > .course-point");



        //无缝 && 自动轮播
        var pointsLength = arr.length;
        var needWF = wrapC.getAttribute("needWF")
        var needAuto = wrapC.getAttribute("needAuto");
        needAuto= needAuto==null?false:true;
        needWF  = needWF==null?false:true;
        if(needWF){
            arr = arr.concat(arr);
        }
        ulNode.size =arr.length;

        //生成图片列表
        ulNode.classList.add("list");
        for(var i=0;i<arr.length;i++){
            ulNode.innerHTML+="<li><img src= "+(arr[i])+"></li>";
        }
        wrapC.appendChild(ulNode);

        //动态化样式
        var styleNode = document.createElement("style");
        styleNode.innerHTML=".course-wrap > .list{width: "+arr.length+"00%}";
        styleNode.innerHTML+=".course-wrap > .list > li{width: "+(100/arr.length)+"%;}";
        document.head.appendChild(styleNode);


        //滑屏逻辑
        var eleStartX = 0; // 元素一开始的位置
        var eleStartY = 0; // 元素一开始的位置
        var startX = 0;    // 手指一开始的位置
        var startY = 0;    // 手指一开始的位置
        var index = 0;    //  手指抬起时ul的位置

        //防抖动
        var isFirst = true;
        var isX = true;  // true:x   false:y

        wrapC.addEventListener("touchstart",function (ev) {
            //清定时器
            clearInterval(ulNode.timer);

            //清过渡
            ulNode.style.transition="";
            ev = ev || event;
            var touchC = ev.changedTouches[0];


            /*无缝逻辑
                点击第一组第一张时 跳到第二组的第一张
                点击第二组最后一张时 跳到第一组的最后一张*/
            if(needWF){
                var whichPic = transform.css(ulNode,"translateX") / document.documentElement.clientWidth;
                if(whichPic === 0){
                    whichPic = -pointsLength;
                }else if (whichPic === 1-arr.length){
                    whichPic = 1-pointsLength;
                }
                transform.css(ulNode,"translateX",whichPic*document.documentElement.clientWidth)
            }

            //元素一开始位置的获取一定要等无缝位置初始化完毕
            eleStartX =transform.css(ulNode,"translateX");
            eleStartY =transform.css(ulNode,"translateY");
            startX = touchC.clientX;
            startY = touchC.clientY;

            isX = true;
            isFirst = true;
        })
        wrapC.addEventListener("touchmove",function (ev) {

            //看门狗   防的都是第二次之后的抖动
            if(!isX){
                //咬住
                return;
            }


            ev = ev || event;
            var touchC = ev.changedTouches[0];
            var nowX = touchC.clientX;
            var nowY = touchC.clientY;

            var disX = nowX - startX;
            var disY = nowY - startY;

            /*防抖动:
                在轮播图上 如果用户首次滑动的方向是x轴  那轮播图产生抖动是正常的现象
                在轮播图上 如果用户首次滑动的方向是y轴  那竖向页面产生抖动是正常的现象*/


            if(isFirst){
                isFirst = false;
                if(Math.abs(disY) > Math.abs(disX)){
                    //在y轴上滑
                    isX=false;
                     return; // 首次在Y轴上滑  首次防抖动
                }
            }

           transform.css(ulNode,"translateX",eleStartX + disX);
        })
        wrapC.addEventListener("touchend",function () {
            ulNode.style.transition=".5s transform";
            //index 代表ul的位置
            index = Math.round(transform.css(ulNode,"translateX") / document.documentElement.clientWidth);

            //控制超出
            if(index>0){
                index=0;
            }else if(index < 1-arr.length){
                index =  1-arr.length;
            }

            //小圆点
            smallPointMove(index);

            //index 代表ul的位置
            transform.css(ulNode,"translateX",index*document.documentElement.clientWidth);

            //重新开启自动轮播
            if(needAuto&&needWF){
                autoMove(ulNode,index);
            }
        })


        //小圆点
        smallPoint(pointsLength);

        //自动轮播
        if(needAuto&&needWF){
            autoMove(ulNode,index);
        }
    }

    function autoMove(ulNode,autoFlag) {
        //var timer = 0;
        //var autoFlag = 0; // 抽象ul的位置

        move();
        function move() {
            clearInterval(ulNode.timer);
            ulNode.timer = setInterval(function () {
                autoFlag--;
                ulNode.style.transition=".7s transform linear";
                transform.css(ulNode,"translateX",autoFlag*document.documentElement.clientWidth);

                //小圆点
                smallPointMove(autoFlag)
            },1000)
        }

        ulNode.addEventListener("transitionend",function () {
            //判断不要写太死
            if(autoFlag <= 1-ulNode.size){
                autoFlag=-((ulNode.size)/2-1);
                ulNode.style.transition="";
                transform.css(ulNode,"translateX",autoFlag*document.documentElement.clientWidth);
            }
        })
    }
    function smallPoint(pointsLength){
        var wrapP = document.querySelector(".course-wrap > .course-point");
        wrapP.pointsLength =pointsLength;
        if(wrapP){
            for(var i=0;i<pointsLength;i++){
                if(i==0){
                    wrapP.innerHTML+="<span class='active'></span>";
                }else {
                    wrapP.innerHTML+="<span></span>";
                }
            }
        }
    }
    function smallPointMove(index){
        var wrapP = document.querySelector(".course-wrap > .course-point");
        if(wrapP){
            var points = wrapP.querySelectorAll("span");
            for(var i=0;i<points.length;i++){
                points[i].classList.remove("active");
            }
            points[-index%wrapP.pointsLength].classList.add("active")
        }
    }

    w.slide.course = course;
})(window)