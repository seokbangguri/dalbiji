/*
    wizice
*/

let seleted_subject_member  = {};
let seleted_subject         = {};
let page_url        =  location.href.split("?")[0].split("com")[1];

function fun_init() {
    let today_date   = new Date();
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


function show_select_subject_name(){
    // 현재 선택한 교재를 화면에 표시
    let sel_g_key     = $("#sel_mb_id").val();  // 현재 선택한 subject_id
    let sel_info  = seleted_subject[ sel_g_key ] || {};
    let pkey_list  = Object.keys(sel_info);
    let s_html  = "";
    pkey_list.forEach(function( pkey ){
        sel_row      = sel_info[ pkey ];
        if ( sel_row.select == "Y" ) {
            s_html      += `<li> ${ sel_row.text} 
                                  <a href="javascript:fun_pop_subject_id(${pkey});" ><i class='fa fa-times'></i> 제외</a>
                            </li>\n 
                            `;
        }
    });
    $("#new_subject_names").html( s_html);
}
function fun_pop_subject_id( subject_id ){
    // 선택한 교재는 제외처리
    const   tr_id   = "#tr_new_subject_" + subject_id;
    let sel_g_key     = $("#sel_mb_id").val();  // 현재 선택한 subject_id
    let sel_info  = seleted_subject[ sel_g_key ] || {};
    sel_info[ subject_id ].select = "";
    $( tr_id ).removeClass("bg-success");
    show_select_subject_name();  // 선택된 회원정보를 화면에 표시
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
            "bPaginate": false,
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
                { "width": "5%", "targets": 1 },
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
    if($('#table_new_subject_list').length > 0) {
        gWS.data_table = $('#table_new_subject_list').DataTable();
        gWS.data_table.destroy();

        gWS.data_table = $('#table_new_subject_list').DataTable({
            "bFilter": true,
            "bPaginate": true,
            "bInfo": false,
            "bAutoWidth": false,
            "bLengthChange": false,
            "ordering": true,
        });
    }
    $("#delete_data_row").on("show.bs.modal", function( event) {
        var button      = $(event.relatedTarget);
        var idx         = button.data('idx');
        var category            = button.data('category');
        var year                = button.data('year');
        var subject             = button.data('subject');
        var ctype               = button.data('ctype');
        var num                 = button.data('num');
        let s_title     = category + " " + year + "년 " + subject + " #" + num + " " ;
        $("#del_title").html( s_title );
        $("#del_idx").val( idx );
    });

    $("#exclude_data_row").on("show.bs.modal", function( event) {
        var button      = $(event.relatedTarget);
        var idx         = button.data('idx');
        var category            = button.data('category');
        var year                = button.data('year');
        var subject             = button.data('subject');
        var ctype               = button.data('ctype');
        var num                 = button.data('num');
        let s_title     = category + " " + year + "년 " + subject + " #" + num + " " ;
        $("#exclude_title").html( s_title );
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

    $(".display_type").on("click", function( event) {
        if ($(this).hasClass("grid-view") ) {
            $("#div_subject_list_card").collapse("show");
            $("#div_subject_list_table").collapse("hide");
        } else {
            $("#div_subject_list_card").collapse("hide");
            $("#div_subject_list_table").collapse("show");
        }
    });
    $("#new_num_all").on("click", function( event) {
        for ( i1 = 2; i1 < 11; i1++){
            $("#div_new_book" + i1).removeClass("hide").addClass("hide");
        }
        if ( $("#new_num_all").is(":checked") ) {
            let new_num    = $("#new_num").val();
            if (new_num > "" ){
                let i_no    = parseInt( new_num );
                $("#new_start").val( "1001");
                $("#new_end" ).val( "1100");
                if ( i_no > 1 ) {
                    for ( i1 = 2; i1 < i_no +1; i1++){
                        if ( i1 <= 10 ) {
                            $("#div_new_book" + i1).removeClass("hide");
                            $("#new_start" + i1).val( i1  + "001");
                            $("#new_end" + i1).val( i1  + "100");
                        }
                    }
                }
            }
        }
    });
    $("#btn_new_submit").on("click", function( event) {
        var json_data    = {"url":page_url, "mode":"new" };
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
        if ( parseInt($("#new_plan_name").val()) > 0 ) {
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
            let new_num    = $("#new_num").val();
            if (new_num > "" ){
                let i_no    = parseInt( new_num );
                if ( i_no > 1 ) {
                    let book_data   = [];
                    for ( i1 = 2; i1 < i_no +1; i1++){
                        let book_info = {
                                'no': i1,
                                'start': $("#new_start" + i1 ).val(),
                                'end': $("#new_end" + i1 ).val(),
                                'exclude': $("#new_exclude" + i1 ).val(),
                            }
                        book_data.push( book_info );
                    }
                    json_data["book_data"]  = book_data;
                }
            }
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
        var json_data    = {"url":page_url, "mode":"edit" };
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
        var json_data           = {"url":page_url, "mode":"delete" };
        idx                     = $("#del_idx").val();
        json_data["subject_id"]    = idx;
        gWS.ajaxPost( json_data, fun_subject_delete);    // 서버에 ajax 호출
    });

    $("#btn_exclude_submit").on("click", function( event) {
        var json_data           = {"url":page_url, "mode":"exclude" };
        idx                     = $("#del_idx").val();
        json_data["subject_id"]    = idx;
        gWS.ajaxPost( json_data, fun_subject_delete);    // 서버에 ajax 호출
    });


    $("a.subject.subject_name").on("click", function( event) {
        // subject 을 선택시
        let sel_subject_id     = $(this).data("subject_id");
        gWS.showProgressBar("show");
        setTimeout( function() { location.href       =  page_url + '?sel_subject_id=' + sel_subject_id; }, 100 );
    });

    $("tr.tr_new_subject").on("click", function( event) {
        // 새로 추가할 교재를  선택시, seleted_subject 에 선택된 교재 저장, 나중에 ajax로 전송하기 위해
        let sel_mb_id     = $("#sel_mb_id").val();  // 현재 선택한 subject_id
        let sel_text     = $(this).text().trim();
        if ( $(this).hasClass("bg-success") ) {
            $(this).removeClass("bg-success");
            let sel_mb_id_info  = seleted_subject[ sel_mb_id ] || {};
            let subject         = $(this).data("subject");
            let subject_id           = $(this).data("subject_id");
            sel_mb_id_info[ subject_id ]   =  { 'text':sel_text, 'subject_id':subject_id, 'select':'' }
            seleted_subject[ sel_mb_id ]  = sel_mb_id_info;
            show_select_subject_name();  // 선택된 회원정보를 화면에 표시
        }else {
            $(this).removeClass("bg-success").addClass("bg-success");
            let sel_mb_id_info  = seleted_subject[ sel_mb_id ] || {};
            let subject         = $(this).data("subject");
            let subject_id      = $(this).data("subject_id");
            sel_mb_id_info[ subject_id ]   =  { 'text':sel_text, 'subject_id':subject_id, 'select':'Y' }
            seleted_subject[ sel_mb_id ]  = sel_mb_id_info;
            show_select_subject_name();  // 선택된 회원정보를 화면에 표시
        }
    });

    $("#btn_new_subject_submit").on("click", function( event) {
        // 현재 선택되어진 회원에게 교재를  
        var json_data           = {"url":page_url, "mode":"save_subject" };
        let sel_mb_id           = $("#sel_mb_id").val();  // 현재 선택한 subject_id
        let sel_subject_id_info = seleted_subject[ sel_mb_id ] || {};
        let key_list          = Object.keys( sel_subject_id_info );
        if ( key_list.length <= 0 ) {
            gWS.alert_msg("추가할 교재를 선택해주십시요.");
            return ;
        }
        json_data["sel_mb_id"]      = sel_mb_id;
        json_data["key_list"]       = JSON.stringify( key_list );
        gWS.ajaxPost( json_data, fun_subject_new);    // 서버에 ajax 호출
    });


    $("#a_title").html("교재 관리");
});
