/**
 * Created by Administrator on 2016/3/13.
 * ��js��Ҫ��Swiper���ж���
 */
function Swiper(container, params) {

    const towards = {up: 1, right: 2, down: 3, left: 4};
    var now = 0, last = 0;
    var pageNum = $(container).children('.page').length;//����ҳ����ڶ���P
    var isAnimating = false;//�Ƿ�����ִ�ж����жϱ�ʶ
    var isDisableAutoplay = false; //�Ƿ�ֹͣ�Զ�����

    var screen_scale = window.innerHeight / 500;
    var enlarge_top = 250 * (1 - screen_scale);//�Ŵ�󳬳�ҳ������Ĳ���

    $(container + ' .page .wrap').css('-webkit-transform', 'scale(' + screen_scale + ',' + screen_scale + ') translate(0px,-' + enlarge_top + 'px)');

    //Ĭ�ϲ�������
    var default_config = {
        initialPage: 0,//�趨��ʼ��ʱpage��������
        direction: 'horizontal',//vertical
        speed: 600,
        autoplay: false,
        autoplaySpeed: 3000,//�Զ����ŵ�ʱ����
        autoplayDisableOnInteraction: true,//�û�����swiper֮���Ƿ��ֹautoplay��Ĭ��Ϊtrue��ֹͣ��
        autoplayStopOnLast: false,//�������Ϊtrue�����л������һ��slideʱֹͣ�Զ��л�
        effect: 'slide',//�л�Ч��
        pagination: null,//��ҳ��,���磺.pagination
        paginationType: 'bullets',//��ҳ����
        paginationPosition:'bottom',//��ҳ�����õ�λ�ã���ѡ(top,right,bottom,left)
        loop: false,
        allowFirstToLastInFirstTime:false,
    };

    /** ����params�����ֵ�������޸����� **/
    for (var item in params) {
        default_config[item] = params[item];
    }

    /** �������� start��**/

    initPage(default_config.initialPage);//��ʼ����ҳ�棬ִ�ж���
    pageAutoPlay(default_config.autoplay);//ҳ���Զ����Ź��ܵ���
    paginationDevice(default_config.pagination, default_config.paginationType);

    /** �������� end**/

    touch.on(container, 'touchstart', function (event) {
        event.preventDefault();
    });


    if (default_config.direction === 'horizontal') { //ˮƽ����

        touch.on(container, 'swipeleft', function (ev) {
            if (isAnimating) return;
            pageMoveOnPlus(towards.left);
            if (default_config.autoplayDisableOnInteraction) {
                isDisableAutoplay = true;
            }
        });

        touch.on(container, 'swiperight', function (ev) {
            if (isAnimating) return;
            pageMoveOnMinus(towards.right);
            if (default_config.autoplayDisableOnInteraction) {
                isDisableAutoplay = true;
            }
        });
    } else {  //vertical ��ֱ����
        touch.on(container, 'swipeup', function (ev) {
            if (isAnimating) return;
            pageMoveOnPlus(towards.up);
            if (default_config.autoplayDisableOnInteraction) {
                isDisableAutoplay = true;
            }
        });

        touch.on(container, 'swipedown', function (ev) {
            if (isAnimating) return;
            pageMoveOnMinus(towards.down);
            if (default_config.autoplayDisableOnInteraction) {
                isDisableAutoplay = true;
            }
        });
    }


    //�������ƶ�ҳ�棺up/left
    function pageMoveOnPlus(tw) {
        if (pageNum > 1) {
            if (now >= pageNum - 1) {
                if (default_config.loop) {
                    last = now;
                    now = 0;
                    pageMove(tw);
                    default_config.allowFirstToLastInFirstTime = true;//���û��ӵ�һҳ�����һҳ���������H5ҳ��󣬽����������ҳֱ�ӷ���βҳ�Ĺ���
                }
            } else {
                last = now;
                now = last + 1;
                pageMove(tw);
            }
        }
    }

    //�������ƶ�ҳ�棺down/right
    function pageMoveOnMinus(tw) {
        if (pageNum > 1) {
            if (now <= 0) {
                if(default_config.allowFirstToLastInFirstTime){
                    if (default_config.loop) {
                        last = now;
                        now = pageNum - 1;
                        pageMove(tw);
                    }
                }
            } else {
                last = now;
                now = last - 1;
                pageMove(tw);
            }
        }
    }

    /**
     * ҳ���Զ�����
     * @param isAutoPlay
     */
    function pageAutoPlay(isAutoPlay) {
        if (isAutoPlay) {
            var interval = setInterval(function () {
                if (isDisableAutoplay) {
                    clearInterval(interval);
                    return;
                }
                if (default_config.direction === 'horizontal') {
                    pageMoveOnPlus(towards.left);
                } else {
                    pageMoveOnPlus(towards.up);
                }
                if (default_config.autoplayStopOnLast && now == pageNum - 1) {
                    clearInterval(interval);
                    return;
                }
            }, default_config.autoplaySpeed);

        }
    }

    /**
     * ҳ���л�
     * @param tw  ����
     */
    function pageMove(tw) {
        var nowPage = $(container + '> .page')[now];
        console.log('container .page now:' + container +'-'+' .page-'+now);
        var lastPage = $(container + '> .page')[last];
        console.log('container .page last:' + container +'-'+' .page-'+last);

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
        isAnimating = true;//���ڽ��ж���
        $(nowPage).removeClass("hide");

        $(lastPage).addClass(outClass);
        $(nowPage).addClass(inClass);

        //��ҳ��״̬�л�
        if(default_config.pagination != null){
            $($(container + ' ' + default_config.pagination).find('li')[last]).removeClass('pagination-current');
            $($(container + ' ' + default_config.pagination).find('li')[now]).addClass('pagination-current');
        }
        setTimeout(function () {
            $(lastPage).removeClass('page-current');
            $(lastPage).removeClass(outClass);
            $(lastPage).addClass("hide");
            $(lastPage).find("img").addClass("hide");

            $(nowPage).addClass('page-current');
            $(nowPage).removeClass(inClass);
            $(nowPage).find("img").removeClass("hide");
            isAnimating = false;

        }, default_config.speed);

    }

    /**
     * ��ʼ��ҳ
     * @param initialPage
     */
    function initPage(initialPage) {
        var firstPage = $(container + ' .page')[initialPage];
        now = initialPage;
        $(firstPage).removeClass('hide');
        $(firstPage).addClass('page-current');
        $(firstPage).find("img").removeClass("hide");
    }

    /**
     * TODO ҳ���л�Ч��
     */
    function pageMoveEffect(ef) {

    }

    /**
     * ��ҳ��
     * @param p -- pagination
     * @param pType -- paginationType
     */
    function paginationDevice(p, pType) {
        if (p == null) {
            return;
        }

        var appendHtml = '<ol class="'+default_config.paginationType+'">';

        for (var i = 0; i < pageNum; i++) {
            if(i == default_config.initialPage){
                appendHtml += '<li class="pagination-current"></li>';
                continue;
            }
            appendHtml += '<li></li>';
        }
        appendHtml += '</ol>';
        $(container + ' ' + p).append(appendHtml);

        if(default_config.paginationPosition == 'top' || default_config.paginationPosition == 'bottom'){
            $(container + ' ' + p).css('margin-left', -16 * pageNum * 0.5 + 'px');//ÿ��li��СΪ16px
        }else if(default_config.paginationPosition == 'right' || default_config.paginationPosition == 'left'){
            $(container + ' ' + p).css('margin-top', -(18 * pageNum + 8) * 0.5 + 'px');//ÿ��li��СΪ16px
        }

        //console.log(appendHtml);
        $(container + ' ' +default_config.pagination).addClass('pagination-position-'+default_config.paginationPosition);
    }

}