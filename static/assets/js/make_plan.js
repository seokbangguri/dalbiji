let gMP = {
    base_server: "",
    study_plans:  [],           //  서버에서 받은 회원의 모든 학습일정
    subject_list:  [],          // 교재명만      
    subject_code_json:  {},     // 교재의 code 목록
    subject_plan_json:  {},     // 교재별 학습일정
    subject_code_list: [],
    mp_plans:[],
    mp_select_info: { category: "", code:"", date_from:"", date_to:"", count:0, new_date_from:"" }, // 선택한 정보
    mp_select_plan: [], // 선택한 일정
    edit_sp_elem:null,  // 더블클릭 dblClick 한 plan
    isEmpty: function(str){
        if(typeof str == "undefined" || str == null || str == "" || str == "undefined" )
            return true;
        else
            return false ;
    },
    category_list: [
            {"id": "영문법","text": "영문법", "selected": true},
            {"id": "국어","text": "국어"},
            ////{"id": 2,"text": "Option 2", "selectes" : true},
            ////{"id": 3,"text": "Option 3","disabled": true}
        ],
    subject_list: [
            {"id": "기초영문법","text": "기초영문법", "selected": true},
            {"id": "중급영문법","text": "중급영문법"},
            {"id": "고급영문법","text": "고급영문법"},
    ],
    get_subject_list: function( category_name ){
        let result  = [];
        if ( category_name == "영문법") {
            result = [
                {"id": "기초영문법","text": "기초영문법", "selected": true},
                {"id": "중급영문법","text": "중급영문법"},
                {"id": "고급영문법","text": "고급영문법"},
            ]
        }
        if ( category_name == "국어") {
            result = [
                {"id": "기초국어","text": "기초국어", "selected": true},
                {"id": "중급국어","text": "중급국어"},
                {"id": "고급국어","text": "고급국어"},
            ]
        }
        return result
    },
    get_member_subject: function( mb_id ){
        var json_data           = {"url":"/app/admin/api/subject_member", "mode":"select" };
        json_data["sel_mb_id"]      = mb_id;
        gWS.ajaxPostApi( json_data, gMP.fun_subject_member);    // 서버에 ajax 호출
    },
    fun_subject_member: function(result){
        console.log('fun_subject_member', 'result', result );
        if ( result.result <= 0 ) {
            gWS.alert_msg( result.error, '교재 추가 에러', 'Material' );
        }else{
            gWS.dialog_msg( '추가되었습니다.', '교재', 'Material' );
            location.reload();
        }
    },
    fun_study_from_to: function(result){
        console.log('fun_study_from_to', 'result', result );
        if ( result.result <= 0 ) {
            gWS.alert_msg( result.error, '학습기간 변경 에러', 'Material' );
        }else{
            gWS.dialog_msg( '학습기간 변경완료.', '학습기간', 'Material' );
            //location.reload();
        }
    },
    fun_svc_from_to: function(result){
        console.log('fun_svc_from_to', 'result', result );
        if ( result.result <= 0 ) {
            gWS.alert_msg( result.error, '서비스기간 변경 에러', 'Material' );
        }else{
            gWS.dialog_msg( '서비스 기간 변경완료.', '서비스기간', 'Material' );
            //location.reload();
        }
    },
    fun_save_plan: function(result){
        console.log('fun_save_plan', 'result', result );
        if ( result.result <= 0 ) {
            gWS.alert_msg( result.error, '학습일정 저장 에러', 'Material' );
        }else{
            //---- 학습종료일 및 서비스 종료일이 변경되었는지 확인 후, 화면에 표시
            mb_study_end   = $("#make_plan_mb_study_end").val();
            mb_svc_end     = $("#make_plan_mb_svc_end").val();
            if ( mb_study_end != result.mb_study_end ){
                    $("#make_plan_mb_study_end").val( result.mb_study_end);
            }
            if ( mb_svc_end != result.mb_svc_end ){
                    $("#make_plan_mb_svc_end").val( result.mb_svc_end);
            }
            let kakao_key   = $("#sel_kakao_id").val();
            gWS.getPlanData( {'kakao': kakao_key } );
            setTimeout( function(){
                if ( gMP.mp_select_info.category > '') {
                    $("a.plan_category_title[data-category='" + gMP.mp_select_info.category +"']").trigger('click');
                }
                $("td.td_plan_date.mp_sel_plan[data-plan_date='" + gMP.mp_select_info.date_from +"']").focus();
            }, 1000 );
            gWS.dialog_msg( '학습일정 저장 완료.', '서비스기간', 'Material' );
        }
    },
    fun_move_plan: function(result){
        console.log('fun_move_plan', 'result', result );
        if ( result.result <= 0 ) {
            gWS.alert_msg( result.error, '학습일정 이동 에러', 'Material' );
        }else{
            let kakao_key   = $("#sel_kakao_id").val();
            // 선택한 category 저장후 다시 설정되도록 localStorage 사용
            gWS.getPlanData( {'kakao': kakao_key } );
            setTimeout( function(){
                if ( gMP.mp_select_info.category > '') {
                    $("a.plan_category_title[data-category='" + gMP.mp_select_info.category +"']").trigger('click');
                }
                $("td.td_plan_date.mp_sel_plan[data-plan_date='" + gMP.mp_select_info.date_from +"']").focus();
            }, 1000 );
            gMP.mp_select_plan  = [];
            gMP.fun_mp_sel_clear();
            gWS.dialog_msg( '학습일정 이동 완료.', '서비스기간', 'Material' );
        }
    },
    fun_delete_plan: function(result){
        console.log('fun_delete_plan', 'result', result );
        if ( result.result <= 0 ) {
            gWS.alert_msg( result.error, '학습일정 삭제 에러', 'Material' );
        }else{
            let kakao_key   = $("#sel_kakao_id").val();
            gWS.getPlanData( {'kakao': kakao_key } );
            setTimeout( function(){
                if ( gMP.mp_select_info.category > '') {
                    $("a.plan_category_title[data-category='" + gMP.mp_select_info.category +"']").trigger('click');
                }
            }, 1000 );
            gMP.mp_select_plan  = [];
            gMP.fun_mp_sel_clear();
            gWS.dialog_msg( '학습일정 삭제 완료.', '서비스기간', 'Material' );
        }
    },
    change_category_option: function(){
        $("#make_plan_category").html('').select2({data: [{id: '', text: ''}]});
        $("#make_plan_category").select2( {
                data: gMP.category_list,
                 width: '100%' 
        })
    },
    change_subject_option: function(){
        $("#make_plan_subject").html('').select2({data: [{id: '', text: ''}]});
        $("#make_plan_subject").select2( {
            data: gMP.subject_list,
             width: '100%' 
        })
    },
    change_bg_input: function(target){
        const is_checked    = $(target).prop("checked");
        const   s_id        = $(target).attr("id");
        const   s_code      = s_id.split("_")[0] 
        if ( is_checked ) {
            $("#" + s_code + "_start_date").removeClass("bg-input").addClass("bg-input");
            $("#" + s_code + "_note").removeClass("bg-input").addClass("bg-input");
            $("#" + s_code + "_note_lbl").removeClass("bg-input").addClass("bg-input");
            $("#" + s_code + "_note").closest("div").removeClass('hide');
            $("#" + s_code + "_start_date").closest("div.row").removeClass('hide');

            let s_start_date    = $( "#" + s_code + "_start_date" ).val();
            if ( gMP.isEmpty( s_start_date ) ) {
                let s_today = gMP.get_YyMmDd_String( new Date() );
                $( "#" + s_code + "_start_date" ).val( s_today );
            }
            $("#" + s_code + "_set_date1").trigger('click');
        } else {
            $("#" + s_code + "_start_date").removeClass("bg-input");
            $("#" + s_code + "_note").removeClass("bg-input");
            $("#" + s_code + "_note_lbl").removeClass("bg-input");
            $("#" + s_code + "_note").closest("div").removeClass('hide').addClass("hide");
            $("#" + s_code + "_start_date").closest("div.row").removeClass('hide').addClass("hide");
        }
        $("#" + s_code + "_note").attr("disabled", !is_checked);
        $("#" + s_code + "_start_date").attr("disabled", !is_checked);
        $("#" + s_code + "_method_term").attr("disabled", !is_checked);
        $("#" + s_code + "_term").attr("disabled", !is_checked);
        $("#" + s_code + "_method_page").attr("disabled", !is_checked);
        $("#" + s_code + "_page").attr("disabled", !is_checked);
        $("#" + s_code + "_method_date").attr("disabled", !is_checked);
        $("#" + s_code + "_end_date").attr("disabled", !is_checked);

        $(".plan-method").each(function(e) {
            gMP.change_method_bg_input( this );    // 선택한 method 에 따른 입력항목 bg color 변경
        });
    },
    change_subject_bg_input: function(target){
        const is_checked    = $(target).prop("checked");
        const   s_id        = $(target).attr("id");
        const   s_code      = s_id.split("_")[0] 
        if ( is_checked ) {
            $("#" + s_code + "_start_page").removeClass("bg-input").addClass("bg-input");
            $("#" + s_code + "_end_page").removeClass("bg-input").addClass("bg-input");
            $("#" + s_code + "_exclude_page").removeClass("bg-input").addClass("bg-input");
        } else {
            $("#" + s_code + "_start_page").removeClass("bg-input");
            $("#" + s_code + "_end_page").removeClass("bg-input");
            $("#" + s_code + "_exclude_page").removeClass("bg-input");
        }
        $("#" + s_code + "_start_page").attr("required", is_checked);
        $("#" + s_code + "_end_page").attr("required", is_checked);
        //$("#" + s_code + "_exclude_page").attr("required", is_checked);

        $("#" + s_code + "_id").attr("disabled", !is_checked);
        $("#" + s_code + "_start_page").attr("disabled", !is_checked);
        $("#" + s_code + "_end_page").attr("disabled", !is_checked);
        $("#" + s_code + "_exclude_page").attr("disabled", !is_checked);
    },
    change_method_bg_input: function(target){
        const is_checked    = $(target).prop("checked");
        const   s_id        = $(target).attr("id");
        const   s_value     = $(target).attr("value");
        const   s_code      = s_id.split("_")[0] 
        if ( is_checked ) {
            $("#" + s_code + "_" + s_value ).removeClass("bg-input").addClass("bg-input");
            $("#" + s_code + "_" + s_value + "_lbl" ).removeClass("bg-input").addClass("bg-input");
        } else {
            $("#" + s_code + "_" + s_value ).removeClass("bg-input");
            $("#" + s_code + "_" + s_value + "_lbl" ).removeClass("bg-input");
        }
        $("#" + s_code + "_" + s_value ).attr('required', is_checked );
    },
    prepare_data:function(){
        let frm_make_plan   = document.forms.frm_make_plan;
        let formData        = new FormData( frm_make_plan );
        let json_data       = Object.fromEntries(formData)
        return json_data;
    },
    check_form_data:function( json_data){
        return true;
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
    preview_plan:function(){
        $("#btn_save_plan").removeClass("hide").addClass("hide");
        let json_data   = gMP.prepare_data();     // plan 생성용 입력조건확인
        var url4json    = gMP.base_server + "/admin/make_plan" + "?ts=" + Date.now();
        gMP.showProgressBar(true);
        $.ajax({
            url: url4json,
            async: true,
            type: 'POST',
            data: json_data,
            dataType: 'json',
            beforeSend:function(res) {},// 서버 요청 전 호출 되는 함수 return false; 일 경우 요청 중단
            success:function(res) {
                gMP.mp_plans   = res.data;
                gMP.subject_list    = gMP.getSubject( gMP.mp_plans);
                gMP.subject_list.forEach( function( subject , index) {
                    gMP.subject_plan_json[ subject ]  = gMP.getCategoryPlans( subject, gMP.mp_plans );
                });
                gMP.showPlanData( gMP.mp_plans );   
            },// 요청 완료 시
            error:function(res, textStatus, error ) {
                var err = textStatus + ", " + error;     // error, Not Found
                alert("plan생성 err=" + err );
                console.log( "Request Failed: " + err );
            },// 요청 실패.
            complete:function(res) {
                console.log( "complete" );
                gMP.showProgressBar(false);
            }// 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
        });
    },
    showPlanData: function( study_plans ){
        var s_ps_html    = "";
        var s_ps_con     = "";
        var i_no         = 0;
        //
        gMP.subject_list.forEach( function( subject, index ) {
            i_no += 1;
            var s_s_name    = "subject" + i_no;
            var s_active    = ( i_no == 2) ? " active " : "";
            
            s_ps_html += "<li class='nav-item'> <a class='nav-link " + s_active + "' data-toggle='tab' href='#make_tab_" + s_s_name + "'>" + subject + "</a> </li>\n";

            var s_code_html = gMP.get_code_html( subject );
            var s_tbody_html = gMP.get_tbody_html( subject );

            s_ps_con += "                       <!-- make_" + s_s_name + " Tab -->\n";
            s_ps_con +="                        <div class='tab-pane show " + s_active + " ' id='make_tab_" + s_s_name + "'>\n";
            s_ps_con +="\n";
            s_ps_con +="                            <!-- make_tab_" + s_s_name + " Table -->\n";
            s_ps_con +="                            <div class='payroll-table card'>\n";
            s_ps_con +="                                <div class='table-responsive'>\n";
            s_ps_con +="                                <table class='table'>\n";
            s_ps_con +="                                        <thead>\n";
            s_ps_con +="                                          <tr>\n";
            s_ps_con +="                                            " + s_code_html;
            s_ps_con +="                                          </tr>\n";
            s_ps_con +="                                        </thead>\n";
            s_ps_con +="                                        <tbody>\n";
            s_ps_con +="                                          " + s_tbody_html;
            s_ps_con +="                                        </tbody>\n";
            s_ps_con +="                                      </table>\n";
            s_ps_con +="                                </div>\n";
            s_ps_con +="                            </div>\n";
            s_ps_con +="                            <!-- / make_tab_" + s_s_name + " Table -->\n";
            s_ps_con +="                            \n";
            s_ps_con +="                        </div>\n";
            s_ps_con +="                        <!-- make_" + s_s_name + " Tab -->\n";
        });
        $("#make_plan-subjects").html( s_ps_html );
        $("#make_plan-subjects").removeClass("hide");

        $("#div_make_tab_content").html( s_ps_con );
        $("#div_make_tab_content").removeClass("hide");
        $("#btn_save_plan").removeClass("hide");
    }, 
    getSubject:function( study_plans) {
        var subject_json    = {};
        study_plans.forEach( function( row, index ) {
            //subject_json[ row.subject ] = 1;
            subject_json[ row.category ] = 1;  //-- category 로 일정을 보여주기로 함 2021-12-03
        })
        let subject_list =  Object.keys( subject_json );
        subject_list.splice(0, 0, '일자별');
        return subject_list;
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
        if ( !gMP.isEmpty( dateArray) ) {
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
        const date_val  = gMP.get_date_from_string( s_date );
        var today       = date_val.getDay();
        var todayLabel  = week[today];
        return todayLabel;
    },
    get_study_state:function( row ) {
        
        var state    = "";
        var s_now                   = gMP.get_YyMmDd_String( new Date() ); // 날짜를 스트링
        if ( row.date_done != '0000-00-00 00:00:00' && row.date_done > ''  ) {
            state = "done" ;
            if ( !gMP.isEmpty(row.study_flag) ) {
                if ( row.study_flag == 'nogood' ) { //  완료했지만, 미승인이면 
                        state = "nogood" 
                }
            }
             
        } else {
            if (row.date_from < s_now &&  ( row.date_done == '0000-00-00 00:00:00' || row.date_done == '') ) { state = "overdue" } // 오늘 이전인데 미완료인것
            if (row.date_started > '0000-00-00 00:00:00' && ( row.date_done == '0000-00-00 00:00:00' || row.date_done=='') ) { state = "studying" }; // 학습중
            if ( (row.date_started == '0000-00-00 00:00:00' || row.date_done=='')  && row.date_from > s_now ) { state = "notyet" }; // 해야할 것
        }
        return state;
    },
    get_study_time_seconds:function( row ) {
        var seconds    = 0;
        if (row.date_done > row.date_started ) { 
            var date_started    = gMP.get_datetime_from_string( row.date_started );
            var date_done       = gMP.get_datetime_from_string( row.date_done );
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
        var seconds     = gMP.get_study_time_seconds( row );
        var s_hms       = gMP.get_time_to_string( seconds );
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
    getCategoryPlans:function( find_category, study_plans) { // category 별로 묶음
        var plan_list       = [];
        var plan_json       = {};
        var code_json       = {};
        var prev_date_from  = "";
        study_plans.sort( gMP.GetSortOrder( 'date_from') );    // date_from 으로정렬
        study_plans.forEach( function( row , index) {
            var date_from       = row.date_from;
            if ( row.category == find_category ) {
                if ( row.date_from != prev_date_from ) { // 일자가 변경되는 json 이 있을 때, list 에 추가
                    if ( Object.keys(plan_json).length > 0  ) {
                        plan_list.push( plan_json );
                    }
                    // 초기화
                    plan_json   = {};
                    plan_json[ "study_id" ]   = row.study_id ||'';
                    plan_json[ "mb_id" ]      = row.mb_id;
                    plan_json[ "date_from" ]  = row.date_from;
                    plan_json[ "date_to" ]    = row.date_to;
                    plan_json[ "date_started" ] = row.date_started ||'';
                    plan_json[ "date_done" ]  = row.date_done||'';
                    plan_json[ "category" ]   = row.category;
                    plan_json[ "subject" ]    = row.subject;
                    plan_json[ "num" ]       = row.num;
                    plan_json[ "subject_id" ] = row.member_subject_id;
                    plan_json[ "note" ]       = row.note;
                    //plan_json[ row.code ]       = row.plan;
                    plan_json[ row.code ]       = row.plan_name;
                    plan_json[ row.code + "_state" ]       = gMP.get_study_state( row );
                    study_time                  = row["study_time" ] || 0;
                    plan_json[ row.code + "_time" ]       = ( study_time > 0 ) ? gMP.get_time_to_string(study_time) : gMP.get_study_time_hms( row );
                    plan_json[ "day" ]          = gMP.get_day_from_string( row.date_from ); // 요일구하기
                    code_json[ row.code ] = 1;
                    //--- 
                    prev_date_from              =  row.date_from;
                }else{
                    plan_json[ row.code ]       = row.plan_name  // plan_name
                    plan_json[ row.code + "_state" ]       = gMP.get_study_state( row );
                    study_time                  = row["study_time" ] || 0;
                    plan_json[ row.code + "_time" ]       = ( study_time > 0 ) ? gMP.get_time_to_string(study_time) : gMP.get_study_time_hms( row );
                    code_json[ row.code ] = 1;
                }
            }else if ( find_category == "일자별" ) {
                if ( row.date_from != prev_date_from ) { // 일자가 변경되는 json 이 있을 때, list 에 추가
                    if ( Object.keys(plan_json).length > 0  ) {
                        plan_list.push( plan_json );
                    }
                    // 초기화
                    plan_json   = {};
                    plan_json[ "study_id" ]   = row.study_id ||'';
                    plan_json[ "mb_id" ]      = row.mb_id;
                    plan_json[ "date_from" ]  = row.date_from;
                    plan_json[ "date_to" ]    = row.date_to;
                    plan_json[ "date_started" ] = row.date_started ||'';
                    plan_json[ "date_done" ]  = row.date_done ||'';
                    plan_json[ "category" ]   = row.category;
                    plan_json[ "subject" ]    = row.subject;
                    plan_json[ "num" ]       = row.num;
                    plan_json[ "subject_id" ] = row.member_subject_id;
                    plan_json[ "note" ]       = row.note;
                    plan_json[ row.code ]       = row.plan_name;
                    plan_json[ row.code + "_state" ]       = gMP.get_study_state( row );
                    study_time                  = row["study_time" ] || 0;
                    plan_json[ row.code + "_time" ]       = ( study_time > 0 ) ? gMP.get_time_to_string(study_time) : gMP.get_study_time_hms( row );
                    plan_json[ "day" ]          = gMP.get_day_from_string( row.date_from ); // 요일구하기
                    code_json[ row.code ] = 1;
                    //--- 
                    prev_date_from              =  row.date_from;
                }else{
                    plan_json[ row.code ]       = row.plan_name
                    plan_json[ row.code + "_state" ]       = gMP.get_study_state( row );
                    study_time                  = row["study_time" ] || 0;
                    plan_json[ row.code + "_time" ]       = ( study_time > 0 ) ? gMP.get_time_to_string(study_time) : gMP.get_study_time_hms( row );
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
            if ( !gMP.isEmpty(code) ) {
                code_results.push( code );
            }
        });
        gMP.subject_code_json[ find_category ] = code_results;
        //
        return plan_list
    },
    get_subject_code_list: function( subject_plan_data ) {
        // code 목록 구하기
        let code_json       = {}
        subject_plan_data.forEach( function( plan, index ) {
            code_json[ plan.code ] = 1;
        });
        var code_list   = Object.keys( code_json )
        var code_results     = [];
        code_list.forEach( function( code, index ) {
            if ( !gMP.isEmpty(code) ) {
                code_results.push( code );
            }
        });
        return code_results;
    },
    get_code_html: function( subject ) {
        var subject_code_list   = gMP.subject_code_json[ subject ];
        var s_code_html = "<th>일 자</th>\n";
        subject_code_list.forEach( function( code, index ) {
            if ( ! gWS.isEmpty( code) ) {
                s_code_html += " <th class='text-center' > " + code + "</th>\n";
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
        var code_len    = gMP.subject_code_json[subject].length;
        if ( subject == "일자별") {     // 일자를 구해서 , 일자별묶음별로  교재별 일정을 표시
            let plan_date_list  = gMP.get_plan_date_list( gMP.subject_plan_json[ subject ] );
            $("#member_period").html( plan_date_list[0] + " ~ " + plan_date_list[ plan_date_list.length-1] );
            plan_date_list.forEach( function( plan_date, index ) {  // 일자별
                let plan_day  = gMP.get_day_from_string( plan_date );
                s_ps_con +="                                          <tr>\n";
                if ( plan_day == "토요일" || plan_day == "일요일" ) {
                    s_ps_con +="                                            <td  class='text-danger td_plan_date'>주 말</td>\n";
                } else {
                    s_ps_con +="                                            <td class='td_plan_date' >" + plan_date+ "</td>\n";
                }
                s_ps_con +="                                                <td colspan='" + code_len + "'></td>\n";     // 빈칸
                s_ps_con +="                                            </tr>\n";
                gMP.subject_list.forEach( function( subject, index ) {
                    if ( index > 0 ){   // 0번째 일자별은 제외
                        gMP.subject_plan_json[ subject ].forEach( function( plan , index ) {
                            if ( plan.date_from == plan_date ) { // 위에서 구한 일자이면
                                s_ps_con +="                                          <tr>\n";
                                if ( plan.day == "토요일" || plan.day == "일요일" ) {
                                    s_ps_con +="                                            <td  class='text-danger td_plan_subject'>"+plan.subject+"</td>\n";
                                } else {
                                    s_ps_con +="                                            <td class='td_plan_subject' >" + plan.subject + "</td>\n";
                                }
                                s_class = ""
                                gMP.subject_code_json[subject].forEach( function( code, index) {
                                    s_plan_val  = plan[ code ];
                                    if ( gMP.isEmpty( s_plan_val ) ) {
                                        s_plan_val      = "";
                                    }
                                    s_class     = "";
                                    state       = plan[ code + "_state" ];
                                    s_time      = plan[ code + "_time" ];
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
                                    s_ps_con +="                                            <td class='text-center' ><i class='" + s_class + "' aria-hidden='true'></i> " + s_plan_val +"</td>\n";
                                });
                                s_ps_con +="                                          </tr>\n";
                            }
                        }); // end 교재별 일정 gMP.subject_plan_json[ subject ]
                    }
                });  // end subject_list
            }); // end plan_date_list
        } else { // 교재별이면
            gMP.subject_plan_json[ subject ].forEach( function( plan , index ) {
                s_ps_con +="                                          <tr>\n";
                if ( plan.day == "토요일" || plan.day == "일요일" ) {
                    s_ps_con +="                                            <td  class='text-danger td_plan_date'>주 말</td>\n";
                } else {
                    s_ps_con +="                                            <td class='td_plan_date' >" + plan.date_from + "</td>\n";
                }
                s_class = ""
                gMP.subject_code_json[subject].forEach( function( code, index) {
                    s_plan_val  = plan[ code ];
                    if ( gMP.isEmpty( s_plan_val ) ) {
                        s_plan_val      = "";
                    }
                    s_class     = "";
                    state       = plan[ code + "_state" ];
                    s_time      = plan[ code + "_time" ];
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
                    s_ps_con +="                                            <td class='text-center' ><i class='" + s_class + "' aria-hidden='true'></i> " + s_plan_val +"</td>\n";
                });
                s_ps_con +="                                          </tr>\n";
            });
        }
        return s_ps_con;
    },
    load_member: function() {
        const   kakao_id        = $("#kakao_id").val();
        const   sel_kakao_id    = $(event.target).data("kakao");
        const   sel_mb_id       = $(event.target).data("id");
        let url         = "/kakao/plan_study_status/" + kakao_id + "?sel_kakao_id="+sel_kakao_id +"&sel_mb_id=" + sel_mb_id;
        location.href   = url;
    },
    fun_plan_category_title: function(pEvent, pThis) {
        let category             = $(pThis).data("category");
        if  ( gMP.mp_select_info.category != category ) { // 이전 선택한 category 와 다르면
            // subject 선택을 모두 해제
            $("#category_subject_all_check").prop("checked", true);
            $("#category_subject_all_check").trigger("click");  // 모두 해제
        }
        gMP.mp_select_info.category = category;
        gMP.fun_plan_category_check();
    },
    fun_count_subject_checked: function() { // 선택된 교재 갯수 확인
        let count   = 0;
        $("#table_subject_list input.subject_check").each(function(index, item) {
            if ( $(item).prop("checked") ) {
                count += 1;
            }
        });
        return count;
    },
    fun_plan_category_check: function() {
        let category            = gMP.mp_select_info.category;
        if ( category == "" ) {  // 모든 category 에 대해
            $("#table_subject_list tbody tr").each(function(index, item) {
                $(this).removeClass("hide");
            })
        }else {
            $("#table_subject_list tbody tr").each(function(index, item) {
                $(this).removeClass("hide").addClass("hide");
            })
            mb_subject_list.forEach( function( row , index) {
                if ( row.category == category ) {
                    let target  = $("#table_subject_list tbody tr[data-category='" + row.category+ "']");
                    target.each(function(index, item) {
                        $(this).removeClass("hide");
                    });
                }
            });
        };
        gMP.fun_mp_sel_clear();
        gMP.fun_mp_sel_set();
        gMP.fun_mp_sel_calc_show();
        gMP.make_context_menu();
    },
    fun_mp_sel_code: function(pEvent, pThis) {
        let code                = $(pThis).data("code");
        gMP.mp_select_info.code = code;
        gMP.fun_mp_sel_clear();
        gMP.fun_mp_sel_set();
        gMP.fun_mp_sel_calc_show();
        gMP.make_context_menu();
    },
    fun_mp_sel_code_check: function() {
        let code                = gMP.mp_select_info.code;
        if (code=="1.진도"){
            $("#code01_switch").trigger("click");
        }
        if (code=="2.복습"){
            $("#code02_switch").trigger("click");
        }
        if (code=="3.복습2"){
            $("#code03_switch").trigger("click");
        }
    },
    fun_find_subject_by_id: function(find_json) {
        let subject_id   = find_json.subject_id;
        let find_subject = {}
        mb_subject_list.forEach( function( row, index ) {
            if ( row.member_subject_id == subject_id ) {
                find_subject   = row;
                return row;
            }
        })
        return find_subject;
    },
    fun_mp_dblclick_plan: function(pEvent, pThis) {
        gMP.edit_sp_elem            = pThis;
        let plan_date                = $(pThis).data("plan_date");
        let study_id                 = $(pThis).data("study_id");
        // subject 정보 확인
        let subject_id               = $(pThis).data("subject_id");
        let find_json               = { 'subject_id': subject_id }
        let sel_subject_info        = gMP.fun_find_subject_by_id( find_json );
        let subject_info            = ""
        if ( Object.keys(sel_subject_info).length > 0 ) {
            subject_info            = sel_subject_info.subject + " " + sel_subject_info.num + "권";
        }
        // study 정보 확인
        find_json                   = { 'study_id': study_id };
        let sel_study_plan          = gWS.find_study_plan_by_id( find_json );
        let sel_plan                = sel_study_plan.plan;
        let reg_find                = /(\d{0,5})(.*)/;
        let findArr                 = reg_find.exec( sel_plan );
        let plan_num                = findArr[1];
        let plan_text               = findArr[2]
        $("#edit_sp_study_id").val( sel_study_plan.study_id );
        $("#edit_sp_subject_id").val( sel_study_plan.subject_id );
        $("#edit_sp_subject").val( sel_study_plan.subject );
        $("#edit_sp_subject_info").val( subject_info );
        $("#edit_sp_code").val( sel_study_plan.code );
        $("#edit_sp_date_from").val( sel_study_plan.date_from );
        $("#edit_sp_date_to").val( sel_study_plan.date_to );
        $("#edit_sp_date_started").val( sel_study_plan.date_started );
        $("#edit_sp_date_done").val( sel_study_plan.date_done );
        $("#edit_sp_plan_num").val( plan_num );
        $("#edit_sp_plan_text").val( plan_text );
        $("#edit_sp_note").val( sel_study_plan.note );
        $("#edit_sp_flag").val( sel_study_plan.flag );
        $("#edit_sel_plan").modal('show');
    },
    fun_mp_sp_update: function() {
        new_plan        = $("#edit_sp_plan_num").val() + $("#edit_sp_plan_text").val();
        let s_html      = $(gMP.edit_sp_elem).html();
        let new_html    = s_html.substring(0, s_html.indexOf("</i>")+4);
        new_html        += new_plan;
        $(gMP.edit_sp_elem).html( new_html );
        // study 정보 확인
        let study_id                = $(gMP.edit_sp_elem).data("study_id");
        find_json                   = { 'study_id': study_id };
        let sel_study_plan          = gWS.find_study_plan_by_id( find_json );
        sel_study_plan["plan"]      = new_plan;
        var json_data               = {"url":"/app/admin/api/edit_sel_plan_row", "mode":"update" };
        sel_study_plan["url"]       = json_data.url;
        sel_study_plan["mode"]      = json_data.mode;
        gWS.ajaxPostApi( sel_study_plan, gMP.fun_mp_sp_update_done);    // 서버에 ajax 호출
        
    },
    fun_mp_sp_update_done: function(result){
        console.log('fun_mp_sp_update_done', 'result', result );
        if ( result.result <= 0 ) {
            gWS.alert_msg( result.error, '변경 에러', 'Material' );
        }else{
            //
            $("#edit_sel_plan").modal('hide');
        }
    },
    fun_mp_sel_plan: function(pEvent, pThis) {
        let plan_date                = $(pThis).data("plan_date");
        gMP.mp_select_info.code      = $(pThis).data("code");
        if ( pEvent.shiftKey ) {
            gMP.mp_select_info.date_to = plan_date;
        } else {
            gMP.mp_select_info.date_from = plan_date;
            gMP.mp_select_info.date_to   = plan_date;
            gMP.fun_mp_sel_code(pEvent, pThis); // code 처리
        }
        console.log("fun_mp_sel_plan category:" + gMP.mp_select_info.category + " code:"+ gMP.mp_select_info.code + " from:"+gMP.mp_select_info.date_from + " to:" + gMP.mp_select_info.date_to  );
        gMP.fun_mp_sel_clear();
        gMP.fun_mp_sel_set();
        gMP.fun_mp_sel_calc_show();
        gMP.make_context_menu();
    },
    fun_mp_sel_clear: function() {
        $("td.mp_sel_plan.mp_code").each(function(e) {
            $(this).removeClass("mp_selected");
            $(this).removeClass("mp_context_menu");
        });
    },
    fun_mp_sel_set: function() {
        let count               = 0;
        let max_date            = "";
        gMP.mp_select_plan      = [];
        $("td.mp_sel_plan.mp_code").each(function(index, target) {
            let category        = $(target).data("category");
            let code            = $(target).data("code");
            let plan            = $(target).data("plan");
            let plan_date       = $(target).data("plan_date");
            let note            = $(target).data("note");
            let selected        = false;
            if ( plan_date <= gMP.mp_select_info.date_to 
                && plan_date >=gMP.mp_select_info.date_from ) {
                    if ( gMP.mp_select_info.code > '' ) {    //--  선택된 진도 구분이 있으면
                        if (code == gMP.mp_select_info.code ) {  // 동일한 코드만 
                            if ( gMP.mp_select_info.category > '' ) {    //--  선택된 과목이 있으면
                                if ( category == gMP.mp_select_info.category ) {    // 선택한 과목과 동일하면   
                                    selected    = true
                                }
                            } else {    //  선택한 과목이 없으면 모두 선택
                                    selected    = true;
                            }
                        }
                    }else {  // 선택된 코드가 없으면 , 즉  진도, 복습, 복습2 모두이면
                            if ( gMP.mp_select_info.category > '' ) {    //--  선택된 과목이 있으면
                                if ( category == gMP.mp_select_info.category ) {    // 선택한 과목과 동일하면   
                                    selected    = true;
                                }
                            } else {    //  선택한 과목이 없으면 모두 선택
                                    selected    = true;
                            }
                    }
                    if ( plan_date >= max_date ) max_date    = plan_date;
            }
            if ( selected) {
                $(target).addClass("mp_selected");
                $(target).removeClass("mp_context_menu").addClass("mp_context_menu");
                if ($(target).hasClass("mp_count")) {
                    let study_id    = $(target).data("study_id");
                    let subject_id  = $(target).data("study_id");
                    count   += 1;
                    let sel_row = {
                            "study_id": study_id,
                            "subject_id": subject_id,
                            "category": category,
                            "code": code,
                            "plan": plan,
                            "plan_date": plan_date,
                            "note": note,
                        }
                    gMP.mp_select_plan.push ( sel_row );
                }
            }
        });
        gMP.mp_select_info.count    = count;    //  대상건수 
        if ( gMP.mp_select_info.date_to == gMP.mp_select_info.date_from  ) { // date_to 자동계산
            gMP.mp_select_info.date_to  = max_date;    //  대상건수 
        }
    },
    fun_mp_sel_calc_show: function() {  // 선택한 대상 건수를 화면에 표시
        let category        = "전체";
        let code            = "전체";
        let date_from       = "";
        let date_to         = "";
        let count           = "0";
        if ( gMP.mp_select_info.category > "")  category = gMP.mp_select_info.category;
        if ( gMP.mp_select_info.code > "")      code = gMP.mp_select_info.code;
        if ( gMP.mp_select_info.date_from > "") date_from = gMP.mp_select_info.date_from + " 부터";
        if ( gMP.mp_select_info.date_to > "")   date_to = " ~ " + gMP.mp_select_info.date_to + " 까지";
        if ( gMP.mp_select_info.count > 0)      count = gMP.mp_select_info.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 건";
        $("#move_category").html( category );
        $("#move_code").html( code );
        $("#move_date_from").html( date_from );
        $("#move_date_to").html( date_to );
        $("#move_count").html( count );
        $("#move_new_date_from").html( date_from );
        // delete
        $("#delete_category").html( category );
        $("#delete_code").html( code );
        $("#delete_date_from").html( date_from );
        $("#delete_date_to").html( date_to );
        $("#delete_count").html( count );
    },
    make_context_menu:function(){
        $.contextMenu( 'destroy' );
        $(function() {
            $.contextMenu({
                selector: '.mp_context_menu', 
                callback: function(key, options) {
                    if ( "menu: move delete edit".indexOf( key ) > 0 ) {
                        $("#a_plan_tab_" + key ).trigger("click");
                        if ( key == 'move' ) {
                            if ( gMP.mp_select_info.date_from ) {
                                $("#move_new_date_from").val( gMP.mp_select_info.date_from );
                            }
                        }
                    }
                },
                items: {
                    "move": {name: "이동", icon: "fa-arrows-v", accesskey: "m"},
                    "delete": {name: "삭제", icon: "fa-scissors", accesskey: "d"},
                    "sep1": "---------",
                    "edit": {name: "변경", icon: "fa-pencil", accesskey: "e"},
                    "sep1": "---------",
                    "close": {name: "닫기", icon: "fa-times", accesskey: 'c' }
                }
            });

        });
    },
}
$(window).on ('load', function (){
    
    gMP.change_category_option();
    gMP.change_subject_option();

    // 
    if ( 1==1){
        let s_mb_subject_list  = JSON.stringify( mb_subject_list );
        $("#make_plan_mb_subject").val( s_mb_subject_list );
    }
    $("#make_plan_category").on("change", function(e) {
        var make_plan_category  = $("#make_plan_category").val();
        gMP.subject_list        = gMP.get_subject_list( make_plan_category ); 
        gMP.change_subject_option();
    })

    $(".onoffswitch-checkbox").on("change", function(e) {
        $(".onoffswitch-checkbox").each(function(e) {
            gMP.change_bg_input( this );    // switch on 되면 input box bg color 변경
        });
    });
    $("#category_subject_all_check").on("change", function(e) {
        const is_checked    = $(this).prop("checked");
        $(".category_subject_check").each(function(index, item) {
            $(item).prop("checked", !is_checked );
            $(item).trigger("click" );
        });
    });
    $(".category_subject_check").on("change", function(e) {
        const is_checked    = $(this).prop("checked");
        const group         = $(this).data("group");
        $(".subject_check." + group).each(function(index, item) {
            $(item).prop("checked", !is_checked );
            $(item).trigger("click" );
        });
    });
    $(".subject_check").on("change", function(e) {
        $(".subject_check").each(function(index, item) {
            gMP.change_subject_bg_input( item );    // 과목선택시  input box bg color 변경
        });
        if ( gMP.fun_count_subject_checked() > 0 ){    //  선택된 교재가 있으면 플랜옵션 화면 보이기
            $("div.plan_option").removeClass("hide");
        } else {
            $("div.plan_option").removeClass("hide").addClass("hide");
        };
    });
    $(".plan-method").on("change", function(e) {
        $(".plan-method").each(function(e) {
            gMP.change_method_bg_input( this );    // 선택한 method 에 따른 입력항목 bg color 변경
        });
    });

    $("#frm_make_plan").on("submit", function( event ){
        event.preventDefault();
        let json_data   = gMP.prepare_data();     // plan 생성용 입력조건확인
        if (gMP.check_form_data( json_data ) ) {
            gMP.preview_plan();
        }
    });
   
    $("td.td_subject").on("click", function(){
            const   s_no    = $(event.target).data("no");
            let checked     = $("#subject"+ s_no + "_check").prop('checked' );
            $("#subject"+ s_no + "_check").prop('checked', !checked );
    })

    if ( true ) {   // 선택된 switch 에 따른 화면처리 등 화면 초기화
        $(".onoffswitch-checkbox").each(function(e) {
            gMP.change_bg_input( this );    // switch on 되면 input box bg color 변경
        });

        $("#subject01_check").trigger('click');
    }
    $("#table_list .member").on("click", function(){
        gMP.load_member();    
    })
    $("#table_subject_list div.set_center").on("click", function(){
            const   line    = $(event.target).data("line")
            let     start   = $("#subject" + line + "_start_page").val();
            let     end     = $("#subject" + line + "_end_page").val();
            let     center  = parseInt( ( parseInt(end) - parseInt(start) ) / 2 );
            $("#subject" + line + "_start_page").val( center );
    })
    $("#set_study_from_to").on("click", function(){
        event.preventDefault();
        var json_data               = {"url":"/app/admin/api/member_study_from_to", "mode":"update" };
        json_data["sel_mb_no"]          = $("#sel_mb_no").val();
        json_data["sel_mb_id"]          = $("#sel_mb_id").val();
        json_data["mb_study_start"]     = $("#make_plan_mb_study_start").val();
        json_data["mb_study_end"]       = $("#make_plan_mb_study_end").val();
        gWS.ajaxPostApi( json_data, gMP.fun_study_from_to);    // 서버에 ajax 호출
    })
    $("#set_svc_from_to").on("click", function(){
        event.preventDefault();
        var json_data               = {"url":"/app/admin/api/member_svc_from_to", "mode":"update" };
        json_data["sel_mb_no"]      = $("#sel_mb_no").val();
        json_data["sel_mb_id"]      = $("#sel_mb_id").val();
        json_data["mb_svc_start"]   = $("#make_plan_mb_svc_start").val();
        json_data["mb_svc_end"]     = $("#make_plan_mb_svc_end").val();
        gWS.ajaxPostApi( json_data, gMP.fun_svc_from_to);    // 서버에 ajax 호출
    })
    $("#btn_save_plan").on("click", function(){
        event.preventDefault();
        var json_data               = {"url":"/app/admin/api/save_plan", "mode":"update" };
        json_data["sel_mb_id"]      = $("#sel_mb_id").val();
        json_data["sel_mb_no"]      = $("#sel_mb_no").val();
        json_data["mb_study_start"] = $("#make_plan_mb_study_start").val();
        json_data["mb_study_end"]   = $("#make_plan_mb_study_end").val();
        json_data["mb_svc_start"]   = $("#make_plan_mb_svc_start").val();
        json_data["mb_svc_end"]     = $("#make_plan_mb_svc_end").val();
        if ( $("#auto_date_to").prop("checked") ) {
            json_data["auto_date_to"]   = "Y";
        }else {
            json_data["auto_date_to"]   = "";
        }
        new_json                    = {}
        gMP.mp_plans.forEach( function( row , index) {
            let new_key         = row.category + "_" + row.date_from;
            let new_row         = {
                subject: row.category,
                subject_id: row.subject_id,
                date_from: row.date_from,
                date_to: row.date_to,
                mb_id: row.mb_id,
                mb_name: row.mb_name,
                }
            let plan_row    = new_json[ new_key ] || new_row;
            let code        = row.code;
            code            = code.replace("2.복습1", "2.복습")
            let code_idx    = code.split(".")[0];
            let code_name   = code.split(".")[1];
            plan_row["code" + code_idx] = code_name;
            plan_row["plan" + code_idx] = row.plan_name;
            plan_row["note" + code_idx] = row.note;
            plan_row["subject_id" + code_idx] = row.subject_id;
            new_json[ new_key ]     = plan_row; 
        });
        new_plans                   = []
        $.each( new_json, function(i, val) {
            new_plans.push( val );
        });
        json_data["mp_plans"]       = JSON.stringify( new_plans )
        gWS.ajaxPostApi( json_data, gMP.fun_save_plan);    // 서버에 ajax 호출
    })
    $(".mp_plan_nav").on("click", function(){
        if ( this.id == "a_plan_tab_edit" ) {
            $("#div_show_plan").removeClass("hide");
        }else{
            $("#div_show_plan").removeClass("hide").addClass("hide");
        }
    }),
    $("#btn_plan_move").on("click", function(){
        event.preventDefault();
        var json_data               = {"url":"/app/admin/api/move_plan", "mode":"update" };
        json_data["sel_mb_id"]      = $("#sel_mb_id").val();
        json_data["sel_mb_no"]      = $("#sel_mb_no").val();
        new_date_from               = $("#move_new_date_from").val();
        if ( new_date_from == '' ) {
            gWS.alert_msg("이동 시작일을 입력바랍니다");
            $("#move_new_date_from").focus();
            return false;
        }
        gMP.mp_select_info.new_date_from    = new_date_from;
        json_data["mp_select_info"] = JSON.stringify( gMP.mp_select_info );
        json_data["mp_select_plan"] = JSON.stringify( gMP.mp_select_plan );
        gWS.ajaxPostApi( json_data, gMP.fun_move_plan);    // 서버에 ajax 호출
    }),
    $("#btn_plan_delete").on("click", function(){
        event.preventDefault();
        var json_data               = {"url":"/app/admin/api/delete_plan", "mode":"update" };
        json_data["sel_mb_id"]      = $("#sel_mb_id").val();
        json_data["sel_mb_no"]      = $("#sel_mb_no").val();
        json_data["mp_select_info"] = JSON.stringify( gMP.mp_select_info );
        json_data["mp_select_plan"] = JSON.stringify( gMP.mp_select_plan );
        gWS.ajaxPostApi( json_data, gMP.fun_delete_plan);    // 서버에 ajax 호출
    })
    $("#btn_edit_sp_submit").on("click", function(){
        gMP.fun_mp_sp_update();  // 선택한 plan 수정
    })
    $(".set-date").on("click", function(){
        let plus_day    = $(this).data("plus_day");
        let from        = $(this).data("from");
        let target      = $(this).data("target");
        let new_date    = gWS.get_YyMmDd_add_day( $("#" + from).val(), parseInt(plus_day));
        $("#" + target).val( new_date);
    })
    $("#code01_term").on("change", function(){
        $("#code01_method_term").prop("checked", true )
        $("#code01_method_page").prop("checked", false )
        $("#code01_method_date").prop("checked", false )
    })
    $("#code01_page").on("change", function(){
        $("#code01_method_term").prop("checked", false )
        $("#code01_method_page").prop("checked", true )
        $("#code01_method_date").prop("checked", false )
    })
    $("#code01_date").on("change", function(){
        $("#code01_method_term").prop("checked", false )
        $("#code01_method_page").prop("checked", false )
        $("#code01_method_date").prop("checked", true )
    })

    $("#code02_term").on("change", function(){
        $("#code02_method_term").prop("checked", true )
        $("#code02_method_page").prop("checked", false )
        $("#code02_method_date").prop("checked", false )
    })
    $("#code02_page").on("change", function(){
        $("#code02_method_term").prop("checked", false )
        $("#code02_method_page").prop("checked", true )
        $("#code02_method_date").prop("checked", false )
    })
    $("#code02_date").on("change", function(){
        $("#code02_method_term").prop("checked", false )
        $("#code02_method_page").prop("checked", false )
        $("#code02_method_date").prop("checked", true )
    })
    $("#code03_term").on("change", function(){
        $("#code03_method_term").prop("checked", true )
        $("#code03_method_page").prop("checked", false )
        $("#code03_method_date").prop("checked", false )
    })
    $("#code03_page").on("change", function(){
        $("#code03_method_term").prop("checked", false )
        $("#code03_method_page").prop("checked", true )
        $("#code03_method_date").prop("checked", false )
    })
    $("#code03_date").on("change", function(){
        $("#code03_method_term").prop("checked", false )
        $("#code03_method_page").prop("checked", false )
        $("#code03_method_date").prop("checked", true )
    })
    $("#toggle_btn").trigger("click");
});

