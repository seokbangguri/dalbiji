/*
    wizice
*/

let seleted_subject_member  = {};

function fun_init() {
    let today_date   = new Date();
    let date_start   = gWS.get_YyMmDd_add_day( today_date, 0  )
    let date_end     = gWS.get_YyMmDd_add_day( today_date, 365  )
    $('#new_subject_member_start').val( date_start ); // 신규 교재의 회원추가시 서비스 시작일 기본값
    $('#new_subject_member_end').val( date_end );
}
function readImageDisplay(input, id) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#' + id).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function show_select_member_name(){
    // 현재 선택한 회원정보를 화면에 표시
    let sel_subject_id     = $("#sel_subject_id").val();  // 현재 선택한 subject_id
    let sel_subject_id_info  = seleted_subject_member[ sel_subject_id ] || {};
    let mb_no_list  = Object.keys(sel_subject_id_info);
    let s_html  = "";
    mb_no_list.forEach(function( mb_no ){
        mb_row      = sel_subject_id_info[ mb_no ];
        if ( mb_row.select == "Y" ) {
            s_html      += `<li> ${ mb_row.mb_name} ( ${ mb_row.mb_id} ) 
                                  <a href="javascript:fun_pop_mb_no(${mb_no});" ><i class='fa fa-times'></i> 제외</a>
                            </li>\n 
                            `;
        }
    });
    $("#new_subject_member_names").html( s_html);
}

function fun_pop_mb_no( mb_no ){
    // 선택한 회원은 제외처리
    const   tr_id   = "#tr_new_member_" + mb_no;
    let sel_subject_id     = $("#sel_subject_id").val();  // 현재 선택한 subject_id
    let sel_subject_id_info  = seleted_subject_member[ sel_subject_id ] || {};
    sel_subject_id_info[ mb_no ].select = "";
    $( tr_id ).removeClass("bg-success");
    show_select_member_name();  // 선택된 회원정보를 화면에 표시
}
function fun_subject_new(result){
    console.log('fun_subject_new', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '교재 추가 에러', 'Material' );
    }else{
        gWS.dialog_msg( '추가되었습니다.', '교재', 'Material' );
        location.reload();
    }
};
function fun_subject_edit(result){
    console.log('fun_subject_edit', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '교재 수정 에러', 'Material' );
    }else{
        gWS.dialog_msg( '수정되었습니다.', '교재', 'Material' );
        location.reload();
    }
};

function fun_subject_delete(result){
    console.log('fun_subject_delete', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '교재 삭제 에러', 'Material' );
    } else {
        gWS.dialog_msg( '삭제되었습니다.', '교재', 'Material' );
        location.reload();
    }
};
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
        gWS.alert_msg( result.error, '교재삭제 에러', 'Material' );
    } else {
        gWS.dialog_msg( '교재삭제되었습니다.', '교재 가입회원', 'Material' );
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
function fun_subject_member_clone(result){
    console.log('fun_subject_member_clone', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '교재의 회원정보 복제 에러', 'Material' );
    }else{
        gWS.dialog_msg( '복제되었습니다.', '교재의 회원정보', 'Material' );
        location.reload();
    }
};
$(document).ready(function(){
    fun_init();
 
    if($('#table_list').length > 0) {
        gWS.data_table = $('#table_list').DataTable();
        gWS.data_table.destroy();

        gWS.data_table = $('#table_list').DataTable({
            "bFilter": true,
            "bPaginate": true,
            "bInfo": false,
            "bAutoWidth": false,
            "bLengthChange": false,
            "ordering": true,
            "order": [ [ 2, 'asc'] ],
            "select": {
                "style": 'multi'
            },
            "columnDefs": [
                { "width": "5%", "targets": 0 },
                { "width": "10%", "targets": 1 },
                { "width": "10%", "targets": 2 },
                { "width": "20%", "targets": 3 },
                { "width": "10%", "targets": 4 },
                { "width": "5%", "targets": 5 },
                { "width": "7%", "targets": 6 },
                { "width": "7%", "targets": 7 },
                { "width": "7%", "targets": 8 },
                { "width": "7%", "targets": 9 }
              ]
        });
    }
    if($('#table_member_list').length > 0) {
        gWS["table_member_list"] = $('#table_member_list').DataTable();
        gWS.table_member_list.destroy();

        gWS.table_member_list = $('#table_member_list').DataTable({
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
            "columnDefs": [
                { "width": "10%", "targets": 0 },
                { "width": "30%", "targets": 1 },
                { "width": "20%", "targets": 2 },
                { "width": "20%", "targets": 3 },
                { "width": "20%", "targets": 4 },
              ]
        });
    }
    $('#table_list thead tr').clone(true).appendTo( '#table_list thead' );
    $('#table_list thead tr:eq(1) th').each( function (i) {
        if ( i > 0 ){
            var title = $(this).text();
            $(this).html( '<input type="text" class="data_filter_input " id="table_list_srch_' + i + '" placeholder="Search '+title+'" />' );
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
    $("#delete_data_row").on("show.bs.modal", function( event) {
        var button      = $(event.relatedTarget);
        var idx         = button.data('idx');
        $("#del_idx").val( idx );
    });

    $("#edit_data_row").on("show.bs.modal", function( event) {
        var button              = $(event.relatedTarget);
        var category            = button.data('category');
        var year                = button.data('year');
        var subject             = button.data('subject');
        var ctype               = button.data('ctype');
        var num                 = button.data('num');
        var plan_name           = button.data('plan_name');
        var start               = button.data('start');
        var end                 = button.data('end');
        var exclude             = button.data('exclude');
        var description = button.data('description');
        var subject_id          = button.data('idx');
        subject               = subject.replace(',', '');
        $('#edit_category').val( category );
        $('#edit_year').val( year );
        $('#edit_subject').val( subject );
        $('#edit_ctype').val( ctype ).attr("selected", "selected");
        $('#edit_num').val( num );
        $('#edit_plan_name').val( plan_name );
        $('#edit_start').val( start );
        $('#edit_end').val( end );
        $('#edit_exclude').val( exclude );
        $('#edit_description').val( description );
        $('#edit_idx').val( subject_id );
    });

    $("#file").on('change', function() {
        readImageDisplay( this, 'new_img_ctype' );
    });
    $("#btn_new_submit").on("click", function( event) {
        let server_url          = location.href.split("?")[0].split("com")[1];
        var json_data    = {"url":server_url, "mode":"new" };
        if ( $("#new_category").val() > "" ) {
            json_data["category"]   = $("#new_category").val();
        } else {
            $('#new_category').get(0).setCustomValidity('Invalid');
        }
        if ( $("#new_year").val() > "" ) {
            json_data["year"]   = $("#new_year").val();
        } else {
            $('#new_year').get(0).setCustomValidity('Invalid');
        }
        if ( $("#new_subject").val() > "" ) {
            json_data["subject"]   = $("#new_subject").val();
        } else {
            $('#new_subject').get(0).setCustomValidity('Invalid');
        }
        if ( parseInt($("#new_num").val()) > 0 ) {
            json_data["num"]   = $("#new_num").val();
        } else {
            $('#new_num').get(0).setCustomValidity('Invalid');
        }
        if ( parseInt($("#new_plan_name").val()) > "" ) {
            json_data["plan_name"]   = $("#new_plan_name").val();
        } else {
            $('#new_plan_name').get(0).setCustomValidity('Invalid');
        }
        json_data["year"]       = $("#new_year").val();
        json_data["subject"]    = $("#new_subject").val();
        json_data["subject"]    = json_data["subject"].replace(',', '');
        json_data["ctype"]      = $("#new_ctype option:selected").val();
        json_data["num"]        = $("#new_num").val();
        json_data["plan_name"]  = $("#new_plan_name").val();
        json_data["start"]      = $("#new_start").val();
        json_data["end"]        = $("#new_end").val();
        json_data["exclude"]    = $("#new_exclude").val();
        if ( $("#new_num_all").is(":checked") ) {
            json_data["mode"]= "new_all"
        }
        json_data["description"]      = $("#new_description").val();
        if (json_data["subject"] == "" ) {
            gWS.alert_msg( "교재명 입력", '데이터를 입력바랍니다.', 'Material' );
            return;
        }
        if (json_data["num"] == "" ) {
            gWS.alert_msg( "권 번호 입력", '데이터를 입력바랍니다.', 'Material' );
            return;
        }
        //gWS.ajaxFilePost( json_data, 'file', fun_subject_new);    // 서버에 ajax 호출
        gWS.ajaxPost( json_data, fun_subject_new);    // 서버에 ajax 호출
    });
    $("#btn_edit_submit").on("click", function( event) {
        let server_url          = location.href.split("?")[0].split("com")[1];
        var json_data    = {"url":server_url, "mode":"edit" };
        idx                             = $("#edit_idx").val();
        json_data["idx"]                = idx;
        json_data["category"]           = $("#edit_category").val();
        json_data["year"]               = $("#edit_year").val();
        json_data["subject_id"]         = idx;
        json_data["subject"]            = $("#edit_subject").val();
        json_data["subject"]            = json_data["subject"].replace(',', '');
        json_data["ctype"]              = $("#edit_ctype option:selected").val();
        json_data["num"]                = $("#edit_num").val();
        json_data["plan_name"]          = $("#edit_plan_name").val();
        json_data["start"]              = $("#edit_start").val();
        json_data["end"]                = $("#edit_end").val();
        json_data["exclude"]            = $("#edit_exclude").val();
        json_data["description"]        = $("#edit_description").val();
        if (json_data["subject"] == "" ) {
            gWS.alert_msg( "교재명 입력", '데이터를 입력바랍니다.', 'Material' );
            return;
        }
        //gWS.ajaxFilePost( json_data, 'edit_file', fun_subject_edit);    // 서버에 ajax 호출
        gWS.ajaxPost( json_data, fun_subject_edit);    // 서버에 ajax 호출
    });
    $("#btn_delete_submit").on("click", function( event) {
        let server_url          = location.href.split("?")[0].split("com")[1];
        var json_data           = {"url":server_url, "mode":"delete" };
        idx                     = $("#del_idx").val();
        json_data["subject_id"]    = idx;
        gWS.ajaxPost( json_data, fun_subject_delete);    // 서버에 ajax 호출
    });

    $("#add_subject_member_row").on("show.bs.modal", function( event) {
        // 교재에 회원추가
        var button      = $(event.relatedTarget);
        gWS["dataTableNewRoomMember"] = $('#table_new_member_list').DataTable();
        gWS.dataTableNewRoomMember.destroy();

        gWS.dataTableNewRoomMember = $('#table_new_member_list').DataTable({
            "bFilter": true,
            "bPaginate": true,
            "bInfo": false,
            "bAutoWidth": false,
            "bLengthChange": false,
            "ordering": true,
            "order": [ [ 1, 'asc'] ],
            "columnDefs": [
                { "width": "10%", "targets": 0 },
                { "width": "10%", "targets": 1 },
                { "width": "10%", "targets": 2 }
              ]
        });
    });

    $("a.subject.subject_name").on("click", function( event) {
        // subject 을 선택시
        let sel_subject_id     = $(this).data("subject_id");
        gWS.showProgressBar("show");
        let server_url          = location.href.split("?")[0].split("com")[1];
        setTimeout( function() { location.href       = server_url + '?sel_subject_id=' + sel_subject_id; }, 100 );
    });

    $("tr.tr_new_member").on("click", function( event) {
        // 새로 추가할 회원을 선택시, seleted_subject_member 에 선택된 회원정보 저장, 나중에 ajax로 전송하기 위해
        let sel_subject_id     = $("#sel_subject_id").val();  // 현재 선택한 subject_id
        if ( $(this).hasClass("bg-success") ) {
            $(this).removeClass("bg-success");
            let sel_subject_id_info  = seleted_subject_member[ sel_subject_id ] || {};
            let mb_no           = $(this).data("mb_no");
            let mb_name         = $(this).data("mb_name");
            let mb_id           = $(this).data("mb_id");
            sel_subject_id_info[ mb_no ]   =  { 'mb_no':mb_no, 'mb_name':mb_name, 'mb_id':mb_id, 'select':'' }
            seleted_subject_member[ sel_subject_id ]  = sel_subject_id_info;
            show_select_member_name();  // 선택된 회원정보를 화면에 표시
        }else {
            $(this).addClass("bg-success");
            let sel_subject_id_info  = seleted_subject_member[ sel_subject_id ] || {};
            let mb_no           = $(this).data("mb_no");
            let mb_name         = $(this).data("mb_name");
            let mb_id           = $(this).data("mb_id");
            sel_subject_id_info[ mb_no ]   =  { 'mb_no':mb_no, 'mb_name':mb_name, 'mb_id':mb_id, 'select':'Y' }
            seleted_subject_member[ sel_subject_id ]  = sel_subject_id_info;
            show_select_member_name();  // 선택된 회원정보를 화면에 표시
        }
    });

    $("#btn_new_subject_member-submit").on("click", function( event) {
        // 선택한 subject 에 회원 추가
        var json_data           = {"url":"/app/admin/api/subject_member", "mode":"save" };
        let sel_subject_id     = $("#sel_subject_id").val();  // 현재 선택한 subject_id
        let sel_subject_id_info  = seleted_subject_member[ sel_subject_id ] || {};
        mb_no_list          = [];
        mb_id_list          = [];
        key_list          = Object.keys( sel_subject_id_info );
        key_list.forEach(function( mb_no ){
            mb_row      = sel_subject_id_info[ mb_no ];
            mb_no       = mb_row.mb_no;
            mb_id       = mb_row.mb_id;
            if ( mb_row.select == "Y" ) {
                mb_no_list.push( mb_no );
                mb_id_list.push( mb_id );
            }
        });
        if ( mb_no_list.length <= 0 ) {
            gWS.alert_msg("교재에 추가할 회원을 선택해주십시요.");
            return ;
        }
        
        json_data["subject_id"]        = sel_subject_id;
        json_data["date_start"]     = $("#new_subject_member_start").val();
        json_data["date_end"]       = $("#new_subject_member_end").val();
        json_data["mb_no_list"]     = JSON.stringify( mb_no_list );
        json_data["mb_id_list"]     = JSON.stringify( mb_id_list );
        gWS.ajaxPostApi( json_data, fun_subject_member_new);    // 서버에 ajax 호출
    });
    $("#delete_subject_member_row").on("show.bs.modal", function( event) {
        // subject member 교재삭제
        var button      = $(event.relatedTarget);
        var r_m_id      = button.data('subject_member_id');
        var mb_no       = button.data('mb_no');
        var mb_id       = button.data('mb_id');
        var mb_name     = button.data('mb_name');
        var date_start  = button.data('date_start');
        var date_end    = button.data('date_end');
        $("#del_r_m_id").val( r_m_id );
        $("#del_subject_member_no").val( mb_no );
        $("#del_subject_member_id").val( mb_id );
        $("#del_subject_member_name").val( mb_name );
        $("#del_subject_member_start").val( date_start );
        $("#del_subject_member_end").val( date_end );
    });
    $("#edit_subject_member_row").on("show.bs.modal", function( event) {
        var button      = $(event.relatedTarget);
        var r_m_id      = button.data('subject_member_id');
        var mb_no       = button.data('mb_no');
        var mb_id       = button.data('mb_id');
        var mb_name     = button.data('mb_name');
        var date_start  = button.data('date_start');
        var date_end    = button.data('date_end');
        if ( gWS.isEmpty( date_start ) ) return ;
        $("#edit_r_m_id").val( r_m_id );
        $("#edit_subject_member_no").val( mb_no );
        $("#edit_subject_member_id").val( mb_id );
        $("#edit_subject_member_name").val( mb_name );
        $('#edit_subject_member_start').val(date_start ); // 서비스 시작일
        $('#edit_subject_member_end').val(date_end );
        return true;
    });
    $("#clone_subject_member").on("show.bs.modal", function( event) {
        var button      = $(event.relatedTarget);
        var clone_s_id  = button.data('subject_id');
        $("#clone_subject_id").val( clone_s_id );
        $("#clone_category").val( button.data('category') );
        $("#clone_year").val( button.data('year') );
        $("#clone_subject").val( button.data('subject') );
        $('#clone_ctype').val(button.data('ctype') ); // 서비스 시작일
        $('#clone_num').val(button.data('num') );
        $('#clone_plan_name').val(button.data('plan_name') );
        return true;
    });
    $("#btn_delete_subject_member_submit").on("click", function( event) {
        var json_data           = {"url":"/app/admin/api/subject_member", "mode":"delete" };
        var del_r_m_id          = $("#del_r_m_id").val();
        json_data["subject_member_id"]    = del_r_m_id;
        json_data["mb_no"]     = $("#del_subject_member_no").val();
        json_data["mb_id"]     = $("#del_subject_member_id").val();
        gWS.ajaxPostApi( json_data, fun_subject_member_delete);    // 서버에 ajax 호출
    });
    $("#btn_edit_subject_member_submit").on("click", function( event) {
        var json_data    = {"url":"/app/admin/api/subject_member", "mode":"edit" };
        var edit_r_m_id         = $("#edit_r_m_id").val();
        json_data["subject_member_id"]        = edit_r_m_id;
        json_data["mb_no"]                 = $("#edit_subject_member_no").val();
        json_data["mb_id"]                 = $("#edit_subject_member_id").val();
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
    $("#btn_clone_submit").on("click", function( event) {
        var json_data    = {"url":"/app/admin/api/subject_member", "mode":"clone" };
        json_data["subject_id"]             = $("#clone_subject_id").val();
        gWS.ajaxPostApi( json_data, fun_subject_member_clone);    // 서버에 ajax 호출
    });

    $("#a_title").html("교재 관리");
});
