(function(angular, $, _) {
  angular.module('listmembers').config(function($routeProvider) {
      $routeProvider.when('/memberlist', {
        controller: 'Listmembersmain',
        templateUrl: '~/listmembers/main.html',


      });
    });
  angular.module('listmembers').controller('Listmembersmain', function($scope, crmApi, crmStatus, crmUiHelp) {
          m_array = [];
		  var filtr = function(){
			       this.start_date ='';
			       this.end_date ='';
			  };
		  $scope.d_filtr = new filtr();
		  $scope.process = function($event){
				    getMembers.init($scope.d_filtr);
                   $event.preventDefault();
			  };
		  var getMembers = {
			    init : function($filtr){
					    if($filtr){
							  this.send_q($filtr);
							}else{
							  this.send_q(false);
							}  
					},
				send_q : function($filtr){
				          var $this = this;
					      if($filtr){
							     crmApi('Membership','get',{start_date:{"BETWEEN":[$filtr.start_date, $filtr.end_date]}}).then(function(result){
									  $this.preocess_result(result);
			                     })
							  }else{
									 crmApi('Membership','get').then(function(result){
										  $this.preocess_result(result);
									 })							  
							  } 
					},
				preocess_result : function(obj){
				             console.log(obj);

							 var m_data = obj.values;
					         for(key in m_data){
	                                this.construct.init(m_data[key]);
								 }
							 $scope.members = m_array;
							 this.clear(m_array);
							
					},
				construct : {
				            init : function(obj){
							        $this = this;
									var key = obj.contact_id;
								    crmApi('Contact','get',{contact_id:key}).then(function(result){
                                                
												 var c_id = '../contact/view?reset=1&cid='+key;
												 var display_name = result.values[key].display_name;
												 var start_date = obj.start_date;
												 var join_date = obj.join_date;
												 var member = new $this.m_obj(c_id,display_name,start_date,join_date);
												 $this.render(member);
												 
												 
										  });
									
									
								},

						    m_obj : function(contact_id,name,start_date,join_date){
								       this.contact_id = contact_id;
									   this.name = name;
									   this.start_date = start_date;
									   this.join_date = join_date;
								},
							render : function(obj){
									 m_array.push(obj);
								
								}
							
					
					},
				clear : function(array){
					      m_array.length = 0;
					}

		  }
			  
			  getMembers.init();
  });

})(angular, CRM.$, CRM._);
