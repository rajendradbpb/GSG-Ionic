app.controller("RequestController",function($ionicModal,$stateParams,$timeout,$state,$scope,$ionicLoading,TicketService){
    var vm = this;
    vm.myOrders = function(){
        $ionicLoading.show({
            template :'Loading...'
        });
    TicketService.getRequestTicket().get(function(response){
        console.log(response);
        vm.completedOrdersArr = [];
        vm.canceledOrdersArr = [];
       // vm.newOrdersArr = [];
        vm.liveOrdersArr = [];
        vm.futureOrdersArr = [];
        angular.forEach(response.data,function(item){
            if(item.requestStatus == "CLOSED"){
                vm.completedOrdersArr.push(item);
            }
            else if(item.requestStatus == "CANCELED"){
                vm.canceledOrdersArr.push(item);
            }else{
                if( moment(item.serviceDate) > moment() ){
                    vm.futureOrdersArr.push(item);
                }
                else {
                    vm.liveOrdersArr.push(item);
                }
            }
        })
        $timeout(function(){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        },400);
    },function(error){
        $ionicLoading.hide();
        $scope.alertPop("Error", "Something went wrong.");
        console.log(error);
    });
};

    vm.myCartOrders = function(){
        vm.cartOrders = {};
        TicketService.getCardOrders().get(function(response){
            console.log(response);
            vm.cartOrders = response.data;
            vm.totalPrice = 0;
            angular.forEach(vm.cartOrders, function(item){
               vm.totalPrice = vm.totalPrice + item.amount;                
               
            });
            $scope.$broadcast('scroll.refreshComplete');
        },function(error){
            if(error.status == 417){
                $scope.alertPop("Error",error.data.message);
            }
            else {
                $scope.alertPop("Error","Error in fetching cart items");
            }
        });
    };
    vm.getTotalPrice = function(selection){
        console.log(selection);
        TicketService.getCardOrders().get(function(response){
            vm.totalPrice = 0;
            angular.forEach(response.data, function(item){
                if(selection){
                    vm.totalPrice = selection.amount;
                }
                else {
                    vm.totalPrice = vm.totalPrice + item.amount;
                }               
            });
        },function(error){

        }); 
    }
    vm.buyFromCart = function(){
        console.log(vm.cartSelection);
        $ionicLoading.show({
            template : 'Loading...'
        });
        TicketService.buyFromCart(vm.cartSelection.id).get(function(response){
            console.log(response);
            $ionicLoading.hide();
            $scope.openCheckOutModal(response.data);
        },function(error){
            $ionicLoading.hide();
            if(error.status == 417){
                $scope.alertPop("Error",error.data.message);
            }
           else {
                $scope.alertPop("Error","Something wrong..Cannot buy this order now ");
            }
            
            console.log(error);
        });

    };
    vm.removeFromCart = function(cartId,orderAmount){
        $ionicLoading.show({
            template : 'Removing...'
        });
        console.log(cartId);
        TicketService.removeFromCart(cartId).delete(function(response){
            console.log(response);
            vm.totalPrice = vm.totalPrice - orderAmount;
            vm.cartOrders = response.data;
            $ionicLoading.hide();
        },function(error){
            $ionicLoading.hide();
            $scope.alertPop("Error","Error in removing from cart");
            console.log(error);
        });
    }
    vm.reqDetails = function(details){
        $ionicModal.fromTemplateUrl('templates/modal/req_details_modal.html',{
            scope : $scope,
            controller : 'RequestController',
            controllerAs : 'reqCtrl'
          }).then(function(reqDetailsModal){        
            vm.reqDetailsModal = reqDetailsModal;
            vm.reqDetailsModal.show();
            vm.requestDetails = details;
            console.log(vm.requestDetails);
          });
    };
    vm.closeREqDetailsModal = function(){
        vm.reqDetailsModal.hide();
        vm.reqDetailsModal.remove();
    };
    vm.openRatingModal = function(){
        console.log("comingggggg");
        $ionicModal.fromTemplateUrl('templates/modal/rating_modal.html',{
            scope : $scope,
             animation : 'slide-in-up',
            controller : 'RequestController',
            controllerAs : 'reqCtrl'
          }).then(function(ratingModal) {
            vm.ratingModal = ratingModal;        
            vm.ratingModal.show();
        });
    };
    vm.closeRatingModal = function(){
        vm.ratingModal.hide();
        vm.ratingModal.remove();
    };
    vm.openEditCartOrderModal = function(orderToBeEdited){
        vm.ordersToBeEdited = {};
        $ionicModal.fromTemplateUrl('templates/modal/cart_edit_modal.html',{
            scope : $scope,
            animation : 'slide-in-up',
            controller : 'RequestController',
            controllerAs : 'cartCtrl'
        }).then(function(editCartModal){
            console.log(orderToBeEdited);
            vm.ordersToBeEdited = orderToBeEdited;
            vm.editCartModal = editCartModal;        
            vm.editCartModal.show();
        })
    };
    vm.closeEditCartModal = function(){
        vm.editCartModal.hide();
        vm.editCartModal.remove();
    };
 });