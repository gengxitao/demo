/*
无缝滑屏:
    滑屏区域 : 一个视口的大小
    滑屏元素:
        ul: 图片的个数 * 一个视口的大小 (js)
        li: 一个视口的大小

可拖拽的导航:
    滑屏区域: 一个视口的大小
    滑屏元素:
        ul:
            将li的display设置为inline-block 可以使li在ul内部横向排列;
            可是ul的宽度拿的是父级的100%(auto);这个时候li会换行.
            设置ul的white-space为no-wrap 强制让ul内的行内 行内块元素不换行
            设置ul的float为left 目的是使li撑开ul的宽度
        li: 尺寸不固定 靠内容撑开

手动橡皮筋效果:
    在手指滑屏时,让滑屏元素滑动的距离越来越大 但是增幅越来越小

    第一次的方案
        css(list,"translateX",translateX)
        translateX = eleStartX + szDisX*scale;


        eleStartX: 手指点击到屏幕上时,元素一开始的位置
        szDisX:  (var szDisX = szNowX - szStartX)
            ?? 是不是一次touchMove 手指滑动的距离???????
             不是

        translateX = touchstart时元素的位置 + 整组touchmove手指滑动的距离 * 一个越来越小的比例

    第二次的方案
        css(list,"translateX",translateX)
        translateX = 上一次touchmove结束时元素的位置 + 本次touchmove手指滑动的距离 * 一个越来越小的比例

快速滑屏
快速滑屏的橡皮筋效果
*/

;(function () {
    //滑屏区域
    var nav = document.querySelector("#wrap > .content  .nav");
    //滑屏元素
    var list = document.querySelector("#wrap > .content  .nav >.list");

    var eleStartX = 0;
    var szStartX = 0;
    var minX = nav.clientWidth - list.offsetWidth;


    // 手动橡皮筋效果
    var lastPoint = 0; //手指上一次的位置
    var lastTime = 0;  //上一次touchmove触发的时间
    var disTime =1;
    var disPoint =0;


    nav.addEventListener("touchstart",function (ev) {
        ev = ev || event;
        list.style.transition = "none";
        var touchC = ev.changedTouches[0];
        eleStartX = transform.css(list,"translateX");
        szStartX =touchC.clientX;

        lastPoint =touchC.clientX;
        lastTime = new Date().getTime();

        // 解决速度的残留
        list.handMove = false;
        disPoint =0;
        disTime =1;
    })
    nav.addEventListener("touchmove",function (ev) {
        ev = ev || event;
        //基本滑屏逻辑
        var touchC = ev.changedTouches[0];
        var szNowX = touchC.clientX;
        var szDisX = szNowX - szStartX;
        var translateX = eleStartX+szDisX;


        // 手动橡皮筋效果
        var nowPoint = touchC.clientX; // 手指当前的位置
        var nowTime = new Date().getTime();
        disTime = nowTime - lastTime;
        disPoint = nowPoint - lastPoint; // 手指一次touchmove的距离
        lastPoint = nowPoint;
        lastTime = nowTime;

        // 让每一次手指滑动的有效距离越来越小
        var scale = 0;
        if(translateX > 0 ){
            list.handMove = true;
            scale = document.documentElement.clientWidth / ((document.documentElement.clientWidth + translateX)*2);
            translateX = transform.css(list,"translateX")+ disPoint*scale;
        }else if(translateX < minX){
            list.handMove = true;
            var over = minX - translateX;
            scale = document.documentElement.clientWidth / ((document.documentElement.clientWidth + over)*2);
            translateX = transform.css(list,"translateX") + disPoint*scale;
        }

        transform.css(list,"translateX",translateX);
    })
    nav.addEventListener("touchend",function (ev) {
        ev = ev || event;

        if(!list.handMove){
            fast(disPoint,disTime,list,)
        }else{
            var translateX = transform.css(list,"translateX");
            if(translateX > 0 ){
                translateX =0;
            }else if(translateX < minX){
                translateX =minX;
            }
            list.style.transition = "1s transform";
            transform.css(list,"translateX",translateX);
        }
    })
    function fast(disPoint,disTime,list,) {
        var speed = disPoint / disTime;
        var time = 0;
        speed = Math.abs(speed) < 0.3 ? 0 : speed;
        time = Math.abs(speed)*0.2;
        time = time>2?2:time;
        time = time<0.4?0.5:time;
        console.log(speed)

        var translateX = transform.css(list,"translateX");
        var targetX =  translateX + speed*200;

        //快速滑屏的橡皮筋效果
        var bsr = "";
        if(targetX > 0 ){
            targetX =0;
            bsr = "cubic-bezier(.09,1.51,.65,1.73)";
        }else if(targetX < minX){
            targetX = minX;
            bsr = "cubic-bezier(.09,1.51,.65,1.73)";
        }

        list.style.transition = time+"s "+bsr+" transform";
        transform.css(list,"translateX",targetX);
    }


    //点击变色
    changeColor();
    function changeColor() {
        var liNodes = document.querySelectorAll("#wrap > .content  .nav >.list li");
        var list = document.querySelector("#wrap > .content  .nav >.list");
        var nav = document.querySelector("#wrap > .content  .nav");
        nav.addEventListener("touchstart",function () {
            nav.isMoved = false;
        })
        nav.addEventListener("touchmove",function () {
            nav.isMoved = true;
        })

        list.addEventListener("touchend",function (ev) {
            ev = ev || event;
            if(!nav.isMoved){
                for (var i = 0; i < liNodes.length; i++) {
                    tools.removeClass(liNodes[i], "active");
                }
                if (ev.target.nodeName.toUpperCase() === "LI") {
                    tools.addClass(ev.target, "active")
                } else if (ev.target.nodeName.toUpperCase() === "A") {
                    tools.addClass(ev.target.parentNode, "active")
                }
            }
        })



       /* for(var i=0;i<liNodes.length;i++){
            liNodes[i].addEventListener("touchend",function (ev) {
               if(!nav.isMoved){
                   ev = ev || event;
                   for(var i=0;i<liNodes.length;i++){
                       tools.removeClass(liNodes[i],"active");
                   }
                   tools.addClass(this,"active")
               }
            })
        }*/
    }
})()