//------------ 학생의 시험지 목록 제공 및 시험결과 표시 

let exam_info_json = null;
let dataTable = null;
let dt = null; //modal datatable
let exam_start_url = null;

let mb_kakao    = null;
let mb_id       = null;
let adTest      = null;

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
             "processing": true,
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
                 { "width" : "30px" }, 
                 { "width" : "50px" }, 
                 { "width" : "30px" }, 
                 { "width" : "346px" } 
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
        if ( exam_row.answer_student ) {
            if ( Object.keys( exam_row.answer_student ).length > 0 ) {
                s_check_answer  = `
                    <table>
                        <thead>
                            <td class="r_title">문제</td>
                    `;
                $.each( exam_row.answer_student, function( index, aa_row) {
                    s_check_answer += `     <td>${index}</td> 
                                        `;
                });
                s_check_answer += `     </thead>
                                        <tbody>
                                            <tr>
                                                <td class="r_title">정답</td>
                                    `;
                $.each( exam_row.answer_student, function( index, aa_row) {
                    s_check_answer += `     <td>${aa_row.a}</td> 
                                        `;
                });
                s_check_answer += `         </tr>
                                            <tr>
                                                <td class="r_title">제출</td>
                                    `;
                $.each( exam_row.answer_student, function( index, aa_row) {
                    let bg_color = "";
                    if ( aa_row.r == "X" ) bg_color = "bg-danger";
                    s_check_answer += `     <td class="${bg_color}">${aa_row.s}</td> 
                                        `;
                });
                s_check_answer += `         </tr>
                                        </tbody>
                                    </table>
                                    `;
            }
        }
                                

        html += "<tr>";
        html += "<td class=\"hide\">" + exam_row.exam_info_id + "</td>";
        html += "<td class='show year'>" + exam_row.year + "</td>";
        html += "<td class='show grade'>" + exam_row.grade + "</td>";
        html += "<td class='show series'>" + exam_row.series + "</td>";
        html += "<td class='show subject'>" + exam_row.subject + "</td>";
        html += "<td class='pl-0 pr-1' >" + "<a href='#' onClick=\"ex_download()\"> 문제 받기</a> </td>";
        html += "<td class='pl-0 pr-1' >" + "<a href='#' onClick=\"ex_start()\"> 시험 보기</a> </td>";
        if ( exam_row.ex_end_dt ) {
            html += `<td class="">` +  exam_row.ex_end_dt + `</td>`;
        } else {
            html += `<td class="">` + (exam_row.ex_end_dt||'') + `</td>`;
        } 
        if ( exam_row.score ) {
            exam_row.score  = parseInt( exam_row.score );
            let bg_color     = "bg-danger";
            if ( exam_row.score < 60 ) {     // 60 미만이면 warning
                bg_color     = "bg-warning";
            }
            if ( exam_row.score >= 60  && exam_row.score < 80 ) {
                bg_color     = "bg-info";
            }
            if ( exam_row.score >= 80 ) {
                bg_color     = "bg-success";
            }
            html += `<td class="pl-0 pr-0">
                        <div class="progress-bar ${bg_color}" role="progressbar" style="width: ${exam_row.score }%;" aria-valuemax="100" aria-valuemin="0">
                            ${exam_row.score }
                        </div>
                    </td> 
                    `
        } else {
            html += "<td>" + (exam_row.score||'') + " </td>";
        } 
        html += "<td>" + s_check_answer + " </td>";
        html += "</tr>";
    }

    $('#exam_table_tbody').append(html);
}

function set_default_filter(){
    // localStorage 의 값을 설정 후 
    let year        = localStorage.getItem("ef_year");
    let grade       = localStorage.getItem("ef_grade");
    let series      = localStorage.getItem("ef_series");
    let subject     = localStorage.getItem("ef_subject");
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

    for(var y = (com_year); (com_year-10) <= y; y--){
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
      XLSXdata":exam_info_json,
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
        $("#exam_table").off().on('click', 'td', function () { 
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

//ajax
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

function post_url_exam_start(j_data) {
    let pUrl = "/exam/answer/check";
    var json_data = j_data 

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
                let gdUrlId  = result.answer.id;
                let re_result   = gWS.re_gdUrlId.exec( gdUrlId );
                if (re_result != null){
                    if (re_result.length > 0 ){
                        gdUrlId = re_result[2]
                    }
                }
                exam_start_url = "https://planstudy1.wizice.com/app/static/html/plan-study-exam-start.html?answerQty=" + 20 + 
                                 "&sTime=" + result.answer.시간 + "&gdUrlId=" + gdUrlId + "&pk=" + result.exam_info_id;
                window.location.href = exam_start_url;
                exam_start_url =  null;
            }
        },
        error: function(res, status, error) {
            console.log(res + "/" + status + "/" + error);
        }
    });
}

function load_student_exam() {
    let pUrl        = "/static/plan_user/" + mb_kakao + ".json";

    gWS.showProgressBar(true);
    $.ajax({
        url : pUrl,
        type : 'POST',
        contentType: 'application/json',
        complete: function() {
            gWS.showProgressBar(false);
        },
        success : function (result) {
            if( result !=  null) {
                console.log("mb_kakao :" + mb_kakao + " result :" + result );
            }
        },
        error: function(res, status, error) {
            console.log(res + "/" + status + "/" + error);
        }
    });
}

function merge_exam_info_with_student_result( mb_exam_json ) {
    // 학생의 시험결과를 exam_info 와 합치기
    $.each( mb_exam_json, function ( key, item) {
        if (  key != "mb_id" &&  key != "mb_kakao" ) {
            let exam_info_id     = key;
            
            $.each( exam_info, function( index, exam_row ) {
                if (exam_row.exam_info_id == exam_info_id ) {   // 시험지 번호가 동일하면
                    exam_row["answer_student"] = item.answer_student;
                    exam_row["score"] = item.score;
                    exam_row["ex_cnt"] = item.ex_cnt;
                    exam_row["ex_end_dt"] = item.ex_end_dt;
                }
            });
        }
    });
}

function main_list( res ){

    // 학생의 시험결과과  시험지 목록을 합침
    if ( res != {} ) {
        merge_exam_info_with_student_result( res );
    }else{
        console.log("시험 결과가 없으므로 합치지 않음");
    }

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

function studentScoreAjaxPost( json_data, callback){    // json_data.url 로 post 데이터 전송
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
                //alert("오류 err=" + err );
                console.log( "Request Failed: " + err );
                callback({});
            },// 요청 실패.
            complete:function(jqXHR) {
                console.log( "complete" );
                gWS.showProgressBar(false);
            }// 요청의 실패, 성공과 상관 없이 완료 될 경우 호출
        });
}

/* Custom filtering function which will search data in column four between two values */
$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {

    var ex_end_dt   = null;
    let from_date   = $("#from_date").val();
    let to_date     = $("#to_date").val();
    
    if( moment(data[7], 'YYYY-MM-DD HH:mm:ss', true).isValid() ){
        ex_end_dt = [ data[7].slice(0, 4), "-", data[7].slice(5, 7), "-", data[7].slice(8, 10)].join('');    
    }

    // 응시한 결과를 점수가 있는걸로 확인
    let score_checked = $("#chk_score").is(":checked");
    if( !score_checked ){
        return true;
    }
    var min = 0
    var max = 100
    var score = parseFloat(data[8]) || -1; // use data for the score column // 숨겨진 컬럼으로 7 사용
 
    if (
        (isNaN(min) && isNaN(max)) ||
        (isNaN(min) && score <= max) ||
        (min <= score && isNaN(max)) ||
        (min <= score && score <= max)
    ) {
        return true;
    }

    return false;
    // 점수 확인 종료
});

$(function(){
    
    // 시험지 목록과 학생의 시험결과를 합쳐서 보여줌
    mb_kakao    = gWS.getParameterByName("mb_kakao");
    mb_id       = gWS.getParameterByName("mb_id");
    mb_level    = gWS.getParameterByName("mb_level");

    json_data   = {"url":"/static/plan_user/" + mb_id + "_" + mb_kakao + ".json" }

    studentScoreAjaxPost( json_data, main_list );   // 학생성적데이터 불러와서 목록처리

    $("#refresh").on("click", function() {
        let select_year = $("#year_select option:selected").val();
        post_get_exam_info(select_year);
        $("#modal_year").val(select_year+"년");
    });

    $("#refresh_modal_cancel").on("click", function() {
        $("#refresh_exam3").modal("hide");
    });

    $("#refresh_modal_confirm").on("click", function() {
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
    // 응시한시험표시 설정
    $("#chk_score").on("change",  function() {
        dataTable.draw();
    });
    // 응시한시험표시 설정
    $("#from_date,#to_date").on("change",  function() {
        dataTable.draw();
    });
    adTest       = gWS.getParameterByName("adTest");
    if(adTest=='Y'){
        $("#chk_score").prop("checked", true);
    }
});

