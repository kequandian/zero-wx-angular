$(function(){

    // searchbar
    $('#container').on('focus', '#search_input', function () {
        var $weuiSearchBar = $('#search_bar');
        $weuiSearchBar.addClass('weui_search_focusing');
    }).on('blur', '#search_input', function () {
        var $weuiSearchBar = $('#search_bar');
        $weuiSearchBar.removeClass('weui_search_focusing');
        if ($(this).val()) {
            $('#search_text').hide();
        } else {
            $('#search_text').show();
        }
    }).on('input', '#search_input', function () {
        var $searchShow = $("#search_show");
        if ($(this).val()) {
            $searchShow.show();
        } else {
            $searchShow.hide();
        }
    }).on('touchend', '#search_cancel', function () {
        $("#search_show").hide();
        $('#search_input').val('');
    }).on('touchend', '#search_clear', function () {
        $("#search_show").hide();
        $('#search_input').val('');
    })

    //cart settlement action sheet
    .on('click', '#showAddress', function () {
        var mask = $('#mask');
        var weuiActionsheet = $('#weui_actionsheet');
        weuiActionsheet.addClass('weui_actionsheet_toggle');
        mask.show().addClass('weui_fade_toggle').one('click', function () {
            hideActionSheet(weuiActionsheet, mask);
        });
        $('#actionsheet_cancel').one('click', function () {
            hideActionSheet(weuiActionsheet, mask);
        });
        $('.selectContact').one('click', function () {
            hideActionSheet(weuiActionsheet, mask);
        });
        weuiActionsheet.unbind('transitionend').unbind('webkitTransitionEnd');

        function hideActionSheet(weuiActionsheet, mask) {
            weuiActionsheet.removeClass('weui_actionsheet_toggle');
            mask.removeClass('weui_fade_toggle');
            weuiActionsheet.on('transitionend', function () {
                mask.hide();
            }).on('webkitTransitionEnd', function () {
                mask.hide();
            })
        }
    })
    //.on('click', '#showReceivingTime', function () {
    //    var mask_time = $('#mask_time');
    //    var weuiActionsheetTime = $('#weui_actionsheet_time');
    //    weuiActionsheetTime.addClass('weui_actionsheet_toggle');
    //    mask_time.show().addClass('weui_fade_toggle').one('click', function () {
    //        hideActionSheet(weuiActionsheetTime, mask_time);
    //    });
    //    $('#actionsheet_cancel_time').one('click', function () {
    //        hideActionSheet(weuiActionsheetTime, mask_time);
    //    });
    //    weuiActionsheetTime.unbind('transitionend').unbind('webkitTransitionEnd');
    //
    //    function hideActionSheet(weuiActionsheetTime, mask_time) {
    //        weuiActionsheetTime.removeClass('weui_actionsheet_toggle');
    //        mask_time.removeClass('weui_fade_toggle');
    //        weuiActionsheetTime.on('transitionend', function () {
    //            mask_time.hide();
    //        }).on('webkitTransitionEnd', function () {
    //            mask_time.hide();
    //        })
    //    }
    //})

    //
    //.on('click', '#addressPcd', function () {
    //    var mask_pcd = $('#mask_pcd');
    //    var weui_actionsheet_pcd = $('#weui_actionsheet_pcd');
    //    weui_actionsheet_pcd.addClass('weui_actionsheet_toggle');
    //    mask_pcd.show().addClass('weui_fade_toggle').one('click', function () {
    //        hideActionSheet(weui_actionsheet_pcd, mask_pcd);
    //    });
    //    $('#actionsheet_cancel_pcd').one('click', function () {
    //        hideActionSheet(weui_actionsheet_pcd, mask_pcd);
    //    });
    //    weui_actionsheet_pcd.unbind('transitionend').unbind('webkitTransitionEnd');
    //
    //    function hideActionSheet(weui_actionsheet_pcd, mask_pcd) {
    //        weui_actionsheet_pcd.removeClass('weui_actionsheet_toggle');
    //        mask_pcd.removeClass('weui_fade_toggle');
    //        weui_actionsheet_pcd.on('transitionend', function () {
    //            mask_pcd.hide();
    //        }).on('webkitTransitionEnd', function () {
    //            mask_pcd.hide();
    //        })
    //    }
    //})

    //bar 点击事件
    .on('click', '.weui_navbar_item', function () {
            $(this).addClass('goods_bar_item_on').siblings('.goods_bar_item_on').removeClass('goods_bar_item_on');
    })
    .on('click', '.weui_tabbar_item', function () {
            $(this).addClass('weui_bar_item_on').siblings('.weui_bar_item_on').removeClass('weui_bar_item_on');
            $(this).siblings("a").children('.home_tab_icon').removeClass('home_tab_icon_color');
            $(this).children('.home_tab_icon').addClass('home_tab_icon_color');
    })

    .on('click', '#contactMan', function(){
        $("#city-picker").cityPicker({
            title: "请选择收货地址"
        });
    })
    ;

});