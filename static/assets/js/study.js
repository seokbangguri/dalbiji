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
    showQuizProgressBar: function( pw) {
        if ( $("#progressbar").length > 0 ) {
            pw      = pw || parseInt( (gWS.SQ.cur_pos+1) / gWS.SQ.data.length * 100 );
            $("#progressbar").css( "width", pw + "%"  );
            $("#progressbar").html( pw + "%" );
        }
    },
    logout:function( ){
        gWS.g5_logout(gWS.app_logout );
    },
    app_logout:function( ){
        location.href="/app/logout";
    },
    g5_logout:function(callback ){ 
            var url4json    =  gWS.base_server + "/g5/bbs/logout.php" + "?ts=" + Date.now();
            gWS.showProgressBar(true);
            $.ajax({
                url: url4json,
                async: true,
                type: 'POST',
                data: [],
                dataType: 'text',
                beforeSend:function(jqXHR) {},// 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
                success:function(jqXHR) {
                    if ( callback) {    // 콜백 함수가 있으면 실행
                        callback(jqXHR);
                    } else {
                        console.log('logout');
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
    move_quiz_pos:function( pos){
        var quiz    = gWS.SQ.data[ pos ];
        var quiz_id = "#quiz_" + quiz.plan + "_" + quiz.qno;
        $( quiz_id ).focus();
    },
    getQuizData:function( param){
        var kakao_key   =  param.kakao ;
        var study_id   =  param.study_id ;
        if (!kakao_key ) {
            return [];  // 데이터 없음
        }
        var url4json    =  gWS.base_server + "/kakao/quiz/" + kakao_key + "/" + study_id + "?ts=" + Date.now();
        gWS.SQ= {}
        gWS.showProgressBar(true);
        $.getJSON( url4json).done(function( res ) {
            gWS.SQ          = res;
            gWS.SQ.quiz_len = res.data.length;
            gWS.SQ.cur_pos  = 0;    // 문항위치
            var rtn         = gWS.showQuizData( gWS.SQ );
            gWS.showQuizProgressBar(0);

        }).fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;     // error, Not Found
            if ( error.indexOf("Not Found") >=0 ) {
                alert("테스트문항을 확인할 수 없습니다.");
                //window.close();
                return [];  // 데이터 없음
            }
            alert("err=" + err );
            console.log( "Request Failed: " + err );
            return [];  // 데이터 없음
        }).always(function() {
            console.log( "complete" );
            gWS.showProgressBar(false);
        });
    },
    showQuizData: function( study_quizs ){
        var s_quiz_html    = "";
        var i_no         = 0;
        if ( study_quizs.data.length <= 0 ){
            gWS.alert_msg("Quiz 정보가 없습니다.");
            $("#wait_msg").html( "quiz 정보가 없습니다." );
            return;
        }
        //--회원명 표시
        var mb_id       = study_quizs.mb_id;
        var subject     = study_quizs.data[0].subject;
        $("#span_mb_id").html( mb_id + " 님 " + subject );
        var plan        = study_quizs.plan;
        if (Object.keys(plan).length <= 0) {
            gWS.alert_msg("잘못된 요청입니다. Quiz 정보가 없습니다.");
            $("#wait_msg").html( "quiz 정보가 없습니다." );
            return;
        }
        var s_plan      = plan.plan;
        var s_code      = plan.code;
        var s_date_from = plan.date_from;
        $("#span_plan").html( " " + s_date_from + "일 "+ s_code + " " + s_plan  );
        // 순서를 섞기
        gWS.SQ.data = gWS.shuffle( study_quizs.data );

        if ("debug" == "no"){
            for(var i=0; i<=8; i++) gWS.SQ.data.pop();
        }

        gWS.SQ.data.forEach( function( quiz, index ) {
            i_no += 1;
            
            var s_row_html = gWS.get_quiz_row_html( i_no, quiz );
            s_quiz_html     += s_row_html;
        });
        $("#tab_quiz").html( s_quiz_html );
        $("#div_next").removeClass("hide");
        gWS.check_next();   // next 버튼을 표시할지 결정
        // td click event
        $("#tab_quiz td").click(function(e) {
            var radios  = $(this).closest("tr").find("input[type='radio']");
            var chk     = radios.get(0);
            if(e.target != chk)
            {
                var choice_val  = $("input[name='" + chk.name + "']:checked").val() || '';
                if ( choice_val > '' ) {
                    $( "#" + chk.name + "_" + choice_val ).prop( 'checked', false );
                }
                $( "#" + chk.name + "_" + chk.value ).prop( 'checked', true );
            }
        });
    }, 
    shuffle: function(a) { 
        var j, x, i; 
        for (i = a.length; i; i -= 1) { 
            j = Math.floor(Math.random() * i); 
            x = a[i - 1]; 
            a[i - 1] = a[j]; 
            a[j] = x; 
        } 
        return a;
    },
    get_quiz_row_html: function( i_no, quiz) {
        var quiz_id     = quiz.quiz_id;
        var plan        = quiz.plan;
        var qno         = quiz.qno;
        var qatype      = quiz.qatype;
        var qatext      = quiz.qatext;
        var wrong_ct    = quiz.wrong_ct;
        var multi_choice= quiz.multi_choice;
        var plan_qno    = plan  + "_" + qno ;

        var s_html      = "";
        var s_hide      = (i_no == 1 ) ? " " : " hide ";
        s_qatext        = "Q" + i_no + ". " + qatext;

        s_html +="            <div id='quiz_" + plan_qno + "' class='row " + s_hide + "' data-quiz_id='" + quiz_id +"'>";
        s_html +="                <div class='col-md-12 col-xs-12'>";
        s_html +="                    <div class='panel panel-default'>";
        s_html +="                        <div class='quiz-heading'><i class='answer hide fa '></i><h4 style='line-height:150%;'>" + s_qatext + " </h4></div> ";
        s_html +="                        <div class='panel-body'>";
        s_html +="                                <table id='" + plan_qno + "_table' class='table tablebordered table-hover' cellpadding='5' cellspacing='0'>";
        s_html +="                                    <colgroup>";
        s_html +="                                        <col width='100.00%'/>";
        s_html +="                                    </colgroup>";

        multi_choice.forEach( function(choice, index) {
            var ano             = choice.ano;
            var atext           = choice.qatext;
            var ahint           = choice.hint;
            var plan_qno_ano    = plan_qno + "_" + ano;
            s_html +="                                    <tr>";
            s_html +="                                        <td class='mb-0 pb-0' id='td_" + plan_qno_ano + "' ><div class='radio'><label style='cursor:pointer;' id='MC" + plan_qno_ano + "'>\n";
            s_html +="                                              <input type='radio' name='QA_" + plan_qno + "' id='QA_" + plan_qno_ano + "' value='" + ano + "'/> " + atext + "</label>\n";
            s_html +="                                              <div class='col-12 choice_hint hide'  id='QA_HINT_" + plan_qno_ano + "' > ";
            s_html +="                                              " + ahint + "    ";
            s_html +="                                              </div>";
            s_html +="                                            </div></td>\n";
            s_html +="                                    </tr>\n";
        });
        s_html +="                                </table>";
        s_html +="                        </div>      ";
        s_html +="                        <div class='panle-footer text-info bg-light hide answer_inset' id='div_hint_" + plan_qno + "' > ";
        s_html +="                                <div class='col-12 answer_hint'  id='HINT_" + plan_qno + "' > ";
        s_html +="                                    ";
        s_html +="                                </div>";
        s_html +="                        </div>";
        s_html +="                    </div>              ";
        s_html +="                </div>              ";
        s_html +="            </div>";
        return s_html;
    },
    show_quiz_answer_list:function( answer_list ){
        answer_list.forEach( function( answer, index ) {
            gWS.show_quiz_answer( answer );
        });
    },
    show_quiz_answer:function( json_data){
        let plan        = json_data.plan;
        let qno         = json_data.qno;
        let mgr_a       = json_data.mgr_a;
        let OX          = json_data.OX;
        let quiz_id     = json_data.quiz_id;
        let s_hint      = json_data.hint || '';
        let quiz_plan_q_id   = "#quiz_" + plan + "_" + qno;
        let paln_qno_ano= "#quiz_" + plan + "_" + qno;
        let i_id        = quiz_plan_q_id + " i.answer ";
        let td_id       = "#td_" + plan + "_" + qno + "_" + mgr_a;
        let div_hint_id = "#div_hint_" + plan + "_" + qno ;
        let hint_id     = "#HINT_" + plan + "_" + qno ;
        if ( OX == "O") { // 정답
            $( i_id ).removeClass("hide").removeClass("fa-close").removeClass("text-danger").addClass("fa-circle-o").addClass("text-success")
        }else if ( OX == "X") { // 오답표시
            $( i_id ).removeClass("hide").removeClass("fa-circle-o").removeClass("text-success").addClass("fa-close").addClass("text-danger")
            $( td_id ).addClass("bg-success")
        }

        // hint 정보가 있으면 힌트 표시
        if ( s_hint ) {
            $( hint_id ).html( s_hint.replace("\n", "<br>") );
            $( div_hint_id ).removeClass("hide");
        }
        if ( json_data.multi_choice ) {
            json_data.multi_choice.forEach( function(choice, index) {
                // 보기에 대한 힌트가 있다면
                if ( choice.hint ) {
                    const   choice_hint_id  = "#QA_HINT_" + plan + "_" + qno + "_" + choice.ano;
                    $( choice_hint_id ).removeClass("hide");
                }
            });
        }
    },
    quiz_answer_selected:function(){
        gWS.SQ.quiz.user_answer = '';
        var radio_name  = "QA_" + gWS.SQ.quiz.plan  + "_" + gWS.SQ.quiz.qno;
        var choice_val  = $("input[name='" + radio_name + "']:checked").val() || '';
        if (choice_val > '') {
            gWS.SQ.quiz.user_answer = choice_val;
        }
        //gWS.SQ.quiz.multi_choice.forEach( function(choice, index ) {
        //});
    },
    quiz_check_user_answer_show:function() {
        // 현재 문제에 대해 사용자가 선택한 답 확인
        let quiz    = gWS.SQ.data[ gWS.SQ.cur_pos ];
        let user_answer = gWS.quiz_get_user_answer( quiz ); 
        // 현재 문제에 대한 정답 확인
        quiz["mgr_a"]   = gWS.quiz_get_mgr_answer( quiz );
        // 정답확인후  체점결과 표시
        if ( user_answer != quiz.mgr_a ) { // 오답이면
            quiz["OX"]  = "X"
        } else { // 정답이면
            quiz["OX"]  = "O"
        }
        gWS.show_quiz_answer( quiz );
    },
    quiz_get_mgr_answer:function(quiz){
        // 입력받은 문제에 대한 정답확인
        let     mgr_answer          = "";
        quiz.multi_choice.forEach( function( choice, index ) {
            if  ( choice.answer == "O" ) { 
                mgr_answer      = choice.ano;
            } 
        } );
        return mgr_answer;
    },
    quiz_get_user_answer:function(quiz){
        // 입력받은 문제에 대한 회원이 입력한 답 확인
        var radio_plan_qno          = "QA_" + quiz.plan  + "_" + quiz.qno ;
        var plan_qno_answer         = $("input:radio[name=" + radio_plan_qno + "]:checked").val();
        return plan_qno_answer
    },
    quiz_submit_confirm:function(){
        // 답을 입력안한 것이 있는 지 확인
        if (!gWS.check_no_answer()) return false;
        // 문제의 답을 확인
        var answer  = {};
        gWS.SQ.data.forEach( function( quiz, index ) {
            var radio_plan_qno          = "QA_" + quiz.plan  + "_" + quiz.qno ;
            var plan_qno_answer         = $("input:radio[name=" + radio_plan_qno + "]:checked").val();
            answer[ radio_plan_qno ]    = plan_qno_answer;

        });
        gWS.kakao_key   = gWS.getParameterByName("kakao");
        gWS.study_id    = gWS.getParameterByName("study_id");
        json_data   = { "mb_id":gWS.SQ.mb_id, "answer": answer , "quiz": gWS.SQ.data,
                        'kakao': gWS.kakao_key, 'study_id': gWS.study_id }
        $.confirm( {
            theme: "Material",
            boxWidth: '600px',
            content: "정말로 제출하시겠습니까?",
            title: "테스트 답안 제출",
            buttons: {
                "제 출": function(){
                   gWS.quiz_submit( json_data );
                },
                "취 소": function(){
                }
            }
        });
    },
    quiz_submit:function( json_data){
            var url4json    =  gWS.base_server + "/kakao/quizanswer" + "?ts=" + Date.now();
            gWS.showProgressBar(true);
            $.ajax({
                url: url4json,
                async: true,
                type: 'POST',
                data: { data: JSON.stringify( json_data ) },
                dataType: 'json',
                beforeSend:function(jqXHR) {},// 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
                success:function(jqXHR) {
                    $("#div_quiz_submit").removeClass("hide").addClass("hide");
                    $("#div_quiz_submit").prop("onclick", null );   // 제거
                    
                    gWS.show_quiz_answer_list( jqXHR.data )
                    // 체점 결과 확인
                    if (1==2) {
                        $.confirm( {
                            theme: "Material",
                            boxWidth: '600px',
                            content: jqXHR.data,
                            title: "제출되었습니다."
                        });
                    }
                },// 요청 완료 시
                error:function(jqXHR, textStatus, error ) {
                    if( jqXHR.responseJSON ) {
                        $.confirm( {
                            theme: "Material",
                            boxWidth: '600px',
                            content: jqXHR.responseJSON,
                            title: "오류"
                        });
                    } else {
                        var err = textStatus + ", " + error;     // error, Not Found
                        alert("정답제출오류 err=" + err );
                    }
                    console.log( "Request Failed: " + err );
                    return [];  // 데이터 없음
                },// 요청 실패.
                complete:function(jqXHR) {
                    console.log( "complete" );
                    gWS.showProgressBar(false);
                }// 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
            });
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

    check_next:function(){
        // 마지막 위치인가?
        if ( gWS.SQ.cur_pos >= gWS.SQ.data.length-1 ){
            $("#div_next a").removeClass("hide").addClass( "hide" );
            $("#div_quiz_submit").removeClass("hide");
            return false;
        }
        return true;
    },
    check_no_answer:function(){
        if ( gWS.SQ.quiz.user_answer == "" ) {
            var title   = (gWS.SQ.cur_pos + 1)  + "번 문제";
            var msg     = "<p>" + gWS.SQ.quiz.qatext + "</p>의 답을 입력해주시기 바랍니다. ";
            gWS.dialog_msg( msg, title );
            gWS.move_quiz_pos( gWS.SQ.cur_pos );
            return false;
        } 
        return true;
    },
    quiz_next:function(){
        // 현재 문제를 풀었는가?
        gWS.SQ.quiz         = gWS.SQ.data[ gWS.SQ.cur_pos ];
        gWS.quiz_answer_selected(); // 답을 입력했는지 확인
        if ( ! gWS.check_no_answer() ) return false;
        //---- 사용자가 입력한 정답확인
        gWS.quiz_check_user_answer_show();
        //------
        if ( ! gWS.check_next() ) return false;
        // 다음 문제위치로 이동
        gWS.SQ.cur_pos         += 1;
        gWS.SQ.quiz         = gWS.SQ.data[ gWS.SQ.cur_pos ];
        gWS.SQ.quiz_id      = "#quiz_" + gWS.SQ.quiz.plan + "_" + gWS.SQ.quiz.qno;
        $( gWS.SQ.quiz_id ).removeClass( "hide") ;
        //$("html, body").animate({ scrollTop: $(document).height() }, 1000);
        //-- 진행바표시
        gWS.showQuizProgressBar();
    },
    getPlanData:function( param){
        var kakao_key   =  param.kakao ;
        if (!kakao_key ) {
            return [];  // 데이터 없음
        }
        var url4json    =  gWS.base_server + "/" + gWS.static_url + "/" + kakao_key + ".json?ts=" + Date.now();
        gWS.study_plans  = [];
        gWS.showProgressBar(true);
        $.getJSON( url4json).done(function( data ) {
            gWS.study_plans  = data;
            var rtn             = gWS.showPlanData( gWS.study_plans );
            return data;

        }).fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;     // error, Not Found
            if ( error.indexOf("Not Found") >=0 ) {
                //alert("학습일정을 확인할 수 없습니다.");
                $("#tab_subject1 .table-responsive").html("일정이 없습니다.");
                return [];  // 데이터 없음
            }
            alert("err=" + err );
            console.log( "Request Failed: " + err );
            return [];  // 데이터 없음
        }).always(function() {
            console.log( "complete" );
            gWS.showProgressBar(false);
        });
    },
    find_study_plan_by_id:function( find_json) {
        var find_plan    = {};
        let study_id    = find_json.study_id;
        if ( study_id ){
            gWS.study_plans.forEach( function( row, index ) {
                if ( row.study_id == study_id ) {
                    find_plan   = row;
                    return row;
                }
            })
        }
        return find_plan;
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
    get_study_state:function( row ) {
        
        var state    = "";
        var s_now                   = gWS.get_YyMmDd_String( new Date() ); // 날짜를 스트링
        if ( row.date_done != '0000-00-00 00:00:00'  ) {
            state = "done" ;
            if ( !gWS.isEmpty(row.study_flag) ) {
                if ( row.study_flag == 'nogood' ) { //  완료했지만, 미승인이면 
                        state = "nogood" 
                }
            }
             
        } else {
            if (row.date_from < s_now &&  row.date_done == '0000-00-00 00:00:00' ) { state = "overdue" } // 오늘 이전인데 미완료인것
            if (row.date_started > '0000-00-00 00:00:00' && row.date_done == '0000-00-00 00:00:00' ) { state = "studying" }; // 학습중
            if (row.date_started == '0000-00-00 00:00:00'  && row.date_from > s_now ) { state = "notyet" }; // 해야할 것
        }
        return state;
    },
    get_study_time_seconds:function( row ) {
        var seconds    = 0;
        if (row.date_done > row.date_started ) { 
            var date_started    = gWS.get_datetime_from_string( row.date_started );
            var date_done       = gWS.get_datetime_from_string( row.date_done );
            var dif             = date_done.getTime() - date_started.getTime();
            seconds             = Math.abs( dif / 1000 )
        }
        return seconds;
    },
    get_time_to_string:function( seconds  ) {
        if ( seconds == 0 ) {
            return "";
        }
        var s_time       = new Date(seconds * 1000).toISOString().substr(11, 8);
        var s_arr       = s_time.split(":")
        var s_hms       = "";
        if ( s_arr[0] > "00" ) {
            s_hms += Number( s_arr[0] ) + "시간";
            s_hms += Number( s_arr[1] ) + "분";
        } else {
            if ( s_arr[1] > "00" ) {
                s_hms += Number( s_arr[1] ) + "분";
                s_hms += Number( s_arr[2] ) + "초";
            } else {
                s_hms += Number( s_arr[2] ) + "초";
            }
        } 
        return s_hms;
    },
    get_study_time_hms:function( row ) {
        var seconds     = gWS.get_study_time_seconds( row );
        var s_hms       = gWS.get_time_to_string( seconds );
        return s_hms;
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
    getSubjectPlans:function( find_subject, study_plans) {
        var plan_list       = [];
        var plan_json       = {};
        var code_json       = {};
        var prev_date_from  = "";
        study_plans.sort( gWS.GetSortOrder( 'date_from') );    // date_from 으로정렬
        study_plans.forEach( function( row , index) {
            var date_from       = row.date_from;
            if ( row.subject == find_subject ) {
                if ( row.date_from != prev_date_from ) { // 일자가 변경되는 json 이 있을 때, list 에 추가
                    if ( Object.keys(plan_json).length > 0  ) {
                        plan_list.push( plan_json );
                    }
                    // 초기화
                    plan_json   = {};
                    plan_json[ "study_id" ]   = row.study_id;
                    plan_json[ "subject_id" ] = row.subject_id;
                    plan_json[ "mb_id" ]      = row.mb_id;
                    plan_json[ "date_from" ]  = row.date_from;
                    plan_json[ "date_to" ]    = row.date_to;
                    plan_json[ "date_started" ] = row.date_started;
                    plan_json[ "date_done" ]  = row.date_done;
                    plan_json[ "subject" ]    = row.subject;
                    plan_json[ "note" ]       = row.note;
                    plan_json[ row.code ]       = row.plan;
                    plan_json[ row.code + "_study_id" ]    = row.study_id;
                    plan_json[ row.code + "_state" ]       = gWS.get_study_state( row );
                    study_time                  = row["study_time" ] || 0;
                    plan_json[ row.code + "_time" ]       = ( study_time > 0 ) ? gWS.get_time_to_string(study_time) : gWS.get_study_time_hms( row );
                    plan_json[ "day" ]          = gWS.get_day_from_string( row.date_from ); // 요일구하기
                    code_json[ row.code ] = 1;
                    //--- 
                    prev_date_from              =  row.date_from;
                }else{
                    plan_json[ row.code ]       = row.plan
                    plan_json[ row.code + "_study_id" ]    = row.study_id;
                    plan_json[ row.code + "_state" ]       = gWS.get_study_state( row );
                    study_time                  = row["study_time" ] || 0;
                    plan_json[ row.code + "_time" ]       = ( study_time > 0 ) ? gWS.get_time_to_string(study_time) : gWS.get_study_time_hms( row );
                    code_json[ row.code ] = 1;
                }
            }else if ( find_subject == "일자별" ) {
                if ( row.date_from != prev_date_from ) { // 일자가 변경되는 json 이 있을 때, list 에 추가
                    if ( Object.keys(plan_json).length > 0  ) {
                        plan_list.push( plan_json );
                    }
                    // 초기화
                    plan_json   = {};
                    plan_json[ "study_id" ]   = row.study_id;
                    plan_json[ "subject_id" ] = row.subject_id;
                    plan_json[ "mb_id" ]      = row.mb_id;
                    plan_json[ "date_from" ]  = row.date_from;
                    plan_json[ "date_to" ]    = row.date_to;
                    plan_json[ "date_started" ] = row.date_started;
                    plan_json[ "date_done" ]  = row.date_done;
                    plan_json[ "subject" ]    = row.subject;
                    plan_json[ "note" ]       = row.note;
                    plan_json[ row.code ]       = row.plan;
                    plan_json[ row.code + "_study_id" ]    = row.study_id;
                    plan_json[ row.code + "_state" ]       = gWS.get_study_state( row );
                    study_time                  = row["study_time" ] || 0;
                    plan_json[ row.code + "_time" ]       = ( study_time > 0 ) ? gWS.get_time_to_string(study_time) : gWS.get_study_time_hms( row );
                    plan_json[ "day" ]          = gWS.get_day_from_string( row.date_from ); // 요일구하기
                    code_json[ row.code ] = 1;
                    //--- 
                    prev_date_from              =  row.date_from;
                }else{
                    plan_json[ row.code ]       = row.plan
                    plan_json[ row.code + "_study_id" ]    = row.study_id;
                    plan_json[ row.code + "_state" ]       = gWS.get_study_state( row );
                    study_time                  = row["study_time" ] || 0;
                    plan_json[ row.code + "_time" ]       = ( study_time > 0 ) ? gWS.get_time_to_string(study_time) : gWS.get_study_time_hms( row );
                    code_json[ row.code ] = 1;
                }
            }
        });
        if ( Object.keys(plan_json).length > 0  ) {
            plan_list.push( plan_json );
        }
        // code 목록 구하기
        var code_list   = Object.keys( code_json )
        var code_results     = [];
        code_list.forEach( function( code, index ) {
            if ( !gWS.isEmpty(code) ) {
                code_results.push( code );
            }
        });
        gWS.subject_code_json[ find_subject ] = code_results;
        //
        return plan_list
    },
    calPlanData:function( study_plans) {
        gWS.subject_list    = gWS.getSubject( study_plans);
        gWS.subject_list.forEach( function( subject , index) {
            gWS.subject_plan_json[ subject ]  = gWS.getSubjectPlans( subject, study_plans );
        });
    },
    get_code_html: function( subject ) {
        var subject_code_list   = gWS.subject_code_json[ subject ];
        var s_code_html = "<th><a class='text-center text-mute mp_sel_code' data-code=''  > 일 자</a></th>\n";
        subject_code_list.forEach( function( code, index ) {
            if ( ! gWS.isEmpty( code) ) {
                s_code_html += " <th class='text-center'  > ";
                s_code_html += "    <a class='text-center text-mute mp_sel_code' data-code='" + code + "'  > " + code + "</a></th>\n";
            }
        });
        return s_code_html;
    },
    get_plan_date_list: function( plan_datas){  // 일자만 추출
        let date_json   = {};
        plan_datas.forEach( function( row, index ) {
            const   date_from   = row.date_from;
            date_json[ date_from ] = 1;
        });
        return Object.keys( date_json );
    },
    get_tbody_html: function( subject ) {
        var s_ps_con    = "";
        var s_class     = "";
        var state       = "";
        var s_plan_val  = "";
        var code_len    = gWS.subject_code_json[subject].length;
        if ( subject == "일자별") {     // 일자를 구해서 , 일자별묶음별로  교재별 일정을 표시
            let plan_date_list  = gWS.get_plan_date_list( gWS.subject_plan_json[ subject ] );
            $("#member_period").html( plan_date_list[0] + " ~ " + plan_date_list[ plan_date_list.length-1] );
            plan_date_list.forEach( function( plan_date, index ) {  // 일자별
                let plan_day  = gWS.get_day_from_string( plan_date );
                s_ps_con +="                                          <tr class='bg-primary text-white' >\n";
                if ( plan_day == "토요일" || plan_day == "일요일" ) {
                    s_ps_con +="                                            <td  class='text-danger td_plan_date mp_sel_plan' ";
                    s_ps_con +="                                                data-plan_date='" + plan_date + "'";
                    s_ps_con +="                                                data-code=''";
                    s_ps_con +="                                                colspan='" + (code_len + 1 ) + "'";
                    s_ps_con +="                                                >주 말</td>\n";
                } else {
                    s_ps_con +="                                            <td class='td_plan_date mp_sel_plan' ";
                    s_ps_con +="                                                data-plan_date='" + plan_date + "' ";
                    s_ps_con +="                                                data-code='' ";
                    s_ps_con +="                                                colspan='" + (code_len + 1 ) + "'";
                    s_ps_con +="                                                >" + plan_date+ "</td>\n";
                }
                s_ps_con +="                                            </tr>\n";
                gWS.subject_list.forEach( function( subject, index ) {
                    if ( index > 0 ){   // 0번째 일자별은 제외
                        gWS.subject_plan_json[ subject ].forEach( function( plan , index ) {
                            let sel_study_id        = plan.study_id;
                            let sel_subject_id      = plan.subject_id;
                            if ( plan.date_from == plan_date ) { // 위에서 구한 일자이면
                                s_ps_con +="                                          <tr>\n";
                                if ( plan.day == "토요일" || plan.day == "일요일" ) {
                                    s_ps_con +="                                            <td  class='text-danger td_plan_subject mp_sel_plan' ";
                                    s_ps_con +="                                                data-plan_date='" + plan_date + "' ";
                                    s_ps_con +="                                                data-code='' ";
                                    s_ps_con +="                                                 >"+plan.subject+"</td>\n";
                                } else {
                                    s_ps_con +="                                            <td  class='td_plan_subject mp_sel_plan' ";
                                    s_ps_con +="                                                data-plan_date='" + plan_date + "' ";
                                    s_ps_con +="                                                data-code='' ";
                                    s_ps_con +="                                                 >"+plan.subject+"</td>\n";
                                }
                                s_class = "";
                                let td_ct    = 0;
                                gWS.subject_code_json[subject].forEach( function( code, index) {
                                    s_plan_val  = plan[ code ];
                                    if ( gWS.isEmpty( s_plan_val ) ) {
                                        s_plan_val      = "";
                                    }
                                    s_class     = "";
                                    state       = plan[ code + "_state" ];
                                    s_time      = plan[ code + "_time" ];
                                    s_study_id  = plan[ code + "_study_id" ];
                                    if ( state == "done" ) {
                                        s_class ="fa fa-circle text-success";
                                    } else if ( state == "overdue" ) {
                                        s_class ="fa fa-times text-danger";
                                    } else if ( state == "studying" ) {
                                        s_class ="fa fa-spinner text-primary";
                                    } else if ( state == "notyet" ) {
                                        s_class ="fa fa-file-o text-secondary";
                                    } else if ( state == "nogood" ) {
                                        s_class ="fa fa-ban text-warning";
                                    } else{
                                        s_class ="";
                                    } 
                                    if ( s_plan_val == "" )     s_class = "";
                                    if ( s_time > ""){
                                        s_plan_val   += "<br><small> " + s_time + "</small>" 
                                    }
                                    s_ps_con +="                                            <td class='text-center mp_sel_plan mp_code' ";
                                    s_ps_con +="                                                data-study_id='" + s_study_id + "' ";
                                    s_ps_con +="                                                data-subject_id='" + sel_subject_id + "' ";
                                    s_ps_con +="                                                data-plan_date='" + plan_date + "' ";
                                    s_ps_con +="                                                data-code='" + code + "' >";
                                    s_ps_con +="                                                <i class='" + s_class + "' aria-hidden='true'></i> ";
                                    s_ps_con +="                                                  " + s_plan_val +"</td>\n";
                                    td_ct++;
                                });
                                while ( td_ct < code_len ){
                                    s_ps_con +="                                            <td class='text-center' ></td>\n";
                                    td_ct++;
                                }
                                s_ps_con +="                                          </tr>\n";
                            }
                        }); // end 교재별 일정 gWS.subject_plan_json[ subject ]
                    }
                });  // end subject_list
            }); // end plan_date_list
        } else { // 교재별이면
            gWS.subject_plan_json[ subject ].forEach( function( plan , index ) {
                let sel_study_id        = plan.study_id;
                let sel_subject_id      = plan.subject_id;
                s_ps_con +="                                          <tr>\n";
                if ( plan.day == "토요일" || plan.day == "일요일" ) {
                    s_ps_con +="                                            <td  class='text-danger td_plan_date mp_sel_plan' ";
                    s_ps_con +="                                                data-plan_date='" + plan.date_from + "' ";
                    s_ps_con +="                                                data-code='' >주 말</td>\n";
                } else {
                    s_ps_con +="                                            <td class='td_plan_date mp_sel_plan' ";
                    s_ps_con +="                                                data-plan_date='" + plan.date_from + "' ";
                    s_ps_con +="                                                data-code='' >" + plan.date_from + "</td>\n";
                }
                s_class = ""
                gWS.subject_code_json[subject].forEach( function( code, index) {
                    s_plan_val  = plan[ code ];
                    if ( gWS.isEmpty( s_plan_val ) ) {
                        s_plan_val      = "";
                    }
                    s_class     = "";
                    state       = plan[ code + "_state" ];
                    s_time      = plan[ code + "_time" ];
                    s_study_id  = plan[ code + "_study_id" ];
                    if ( state == "done" ) {
                        s_class ="fa fa-circle text-success";
                    } else if ( state == "overdue" ) {
                        s_class ="fa fa-times text-danger";
                    } else if ( state == "studying" ) {
                        s_class ="fa fa-spinner text-primary";
                    } else if ( state == "notyet" ) {
                        s_class ="fa fa-file-o text-secondary";
                    } else if ( state == "nogood" ) {
                        s_class ="fa fa-ban text-warning";
                    } else{
                        s_class ="";
                    } 
                    if ( s_plan_val == "" )     s_class = "";
                    if ( s_time > ""){
                        s_plan_val   += "<br><small> " + s_time + "</small>" 
                    }
                    if ( s_plan_val > "" ) {
                        s_ps_con +="                                            <td class='text-center mp_sel_plan mp_code mp_count' ";
                        s_ps_con +="                                                data-study_id='" + s_study_id + "' ";
                        s_ps_con +="                                                data-subject_id='" + sel_subject_id + "' ";
                        s_ps_con +="                                                data-category='" + plan.subject + "' ";
                        s_ps_con +="                                                data-plan_date='" + plan.date_from + "' ";
                        s_ps_con +="                                                data-plan='" + plan[ code ] + "' ";
                        s_ps_con +="                                                data-note='" + plan.note + "' ";
                        s_ps_con +="                                                data-code='" + code + "' >";
                        s_ps_con +="                                                  <i class='" + s_class + "' aria-hidden='true'></i> ";
                        s_ps_con +="                                                         " + s_plan_val +"</td>\n";
                    } else {
                        s_ps_con +="                                            <td class='text-center mp_sel_plan mp_code mp_count' ";
                        s_ps_con +="                                                >";
                        s_ps_con +="                                                  <i aria-hidden='true'></i> ";
                        s_ps_con +="                                                         </td>\n";
                    }
                });
                s_ps_con +="                                          </tr>\n";
            });
        }
        return s_ps_con;
    },
    showPlanData: function( study_plans ){
        gWS.calPlanData( study_plans );
        var s_ps_html    = "";
        var s_ps_con     = "";
        var i_no         = 0;
        //--회원명 표시
        var mb_id       = study_plans[0].mb_id;
        if ( $("#span_mb_id").html().indexOf( mb_id ) <= 0 ) { // 이미 이름과 id 를 표시를 안하고 있으면
            $("#span_mb_id").html( mb_id + " 님 ");
        }
        $("#span_plan").html( mb_id + " 님 ");
        //
        make_plan_style = $("#make_plan_style").val() || '';
        gWS.subject_list.forEach( function( subject, index ) {
            i_no += 1;
            var s_s_name    = "subject" + i_no;
            var s_active    = ( i_no == 1) ? " active " : "";
          
            let date_category   = subject; 
            if ( subject =="일자별" ){
                date_category   = "";
            } 
            let disp_subject    = subject.replace("일일테스트", "T" ).replace("일일 테스트", "T" );
            s_ps_html += "<li class='nav-item'> ";
            s_ps_html += "   <a class='nav-link plan_category_title" + s_active + "' data-toggle='tab' ";
            s_ps_html += "        href='#tab_" + s_s_name + "' data-category='" + date_category + "' >" + disp_subject + "</a> </li>\n";

            var s_code_html = gWS.get_code_html( subject );
            var s_tbody_html = gWS.get_tbody_html( subject );

            s_ps_con += "                       <!-- " + s_s_name + " Tab -->\n";
            s_ps_con +="                        <div class='tab-pane show " + s_active + " ' id='tab_" + s_s_name + "'>\n";
            s_ps_con +="\n";
            s_ps_con +="                            <!-- " + s_s_name + " Table -->\n";
            s_ps_con +="                            <div class='payroll-table card'>\n";
            s_ps_con +="                                <div class='table-responsive'>\n";
            s_ps_con +="                                <table class='table'>\n";
            s_ps_con +="                                        <thead class='" + make_plan_style + "' >\n";
            s_ps_con +="                                          <tr>\n";
            s_ps_con +="                                            " + s_code_html;
            s_ps_con +="                                          </tr>\n";
            s_ps_con +="                                        </thead>\n";
            s_ps_con +="                                        <tbody class='" + make_plan_style + "' >\n";
            s_ps_con +="                                          " + s_tbody_html;
            s_ps_con +="                                        </tbody>\n";
            s_ps_con +="                                      </table>\n";
            s_ps_con +="                                </div>\n";
            s_ps_con +="                            </div>\n";
            s_ps_con +="                            <!-- /" + s_s_name + " Table -->\n";
            s_ps_con +="                            \n";
            s_ps_con +="                        </div>\n";
            s_ps_con +="                        <!-- " + s_s_name + " Tab -->\n";
        });
        $("#plan-subjects").html( s_ps_html );
        $("#div_tab_content").html( s_ps_con );
        //-- event 설정
        $("a.plan_category_title").on("click", function(){
            gMP.fun_plan_category_title(event, this );
        });
        $("a.mp_sel_code").on("click", function(){
            gMP.fun_mp_sel_code(event, this );
        });
        $("td.mp_sel_plan").on("click", function(e){
            gMP.fun_mp_sel_plan(event, this );
            if ( gMP.mp_select_info.date_from ) {   // 이동 시작일을 선택한 일로 자동 설정
                $("#move_new_date_from").val( gMP.mp_select_info.date_from );
            }
        });
        $("td.mp_sel_plan").on("dblclick", function(e){
            gMP.fun_mp_dblclick_plan(event, this );
        });
        $("td.mp_sel_plan").attr('unselectable','on')
             .css({'-moz-user-select':'-moz-none',
                   '-moz-user-select':'none',
                   '-o-user-select':'none',
                   '-khtml-user-select':'none', /* you could also put this in a class */
                   '-webkit-user-select':'none',/* and add the CSS class here instead */
                   '-ms-user-select':'none',
                   'user-select':'none'
             }).bind('selectstart', function(){ return false; });
        
    }, 
    getStudyReportData:function( param){
        var kakao_key   =  param.kakao ;
        if (!kakao_key ) {
            return [];  // 데이터 없음
        }
        var url4json    =  gWS.base_server + "/kakao/json_member_report/" + kakao_key +"?ts=" + Date.now();
        gWS.study_plans  = [];
        gWS.showProgressBar(true);
        $.getJSON( url4json).done(function( data ) {
            var rtn             = gWS.showStudyReportData( data  );
            return data;

        }).fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;     // error, Not Found
            if ( error.indexOf("Not Found") >=0 ) {
                alert("학습현황을 확인할 수 없습니다.");
                //window.close();
                return [];  // 데이터 없음
            }
            alert("err=" + err );
            console.log( "Request Failed: " + err );
            return [];  // 데이터 없음
        }).always(function() {
            console.log( "complete" );
            gWS.showProgressBar(false);
        });
    },
    showStudyReportData: function( data ){
        let json_data   = data.study_report;
        am4core.ready(function() {
            gWS.showMemberSubjectReport( json_data);
            gWS.showMemberTimeReport( json_data);
            gWS.showMemberInfo( data.member_info );
            gWS.hide_logo();
        });
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
    showMemberSubjectReport: function( json_data) {
        if ( Object.keys( json_data ).length <=0 ){
            return;
        }
        $("#tab_1").removeClass("hide");
        $("#tab_2").addClass("hide");
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv1", am4charts.XYChart);

        chart.colors.step = 2;
        // Export
        //chart.exporting.menu = new am4core.ExportMenu();

        // Data for both series
        let data    = [];
        let subject_plan    = {};
        let sum_ct                = 0;  // 권장진도율 합계. 평균을 위해
        let sum_guide_progress    = 0;  // 권장진도율 합계. 평균을 위해
        json_data.forEach(function(row){
            if (row.group1 == "과목별권장진도율" ){
                subject_plan[ row.subject ] = row.v1;
                sum_guide_progress += row.v1;
                sum_ct  += 1;
            }
        })
        let   avg_guide_progress  = 0;
        if ( sum_ct > 0) {
            avg_guide_progress  = (sum_guide_progress/ sum_ct ).toFixed(1);    // 권장진도율 평균
        }
        let sum_progress    = 0;
        let avg_progress    = 0.0;
        json_data.forEach(function(row){
            if (row.group1 == "과목별진도율" ){
                const   subject_plan_v  = subject_plan[ row.subject ] || 0;
                data.push( {
                    "subject": "" + row.subject,
                    "mean": subject_plan_v,
                    "progress":  row.v1
                });
                sum_progress += row.v1;
            }
        })
        if ( data.length > 0) {
            avg_progress    = (sum_progress / data.length).toFixed(1);
        }
        data.forEach(function(row){
            row["p_mean"]   = avg_progress;
        })

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "subject";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0;

        categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
            if (target.dataItem && target.dataItem.index & 2 == 2) {
                return dy + 25;
            }
            return dy;
        });


        /* Create value axis */
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        /* Create series */
        var columnSeries = chart.series.push(new am4charts.ColumnSeries());
        columnSeries.name = "진도율";
        columnSeries.dataFields.valueY = "progress";
        columnSeries.dataFields.categoryX = "subject";

        columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}%[/] [#fff]{additional}[/]"
        columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
        columnSeries.columns.template.propertyFields.stroke = "stroke";
        columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
        columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
        columnSeries.tooltip.label.textAlign = "middle";

        var bullet = columnSeries.bullets.push(new am4charts.LabelBullet());
        bullet.label.interactionsEnabled = false;
        bullet.label.dy = 30;
        bullet.label.text = '{valueY}%';
        bullet.label.fill = am4core.color("#ffffff");

        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "권장진도율";
        lineSeries.dataFields.valueY = "mean";
        lineSeries.dataFields.categoryX = "subject";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 3;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";
        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY} %[/] [#fff]{additional}[/]"


        var lineSeries2 = chart.series.push(new am4charts.LineSeries());
        lineSeries2.name = "평균진도율";
        lineSeries2.dataFields.valueY = "p_mean";
        lineSeries2.dataFields.categoryX = "subject";

        lineSeries2.stroke = am4core.color("#33d400");
        lineSeries2.strokeWidth = 3;
        lineSeries2.propertyFields.strokeDasharray = "lineDash";
        lineSeries2.tooltip.label.textAlign = "middle";
        var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());
        bullet2.fill = am4core.color("#33d400"); // tooltips grab fill from parent by default
        bullet2.tooltipText = "[#fff font-size: 15px]{name} :\n[/][#fff font-size: 20px]{valueY} %[/] [#fff]{additional}[/]"
        var circle2 = bullet2.createChild(am4core.Circle);
        circle2.radius = 2;
        circle2.fill = am4core.color("#fff");
        circle2.strokeWidth = 1;
        $("#avg_subject1").html("권장 진도율: " + avg_guide_progress + " %" );
        $("#avg_subject2").html("평균 진도율: " + avg_progress + " %" );


        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.fill = am4core.color("#fff");
        circle.strokeWidth = 3;

        chart.data = data;
    }, 
    showMemberTimeReport: function( json_data) {
        if ( Object.keys( json_data ).length <=0 ){
            return;
        }
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        var chart = am4core.create("chartdiv2", am4charts.XYChart);

        chart.colors.step = 2;
        // Export
        //chart.exporting.menu = new am4core.ExportMenu();

        // Data for both series
        let mb_daily_avg_study_time = 0.0;  // 회원의 일평균학습시간
        json_data.forEach(function(row){
            if (row.group1 == "일평균학습시간" ){
                mb_daily_avg_study_time = row.v1;  // 회원의 일평균학습시간, 모든 과목을 공부한 하루 학습시간을 학습일로 나눈 평균
            }
        });
        let data    = [];
        let sum_study_time  = 0.0;      // 막대그래프의 평균선을 그리기위해 합계를 구하고,
        let avg_study_time  = 0.0;
        json_data.forEach(function(row){
            if (row.group1 == "과목별일평균학습시간" ){
                data.push( {
                    "subject": "" + row.subject,
                    "mean": mb_daily_avg_study_time,
                    "progress":  row.v1
                });
                sum_study_time  += row.v1;
            }
        })
        if ( data.length > 0 ) {
            avg_study_time  = (sum_study_time/data.length).toFixed(0);
        }
        data.forEach(function(row){
            row["p_mean"]   = avg_study_time;
        })

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "subject";
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.grid.template.location = 0;

        categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
            if (target.dataItem && target.dataItem.index & 2 == 2) {
                return dy + 25;
            }
            return dy;
        });


        /* Create value axis */
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        /* Create series */
        var columnSeries = chart.series.push(new am4charts.ColumnSeries());
        columnSeries.name = "일평균시간(분)";
        columnSeries.dataFields.valueY = "progress";
        columnSeries.dataFields.categoryX = "subject";

        columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}분[/] [#fff]{additional}[/]"
        columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
        columnSeries.columns.template.propertyFields.stroke = "stroke";
        columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
        columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
        columnSeries.tooltip.label.textAlign = "middle";

        var bullet = columnSeries.bullets.push(new am4charts.LabelBullet());
        bullet.label.interactionsEnabled = false;
        bullet.label.dy = 30;
        bullet.label.text = '{valueY}분';
        bullet.label.fill = am4core.color("#ffffff");

        var lineSeries = chart.series.push(new am4charts.LineSeries());
        lineSeries.name = "하루평균 총학습시간";
        lineSeries.dataFields.valueY = "mean";
        lineSeries.dataFields.categoryX = "subject";

        lineSeries.stroke = am4core.color("#fdd400");
        lineSeries.strokeWidth = 3;
        lineSeries.propertyFields.strokeDasharray = "lineDash";
        lineSeries.tooltip.label.textAlign = "middle";

        var bullet = lineSeries.bullets.push(new am4charts.Bullet());
        bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = "[#fff font-size: 15px]{name}:\n[/][#fff font-size: 20px]{valueY} 분[/] [#fff]{additional}[/]"
        var circle = bullet.createChild(am4core.Circle);
        circle.radius = 4;
        circle.fill = am4core.color("#fff");
        circle.strokeWidth = 3;

        var lineSeries2 = chart.series.push(new am4charts.LineSeries());
        lineSeries2.name = "평균학습시간";
        lineSeries2.dataFields.valueY = "p_mean";
        lineSeries2.dataFields.categoryX = "subject";

        lineSeries2.stroke = am4core.color("#33d400");
        lineSeries2.strokeWidth = 1;
        lineSeries2.propertyFields.strokeDasharray = "lineDash";
        lineSeries2.tooltip.label.textAlign = "middle";
        var bullet2 = lineSeries2.bullets.push(new am4charts.Bullet());
        bullet2.fill = am4core.color("#33d400"); // tooltips grab fill from parent by default
        bullet2.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY} 분[/] [#fff]{additional}[/]"
        var circle2 = bullet2.createChild(am4core.Circle);
        circle2.radius = 1;
        circle2.fill = am4core.color("#fff");
        circle2.strokeWidth = 1;
        $("#avg_time1").html("일 평균학습시간: " + mb_daily_avg_study_time + " 분" );
        $("#avg_time2").html("과목단위 평균시간: " + avg_study_time + " 분" );

        chart.data = data;
    } ,
    getStudyLogsData:function( param){
        var kakao_key   =  param.kakao ;
        if (!kakao_key ) {
            return [];  // 데이터 없음
        }
        var url4json    =  gWS.base_server + "/kakao/json/plan_study_logs/" + kakao_key +"?ts=" + Date.now();
        gWS.study_plans  = [];
        gWS.showProgressBar(true);
        $.getJSON( url4json).done(function( data ) {
            var rtn             = gWS.showStudyLogsData( data  );
            return data;

        }).fail(function( jqxhr, textStatus, error ) {
            var err = textStatus + ", " + error;     // error, Not Found
            if ( error.indexOf("Not Found") >=0 ) {
                alert("학습현황을 확인할 수 없습니다.");
                //window.close();
                return [];  // 데이터 없음
            }
            alert("err=" + err );
            console.log( "Request Failed: " + err );
            return [];  // 데이터 없음
        }).always(function() {
            console.log( "complete" );
            gWS.showProgressBar(false);
        });
    },
    showStudyLogsData: function( data ){
        let json_data   = data.study_logs;
        gWS.chart_data_4_study_logs = json_data;
        am4core.ready(function() {
            gWS.showMemberStudyLogs( json_data);
            gWS.showMemberInfo( data.member_info );
            gWS.resize_study_logs_chart();
            
        });
    },
    chart_data_4_study_logs:null,
    get_sel_priod_4_study_logs: function(){
        let sel_period  = $("input[name='sel_period']:checked").val();
        return sel_period;
    },
    showMemberStudyLogs: function( json_data) {
        if ( Object.keys( json_data ).length <=0 ){
            return;
        }
        $("#tab_1").removeClass("hide");
        $("#tab_2").addClass("hide");
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end
        var chart = am4core.create("chartdiv1", am4charts.XYChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
        chart.cursor = new am4charts.XYCursor();


        var colorSet = new am4core.ColorSet();
        colorSet.saturation = 0.4;
        chart.dateFormatter.monthsShort = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월' ];

        chart.dateFormatter.dateFormat = "yyyy-MM-dd HH:mm";
        chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.inversed = true;
        if ( screen.availWidth < 500 ) {
            categoryAxis.width = 0;
            categoryAxis.setVisibility( false );
        }

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.baseInterval = { count: 1, timeUnit: "minute" };
        // dateAxis.max = new Date(2018, 0, 1, 24, 0, 0, 0).getTime();
        //dateAxis.strictMinMax = true;
        dateAxis.renderer.tooltipLocation = 0;
        let label   = dateAxis.renderer.labels.template;
        label.wrap  = true;
        label.maxWidth = 50;

        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.columns.template.dy = 10;
        series1.columns.template.height = am4core.percent(50);
        series1.columns.template.tooltipText = "{category}\n{task}\n{state}\n시작: {openDateX}\n 종료:{dateX}";

        series1.dataFields.openDateX = "start";
        series1.dataFields.dateX = "end";
        series1.dataFields.categoryY = "category";
        series1.columns.template.propertyFields.fill = "color"; // get color from data
        series1.columns.template.propertyFields.stroke = "color";
        series1.columns.template.strokeOpacity = 1;

        let sel_period   = gWS.get_sel_priod_4_study_logs();    // day, week, month
        let today_date   = new Date();
        let sel_from_date   = gWS.get_YyMmDd_add_day( today_date, -2  )
        if ( sel_period == "week" ) {
            sel_from_date   = gWS.get_YyMmDd_add_day( today_date, -7  )
        }
        if ( sel_period == "month" ) {
            sel_from_date   = gWS.get_YyMmDd_add_day( today_date, -40  )
        }
        let new_chart_data  = [];
        let i_idx   =0;
        json_data.forEach( function(el) {
            if ( el.start >= sel_from_date ) {
                if ( i_idx == 0){
                    el.category = "학습외출";
                    el.task = "";
                    el.state = "";
                    el.color = "lightgray";
                    new_chart_data.push( el );
                }
                i_idx ++;
                new_chart_data.push( el );
            }
        });
        chart.data = new_chart_data;

        let sel_show_label   = $("input[name='sel_show_label']").is(":checked");
        if ( sel_show_label ) {
            let bullet = series1.bullets.push(new am4charts.LabelBullet);
            bullet.label.text = "{task}";
            //if (sel_period == "month" ){
            //    bullet.label.text   = "";
            //}
            bullet.label.rotation = 0;
            bullet.label.truncate = false;
            bullet.label.hideOversized = false;
            bullet.label.horizontalCenter = "left";
            bullet.label.dy = -25;
        }

        chart.scrollbarX = new am4core.Scrollbar();

        // Style scrollbar
        function customizeGrip(grip) {
            // Remove default grip image
            grip.icon.disabled = true;
          
            // Disable background
            grip.background.disabled = true;
          
            // Add rotated rectangle as bi-di arrow
            var img = grip.createChild(am4core.Rectangle);
            img.width = 15;
            img.height = 15;
            img.fill = am4core.color("#999");
            img.rotation = 45;
            img.align = "center";
            img.valign = "middle";
          
            // Add vertical bar
            var line = grip.createChild(am4core.Rectangle);
            line.height = 60;
            line.width = 3;
            line.fill = am4core.color("#999");
            line.align = "center";
            line.valign = "middle";
        }

        customizeGrip(chart.scrollbarX.startGrip);
        customizeGrip(chart.scrollbarX.endGrip);

        gWS.hide_logo2();
    }, 
    showMemberStudyLogsxx: function( json_data ) {
        if ( Object.keys( json_data ).length <=0 ){
            return;
        }
        $("#tab_1").removeClass("hide");
        $("#tab_2").addClass("hide");
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        var alarm = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQ1Ljc3M3B4IiBoZWlnaHQ9IjQ1Ljc3M3B4IiB2aWV3Qm94PSIwIDAgNDUuNzczIDQ1Ljc3MyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDUuNzczIDQ1Ljc3MzsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik01LjA4MSwxMy43MzdjMi41ODItMy45NDIsNi42MDktNi44NDksMTEuMzItNy45ODhjMC4zNjMtMC4wODcsMC42NjItMC4zNDQsMC44MDItMC42ODkNCgkJCWMwLjE0MS0wLjM0NiwwLjEwNy0wLjczOC0wLjA5MS0xLjA1NUMxNS42MDQsMS42MDEsMTIuOTM2LDAsOS44ODgsMEM1LjE3NiwwLDEuMzU0LDMuODIsMS4zNTQsOC41MzJjMCwyLDAuNjkxLDMuODM3LDEuODQ1LDUuMjkNCgkJCWMwLjIzMSwwLjI5MywwLjU4OSwwLjQ1NSwwLjk2MiwwLjQzOFM0Ljg3NywxNC4wNDgsNS4wODEsMTMuNzM3eiIvPg0KCQk8cGF0aCBkPSJNMzUuODg2LDBjLTMuMDM0LDAtNS42OTMsMS41ODYtNy4yMDQsMy45NzRjLTAuMiwwLjMxNi0wLjIzNSwwLjcxMS0wLjA5NCwxLjA1OWMwLjE0MiwwLjM0OSwwLjQ0MiwwLjYwNSwwLjgwOSwwLjY5MQ0KCQkJYzQuNzI0LDEuMTEyLDguNzY1LDMuOTk5LDExLjM2OSw3LjkyOGMwLjIwNywwLjMxMiwwLjU1MiwwLjUwNSwwLjkyNywwLjUxOGMwLjM3NSwwLjAxNCwwLjczMS0wLjE1NCwwLjk2MS0wLjQ1MQ0KCQkJYzEuMTA1LTEuNDM2LDEuNzY2LTMuMjMyLDEuNzY2LTUuMTg2QzQ0LjQxNywzLjgyLDQwLjU5OCwwLDM1Ljg4NiwweiIvPg0KCQk8cGF0aCBkPSJNNDEuNzUyLDI2LjEzMmMwLTMuMjk0LTAuODU3LTYuMzktMi4zNTEtOS4wODRjLTIuNzY5LTQuOTktNy43NDItOC41NzctMTMuNTk1LTkuNDc1Yy0wLjkzMy0wLjE0My0xLjg4LTAuMjQtMi44NTMtMC4yNA0KCQkJYy0xLjAxNiwwLTIuMDA2LDAuMTA0LTIuOTc5LDAuMjZDMTQuMTQ2LDguNTI4LDkuMTk4LDEyLjEzLDYuNDU4LDE3LjEyNmMtMS40NjcsMi42NzYtMi4zMDQsNS43NDQtMi4zMDQsOS4wMDYNCgkJCWMwLDUuNTg2LDIuNDYzLDEwLjU5Nyw2LjM0MywxNC4wNDFsLTEuNTg0LDIuMjMxYy0wLjY4MiwwLjk2MS0wLjQ1NiwyLjI5MSwwLjUwNSwyLjk3NWMwLjM3NSwwLjI2NiwwLjgwNiwwLjM5NSwxLjIzMywwLjM5NQ0KCQkJYzAuNjY4LDAsMS4zMjYtMC4zMTMsMS43NDEtMC44OThsMS41ODMtMi4yM2MyLjY2OSwxLjQ1Nyw1LjcyOCwyLjI4Nyw4Ljk3OCwyLjI4N2MzLjI0OSwwLDYuMzA4LTAuODMsOC45NzctMi4yODdsMS41ODMsMi4yMw0KCQkJYzAuNDE2LDAuNTg2LDEuMDczLDAuODk4LDEuNzQxLDAuODk4YzAuNDI3LDAsMC44NTctMC4xMjksMS4yMzItMC4zOTVjMC45NjEtMC42ODQsMS4xODgtMi4wMTQsMC41MDYtMi45NzVsLTEuNTg0LTIuMjMxDQoJCQlDMzkuMjg4LDM2LjcyOSw0MS43NTIsMzEuNzE4LDQxLjc1MiwyNi4xMzJ6IE0yMi45NTQsMzkuNjc0Yy03LjQ2OCwwLTEzLjU0Mi02LjA3NC0xMy41NDItMTMuNTQyDQoJCQljMC0yLjMyOCwwLjU5MS00LjUxOSwxLjYyOS02LjQzNWMxLjk3Ni0zLjY0NCw1LjU4LTYuMjY5LDkuODI2LTYuOTNjMC42ODItMC4xMDYsMS4zNzUtMC4xNzgsMi4wODctMC4xNzgNCgkJCWMwLjY3LDAsMS4zMjUsMC4wNjUsMS45NywwLjE2YzQuMjgyLDAuNjI4LDcuOTI1LDMuMjUzLDkuOTI0LDYuOTEzYzEuMDUsMS45MjMsMS42NDcsNC4xMjYsMS42NDcsNi40NjkNCgkJCUMzNi40OTUsMzMuNiwzMC40MjEsMzkuNjc0LDIyLjk1NCwzOS42NzR6Ii8+DQoJCTxwYXRoIGQ9Ik0zMC41NCwyOS4zbC01LjE2Ni0zLjE5Yy0wLjEwNy0wLjYwNC0wLjQzNC0xLjEyNS0wLjg5My0xLjQ5NGwwLjIzNi02LjQ4MmMwLjAyOS0wLjgyOC0wLjYxNy0xLjUyMy0xLjQ0NC0xLjU1NA0KCQkJYy0wLjgyNS0wLjAzOC0xLjUyMywwLjYxNi0xLjU1NCwxLjQ0NGwtMC4yMzcsNi40ODljLTAuNjQxLDAuNDUyLTEuMDYzLDEuMTk2LTEuMDYzLDIuMDQxYzAsMS4zODEsMS4xMTksMi40OTksMi41LDIuNDk5DQoJCQljMC4zOTMsMCwwLjc2LTAuMDk5LDEuMDktMC4yNmw0Ljk1NSwzLjA2MmMwLjI0NiwwLjE1LDAuNTE5LDAuMjIzLDAuNzg3LDAuMjIzYzAuNTAzLDAsMC45OTMtMC4yNTIsMS4yNzgtMC43MTENCgkJCUMzMS40NjUsMzAuNjYsMzEuMjQ1LDI5LjczNiwzMC41NCwyOS4zeiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K";
        var water = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik00NDMuODgyLDUuMjhDNDQwLjg0MiwxLjkyLDQzNi41NTQsMCw0MzIuMDEsMGgtMzUyYy00LjUxMiwwLTguODMyLDEuOTItMTEuODcyLDUuMjgNCgkJCWMtMy4wMDgsMy4zMjgtNC41MTIsNy44MDgtNC4wNjQsMTIuMzJsNDgsNDgwYzAuODMyLDguMTkyLDcuNzEyLDE0LjQsMTUuOTM2LDE0LjRoMjU2YzguMjI0LDAsMTUuMTA0LTYuMjA4LDE1LjkwNC0xNC40bDQ4LTQ4MA0KCQkJQzQ0OC4zOTQsMTMuMDg4LDQ0Ni45MjIsOC42MDgsNDQzLjg4Miw1LjI4eiBNNDAxLjI5LDE2Mi40OTZjLTQwLjY3MiwxMy4xNTItOTMuNiwxOS4yMzItMTM1LjEzNi0xNC44NDgNCgkJCWMtNTIuMDY0LTQyLjcyLTExNS44NzItMzUuMzYtMTU5LjEzNi0yMi40OTZMOTcuNzA2LDMyaDMxNi42MDhMNDAxLjI5LDE2Mi40OTZ6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=";
        var exercise = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjEuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNjEuODU4IDYxLjg1OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjEuODU4IDYxLjg1ODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIHN0eWxlPSJmaWxsOiMwMTAwMDI7IiBkPSJNNTAuMDk3LDAuMDE0Yy05LjkxNywwLjg3NC0xNy4yMzUsNS44MjQtMjEuNTAxLDEyLjk4Yy0yLjg1OSwzLjU4NC04LjU3LDE0LjUyNi0xMC42NDcsMjAuMjU0DQoJCQljLTMuNzY2LDcuMTIzLTcuMDUsMTUuNTk4LTkuNjIsMjMuMjM4Yy0xLjU3MSw0LjY3Miw1LjQ4Myw3LjcyLDcuMDYzLDMuMDI3YzEuOTIyLTUuNzE2LDQuMjQ0LTExLjg5Niw2Ljg2OC0xNy42MzENCgkJCWMyLjYwNCw1LjgyOCw1LjI1LDExLjYzNyw4LjA5MSwxNy4zNTRjMi4yMDIsNC40MzgsOC44MjgsMC41NDYsNi42MzQtMy44NzdjLTIuOTI1LTUuODg1LTUuNjQyLTExLjg2NC04LjMxOS0xNy44NjMNCgkJCWMwLjAzNC0wLjExNiwwLjA3Ny0wLjIyOSwwLjExMy0wLjM0NGMwLjQ0NiwwLjEyNywwLjkzOCwwLjE2NiwxLjQ4LDAuMDYzYzQuMDk2LTAuNzY5LDguMTkyLTEuNTM2LDEyLjI5MS0yLjMwNQ0KCQkJYzEuNzUxLTAuMzI5LDIuNDIyLTIuMjQ1LDIuMTQ2LTMuNzc5Yy0wLjgyOC00LjU5Ny0zLjQ0Ny03Ljc5NS02LjcwNy0xMC44MjFjLTAuNDg0LTEuNjQ2LTIuMDk4LTMuMTAyLTMuODg5LTQuNTQ5DQoJCQljMy42MzEtNS44Nyw5LjU1OS05LjA1NiwxNy4yNzUtOS43MzZDNTUuMzEzLDUuNjgsNTQuMDAxLTAuMzI5LDUwLjA5NywwLjAxNHogTTM1LjE3MywyNi4xNDMNCgkJCWMxLjAxMywxLjA1NCwxLjg3NSwyLjE2MywyLjUyNiwzLjQ0N2MtMS45ODIsMC4zNzItMy45NjUsMC43NDMtNS45NDcsMS4xMTVDMzIuNzUyLDI5LjA5NSwzMy45MDMsMjcuNTc1LDM1LjE3MywyNi4xNDN6Ii8+DQoJCTxjaXJjbGUgc3R5bGU9ImZpbGw6IzAxMDAwMjsiIGN4PSI0My42NTMiIGN5PSIxNS42MzUiIHI9IjUuMjc1Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=";
        var breakfast = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjQ1LjY5MnB4IiBoZWlnaHQ9IjQ1LjY5MXB4IiB2aWV3Qm94PSIwIDAgNDUuNjkyIDQ1LjY5MSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDUuNjkyIDQ1LjY5MTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0yOS40MywyNi42NDVjLTAuMzY5LTAuNDI1LTAuOTA2LTAuNzg1LTEuNDctMC43ODVIMTcuNzg5Yy0wLjU2NCwwLTEuMTAxLDAuMzYtMS40NzEsMC43ODUNCgkJCWMtMC4zNjksMC40MjYtMC41MzUsMS4wNDktMC40NTYsMS42MDdsMS43MDEsMTEuOTE3YzAuMTM3LDAuOTU4LDAuOTU3LDEuNjkyLDEuOTI0LDEuNjkyaDYuNzczYzAuOTY3LDAsMS43ODktMC43MDUsMS45MjQtMS42NjQNCgkJCWwxLjcwMS0xMS45NDhDMjkuOTY0LDI3LjY5MSwyOS43OTcsMjcuMDcsMjkuNDMsMjYuNjQ1eiIvPg0KCQk8cGF0aCBkPSJNMTQuMDY2LDMwLjQyOGMtMC42MTgtMC4yNzEtMS4zMzMtMC4yMDUtMS44ODksMC4xNzhsLTQuNTU0LDMuMTQxYy0wLjg4NSwwLjYwOS0xLjEwNiwxLjgyLTAuNDk3LDIuNzAzbDMuOTMxLDUuNzAxDQoJCQljMC41NjgsMC44MjQsMS42NzEsMS4wODIsMi41NDcsMC41OTRsMS43MDEtMC45NDhjMC42OTgtMC4zOSwxLjA4OC0xLjE2OCwwLjk3OS0xLjk2MWwtMS4wNzgtNy44OTINCgkJCUMxNS4xMTcsMzEuMjc1LDE0LjY4NCwzMC43MDEsMTQuMDY2LDMwLjQyOHoiLz4NCgkJPHBhdGggZD0iTTcuNzg0LDM5Ljg1NWMtMC4yMTctMC4yOTEtMC41ODUtMC40MjctMC45MzktMC4zNDZjLTAuMzUzLDAuMDgxLTAuNjI3LDAuMzYxLTAuNjk4LDAuNzE3bC0wLjg3OCw0LjM2MQ0KCQkJYy0wLjA3MiwwLjM1NywwLjA3NCwwLjcyMywwLjM3LDAuOTM0YzAuMjk5LDAuMjExLDAuNjksMC4yMjcsMS4wMDQsMC4wNDFsMi44Ny0xLjcwN2MwLjIyNS0wLjEzMywwLjM4My0wLjM1NSwwLjQzNC0wLjYxMQ0KCQkJYzAuMDUyLTAuMjU4LTAuMDA5LTAuNTIzLTAuMTY2LTAuNzMyTDcuNzg0LDM5Ljg1NXoiLz4NCgkJPHBhdGggZD0iTTM4LjA2NywzMy43NDZsLTQuNTU1LTMuMTQxYy0wLjU1Ny0wLjM4My0xLjI3MS0wLjQ1MS0xLjg5LTAuMTc4Yy0wLjYxNywwLjI3MS0xLjA0OSwwLjg0OC0xLjE0MiwxLjUxNmwtMS4wNzcsNy44OTINCgkJCWMtMC4xMDgsMC43OTMsMC4yOCwxLjU3MSwwLjk3OSwxLjk2MWwxLjcsMC45NDhjMC44NzYsMC40ODgsMS45NzksMC4yMywyLjU0Ny0wLjU5NGwzLjkzMS01LjcwMQ0KCQkJQzM5LjE3MiwzNS41NjYsMzguOTUsMzQuMzU1LDM4LjA2NywzMy43NDZ6Ii8+DQoJCTxwYXRoIGQ9Ik00MC40MjIsNDQuNTg3bC0wLjg3OC00LjM2Yy0wLjA3MS0wLjM1Ny0wLjM0NS0wLjYzNy0wLjY5OC0wLjcxOHMtMC43MjMsMC4wNTYtMC45MzgsMC4zNDVsLTEuOTk2LDIuNjU1DQoJCQljLTAuMTU2LDAuMjA5LTAuMjE4LDAuNDc2LTAuMTY2LDAuNzMxYzAuMDUxLDAuMjU3LDAuMjA5LDAuNDc5LDAuNDM1LDAuNjEzbDIuODY5LDEuNzA3YzAuMzEzLDAuMTg2LDAuNzA1LDAuMTcsMS4wMDQtMC4wNDENCgkJCUM0MC4zNSw0NS4zMTEsNDAuNDk1LDQ0Ljk0Myw0MC40MjIsNDQuNTg3eiIvPg0KCQk8cGF0aCBkPSJNMjMuMDE4LDIzLjk0NWMxLjQzMywwLDEzLjk4OC0wLjEyMywxMy45ODgtNC40MWMwLTEuOTEtMi40OTUtMi45OTMtNS4zODktMy42MDZjMC4xMTItMC4xODUsMC4yMTgtMC4zNzYsMC4zMTctMC41Nw0KCQkJbDEuOTg1LTAuMTc4YzEuNTkzLTAuMDM4LDIuOTIxLTEuMjM2LDMuMDk5LTIuNzk5bDAuMzk4LTMuNDAyYzAuMTAyLTAuODgxLTAuMTU2LTEuNjA0LTAuNzktMi4zMTQNCgkJCWMtMC43MjgtMC44MTMtMS43MjYtMC43NjgtMi4zODctMC43NjhoLTAuOTA3bDAuMTk1LTIuNzk2YzAuMDAyLTAuMDE0LDAuMDAyLTAuMDU2LDAuMDAzLTAuMDY5DQoJCQljMC4wMDEtMC4wMjMsMC4wMDMtMC4wNjIsMC4wMDMtMC4wODVDMzMuNTM0LDEuMzI0LDI4LjgyNSwwLDIzLjAxNywwUzEyLjUwMiwxLjMxNCwxMi41MDIsMi45MzljMCwwLjAyNCwwLDAuMDQ2LDAuMDAzLDAuMDY5DQoJCQljMCwwLjAxNCwwLDAuMDI2LDAuMDAyLDAuMDM5bDAuNjMyLDguODQ0YzAuMTA0LDEuNDc2LDAuNTYsMi44NDgsMS4yNzgsNC4wMzljLTIuODkxLDAuNjE0LTUuMzg4LDEuNjk3LTUuMzg4LDMuNjA2DQoJCQlDOS4wMywyMy44MjIsMjEuNTg2LDIzLjk0NSwyMy4wMTgsMjMuOTQ1eiBNMzIuODk3LDEyLjAwN0wzMy4yLDcuOTA2aDEuMzMzYzAuODMyLDAsMS4wODYsMC44MTEsMS4wNTMsMS4xMDNsLTAuNDExLDMuMjg3DQoJCQljLTAuMDc4LDAuNjY3LTAuNjAyLDAuOTQ1LTEuMjk2LDAuOTczYy0wLjI5OCwwLjAxMi0xLjE5LDAuMDgyLTEuMTksMC4wODJDMzIuODExLDEyLjg0OSwzMi44NTgsMTIuNTQxLDMyLjg5NywxMi4wMDd6DQoJCQkgTTIzLjAxOCwyLjE0YzMuODA4LDAsNi44OTQsMC42NDYsNi44OTQsMS40NDRjMCwwLjgtMy4wODYsMS40NDYtNi44OTQsMS40NDZjLTMuODA2LDAtNi44OTQtMC42NDYtNi44OTQtMS40NDYNCgkJCUMxNi4xMjQsMi43ODcsMTkuMjExLDIuMTQsMjMuMDE4LDIuMTR6IE0xNi4yNDIsMTcuODg1YzEuNTk2LDEuMzg0LDMuNjc2LDIuMDA5LDUuOTM4LDIuMDA5aDEuNjc1DQoJCQljMi4yNjQsMCw0LjM0NC0wLjYyNSw1LjkzOS0yLjAwOWMyLjUxLDAuNDExLDQuMTIyLDEuMSw0LjY0NSwxLjU0N2MtMC44OTksMC43NzEtNS4wMzQsMi4wMDMtMTEuNDIsMi4wMDMNCgkJCWMtNi4zODQsMC0xMC41MjEtMS4yNTItMTEuNDE4LTIuMDI0QzEyLjExOSwxOC45NjMsMTMuNzMsMTguMjk2LDE2LjI0MiwxNy44ODV6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=";
        var work = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9Ijc3OS4xMXB4IiBoZWlnaHQ9Ijc3OS4xMXB4IiB2aWV3Qm94PSIwIDAgNzc5LjExIDc3OS4xMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzc5LjExIDc3OS4xMTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik02NjIuOTE0LDYzMi4zNTFINTMwLjA3SDI1NC40NzRjLTExLjQ5LDAtMjAuODA2LDkuMzE1LTIwLjgwNiwyMC44MDZ2MTIuODA1YzAsMTEuNDksOS4zMTUsMjAuODEsMjAuODA2LDIwLjgxaDI3NS41OTgNCgkJCWgxMzIuODQ0aDY4Ljgydi01NC40MThMNjYyLjkxNCw2MzIuMzUxTDY2Mi45MTQsNjMyLjM1MXoiLz4NCgkJPGNpcmNsZSBjeD0iMjExLjE4NyIgY3k9IjE4OS42MjUiIHI9IjExNS4xOSIvPg0KCQk8cGF0aCBkPSJNNDkyLjIzNCw0NzIuMTQ3bC0yNjMuOTY5LTAuMTQ2bC02LjI1LTAuMDJ2LTMwLjYzMmwtMC4yMTctMjUuNjRjMC02MS4yNDUtNDkuNjUxLTExMC44OTgtMTEwLjg5OS0xMTAuODk4DQoJCQljLTIuMDc1LDAtNC4xMzYsMC4wNy02LjE4NCwwLjE4MmwtMC4xNTYtMC4xODJDNDYuODEzLDMwNC44MTMsMCwzNTEuNjI1LDAsNDA5LjM3MnYyOTUuMzAzaDIyMi4wMTVWNTc4Ljg3NmwtMi45MzctMC4yMzENCgkJCWMtMC4yMDktMC4wMTktMC4yNjEsMC4wMDItMC4zOTEsMC4wMDJjLTE1LjAyMSwwLTI5LjQxNy02LjMyNC0zOS41NjItMTcuMzk5bC05MC4xMTItOTguMzYzDQoJCQljLTIuODczLTMuMTM1LTIuNjYtOC4wMDMsMC40NzYtMTAuODc0YzMuMTMzLTIuODczLDguMDAzLTIuNjU5LDEwLjg3NCwwLjQ3Nmw5MC4xMTEsOTguMzYyDQoJCQljNy4zMjIsNy45OTMsMTcuNjQ4LDEyLjg4MSwyOC41MjEsMTMuMDM5YzAuNzIzLDAuMDEsMTAuNTk0LDAuMTUyLDEwLjU5NCwwLjE1MmgyNjIuNjQ1YzI1LjM3NSwwLDQ1Ljk0Ny0yMC41NzEsNDUuOTQ3LTQ1Ljk0Nw0KCQkJQzUzOC4xODIsNDkyLjcxNyw1MTcuNjA5LDQ3Mi4xNDcsNDkyLjIzNCw0NzIuMTQ3eiIvPg0KCQk8cGF0aCBkPSJNNzY1LjE5NywzMDkuMTExYy0xMC43NDQtMy42ODEtMjIuNDM5LDIuMDQ5LTI2LjEyMywxMi43OTRsLTg3LjIwOSwyNTQuNTlIMzM5LjgwM2MtMTEuMzU2LDAtMjAuNTY3LDkuMjA2LTIwLjU2NywyMC41NjQNCgkJCXM5LjIxMSwyMC41NjYsMjAuNTY3LDIwLjU2NmgzMjYuNTA3YzYuOTk0LDAsMTMuMTY4LTMuNTAzLDE2Ljg3OS04Ljg0MWMxLjI4My0xLjY5NCwyLjMzLTMuNjA3LDMuMDU5LTUuNzI5TDc3OCwzMzUuMjI1DQoJCQlDNzgxLjY3LDMyNC40ODYsNzc1Ljk0NywzMTIuNzksNzY1LjE5NywzMDkuMTExeiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K";
        var car = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjEuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNjEyLjAwMSA2MTIuMDAxIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2MTIuMDAxIDYxMi4wMDE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik01ODkuMzMzLDI3Ni4wMzNjLTExLjIzNC0zLjc1Ni04OS4zNzgtMjAuODM0LTg5LjM3OC0yMC44MzRzLTE0NC44Ni04Mi4zNzUtMTYyLjI0NS04Mi4zNzVzLTEzNi42MzksMC4wNTMtMTM2LjYzOSwwLjA1Mw0KCQljLTI5LjEzNywwLTUzLjQ4NywyMi4yMDMtODEuNjgsNDcuOTA5Yy0xMy4yODcsMTIuMTEyLTI3Ljk1MywyNS40NDItNDQuMTMsMzcuMjk5bC02MC4yNDksOC4wMTENCgkJQzYuMzA2LDI2OC44NzIsMCwyNzcuMDE4LDAsMjg2LjY0M3Y2OS4wM2MwLDExLjkxMyw5LjY1NiwyMS41NzEsMjEuNTcsMjEuNTcxaDQxLjQwMWMzLjAwNywzNC42NSwzMi4xNTMsNjEuOTMyLDY3LjU3LDYxLjkzMg0KCQljMzUuNDE1LDAsNjQuNTYzLTI3LjI4Myw2Ny41Ny02MS45MzFoMTk3LjY4N2MzLjAwNywzNC42NSwzMi4xNTMsNjEuOTMxLDY3LjU3LDYxLjkzMXM2NC41NjMtMjcuMjgzLDY3LjU3LTYxLjkzMWgzNC4wMTMNCgkJYzI2Ljk1LDAsNDAuMTE5LTExLjY0LDQzLjQyNi0yMi41NjZDNjE2LjczOSwzMjcuMDMsNjEwLjcyNCwyODMuMTg1LDU4OS4zMzMsMjc2LjAzM3ogTTEzMC41NDEsNDA2LjQ4DQoJCWMtMTkuMzgsMC0zNS4xNDgtMTUuNzY2LTM1LjE0OC0zNS4xNDZzMTUuNzY2LTM1LjE0OCwzNS4xNDgtMzUuMTQ4YzE5LjM4LDAsMzUuMTQ2LDE1Ljc2NiwzNS4xNDYsMzUuMTQ4DQoJCUMxNjUuNjg4LDM5MC43MTQsMTQ5LjkyMSw0MDYuNDgsMTMwLjU0MSw0MDYuNDh6IE0yNjEuMDA4LDI1NS4yMDFIMTQzLjEzNGM4LjUyNi02LjczNiwxNi40MDktMTMuODg2LDIzLjY3MS0yMC41MDUNCgkJYzE5LjA4Ni0xNy40MDIsMzUuNTctMzIuNDMyLDU1LjI5NC0zMi40MzJjMCwwLDE3Ljg1LTAuMDA4LDM4LjkxLTAuMDE3VjI1NS4yMDF6IE0yODkuNzExLDIwMi4yMzYNCgkJYzE0LjU4OC0wLjAwNSwyNy41OTItMC4wMDksMzQuMTE2LTAuMDA5YzE2LjI0NSwwLDgyLjEzNSwzOC4yNjQsMTA2Ljg2NCw1Mi45NzVoLTE0MC45OEwyODkuNzExLDIwMi4yMzZMMjg5LjcxMSwyMDIuMjM2eg0KCQkgTTQ2My4zNjcsNDA2LjQ4Yy0xOS4zOCwwLTM1LjE0Ni0xNS43NjYtMzUuMTQ2LTM1LjE0NnMxNS43NjYtMzUuMTQ4LDM1LjE0Ni0zNS4xNDhjMTkuMzgsMCwzNS4xNDgsMTUuNzY2LDM1LjE0OCwzNS4xNDgNCgkJQzQ5OC41MTUsMzkwLjcxNCw0ODIuNzQ3LDQwNi40OCw0NjMuMzY3LDQwNi40OHoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K";
        var coffee = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMS45OTkgNTExLjk5OSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTExLjk5OSA1MTEuOTk5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggZD0iTTE3OS4zNjEsOTkuOTAzYy0xMS40MS0xMS40MS0xNi40NTQtMTcuMDA1LTE2LjQ1Mi0zMC4wODljLTAuMDAyLTEzLjA3OSw1LjA0NC0xOC42NzQsMTYuNDU3LTMwLjA4OQ0KCQkJYzkuMDg5LTkuMDg3LDkuMDg5LTIzLjgyLDAuMDAyLTMyLjkwOWMtOS4wODctOS4wOS0yMy44MjUtOS4wODctMzIuOTE0LTAuMDAyYy0xMi42OTksMTIuNjk4LTMwLjA5NSwzMC4wOS0zMC4wOSw2Mi45OTkNCgkJCWMtMC4wMDUsMzIuOTE0LDE3LjM4OCw1MC4zMDUsMzAuMDg5LDYzLjAwMWMxMS40MTEsMTEuNDEzLDE2LjQ1NywxNy4wMTEsMTYuNDU3LDMwLjA5MmMwLDEyLjg1NCwxMC40MiwyMy4yNzMsMjMuMjczLDIzLjI3Mw0KCQkJczIzLjI3My0xMC40MTgsMjMuMjczLTIzLjI3M0MyMDkuNDU0LDEyOS45OTMsMTkyLjA2MiwxMTIuNjAxLDE3OS4zNjEsOTkuOTAzeiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNMjg3Ljk2Nyw5OS45MDNjLTExLjQxLTExLjQxLTE2LjQ1NC0xNy4wMDUtMTYuNDUyLTMwLjA4OWMtMC4wMDItMTMuMDc5LDUuMDQ0LTE4LjY3NCwxNi40NTctMzAuMDg5DQoJCQljOS4wODktOS4wODcsOS4wODktMjMuODIsMC4wMDItMzIuOTA5Yy05LjA4Ny05LjA5LTIzLjgyNS05LjA4Ny0zMi45MTQtMC4wMDJjLTEyLjY5OSwxMi42OTgtMzAuMDk1LDMwLjA5Mi0zMC4wOSw2Mi45OTkNCgkJCWMtMC4wMDUsMzIuOTE0LDE3LjM4OCw1MC4zMDUsMzAuMDg5LDYzLjAwMWMxMS40MTEsMTEuNDEzLDE2LjQ1NywxNy4wMTEsMTYuNDU3LDMwLjA5MmMwLDEyLjg1NCwxMC40MiwyMy4yNzMsMjMuMjczLDIzLjI3Mw0KCQkJczIzLjI3My0xMC40MTgsMjMuMjczLTIzLjI3M0MzMTguMDYxLDEyOS45OTMsMzAwLjY2OCwxMTIuNjAxLDI4Ny45NjcsOTkuOTAzeiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNMzgxLjQwMSw0MDMuMzkzaDIxLjk5M2MwLjAyMiwwLDAuMDM5LTAuMDAzLDAuMDYxLTAuMDAzYzQ3LjAyMy0wLjAzMSw4NS4yNzMtMzguMjk4LDg1LjI3My04NS4zMzENCgkJCWMwLTQ3LjA1My0zOC4yODEtODUuMzM0LTg1LjMzNC04NS4zMzRoLTMxLjAzSDYyLjA2Yy0xMi44NTMsMC0yMy4yNzMsMTAuNDIyLTIzLjI3MywyMy4yNzN2NzcuNTc2DQoJCQljMCw1Mi4xOTMsMjIuNTI4LDk5LjIyMSw1OC4zNywxMzEuODc5SDQ2LjU0NWMtMTIuODUzLDAtMjMuMjczLDEwLjQxOC0yMy4yNzMsMjMuMjczYzAsMTIuODUxLDEwLjQyLDIzLjI3MywyMy4yNzMsMjMuMjczDQoJCQloMTcwLjY2N2gxNzAuNjY3YzEyLjg1MywwLDIzLjI3My0xMC40MjIsMjMuMjczLTIzLjI3M2MwLTEyLjg1NC0xMC40Mi0yMy4yNzMtMjMuMjczLTIzLjI3M2gtNTAuNjEyDQoJCQlDMzU2LjEwNCw0NDguMjg5LDM3MS4yNTcsNDI3LjE1OCwzODEuNDAxLDQwMy4zOTN6IE0zOTUuNjM3LDMzMy41NzV2LTU0LjMwM2g3Ljc1OGMyMS4zODgsMCwzOC43ODgsMTcuNCwzOC43ODgsMzguNzg4DQoJCQlzLTE3LjQsMzguNzg4LTM4Ljc4OCwzOC43ODhjLTAuMDExLDAtMC4wMiwwLTAuMDMxLDBoLTkuMjQ1QzM5NS4xMTUsMzQ5LjIyOSwzOTUuNjM3LDM0MS40NjEsMzk1LjYzNywzMzMuNTc1eiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K";
        var dinner = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNMjY0LjE4MSw3Ni45MDljLTkzLjY0NiwwLTE2OS41NjEsNzUuOTE1LTE2OS41NjEsMTY5LjU2MXM3NS45MTUsMTY5LjU2MSwxNjkuNTYxLDE2OS41NjENCgkJCXMxNjkuNTYxLTc1LjkxNSwxNjkuNTYxLTE2OS41NjFTMzU3LjgyNyw3Ni45MDksMjY0LjE4MSw3Ni45MDl6IE0yNjQuMTgsMzc1LjEyOWMtNzAuOTQyLDAtMTI4LjY1OC01Ny43MTYtMTI4LjY1OC0xMjguNjU4DQoJCQlzNTcuNzE2LTEyOC42NTgsMTI4LjY1OC0xMjguNjU4czEyOC42NTgsNTcuNzE2LDEyOC42NTgsMTI4LjY1OFMzMzUuMTIzLDM3NS4xMjksMjY0LjE4LDM3NS4xMjl6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0yNjQuMTgsMTUyLjI5OWMtNTEuOTI2LDAtOTQuMTcxLDQyLjI0NS05NC4xNzEsOTQuMTcxYzAsNTEuOTI2LDQyLjI0NSw5NC4xNzEsOTQuMTcxLDk0LjE3MQ0KCQkJYzUxLjkyNiwwLDk0LjE3MS00Mi4yNDUsOTQuMTcxLTk0LjE3MVMzMTYuMTA3LDE1Mi4yOTksMjY0LjE4LDE1Mi4yOTl6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik01MDEuMzE1LDI2MC42ODdWNTQuNjRjMC0xLjk4OC0xLjI2OS0zLjc1NS0zLjE1NS00LjM5Yy0xLjg4NC0wLjYzNC0zLjk2MywwLjAwNy01LjE2NiwxLjU5MQ0KCQkJYy0yNS43MDgsMzMuOTAzLTM5LjYyMiw3NS4yODMtMzkuNjIyLDExNy44M3Y3NS4zNzhjMCw4LjY0NSw3LjAwOCwxNS42NTQsMTUuNjU0LDE1LjY1NGg2LjUyNg0KCQkJYy02LjQzMyw2Ni40NDMtMTAuNjg0LDE1OS4zNy0xMC42ODQsMTcwLjI1MWMwLDE3LjE0MiwxMC41NTEsMzEuMDM4LDIzLjU2NiwzMS4wMzhjMTMuMDE1LDAsMjMuNTY2LTEzLjg5NywyMy41NjYtMzEuMDM4DQoJCQlDNTEyLDQyMC4wNzIsNTA3Ljc0OSwzMjcuMTMsNTAxLjMxNSwyNjAuNjg3eiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNNjguNDE3LDIxOS44NDNjMTMuMDQyLTcuOSwyMS43NTktMjIuMjI0LDIxLjc1OS0zOC41ODZsLTYuNDYtMTA1LjYyMWMtMC4yNDctNC4wMjYtMy41ODQtNy4xNjUtNy42MTgtNy4xNjUNCgkJCWMtNC4zNjMsMC03LjgzOSwzLjY1NS03LjYyMiw4LjAxbDQuMjAxLDg0LjcwOWMwLDQuNzYyLTMuODYxLDguNjIxLTguNjIxLDguNjIxYy00Ljc2MSwwLTguNjIxLTMuODYxLTguNjIxLTguNjIxbC0yLjA5OS04NC42NzQNCgkJCWMtMC4xMTEtNC40NzUtMy43Ny04LjA0NC04LjI0Ny04LjA0NGMtNC40NzcsMC04LjEzNSwzLjU3LTguMjQ3LDguMDQ0bC0yLjA5OSw4NC42NzRjMCw0Ljc2Mi0zLjg2MSw4LjYyMS04LjYyMSw4LjYyMQ0KCQkJYy00Ljc2MSwwLTguNjIxLTMuODYxLTguNjIxLTguNjIxbDQuMjAxLTg0LjcwOWMwLjIxNi00LjM1Ny0zLjI2Mi04LjAxLTcuNjIyLTguMDFjLTQuMDM0LDAtNy4zNzEsMy4xMzktNy42MTcsNy4xNjVMMCwxODEuMjU4DQoJCQljMCwxNi4zNjIsOC43MTYsMzAuNjg1LDIxLjc1OSwzOC41ODZjOC40ODgsNS4xNDEsMTMuMjIsMTQuNzUzLDEyLjEyNiwyNC42MTdjLTcuMzYzLDY2LjM1OC0xMi4zNjMsMTc0LjY5My0xMi4zNjMsMTg2LjQ5NA0KCQkJYzAsMTcuMTQyLDEwLjU1MSwzMS4wMzgsMjMuNTY2LDMxLjAzOGMxMy4wMTUsMCwyMy41NjYtMTMuODk3LDIzLjU2Ni0zMS4wMzhjMC0xMS44MDEtNS4wMDEtMTIwLjEzNi0xMi4zNjMtMTg2LjQ5NA0KCQkJQzU1LjE5NiwyMzQuNjAyLDU5LjkzMywyMjQuOTgyLDY4LjQxNywyMTkuODQzeiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K";
        var book = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDI5Ni45OTkgMjk2Ljk5OSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjk2Ljk5OSAyOTYuOTk5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBkPSJNNDUuNDMyLDM1LjA0OWMtMC4wMDgsMC0wLjAxNywwLTAuMDI1LDBjLTIuODA5LDAtNS40NTEsMS4wOTUtNy40NDYsMy4wODVjLTIuMDE3LDIuMDEyLTMuMTI4LDQuNjkxLTMuMTI4LDcuNTQzDQoJCQkJdjE1OS4zNjVjMCw1Ljg0NCw0Ljc3MywxMC42MSwxMC42NDEsMTAuNjI1YzI0LjczOCwwLjA1OSw2Ni4xODQsNS4yMTUsOTQuNzc2LDM1LjEzNlY4NC4wMjNjMC0xLjk4MS0wLjUwNi0zLjg0Mi0xLjQ2MS01LjM4Mg0KCQkJCUMxMTUuMzIyLDQwLjg0OSw3MC4yMjYsMzUuMTA3LDQ1LjQzMiwzNS4wNDl6Ii8+DQoJCQk8cGF0aCBkPSJNMjYyLjE2NywyMDUuMDQyVjQ1LjY3NmMwLTIuODUyLTEuMTExLTUuNTMxLTMuMTI4LTcuNTQzYy0xLjk5NS0xLjk5LTQuNjM5LTMuMDg1LTcuNDQ1LTMuMDg1Yy0wLjAwOSwwLTAuMDE4LDAtMC4wMjYsMA0KCQkJCWMtMjQuNzkzLDAuMDU5LTY5Ljg4OSw1LjgwMS05My4zNTcsNDMuNTkzYy0wLjk1NSwxLjU0LTEuNDYsMy40MDEtMS40Niw1LjM4MnYxNjYuNzc5DQoJCQkJYzI4LjU5Mi0yOS45MjEsNzAuMDM4LTM1LjA3Nyw5NC43NzYtMzUuMTM2QzI1Ny4zOTQsMjE1LjY1MSwyNjIuMTY3LDIxMC44ODUsMjYyLjE2NywyMDUuMDQyeiIvPg0KCQkJPHBhdGggZD0iTTI4Ni4zNzMsNzEuODAxaC03LjcwNnYxMzMuMjQxYzAsMTQuOTIxLTEyLjE1NywyNy4wODgtMjcuMTAxLDI3LjEyNWMtMjAuOTgzLDAuMDUtNTUuNTgxLDQuMTUzLTgwLjA4NCwyNy4zNDQNCgkJCQljNDIuMzc4LTEwLjM3Niw4Ny4wNTItMy42MzEsMTEyLjUxMiwyLjE3MWMzLjE3OSwwLjcyNCw2LjQ2NC0wLjAyNCw5LjAxMS0yLjA1NGMyLjUzOC0yLjAyNSwzLjk5NC01LjA1MiwzLjk5NC04LjMwMVY4Mi40MjcNCgkJCQlDMjk3LDc2LjU2OCwyOTIuMjMyLDcxLjgwMSwyODYuMzczLDcxLjgwMXoiLz4NCgkJCTxwYXRoIGQ9Ik0xOC4zMzIsMjA1LjA0MlY3MS44MDFoLTcuNzA2QzQuNzY4LDcxLjgwMSwwLDc2LjU2OCwwLDgyLjQyN3YxNjguODk3YzAsMy4yNSwxLjQ1Niw2LjI3NiwzLjk5NCw4LjMwMQ0KCQkJCWMyLjU0NSwyLjAyOSw1LjgyNywyLjc4LDkuMDExLDIuMDU0YzI1LjQ2LTUuODAzLDcwLjEzNS0xMi41NDcsMTEyLjUxMS0yLjE3MWMtMjQuNTAyLTIzLjE5LTU5LjEtMjcuMjkyLTgwLjA4My0yNy4zNDINCgkJCQlDMzAuNDksMjMyLjEzLDE4LjMzMiwyMTkuOTYzLDE4LjMzMiwyMDUuMDQyeiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=";
        var home = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE4LjEuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMjcuMDIgMjcuMDIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI3LjAyIDI3LjAyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojMDMwMTA0OyIgZD0iTTMuNjc0LDI0Ljg3NmMwLDAtMC4wMjQsMC42MDQsMC41NjYsMC42MDRjMC43MzQsMCw2LjgxMS0wLjAwOCw2LjgxMS0wLjAwOGwwLjAxLTUuNTgxDQoJCWMwLDAtMC4wOTYtMC45MiwwLjc5Ny0wLjkyaDIuODI2YzEuMDU2LDAsMC45OTEsMC45MiwwLjk5MSwwLjkybC0wLjAxMiw1LjU2M2MwLDAsNS43NjIsMCw2LjY2NywwDQoJCWMwLjc0OSwwLDAuNzE1LTAuNzUyLDAuNzE1LTAuNzUyVjE0LjQxM2wtOS4zOTYtOC4zNThsLTkuOTc1LDguMzU4QzMuNjc0LDE0LjQxMywzLjY3NCwyNC44NzYsMy42NzQsMjQuODc2eiIvPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiMwMzAxMDQ7IiBkPSJNMCwxMy42MzVjMCwwLDAuODQ3LDEuNTYxLDIuNjk0LDBsMTEuMDM4LTkuMzM4bDEwLjM0OSw5LjI4YzIuMTM4LDEuNTQyLDIuOTM5LDAsMi45MzksMA0KCQlMMTMuNzMyLDEuNTRMMCwxMy42MzV6Ii8+DQoJPHBvbHlnb24gc3R5bGU9ImZpbGw6IzAzMDEwNDsiIHBvaW50cz0iMjMuODMsNC4yNzUgMjEuMTY4LDQuMjc1IDIxLjE3OSw3LjUwMyAyMy44Myw5Ljc1MiAJIi8+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==";
        var beer = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjIwLjQ5NXB4IiBoZWlnaHQ9IjIwLjQ5NXB4IiB2aWV3Qm94PSIwIDAgMjAuNDk1IDIwLjQ5NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAuNDk1IDIwLjQ5NTsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xNi4xOTcsOC41NWgtMC45MTFjLTAuMTg4LDAtMC4zNywwLjAxOS0wLjU0OCwwLjA1MlY2LjU0NWMwLTAuMTEyLTAuMDEzLTAuMjIxLTAuMDMzLTAuMzI3DQoJCQljMC41OTktMC40NDMsMC45OTEtMS4xNDgsMC45OTEtMS45NDhjMC0xLjQ5LTEuMzcyLTIuNjg1LTIuODgzLTIuMzg2Yy0wLjUtMC41MjYtMS4yMTMtMC44MjMtMS45NDYtMC43ODYNCgkJCUMxMC4zOTksMC40Miw5LjYyLDAsOC43ODksMEM4LjExNCwwLDcuNDc2LDAuMjY4LDcuMDA2LDAuNzM0QzYuODgxLDAuNjgzLDYuNzUzLDAuNjQyLDYuNjIzLDAuNjEyTDYuNDU5LDAuNTgNCgkJCUM2LjMzMywwLjU2LDYuMjA3LDAuNTQ5LDYuMDc4LDAuNTQ3Yy0wLjE4OS0wLjAxNS0wLjM3MS0wLjAxNC0wLjU1LDAuMDAxSDUuNDc5djAuMDA0QzQuNDA1LDAuNjYsMy41LDEuMjk2LDMuMTQ1LDIuMTgzDQoJCQlDMi4wOSwyLjM4MywxLjI5LDMuMzEyLDEuMjksNC40MjJjMCwwLjc3NSwwLjM5LDEuNDU4LDAuOTgyLDEuODdDMi4yNiw2LjM3NSwyLjI0Nyw2LjQ1OCwyLjI0Nyw2LjU0NXYxMi4zMDkNCgkJCWMwLDAuOTA1LDAuNzM2LDEuNjQyLDEuNjQxLDEuNjQyaDkuMjA4YzAuOTA1LDAsMS42NDItMC43MzYsMS42NDItMS42NDJWMTYuMzRjMC4xNzgsMC4wMzMsMC4zNiwwLjA1MywwLjU0OCwwLjA1M2gwLjkxMQ0KCQkJYzEuNjU5LDAsMy4wMDktMS4zNTEsMy4wMDktMy4wMXYtMS44MjJDMTkuMjA2LDkuOTAxLDE3Ljg1Niw4LjU1LDE2LjE5Nyw4LjU1eiBNMTMuNjQzLDE4Ljg1NGMwLDAuMzAyLTAuMjQ0LDAuNTQ3LTAuNTQ3LDAuNTQ3DQoJCQlIMy44ODhjLTAuMzAyLDAtMC41NDctMC4yNDUtMC41NDctMC41NDdWNi41NDVjMC0wLjMwMiwwLjI0NS0wLjU0NywwLjU0Ny0wLjU0N2g5LjIwOGMwLjMwMywwLDAuNTQ3LDAuMjQ1LDAuNTQ3LDAuNTQ3VjE4Ljg1NHoNCgkJCSBNMTQuMTMsNS4yOEwxNC4xMyw1LjI4Yy0wLjI4Mi0wLjIzMi0wLjY0LTAuMzc3LTEuMDM0LTAuMzc3SDMuODg4Yy0wLjQxNywwLTAuNzkzLDAuMTYxLTEuMDgzLDAuNDE3DQoJCQlDMi41NDksNS4xMDMsMi4zODQsNC43ODMsMi4zODQsNC40MjJjMC0wLjY1MSwwLjUyOS0xLjE4MiwxLjE4MS0xLjE4NGwwLjQ0OC0wLjAwMkw0LjEsMi43OTdDNC4yMDIsMi4yODMsNC43MzUsMS43NCw1LjU1MiwxLjY0NQ0KCQkJaDAuNjAzYzAuMjQ1LDAuMDE3LDAuNDgxLDAuMDk3LDAuNjg5LDAuMjM0bDAuNDUyLDAuMjk5bDAuMzAzLTAuNDQ5QzcuODY3LDEuMzMyLDguMzEyLDEuMDk0LDguNzksMS4wOTQNCgkJCWMwLjU1NiwwLDEuMDUsMC4zMTUsMS4yOTIsMC44MjNsMC4xODQsMC4zODdsMC40Mi0wLjA4NmMwLjU3MS0wLjExNSwxLjE1NCwwLjEyNCwxLjQ3OCwwLjU5N2wwLjIzOSwwLjM1MmwwLjQtMC4xNDcNCgkJCWMwLjE2MS0wLjA1OSwwLjMxMi0wLjA4OCwwLjQ2MS0wLjA4OGMwLjczNywwLDEuMzM4LDAuNiwxLjMzOCwxLjMzOEMxNC42MDIsNC42NzUsMTQuNDE2LDUuMDM1LDE0LjEzLDUuMjh6IE0xNy41NjUsMTMuMzgzDQoJCQljMCwwLjc1NC0wLjYxMywxLjM2OC0xLjM2OCwxLjM2OGgtMC45MTFjLTAuMTk1LDAtMC4zOC0wLjA0Mi0wLjU0OC0wLjExNnYtNC4zMjZjMC4xNjgtMC4wNzQsMC4zNTMtMC4xMTYsMC41NDgtMC4xMTZoMC45MTENCgkJCWMwLjc1NCwwLDEuMzY4LDAuNjEzLDEuMzY4LDEuMzY4VjEzLjM4M3oiLz4NCgkJPHJlY3QgeD0iMy44ODgiIHk9IjguMDAzIiB3aWR0aD0iOS4yMSIgaGVpZ2h0PSIxMC44NTEiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==";
        var dance = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE2LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjI0OC45MTRweCIgaGVpZ2h0PSIyNDguOTE0cHgiIHZpZXdCb3g9IjAgMCAyNDguOTE0IDI0OC45MTQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0OC45MTQgMjQ4LjkxNDsiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0yMDEuNzExLDQ5LjU4M2MtNS40NiwwLTkuODk1LDMuNzcxLTkuODk1LDguNDE5YzAsNC42NTMsNC40MzUsOC40MTksOS44OTUsOC40MTljNS4zMTYsMCw5LjY0My0zLjU2Niw5Ljg3Ni04LjAzMg0KCQkJYzUuMTA1LTEzLjYsNC4xMDYtMjQuMDc4LDMuMDQzLTI5LjEzN2MtMC43NDctMy41MzMtNC4yLTYuMjk1LTcuODUxLTYuMjk1bC0yMy4yNy0wLjAxYy0xLjg1NywwLTMuNTk0LDAuNzI0LTQuOSwyLjAzDQoJCQljLTEuMzgyLDEuMzkxLTIuMTM4LDMuMjc2LTIuMTI5LDUuMzJjMC4wMzgsNS42OTktMS4yMjMsMTMuMzA2LTIuMzA1LDE4Ljc3NmMtMC45MDYtMC4yMzMtMS44NzctMC4zNjQtMi44ODUtMC4zNjQNCgkJCWMtNS40NjEsMC05Ljg5NSwzLjc3MS05Ljg5NSw4LjQyNGMwLDQuNjQ4LDQuNDM4LDguNDE5LDkuODk1LDguNDE5YzUuMDU1LDAsOS4yMTMtMy4yMiw5LjgxOS03LjM3OGwwLjA3NSwwLjAxOQ0KCQkJYzAuMTYzLTAuNjUzLDMuODI2LTE1LjUyMyw0LjA3OS0yNi40NTNsMjAuODk4LDAuMDA5YzAuNjY4LDMuNjE3LDEuMTExLDkuOTgzLTEuMTI0LDE4LjMyMw0KCQkJQzIwMy45ODgsNDkuNzY1LDIwMi44NzgsNDkuNTgzLDIwMS43MTEsNDkuNTgzeiIvPg0KCQk8cGF0aCBkPSJNMzUuODY0LDEzNy44MzJjMi4wMjEsNC4xOTEsNy42NDksNS42NjEsMTIuNTY4LDMuMjk1YzQuNzkzLTIuMzAxLDcuMTQxLTcuMzkzLDUuNDE0LTExLjUxOQ0KCQkJYy0xLjMtMTQuNDcyLTYuNzQ0LTIzLjQ3NS05Ljg5Ni0yNy41NzdjLTIuMjA4LTIuODUyLTYuNTE1LTMuODUxLTkuODA4LTIuMjY0bC0yMC45NjksMTAuMDg1DQoJCQljLTEuNjczLDAuODAzLTIuOTI2LDIuMjA4LTMuNTMzLDMuOTU4Yy0wLjY0NCwxLjg0OS0wLjUwMSwzLjg4MywwLjM5Miw1LjcxN2MyLjUwNCw1LjEyLDQuNjY5LDEyLjUyMiw2LjA2LDE3LjkyMQ0KCQkJYy0wLjkyMSwwLjE4My0xLjg1MSwwLjQ4NS0yLjc1MywwLjkyNWMtNC45MTcsMi4zNjYtNy4yNzMsNy42ODctNS4yNTUsMTEuODc3YzIuMDIxLDQuMTkxLDcuNjQ1LDUuNjY2LDEyLjU2OSwzLjI5NQ0KCQkJYzQuNTQ4LTIuMTg4LDYuOS02LjkwMiw1LjY0Mi0xMC45MDZsMC4wNzctMC4wMTVjLTAuMTMzLTAuNjYyLTMuMjg4LTE1LjY0NC03Ljc5OS0yNS42MDhsMTguODMtOS4wNTQNCgkJCWMyLjE3LDIuOTczLDUuMzM0LDguNTEzLDYuOTM1LDE2Ljk5OGMtMS4wNzYsMC4xNjgtMi4xNTYsMC40OS0zLjIwOCwwLjk5NEMzNi4yMDIsMTI4LjMyLDMzLjg0NiwxMzMuNjQyLDM1Ljg2NCwxMzcuODMyeiIvPg0KCQk8Y2lyY2xlIGN4PSIxMTAuNTY1IiBjeT0iMzguMTM2IiByPSIyMS4wMDQiLz4NCgkJPHBhdGggZD0iTTE0LjMzNywyMzIuODY4aDIyMC4yMzljNy45MjEsMCwxNC4zMzgtNi4yNzIsMTQuMzM4LTE0LjAyMWMwLTcuNzQ3LTYuNDE3LTE0LjAyNC0xNC4zMzgtMTQuMDI0aC02Ny4yNjINCgkJCWMwLjM5My0wLjE0NSwwLjc5NC0wLjI4LDEuMTc2LTAuNTA0YzMuMjkxLTEuOTkzLDQuMzUxLTYuMjc3LDIuMzU3LTkuNTcybC0zOS4yNzgtNjUuMDE3di0zMi4xMQ0KCQkJYzE3Ljg4LDE2LjEzOSwyNi41MjMsNDEuOTg1LDI2LjY3Nyw0Mi40NTdjMC45NTcsMi45NDksMy42OTIsNC44MjUsNi42MzcsNC44MjVjMC43MDUsMCwxLjQzNC0wLjEwNiwyLjEzOC0wLjMzNg0KCQkJYzMuNjczLTEuMTgxLDUuNjgtNS4xMTUsNC40OTQtOC43NzNjLTAuNTg4LTEuODA3LTEyLjY2MS0zOC4yNjEtMzkuOTY5LTU1LjY5N2MtMC4xMTEtOS41MjUtNy44NTItMTcuMjE3LTE3LjQwNi0xNy4yMTdoLTcuMTU5DQoJCQljLTQuNTg3LDAtOC43MzIsMS44MTEtMTEuODQzLDQuNzA5Yy0yMS40NjQtMTUuMzIyLTMxLjc5LTQ2LjE5NC0zMS45NjItNDYuNzE3Yy0xLjE5LTMuNjU0LTUuMTA4LTUuNjctOC43NzQtNC40ODUNCgkJCWMtMy42NzEsMS4xODUtNS42NzgsNS4xMTUtNC40OTIsOC43NzRjMC41ODEsMS44MDEsMTIuNTY0LDM3Ljk4LDM5LjY0Miw1NS41MDF2NTUuNzkxTDc2LjA0NSwxNjAuMTUNCgkJCWMtMS4xMDQsMS45MzctMS4yMTgsNC4yNzktMC4yOTYsNi4zMTlsMTUuNjgxLDM0Ljc1MWMwLjc5MywxLjc2LDIuMjQ1LDIuOTc4LDMuOTE4LDMuNjAzSDE0LjMzNw0KCQkJQzYuNDE5LDIwNC44MjMsMCwyMTEuMTA1LDAsMjE4Ljg0OEMwLDIyNi41OTEsNi40MTksMjMyLjg2OCwxNC4zMzcsMjMyLjg2OHogTTg5LjkxNCwxNjMuOTY4bDEzLjMwMS0yMy4zMzVoMTguNjQ3bDM3LjA0Nyw2MS4zMjUNCgkJCWMwLjg0NSwxLjM5NiwyLjExNCwyLjMzOCwzLjUyOCwyLjg3aC02Mi4xNTZjMC4xMTktMC4wNDcsMC4yNDgtMC4wNjUsMC4zNjctMC4xMTdjMy41MDctMS41ODIsNS4wNzUtNS43MTIsMy40ODktOS4yMjINCgkJCUw4OS45MTQsMTYzLjk2OHoiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==";
        var drink = "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMyIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNjQgNjQiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNjQgNjQiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTE3LjYwNiAxLjIwNS0xLjIxMiAxLjU5IDEzLjM5MyAxMC4yMDVoMy4zMDF6Ii8+PHBhdGggZD0ibTIzIDI0YzAgNC45NjIgNC4wMzcgOSA5IDlzOS00LjAzOCA5LTl2LTJjMC0uNTUyLjQ0Ny0xIDEtMSA0LjYyNSAwIDguNDQ1LTMuNTA2IDguOTQ0LThoLTE3Ljg1Nmw1LjUxOCA0LjIwNS0xLjIxMyAxLjU5MS03LjYwNi01Ljc5NmgtMTYuNzMxYy40OTkgNC40OTQgNC4zMTkgOCA4Ljk0NCA4IC41NTMgMCAxIC40NDggMSAxem02LThjMi4yMDYgMCA0IDEuNzk0IDQgNHMtMS43OTQgNC00IDQtNC0xLjc5NC00LTQgMS43OTQtNCA0LTR6Ii8+PHBhdGggZD0ibTMzIDU3di0yMi4wNTFjLS4zMy4wMy0uNjYyLjA1MS0xIC4wNTFzLS42Ny0uMDIxLTEtLjA1MXYyMi4wNTFjMCAuNDA0LS4yNDMuNzY4LS42MTUuOTIzbC03LjM4NSAzLjA3N2gxOGwtNy4zODUtMy4wNzdjLS4zNzItLjE1NS0uNjE1LS41MTktLjYxNS0uOTIzeiIvPjxjaXJjbGUgY3g9IjI5IiBjeT0iMjAiIHI9IjIiLz48Y2lyY2xlIGN4PSI0MyIgY3k9IjQ5IiByPSIyIi8+PGNpcmNsZSBjeD0iNTIiIGN5PSIzOCIgcj0iNSIvPjxjaXJjbGUgY3g9IjE3IiBjeT0iNDQiIHI9IjIiLz48Y2lyY2xlIGN4PSI4IiBjeT0iMzMiIHI9IjUiLz48L3N2Zz4=";
        var drunk = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDI5OS40NTMgMjk5LjQ1MyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjk5LjQ1MyAyOTkuNDUzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8ZyBpZD0iWE1MSURfMTQ1NF8iPg0KCTxnPg0KCQk8Zz4NCgkJCTxjaXJjbGUgY3g9IjE3Ny42NjciIGN5PSIzMy41MDciIHI9IjMzLjUwOCIvPg0KCQkJPHBhdGggZD0iTTIzNC4xOTQsOTYuNjE1bC00OS43MzIsMTYuODY2bC0zOC45Ny0zMC4wNzZsMzQuMjI0LDE0LjQxMmMtMC4xMDctOS44ODUtNi43MjMtMTguODk3LTE2LjczNi0yMS41OTlsLTM4Ljk3Mi0xMC41MTUNCgkJCQljLTEyLjA2OS0zLjI1Ny0yNC40OTMsMy44ODgtMjcuNzUsMTUuOTU4Yy0wLjY5NCwyLjU3Mi0xNi44NDQsNjEuMjktMjcuMDgzLDk4LjU0MmMtMi40MTEsOC43NzQtMi41MDEsMTguMDY0LTAuMjE4LDI2Ljg3Mw0KCQkJCWMzLjMxOCwxMi44MDQsNy45NzksMzAuNzk0LDE0LjQ2NCw1NS44MTlsLTUxLjc1NS0wLjI3MWMtMC4wMzIsMC0wLjA2NSwwLTAuMDk3LDBjLTEwLjAxNiwwLTE4LjE2Miw4LjA5My0xOC4yMTUsMTguMTIxDQoJCQkJYy0wLjA1MywxMC4wNjEsOC4wNjEsMTguMjYsMTguMTIxLDE4LjMxMmw3NS40MjEsMC4zOTVjMC4wMzEsMCwwLjA2NCwwLDAuMDk1LDBjMTEuOTE3LTAuMDAxLDIwLjYxOS0xMS4yNjksMTcuNjM1LTIyLjc4Ng0KCQkJCWwtMTguNjg0LTcyLjEwNmwxMi42ODYsMy40MjNsMTcuMDU1LDY1LjgxOGMyLjI4LDguOCwwLjMyNSwxOC4zMzMtNS4yMjMsMjUuNTMxbDIyLjc5NiwwLjEyYzAuMDMxLDAsMC4wNjQsMCwwLjA5NSwwDQoJCQkJYzExLjkxNi0wLjAwMSwyMC42MTktMTEuMjY5LDE3LjYzNS0yMi43ODZsLTE4LjkzMS03My4wNjJsMTIuNzI5LTQ3LjE3OWMtMS40MTktMS40MTksMS40NDcsMi4xODUtMzcuODQtNDguOTg1bDQ1LjQxMywzNS4wNDkNCgkJCQljNC4wMjksMy4xMSw5LjM0MSwzLjk4OSwxNC4xNTEsMi4zNTlsNTcuNDM5LTE5LjQ4MWM3Ljk0MS0yLjY5MiwxMi4xOTUtMTEuMzExLDkuNTAyLTE5LjI1Mg0KCQkJCUMyNTAuNzUzLDk4LjE3NywyNDIuMTM0LDkzLjkyMywyMzQuMTk0LDk2LjYxNXoiLz4NCgkJCTxwYXRoIGQ9Ik0yODAuNzI2LDYzLjgxM2gtNDEuNjU3Yy0yLjk2OSwwLTUuMzc1LDIuNDA2LTUuMzc1LDUuMzc1YzAsMi45NjksMi40MDcsNS4zNzUsNS4zNzUsNS4zNzVoMC40NjRsMC41MjYsNi4wODENCgkJCQljMTIuMjc1LDAuNDAzLDIzLjU4NSw4LjI3OSwyNy43NjMsMjAuNTk3YzMuNjYxLDEwLjc5NiwwLjg5NiwyMi4yMTYtNi4yMzYsMzAuMTE3aDEwLjA2NmMyLjA5MiwwLDMuODM2LTEuNiw0LjAxNi0zLjY4NA0KCQkJCWw0LjU5Mi01My4xMTFoMC40NjVjMi45NjksMCw1LjM3NS0yLjQwNiw1LjM3NS01LjM3NVMyODMuNjk0LDYzLjgxMywyODAuNzI2LDYzLjgxM3oiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K";
        var bed = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDkwLjcgNDkwLjciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5MC43IDQ5MC43OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggZD0iTTQzNi4yLDE1NC42SDE4Mi40Yy0xMi40LDAtMzMuMSw0LjctMzMuMSwzNi42VjI0MGgzMjB2LTQ4LjhDNDY5LjMsMTU5LjQsNDQ4LjYsMTU0LjYsNDM2LjIsMTU0LjZ6Ii8+DQoJPC9nPg0KPC9nPg0KPGc+DQoJPGc+DQoJCTxwb2x5Z29uIHBvaW50cz0iODAuMywyNTAuNiAzMiwyNTAuNiAzMiw4MCAwLDgwIDAsNDEwLjcgMzIsNDEwLjcgMzIsMzI1LjMgNDU4LjcsMzI1LjMgNDU4LjcsNDEwLjYgNDkwLjcsNDEwLjYgNDkwLjcsMjUwLjYgCQkNCgkJCSIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KCTxnPg0KCQk8Y2lyY2xlIGN4PSI4NS4zIiBjeT0iMTk3LjMiIHI9IjQ0LjciLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==";

        am4core.ready(function() {
            var chart = am4core.create("chartdiv1", am4plugins_timeline.CurveChart);
            chart.curveContainer.padding(100, 20, 50, 20);
            chart.maskBullets = false;


            var colorSet = new am4core.ColorSet();

            chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";
            chart.dateFormatter.dateFormat = "HH:mm";

            let chart_data   = [];
            json_data.forEach( function(el) {
                let chart_row = {
                    "category": el.category,
                    "start": el.start,
                    "end": el.end,
                    "color": colorSet.getIndex(14),
                    "icon": work,
                    "text": el.text
                }
                chart_data.push( chart_row );
            } );
            chart.data = chart_data;
                chart.dataxx = [{
                    "category": "",
                    "start": "2021-10-10 06:00",
                    "end": "2021-10-10 06:15",
                    "color": colorSet.getIndex(15),
                    "icon": alarm,
                    "text": "Wake up!"
                }, {
                    "category": "",
                    "start": "2021-10-10 06:15",
                    "end": "2021-10-10 06:30",
                    "color": colorSet.getIndex(14),
                    "icon": water,
                    "text": "Drink water"
                },
                {
                    "category": "",
                    "start": "2021-10-10 06:30",
                    "end": "2021-10-10 07:00",
                    "color": colorSet.getIndex(13),
                    "icon": exercise,
                    "text": "Exercise"
                },
                {
                    "category": "",
                    "start": "2021-10-10 07:00",
                    "end": "2021-10-10 07:30",
                    "color": colorSet.getIndex(12),
                    "icon": breakfast,
                    "text": "Have breakfast"
                },
                {
                    "category": "",
                    "start": "2021-10-10 07:30",
                    "end": "2021-10-10 08:00",
                    "color": colorSet.getIndex(11),
                    "icon": car,
                    "text": "Drive to work"
                },
                {
                    "category": "",
                    "start": "2021-10-10 08:00",
                    "end": "2021-10-10 17:00",
                    "color": colorSet.getIndex(10),
                    "icon": work,
                    "text": "Work"
                },
                {
                    "category": "e",
                    "start": "2021-10-10 10:00",
                    "end": "2021-10-10 10:15",
                    "color": colorSet.getIndex(10),
                    "icon": coffee,
                    "text": "Coffee"
                },
                {
                    "category": "e",
                    "start": "2021-10-10 12:00",
                    "end": "2021-10-10 13:00",
                    "color": colorSet.getIndex(10),
                    "icon": dinner,
                    "text": "Dinner"
                },
                {
                    "category": "e",
                    "start": "2021-10-10 14:00",
                    "end": "2021-10-10 14:15",
                    "color": colorSet.getIndex(10),
                    "icon": coffee,
                    "text": "Coffee"
                },
                {
                    "category": "",
                    "start": "2021-10-10 17:00",
                    "end": "2021-10-10 18:00",
                    "color": colorSet.getIndex(8),
                    "icon": car,
                    "text": "Drive home"
                },
                {
                    "category": "",
                    "start": "2021-10-10 18:00",
                    "end": "2021-10-10 21:30",
                    "color": colorSet.getIndex(7),
                    "icon": home,
                    "text": "Home!"
                },
                {
                    "category": "e",
                    "start": "2021-10-10 19:30",
                    "end": "2021-10-10 20:30",
                    "color": colorSet.getIndex(7),
                    "icon": book,
                    "text": "Read a bit"
                },
                {
                    "category": "",
                    "start": "2021-10-10 21:30",
                    "end": "2021-10-10 22:00",
                    "color": colorSet.getIndex(6),
                    "icon": beer,
                    "text": "Have a beer"
                },
                {
                    "category": "",
                    "start": "2021-10-10 22:00",
                    "end": "2021-10-10 22:15",
                    "color": colorSet.getIndex(5),
                    "icon": beer,
                    "text": "Have another beer"
                },
                {
                    "category": "",
                    "start": "2021-10-10 22:15",
                    "end": "2021-10-10 23:00",
                    "color": colorSet.getIndex(4),
                    "icon": dance,
                    "text": "Dance!"
                },
                {
                    "category": "",
                    "start": "2021-10-10 23:00",
                    "end": "2021-10-11 00:00",
                    "color": colorSet.getIndex(3),
                    "icon": drink,
                    "text": "Martini!"
                },
                {
                    "category": "",
                    "start": "2021-10-11 00:00",
                    "end": "2021-10-11 01:00",
                    "color": colorSet.getIndex(2),
                    "icon": drunk,
                    "text": "Damn..."
                },
                {
                    "category": "",
                    "start": "2021-10-11 01:00",
                    "end": "2021-10-11 01:00",
                    "color": colorSet.getIndex(1),
                    "icon": bed,
                    "text": "Bye bye"
                }];

            chart.fontSize = 10;
            chart.tooltipContainer.fontSize = 10;

            var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "category";
            categoryAxis.renderer.grid.template.disabled = true;
            categoryAxis.renderer.labels.template.paddingRight = 25;
            categoryAxis.renderer.minGridDistance = 10;
            categoryAxis.renderer.innerRadius = 10;
            categoryAxis.renderer.radius = 30;

            var dateAxis = chart.xAxes.push(new am4charts.DateAxis());


            dateAxis.renderer.points = gWS.getChartPoints();


            dateAxis.renderer.autoScale = false;
            dateAxis.renderer.autoCenter = false;
            dateAxis.renderer.minGridDistance = 70;
            dateAxis.baseInterval = { count: 5, timeUnit: "minute" };
            dateAxis.renderer.tooltipLocation = 0;
            dateAxis.renderer.line.strokeDasharray = "1,4";
            dateAxis.renderer.line.strokeOpacity = 0.5;
            dateAxis.tooltip.background.fillOpacity = 0.2;
            dateAxis.tooltip.background.cornerRadius = 5;
            dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
            dateAxis.tooltip.label.paddingTop = 7;
            dateAxis.endLocation = 0;
            dateAxis.startLocation = -0.5;
            dateAxis.min = new Date(2021, 9, 1, 23, 55).getTime();
            dateAxis.max = new Date(2021, 9, 16, 7, 10).getTime();    

            var labelTemplate = dateAxis.renderer.labels.template;
            labelTemplate.verticalCenter = "middle";
            labelTemplate.fillOpacity = 0.6;
            labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
            labelTemplate.background.fillOpacity = 1;
            labelTemplate.fill = new am4core.InterfaceColorSet().getFor("text");
            labelTemplate.padding(7, 7, 7, 7);

            var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
            series.columns.template.height = am4core.percent(30);

            series.dataFields.openDateX = "start";
            series.dataFields.dateX = "end";
            series.dataFields.categoryY = "category";
            series.baseAxis = categoryAxis;
            series.columns.template.propertyFields.fill = "color"; // get color from data
            series.columns.template.propertyFields.stroke = "color";
            series.columns.template.strokeOpacity = 0;
            series.columns.template.fillOpacity = 0.6;

            var imageBullet1 = series.bullets.push(new am4plugins_bullets.PinBullet());
            imageBullet1.background.radius = 18;
            imageBullet1.locationX = 1;
            imageBullet1.propertyFields.stroke = "color";
            imageBullet1.background.propertyFields.fill = "color";
            imageBullet1.image = new am4core.Image();
            imageBullet1.image.propertyFields.href = "icon";
            imageBullet1.image.scale = 0.7;
            imageBullet1.circle.radius = am4core.percent(100);
            imageBullet1.background.fillOpacity = 0.8;
            imageBullet1.background.strokeOpacity = 0;
            imageBullet1.dy = -2;
            imageBullet1.background.pointerBaseWidth = 10;
            imageBullet1.background.pointerLength = 10
            imageBullet1.tooltipText = "{text}";

            series.tooltip.pointerOrientation = "up";

            imageBullet1.background.adapter.add("pointerAngle", (value, target) => {
                if (target.dataItem) {
                    var position = dateAxis.valueToPosition(target.dataItem.openDateX.getTime());
                    return dateAxis.renderer.positionToAngle(position);
                }
                return value;
            });

            var hs = imageBullet1.states.create("hover")
            hs.properties.scale = 1.3;
            hs.properties.opacity = 1;

            var textBullet = series.bullets.push(new am4charts.LabelBullet());
            textBullet.label.propertyFields.text = "text";
            textBullet.disabled = true;
            textBullet.propertyFields.disabled = "textDisabled";
            textBullet.label.strokeOpacity = 0;
            textBullet.locationX = 1;
            textBullet.dy = - 100;
            textBullet.label.textAlign = "middle";

            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarX.align = "center"
            chart.scrollbarX.width = am4core.percent(75);
            chart.scrollbarX.parent = chart.curveContainer;
            chart.scrollbarX.height = 300;
            chart.scrollbarX.orientation = "vertical";
            chart.scrollbarX.x = 128;
            chart.scrollbarX.y = -140;
            chart.scrollbarX.isMeasured = false;
            chart.scrollbarX.opacity = 0.5;

            var cursor = new am4plugins_timeline.CurveCursor();
            chart.cursor = cursor;
            cursor.xAxis = dateAxis;
            cursor.yAxis = categoryAxis;
            cursor.lineY.disabled = true;
            cursor.lineX.disabled = true;

            dateAxis.renderer.tooltipLocation2 = 0;
            categoryAxis.cursorTooltipEnabled = false;

            chart.zoomOutButton.disabled = true;

            var previousBullet;

            chart.events.on("inited", function() {
                setTimeout(function() {
                    hoverItem(series.dataItems.getIndex(0));
                }, 2000)
            })

            function hoverItem(dataItem) {
                var bullet = dataItem.bullets.getKey(imageBullet1.uid);
                var index = dataItem.index;

                if (index >= series.dataItems.length - 1) {
                    index = -1;
                }

                if (bullet) {

                    if (previousBullet) {
                        previousBullet.isHover = false;
                    }

                    bullet.isHover = true;

                    previousBullet = bullet;
                }
                setTimeout(
                    function() {
                        hoverItem(series.dataItems.getIndex(index + 1))
                    }, 1000);
            }
        });
    },   
    getChartPoints:function() {
            var points = [{ x: -1300, y: 200 }, { x: 0, y: 200 }];

            var w = 400;
            var h = 400;
            var levelCount = 4;

            var radius = am4core.math.min(w / (levelCount - 1) / 2, h / 2);
            var startX = radius;

            for (var i = 0; i < 25; i++) {
                var angle = 0 + i / 25 * 90;
                var centerPoint = { y: 200 - radius, x: 0 }
                points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
            }


            for (var i = 0; i < levelCount; i++) {

                if (i % 2 != 0) {
                    points.push({ y: -h / 2 + radius, x: startX + w / (levelCount - 1) * i })
                    points.push({ y: h / 2 - radius, x: startX + w / (levelCount - 1) * i })

                    var centerPoint = { y: h / 2 - radius, x: startX + w / (levelCount - 1) * (i + 0.5) }
                    if (i < levelCount - 1) {
                        for (var k = 0; k < 50; k++) {
                            var angle = -90 + k / 50 * 180;
                            points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
                        }
                    }

                    if (i == levelCount - 1) {
                        points.pop();
                        points.push({ y: -radius, x: startX + w / (levelCount - 1) * i })
                        var centerPoint = { y: -radius, x: startX + w / (levelCount - 1) * (i + 0.5) }
                        for (var k = 0; k < 25; k++) {
                            var angle = -90 + k / 25 * 90;
                            points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
                        }
                        points.push({ y: 0, x: 1300 });
                    }

                }
                else {
                    points.push({ y: h / 2 - radius, x: startX + w / (levelCount - 1) * i })
                    points.push({ y: -h / 2 + radius, x: startX + w / (levelCount - 1) * i })
                    var centerPoint = { y: -h / 2 + radius, x: startX + w / (levelCount - 1) * (i + 0.5) }
                    if (i < levelCount - 1) {
                        for (var k = 0; k < 50; k++) {
                            var angle = -90 - k / 50 * 180;
                            points.push({ y: centerPoint.y + radius * am4core.math.cos(angle), x: centerPoint.x + radius * am4core.math.sin(angle) });
                        }
                    }
                }
            }

            return points;
    },
    resize_study_logs_chart: function(){
        $("#chartdiv1").height( screen.height - 350 );
    },
    showMemberInfo: function( member_info ){
        $("#span_mb_id").html( member_info.mb_name + " <small>( " + member_info.mb_id + " )</small> " );
        $("#member_info_period").html( member_info.mb_study_start + " ~ " + member_info.mb_study_end );
    },
    sel_member_4status:function(){
        gWS.kakao_key = $(event.target).data("kakao");
        const   mb_name   = $(event.target).data("name");
        const   mb_id   = $(event.target).data("id");
        $("#make_plan_kakao_key").val( gWS.kakao_key );
        $("#make_plan_mb_name").val( mb_name );
        $("#make_plan_mb_id").val( mb_id );
        $("#make_plan_mb_name_id").val( mb_name + " ( " + mb_id + " )" );
        $("#span_mb_id").html( mb_name + " ( " + mb_id + " ) 님 학습일정"  );
        const   mb_study_start   = $(event.target).data("start");
        const   mb_study_end   = $(event.target).data("end");
        $("#txt_mb_study_start").val( mb_study_start );
        $("#txt_mb_study_end").val( mb_study_end );
        $("#make_plan_mb_study_start").val( mb_study_start );
        $("#make_plan_mb_study_start2").val( mb_study_start );
        $("#make_plan_mb_study_end").val( mb_study_end );
        $("#make_plan_mb_study_end2").val( mb_study_end );
        $("#member_period").html( mb_study_start + " ~ " + mb_study_end );
        gWS.getPlanData( {'kakao': gWS.kakao_key } );
    },
    show_select_category:function( category ){
        $(".member_category").each(function(index, item){
            if ( $(item).data("category") == category ) {
                $(item).removeClass("bg-primary").addClass("bg-primary");
            } else {
                $(item).removeClass("bg-primary");
            } 
        });
        $(".member_subject_card").each(function(index, item){
            if ( $(item).data("category") == category ) {
                $(item).removeClass("hide");
            } else {
                $(item).removeClass("hide").addClass("hide");
            } 
        });
    }
}

$(window).on ('load', function (){
    if ( location.href.indexOf("plan-study-quiz") > 0 ) {
        gWS.kakao_key   = gWS.getParameterByName("kakao");
        gWS.study_id    = gWS.getParameterByName("study_id");
        gWS.getQuizData( {'kakao': gWS.kakao_key, 'study_id': gWS.study_id } );
        $("#next").on("click", gWS.quiz_next );
        $("#quiz_submit").on("click", gWS.quiz_submit_confirm );
        // 메뉴
        $("#menu_plan_study_report").html( ` <a href="/kakao/plan_study_report/${gWS.kakao_key}?ts=20210810083246">
                                <i class="la la-files-o"></i> <span>학습현황</span></a>`);
        $("#menu_plan_study_status").html( ` <a href="/kakao/plan_study_status/${gWS.kakao_key}?ts=20210810083246">
                                <i class="la la-files-o"></i> <span>학습일정</span></a>`);
    };
    if ( location.href.indexOf("plan_study_subject") > 0 ) {
        gWS.sel_mb_id    = gWS.getParameterByName("sel_mb_id");
    };
    if ( location.href.indexOf("plan_study_status") > 0 ) {
        $('#table_list thead tr').clone(true).appendTo( '#table_list thead' );
        $('#table_list thead tr:eq(1) th').each( function (i) {
            if ( i>0 ){
                var title = $(this).text();
                $(this).html( '<input type="text" class="data_filter_input" placeholder="Search '+title+'" />' );
                $( 'input.data_filter_input', this ).on( 'keyup change', function () {
                    if ( gWS.data_table.column(i).search() !== this.value ) {
                        gWS.data_table
                            .column(i)
                            .search( this.value )
                            .draw();
                    }
                } );
            }
        } );
        gWS.data_table = $('#table_list').DataTable();
        gWS.data_table.destroy();
        gWS.data_table  = $('#table_list')
            .DataTable( {
                retrieve: true,
                "bFilter": true,
            orderCellsTop: true,
            fixedHeader: true,
            "bPaginate": false,
            "sScrollY": (screen.availHeight - 320) + "px", 
            "bScrollCollapse": true,
            //otherOptions: {},
            initComplete: function() {
                //$(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
                let sel_mb_id   = $("#sel_mb_id").val();
                let mb_id       = $("#mb_id").val();
                if ( sel_mb_id != mb_id && sel_mb_id > "") {
                     //$("div#table_member_list_filter input").val( sel_mb_id );
                     gWS.data_table.search( sel_mb_id ).draw();
                }
            },
            "drawCallback": function( settings ) {
                $("#table_list .member").on("click", function(){
                    gMP.load_member();    
                })
            }
        }); 

        if ( 1==2) {
            gWS.data_table_subject = $('#table_subject_list').DataTable();
            gWS.data_table_subject.destroy();
            gWS.data_table_subject  = $('#table_subject_list').DataTable( {
                //retrieve: true,
                "bDestroy": true,
                "bFilter": true,
                "bPaginate": false,
                "bInfo": false,
                "bAutoWidth": true,
                "bLengthChange": false,
                "ordering": true,
                "order": [ [ 0, 'asc'] ],
                "select": {
                    "style": 'multi'
                },
                "columnDefs": [
                    { "width": "40%", "targets": 0 },
                    { "width": "5%", "targets": 1 },
                    { "width": "5%", "targets": 2 },
                    { "width": "7%", "targets": 3 },
                    { "width": "10%", "targets": 4 },
                    { "width": "5%", "targets": 5 }
                  ]
            }); 
        }
        if (1==2){
            //$('#table_subject_list thead tr').clone(true).appendTo( '#table_subject_list thead' );
            $('#table_subject_list thead  th').each( function (i) {
                if ( i == 0 ) {
                    var title = $(this).text();
                    $(this).html( '<input type="text" class="subject_filter_input" placeholder="Search '+title+'" />' );
                    $( 'input.subject_filter_input', this ).on( 'keyup change', function () {
                        if ( gWS.data_table_subject.column(i).search() !== this.value ) {
                            gWS.data_table_subject
                                .column(i)
                                .search( this.value )
                                .draw();
                        }
                    } );
                }
            } );
            $("#table_subject_list_wrapper > div.row:eq(0)").addClass("hide");
        }

        gWS.kakao_key   = gWS.getParameterByName("kakao");
        if ( gWS.isEmpty( gWS.kakao_key ) ){
            gWS.kakao_key   = $("#sel_kakao_id").val();
        }
        gWS.study_id    = gWS.getParameterByName("study_id");
        gWS.getPlanData( {'kakao': gWS.kakao_key, 'study_id': gWS.study_id } );
    }
});

