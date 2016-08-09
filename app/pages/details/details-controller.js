angular.module('details.controller', ['details.service'])

    .controller('DetailsController', ['$scope', '$state', '$stateParams', '$rootScope', 'DetailsFty', '$ocLazyLoad',
        function ($scope, $state, $stateParams, $rootScope, DetailsFty, $ocLazyLoad) {

            $ocLazyLoad.load('Jquery').then(function () {
                $ocLazyLoad.load('JqueryWeUI').then(function () {
                    //console.log("homePage:jquery loaded");
                })
            });
            //title
            document.title = "商品详情";

            //商品详情
            detailsInfo();

            var scope = $rootScope;
            scope.$watch('detailsCartCount', function (nValue, oValue) {
                $scope.d_cart_count = nValue;
                //console.log('新值：' + nValue + "-------" + '旧值：' + oValue);
            });

            $scope.properties_list = [];
            function detailsInfo() {
                var product_id = $stateParams.productId;
                DetailsFty.detailsService(product_id)
                    .then(function (json) {
                        if (json.status_code == 0) {
                            $scope.details = json.data;
                            //console.log(angular.toJson(json.data));

                            $scope.details_stock_balance = $scope.details.stock_balance;
                            $scope.details_price = $scope.details.price;

                            if($scope.details_stock_balance > 0){
                                $scope.b_status_btn = true;
                            }else{
                                $scope.b_status_btn = true;
                            }

                            if ($scope.details.covers.length > 0) {
                                $scope.details_content_sheet_img = $scope.details.covers[0].url;
                            }

                            if (angular.isDefined($scope.details.specifications)) {
                                if ($scope.details.specifications.length > 0) {
                                    var properties = [];

                                    var rep = false;  // replace new properties is required
                                    angular.forEach($scope.details.specifications, function (v, k) {
                                        if (v != null || v != "") {
                                            properties.push(v);
                                        } else {
                                            rep = true;
                                        }
                                    });

                                    if (rep) {
                                        $scope.details.specifications = properties;
                                    }
                                }
                            }

                            //获取商品返利
                            getProductRabate(product_id);
                            //获取默认快递公司
                            if($rootScope.default_express == null){
                                expressInfo();
                            }else{
                                $scope.default_express = $rootScope.default_express;
                            }
                            //获取客服QQ
                            if($rootScope.kf_qq == null){
                                getKFQQ();
                            }else{
                                $scope.kf_qq = $rootScope.kf_qq;
                            }
                        } else {
                            console.log("获取商品详情失败");
                        }
                    }, function (error) {
                        console.log("获取商品详情失败");
                    })
            }

            function expressInfo(){
                DetailsFty.expressSerivce()
                    .then(function(json){
                        if(json.status_code == 0){
                            $scope.default_express = json.data.name;
                            $rootScope.default_express = $scope.default_express;
                        }else{
                            console.log('获取默认快递公司失败');
                        }
                    }, function(error){
                        console.log('获取默认快递公司失败：' + angular.toJson(error));
                    })
            }

            function getKFQQ(){
                DetailsFty.kqQQService()
                    .then(function(json){
                        //console.log(angular.toJson(json));
                        if(json.status_code == 0){
                            $scope.kf_qq = json.data[0].number;
                            $rootScope.kf_qq = $scope.kf_qq;
                        }else{
                            console.log("获取客服QQ失败：" + angular.toJson(json));
                        }
                    }, function(error){
                        console.log("获取客服QQ失败：" + angular.toJson(error));
                    })
            }

            function getProductRabate(product_id){
                DetailsFty.productRebateService(product_id)
                    .then(function(json){
                        if(json.status_code == 0){
                            $scope.product_rebate = json.data;
                        }else{
                            console.log("获取商品返利信息失败：" + angular.toJson(json));
                        }
                    }, function(error){
                        console.log("获取商品返利信息失败：" + angular.toJson(error));
                    })
            }

            /*TitleReSet("商品详情");
             function TitleReSet(title) {
             // body...
             document.title = title;
             //如果是IOS端微信,无法直接修改title.需要下面这一段神代码...
             //没看懂为什么添加一个iframe,然后remove掉就能动态修改title
             var $body = $('body');
             var $iframe = $('<iframe src="" style="display:none;"></iframe>');
             $iframe.on('load', function (argument) {
             //console.log("loading....");
             setTimeout(function () {
             //console.log("remove....");
             $iframe.off('load').remove();
             }, 0);
             }).appendTo($body);
             }*/

            $scope.spec_item_price = null;
            $scope.spec_item_stock_balance = null;
            $scope.spec_item_name = null;

            $scope.get_input_value = function (item) {
                $scope.product_property_value = item;

                $scope.spec_item_price = item.price;
                $scope.spec_item_stock_balance = item.stock_balance;
                $scope.spec_item_name = item.name;
                $scope.q_count = 1;
            };

            $scope.q_count = 1;
            $scope.downQ = function () {
                if ($scope.q_count > 1) {
                    $scope.q_count--;
                } else {
                    $scope.q_count = 1;
                }
            };
            $scope.upQ = function () {
                $scope.q_count++;
                //if ($scope.q_count < 99) {
                //    $scope.q_count++;
                //} else {
                //    $scope.q_count = 99;
                //}
            };

            //检查数量
            $scope.countChange = function(details){

                var quantity = $scope.q_count;

                if(!checkNumber(quantity) && quantity.length > 0){
                    //console.log('不是数字')
                    $.toast('请输入数字', 'cancel');
                    $scope.q_count = 1;
                    return;
                }

                if(quantity < 0){
                    $.toast('输入数字不能为负数', 'cancel');
                    $scope.q_count = 1;
                    return;
                }

                if($scope.product_property_value!=null){
                    if($scope.q_count > $scope.product_property_value.stock_balance){
                        $scope.q_count = $scope.product_property_value.stock_balance;
                    }
                }else{
                    if($scope.q_count > details.stock_balance){
                        $scope.q_count = details.stock_balance;
                    }
                }

            };

            //验证数字
            function checkNumber(number){
                var isNumber = /^[0-9]*$/.test(number);
                return isNumber;
            }

            //购买状态
            $scope.buy_status = function (number, b_status) {
                if(!b_status){
                    $.toast('该商品暂无库存', 'cancel');
                    return;
                }
                if (number == 1) {
                    $scope.b_status = "cart";
                } else if (number == 2) {
                    $scope.b_status = "buy";
                }
            };

            //确认购买option
            $scope.buy_product_option = function (productInfo, productId, quantity) {

                var product_property = null;
                var product_specification_id = null;

                if ($scope.product_property_value != null) {
                    product_specification_id = $scope.product_property_value.id;
                }

                if ($scope.details.specifications.length > 0 && product_specification_id == null) {
                    $.toast('请选择商品规格');
                    return;
                }
                if ($scope.details.specifications.length > 0 && $scope.product_property_value.stock_balance == 0) {
                    $.toast('此商品暂无库存');
                    return;
                }

                var b_status = $scope.b_status;
                if (b_status == "cart") {
                    if (productInfo.stock_balance > 0) {
                        $scope.addProductToCart(productId, quantity, product_property, product_specification_id);
                    } else {
                        $.toast('此商品暂无库存');
                    }
                } else if (b_status == "buy") {
                    if (productInfo.stock_balance > 0) {
                        $scope.buy_immediately(productInfo, quantity, product_property, product_specification_id);
                    } else {
                        $.toast('此商品暂无库存');
                    }
                }
            };

            //添加购物车
            $scope.addProductToCart = function (productId, quantity, product_property, product_specification_id) {

                if(!quantity > 0){
                    $.toast('请输入商品数量','cancel');
                    return;
                }

                DetailsFty.addProToCatService(productId, quantity, product_property, product_specification_id)
                    .then(function (json) {

                        $ocLazyLoad.load('Jquery').then(function () {
                            $ocLazyLoad.load('JqueryWeUI').then(function () {

                                /*start function*/
                                if (json.status_code == 0) {
                                    //$.toast.prototype.defaults.duration = 2000;
                                    var c_count = 0;
                                    if (json.data.length > 0) {
                                        angular.forEach(json.data, function (v, k) {
                                            c_count += v.quantity;
                                        });
                                    }
                                    $rootScope.detailsCartCount = c_count;
                                    //$.toast("成功添加商品");
                                } else {
                                    $.toast("添加失败", "cancel");
                                    console.log("添加失败：" + angular.toJson(json));
                                }
                                /*end function*/

                            });
                        });


                    }, function (error) {
                        $.toast("添加失败", "cancel");
                        console.log("添加失败：" + angular.toJson(error));
                    })
            };

            //立即购买
            $scope.checkedCarts = [];
            $scope.buy_immediately = function (item, quantity, product_property, product_specification_id) {
                //console.log("product.item?" + angular.toJson(item));

                if(!quantity > 0){
                    $.toast('请输入商品数量','cancel');
                    return;
                }

                var buy_price = 0;
                if (item.specifications.length > 0) {
                    angular.forEach(item.specifications, function (v, k) {
                        if (v.id == product_specification_id) {
                            buy_price = v.price;
                        }
                    });
                    item.price = buy_price;
                }

                item.product_id = item.id;
                item.quantity = $scope.q_count;
                item.product_name = item.name;
                //item.product_property = product_property;
                item.product_specification_id = product_specification_id;
                $scope.checkedCarts.push(item);

                $state.go('cart-settlement', {
                    carts: $scope.checkedCarts,
                    totalToPay: item.price * quantity,
                    totalFreight: item.freight
                });
            };

            //添加收藏
            $scope.addProductToCollection = function (productId) {

                DetailsFty.addCollectionService(productId)
                    .then(function (json) {

                        $ocLazyLoad.load('Jquery').then(function () {
                            $ocLazyLoad.load('JqueryWeUI').then(function () {

                                /*start function*/
                                //alert(angular.toJson(json));
                                if (json.status_code == 0) {
                                    $.toast('收藏成功');
                                } else {
                                    $.toast('收藏失败', 'cancel');
                                }
                                /*end function*/

                            });
                        });

                    }, function (error) {
                        $.toast('收藏失败', 'cancel');
                    })
            }
        }])
;