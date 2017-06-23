/*
 * 线下门店
 * */
angular.module('offLineShop.controller', ['offLineShop.service'])
    .controller('OffLineShopController', ['$scope','$state', 'OffLineShopFty',
        function ($scope,$state, OffLineShopFty) {

            //title
            document.title = "线下门店";


            $scope.seller_team_action = function(){
                $state.go('sellerTeam');
            };

            $scope.seller_authorization_action = function(){
                //$state.go('sellerAuthorization',{isAgent:true});
                $state.go('authorizationPage');
            };

            $scope.my_recommend_action = function(){
                //return;
                $state.go('myRecommend');
            };

            $scope.withdraw_apply_action = function(){
                $state.go('withdrawApply');
            };

            $scope.offLine_exchange_record_action = function(){
                $state.go('offLineExchangeRecord');
            };

            $scope.settlement_record_action = function(){
                $state.go('settlementRecord');
            };

        }])



    /*
     * 经销授权nav
     * */
    .controller('AuthorizationPageController', ['$scope','$state','$filter','OffLineShopFty','UserInfo',
        function ($scope, $state,$filter,OffLineShopFty,UserInfo) {

            document.title = "经销授权";

            var type_status = null;
            //console.log('UserInfo: ' + angular.toJson(UserInfo));

            //进入皇冠经销授权页
            $scope.crown_seller_authorization_action = function(){
                type_status = 'crown';
                //$state.go('authorizationqrcode',{
                //    recommenderId: UserInfo.recommender_id,
                //    typeStatus: type_status,
                //    applyStatus: 'rec'
                //});
                $state.go('applyauth',
                    {
                        recommenderId: UserInfo.recommender_id,
                        typeStatus: type_status,
                        applyStatus: 'rec'
                    });
            };

            //进入星级经销授权页
            $scope.star_seller_authorization_action = function(){
                type_status = 'star';
                $state.go('authorizationqrcode',{
                    recommenderId: UserInfo.recommender_id,
                    typeStatus: type_status,
                    applyStatus: 'rec'
                });

                //$state.go('applyauth',
                //    {
                //        recommenderId: UserInfo.recommender_id,
                //        typeStatus: type_status,
                //        applyStatus: 'rec'
                //    });
            };


        }])
;