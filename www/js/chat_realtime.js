function chat_realtime(j, k, l, m, n) {
    userMysql();

    j.on('child_added', function(a) {
        console.log("added", a.key(), a.val());
        if (a.val().tipe == 'login') {
            $$('#' + a.val().name).find('.badge').removeClass('bg-red');
            $$('#' + a.val().name).find('.badge').addClass('bg-green');
            if (a.val().name != m) {
                if ($$('#' + a.val().name).length < 1){
                    $$('#' + a.val().name + ' .badge').addClass('online');
                    $$('#' + a.val().name + ' .time').html(timing(new Date(a.val().login)))
                    $$('.users-list').append(
                        '<li id="' + a.val().name + '" data-tipe="users" class="user item-content">' +
                        '   <div class="item-media"><img src="' + a.val().avatar + '" width="50" class="lingkar"></div>' +
                        '   <div class="item-inner">' +
                        '       <div class="item-title-row">' +
                        '           <div class="item-title">'+ a.val().name +'</div>' +
                        '           <div class="item-after"><span class="badge bg-green"> </span></div>' +
                        '       </div>' +
                        '       <div class="item-subtitle"><small>' + timing(new Date(a.val().login)) + '</small></div>' +
                        '       <div class="item-text"></div>' +
                        '   </div>' +
                        '</li>'
                    );
                }
            }
        } else {
            $$('#' + a.val().name).find('.badge').removeClass('bg-green');
            $$('#' + a.val().name).find('.badge').addClass('bg-red');
        }
        //alert(a.key);
        j.remove();
    });

    k.on('child_added', function(a) {
        var b = a.val().name,
            ke = a.val().ke,
            tipe = localStorage.getItem('tipe'),
            box = myApp.messages('#' + tipe + ' .messages'),
            inbox = parseInt($$('#indikator-'+ a.val().tipe).html());
        if (ke == m) {
            var sender = $$('#'+ b).find('.item-text');
            if (sender.html() == ''){
                sender.html('1 pesan');
            } else {
                var pesan = sender.html().split(' ');
                sender.html(parseInt(pesan[0]) + 1 + ' pesan');
            }
            if (a.val().tipe == tipe) {
                if (tipe != 'rooms'){
                    if ($$('#'+ b).hasClass('bg-gray')){
                        box.addMessage({
                            text: a.val().message,
                            type: 'received',
                            day: timing(new Date(a.val().date)),
                            name: a.val().name,
                            avatar: a.val().avatar
                        });
                    } else {
                        $$('#indikator-' + a.val().tipe).html((inbox + 1));
                        $$('#indikator-' + a.val().tipe).removeClass('notif');
                    }
                }
            } else {
                $$('#indikator-' + a.val().tipe).html((inbox + 1));
                $$('#indikator-' + a.val().tipe).removeClass('notif');
            }
        } else if (a.val().tipe == 'rooms'){
            if (tipe != 'rooms'){
                $$('#indikator-' + a.val().tipe).html((inbox + 1));
                $$('#indikator-' + a.val().tipe).removeClass('notif'); 
            } else {
                if (b == m) {
                    box.addMessage({
                        text: a.val().message,
                        type: 'sent',
                        day: timing(new Date(a.val().date))
                    });
                } else {
                    box.addMessage({
                        text: a.val().message,
                        type: 'received',
                        day: timing(new Date(a.val().date)),
                        name: a.val().name,
                        avatar: a.val().avatar
                    });
                }
            }
        } else if (b == m) {
            box.addMessage({
                text: a.val().message,
                type: 'sent',
                day: timing(new Date(a.val().date))
            });
        }
        k.remove();
    });

    function userMysql() {
        $$.ajax({
            url: l,
            type: 'post',
            data: 'data=user',
            crossDomain: true,
            dataType: 'json',
            success: function(a) {
                $$('.users-list').html('');
                $$.each(a, function(i, a) {
                    if (a.name != m) {
                        $$('.users-list').append(
                            '<li id="' + a.name + '" data-tipe="users" class="user item-content">' +
                            '   <div class="item-media"><img src="' + a.avatar + '" width="50" class="lingkar"></div>' +
                            '   <div class="item-inner">' +
                            '       <div class="item-title-row">' +
                            '           <div class="item-title">'+ a.name +'</div>' +
                            '           <div class="item-after"><span class="badge ' + (a.status == 'online' ? 'bg-green' : 'bg-red') + '"> </span></div>' +
                            '       </div>' +
                            '       <div class="item-subtitle"><small>' + timing(new Date(a.login)) + '</small></div>' +
                            '       <div class="item-text"></div>' +
                            '   </div>' +
                            '</li>'
                        );
                    }
                });
                chatMysql('rooms', 'public');
            }
        })
    }

    $$('.messagebar a.send-message').on('click', function () {
        var tujuan = localStorage.getItem('tujuan');
        var tipe = localStorage.getItem('tipe');
        var textarea = $$('.messagebar textarea');
        var messageText = textarea.val();
        var a = new Date(),
            b = a.getDate(),
            c = (a.getMonth() + 1),
            d = a.getFullYear(),
            e = a.getHours(),
            f = a.getMinutes(),
            g = a.getSeconds(),
            date = d + '-' + (c < 10 ? '0' + c : c) + '-' + (b < 10 ? '0' + b : b) + ' ' + (e < 10 ? '0' + e : e) + ':' + (f < 10 ? '0' + f : f) + ':' + (g < 10 ? '0' + g : g);
        if (textarea.val() != '') {
            if ((tujuan == 'public' && tipe == 'rooms') || (tujuan != 'public' && tipe == 'users')) {           
                var i = {
                    data: 'send',
                    name: m,
                    ke: localStorage.getItem('tujuan'),
                    avatar: n,
                    message: messageText,
                    tipe: localStorage.getItem('tipe'),
                    date: date
                };
                k.push(i);
                $$.ajax({
                    url: l,
                    type: 'post',
                    data: i,
                    crossDomain: true
                });
                textarea.val('');
            } else {
                myApp.alert('Silahkan pilih user.');
            }
        } else {
            myApp.alert('Please fill atlease message!');
        }
    });

    $$('body').on('click', '.user', function() {
        localStorage.setItem('tujuan', $$(this).attr('id'));
        localStorage.setItem('tipe', $$(this).data('tipe'));
        $$('.user').removeClass('bg-gray');
        $$(this).find('.item-text').html('');
        $$(this).addClass('bg-gray');
        myApp.showTab('#users');
        chatMysql(localStorage.getItem('tipe'), localStorage.getItem('tujuan'));
        return false;
    });

    var tabs = $$('.tabs');
    tabs.on('show', function(){
        var active = tabs.find('.active').attr('id');
        $$('#indikator-'+ active).html('0');
        $$('#indikator-'+ active).addClass('notif');
        localStorage.setItem('tipe', active);
        if(active == 'rooms'){
            localStorage.setItem('tujuan', 'public');
            //chat_realtime(userRef, messageRef, apis, data.name, data.avatar);
            chatMysql(localStorage.getItem('tipe'), localStorage.getItem('tujuan'));
        } 
    });

    function chatMysql(e, f) {
       
        $$.ajax({
            url: l,
            type: 'post',
            data: {
                data: 'message',
                ke: f,
                tipe: e
            },
            crossDomain: true,
            dataType: 'json',
            success: function(a) {
                $$('.messages').html('');
                if (f == 'all') {
                    $$.each(a, function(i, a) {
                        var chatarea = myApp.messages('#' + a.tipe + ' .messages');
                        if (a.name == m) {
                            chatarea.addMessage({
                                text: a.message,
                                type: 'sent',
                                day: timing(new Date(a.date))
                            });
                        } else {
                            chatarea.addMessage({
                                text: a.message,
                                type: 'received',
                                day: timing(new Date(a.date)),
                                name: a.name,
                                avatar: a.avatar
                            });
                        }
                    });
                } else {
                    $$.each(a, function(i, a) {
                        var chatarea = myApp.messages('#' + a.tipe + ' .messages');
                        if (a.name == m) {
                            chatarea.addMessage({
                                text: a.message,
                                type: 'sent',
                                day: timing(new Date(a.date))
                            });
                        } else {
                            chatarea.addMessage({
                                text: a.message,
                                type: 'received',
                                day: timing(new Date(a.date)),
                                name: a.name,
                                avatar: a.avatar
                            });
                        }
                    });
                }
               
            }
        });
    }

    function takePict(a) {
        myApp.modal({
            title: "Take a picture",
            verticalButtons: !0,
            buttons: [{
                text: "Camera",
                onClick: function() {
                    navigator.camera.getPicture(function(e) {
                        a("data:image/jpeg;base64," + e)
                    }, function(a) {
                        myApp.alert(a)
                    }, {
                        quality: 50,
                        destinationType: navigator.camera.DestinationType.DATA_URL
                    })
                }
            }, {
                text: "Album",
                onClick: function() {
                    navigator.camera.getPicture(function(e) {
                        a("data:image/jpeg;base64," + e)
                    }, function(a) {
                        myApp.alert(a)
                    }, {
                        quality: 50,
                        destinationType: navigator.camera.DestinationType.DATA_URL,
                        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
                    })
                }
            }]
        })
    }

    function dataURItoBlob(a) {
        var e;
        e = a.split(",")[0].indexOf("base64") >= 0 ? atob(a.split(",")[1]) : unescape(a.split(",")[1]);
        for (var t = a.split(",")[0].split(":")[1].split(";")[0], i = new Uint8Array(e.length), n = 0; n < e.length; n++) i[n] = e.charCodeAt(n);
        return new Blob([i], {
            type: t
        })
    }

    $$('#gambar').on('click', function(){

    takePict(function(data) {

        var e = new FormData;
        //var tipe = localStorage.getItem('tipe');
        e.append('name', m);
        e.append('file', dataURItoBlob(data));
        e.append('tipe', localStorage.getItem('tipe'));
        e.append('ke', localStorage.getItem('tujuan'));
        e.append('avatar', n);

        $$.ajax({
            url: 'https://test.mountoya.id/upload.php',
            type: 'POST',
            data: e,
            cache: false,
            processData: false,
            contentType: false,
            beforeSend: function(a) {
                myApp.showIndicator();
            },
            error: function(a, e) {
                myApp.hideIndicator();
                myApp.alert('Terjadi kesalahan jaringan..');
            },
            success: function(a, e ) {
                myApp.hideIndicator();
                //myApp.alert(a.message);
                var y = new Date(),
                b = y.getDate(),
                c = (y.getMonth() + 1),
                d = y.getFullYear(),
                e = y.getHours(),
                f = y.getMinutes(),
                g = y.getSeconds(),
                date = d + '-' + (c < 10 ? '0' + c : c) + '-' + (b < 10 ? '0' + b : b) + ' ' + (e < 10 ? '0' + e : e) + ':' + (f < 10 ? '0' + f : f) + ':' + (g < 10 ? '0' + g : g);
                var z = {
                    data: 'send',
                    name: m,
                    ke: localStorage.getItem('tujuan'),
                    avatar: n,
                    message: a,
                    tipe: localStorage.getItem('tipe'),
                    date: date
                };
                k.push(z);

                //myApp.hideIndicator(), myApp.alert(a.message), mainView.router.loadPage("main.html#"+ tipe)
            }
        });
    });
 });

    function htmlEntities(a) {
        return String(a).replace(/</g, '&lt;').replace(/>/g, '&gt;')
    }
/*function GetSelectValue() { 
        var valSelect = $('#department').val(); 
        if (valSelect == -1) { 
          return true; 
        } 
        else { 
            return false; 
        } 
}*/ 

    function timing(a) {
        var s = Math.floor((new Date() - a) / 1000),
            i = Math.floor(s / 31536000);
        if (i > 1) {
            return i + " yrs ago"
        }
        i = Math.floor(s / 2592000);
        if (i > 1) {
            return i + " mon ago"
        }
        i = Math.floor(s / 86400);
        if (i > 1) {
            return i + " dys ago"
        }
        i = Math.floor(s / 3600);
        if (i > 1) {
            return i + " hrs ago"
        }
        i = Math.floor(s / 60);
        if (i > 1) {
            return i + " min ago"
        }
        return (Math.floor(s) > 0 ? Math.floor(s) + " sec ago" : "just now")
    }
}
