angular.module('category.route', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('home.category', {
            url: '/category/:categoryId/:categoryType',
            templateUrl:  'pages/category/category.html',
            controller:'CategoryController',
            resolve: {
                loadData: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load('Category');
                }]
            }/*,
            params:{
                categoryId:null,
            }*/
        })
    }]);