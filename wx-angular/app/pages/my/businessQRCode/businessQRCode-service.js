angular.module('businessQRCode.service', [])
    .factory('BusinessQRCodeFty', ['$http','$q','GlobalVariable', function($http,$q,GlobalVariable) {
        return {
            // 获取商家个人信息数据
            businessUserInfoService: function () {
                var deferred = $q.defer();
                var url = GlobalVariable.SERVER_PATH + "/merchant/profile";
                $http.get(url,{
                    headers:{
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