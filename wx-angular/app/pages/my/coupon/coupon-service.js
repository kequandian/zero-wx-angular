angular.module('coupon.service', [])
    .factory('CouponFty', ['$http', '$q','GlobalVariable', function($http, $q,GlobalVariable) {
        return {
            // 获取优惠券
            couponsService: function () {
                var deferred = $q.defer();
                var url = GlobalVariable.SERVER_PATH + "/coupon";
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
            // 获取优惠券(分页)
            couponsService: function (couponStatus, pageNumber, pageSize) {
                var deferred = $q.defer();
                var url = GlobalVariable.SERVER_PATH + "/coupon?status="+ couponStatus +"&pageNumber="+ pageNumber +"&pageSize=" + pageSize;
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

            // 获取商品类别数据
            activationService: function (id) {
                var deferred = $q.defer();
                var url = GlobalVariable.SERVER_PATH + "/coupon/" + id;
                $http.put(url,{
                    "status": "ACTIVATION"
                },{
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
        };
    }]);