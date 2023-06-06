//------------ 학생의 시험지 목록 제공 및 시험결과 표시 

let student_json = null;
let dataTable = null;
let dt = null; //modal datatable
let exam_start_url = null;

let mb_kakao    = null;
let mb_id       = null;


function show_student_table() {
    var lang_kor = {
        "decimal" : "",
        "emptyTable" : "데이터가 없습니다.",
        "info" : "_START_ - _END_ (총 _TOTAL_ 개)",
        "infoEmpty" : "0개",
        "infoFiltered" : "(전체 _MAX_ 개 중 검색결과)",
        "infoPostFix" : "",
        "thousands" : ",",
        "lengthMenu" : "_MENU_ 개씩 보기",
        "loadingRecords" : "로딩중...",
        "processing" : "처리중...",
        "search" : "검색 : ",
        "zeroRecords" : "검색된 데이터가 없습니다.",
        "paginate" : {
            "first" : "첫 페이지",
            "last" : "마지막 페이지",
            "next" : "다음",
            "previous" : "이전"
        },
        "aria" : {
            "sortAscending" : " :  오름차순 정렬",
            "sortDescending" : " :  내림차순 정렬"
        }
    };


    if($('#student_table').length > 0) {
       dataTable = $('#student_table').DataTable({              
             "bFilter": true,                                                
             "bInfo": true,                                                  
             "bPaginate": true,                                              
             "bAutoWidth": false, 
             "aoColumns" : [
                 null, 
                 null, 
                 { "width" : "30px" },
                 { "width" : "30px" }, 
                 { "width" : "30px" }, 
                 { "width" : "30px" }
             ],
             "lengthMenu": [ [100, 200, 500, -1], [100, 200, 500, "All"] ],
             "pageLength": -1,
             "ordering":true,
             "bScrollCollapse": true,                                         
             "language" : lang_kor
        }); 
    }
}
  
function show_student_table_tbody() {
    var html="";

    for(idx in student_json) {
        let student_row    = student_json[idx];
        let s_check_answer = '';

        html += "<tr>";
        html += "<td class=\"hide\">" + student_row.mb_no + "</td>";
        html += "<td class=\"hide\">" + student_row.mb_kakao + "</td>";
        html += "<td class='show mb_name'>" + student_row.mb_name + "</td>";
        html += "<td class='show mb_nick'>" + student_row.mb_nick + "</td>";
        html += "<td class='show mb_id'>" + student_row.mb_id + "</td>";
        html += "<td class='pl-0 pr-1' >" + "<a href='#' onClick=\"student_view()\"> 학생 확인</a> </td>";
        html += "</tr>";
    }

    $('#student_table_tbody').append(html);
}

function set_default_filter(){
    // localStorage 의 값을 설정 후 
    let mb_name     = localStorage.getItem("ef_mb_name");
    let mb_nick     = localStorage.getItem("ef_mb_nick");
    let mb_id       = localStorage.getItem("ef_mb_id");
    let is_checked  = localStorage.getItem("ef_checked" );
   
    if ( is_checked == "false" )  { 
        $("#chk_column").prop("checked", false);
    } else {
        $("#chk_column").prop("checked", true);
    }
    mb_name    = mb_name || '';
    mb_nick   = mb_nick || '';
    mb_id  = mb_id || '';
    if (mb_name=="undefined" ) mb_name = "";
    if (mb_nick=="undefined" ) mb_nick = "";
    if (mb_id=="undefined" ) mb_id = "";

    $("#mb_name").val( mb_name).trigger("click");
    $("#mb_nick").val( mb_nick).trigger("click");
    $("#mb_id").val( mb_id).trigger("click");
    // filter 적용
    set_filter();
}

function student_view(qty, time, gd_id) {
    if (dataTable != null) {
        $("#student_table").off().on('click', 'tr', function () { 
            let this_row = dataTable.rows(this).data();
            let mb_no    = this_row[0][0];
            let mb_name  = this_row[0][1];
            let mb_kakao = this_row[0][2];
            let mb_id    = this_row[0][4];
            let pUrl = "/exam/manager/student";

            let sUrl = gWS.base_server + "/static/html/plan-study-exam.html?"
                                +"&mb_kakao=" + mb_kakao
                                +"&mb_id=" + mb_id
                                +"&adTest=Y"
            window.open( sUrl );
        });
    }
}

function main_list( res ){
    if(res){
        student_json = res;
    }
    //--- 학생 목록 제공
    show_student_table_tbody();
    show_student_table();
    set_default_filter();   // localStorage 에 저장된 filter 적용

    return 'ok';
}

function set_filter(){
    // 년도, 직급, 직렬 과목의 값이 변경될 때 dataTable 필터 설정
    let s_filter    = "";
    let mb_name    = $("#mb_name").val();
    let mb_nick   = $("#mb_nick").val();
    let mb_id  = $("#mb_id").val();
    let is_checked = $("#chk_column").is(":checked");
    localStorage.setItem("ef_checked", is_checked );

    if ( !gWS.isEmpty( mb_name) ) {
        if ( is_checked ) { 
            $("#student_table .show.mb_name").addClass("hide"); 
        } else {
            $("#student_table .show.mb_name").removeClass("hide"); 
        }
        s_filter     += mb_name;
    }else{
        if ( is_checked ) { $("#student_table .show.mb_name").removeClass("hide"); }
    }
    localStorage.setItem("ef_mb_name", mb_name );

    if ( !gWS.isEmpty( mb_nick) ) {
        if ( is_checked ) { 
            $("#student_table .show.mb_nick").addClass("hide"); 
        } else  {
            $("#student_table .show.mb_nick").removeClass("hide"); 
        }
        s_filter     += " " + mb_nick;
    }else{
        if ( is_checked ) { $("#student_table .show.mb_nick").removeClass("hide"); }
    }
    localStorage.setItem("ef_mb_nick", mb_nick );

    if ( !gWS.isEmpty( mb_id) ) {
        if ( is_checked ) { 
            $("#student_table .show.mb_id").addClass("hide"); 
        } else  {
            $("#student_table .show.mb_id").removeClass("hide"); 
        }
        s_filter     += " " +mb_id;
    }else{
        if ( is_checked ) { $("#student_table .show.mb_id").removeClass("hide"); }
    }
    localStorage.setItem("ef_mb_id", mb_id );

    if (s_filter > "") {
        dataTable.search(s_filter).draw();
    }else{
        dataTable.search("").draw();
    }
}

$(function(){
    // 시험지 목록과 학생의 시험결과를 합쳐서 보여줌
    $("#mb_name").on("keyup",  function() {
        set_filter();
    });
    $("#mb_nick").on("keyup",  function() {
        set_filter();
    });
    $("#mb_id").on("keyup",  function() {
        set_filter();
    });

    let pUrl = "/exam/manager/student";
    let main_list_json_data = {
        "url": pUrl
    };
    gWS.ajaxPostApi( main_list_json_data, main_list );
});

