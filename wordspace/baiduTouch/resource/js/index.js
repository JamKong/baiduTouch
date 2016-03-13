/**
 * Created by Administrator on 2016/3/13.
 * 1.添加了初始化页面可以进行配置的功能
 * 2.添加了页面是否支持循环的功能
 */
function Swiper(container, params) {

    const towards = {up: 1, right: 2, down: 3, left: 4};
    var isAnimating = false;//是否正在执行动画判断标识


    var screen_scale = window.innerHeight / 500;
    var enlarge_top = 250 * (1 - screen_scale);//放大后超出页面上面的部分
    $('.wrap').css('-webkit-transform', 'scale(' + screen_scale + ',' + screen_scale + ') translate(0px,-' + enlarge_top + 'px)');

    //默认参数配置
    var default_config = {
        now: {row: 1, col: 1}, //初始化显示的第一页
        last: {row: 0, col: 0},//（可略）
        isLoopToTopBottom:true,//是否设置上下方向的页面形成回环（既循环）
        isLoopToLeftRight:true,//是否设置左右方向的页面形成回环（既循环）

    };

    //根据params传入的值，进行修改配置
    for(var item in params){
        default_config[item] = params[item];
    }
    //console.log('now:['+default_config.now.row+',' +default_config.now.col+']');
    //var now = {row: 1, col: 1}, last = {row: 0, col: 0};


    //initialPage 设定初始化时Page的索引。
    var initialPage = $($(container + ' .pageGroup')[default_config.now.row - 1]).children('.page')[default_config.now.col - 1];
    initPage(initialPage);//初始化该页面，执行动画

    touch.on(container, 'touchstart', function (event) {
        //console.log('touchstart...');
        event.preventDefault();
    });

    touch.on(container, 'swipeup', function (ev) {
        if (isAnimating) return;
        //console.log('swipeup...');
        default_config.last.row = default_config.now.row;
        default_config.last.col = default_config.now.col;
        if (default_config.last.row != $(container + ' .pageGroup').length) {
            default_config.now.row = default_config.last.row + 1;
            default_config.now.col = 1;
            pageMove(towards.up);
        }
        else if(default_config.isLoopToTopBottom){
            default_config.now.row = 1;
            default_config.now.col = 1;
            pageMove(towards.up);
        }
    });

    touch.on(container, 'swipedown', function (ev) {
        if (isAnimating) return;
        default_config.last.row = default_config.now.row;
        default_config.last.col = default_config.now.col;
        default_config.now.col = 1;
        if (default_config.last.row != 1) {
            default_config.now.row = default_config.last.row - 1;
            pageMove(towards.down);
        }
        else if(default_config.isLoopToLeftRight){
            default_config.now.row = $(container + ' .pageGroup').length;
            pageMove(towards.down);
        }
    });

    touch.on(container, 'swipeleft', function (ev) {
        if (isAnimating) return;
        var pageNum = $('.page-current').parent().children('.page').length;
        //console.log('pageNum:'+pageNum);
        if (pageNum > 1) {
            default_config.last.row = default_config.now.row;
            default_config.last.col = default_config.now.col;
            if (default_config.last.col >= pageNum) {
                default_config.now.col = 1;
            } else {
                default_config.now.col = default_config.last.col + 1;
            }
            pageMove(towards.left);
        }

    });

    touch.on(container, 'swiperight', function (ev) {
        if (isAnimating) return;
        var pageNum = $('.page-current').parent().children('.page').length;
        if (pageNum > 1) {
            default_config.last.row = default_config.now.row;
            default_config.last.col = default_config.now.col;
            if (default_config.last.col <= 1) {
                default_config.now.col = pageNum;
            } else {
                default_config.now.col = default_config.last.col - 1;
            }
            pageMove(towards.right);
        }

    });
    /**
     * 页面移动
     * @param tw  方向
     */
    function pageMove(tw) {
        var nowPage = $($(container + ' .pageGroup')[default_config.now.row - 1]).children('.page')[default_config.now.col - 1];
        //console.log('nowPage:' + nowPage);
        var lastPage = $($(container + ' .pageGroup')[default_config.last.row - 1]).children('.page')[default_config.last.col - 1];
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

    /**
     * 初始化页
     * @param initialPage
     */
    function initPage(initialPage){
        $(initialPage).removeClass('hide');
        $(initialPage).addClass('page-current');
        $(initialPage).find("img").removeClass("hide");
    }
}