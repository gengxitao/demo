;(function () {
    //1. 加meta标签
    //2. 禁止全局的默认行为
    var wrapNode = document.querySelector("#wrap");

    wrapNode.addEventListener("touchstart",function (ev) {
        ev = ev||event;
        ev.preventDefault();
    })

    //3.rem适配
    var styleNode = document.createElement("style");
    var w = document.documentElement.clientWidth/16;
    styleNode.innerHTML="html{font-size:"+w+"px!important}"
    document.head.appendChild(styleNode);
})()