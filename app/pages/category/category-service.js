angular.module('category.service', [])
    .factory('CategoryFty', ['$http', '$q', 'GlobalVariable', function($http,$q,GlobalVariable) {
        return{
            // 获取商品类别数据
            categoryService: function () {
                var deferred = $q.defer();
                var url = GlobalVariable.SERVER_PATH + "/product_category";
                $http.get(url,{
                    headers: {
                        'Authorization': GlobalVariable.ACCESS_TOKEN
                    }
                })
                    .success(function (data) {
                        return deferred.resolve(data);
                    }).error(function (data) {
                        return deferred.reject(data);
                    });
                return deferred.promise;
            },

            // 获取商品列表数据
            getProductListService: function (cateId,pageNumber,pageSize,orderBy) {
                var deferred = $q.defer();
                var url = GlobalVariable.SERVER_PATH + "/product_category/" + cateId + "?pageNumber=" + pageNumber + "&pageSize=" + pageSize + orderBy;
                console.log(url)
                $http.get(url)
                    .success(function (data) {
                        return deferred.resolve(data);
                    }).error(function (data) {
                        return deferred.reject(data);
                    });
                return deferred.promise;
            },

            // 获取拼团信息
            getFightGroupsService: function (cateId,pageNumber,pageSize,orderBy) {
                var deferred = $q.defer();
                var url = GlobalVariable.SERVER_PATH + "/piece_group_purchase?pageNumber=" + pageNumber + "&pageSize=" + pageSize + orderBy;
                console.log("拼团：" + url)
                $http.get(url,{
                    headers: {
                        'Authorization': GlobalVariable.ACCESS_TOKEN
                    }
                })
                    .success(function (data) {
                        return deferred.resolve(data);
                    }).error(function (data) {
                        return deferred.reject(data);
                    });
                return deferred.promise;
            }
        }
    }]);