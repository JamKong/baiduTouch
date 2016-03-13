/**
 * Created by Administrator on 2016/3/13.
 */
function Swiper(container,params) {
    var $container = $(container);
    var $target = $container.find('.page-current');
    var now = {row: 1, col: 1}, last = {row: 0, col: 0};
    const towards = {up: 1, right: 2, down: 3, left: 4};
    var isAnimating = false;

    var screen_scale = window.innerWidth / 500;
    var enlarge_top = 250 * (1 - screen_scale);//放大后超出页面上面的部分
    $('.wrap').css('-webkit-transform', 'scale(' + s + ',' + s + ') translate(0px,-' + ss + 'px)');

    touch.on($container,'touchstart',function(event){
        event.preventDefault();
    });

    touch.on($target, 'swipeup', function(ev){
        if (isAnimating) return;
        last.row = now.row;
        last.col = now.col;
        if (last.row != $(container+' .slide').length) { now.row = last.row+1; now.col = 1; pageMove(towards.up);}
        else{ now.row = 1; now.col = 1; pageMove(towards.up);}
    });

    touch.on($target, 'swipedown', function(ev){
        if (isAnimating) return;
        last.row = now.row;
        last.col = now.col;
        if (last.row!=1) { now.row = last.row-1; now.col = 1; pageMove(towards.down);}
    });

    function pageMove(tw) {
        var nowPage = $($(container + ' .slide')[now.row - 1]).children('.page')[now.col - 1];
        var lastPage = $($(container + ' .slide')[last.row - 1]).children('.page')[last.col - 1];

        switch (tw) {
            case towards.up:
                outClass = 'pt-page-moveToTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case towards.right:
                outClass = 'pt-page-moveToRight';
                inClass = 'pt-page-moveFromLeft';
                break;
            case towards.down:
                outClass = 'pt-page-moveToBottom';
                inClass = 'pt-page-moveFromTop';
                break;
            case towards.left:
                outClass = 'pt-page-moveToLeft';
                inClass = 'pt-page-moveFromRight';
                break;
        }
        isAnimating = true;//正在进行动画
        $(nowPage).removeClass("hide");

        $(lastPage).addClass(outClass);
        $(nowPage).addClass(inClass);

        setTimeout(function () {
            $(lastPage).removeClass('page-current');
            $(lastPage).removeClass(outClass);
            $(lastPage).addClass("hide");
            $(lastPage).find("img").addClass("hide");

            $(nowPage).addClass('page-current');
            $(nowPage).removeClass(inClass);
            $(nowPage).find("img").removeClass("hide");

            isAnimating = false;
        }, 600);

        //console.log('lastPage:'+lastPage.className);
        //console.log('nowPage:'+nowPage.className);
    }
}