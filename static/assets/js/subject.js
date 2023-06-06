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


function fun_category_new(result){
    console.log('fun_category_new', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '과목 추가 에러', 'Material' );
    }else{
        gWS.dialog_msg( '추가되었습니다.', '과목', 'Material' );
        new_category    = $("#new_category").val();
        localStorage.setItem("sel_member_category", new_category );
        location.reload();
    }
};
function fun_category_edit(result){
    console.log('fun_category_edit', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '과목 수정 에러', 'Material' );
    }else{
        gWS.dialog_msg( '수정되었습니다.', '과목', 'Material' );
        location.reload();
    }
};
function fun_category_delete(result){
    console.log('fun_category_delete', 'result', result );
    if ( result.result <= 0 ) {
        gWS.alert_msg( result.error, '과목 삭제 에러', 'Material' );
    } else {
        gWS.dialog_msg( '삭제되었습니다.', '과목', 'Material' );
        location.reload();
    }
};

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
 
    $('#table_list thead tr').clone(true).appendTo( '#table_list thead' );
    $('#table_list thead tr:eq(1) th').each( function (i) {
            if ( i>0 ){
                var title = $(this).text();
                if (title.indexOf("(총")>=0){
                    title   = title.split("(")[0];
                }
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
            "bFilter": true,
            orderCellsTop: true,
            fixedHeader: true,
            "bPaginate": false,
            "sScrollY": (screen.availHeight - 320) + "px",
            "bScrollCollapse": true,

        }); 
    $("#table_list .member").on("click", function(){
        let sel_mb_id   = $(event.target).data("id");
        location.href   = location.pathname + "?sel_mb_id=" + sel_mb_id;
    })


    $("#edit_category_row").on("show.bs.modal", function( event) {
        var button              = $(event.relatedTarget);
        var category            = button.data('category');
        $('#edit_old_category').val( category );
        $('#edit_category').val( category );
    });
    $("#delete_category_row").on("show.bs.modal", function( event) {
        var button      = $(event.relatedTarget);
        var category            = button.data('category');
        let s_title     = category;
        $("#del_title").html( s_title );
        $("#del_category").val( category );
    });
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


    $("#add_data_row").on("show.bs.modal", function( event) {
        var button              = $(event.relatedTarget);
        var category            = $("#sel_category").val();
        $('#new_category_4subject').val( category );
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
        var member_subject_id          = button.data('idx');
        subject               = subject.replace(',', '');
        $('#edit_category_4subject').val( category );
        $('#edit_year').val( year );
        $('#edit_subject').val( subject );
        $('#edit_ctype').val( ctype ).attr("selected", "selected");
        $('#edit_num').val( num );
        $('#edit_plan_name').val( plan_name );
        $('#edit_start').val( start );
        $('#edit_end').val( end );
        $('#edit_exclude').val( exclude );
        $('#edit_description').val( description );
        $('#edit_idx').val( member_subject_id );
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
                $("#new_start").val( "1");
                $("#new_end" ).val( "100");
                if ( i_no > 1 ) {
                    for ( i1 = 2; i1 < i_no +1; i1++){
                        if ( i1 <= 10 ) {
                            $("#div_new_book" + i1).removeClass("hide");
                            $("#new_start" + i1).val( 1 );
                            $("#new_end" + i1).val( 100 );
                        }
                    }
                }
            }
        }
    });
    $("#btn_category_new_submit").on("click", function( event) {
        var json_data    = {"url":page_url, "mode":"new_category" };
        if ( $("#new_category").val() > "" ) {
            json_data["category"]   = $("#new_category").val();
        } else {
            $('#new_category').get(0).setCustomValidity('Invalid');
        }
        json_data["subject"]    = "dummy"
        json_data["num"]        = 0
        json_data["ctype"]      = ""
        json_data["year"]       = ""
        json_data["plan_name"]  = ""
        json_data["start"]      = 0
        json_data["end"]        = 0
        json_data["exclude"]    = ""
        json_data["description"]= ""
        //gWS.ajaxFilePost( json_data, 'file', fun_subject_new);    // 서버에 ajax 호출
        gWS.ajaxPost_sel( json_data, fun_category_new);    // 서버에 ajax 호출
    });

    $("#btn_category_edit_submit").on("click", function( event) {
        var json_data    = {"url":page_url, "mode":"edit_category" };
        json_data["old_category"]           = $("#edit_old_category").val();
        json_data["category"]           = $("#edit_category").val();
        if (json_data["category"] == "" ) {
            gWS.alert_msg( "과목명 입력", '데이터를 입력바랍니다.', 'Material' );
            return;
        }
        gWS.ajaxPost_sel( json_data, fun_category_edit);    // 서버에 ajax 호출
    });
    $("#btn_category_delete_submit").on("click", function( event) {
        var json_data           = {"url":page_url, "mode":"delete_category" };
        category                = $("#del_category").val();
        json_data["category"]   = category;
        gWS.ajaxPost_sel( json_data, fun_category_delete);    // 서버에 ajax 호출
    });

    $("#btn_new_submit").on("click", function( event) {
        var json_data    = {"url":page_url, "mode":"new" };
        if ( $("#new_category_4subject").val() > "" ) {
            json_data["category"]   = $("#new_category_4subject").val();
        } else {
            $('#new_category_4subject').get(0).setCustomValidity('Invalid');
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
        gWS.ajaxPost_sel( json_data, fun_subject_new);    // 서버에 ajax 호출
    });

    $("#btn_edit_submit").on("click", function( event) {
        var json_data    = {"url":page_url, "mode":"edit" };
        idx                             = $("#edit_idx").val();
        json_data["idx"]                = idx;
        json_data["category"]           = $("#edit_category_4subject").val();
        json_data["year"]               = $("#edit_year").val();
        json_data["member_subject_id"]  = idx;
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
        gWS.ajaxPost_sel( json_data, fun_subject_edit);    // 서버에 ajax 호출
    });
    $("#btn_delete_submit").on("click", function( event) {
        var json_data           = {"url":page_url, "mode":"delete" };
        idx                     = $("#del_idx").val();
        json_data["member_subject_id"]    = idx;
        gWS.ajaxPost_sel( json_data, fun_subject_delete);    // 서버에 ajax 호출
    });

    $("#btn_exclude_submit").on("click", function( event) {
        var json_data           = {"url":page_url, "mode":"exclude" };
        idx                     = $("#del_idx").val();
        json_data["member_subject_id"]    = idx;
        gWS.ajaxPost_sel( json_data, fun_subject_delete);    // 서버에 ajax 호출
    });

    $(".member_category").on("click", function( event) {
        category        = $(this).data( "category" );
        gWS.show_select_category( category );
        $("#sel_category").val( category );
        localStorage.setItem("sel_member_category", category )
        $(this).addClass( "bg-primary" );
    });

    let sel_category    = $("#sel_category").val();
    sel_category        = localStorage.getItem("sel_member_category") || sel_category;
    if ( sel_category > "" ) {
        // 존재하는 category 인지 확인
        let find_category  = "";
        $('div.member_category').each( function (i, item) {
            let div_category    = $(item).data( "category" );
            if ( find_category=="") {
                find_category   = div_category;
            }
            if ( div_category == sel_category ) {
                find_category   = div_category;
            }
        })
        sel_category    = find_category;
        localStorage.setItem("sel_member_category", sel_category );
        
        $("#sel_category").val( sel_category );
        gWS.show_select_category( sel_category );
    }

    $("#a_title").html("교재 관리");
});
