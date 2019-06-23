;(function () {
    var btn = document.querySelector("#wrap > .head .head-top .btn");
    var mask = document.querySelector("#wrap > .head .mask");
    var wrap = document.querySelector("#wrap");
    var input = document.querySelector("#wrap > .head .head-bottom form > input[type='text']")

    /*
        isXX XX图标有没有出现
            false:XX图标没有出现
            true: XX图标出现
     */
    var isXX = false;
    btn.addEventListener("touchstart",function (ev) {
        ev = ev || event;
        isXX=!isXX;
        if(isXX){
            this.classList.add("active")
            mask.style.display="block";
        }else {
            this.classList.remove("active")
            mask.style.display="none";
        }
        ev.stopPropagation();
        ev.preventDefault();
    })

    wrap.addEventListener("touchstart",function () {
        if(isXX){
            btn.classList.remove("active")
            mask.style.display="none";
            isXX = !isXX;
        }
    })

    mask.addEventListener("touchstart",function (ev) {
        ev = ev || event;
        ev.stopPropagation();
        ev.preventDefault()
    })

    input.addEventListener("touchstart",function (ev) {
        ev = ev || event;
        this.focus();
        ev.stopPropagation();
        ev.preventDefault();
    })
    wrap.addEventListener("touchstart",function () {
        input.blur();
    })
})()