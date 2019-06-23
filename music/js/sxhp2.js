;(function (w) {
    w.sxhp={};
    function move(wrap,content,callBack){


        var eleStart = {x:0,y:0};
        var szStart = {x:0,y:0};
        var minY =0;   // 滑动的最大距离  只是这个值是一个负值


        /*
         1. 无缝滑屏容器的高度有时会拿不准确
         2. loading的高度
         3. minY的值
         */
        //在取滑动的最大距离时  页面还没有渲染完  导致minY值有误
        setTimeout(function () {
            minY = wrap.clientHeight - content.offsetHeight;
        },200) // 其实这个200ms也不准确 只是在大多数情况下200ms内页面是可以渲染完的



        // 手动橡皮筋效果
        var lastPoint = 0; //手指上一次的位置
        var lastTime = 0;  //上一次touchmove触发的时间
        var disTime =1;
        var disPoint =0;

        var isY = true;
        var isFirst=true;
        var clearTime=0;

        wrap.addEventListener("touchstart",function (ev) {
            //即点即停
            clearInterval(clearTime);
            ev = ev || event;
            content.style.transition = "none";
            var touchC = ev.changedTouches[0];
            eleStart.y = transform.css(content,"translateY");
            eleStart.x = transform.css(content,"translateX");
            szStart.y =touchC.clientY;
            szStart.x =touchC.clientX;

            lastPoint =touchC.clientY;
            lastTime = new Date().getTime();

            // 解决速度的残留
            content.handMove = false;
            disPoint =0;
            disTime =1;


            isY = true;
            isFirst=true;


            //组装外部逻辑
            if(callBack && (typeof callBack["start"]).toLowerCase() === "function"){
                callBack["start"].call(content);
            }
        })
        wrap.addEventListener("touchmove",function (ev) {
            if(!isY){
                return;
            }


            ev = ev || event;
            //基本滑屏逻辑
            var touchC = ev.changedTouches[0];
            var szNow ={x:0,y:0};
            szNow.x = touchC.clientX;
            szNow.y = touchC.clientY;
            var szDis = {x:0,y:0};
            szDis.x = szNow.x - szStart.x;
            szDis.y = szNow.y - szStart.y;

            var translateY = eleStart.y+szDis.y;
            // 手动橡皮筋效果
            var nowPoint = touchC.clientY; // 手指当前的位置
            var nowTime = new Date().getTime();
            disTime = nowTime - lastTime;
            disPoint = nowPoint - lastPoint; // 手指一次touchmove的距离
            lastPoint = nowPoint;
            lastTime = nowTime;


            if(isFirst){
                isFirst = false;
                if(Math.abs(szDis.y) < Math.abs(szDis.x)){
                    isY = false;
                    return;
                }
            }

            // 让每一次手指滑动的有效距离越来越小
            var scale = 0;
            if(translateY > 0 ){
                content.handMove = true;
                scale = document.documentElement.clientHeight / ((document.documentElement.clientHeight + translateY)*2);
                translateY = transform.css(content,"translateY")+ disPoint*scale;
            }else if(translateY < minY){
                content.handMove = true;
                var over = minY - translateY;
                scale = document.documentElement.clientHeight / ((document.documentElement.clientHeight + over)*2);
                translateY = transform.css(content,"translateY") + disPoint*scale;
            }

            transform.css(content,"translateY",translateY);

            //组装外部逻辑
            if(callBack && (typeof callBack["move"]).toLowerCase() === "function"){
                callBack["move"].call(content);
            }
        })
        wrap.addEventListener("touchend",function (ev) {
            ev = ev || event;

            if(!content.handMove){
                fast(disPoint,disTime,content)
            }else{
                var translateY = transform.css(content,"translateY");
                if(translateY > 0 ){
                    translateY =0;
                }else if(translateY < minY){
                    translateY =minY;
                }
                content.style.transition = "1s transform";
                transform.css(content,"translateY",translateY);
            }

            //组装外部逻辑
            if(callBack && (typeof callBack["end"]).toLowerCase() === "function"){
                callBack["end"].call(content);
            }
        })

        // speed: -15 --> -0.3   0.3 ---> 15
        // time: 0.5 --> 2
        // 橡皮筋拉伸长度系数  100
        var Tween ={
            Linear: function(t,b,c,d){ return c*t/d + b; },
            Back:function(t,b,c,d,s){
                if (s == undefined) s = 1.70158;
                return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
            }
        }
        function fast(disPoint,disTime,content,) {
            var speed = disPoint / disTime;
            var time = 0;
            speed = Math.abs(speed) < 0.3 ? 0 : speed;
            // speed = Math.abs(speed) > 15 ? 15:speed;
            speed = speed > 15 ? 15:speed;
            speed = speed <-15 ? -15:speed;
            time = Math.abs(speed)*0.2;
            time = time>2?2:time;
            time = time<0.4?0.5:time;

            var translateY = transform.css(content,"translateY");
            var targetY =  translateY + speed*100;

            //快速滑屏的橡皮筋效果
            // var bsr = "";
            var type ="Linear";
            if(targetY > 0 ){
                targetY =0;
                // bsr = "cubic-bezier(.09,1.51,.65,1.73)";
                type ="Back";
            }else if(targetY < minY){
                targetY = minY;
                // bsr = "cubic-bezier(.09,1.51,.65,1.73)";
                type ="Back";
            }

            // content.style.transition = time+"s "+bsr+" transform";
            // transform.css(content,"translateY",targetY);
            move(content,targetY,time,type);
        }
        function move(node,targetY,time,type) {
            clearInterval(clearTime);
            /*
                t: current time（当前是哪一次）；
                b: beginning value（初始值）；
                c: change in value（变化量）；
                d: duration（总共多少次）。
            */
            var t=0;
            var b = transform.css(content,"translateY");
            var c = targetY -b;
            var d = (time*1000)/(1000/60)
            clearTime = setInterval(function () {
                t++;
                if(t>d){
                    clearInterval(clearTime);
                    //组装外部逻辑
                    if(callBack && (typeof callBack["over"]).toLowerCase() === "function"){
                        callBack["over"].call(content);
                    }
                    return;
                }
                transform.css(node,"translateY",Tween[type](t,b,c,d));
                //组装外部逻辑
                if(callBack && (typeof callBack["move"]).toLowerCase() === "function"){
                    callBack["move"].call(content);
                }
            },1000/60)
        }
    }

    sxhp.move=move;
})(window)