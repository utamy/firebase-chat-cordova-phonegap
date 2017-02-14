var config = {
    apiKey: "AIzaSyBXC7x244dlzHY-Wvq_ouJAp_HateRIB9g",
    authDomain: "chatapp-aec07.firebaseapp.com",
    databaseURL: "https://chatapp-aec07.firebaseio.com",
    storageBucket: "chatapp-aec07.appspot.com",
    messagingSenderId: "230824866390"
 };
 firebase.initializeApp(config);
// Replace with: your_firebase_name.firebaseio.com
var dbRef = firebase.database().ref(),
	signupurl = 'http://test.mountoya.id/signup.php',
	apis = 'http://test.mountoya.id/api.php';
	//signupurl ='https://test.mountoya.id/signup.php'	
// create firebase child
var messageRef = dbRef.child('message'),
	userRef = dbRef.child('user');
//messageRef.remove();
//userRef.remove();
//apis.remove();
dbRef.remove();