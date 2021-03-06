angular.module('cart.route', [/*'cart.controller'*/])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('home.cart', {
            url: '/cart',
            cache: 'true',
            templateUrl: 'pages/cart/cart.html',
            controller: 'CartController',
            resolve: {
                loadData: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('Cart');
                }]
            }
        })
            .state('cart-settlement', {
                url: '/cart-settlement',
                templateUrl: 'pages/cart/settlement/settlement.html',
                controller: 'SettlementController',
                resolve: {
                    loadData: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('Cart');
                    }]
                },
                params: {
                    'carts': null,
                    'totalToPay': null,
                    'totalFreight': null
                }
            })
            .state('order-confirm', {
                url: '/orderConfirm',
                templateUrl: 'pages/cart/settlement/orderConfirm.html',
                controller: 'OrderConfirmController',
                resolve: {
                    loadData: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('Cart');
                    }]
                },
                params: {
                    'data': null
                }
            })
    }]);