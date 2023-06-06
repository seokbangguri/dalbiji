let gWS  = {
    base_server: "https://planstudy1.wizice.com",
    static_url: "static/plan",
    re_gdUrlId : new RegExp("(https:\/\/drive.google.com\/file\/d\/)(.*)(\/view)","g"),
    version:function(){
        return "1.0"
    },
    kakao_key: "",
    sel_mb_id: "",
    data_table: "",
    data_table_subject: null,
    data_table_subject2: null,
    dataTable: "",
    study_plans:  [],           //  서버에서 받은 회원의 모든 학습일정
    subject_list:  [],          // 교재명만
    subject_code_json:  {},     // 교재의 code 목록
    subject_plan_json:  {},     // 교재별 학습일정
    SQ:  {},           //  서버에서 받은 회원의 학습진도에 대한 quiz ( 다른 진도의 틀린문제도 포함 ) 
    study_id: 0,
    getParameterByName:function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    isEmpty: function(str){
        if(typeof str == "undefined" || str == null || str == "" || str == "undefined" )
            return true;
        else
            return false ;
    },
    alert_msg:function(msg, title, theme ){
        title   = title || "";
        theme   = theme || "Material"; //Light theme Dark theme Modern Supervan Material Bootstrap
        $.alert( {
            theme: theme,
            boxWidth: '600px',
            content: msg,
            title: title
        });
    },
    dialog_msg:function(msg, title, theme ){
        title   = title || "";
        theme   = theme || "Material"; //Light theme Dark theme Modern Supervan Material Bootstrap
        $.confirm( {
            theme: theme,
            boxWidth: '600px',
            content: msg,
            //autoClose: '닫기|5000',
            title: title,
            buttons: { 
                "닫기": function() {
                }
            }
        });
    },
    showProgressBar: function(flag) {
        const imgSrc = "/static/html/assets/img/progressBar2.gif";
        let id = 'progressBar';
        let bgId = 'progressBarBg';
        
        if(flag == null) {
            if($('#'+id).length > 0) {
                flag = false;
            } else {
                flag = true;
            }
        }   
                
        if(flag) { 
            let elem = $('<div/>',{
                "id":id,
                "style":"width:220px;height:19px;"
            }).appendTo('body');
            let bgElem = $('<div/>',{"id":bgId}).appendTo('body');
            let top = (($(window).height()-elem.outerHeight())/2+$(window).scrollTop())+"px";
            let left = (($(window).width()-elem.outerWidth())/2+$(window).scrollLeft())+"px";
            
            elem.css({'z-index':1000,'position':'absolute','top':top, 'left':left, "background":"url("+imgSrc+") no-repeat 0 0"});
            bgElem.css({'width':'100%','height':'100%','position':'fixed','top':0,'left':0,'background':'#333','opacity':0.5,'z-index':999});
            
        } else {
            $('#'+id).remove();
            $('#'+bgId).remove();
        }   
    },   
    logout:function( ){
        location.href="/ls/logout";
    },
    app_logout:function( ){
        location.href="/ls/logout";
    },
    send_ajax: function( url, json_data ) {
            gWS.showProgressBar(true);
            $.ajax({
                url: url,
                async: true,
                type: 'POST',
                data: { data:JSON.stringify( json_data )},
                dataType: 'json',
                beforeSend:function(jqXHR) {},// 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
                success:function(jqXHR) {
                    var msg = "프로필 페이지로 이동하시겠습니까?";
                    if ( url.indexOf( "saveextraimg" ) > 0 ) {
                        msg = "저장되었습니다. 화면을 불러옵니다.";
                    }
                    $.confirm( {
                        theme: "Material",
                        boxWidth: '600px',
                        content: msg,
                        title: "저장완료.",
                        buttons: {
                            formSubmit: {
                                text: '확인',
                                btnClass: 'btn-blue',
                                action: function () {
                                    var s_url = "/app/ps-client-profile?clinum=" + json_data.clients_no + "&ts=" + new Date().getTime();
                                    location.href = s_url;
                                }
                            }
                        }
                    });
                },// 요청 완료 시
                error:function(jqXHR, textStatus, error ) {
                    var err = textStatus + ", " + error;     // error, Not Found
                    alert(" err=" + err );
                    console.log( "Request Failed: " + err );
                    return [];  // 데이터 없음
                },// 요청 실패.
                complete:function(jqXHR) {
                    console.log( "complete" );
                    gWS.showProgressBar(false);
                }// 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
            });
    },   
    ajaxPost:function( json_data, callback){    // json_data.url 로 post 데이터 전송
            var url         = json_data.url;
            var url4json    =  gWS.base_server + url + "?ts=" + Date.now();
            gWS.showProgressBar(true);
            $.ajax({
                url: url4json,
                async: true,
                type: 'POST',
                data: { data: JSON.stringify( json_data ) },
                dataType: 'json',
                beforeSend:function(jqXHR) {},// 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
                success:function(jqXHR) {
                    if ( callback) {    // 콜백 함수가 있으면 실행
                        callback(jqXHR);
                    } else {
                        gWS.dialog_msg( msg || '처리완료', url, 'Material' );
                    }
                },// 요청 완료 시
                error:function(jqXHR, textStatus, error ) {
                    var err = textStatus + ", " + error;     // error, Not Found
                    alert("오류 err=" + err );
                    console.log( "Request Failed: " + err );
                    return [];  // 데이터 없음
                },// 요청 실패.
                complete:function(jqXHR) {
                    console.log( "complete" );
                    gWS.showProgressBar(false);
                }// 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
            });
    },
    ajaxPost_sel:function( json_data, callback){    // json_data.url 로 post 데이터 전송
            var url         = json_data.url;
            var url4json    =  gWS.base_server + url + "?ts=" + Date.now();
            if ( gWS.sel_mb_id > "") {
                url4json    =  gWS.base_server + url + "?sel_mb_id=" + gWS.sel_mb_id + "&ts=" + Date.now();
            }
            gWS.showProgressBar(true);
            $.ajax({
                url: url4json,
                async: true,
                type: 'POST',
                data: { data: JSON.stringify( json_data ) },
                dataType: 'json',
                beforeSend:function(jqXHR) {},// 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
                success:function(jqXHR) {
                    if ( callback) {    // 콜백 함수가 있으면 실행
                        callback(jqXHR);
                    } else {
                        gWS.dialog_msg( msg || '처리완료', url, 'Material' );
                    }
                },// 요청 완료 시
                error:function(jqXHR, textStatus, error ) {
                    var err = textStatus + ", " + error;     // error, Not Found
                    alert("오류 err=" + err );
                    console.log( "Request Failed: " + err );
                    return [];  // 데이터 없음
                },// 요청 실패.
                complete:function(jqXHR) {
                    console.log( "complete" );
                    gWS.showProgressBar(false);
                }// 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
            });
    },
    ajaxPostApi:function( json_data, callback){    // json_data.url 로 post 데이터 전송
            var url         = json_data.url;
            var url4json    =  gWS.base_server + url + "?ts=" + Date.now();
            gWS.showProgressBar(true);
            $.ajax({
                url: url4json,
                async: true,
                type: 'POST',
                data: json_data,
                dataType: 'json',
                beforeSend:function(jqXHR) {},// 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
                success:function(jqXHR) {
                    if ( callback) {    // 콜백 함수가 있으면 실행
                        callback(jqXHR);
                    } else {
                        gWS.dialog_msg( msg || '처리완료', url, 'Material' );
                    }
                },// 요청 완료 시
                error:function(jqXHR, textStatus, error ) {
                    var err = textStatus + ", " + error;     // error, Not Found
                    alert("오류 err=" + err );
                    console.log( "Request Failed: " + err );
                    return [];  // 데이터 없음
                },// 요청 실패.
                complete:function(jqXHR) {
                    console.log( "complete" );
                    gWS.showProgressBar(false);
                }// 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
            });
    },
    ajaxFilePost:function( json_data, file_id, callback){    // json_data.url 로 post 데이터 전송
        var fd = new FormData();
        var files = $('#' + file_id )[0].files;
        
        // Check file selected or not
        if(files.length > 0 ){
            gWS.showProgressBar(true);
            fd.append('file',files[0]);
            fd.append('data', JSON.stringify( json_data ) );
            var url         = json_data.url;
            var url4json    =  gWS.base_server + url + "?ts=" + Date.now();
            $.ajax({
                url: url,
                type: 'post',
                data: fd,
                contentType: false,
                processData: false,
                success: function(response){
                    if ( callback) {    // 콜백 함수가 있으면 실행
                        callback(response);
                    }
                },
                error:function(jqXHR, textStatus, error ) {
                    var err = textStatus + ", " + error;     // error, Not Found
                    alert("오류 err=" + err );
                    console.log( "Request Failed: " + err );
                    return [];  // 데이터 없음
                },// 요청 실패.
                complete:function(jqXHR) {
                    console.log( "complete" );
                    gWS.showProgressBar(false);
                }// 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
           });
        }else{
            //gWS.dialog_msg( msg || '이미지를 선택해주세요.', url, 'Material' );
        }
    },

    getSubject:function( study_plans) {
        var subject_json    = {};
        study_plans.forEach( function( row, index ) {
            subject_json[ row.subject ] = 1;
        })
        let subject_list =  Object.keys( subject_json );
        subject_list.splice(0, 0, '일자별');
        return subject_list;
    },
    get_YyMmDd_add_day:function(date, days ) {
        let result      = new Date(date);
        result.setDate( result.getDate() + days );
        return gWS.get_YyMmDd_String( result );
    },
    get_YyMmDd_String: function(date) {
            var dd = date.getDate();
            var mm = date.getMonth()+1; //January is 0!
            var yyyy = date.getFullYear();
            if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
            yyyy = yyyy.toString();
            mm = mm.toString();
            dd = dd.toString();
            var s1 = yyyy+ "-" + mm + "-" + dd;
            return s1;
    },
    get_YyMmDd_HhMmSs_String: function(date) {
            var dd = date.getDate();
            var mm = date.getMonth()+1; //January is 0!
            var yyyy = date.getFullYear();
            if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm}
            yyyy = yyyy.toString();
            mm = mm.toString();
            dd = dd.toString();
            var m = date.getHours();
            var s = date.getMinutes();
            if(m<10){m='0'+m} if(s<10){s='0'+s}
            m = m.toString();
            s = s.toString();
            var s1 = yyyy+ "-" + mm + "-" + dd+ " " + m + ":" +s;
            return s1;
    },
    get_date_from_string:function( s_date ) {
        const strArr    = s_date.split("-");
        const date_val  = new Date(strArr[0], strArr[1]-1, strArr[2]);
        return date_val;
    },
    get_datetime_from_string:function( s_date ) {
        //var dateString = "2010-08-09 01:02:03";
        var reggie = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
        var dateArray = reggie.exec( s_date ); 
        if ( !gWS.isEmpty( dateArray) ) {
            var dateObject = new Date(
                (+dateArray[1]),
                (+dateArray[2])-1, // Careful, month starts at 0!
                (+dateArray[3]),
                (+dateArray[4]),
                (+dateArray[5]),
                (+dateArray[6])
            );
            return dateObject;
        }else {
            var reggie = /(\d{4})-(\d{2})-(\d{2})/;
            var dateArray = reggie.exec( s_date ); 
            var dateObject = new Date(
                (+dateArray[1]),
                (+dateArray[2])-1, // Careful, month starts at 0!
                (+dateArray[3])
            );
            return dateObject;
    
        }
    },
    get_day_from_string:function( s_date ) {
        var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');
        const date_val  = gWS.get_date_from_string( s_date );
        var today       = date_val.getDay();
        var todayLabel  = week[today];
        return todayLabel;
    },
    GetSortOrder:function(prop) {    
        return function(a, b) {    
            if (a[prop] > b[prop]) {    
                return 1;    
            } else if (a[prop] < b[prop]) {    
                return -1;    
            }    
            return 0;    
        }    
    }, 
    hide_logo: function( ){
        if ( $("title").length > 1 ) {
            setTimeout( function() {
                const i_len = $("title").length;
                for ( var i=1; i < i_len; i++) {
                    if ( ($("title")[i].id).indexOf("-title") > 0) {
                        $("#" + $("title")[i].id).closest("g").css("display", "none");
                    }
                }
            }, 100);
        }
    },
    hide_logo2: function( ){
        if ( $("title").length > 1 ) {
            setTimeout( function() {
                const i_len = $("title").length;
                for ( var i=1; i < i_len; i++) {
                    if ( ($("title")[i].id).indexOf("-title") > 0) {
                        if ( $("#" + $("title")[i].id).html().indexOf("amCharts library") >= 0 ) {
                            $("#" + $("title")[i].id).closest("g").css("display", "none");
                        }
                    }
                }
            }, 100);
        }
    },
    resize_study_logs_chart: function(){
        $("#chartdiv1").height( screen.height - 350 );
    },
}

