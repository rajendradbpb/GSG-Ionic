app.controller("PlanController",function($ionicModal,$stateParams,$timeout,$state,$scope,$ionicLoading,PlanService,$localStorage){
   var vm = this;
   vm.myPlan = {};
    var empChecked = false;
    var friendChecked = false;
    var socialChecked = false;
    var internetChecked = false;

   vm.toggleGroup = function(list){
    if(vm.isGroupShown(list)){
        vm.shownGroup = null;
    }
    else{
        vm.shownGroup = list;
    }
};
vm.isGroupShown = function(list){
    return vm.shownGroup === list;
}
   vm.getSchemes = function(){
       $ionicLoading.show({
           template: 'Loading...'
       })
        PlanService.getSchemes().get(function(response){
            console.log(response);           
            $timeout(function(){
                $ionicLoading.hide();
                vm.shemelist = response.data;
            },400)
           
        },function(error){
            console.log(error);
            $ionicLoading.hide();
        })

    };
    vm.planListModal = function(scheme_detail){
        $ionicModal.fromTemplateUrl('templates/modal/planList_modal.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function(subscrpModal) {
            vm.subscrpModal = subscrpModal;
            vm.subscrpModal.show();
            vm.planSrvcDtls = scheme_detail;
        });
    };
    vm.clickedFriend = function()  {
        vm.empChecked = false;
        vm.socialChecked = false;
        vm.internetChecked = false;
        vm.friendChecked = true;
    };
    vm.clickedEmp = function()  {
        vm.empChecked = true;
        vm.friendChecked = false;
        vm.socialChecked = false;
        vm.internetChecked = false;
    };
    vm.clickedInternet = function() {
        vm.empChecked = false;
        vm.friendChecked = false;
        vm.socialChecked = false;
        vm.internetChecked = true;
    };
    vm.clickedSocial = function()   {
        vm.empChecked = false;
        vm.friendChecked = false;
        vm.socialChecked = true;
        vm.internetChecked = false;
    }
    vm.subscribePlan = function(planToSubscribe){
        $ionicLoading.show({
            template:'Subscribing...'
        })
        var obj = {};
        obj.user_id = $localStorage.loggedin_user.userId;
        obj.schemeId = planToSubscribe.schemeId;
        PlanService.subscribePlan(obj).get(function(response){  
            console.log(response);   
            $ionicLoading.hide();
            vm.subscrpModal.remove();  
            $scope.openCheckOutModal(response.data);    
            // $timeout(function(){
            //     $ionicLoading.hide();
            //     $scope.successPop('Success', 'Plan Subscribed Successfully...','app.mapView'); 
            // },500);
        },function(error){          
            console.log(error);
            vm.subscrpModal.hide();        
            vm.subscrpModal.remove();        
            $timeout(function(){
                $ionicLoading.hide();
                $scope.alertPop('Error', error.data.message);
            },500);          
        });
    };
   vm.getMyPlan = function(){
       PlanService.getUserSchemes().get(function(response){
        console.log(response);
        vm.myPlan = response.data;
        $localStorage.loggedin_user.schemes = vm.myPlan;
        angular.forEach(vm.myPlan, function(item){
            var sbscrptnDate = moment(item.subscriptionDt);
            var validtyLeft = moment().diff(sbscrptnDate, 'days');
            item.validityLeft = item.durationInDays-validtyLeft;
            
        });
       },function(error){
        console.log(error);
       });
   }
    vm.closePlanListModal = function() {
        vm.subscrpModal.hide();
        vm.subscrpModal.remove();
    }
    
});