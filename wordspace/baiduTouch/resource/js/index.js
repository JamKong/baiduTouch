/**
 * Created by Administrator on 2016/3/13.
 */
function Swiper(container, params) {
    var now = {row: 1, col: 1}, last = {row: 0, col: 0};
    const towards = {up: 1, right: 2, down: 3, left: 4};
    var isAnimating = false;

    var screen_scale = window.innerHeight / 500;
    //console.log('screen_scale:'+screen_scale);
    var enlarge_top = 250 * (1 - screen_scale);//放大后超出页面上面的部分
    //console.log('enlarge_top:'+enlarge_top);
    $('.wrap').css('-webkit-transform', 'scale(' + screen_scale + ',' + screen_scale + ') translate(0px,-' + enlarge_top + 'px)');

    console.log('touch:' + touch);

    touch.on(container, 'touchstart', function (event) {
        //console.log('touchstart...');
        event.preventDefault();
    });

    touch.on(container, 'swipeup', function (ev) {
        if (isAnimating) return;
        //console.log('swipeup...');
        last.row = now.row;
        last.col = now.col;
        if (last.row != $(container + ' .pageGroup').length) {
            now.row = last.row + 1;
            now.col = 1;
            pageMove(towards.up);
        }
        else {
            now.row = 1;
            now.col = 1;
            pageMove(towards.up);
        }
    });

    touch.on(container, 'swipedown', function (ev) {
        if (isAnimating) return;
        last.row = now.row;
        last.col = now.col;
        now.col = 1;
        if (last.row != 1) {
            now.row = last.row - 1;
            pageMove(towards.down);
        }
        else {
            now.row = $(container + ' .pageGroup').length;
            pageMove(towards.down);
        }
    });

    touch.on(container, 'swipeleft', function (ev) {
        if (isAnimating) return;
        var pageNum = $('.page-current').parent().children('.page').length;
        //console.log('pageNum:'+pageNum);
        if (pageNum > 1) {
            last.row = now.row;
            last.col = now.col;
            if (last.col >= pageNum) {
                now.col = 1;
            } else {
                now.col = last.col + 1;
            }
            pageMove(towards.left);
        }

    });

    touch.on(container, 'swiperight', function (ev) {
        if (isAnimating) return;
        var pageNum = $('.page-current').parent().children('.page').length;
        if (pageNum > 1) {
            last.row = now.row;
            last.col = now.col;
            if (last.col <= 1) {
                now.col = pageNum;
            } else {
                now.col = last.col - 1;
            }
            pageMove(towards.right);
        }

    });

    function pageMove(tw) {
        var nowPage = $($(container + ' .pageGroup')[now.row - 1]).children('.page')[now.col - 1];
        //console.log('nowPage:' + nowPage);
        var lastPage = $($(container + ' .pageGroup')[last.row - 1]).children('.page')[last.col - 1];
        //console.log('lastPage:' + lastPage);

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

    }
}