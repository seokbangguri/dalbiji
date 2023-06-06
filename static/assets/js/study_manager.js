//------------ 학생의 시험지 목록 제공 및 시험결과 표시 

let exam_info_json = null;
let dataTable = null;
let dt = null; //modal datatable
let exam_start_url = null;

let mb_kakao    = null;
let mb_id       = null;


function show_exam_table() {
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


    if($('#exam_table').length > 0) {
       dataTable = $('#exam_table').DataTable({              
             "bFilter": true,                                                
             "bInfo": true,                                                  
             "bPaginate": true,                                              
             "bAutoWidth": false, 
             "aoColumns" : [
                 null, 
                 { "width" : "30px" }, 
                 { "width" : "30px" },
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
  
function show_exam_table_tbody() {
    var html="";

    for(idx in exam_info) {
        let exam_row    = exam_info[idx];
        let s_check_answer = '';

        html += "<tr>";
        html += "<td class=\"hide\">" + exam_row.exam_info_id + "</td>";
        html += "<td class='show year'>" + exam_row.year + "</td>";
        html += "<td class='show grade'>" + exam_row.grade + "</td>";
        html += "<td class='show series'>" + exam_row.series + "</td>";
        html += "<td class='show subject'>" + exam_row.subject + "</td>";
        html += "<td class='pl-0 pr-1' >" + "<a href='#' onClick=\"ex_download()\"> 문제 받기</a> </td>";
        //html += "<td class='pl-0 pr-1' >" + "<a href='#' onClick=\"ex_start()\"> 시험 보기</a> </td>";
        html += "<td class='pl-0 pr-1' >" + "<a href='#' onClick=\"ex_chart()\"> 차트보기</a> </td>";
        html += "</tr>";
    }

    $('#exam_table_tbody').append(html);
}

function set_default_filter(){
    // localStorage 의 값을 설정 후 
    let year        = localStorage.getItem("ef_year");
    let grade       = localStorage.getItem("ef_grade");
    let series      = localStorage.getItem("ef_series");
    let subject     = localStorage.getItem("ef_series");
    let is_checked  = localStorage.getItem("ef_checked" );
   
    if ( is_checked == "false" )  { 
        $("#chk_column").prop("checked", false);
    } else {
        $("#chk_column").prop("checked", true);
    }
    year    = year || '';
    grade   = grade || '';
    series  = series || '';
    if (year=="undefined" ) year = "";
    if (grade=="undefined" ) grade = "";
    if (series=="undefined" ) series = "";

    $("#year").val( year).trigger("click");
    $("#grade").val( grade).trigger("click");
    $("#series").val( series).trigger("click");
    $("#subject").val( subject).trigger("click");
    // filter 적용
    set_filter();
}

function set_year_box() {
    var dt = new Date();
    var year = "";
    var com_year = dt.getFullYear();

    for(var y = (com_year); (com_year-40) <= y; y--){
        $("#year_select").append("<option value='"+ y +"'>"+ y + "년" +"</option>");
    }
}


function parse_ajax_result_json(result) {
    var smy = result.summary;
    var sNew = smy.sNew;
    var sDel = smy.sDel;
    var sExt = smy.sExt;
    var sErr = smy.sErr;

    if (exam_info_json != null) {
        exam_info_json = null;
    } 

    exam_info_json = result.file;

    $("#modal_summary").val("신규: " + sNew + ", 삭제: " + sDel + ", 기존: " + sExt + ", 에러: " + sErr);

    if (dt != null) {
        dt.destroy();
        dt = null
    }

    dt = $("#modal_exam_table").DataTable({
        searching: true,
        autoWidth: false,
        "data":exam_info_json,
        "columns": [
            {"data":"year"},
            {"data":"grade"},
            {"data":"series"},
            {"data":"subject"},
            {"data":"ets"},
            {"data":"dvs"}
        ]
    });
}

function ex_start(qty, time, gd_id) {
    //var url = "https://planstudy1.wizice.com/app/static/html/plan-study-exam-start.html?answerQty=" + qty + "&sTime=" + time + "&gdUrlId=" + gd_id;
    //window.location.href = url;

    if (dataTable != null) {
        $("#exam_table").off().on('click', 'tr', function () { 
            let d = new Date();
            let start_dt = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`

            let this_row = dataTable.rows(this).data();
            let exam_info_id    = this_row[0][0];
            let row_index       = dataTable.row(this).index();
            let exam_info_index = exam_info[row_index];
            let answer          = JSON.parse(exam_info_index.answer);
            let gdUrlId         = answer.id;
            let re_result   = gWS.re_gdUrlId.exec( gdUrlId );
            if (re_result != null){
                if (re_result.length > 0 ){
                    gdUrlId = re_result[2]
                }
            }

            let answerQty = null;
            for (var a in answer) {
                if( isNaN(a) ){
                    break;
                }
                answerQty = a;
            }

            let exam_start_url = gWS.base_server + "/static/html/plan-study-exam-start.html?"
                                +"answerQty=" + answerQty
                                +"&sTime=" + answer.시간 
                                +"&gdUrlId=" + gdUrlId 
                                +"&pk=" + exam_info_index.exam_info_id 
                                +"&mb_kakao=" + mb_kakao
                                +"&mb_id=" + mb_id
                                +"&ex_start_dt=" + start_dt
                                +"&ex_yyyy_rd=" + this_row[0][1];
            window.location.href = exam_start_url;
        });
    }
}
function ex_download(qty, time, gd_id) {
    //var url = "https://planstudy1.wizice.com/app/static/html/plan-study-exam-start.html?answerQty=" + qty + "&sTime=" + time + "&gdUrlId=" + gd_id;
    //window.location.href = url;

    if (dataTable != null) {
        $("#exam_table").on('click', 'td', function () { 
            let d = new Date();
            let start_dt = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`

            let this_row = dataTable.rows(this).data();
            let exam_info_id    = this_row[0][0];
            let row_index       = dataTable.row(this).index();
            let exam_info_index = exam_info[row_index];
            let answer          = JSON.parse(exam_info_index.answer);
            let gdUrlId         = answer.id;

            window.open(gdUrlId);
        });
    }
}
function ex_chart(qty, time, gd_id) {
    if (dataTable != null) {
        $("#exam_table").on('click', 'tr', function () { 
            let this_row = dataTable.rows(this).data();
            let exam_info_id    = this_row[0][0];
            let pUrl = "/exam/manager/chart";

            let json_data   = {
                'exam_info_id' : exam_info_id,
                'url' : pUrl
            }      
            gWS.ajaxPostApi( json_data, move_chart_page );
        });
    }
}
function move_chart_page(res){
    if(res){
        let form = document.createElement('form'); // 폼객체 생성
        let objs;
        objs = document.createElement('input'); // 값이 들어있는 녀석의 형식
        objs.setAttribute('type', 'text'); // 값이 들어있는 녀석의 type
        objs.setAttribute('name', 'res' ); // 객체이름
        objs.setAttribute('value', JSON.stringify(res)); //객체값
        form.appendChild(objs);
        form.setAttribute('method', 'get'); 
        form.setAttribute('action', gWS.base_server + "/static/html/plan-study-manager-chart.html"); //보내는 url
        document.body.appendChild(form);
        form.submit();
    }else{
        alert("시험 결과가 없습니다"); 
    }
}

//ajax start
function post_get_exam_info(year) {
    let pUrl = "/exam/info/refresh";
    var json_data = {"year": year};

    gWS.showProgressBar(true);
    $.ajax({
        url : pUrl,
        type : 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json_data),
        dataType: 'json',
        complete: function() {
            gWS.showProgressBar(false);
        },
        success : function (result) {
            if( result !=  null) {
                parse_ajax_result_json(result);
                $("#refresh_exam3").modal();
            }
        },
        error: function(res, status, error) {
            console.log(res + "/" + status + "/" + error);
        }
    });
}

function post_set_exam_info() {
    let pUrl = "/exam/info/sync";
    var json_data = {"exam_info": exam_info_json}; 

    gWS.showProgressBar(true);
    $.ajax({
        url : pUrl,
        type : 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json_data),
        dataType: 'json',
        complete: function() {
            gWS.showProgressBar(false);
        },
        success : function (result) {
            if( result !=  null) {
                $("#refresh_exam3").modal("hide");
                location.reload(true);
            }
        },
        error: function(res, status, error) {
            console.log(res + "/" + status + "/" + error);
        }
    });
}


//ajax end

function main_list( res ){
    //--- 시험지 목록 제공
    show_exam_table_tbody();
    show_exam_table();
    set_default_filter();   // localStorage 에 저장된 filter 적용

    set_year_box(); 

    return 'ok';
}

function set_filter(){
    // 년도, 직급, 직렬 과목의 값이 변경될 때 dataTable 필터 설정
    let s_filter    = "";
    let year    = $("#year").val();
    let grade   = $("#grade").val();
    let series  = $("#series").val();
    let subject = $("#subject").val();
    let is_checked = $("#chk_column").is(":checked");
    localStorage.setItem("ef_checked", is_checked );

    if ( !gWS.isEmpty( year) ) {
        if ( is_checked ) { 
            $("#exam_table .show.year").addClass("hide"); 
        } else {
            $("#exam_table .show.year").removeClass("hide"); 
        }
        s_filter     += year;
    }else{
        if ( is_checked ) { $("#exam_table .show.year").removeClass("hide"); }
    }
    localStorage.setItem("ef_year", year );

    if ( !gWS.isEmpty( grade) ) {
        if ( is_checked ) { 
            $("#exam_table .show.grade").addClass("hide"); 
        } else  {
            $("#exam_table .show.grade").removeClass("hide"); 
        }
        s_filter     += " " + grade;
    }else{
        if ( is_checked ) { $("#exam_table .show.grade").removeClass("hide"); }
    }
    localStorage.setItem("ef_grade", grade );

    if ( !gWS.isEmpty( series) ) {
        if ( is_checked ) { 
            $("#exam_table .show.series").addClass("hide"); 
        } else  {
            $("#exam_table .show.series").removeClass("hide"); 
        }
        s_filter     += " " +series;
    }else{
        if ( is_checked ) { $("#exam_table .show.series").removeClass("hide"); }
    }
    localStorage.setItem("ef_series", series );

    if ( !gWS.isEmpty( subject) ) {
        if ( is_checked ) { 
            $("#exam_table .show.subject").addClass("hide"); 
        } else  {
            $("#exam_table .show.subject").removeClass("hide"); 
        }
        s_filter     += " " +subject;
    }else{
        if ( is_checked ) { $("#exam_table .show.subject").removeClass("hide"); }
    }
    localStorage.setItem("ef_subject", subject );


    if (s_filter > "") {
        dataTable.search(s_filter).draw();
    }else{
        dataTable.search("").draw();
    }
}

$(function(){
    // 시험지 목록과 학생의 시험결과를 합쳐서 보여줌
    mb_kakao    = gWS.getParameterByName("mb_kakao");
    mb_id       = gWS.getParameterByName("mb_id");
    mb_level    = gWS.getParameterByName("mb_level");


    $("#refresh").off().on("click", function() {
        let select_year = $("#year_select option:selected").val();
        post_get_exam_info(select_year);
        $("#modal_year").val(select_year+"년");
    });

    $("#refresh_modal_cancel").off().on("click", function() {
        $("#refresh_exam3").modal("hide");
    });

    $("#refresh_modal_confirm").off().on("click", function() {
        post_set_exam_info();        
    });

    $("#year").on("keyup",  function() {
        set_filter();
    });
    $("#grade").on("keyup",  function() {
        set_filter();
    });
    $("#series").on("keyup",  function() {
        set_filter();
    });
    $("#subject").on("keyup",  function() {
        set_filter();
    });
    $("#chk_column").on("change",  function() {
        set_filter();
    });

    main_list();
});

