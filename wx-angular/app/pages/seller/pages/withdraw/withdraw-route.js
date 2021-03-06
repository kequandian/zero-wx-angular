/**
 * Created by jimmie on 2016/6/7.
 */

angular.module('withdraw.route', [/*'withdraw.controller'*/])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('withdraw', {
            url: '/withdraw',
            templateUrl: 'pages/seller/pages/withdraw/withdraw.html',
            controller: 'WithdrawController',
            resolve: {
                loadData: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('Withdraw');
                }]
            }
        }).state('exchangeRecord', {
            url: '/exchangeRecord',
            templateUrl: 'pages/seller/pages/withdraw/exchangeRecord/exchangeRecord.html',
            controller: 'ExchangeRecordController',
            resolve: {
                loadData: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('Withdraw');
                }]
            }
        })
    }]);