angular.module('homePage.controller', ['homePage.service'])

    .controller('HomePageController', ['$scope', '$state', '$rootScope', 'HomePageFty','areasStatus','goodListParams',
        '$ocLazyLoad','homeProductPageNumber', function ($scope, $state,$rootScope, HomePageFty,areasStatus,goodListParams, $ocLazyLoad,homeProductPageNumber) {

            document.title = "十美优品商城";

            $ocLazyLoad.load('Jquery').then(function () {
                $ocLazyLoad.load('JqueryWeUI').then(function () {
                    console.log("homePage:jquery loaded");
                })
            });

            $rootScope.tabsNumber = 1;
            $scope.home_load_more_btn_show = false;

            /* setTimeout(function(){
             document.title = "首页";
             var iframe = document.createElement('iframe');
             iframe.style.visibility = 'hidden';
             iframe.style.width = '1px';
             iframe.style.height = '1px';
             iframe.onload = function(){
             setTimeout(function(){
             document.body.removeChild(iframe);
             },0)
             }
             },0);*/


            /*TitleReSet("首页");
             function TitleReSet(title) {
             // body...
             document.title = title;
             //如果是IOS端微信,无法直接修改title.需要下面这一段神代码...
             //没看懂为什么添加一个iframe,然后remove掉就能动态修改title
             var $body = $('body');
             var $iframe = $('<iframe src="img/home/home-title-img.png" style="display:none;"></iframe>');
             $iframe.on('load', function (argument) {
             //console.log("loading....");
             setTimeout(function () {
             //console.log("remove....");
             $iframe.off('load').remove();
             }, 0);
             }).appendTo($body);
             }*/

            $scope.currentId = 1;
            var pageNumber = homeProductPageNumber.h_p_page_number;
            var pageSize = 10;


            //获取广告
            getAdHome();
            getAdBanner();
            //获取推荐商品
            getRecommendProduct(pageNumber, pageSize);


            function getRecommendProduct(pageNumber, pageSize) {
                alert(pageNumber);
                //if(pageNumber == null){
                //    pageNumber = 1;
                //    $rootScope.homeProductPageNumber = 1;
                //}

                HomePageFty.recommendProductService(pageNumber, pageSize)
                    .then(function (json) {
                        if (json.status_code == 0) {

                            if(pageNumber == 1){
                                $scope.rec_product = json.data;
                                if ($scope.rec_product.length >= 10) {
                                    $scope.home_load_more_btn_show = true;
                                } else {
                                    $scope.home_load_more_btn_show = false;
                                }
                            }else if(pageNumber > 1){

                                if(json.data.length > 0) {
                                    angular.forEach(json.data, function (v, k) {
                                        $scope.rec_product.push(v);
                                    });

                                    if(json.data.length < 20){
                                        $scope.home_load_more_btn_show = false;
                                        $.toast("已加载全部的推荐商品");
                                    }
                                }else if (json.data.length == 0) {
                                    $scope.home_load_more_btn_show = false;
                                    $.toast("暂无更多的推荐商品");
                                }

                            }
                            //console.log(angular.toJson(json.data));
                        }
                    }, function (error) {
                        console.log(error);
                        //$.toast('获取推荐商品失败', 'cancel');
                    })
            }

            function getAdHome() {
                HomePageFty.getAdService()
                    .then(function (json) {
                        if (json.status_code == 0) {
                            $scope.ad_list = json.data;
                            //console.log(angular.toJson($scope.ad_list));
                        }
                    }, function (error) {
                        console.log(error);
                        //$.toast('获取广告信息失败', 'cancel');
                    })
            }

            function getAdBanner() {
                HomePageFty.getAdBanner()
                    .then(function (json) {
                        if (json.status_code == 0) {
                            $scope.ad_banner = json.data;
                            //console.log("ad?"+angular.toJson($scope.ad_banner ));
                            $scope.ad_banner_1 = $scope.ad_banner[0];
                            $scope.ad_banner_2 = $scope.ad_banner[1];
                            //console.log("ad-banner-1?"+angular.toJson($scope.ad_banner_1));
                        }
                    }, function (error) {
                        console.log(error);
                        //$.toast('获取广告列表失败', 'cancel');
                    })
            }

            //搜索栏
            $scope.goToSearchPage = function(){
                $state.go('searchPage');
            };

            //分类区域
            $scope.areasStatus = function(number){
                if(number == 1){
                    areasStatus.areas_status = 1;
                    goodListParams.searchStatus = 3;
                    $state.go('goodsList');
                }else if(number == 3){
                    areasStatus.areas_status = 3;
                    goodListParams.searchStatus = 3;
                    $state.go('goodsList');
                }
            };

            //加载更多
            $scope.home_load_more_product = function(){

                var p_umber = homeProductPageNumber.h_p_page_number;
                p_umber++;
                homeProductPageNumber.h_p_page_number = p_umber;
                getRecommendProduct(p_umber, pageSize);
            }


        }]);