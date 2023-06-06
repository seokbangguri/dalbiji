/*
    wizice
*/

let selected_subject = {};

function fun_init() {
    let date_start  = new Date() ;
    let date_end  = new Date() ;
    date_end.setDate(date_start.getDate() + 30);
    $('#new_member_start').datepicker("setDate", date_start ); // 신규 회원추가시 서비스 시작일 기본값
    $('#new_member_end').datepicker("setDate", date_end );
    $('#new_subject_member_start').datepicker("setDate", date_start ); // 신규 교재추가시 서비스 시작일 기본값
    $('#new_subject_member_end').datepicker("setDate", date_end );
}
function fun_member_new(result){
    console.log('fun_member_new', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '회원 추가 에러', 'Material' );
    }else{
        gWS.dialog_msg( '추가되었습니다.', '회원', 'Material' );
        location.reload();
    }
};
function fun_member_delete(result){
    console.log('fun_member_delete', 'result', result );
    if ( result.error > '' ) {
        gWS.alert_msg( result.error, '탈퇴 에러', 'Material' );
    } else {
        gWS.dialog_msg( '탈퇴되었습니다.', '회원', 'Material' );
        location.href = "/app/admin/member";
    }
};
function fun_member_edit(result){
    console.log('fun_member_edit', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '수정 에러', 'Material' );
    } else {
        gWS.dialog_msg( '수정되었습니다.', '회원', 'Material' );
        location.reload();
    }
};
function show_select_subject_name(){
    // 현재 선택한 교재를 화면에 표시
    let subject_id_list  = Object.keys( selected_subject );
    let s_html  = "";
    subject_id_list.forEach(function( subject_id ){
        subject_row      = selected_subject[ subject_id ];
        if ( subject_row.select == "Y" ) {
            s_html      += `<li> ${ subject_row.text} 
                                  <a href="javascript:fun_pop_subject_id(${subject_id});" ><i class='fa fa-times'></i> 제외</a>
                            </li>\n 
                            `;
        }
    });
    $("#new_subject_names").html( s_html);
}
function fun_pop_subject_id( subject_id ){
    // 선택한 교재 제외처리
    const   tr_id   = "#tr_new_subject_" + subject_id;
    selected_subject[ subject_id ].select = "";
    $( tr_id ).removeClass("bg-success");
    show_select_subject_name();  // 선택된 교재정보를 화면에 표시
}
function fun_subject_member_new(result){
    console.log('fun_subject_member_new', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '교재 추가 에러', 'Material' );
    }else{
        gWS.dialog_msg( '추가되었습니다.', '교재', 'Material' );
        location.reload();
    }
};
function fun_subject_member_delete(result){
    console.log('fun_subject_member_delete', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '탈퇴 에러', 'Material' );
    } else {
        gWS.dialog_msg( '탈퇴되었습니다.', '교재 가입회원', 'Material' );
        location.reload();
    }
};
function fun_subject_member_edit(result){
    console.log('fun_subject_member_edit', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '수정 에러', 'Material' );
    } else {
        gWS.dialog_msg( '수정되었습니다.', '교재 가입회원', 'Material' );
        location.reload();
    }
};

function fun_make_push(result) {
    console.log('fun_make_push', 'result', result );
    if ( result.result < 0 ) {
        gWS.alert_msg( result.error, '발송 에러', 'Material' );
    } else if ( result.result == 0 ) {
        gWS.alert_msg( result.error, '발송 에러<br><br><h4>대상이 없습니다.', 'Material' );
    } else {
        gWS.dialog_msg( '발송되었습니다.', '발송완료', 'Material' );
    }
}
function fun_init_password(){
    var json_data    = {"url":"/app/admin/init_password" };
    var user_id         = $("#sel_user_info").data('id');
    var user_no         = $("#sel_user_info").data('no');
    var txt_password    = $("#txt_init_password").val();
    json_data["user_id"]          = user_id;
    json_data["user_no"]          = user_no;
    json_data["password"]         = txt_password;
    gWS.ajaxPost( json_data, fun_after_init_password);    // 서버에 ajax 호출
}
function fun_after_init_password(result){
    console.log('fun_after_init_password', 'result', result );
    if ( result.result < 0 ) {
        gWS.alert_msg( result.error, '초기화 에러', 'Material' );
    } else if ( result.result == 0 ) {
        gWS.alert_msg( result.error, '초기화 에러<br><br><h4>대상이 없습니다.', 'Material' );
    } else {
        const s_password    = result.password;
        gWS.dialog_msg( s_password + '로 초기화되었습니다.', '초기화완료', 'Material' );
        $("#init_password").modal("hide");
    }
}
function sel_member(e){
    // 회원을 선택시
    if (!e){
        return;
    }
    let sel_mb_id     = $(e).data("mb_id");
    if (sel_mb_id){
        gWS.showProgressBar("show");
        setTimeout( function() { location.href       = '/app/admin/member?sel_mb_id=' + sel_mb_id; }, 100 );
    }
}
$(document).ready(function(){
    fun_init();  // 초기화, 서비스가입일 기본설정등

    if($('#table_member_list').length > 0) {
        gWS.dataTable = $('#table_member_list').DataTable();
        gWS.dataTable.destroy();

        gWS.dataTable = $('#table_member_list').DataTable({
            "bFilter": true,
            "bPaginate": true,
            "bInfo": false,
            "bAutoWidth": false,
            "bLengthChange": false,
            "ordering": true,
            "order": [ [ 0, 'asc'] ],
            "select": {
                "style": 'multi'
            },
            otherOptions: {},
            initComplete: function() {
                $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
                let sel_mb_id   = $("#sel_mb_id").val();
                let mb_id       = $("#mb_id").val();
                if ( sel_mb_id != mb_id && sel_mb_id > "") {
                     $("div#table_member_list_filter input").val( sel_mb_id );
                     gWS.dataTable.search( sel_mb_id ).draw();
                }
            },
            "columnDefs": [
                { "width": "10%", "targets": 0 },
                { "width": "30%", "targets": 1 },
                { "width": "30%", "targets": 2 },
              ]
        });
    }


    $("#btn_download").on('click', function() {
        gWS.showProgressBar("show");
        url = "/app/admin/member_download?ts=" + gWS.get_YyMmDd_HhMmSs_String(new Date());
        location.href   = url;
        setTimeout( function() { gWS.showProgressBar(); }, 2000 );
    });

    $("#btn_search").on('click', function() {
        const   USER_ID = $("#USER_ID").val();
        let url = "/app/admin/member";
        if ( USER_ID > "" ){
            url  += "?USER_ID=" + USER_ID;
            url  += "&ts=" + gWS.get_YyMmDd_HhMmSs_String();
        }else{
            url  += "?ts=" + gWS.get_YyMmDd_HhMmSs_String();
        }
        gWS.showProgressBar("show");
        location.href = url;
    });
    $("#btn_make_push").on('click', function() {
        var json_data    = {"url":"/app/admin/make_push" };
        json_data["group"]          = "all";
        gWS.ajaxPost( json_data, fun_make_push);    // 서버에 ajax 호출
    });
    $("#btn_upload").on('click', function() {
        $("#file").val("");
        $("#file").trigger("click");
    });
    $("#file").on('change', function() {
        let files    = $("#file")[0].files;
        if (gWS.isEmpty( files) || files.length <=0 ){
            console.log("선택된 파일이 없음");
        } else{
            gWS.showProgressBar("show");
            $("#excelupload_form").submit();
        }
    });
    $("#delete_member_row").on("show.bs.modal", function( event) {
        // member 탈퇴
        var button      = $(event.relatedTarget);
        var mb_id       = button.data('mb_id');
        var mb_name     = button.data('mb_name');
        $("#del_member_id").val( mb_id );
        $("#del_member_name").val( mb_name );
    });
    $("#edit_member_row").on("show.bs.modal", function( event) {
        var button      = $(event.relatedTarget);
        var mb_id       = button.data('mb_id');
        var mb_name     = button.data('mb_name');
        var mb_hp       = button.data('mb_hp');
        $("#edit_member_id").val( mb_id );
        $("#edit_member_name").val( mb_name );
        $("#edit_member_hp").val( mb_hp );
        return true;
    });
    $("#init_password").on("show.bs.modal", function( event) {
        var button      = $(event.relatedTarget);
        var user_id     = button.data('id');
        var user_no     = button.data('no');
        $("#sel_user_info").data("id", user_id );
        $("#sel_user_info").data("no", user_no );
    });
    $("#btn_init_password").on("click", function( event) {
        fun_init_password();
    });
    $("#btn_new_member_submit").on("click", function( event) {
        // 선택한 회원 추가
        var json_data           = {"url":"/app/admin/api/member", "mode":"save" };
        let mb_id               = $("#new_member_id").val();  
        let mb_name             = $("#new_member_name").val();
        let mb_password         = $("#new_member_password").val();
        let mb_password2        = $("#new_member_password2").val();
        if ( gWS.isEmpty(mb_id) ) {
            gWS.alert_msg("회원ID 을 입력바랍니다.");
            return false;
        }
        if ( gWS.isEmpty(mb_name) ) {
            gWS.alert_msg("회원명을 입력바랍니다.");
            return false;
        }
        if ( mb_password != mb_password2 ) {
            gWS.alert_msg("비밀번호가 다릅니다.");
            return false;
        }
        
        json_data["mb_id"]      = mb_id;
        json_data["mb_name"]    = mb_name;
        json_data["mb_password"]= mb_password;
        json_data["mb_password2"]= mb_password2;
        gWS.ajaxPostApi( json_data, fun_member_new);    // 서버에 ajax 호출
    });
    $("#btn_delete_member_submit").on("click", function( event) {
        var json_data           = {"url":"/app/admin/api/member", "mode":"delete" };
        var mb_id               = $("#del_member_id").val();
        var mb_name             = $("#del_member_name").val();
        json_data["mb_id"]      = mb_id;
        json_data["mb_name"]    = mb_name;
        gWS.ajaxPostApi( json_data, fun_member_delete);    // 서버에 ajax 호출
    });
    $("#btn_edit_member_submit").on("click", function( event) {
        var json_data    = {"url":"/app/admin/api/member", "mode":"edit" };
        var mb_id               = $("#edit_member_id").val();
        var mb_name             = $("#edit_member_name").val();
        var mb_hp               = $("#edit_member_hp").val();
        json_data["mb_id"]      = mb_id;
        json_data["mb_name"]    = mb_name;
        json_data["mb_hp"]      = mb_hp;
        gWS.ajaxPostApi( json_data, fun_member_edit);    // 서버에 ajax 호출
    });
    $("#add_subject_member_row").on("show.bs.modal", function( event) {
        // 교재에 회원추가
        var button      = $(event.relatedTarget);
        gWS["dataTableNewRoomMember"] = $('#table_new_subject_list').DataTable();
        gWS.dataTableNewRoomMember.destroy();

        gWS.dataTableNewRoomMember = $('#table_new_subject_list').DataTable({
            "bFilter": true,
            "bPaginate": true,
            "bInfo": false,
            "bAutoWidth": false,
            "bLengthChange": false,
            "ordering": true,
            "order": [ [ 0, 'asc'] ],
            "columnDefs": [
                { "width": "30%", "targets": 0 },
              ]
        });
    });
    $("tr.tr_new_subject").on("click", function( event) {
        // 새로 추가할 교재을 선택시, selected_subject 에 선택된 subject 저장, 나중에 ajax로 전송하기 위해
        let sel_mb_id     = $("#sel_mb_id").val();  // 현재 선택한 subject_id
        if ( $(this).hasClass("bg-success") ) {
            $(this).removeClass("bg-success");
            let subject_id         = $(this).data("subject_id");
            let sel_text       = $(this).data("text");
            selected_subject[ subject_id ]  = {"subject_id": subject_id, "text": sel_text, "select": "" }
            show_select_subject_name();  // 선택된 subject 정보를 화면에 표시
        }else {
            $(this).addClass("bg-success");
            let subject_id         = $(this).data("subject_id");
            let sel_text       = $(this).data("text");
            selected_subject[ subject_id ]  = {"subject_id": subject_id, "text": sel_text, "select": "Y" }
            show_select_subject_name();  // 선택된 subject 정보를 화면에 표시
        }
    });
    $("#btn_new_subject_member_submit").on("click", function( event) {
        // 선택한 회원에게 교재 추가
        var json_data           = {"url":"/app/admin/api/subject_member", "mode":"save_subject" };
        let sel_mb_id           = $("#sel_mb_id").val();  // 현재 선택한 mb_id
        let sel_mb_no           = $("#sel_mb_no").val();  // 현재 선택한 mb_no
        subject_id_list          = [];
        key_list          = Object.keys( selected_subject );
        key_list.forEach(function( pkey ){
            sel_row    = selected_subject[ pkey ];
            if ( sel_row.select == "Y" ) {
                subject_id_list.push( pkey );
            }
        });
        if ( subject_id_list.length <= 0 ) {
            gWS.alert_msg("회원에게 추가할 교재를 선택해주십시요.");
            return ;
        }
        
        json_data["sel_mb_id"]          = sel_mb_id;
        json_data["sel_mb_no"]          = sel_mb_no;
        json_data["date_start"]     = $("#new_subject_member_start").val();
        json_data["date_end"]       = $("#new_subject_member_end").val();
        json_data["subject_id_list"]     = JSON.stringify( subject_id_list );
        gWS.ajaxPostApi( json_data, fun_subject_member_new);    // 서버에 ajax 호출
    });
    $("#btn_delete_subject_member_submit").on("click", function( event) {
        var json_data           = {"url":"/app/admin/api/subject_member", "mode":"delete" };
        var del_r_m_id          = $("#del_r_m_id").val();
        json_data["subject_member_id"]    = del_r_m_id;
        json_data["mb_id"]    = $("#del_subject_member_id").val();
        gWS.ajaxPostApi( json_data, fun_subject_member_delete);    // 서버에 ajax 호출
    });
    $("#btn_edit_subject_member_submit").on("click", function( event) {
        var json_data    = {"url":"/app/admin/api/subject_member", "mode":"edit" };
        var edit_r_m_id         = $("#edit_r_m_id").val();
        json_data["subject_member_id"]        = edit_r_m_id;
        json_data["mb_id"]                  = $("#edit_subject_member_id").val();
        json_data["date_start"]            = $("#edit_subject_member_start").val();
        json_data["date_end"]              = $("#edit_subject_member_end").val();
        if (json_data["date_start"] == "" || json_data["date_end"] == "" ) {
            gWS.alert_msg( "서비스 일자 입력", '일자를 정확히 입력바랍니다.', 'Material' );
            return;
        }
        if (json_data["date_start"] > json_data["date_end"]  ) {
            gWS.alert_msg( "서비스 일자 입력", '서비스 종료일은 시작일 이후여야 합니다.', 'Material' );
            return;
        }
        gWS.ajaxPostApi( json_data, fun_subject_member_edit);    // 서버에 ajax 호출
    });
    $("#delete_subject_member_row").on("show.bs.modal", function( event) {
        // subject 제외
        var button      = $(event.relatedTarget);
        var r_m_id      = button.data('subject_member_id');
        var sel_mb_no   = button.data('mb_no');
        var sel_mb_id   = $("#sel_mb_id").val();
        var sel_mb_name = $("#sel_mb_name").val();
        var s_text      = button.data('text');
        var subject     = button.data('subject');
        var date_start  = button.data('date_start');
        var date_end    = button.data('date_end');
        $("#del_r_m_id").val( r_m_id );
        $("#del_subject_member_id").val( sel_mb_id );
        $("#del_subject_member_name").val( sel_mb_name );
        $("#del_subject").val( s_text );
    });
    $("#edit_subject_member_row").on("show.bs.modal", function( event) {
        var button      = $(event.relatedTarget);
        var r_m_id      = button.data('subject_member_id');
        var mb_id       = button.data('mb_id');
        var mb_name     = button.data('mb_name');
        var subject_name   = button.data('subject_name');
        var date_start  = button.data('date_start');
        var date_end    = button.data('date_end');
        if ( gWS.isEmpty( date_start ) ) return ;
        $("#edit_r_m_id").val( r_m_id );
        $("#edit_subject_member_id").val( mb_id );
        $("#edit_subject_member_name").val( mb_name );
        $("#edit_subject_name").val( subject_name );
        $('#edit_subject_member_start').datepicker("setDate", gWS.get_date_from_string(date_start) ); // 서비스 시작일
        $('#edit_subject_member_end').datepicker("setDate", gWS.get_date_from_string(date_end) );
        return true;
    });
   
    $("#a_admin_menu").trigger("click"); 
    $("#a_title").html("회원관리");

    //$("a.mb.mb_name").on("click", function( event) {
    //    sel_member();
    //});
});
