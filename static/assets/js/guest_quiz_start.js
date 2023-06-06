gGQ  = {
    mb_id    : "",
    mb_pwd    : "",
    base_server: "https://planstudy.wizice.com",
    guest_quiz_id: null,
    SQ: {},
    start_dt: "",
    end_dt: "",
    get_quiz:function(guest_quiz_id ){
        var url4json    =  gGQ.base_server + "/app/guest_quiz/data/" +  gGQ.guest_quiz_id + "?ts=" + Date.now();
        gGQ.SQ          = {};
        gWS.showProgressBar(true);
        $.getJSON( url4json).done(function( res ) {
            gGQ.SQ          = res;
            gGQ.SQ.quiz_len = res.data.length;
            gGQ.SQ.cur_pos  = 0;    // 문항위치
            var rtn         = gGQ.showQuizData( gGQ.SQ );
            gGQ.showQuizProgressBar(0);

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
    showQuizProgressBar: function( pw) {
        if ( $("#progressbar").length > 0 ) {
            pw      = pw || parseInt( (gGQ.SQ.cur_pos+1) / gGQ.SQ.data.length * 100 );
            $("#progressbar").css( "width", pw + "%"  );
            $("#progressbar").html( pw + "%" );
        }
    },
    showQuizData: function( quizs ){
        var s_quiz_html    = "";
        var i_no         = 0;
        if ( quizs.data.length <= 0 ){
            gWS.alert_msg("Quiz 정보가 없습니다.");
            $("#wait_msg").html( "quiz 정보가 없습니다." );
            return;
        }
        //--회원명 표시
        var mb_id       = quizs.mb_id;
        var subject     = quizs.data[0].subject;
        $("#span_mb_id").html( mb_id + " 님 " + subject );
        // 순서를 섞기
        gGQ.SQ.data = gGQ.shuffle( quizs.data );

        if ("debug" == "no"){
            for(var i=0; i<=8; i++) gGQ.SQ.data.pop();
        }

        gGQ.SQ.data.forEach( function( quiz, index ) {
            i_no += 1;
            
            var s_row_html = gGQ.get_quiz_row_html( i_no, quiz );
            s_quiz_html     += s_row_html;
        });
        $("#tab_quiz").html( s_quiz_html );
        $("#div_next").removeClass("hide");
        gGQ.check_next();   // next 버튼을 표시할지 결정
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
            gGQ.show_quiz_answer( answer, true );
        });
    },
    show_quiz_answer:function( json_data, show_answer){
        let plan        = json_data.plan;
        let qno         = json_data.qno;
        let mgr_a       = json_data.mgr_a;
        let usr_a       = json_data.usr_a;
        let OX          = json_data.OX;
        let quiz_id     = json_data.quiz_id;
        let s_hint      = json_data.hint || '';
        let quiz_plan_q_id   = "#quiz_" + plan + "_" + qno;
        $( quiz_plan_q_id).removeClass("hide");
        // 사용자 입력값이 있으면
        if ( usr_a ) {
            $("#QA_" + plan + "_" + qno + "_" + usr_a ).prop("checked", true);
        }
    
        let paln_qno_ano= "#quiz_" + plan + "_" + qno;
        let i_id        = quiz_plan_q_id + " i.answer ";
        let td_id       = "#td_" + plan + "_" + qno + "_" + mgr_a;
        let div_hint_id = "#div_hint_" + plan + "_" + qno ;
        let hint_id     = "#HINT_" + plan + "_" + qno ;
        if ( OX == "O") { // 정답
            $( i_id ).removeClass("hide").removeClass("fa-close").removeClass("text-danger").addClass("fa-circle-o").addClass("text-success")
        }else if ( OX == "X") { // 오답표시
            $( i_id ).removeClass("hide").removeClass("fa-circle-o").removeClass("text-success").addClass("fa-close").addClass("text-danger")
            if (  show_answer ) {
                $( td_id ).addClass("bg-success")
            }
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
        gGQ.SQ.quiz.user_answer = '';
        var radio_name  = "QA_" + gGQ.SQ.quiz.plan  + "_" + gGQ.SQ.quiz.qno;
        var choice_val  = $("input[name='" + radio_name + "']:checked").val() || '';
        if (choice_val > '') {
            gGQ.SQ.quiz.user_answer = choice_val;
        }
        //gGQ.SQ.quiz.multi_choice.forEach( function(choice, index ) {
        //});
    },
    quiz_check_user_answer_show:function() {
        // 현재 문제에 대해 사용자가 선택한 답 확인
        let quiz    = gGQ.SQ.data[ gGQ.SQ.cur_pos ];
        let user_answer = gGQ.quiz_get_user_answer( quiz ); 
        // 현재 문제에 대한 정답 확인
        quiz["mgr_a"]   = gGQ.quiz_get_mgr_answer( quiz );
        // 정답확인후  체점결과 표시
        if ( user_answer != quiz.mgr_a ) { // 오답이면
            quiz["OX"]  = "X"
        } else { // 정답이면
            quiz["OX"]  = "O"
        }
        gGQ.show_quiz_answer( quiz, false );
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
    move_quiz_pos:function( pos){
        var quiz    = gGQ.SQ.data[ pos ];
        var quiz_id = "#quiz_" + quiz.plan + "_" + quiz.qno;
        $( quiz_id ).focus();
    },
    check_next:function(){
        // 마지막 위치인가?
        if ( gGQ.SQ.cur_pos >= gGQ.SQ.data.length-1 ){
            $("#div_next a").removeClass("hide").addClass( "hide" );
            $("#div_quiz_submit").removeClass("hide");
            return false;
        }
        return true;
    },
    check_no_answer:function(){
        if ( gGQ.SQ.quiz.user_answer == "" ) {
            var title   = (gGQ.SQ.cur_pos + 1)  + "번 문제";
            var msg     = "<p>" + gGQ.SQ.quiz.qatext + "</p>의 답을 입력해주시기 바랍니다. ";
            gWS.alert_msg( msg);
            gGQ.move_quiz_pos( gGQ.SQ.cur_pos );
            return false;
        } 
        return true;
    },
    quiz_next:function(){
        // 현재 문제를 풀었는가?
        gGQ.SQ.quiz         = gGQ.SQ.data[ gGQ.SQ.cur_pos ];
        gGQ.quiz_answer_selected(); // 답을 입력했는지 확인
        if ( ! gGQ.check_no_answer() ) return false;
        //---- 사용자가 입력한 정답확인
        gGQ.quiz_check_user_answer_show();
        //------
        if ( ! gGQ.check_next() ) return false;
        // 다음 문제위치로 이동
        gGQ.SQ.cur_pos         += 1;
        gGQ.SQ.quiz         = gGQ.SQ.data[ gGQ.SQ.cur_pos ];
        gGQ.SQ.quiz_id      = "#quiz_" + gGQ.SQ.quiz.plan + "_" + gGQ.SQ.quiz.qno;
        $( gGQ.SQ.quiz_id ).removeClass( "hide") ;
        //$("html, body").animate({ scrollTop: $(document).height() }, 1000);
        //-- 진행바표시
        gGQ.showQuizProgressBar();
    },
    quiz_submit_confirm:function(){
        // 답을 입력안한 것이 있는 지 확인
        if (!gGQ.check_no_answer()) return false;
        // 문제의 답을 확인
        var answer  = {};
        gGQ.SQ.data.forEach( function( quiz, index ) {
            var radio_plan_qno          = "QA_" + quiz.plan  + "_" + quiz.qno ;
            var plan_qno_answer         = $("input:radio[name=" + radio_plan_qno + "]:checked").val();
            answer[ radio_plan_qno ]    = plan_qno_answer;

        });
        gGQ.end_dt      = gWS.get_YyMmDd_HhMmSs_String(new Date() );
        json_data   = { "mb_id":gGQ.mb_id, "mb_pwd":gGQ.mb_pwd, "answer": answer , "quiz": gGQ.SQ.data,
                        'start_dt': gGQ.start_dt,
                        'end_dt': gGQ.end_dt,
                        'guest_quiz_id': gGQ.guest_quiz_id }
        $.confirm( {
            theme: "Material",
            boxWidth: '600px',
            content: "정말로 제출하시겠습니까?",
            title: "테스트 답안 제출",
            buttons: {
                "제 출": function(){
                   gGQ.quiz_submit( json_data );
                },
                "취 소": function(){
                }
            }
        });
    },
    quiz_submit:function( json_data){
            var url4json    =  gGQ.base_server + "/app/guest_quiz/data/quizanswer" + "?ts=" + Date.now();
            gWS.showProgressBar(true);
            $.ajax({
                url: url4json,
                async: true,
                type: 'POST',
                data: { data: JSON.stringify( json_data ) },
                dataType: 'json',
                beforeSend:function(jqXHR) {},// 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
                success:function(jqXHR) {
                    gGQ.show_quiz_result( jqXHR.data );
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
    quiz_retry_confirm:function(){
        // 재도전인지 확인
        $.confirm( {
            theme: "Material",
            boxWidth: '600px',
            content: "정말로 재 도전하시겠습니까?<br>기존 점수는 삭제됩니다.",
            title: "퀴즈 재도전",
            buttons: {
                "재 도전": function(){
                    let retry_data  = {
                            "guest_quiz_id": gGQ.guest_quiz_id,
                            "mb_id": gGQ.mb_id,
                            "mb_pwd": gGQ.mb_pwd,
                        };
                   gGQ.quiz_retry( retry_data );
                },
                "취 소": function(){
                }
            }
        });
    },
    quiz_retry:function( json_data){
            var url4json    =  gGQ.base_server + "/app/guest_quiz/clear" + "?ts=" + Date.now();
            gWS.showProgressBar(true);
            $.ajax({
                url: url4json,
                async: true,
                type: 'POST',
                data: json_data,
                dataType: 'json',
                beforeSend:function(jqXHR) {},// 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
                success:function(res) {
                    if ( res.msg > "") {     // 오류 메세지가 있으면
                        gWS.alert_msg(  res.msg );
                    } else {
                        location.reload();   // 화면 새로고침
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
    show_quiz_result:function( data ){
                    $("#div_quiz_submit").removeClass("hide").addClass("hide"); // 제출 숨기기
                    $("#div_quiz_submit").prop("onclick", null );   // 제거
                    $("#div_quiz_retry").removeClass("hide");    // 재도전 보이기
                    $("#a_me_title").html("내 점수" + "(" + data.answer_result.score + "점)");    // 내 점수 제목 변경
                    $("#li_other").removeClass("hide");    // 참여자 점수확인 보이기
                    
                    gGQ.show_quiz_answer_list( data.quiz_result )
                    let showscore = $("#showscore").val();
                    // 체점 결과 확인
                    if (showscore !="Y") {
                        let score = data.answer_result.score;
                        let msg     = `${score} 점 입니다.<br> 다른 참여자 점수확인도 가능합니다.`;
                        $.confirm( {
                            theme: "Material",
                            boxWidth: '600px',
                            content: msg,
                            title: "제출완료.",
                            buttons: {
                                    //"재 도전": function(){
                                    //   $("#quiz_retry").trigger("click");
                                    //},
                                    "참여자 점수확인": function(){
                                        setTimeout(function(){
                                                $("#showscore").val("Y");
                                                $("#mb_id").attr("disabled", false); //해제
                                                $("#mb_pwd").attr("disabled", false); //해제
                                                $("#frm_user_score").submit();
                                            }, 100);
                                    },
                                    "취 소": function(){
                                    }
                            }
                        });
                    }else {
                        $("#a_other_tab").trigger("click");
                    }
    },
    check_mb_data:function(){
        gGQ.mb_id           = $("#new_mb_id").val();
        gGQ.mb_pwd          = $("#new_mb_pwd").val();
        gGQ.mb_pwd2         = $("#new_mb_pwd2").val();
        if ( gWS.isEmpty(gGQ.mb_id) ) {
            gWS.alert_msg("아이디를 입력바랍니다.");
            return false;
        }
        if ( gWS.isEmpty(gGQ.mb_pwd)  ) { 
            gWS.alert_msg("비밀번호를 입력바랍니다.");
            return false;
        }
        //let PWDREG = new RegExp(/^(?=.*[a-zA-Z])((?=.*\d)).{4,16}$/);
        //if ( !PWDREG.test( gGQ.mb_pwd) ) {
        //    gWS.alert_msg("비밀번호는 4자이상 영문자와 숫자 조합을 입력바랍니다.");
        //    return false;
       // }
        if ( gGQ.mb_pwd != gGQ.mb_pwd2 ) {
            gWS.alert_msg("비밀번호를 동일하게 입력바랍니다.");
            return false;
        }
        return true;
    },
}

$(window).on ('load', function (){
    gGQ.mb_id           = $("#mb_id").val();
    gGQ.mb_pwd          = $("#mb_pwd").val();
    if ( gWS.isEmpty( gGQ.mb_id ) ) { // mb_id 가 없으면
        return false;
    }

    gGQ.guest_quiz_id    = $("#txt_guest_quiz_id").val();
    $("#quiz_retry").on("click", gGQ.quiz_retry_confirm );
    $("#quiz_other_score").on("click", function(){
               location.reload();
    });
    $("#a_other_tab").on("click", function(){
                $(".guest_quiz_footer").each(function(idx, item){
                    $(item).addClass("d-none");
                });
    });
    $("#a_me_title").on("click", function(){
                $(".guest_quiz_footer").each(function(idx, item){
                    $(item).removeClass("d-none");
                });
    });
    //------------- 이미 제출한 결과가 있다면 정답 표시
    if ( quiz_answer.quiz_result.length > 0  ) {
        //--- 문제표시
        gGQ.SQ      =  {"mb_id": gGQ.mb_id, 
                            "data":quiz_answer.quiz_result ,
                            "cur_pos":(quiz_answer.quiz_result).length  -1,
                            "quiz_len":(quiz_answer.quiz_result).length 
                            };
        var rtn         = gGQ.showQuizData( gGQ.SQ  );
        gGQ.showQuizProgressBar(100);
        //--- 정답표시
        gGQ.show_quiz_result( quiz_answer );
        return false;
    }
    //-------------------------------------------- quiz 시작
    gGQ.get_quiz( gGQ.guest_quiz_id  );

    $("#next").on("click", gGQ.quiz_next );
    $("#quiz_submit").on("click", gGQ.quiz_submit_confirm );
    // 시작시간
    gGQ.start_dt = gWS.get_YyMmDd_HhMmSs_String(new Date() );
});

