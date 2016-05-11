angular.module('cart.controller', ['cart.service','addressManager.service'])

    .controller('CartController', ['$scope', '$state', 'CartFty', function($scope, $state, CartFty){

        AllCarts();

        function AllCarts() {
            CartFty.getCarts().then(
                function (result) {
                    console.log(result.data);
                    $scope.carts = result.data;
                },function (error){
                    console.log(error);
            })
        }

        //商品数量增减
        $scope.downQuantity = function(id){
            angular.forEach($scope.carts, function(value, key){
                console.log(id);
                if(value.product_id == id){
                    if(value.quantity > 1){
                        value.quantity = value.quantity -1;
                    }
                }
            },$scope.carts);
            console.log($scope.carts);
        };
        $scope.upQuantity = function(id){
            angular.forEach($scope.carts, function(value, key){
                if(value.product_id == id){
                    value.quantity = value.quantity +1;
                }
            },$scope.carts);
            console.log($scope.carts);
        };

        //alert(angular.toJson($scope.carts));

        //删除购物车单项商品
        $scope.showDeleteConfirm= function(id) {
            $.confirm("您确定要删除该商品吗?", "确认删除?", function() {
                CartFty.deleteCart(id).then(
                    function (result) {
                        console.log(result);
                        $state.go('home.cart',{}, {reload: true});
                    },function (error){
                        console.log(error);
                    });
                $.toast("已经删除!");
            }, function() {
                //取消操作
            });
        };

        //选购结算
        $scope.checkAll = function() {
            $scope.carts.forEach(function (it) {
                it.$checked = $scope.$allChecked;
            });
        };
        $scope.checkItem = function(item) {
            $scope.$allChecked = $scope.carts.every(function(it) {
                return it.$checked;
            });
        };
        $scope.totalToPay = function () {
            return $scope.carts.reduce(function(prev, next) {
                return next.$checked ? prev + next.quantity * next.price : prev;
            }, 0);
        };
        $scope.totalFreight = function () {
            return $scope.carts.reduce(function(prev, next) {
                return next.$checked ? prev + next.quantity * next.freight : prev;
            }, 0);
        };
        $scope.someChecked = function() {
            return $scope.carts.some(function(it) {
                return it.$checked;
            });
        };

        //去结算
        $scope.checkedCarts=[];
        $scope.goSettlement= function (pay,freight){
            console.log(pay);
            $scope.carts.some(function(it) {
                if(it.$checked){
                    $scope.checkedCarts.push(it);
                }
            });
            //$scope.checkedCarts.push(pay);
            //$scope.checkedCarts.push(freight);
            console.log($scope.checkedCarts);
            $state.go('cart-settlement', {carts:$scope.checkedCarts,totalToPay:pay,totalFreight:freight});
        };

    }])

    .controller('SettlementController', ['$scope', '$state', '$stateParams', 'AddressManagerFty', 'CartFty', function($scope, $state, $stateParams, AddressManagerFty, CartFty){

        AllContacts();

        function AllContacts() {
            AddressManagerFty.getContacts().then(
                function (result) {
                    $scope.contacts = result.data;
                    angular.forEach($scope.contacts, function(data,index){
                        if(data.is_default == 1){
                            $scope.currentContact = data;
                            console.log($scope.currentContact);
                        }
                    });
                },function (error){
                    console.log(error);
            })
        }

        //获取结算数据
        $scope.settlementData=[];
        console.log("carts:"+$stateParams.carts);
        angular.forEach($stateParams.carts, function(data,index){
            $scope.settlementData[index]=({
                "product_id": data.product_id,
                "quantity": data.quantity
            });
        });
        console.log($scope.settlementData);
        $scope.pay=$stateParams.totalToPay;
        $scope.freight=$stateParams.totalFreight;

        //提交订单
        $scope.order={};
        $scope.addOrderSubmit=function() {
            console.log($scope.order);
            CartFty.addOrder($scope.order).then(
                function (result) {
                    console.log(result.data);
                    $state.go('order-confirm',{data:result.data});
                },function (error){
                    console.log(error);
                });
        };

        //新增地址
        $scope.addAddress= function (){
            $state.go('add-address');
        };
        //修改地址
        $scope.editAddress= function (item){
            console.log(item);
            $state.go('edit-address', {data:item});
        };
        //删除地址
        $scope.deleteContact= function(id) {
            $.confirm("", "确认删除?", function() {
                AddressManagerFty.deleteContact(id).then(
                    function (result) {
                        console.log(result);
                        $state.go('cart-settlement',{}, {reload: true});
                    },function (error){
                        console.log(error);
                    });
                $.toast("已经删除!");
            }, function() {
                //取消操作
            });
        };

        //选择地址
        $scope.changeContact= function(item) {
            $scope.currentContact = item;
            console.log($scope.currentContact);
        };

        //显示发票抬头
        $scope.invoiceTitle= false;

        $scope.showInvoiceTitle= function() {
            $scope.invoiceTitle=!$scope.invoiceTitle;
        };

        //收货时间选项
        $scope.receivingTime=[{key:'anytime',value:'收货时间不限'},{key:'weekendOrHoliday',value:'周六日/节假日收货'},{key:'workDay',value:'周一至周五收货'}];

    }])
    .controller('OrderConfirmController', ['$scope', '$state', '$stateParams', 'CartFty', function($scope, $state, $stateParams, CartFty){
        $scope.orderData=$stateParams.data;
        $scope.confirm=function(order_number){
            console.log(order_number);
            CartFty.wpay(order_number).then(
                function (result) {
                    console.log(result);
                    //$state.go('cart-settlement',{}, {reload: true});
                },function (error){
                    console.log(error);
                });
        }
    }]);


