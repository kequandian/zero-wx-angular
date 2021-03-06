angular.module('category.controller', ['category.service'])

    .filter('cate', function(){
        return function(input, cateId){
            var rows = [];
            angular.forEach(input, function(item){
               if(item.id == cateId){
                   rows.push(item);
               }
            });
            return rows;
        }
    })
    .filter('defaultCover', function(){
        return function(input){
            if(input==null){
                return 'img/category/category_cover.png'
            }
            return input;
        }
    })
    .controller('CategoryController', ['$scope', '$state', '$rootScope','$stateParams', 'CategoryFty','goodListParams',
        '$ocLazyLoad','cateLeftIndex','cateCacheCode','PointRate',
        function ($scope, $state,$rootScope,$stateParams, CategoryFty,goodListParams, $ocLazyLoad, cateLeftIndex,cateCacheCode,PointRate) {

            //title
            document.title = "商品分类";

            $rootScope.tabsNumber = 2;
            //$rootScope.jqueryLoaded = false;
            $scope.top_btn_show = true;
            var loading = cateCacheCode.loading;  //状态标记
            var pageNumber = 1;
            var pageSize = 10;
            //var orderBy = "&orderBy=price";
            var orderBy = '';
            $scope.load_more_btn_show = cateCacheCode.load_more_btn_show;

            //积分
            $scope.point_rate = PointRate.rate;

            //拼团
            var categoryType = $stateParams.categoryType;
            var masterId = $rootScope.master_id;
            console.log('categoryType:  ' + categoryType);
            if(categoryType == 'pieceGroup'){
                $scope.isPieceGroups = true;
                //拼团列表
                getPieceGroupsInfo();
                //拼团优惠券
                getPieceGroupCoupon();
            }else{
                $scope.isPieceGroups = false;
                detailsInfo();
            }

            //首页广告商品分类ID
            var categoryId = $stateParams.categoryId;
            console.log('categoryId:  ' + categoryId);
            if(categoryId > 0){
                cateCacheCode.cate_session = -2;
            }

            // 点击左侧分类单
            /*$scope.getCategoryDetailData = function (typeNumber, item) {
                //console.log('cate_detail_data_id:  ' + cateLeftIndex.goods_list_index);
                if(cateLeftIndex.goods_list_index > 0){
                    $scope.cateId = cateLeftIndex.cate_detail_data_id;
                    cateLeftIndex.goods_list_index = 0;
                }else {
                    $scope.cateId = typeNumber;
                }

                var cateCount = 0;
                if(item.sub_categories != null && item.sub_categories.length > 0){
                    cateCount++;
                    //console.log(cateCount + ": " + angular.toJson(item.sub_categories));
                }
                if(item.sub_categories != null && item.sub_categories.length > 0 && item.sub_categories != null && item.sub_categories.length > 0){
                    cateCount++;
                    //console.log(cateCount + ": " + angular.toJson(item.sub_categories));
                }
                //if(item.sub_categories != null && item.sub_categories.length > 0 && item.sub_categories != null && item.sub_categories.length > 0 &&
                //    item.sub_categories != null &&item.sub_categories.length > 0){
                //    cateCount++;
                //    console.log(cateCount + ": " + angular.toJson(item.sub_categories));
                //}

                $scope.cateCoumt = cateCount;

            };*/


            function detailsInfo() {
                var loaded = false;
                if(cateCacheCode.cate_session){
                    if(cateCacheCode.cate_session.length > 0) {
                        loaded = true;
                        //console.log('cat_session loaded')
                    }else if(cateCacheCode.cate_session == null){
                        loaded = false;
                    }
                }else{
                    cateCacheCode.cate_session = {}
                }
                console.log('cateCacheCode.cate_session: ' + cateCacheCode.cate_session);

                if(!loaded) {
                    if(cateCacheCode.cate_session == -1){
                        if(cateCacheCode.product_list == null){
                            console.log('推荐商品分类信息有误');
                            return;
                        }
                        CategoryFty.categoryService()
                            .then(function (json) {
                                if (json.status_code == 0) {

                                    $scope.first_cate = json.data;

                                    if(cateCacheCode.product_list.sub_categories.length > 0){
                                        console.log("sub_categories length > 0");
                                        angular.forEach(json.data, function(v, k){
                                            if(v.name == cateCacheCode.product_list.name){
                                                $scope.indexFirstCate = k;
                                            }
                                        });
                                        //console.log('$scope.indexFirstCate: ' + $scope.indexFirstCate);
                                        $scope.second_cate = $scope.first_cate[0].sub_categories;
                                        $scope.indexSecondCate = 0;
                                        countWith($scope.first_cate);
                                        countItemWith($scope.first_cate[0]);
                                        //$scope.productList = cateCacheCode.product_list;
                                        productList($scope.first_cate[1].id);

                                        cateCacheCode.index_first=$scope.indexFirstCate;
                                        cateCacheCode.index_second=0;
                                        cateCacheCode.cate_session = json.data;
                                        cateCacheCode.second_cate =$scope.first_cate[$scope.indexFirstCate];
                                        cateCacheCode.product_id = $scope.first_cate[$scope.indexFirstCate].id;

                                    }else if(cateCacheCode.product_list.sub_categories.length == 0){
                                        console.log("sub_categories length == 0");
                                        angular.forEach(json.data, function(first, first_k){

                                            angular.forEach(first.sub_categories, function(second, second_k){

                                                if(second.name == cateCacheCode.product_list.name){
                                                    $scope.indexFirstCate = first_k;
                                                    $scope.indexSecondCate = second_k;
                                                }
                                            })

                                        });

                                        $scope.second_cate = $scope.first_cate[$scope.indexFirstCate].sub_categories;
                                        countWith($scope.first_cate);
                                        countItemWith($scope.first_cate[$scope.indexFirstCate]);
                                        //$scope.productList = cateCacheCode.product_list;
                                        //console.log("$scope.indexFirstCate === ", $scope.indexFirstCate)
                                        //console.log("scope.first_cate === ", $scope.first_cate[$scope.indexFirstCate].sub_categories[$scope.indexSecondCate].id)
                                        //分类 分层判断
                                        console.log("$scope.first_cate[$scope.indexFirstCate] == ", $scope.first_cate[$scope.indexFirstCate])
                                        if($scope.first_cate[$scope.indexFirstCate].sub_categories.length > 0){
                                            productList($scope.first_cate[$scope.indexFirstCate].sub_categories[$scope.indexSecondCate].id);
                                            cateCacheCode.product_id = $scope.first_cate[$scope.indexFirstCate].sub_categories[$scope.indexSecondCate].id;
                                        }else{
                                            productList($scope.first_cate[$scope.indexFirstCate].id);
                                            cateCacheCode.product_id = $scope.first_cate[$scope.indexFirstCate].id;
                                        }

                                        cateCacheCode.index_first = $scope.indexFirstCate;
                                        cateCacheCode.index_second = $scope.indexSecondCate;
                                        cateCacheCode.cate_session = json.data;
                                        cateCacheCode.second_cate =$scope.first_cate[$scope.indexFirstCate];
                                        //console.log('cateCacheCode.second_cate: ' + angular.toJson($scope.first_cate[cateCacheCode.index_first]));
                                    }

                                } else {
                                    console.log('获取商品分类失败');
                                }
                            }, function (error) {
                                console.log('获取商品分类失败');
                            })
                    }else{
                        console.log('load');
                        CategoryFty.categoryService()
                            .then(function (json) {
                                if (json.status_code == 0) {

                                    $scope.first_cate = json.data;

                                    if(categoryId > 0){
                                        console.log('categoryId > 0 ');
                                        ad_category_product(categoryId);

                                    }else{
                                        console.log("$scope.first_cate == ", json.data);
                                        $scope.second_cate = $scope.first_cate[0].sub_categories;
                                        countWith($scope.first_cate);
                                        countItemWith($scope.first_cate[0]);
                                        productList($scope.first_cate[0].id);

                                        cateCacheCode.cate_session = json.data;
                                        cateCacheCode.second_cate = $scope.first_cate[0];
                                        cateCacheCode.product_id = $scope.first_cate[0].id;
                                    }

                                } else {
                                    console.log('获取商品分类失败');
                                }
                            }, function (error) {
                                console.log('获取商品分类失败');
                            })
                    }
                }else{
                    console.log('cache');
                    $scope.first_cate = cateCacheCode.cate_session;
                    $scope.second_cate = cateCacheCode.second_cate.sub_categories;
                    countWith($scope.first_cate);
                    countItemWith(cateCacheCode.second_cate);
                    $scope.productList = cateCacheCode.product_list;
                }
            }

            //首页广告商品类别
            function ad_category_product(cateId){

                console.log('cateId: 广告 == ', cateId);
                if(!cateId > 0){
                    console.log('分类ID有误');
                    return;
                }
                CategoryFty.getProductListService(cateId,pageNumber,pageSize,orderBy)
                    .then(function(json){
                        if(json.status_code == 0){

                            angular.forEach($scope.first_cate, function(first, first_k){
                                angular.forEach(first.sub_categories, function(second, second_k){
                                    if(second.name == json.data.name){
                                        $scope.indexFirstCate = first_k;
                                        $scope.indexSecondCate = second_k;
                                    }
                                })
                            });

                            $scope.second_cate = $scope.first_cate[$scope.indexFirstCate].sub_categories;
                            countWith($scope.first_cate);
                            countItemWith($scope.first_cate[$scope.indexFirstCate]);

                            cateCacheCode.index_first = $scope.indexFirstCate;
                            cateCacheCode.index_second = $scope.indexSecondCate;
                            cateCacheCode.cate_session = json.data;
                            cateCacheCode.second_cate =$scope.first_cate[$scope.indexFirstCate];
                            cateCacheCode.product_id = $scope.first_cate[$scope.indexFirstCate].sub_categories[$scope.indexSecondCate].id;

                            if (pageNumber == 1) {
                                $scope.productList = json.data;
                                //console.log('productList: ' + angular.toJson($scope.productList.name));

                                //console.log('productList: '+ angular.toJson($scope.productList));
                                if ($scope.productList.products.length >= 10) {
                                    $scope.load_more_btn_show = true;
                                    loading = false;
                                    cateCacheCode.loading = false;
                                    cateCacheCode.load_more_btn_show = true;
                                } else {
                                    $scope.load_more_btn_show = false;
                                    loading = true;
                                    cateCacheCode.loading = true;
                                    cateCacheCode.load_more_btn_show = false
                                }
                                cateCacheCode.product_list = json.data;
                            } else if (pageNumber > 1) {
                                var new_code = json.data.products;
                                //console.log('$scope.productList: ' + angular.toJson($scope.productList));
                                //console.log('new_code: ' + new_code.length);
                                if (new_code.length > 0) {
                                    loading = false;
                                    cateCacheCode.loading = false;
                                    angular.forEach(new_code, function (v, k) {
                                        //console.log('new_code_list: ' + angular.toJson(v));
                                        $scope.productList.products.push(v);
                                    });
                                    if(new_code.length < 10){
                                        loading = true;
                                        $scope.load_more_btn_show = false;
                                        cateCacheCode.loading = true;
                                        cateCacheCode.load_more_btn_show = false;
                                        //$.toast("已加载全部的商品");
                                    }
                                } else if (new_code.length == 0) {
                                    loading = true;
                                    cateCacheCode.loading = true;
                                    $scope.load_more_btn_show = false;
                                    cateCacheCode.load_more_btn_show = false;
                                    //$.toast("暂无更多的分类商品信息");
                                }
                            }

                        }else{
                            $scope.productList = null;
                            console.log('获取商品列表失败：' + angular.toJson(json));
                        }
                    }, function(error){
                        console.log('获取商品列表失败：' + angular.toJson(error));
                    })

            }


            // 左侧分类单击样式修改
            /*$scope.categoryLeftClick = function (e) {

                if($rootScope.jqueryLoaded){
                    console.log('Jquery loaded');
                    e.target.className = 'nav-current';
                    $(e.target).siblings().removeClass().addClass('nav-blur');

                    /// set previous item class
                    if($(e.target).prev()) {
                        var pre = $(e.target).prev()[0];
                        if(pre) {
                            pre.className = 'nav-prev';
                        }
                        //console.log("target: " + angular.toJson(pre) + 'class-name?' + pre.className);
                    }
                }else {
                    console.log('Jquery not loaded');
                    $ocLazyLoad.load('Jquery').then(function () {
                        console.log('Jquery loading and loaded');

                        $rootScope.jqueryLoaded = true;

                        e.target.className = 'nav-current';
                        $(e.target).siblings().removeClass().addClass('nav-blur');

                        /// set previous item class
                        if ($(e.target).prev()) {
                            var pre = $(e.target).prev()[0];
                            if (pre) {
                                pre.className = 'nav-prev';
                            }
                            //console.log("target: " + angular.toJson(pre) + 'class-name?' + pre.className);
                        }
                    })
                }
            };
*/
            /* ==================================================== 分割线 ======================================================== */

            $scope.indexFirstCate = cateCacheCode.index_first;

            $scope.gFirstIndex = function(e, item){
                $scope.indexFirstCate = e;
                $scope.second_cate = item.sub_categories;
                $scope.indexSecondCate = 0;
                pageNumber = 1;
                countItemWith(item);
                if(item.sub_categories.length > 0){
                    productList(item.id);
                    cateCacheCode.product_id = item.id;
                }else{
                    productList(item.id);
                    cateCacheCode.product_id = item.id;
                }
                cateCacheCode.index_first = e;
                cateCacheCode.second_cate = item;
                cateCacheCode.index_second = 0;

                //console.log(angular.toJson(item));
            };

            //second
            $scope.indexSecondCate = cateCacheCode.index_second;

            $scope.gSecondIndex = function(e, item){
                $scope.indexSecondCate = e;
                $scope.productList = item.products;
                pageNumber = 1;
                //console.log(angular.toJson(item));
                if(categoryId > 0){
                    ad_category_product(item.id)
                }else{
                    productList(item.id);
                }
                cateCacheCode.product_id = item.id;
                cateCacheCode.index_second = e;
            };

            //计算长度
            function countWith(content){
                var li_width = 0;
                if(content.length > 0){
                    angular.forEach(content,function(v, k){
                        li_width = li_width + (v.name.length * 16 + 30) + 3;
                    });
                    //var count = li_width * 105 + 5;
                    //count = "width:" + li_width + "px;";
                    $scope.first_ul = "width:" + li_width + "px;";
                }else{
                    $scope.first_ul = '';
                }
            }

            //second nav
            function countItemWith (content){
                var li_width = 0;
                //console.log("content12345:"+angular.toJson(content));
                if(content.sub_categories.length > 0){
                    angular.forEach(content.sub_categories,function(v, k){
                        li_width = li_width + (v.name.length * 15 + 22) + 3;
                    });
                    //var count = content.sub_categories.length * 105 + 5;
                    //count = "width:" + count + "px;";
                    $scope.second_ul = "width:" + li_width + "px;";
                }else{
                    $scope.second_ul = '';
                }
            }

            //products
            function productList(cateId){

                console.log('cateId == ', cateId);
                if(!cateId > 0){
                    console.log('分类ID有误');
                    return;
                }
                CategoryFty.getProductListService(cateId,pageNumber,pageSize,orderBy)
                    .then(function(json){
                        if(json.status_code == 0){
                            if (pageNumber == 1) {
                                $scope.productList = json.data;
                                console.log('pageNumber = 1 ');
                                console.log('productList: ', $scope.productList);
                                if ($scope.productList.products.length >= 10) {
                                    $scope.load_more_btn_show = true;
                                    loading = false;
                                    cateCacheCode.loading = false;
                                    cateCacheCode.load_more_btn_show = true;
                                } else {
                                    $scope.load_more_btn_show = false;
                                    loading = true;
                                    cateCacheCode.loading = true;
                                    cateCacheCode.load_more_btn_show = false
                                }
                                cateCacheCode.product_list = json.data;
                            } else if (pageNumber > 1) {
                                var new_code = json.data.products;
                                console.log('pageNumber > 1 ');
                                //console.log('$scope.productList: ' + angular.toJson($scope.productList));
                                if (new_code.length > 0) {
                                    loading = false;
                                    cateCacheCode.loading = false;
                                    angular.forEach(new_code, function (v, k) {
                                        $scope.productList.products.push(v);
                                    });
                                    if(new_code.length < 10){
                                        loading = true;
                                        $scope.load_more_btn_show = false;
                                        cateCacheCode.loading = true;
                                        cateCacheCode.load_more_btn_show = false;
                                        //$.toast("已加载全部的商品");
                                    }
                                } else if (new_code.length == 0) {
                                    loading = true;
                                    cateCacheCode.loading = true;
                                    $scope.load_more_btn_show = false;
                                    cateCacheCode.load_more_btn_show = false;
                                    //$.toast("暂无更多的分类商品信息");
                                }
                            }

                        }else{
                            $scope.productList = null;
                            console.log('获取商品列表失败：' + angular.toJson(json));
                        }
                    }, function(error){
                        console.log('获取商品列表失败：' + angular.toJson(error));
                    })
            }

            //推荐商品
            $scope.cateGoToDetails = function (item) {
                //console.log(angular.toJson(item));
                $rootScope.pieceGroupCouponItem.id = 0;
                if(categoryType == 'pieceGroup'){
                    $state.go('piecegroup',{pieceGroupId:item.id, masterId:0});
                }else{
                    $state.go('details',{productId:item.id});
                }
            };


            //获取拼团商品信息
            function getPieceGroupsInfo(){
                CategoryFty.getFightGroupsService(pageNumber,pageSize,orderBy)
                    .then(function(json){
                        if(json.status_code == 0){

                            //console.log('拼团列表' + angular.toJson(json.data));
                            if(json.data.promoted_master != null){
                                $scope.promotedMaster = json.data.promoted_master;
                                $scope.promotedMaster.isMasterOrder = true;
                            }/*else{
                                if(json.data.list !=null && json.data.list.length > 0){

                                    var fightGroupList = json.data.list;
                                    var num = Math.random();
                                    num = Math.floor(num * fightGroupList.length);

                                    angular.forEach(fightGroupList, function(value, index){
                                        if(num == index){
                                            $scope.promotedMaster = value;
                                        }
                                    });
                                    $scope.promotedMaster.promoted_master = null;
                                    $scope.promotedMaster.isMasterOrder = false;
                                }
                            }*/

                            if(pageNumber == 1){
                                $scope.fightGroupsList = json.data;
                                if($scope.fightGroupsList.list.length >= 10){
                                    $scope.load_more_btn_show = true;
                                    loading = false;
                                } else {
                                    $scope.load_more_btn_show = false;
                                    loading = true;
                                }
                            }else if(pageNumber > 1){
                                var new_fight_groups_code = json.data.list;
                                console.log('pageNumber > 1 ');
                                //console.log('$scope.productList: ' + angular.toJson($scope.productList));
                                if (new_fight_groups_code.length > 0) {
                                    loading = false;
                                    angular.forEach(new_fight_groups_code, function (v, k) {
                                        $scope.fightGroupsList.list.push(v);
                                    });
                                    if(new_fight_groups_code.length < 10){
                                        loading = true;
                                        $scope.load_more_btn_show = false;
                                        //$.toast("已加载全部的商品");
                                    }
                                } else if (new_fight_groups_code.length == 0) {
                                    loading = true;
                                    $scope.load_more_btn_show = false;
                                    //$.toast("暂无更多的分类商品信息");
                                }
                            }

                        }else{
                            console.log(angular.toJson(json))
                        }
                    }, function(error){
                        console.log("获取拼团信息失败" + angular.toJson(error))
                    })
            }

            //拼团
            $scope.cateGoToFightGroups = function(item){
                /*if(item.isMasterOrder){
                    console.log("Master Order");
                    $state.go('piecegroup',{pieceGroupId:item.piece_group_purchase_id, masterId:item.id});
                }else{
                    console.log("Piece Product");
                    $state.go('piecegroup',{pieceGroupId:item.id, masterId:0});
                }*/
                $rootScope.pieceGroupCouponItem.id = 0;
                $state.go('piecegroup',{pieceGroupId:item.piece_group_purchase_id, masterId:item.id});
                //$state.go('piecegroup',{pieceGroupId:item.piece_group_purchase_id, masterId:0});
            };


            //滚动加载
            $ocLazyLoad.load('Jquery').then(function () {
                $ocLazyLoad.load('JqueryWeUI').then(function () {
                    console.log('loading : ' + loading);
                    if(categoryType == 'pieceGroup'){
                        console.log('pieceGrouploading : ' + loading);
                        setTimeout(function(){
                            $(".pieceGroups").infinite().on("infinite", function() {
                                console.log('loading : ' + loading);
                                if(loading){
                                    console.log('loading : ' + loading);
                                    return;
                                }
                                loading = true;
                                setTimeout(function() {
                                    pageNumber += 1;
                                    getPieceGroupsInfo();
                                    loading = false;
                                }, 500);   //模拟延迟
                            });
                        }, 500);

                    }else if(categoryType == 'default'){
                        console.log('defaultloading : ', loading);
                        setTimeout(function(){
                            $(".pro-content").infinite().on("infinite", function() {
                                console.log('loading : ', loading);
                                if(loading){
                                    return;
                                }
                                loading = true;
                                cateCacheCode.loading = true;
                                setTimeout(function() {
                                    pageNumber += 1;
                                    if(categoryId>0){
                                        ad_category_product(categoryId)
                                    }else{
                                        productList(cateCacheCode.product_id);
                                    }
                                    loading = false;
                                    cateCacheCode.loading = false;
                                }, 500);   //模拟延迟
                            });
                        }, 500);
                    }

                })
            });

            /*//加载更多
            $scope.home_load_more_product = function () {
                page_number += 1;
                $rootScope.rec_session.page_number = page_number;

                $rootScope.loading_in_progress = true;

                //getRecommendProduct(page_number, PAGE_SIZE);

                //ISSUE: not yet loaded here
                //$rootScope.rec_session.rec_product = $scope.rec_product;
            };*/

           /* //返回顶部
            $scope.onTop = function(){
                console.log('click to top');
                console.log(document.getElementById('pro-height').scrollTop);
                document.getElementById('pro-height').scrollTop = 0;
                $scope.pressed = true;
            };

            $scope.$on('$onScrollBottom', function () {
                if($rootScope.loading_in_progress) {
                    // do nothing
                }else{
                    if ($scope.home_load_more_btn_show) {
                        console.log('load more products...');
                        $scope.home_load_more_product();
                    }
                }
            });
            $scope.$on('$onScrollTop', function () {
                $timeout(function(){
                    $scope.top_btn_show = false;
                })
                //console.log('$onScrollTop');
            });
            $scope.$on('$onScrollTopCancelled', function () {
                $timeout(function(){
                    $scope.top_btn_show = true;
                })
                //console.log('$onScrollTopCancelled');
            });


            $scope.gotoDetail = function () {
                // get scroll position
                if (!$rootScope.scrolls) {
                    $rootScope.scrolls = {}
                }

                $rootScope.scrolls.yOffset = document.getElementById('category').scrollTop;
                $rootScope.scrolls.stacked = true;  //remember home stacked to details and will come back.

                console.log('anchor yOffset?' + $rootScope.scrolls.yOffset);
            };
            $scope.$on('$onFinishRender', function () {
                if ($rootScope.scrolls && $rootScope.scrolls.yOffset && $rootScope.scrolls.stacked) {
                    $rootScope.scrolls.stacked = false;

                    document.getElementById('category').scrollTop = $rootScope.scrolls.yOffset;

                    //$location.hash('content');
                    //$anchorScroll.yOffset = $rootScope.yOffset;
                }
            });
            //Do your $on in here, like this:
            $rootScope.$on("$locationChangeStart", function (event, next, current) {
                if ($rootScope.scrolls && !$rootScope.scrolls.stacked) {
                    $rootScope.scrolls.yOffset = 0;
                }
            });*/

            //拼团优惠券
            //关闭按钮
            $scope.f_g_hide_bg = function(){
                document.getElementById('red-packet').style.display = 'none';
            };

            //获取拼团优惠券信息
            function getPieceGroupCoupon(){

                var couponList = [];

                CategoryFty.getPieceGroupCouponService()
                    .then(function(json){

                        if(json.status_code == 0){

                            //console.log(angular.toJson(json));
                            if(json.data.activation_coupons != null && json.data.activation_coupons.length > 0){

                                angular.forEach(json.data.activation_coupons, function (v, k) {
                                   if(v.type == 'MARKETING_PIECE_GROUP' && v.status =='ACTIVATION'){
                                       couponList.push(v);
                                   }
                                });
                                if(couponList.length > 0){
                                    $scope.activation_coupons = couponList;
                                    document.getElementById('red-packet').style.display = 'block';
                                }else{
                                    document.getElementById('red-packet').style.display = 'none';
                                }
                            }else{
                                document.getElementById('red-packet').style.display = 'none';
                            }

                        }else{
                            document.getElementById('red-packet').style.display = 'none';
                            console.log('获取拼团优惠券信息失败：' + angular.toJson(json))
                        }
                    }, function(error){
                        document.getElementById('red-packet').style.display = 'none';
                       console.log('获取拼团优惠券信息失败：' + angular.toJson(error))
                    });
            }

            //优惠券时间格式化
            $scope.pieceGroupCouponDate = function(time){
                var newTime = time.split(' ');
                return newTime[0];
            };

            //优惠开团
            $scope.goToPieceGroup = function(item){
                $rootScope.pieceGroupCouponItem = item;
                $state.go('pieceGroupGoodsList');
            }


        }]);