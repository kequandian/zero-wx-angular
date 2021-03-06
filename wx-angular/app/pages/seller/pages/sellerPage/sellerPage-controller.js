angular.module('sellerPage.controller', ['sellerPage.service'])
    /*.directive('bindJavascript', function () {
     return {
     restrict: 'A',
     scope: {
     javascript: '@'
     },
     replace: false,
     link: function ($scope, element, attr) {
     var script = angular.element(document.createElement('script'));
     var source = $scope.javascript;
     console.log(source);

     script[0].text = source;
     angular.element(element).append(script[0]);
     }
     };
     })*/
    .filter("OrderState", function () {
        return function (input) {
            if (input == 'PENDING_SETTLEMENT') {
                return '待结算';
            } else if (input == 'SETTLED') {
                return '已结算';
            }
            else if (input == 'REFUNDED') {
                return '已退款';
            }

            return "未知状态";
        }
    })

    .controller('SellerPageController', ['$scope', '$state', '$rootScope','$ocLazyLoad',
        'SellerPageFty', 'BalanceSession', 'UserInfo', 'DWStatus','withdrawBalance', 'cateLeftIndex','PointRate',
        'GlobalVariable','wCateCache','WholesalePCDCode',
        function ($scope, $state, $rootScope, $ocLazyLoad, SellerPageFty, BalanceSession, UserInfo, DWStatus, withdrawBalance, cateLeftIndex,
                  PointRate,GlobalVariable,wCateCache,WholesalePCDCode) {

            //title
            document.title = "积分中心";

            $ocLazyLoad.load('Jquery').then(function () {
                $ocLazyLoad.load('JqueryWeUI').then(function () {
                    //console.log("sellerPage:jquery loaded");
                })
            });

            $scope.point_rate = PointRate.rate;
            $scope.isSimpleMember = false; //是否显示商品批发入口
            $scope.isShowMyAgent = false; //是否显示我的代理入口

            $rootScope.tabsNumber = 3;
            cateLeftIndex.cate_nav_index = 0;
            cateLeftIndex.goods_list_index = 0;

            //用户信息
            getUserInfo();
            //分销余额
            getOwnerBalance();

            function getUserInfo() {
                var loaded = false;
                if ($rootScope.profile_session) {
                    if ($rootScope.profile_session.userInfo) {
                        loaded = true;
                        console.log('userInfo loaded')
                    }
                } else {
                    $rootScope.profile_session = {}
                }

                if (!loaded) {
                    SellerPageFty.sellerUserInfoService()
                        .then(function (json) {
                            if (json.status_code == 0) {
                                $scope.userInfo = json.data;

                                if(localStorage['registerDate'] != null){
                                    localStorage.removeItem('registerDate');
                                }
                                if(localStorage['recommenderId'] != null){
                                    localStorage.removeItem('recommenderId');
                                }
                                localStorage['registerDate'] = $scope.userInfo.register_date;
                                localStorage['recommenderId'] = $scope.userInfo.uid;
                                //console.log('userInfo: ' + angular.toJson($scope.userInfo));
                                UserInfo.register_date = $scope.userInfo.register_date;
                                UserInfo.recommender_id = $scope.userInfo.uid;
                                //UserInfo.recommender_name = $scope.userInfo.real_name;

                                $rootScope.profile_session.userInfo = $scope.userInfo;
                            }
                        }, function (error) {
                            $.toast('获取信息失败', 'cancel');
                            console.log('获取信息失败：' + error);
                        })
                } else {
                    $scope.userInfo = $rootScope.profile_session.userInfo;
                    UserInfo.register_date = $rootScope.profile_session.userInfo.register_date;
                }
            }

            function getOwnerBalance() {
                SellerPageFty.ownerBalanceService()
                    .then(function (json) {
                        if (json.status_code == 0) {
                            $scope.owner_balance = json.data;
                            //console.log('owner_balance: ' + angular.toJson($scope.owner_balance));

                            $scope.owner_balance.is_member = $scope.owner_balance.is_agent
                                || $scope.owner_balance.is_partner
                                || $scope.owner_balance.is_seller;

                            if ($scope.owner_balance.is_partner) {
                                $scope.owner_balance.level_percent = getLevelPercent();
                            }

                            if(json.data.is_physical && json.data.is_partner && GlobalVariable.CAN_APPLY_CROWN){
                                $scope.is_physical = 1;
                            }

                            if(json.data.is_crown && json.data.is_physical){
                                $scope.isSimpleMember = true;
                                if(json.data.is_crown_ship_temp){
                                    $scope.is_physical = 3;
                                }else{
                                    $scope.is_physical = 2;
                                }
                            }else if(!json.data.is_crown && json.data.is_physical && json.data.is_partner){
                                $scope.isSimpleMember = true;
                            }else{
                                $scope.isSimpleMember = false;
                            }

                            if(json.data.is_agent && json.data.is_physical){
                                $scope.isShowMyAgent = true;
                            }

                            /// save session
                            BalanceSession.balance = $scope.owner_balance.balance;
                            WholesalePCDCode.isAgent = $scope.owner_balance.is_agent;
                        }
                    }, function (error) {
                        $.toast('获取信息失败', 'cancel');
                    })
            }

            function getLevelPercent() {
                ///if($scope.owner_balance.partner_pool_count <= $scope.owner_balance.next_partner_level.headcount_quota){
                //    return 0;
                //}

                //var extra = $scope.owner_balance.partner_pool_count - $scope.owner_balance.partner_level.headcount_quota;
                //var levelSpan = $scope.owner_balance.next_partner_level.headcount_quota - $scope.owner_balance.partner_level.headcount_quota;

                if ($scope.owner_balance.next_partner_level) {
                    var val = ($scope.owner_balance.partner_pool_count * 100 / $scope.owner_balance.next_partner_level.headcount_quota);
                    return parseInt(val);
                }

                return 0;
            }

            $scope.lv_text = function(is_seller, is_agent, is_partner){
                if(is_agent){
                    $scope.lv_name = '代理商';
                    return true;
                }
                if(is_partner){
                    $scope.lv_name = '经销商';
                    return true;
                }
                if(is_seller){
                    $scope.lv_name = '会员';
                    return true;
                }
                return false;
            };

            //显示经销商星星
            $scope.isSellerStar = function(isCrown, isSeller, level){

                if(!isCrown && isSeller && 0 < level <= 6){
                    return true;
                }
                return false;

            };


            //推广二维码
            $scope.initQrcode = function (q_r_code) {

                document.getElementById('qrcode-backgroud').style.display = 'block';
                //document.getElementById('light').style.display='block';
                //document.getElementById('fade').style.display='block';

                /*var divhtml = document.getElementById("dituContent");
                if (divhtml.firstElementChild != null) {
                    divhtml.removeChild(divhtml.childNodes[0]);
                    divhtml.removeChild(divhtml.childNodes[1]);
                }
                var invitationUrl = "http://www.kequandian.net/app/app?invite_code=" + q_r_code;
                if (invitationUrl != null) {
                    loadScript("lib/qrcodejs/qrcode.min.js", function () {
                        var qrcode = new QRCode(divhtml, {
                            width: 210,
                            height: 210
                        });
                        qrcode.makeCode(invitationUrl);
                    });
                } else {
                    $.toast('生成二维码失败', 'cancel');
                }*/
                //关闭二维码
                $scope.close_qrcode = function () {
                    document.getElementById('qrcode-backgroud').style.display = 'none';
                    //document.getElementById('light').style.display='none';
                }
            };

            function loadScript(src, callback) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                if (callback)script.onload = callback;

                var sc = document.getElementsByTagName("head")[0];
                sc.appendChild(script);
                script.src = src;
            }

            //进入提现页
            $scope.goToWithdrow = function (phone, balance) {
                withdrawBalance.balance = balance;
                withdrawBalance.phone = phone;

                $state.go('withdraw')
            };

            //进入我的信息页
            $scope.goToDistributionInfo = function () {
                DWStatus.d_w_status = 1;
                $state.go('distributionInfo');
            };

            //线下门店
            //$scope.is_physical = 1;
            $scope.off_line_shop = function(is_physical){


                if(is_physical == 2){

                    if($scope.owner_balance.is_crown_ship_temp){

                        if($scope.owner_balance.msg != null){
                            //$.alert('请于'+ $scope.owner_balance.msg.interval +'小时内完成'+ $scope.owner_balance.msg.targetAmount +'元的批发，成为真正线下皇冠商才可以进入。','提示');
                            $.alert($scope.owner_balance.msg ,'提示');
                        }else{
                            console.log("owner_balance-->msg is null");
                        }
                    }else{
                        $state.go('offLineShop');
                    }
                    //$state.go('offLineShop');
                }else if(is_physical == 1){
                    $state.go('sellerAuthorization',{isAgent:false});
                }
            };

            //商品批发
            $scope.wholesale = function(owner_balance){

                if(owner_balance.is_crown && owner_balance.is_physical){
                    wCateCache.isPcs = -1;
                    $state.go('wholesale',{isCrown: owner_balance.is_crown});
                }else if(!owner_balance.is_crown && owner_balance.is_physical && owner_balance.is_partner){
                    $.alert('您还不是皇冠经销商无权查看，请与所属皇冠经销商联系','提示');
                }


                //if(isCrown){
                //    wCateCache.isCrown = isCrown;
                //    $state.go('addressManager');
                //}else{
                //    $state.go('wholesale',{isCrown: isCrown});
                //}

                /*SellerPageFty.getWholesaleService()
                    .then(function (json) {
                        if (json.status_code == 0) {

                            var wholesaleInfo = json.data;

                            if(wholesaleInfo != null){
                                if(wholesaleInfo.wholesaleRegion != null){
                                    if(isCrown){
                                        var wholesaleRegion = wholesaleInfo.wholesaleRegion;
                                        WholesalePCDCode.province = wholesaleRegion.province;
                                        WholesalePCDCode.city = wholesaleRegion.city;
                                        WholesalePCDCode.district = wholesaleRegion.district;
                                        console.log('wCateCache.isPcs > ' + wCateCache.isPcs);
                                        $state.go('wholesaleGoodsList');
                                    }else{
                                        $state.go('wholesale',{isCrown: isCrown});
                                    }
                                }else{
                                    $state.go('wholesale',{isCrown: isCrown});
                                }
                            }else{
                                console.log('wholesaleRegion is null: ' + angular.toJson(json));
                            }
                        }else{
                            console.log('获取商品批发信息失败: ' + angular.toJson(json));
                        }
                    }, function (error) {
                        console.log('获取商品批发信息失败: ' + angular.toJson(error));
                    })*/
            };

            //我的代理
            $scope.my_agent = function(){
                $state.go('myAgent');
            }

        }])


    /*
     * 成为分销商
     * */
    .controller('becomeDistributorController', ['$scope', '$state', '$rootScope', '$ocLazyLoad', 'SellerPageFty', 'GlobalVariable',
        function ($scope, $state, $rootScope, $ocLazyLoad, SellerPageFty, GlobalVariable) {

            //$ocLazyLoad.load('Jquery').then(function () {
            //    $ocLazyLoad.load('JqueryWeUI').then(function () {
            //        console.log('settlement:jquery loaded');
            //    })
            //});

            document.title = '成为分销商';

            $rootScope.tabsNumber = 3;

            $scope.distributionInfoBtn = false;  //修改我的信息按钮
            $scope.becomeDistributorBtn = true;   //成为分销商按钮

            //获取个人信息
            getUserInfo();

            function getUserInfo() {
                SellerPageFty.sellerUserInfoService()
                    .then(function (json) {
                        if (json.status_code == 0) {
                            $scope.userInfo = json.data;
                            //console.log(angular.toJson($scope.userInfo));
                        }
                    }, function (error) {
                        $.toast('获取信息失败', 'cancel');
                    })
            }

            //提交分销商信息
            $scope.postDistributorInfo = function () {

                var real_name = $scope.userInfo.real_name;
                var phone = $scope.userInfo.phone;

                if (!angular.isString($scope.userInfo.real_name)
                    || $scope.userInfo.real_name.length == 0) {
                    $.toast('姓名不能为空', 'cancel');
                    return;
                }
                if (!angular.isString($scope.userInfo.phone)
                    || $scope.userInfo.phone.length == 0) {
                    $.toast('手机号不能为空', 'cancel');
                    return;
                } else if (!checkPhone($scope.userInfo.phone)) {
                    $.toast('手机号码无效', 'cancel');
                    return;
                }

                //console.log("姓名：" + real_name + " " + "手机号：" + phone);

                SellerPageFty.becomeDistribution(real_name, phone)
                    .then(function (json) {
                        //console.log(angular.toJson(json));
                        if (json.status_code == 0) {

                            if (json.data.seller_ship == 0) {
                                GlobalVariable.SELLER_SHIP = 'APPLYING';
                                $state.go('home.sellerApplying', {}, {reload: true});
                            } else if (json.data.seller_ship == 1) {
                                GlobalVariable.SELLER_SHIP = 'YES';
                                $state.go('home.sellerPage', {}, {reload: true});
                            }

                            $.toast('提交成功');
                        } else {
                            $.toast('提交失败请与客服联系', 'cancel');
                        }
                    }, function (error) {
                        $.toast('提交信息失败', 'cancel');
                        console.log('提交信息失败：' + angular.toJson(error));
                    })
            };

            function checkPhone(str) {
                var isphone = /^((\+|0)86)?\d{11}$/.test(str);
                return isphone;
            }

        }])

    .controller('SellerApplyingController', ['$scope', '$rootScope', '$state', '$timeout','cateLeftIndex',
        function ($scope, $rootScope, $state, $timeout, cateLeftIndex) {

            //title
            document.title = "申请";

            cateLeftIndex.cate_nav_index = 0;
            cateLeftIndex.goods_list_index = 0;

            // just go in page area
            $scope.in_page = true;

            $timeout(function () {
                if( $scope.in_page) {
                    $state.go('home.homePage',{},{reload:true});
                }
            }, 5000);

            //立即跳转首页
            $scope.goToHomePage = function () {
                $state.go('home.homePage',{},{reload:true});
            };

            //Do your $on in here, like this:
            $rootScope.$on("$locationChangeStart", function (event, next, current) {
                if(current.indexOf('#/home/sellerApplying') > -1){
                    $scope.in_page = false;
                    //console.log('in-page?'+$scope.in_page);
                }
            });

        }])

    /*
     * 提佣方案
     * */
    .controller('PianController', ['$scope', '$state', 'SellerPageFty', function ($scope, $state, SellerPageFty) {

        //title
        document.title = "提佣方案";
    }])

;
