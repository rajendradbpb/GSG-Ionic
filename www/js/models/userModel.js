app.factory("UserModel",function() {
  var userModel = {};
  var registerData = {};
  var userdata = {};
  var tickets = [];
  return {
    setUser : function(user){
      userdata = user;
    },
     getUser : function(user){
      return userdata;
    },
    setRegisterData : function(userData){
      registerData = userData;
    },
    getRegisterData : function(userata){
      return registerData;
    },
    getTicket:function() {
      return tickets.length ? tickets : [];
    },
    setTicket:function(ticketData) {
      tickets = ticketData;
    }
  }
}),
app.factory("LocationModel",function() {
 
  var currentLocation = {};
  return {
    setCurrentLocation : function(location){
      currentLocation = location;
    },
     getCurrentLocation : function(){
      return currentLocation;
    }
   
  }
})
