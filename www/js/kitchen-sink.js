var myApp = new Framework7({
    modalTitle: 'Chat',
    animateNavBackIcon: true,
    init: false
});
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});
myApp.onPageInit('index', function(page){
	$$.ajax({
		url: apis,
		data: {
			data: 'cek'
		},
		type: 'post',
		crossDomain: true,
		dataType: 'json',
		success: function(a) {
			if (a.status == 'success') {
				if (localStorage.getItem('user') == null) {
					var x = new Date(),
						b = x.getDate(),
						c = (x.getMonth() + 1),
						d = x.getFullYear(),
						e = x.getHours(),
						f = x.getMinutes(),
						g = x.getSeconds(),
						date = d + '-' + (c < 10 ? '0' + c : c) + '-' + (b < 10 ? '0' + b : b) + ' ' + (e < 10 ? '0' + e : e) + ':' + (f < 10 ? '0' + f : f) + ':' + (g < 10 ? '0' + g : g);
					var h = {
						name: a.user,
						password: a.password,
						avatar: a.avatar,
						login: date,
						tipe: 'login'
					};
					userRef.push(h);
				}
				mainView.router.loadPage('main.html');
			}
		}
	});
	
	$$('#loginbtn').on('click', function(e) {

		var i = $$('#username').val(),
			password = $$('#password').val(),
			avatar = $$('#avatar').val();
		if (i != '' && password != '' && avatar != '') {
			
			$$.ajax({
				url: apis,
				data: {
					data: 'login',
					name: i,
					password: password,
					avatar: avatar
				},
				type: 'post',
				dataType: 'json',
			
				success: function(a) {
					if (a.status == 'success') {
						var x = new Date(),
							b = x.getDate(),
							c = (x.getMonth() + 1),
							d = x.getFullYear(),
							e = x.getHours(),
							f = x.getMinutes(),
							g = x.getSeconds(),
							date = d + '-' + (c < 10 ? '0' + c : c) + '-' + (b < 10 ? '0' + b : b) + ' ' + (e < 10 ? '0' + e : e) + ':' + (f < 10 ? '0' + f : f) + ':' + (g < 10 ? '0' + g : g);
						var h = {
							name: i,
							password: password,
							avatar: avatar,
							login: date,
							tipe: 'login'
						};
						userRef.push(h);
						localStorage.setItem('user', JSON.stringify(h));
						//alert(JSON.stringify(h));
						localStorage.setItem('tujuan', 'public');
        				localStorage.setItem('tipe', 'rooms');
						mainView.router.loadPage('main.html');
					} else {
						myApp.alert('username atau password salah');
					}
				}
			});
		} else {
			myApp.alert('Form input ada yang belum di isi');
		}
	});
});

myApp.init();

myApp.onPageInit('chat', function(page){
	var data = JSON.parse(localStorage.getItem('user'));
	localStorage.setItem('tipe', 'rooms');
	localStorage.setItem('tujuan', 'public');
	chat_realtime(userRef, messageRef, apis, data.name, data.avatar, data.password);
	$$('#passwordlogin').attr('src', data.password);
	$$('#avatarlogin').attr('src', data.avatar);
	$$('#userlogin').html(data.name);
	$$('#public strong').html(data.name);
	$$('#public img').attr('src', data.avatar);

	// user logout
	$$('#logout').on('click', function(e) {
		$$.ajax({
			url: apis,
			data: {
				data: 'logout'
			},
			type: 'post',
			crossDomain: true,
			dataType: 'json',
			success: function(a) {
				if (a.status == 'success') {
					var b = {
						name: data.name,
						tipe: 'logout'
					};
					localStorage.clear();
					userRef.push(b);
					mainView.router.loadPage('index.html');
				}
			}
		});
	});

});

myApp.onPageInit('register', function(page){
	$$('#signupbtn').on('click', function(e) {
	//alert('l');

			var nama_lengkap = $$('#nama_lengkap').val();
		    var email = $$('#email').val();
		    var name = $$('#name').val();
		    var department = $$('#department').val();
		    var password = $$('#password1').val();
		    var avatar = $$('#avatar').val();
		    var login = $$('#login1').val();
		    var status = $$('#status').val();

	  	//if (nama_lengkap != '' && email != '' && name != '' && department != '' && password != '' && avatar != '' && login != '' && status != '') {
	  		//if((nama_lengkap.validasi() && department.validasi() && name.validasi() && email.validasi() && password.validasi()) == true){
	  		//if( $$('#nama_lengkap').val().validasi() && $$('#email').val().validasi() && $$('#name').val().validasi() && $$('#department').val().validasi() && $$('#password1').val().validasi()){
		 	//validasi();
		 	//validasi(page.container);
		 	if (validasi(page.container)){
		 	/*if(validasi()){
		 		return true;
		 	}*/
		 	$$.ajax({
		        url: signupurl,
		        type: 'post',
				dataType: 'json',
		         data:{
		         	data: 'register',
		            nama_lengkap:nama_lengkap,
		            email:email,
		            name:name,
		            department:department,
		            password:password,
		            avatar: avatar,
		            login: login,
		            status: status
		         },
		         /*beforeSend: function validasi(ab){
		         	var ef = !0;
	    return $$(ab).find("input:required, select:required").each(function() {
	        if ("" == $$(this).val()) ef = !1, $$(this).parent().hasClass("smart-select") ? $$(this).parent().parent().css("border-bottom", "1px solid #ff3b30") : $$(this).css("border-bottom", "1px solid #ff3b30");
	        else {
	            var ab = /\.*/
	            /*switch ($$(this).attr("name")) {
	                case "email":
	                    ab = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	                    break;
	                case "nama_lengkap":
	                    ab = /^[a-zA-Z ]+$/;
	                    break;
	                case "name":
	                    ab = /^[a-zA-Z0-9]*$/;
	                    break;
	                case "password":
	                    ab = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
	                    break;
	                //case "text":
	                    //$$(this).attr("name").match("name") && (ab = /^[a-zA-Z\s]*$/)
	            }
	            ab.test($$(this).val()) ? $$(this).parent().hasClass("smart-select") ? $$(this).parent().parent().css("border", "none") : $$(this).css("border", "none") : (ef = !1, $$(this).css("border-bottom", "1px solid #ff3b30"))
	        }
	    }), ef
		         },*/
		        error: function(a){
		        	myApp.alert('kesalahan jaringan');
		        },
		        success: function(a){
		        	if (a == 'success') {
		        		var t = {
							tipe: 'register',
				            nama_lengkap:nama_lengkap,
				            email:email,
				            name:name,
				            department:department,
				            password:password,
				            avatar: avatar,
				            login: login,
				            status: status
						};
						userRef.push(t);
						mainView.router.loadPage('index.html');
					myApp.alert('data telah tersimpan!');
					} 
		        }
		    });
		
		} else {
			myApp.alert('Data salah');
		}
	});

	

	/*var validateEmail = function(elementValue) {
	    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	    return emailPattern.test(elementValue);
	}
	var validatePass = function(elementValue){
		var passPattern = /^[a-z0-9_-]{6,18}$/;
		return passPattern.test(elementValue);
	}
	function em(){
	$$('#email').keyup(function() {
	    var value = $$(this).val();
	    var valid = validateEmail(value);
	    if (!valid) {
	        $$(this).css('border', '1px solid red');
	    } else {
	        $$(this).css('border', '1px solid green');
	    }
	});
	}
	$$('#nama_lengkap').keypress(function (e) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        } else {
	        e.preventDefault();
	        myApp.alert('Please enter alphabet');
	        return false;
        }
    });
	$$('#name').keypress(function (e) {
        var regex = new RegExp("^[a-zA-Z0-9]*$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        } else {
	        e.preventDefault();
	        myApp.alert('Please enter alphanumeric');
	        return false;
        }
    });

    $$('#password1').keyup(function() {
	  var re = new RegExp(/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/);
	  $$(this).css('border', re.test(this.value) ? '1px solid green' : '1px solid red');
	});
	/*if($$('#department').val() == ''){
		myApp.alert('Please select department option');
	}*/
	/*$$('select').val()==''(function(){
	    myApp.alert('Please, choose an option');
	    return false;
	});*/
}); 
function validasi(ab) {
	    var ef = true;
	    //alert('k');
	    $$(ab).find("input:required, select:required").each(function() {
	    	//myApp.alert($$(this).attr('name') + ':' + $$(this).val());
	        if ($$(this).val() == "") {
	        	ef = false;
	        	if($$(this).parent().hasClass("smart-select")){
	        		$$(this).parent().parent().css("border", "1px solid #ff3b30");
        		} else {
        			$$(this).css("border", "1px solid #ff3b30");
        		}       
	   		} else {
	            var ac = /\.*/;
	            switch ($$(this).attr("name")) {
	                case "email":
	                    ac = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	                    break;
	                case "nama_lengkap":
	                    ac = /^[a-zA-Z ]+$/;
	                    break;
	                case "name":
	                    ac = /^[a-zA-Z0-9]*$/;
	                    break;
	                case "password":
	                    ac = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
	                    break;
	                //case "text":
	                    //$$(this).attr("name").match("name") && (ab = /^[a-zA-Z\s]*$/)
	            }
	            if(ac.test($$(this).val())) {
	            	if($$(this).parent().hasClass("smart-select")){
	            		$$(this).parent().parent().css("border", "none");
	            	} else {
	            		$$(this).css("border", "none");
	            	}
	           	}else{
	           		ef = false;
            		$$(this).css("border", "1px solid #ff3b30");
            	}
	            
	        }
	    }); 
	    return ef;
	}