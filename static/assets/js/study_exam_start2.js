let answerQty = "";
let pk        = "";
let time_timer  = null;
let sTime        = 20;

let d = new Date();
let end_dt = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`

let ex_resut_json   = {}; // 시험결과 전체

let answer_result   = {}; // 채점결과
let is_sent_answer   = false;   // 제출했는지 여부

let mb_kakao         = "";
let mb_id         = "";


function button_event(){
    // 정답 제출 
    $("#btn_submit_desk, #btn_submit_mobile").on("click", function(){
        
        clearInterval( time_timer ); //setInterval() 실행을 끝냄

        let sUrl                    = "/exam/answer/check";
        let exam_info_id            = gWS.getParameterByName("pk"); //exam_info_id
        mb_id                       = gWS.getParameterByName("mb_id"); 
        mb_kakao                    = gWS.getParameterByName("mb_kakao"); 
        let ex_yyyy_rd              = gWS.getParameterByName("ex_yyyy_rd"); //응시년도(회차)
        let ex_start_dt             = gWS.getParameterByName("ex_start_dt"); //응시 시작일시
        let ex_end_dt               = end_dt;
        let pdf_file                = gWS.getParameterByName("pdf_file"); //pdf_file 이름 
        let ex_time                 = $("#timer_desk").text(); //응시 시간
        if (ex_time != '시간초과') {
            ex_time = ex_time.replace('남은시간 : ','');
            ex_time = ex_time.replace('분',':');
            ex_time = ex_time.replace('초','');
        }

        if( isMobile.any() ){ // 스마트폰인 경우 실행
            ex_time                     = $("#timer_mobile").text(); //응시 시간
            if (ex_time != '시간초과') { 
                ex_time = ex_time.replace('남은시간 : ','');
                ex_time = ex_time.replace('분',':');
                ex_time = ex_time.replace('초','');
            }
        }
        let answerValue = ""; //학생 제출 정답

        ex_resut_json= { 
            'url'           : sUrl, 
            'exam_info_id'  : exam_info_id, 
            'mb_id'         : mb_id, 
            'mb_kakao'      : mb_kakao, 
            'ex_yyyy_rd'    : ex_yyyy_rd, 
            'ex_start_dt'   : ex_start_dt, 
            'ex_end_dt'     : ex_end_dt, 
            'pdf_file'      : pdf_file, 
            'ex_time'       : ex_time,
            'ex_score'      : 0,
            'answer_student': {} 
        };
        let keys        = [];

        if (ex_time != '시간초과') {
            var not_check_answer = "";
            let int_qty = parseInt(answerQty) + 1;
            for (let i=1; i< int_qty; i++){
                answerValue = $("input[name='answerRadio" + i + "']:checked").val();
                if ( gWS.isEmpty( answerValue ) ) {     
                    not_check_answer += i + ",";
                }
            }

            if (not_check_answer.length > 0){
                not_check_answer = not_check_answer.slice(0,-1);
                not_check_answer += " 번의 정답이 체크되지 않았습니다.\n확인해주세요.";
                return alert(not_check_answer);
            }
        }

        for (let i=1; i<(parseInt(answerQty) + 1); i++){
            answerValue = $("input[name='answerRadio" + i + "']:checked").val();
            if ( gWS.isEmpty( answerValue ) ) {     
                answerValue  = "0";
            }
            sKey        = String(i);
            //json_data["answer_student"][sKey] = answerValue;
            answer_result[sKey] = {"s": parseInt(answerValue), "a":0, "r":"" };
        }


        let score_qty = keys;

        //--정답 비교
        //exam_info에서 정답 json 형식으로 가져오기
        var org_a = {}
        for (var i in exam_info) {
            ex = exam_info[i]
            if (ex.exam_info_id == exam_info_id) {
                org_a = ex.answer;
                org_a = JSON.parse(org_a)
            }
        }

        let score    = 0;
        let unit_score   = 100 / parseInt(answerQty);   // 한 문제당 점수
        for (var key in org_a) {
            if ( !isNaN(key) ) {
                var ex_a = org_a[key];
                var s_a  = answer_result[key];
       
                s_a["a"] = ex_a;    // 답안지 값 저장 
                if ( ex_a == s_a.s ) { // 학생의 입력값과 같으면
                    s_a["r"] = "O";    // 정답이면 O
                    score += unit_score;
                } else {
                    s_a["r"] = "X";    // 오답이면 X
                }
            }
        }
        ex_resut_json["answer_student"] = JSON.stringify( answer_result );
        ex_resut_json["ex_score"]       = score;
        ex_resut_json["score"]       = score;

    
        gWS.ajaxPostApi( ex_resut_json, function(result){
            if(result){
                keys = Object.keys( result ); 
                /*for( let i=0; i<keys.length; i++ ){
                    if (result[keys[i]] == ex_resut_json[keys[i]]){
                                        
                    } 
                }*/
                // 채점 결과를 화면에 표시
                is_sent_answer   = true;
                show_check_result();
            }
        });
    });
}

function set_pdf_viewer(){
    let gdUrlId     = gWS.getParameterByName("gdUrlId"); 
    //$('#pdf_viewer').attr('src', 'https://drive.google.com/uc?id=1fYf_kgrGd4QDIckAF416LeRhg0rDzWjs#preview=FitH');
    let mobileUrl   = "https://drive.google.com/file/d/" + gdUrlId + "/preview?usp=sharing";
    let pcUrl       = "https://drive.google.com/uc?id=" + gdUrlId + "#preview=FitH";
    var wHeight = $(window).height() - 200;

    // 윈도우와 스마트폰 화면 분할
    if( isMobile.any() ){ // 스마트폰인 경우 실행
        $("#pdf_viewer_div").removeClass("col-9").addClass("col-12");
        $("#pdf_viewer_div").css("height", wHeight);
        $(".card").css("height", wHeight);
        $("#answer_div").removeClass("col-3");
        $("#answer_button_div").removeClass("d-none");

        $('#pdf_viewer').attr('src', mobileUrl);
    }else{
        $("#answer_div").removeClass("d-none");
        $('#pdf_viewer').attr('src', pcUrl);
    }
}

function set_answer(){
    // 정답 영역, 타이머 설정
    answerQty       = gWS.getParameterByName("answerQty"); 
    sTime           = gWS.getParameterByName("sTime"); 
    sTime           = sTime * 60 // 초 이므로 분으로 환산
    let sHtml       = ""

	let min = ""; //분
	let sec = ""; //초

	//setInterval(함수, 시간) : 주기적인 실행
	time_timer = setInterval(function() {
		//parseInt() : 정수를 반환
		min = parseInt(sTime/60); //몫을 계산
		sec = sTime%60; //나머지를 계산

        if( isMobile.any() ){ // 스마트폰인 경우 실행
            document.getElementById("timer_mobile").innerHTML = "남은시간 : " + min + "분" + sec + "초";
        }else{
            document.getElementById("timer_desk").innerHTML = "남은시간 : " + min + "분" + sec + "초";
        }

		sTime--;

		//타임아웃 시
		if (sTime < 0) {
			clearInterval( time_timer ); //setInterval() 실행을 끝냄
            if( isMobile.any() ){ // 스마트폰인 경우 실행
                document.getElementById("timer_mobile").innerHTML = "시간초과";
                $("#btn_submit_mobile").html("시험 종료").attr("disabled", true);
            }else{
                document.getElementById("timer_desk").innerHTML = "시간초과";
                $("#btn_submit_desk").html("시험 종료").attr("disabled", true);
            }
            // 답안 자동제출
            $("#btn_submit_desk").trigger("click" );    // 답안제출 버튼 클릭
            
		}
	}, 1000);

    /*
    for (let i=1; i<(parseInt(answerQty) + 1); i++){
        sHtml += `
            <div class="col-md-12 col-sm-12 col-12">
                <a style="margin-left: 1rem; float: left;text-align: left;width: 70px;">` + i + `번</a>
                <div class="form-check form-check-inline div_answer" data-q="${i}" data-a="1">
                    <input class="form-check-input" type="radio" name="answerRadio` + i + `" id="answerRadio` + i + `_1" value="1">
                    <label class="form-check-label" for="answerRadio` + i + `_1">1</label>
                </div>
                <div class="form-check form-check-inline div_answer" data-q="${i}" data-a="2">
                    <input class="form-check-input" type="radio" name="answerRadio` + i + `" id="answerRadio` + i + `_2" value="2">
                    <label class="form-check-label" for="answerRadio` + i + `_2">2</label>
                </div>
                <div class="form-check form-check-inline div_answer" data-q="${i}" data-a="3">
                    <input class="form-check-input" type="radio" name="answerRadio` + i + `" id="answerRadio` + i + `_3" value="3">
                    <label class="form-check-label" for="answerRadio` + i + `_3">3</label>
                </div>
                <div class="form-check form-check-inline div_answer" data-q="${i}" data-a="4">
                    <input class="form-check-input" type="radio" name="answerRadio` + i + `" id="answerRadio` + i + `_4" value="4">
                    <label class="form-check-label" for="answerRadio` + i + `_4">4</label>
                </div>
            </div>
        `
    } */

    sHtml += `
        <div id="div_exam" class="col-12 mt-0 pl-0 pr-0">
            <div class="tab-content mt-0 pt-0">
                <div class="table-responsive">
                    <table id="answer_table" class="table table-striped custom-table mb-0 ">
                        <colgroup>
                            <col width="20%">
                            <col width="15%">
                            <col width="15%">
                            <col width="15%">
                            <col width="15%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th class=""></th>
                                <th class="">1</th>
                                <th class="">2</th>
                                <th class="">3</th>
                                <th class="">4</th>
                            </tr>
                        </thead>
                        <tbody id="answer_table_body">
     `
    for (let i=1; i<(parseInt(answerQty) + 1); i++){
        sHtml += `
        <tr>
            <td>` + i + `번 </td>
            <td> 
                <div class="form-check form-check-inline div_answer" data-q="${i}" data-a="1">
                    <input class="form-check-input" type="radio" name="answerRadio` + i + `" id="answerRadio` + i + `_1" value="1">
                    <label class="form-check-label" for="answerRadio` + i + `_1"></label>
                </div>
            </td>
            <td>
                <div class="form-check form-check-inline div_answer" data-q="${i}" data-a="2">
                    <input class="form-check-input" type="radio" name="answerRadio` + i + `" id="answerRadio` + i + `_2" value="2">
                    <label class="form-check-label" for="answerRadio` + i + `_2"></label>
                </div>
            </td>
            <td>
                <div class="form-check form-check-inline div_answer" data-q="${i}" data-a="3">
                    <input class="form-check-input" type="radio" name="answerRadio` + i + `" id="answerRadio` + i + `_3" value="3">
                    <label class="form-check-label" for="answerRadio` + i + `_3"></label>
                </div>
            </td>
            <td>
                <div class="form-check form-check-inline div_answer" data-q="${i}" data-a="4">
                    <input class="form-check-input" type="radio" name="answerRadio` + i + `" id="answerRadio` + i + `_4" value="4">
                    <label class="form-check-label" for="answerRadio` + i + `_4"></label>
                </div>
            </td>
        </tr>
        `
    }

    sHtml += `
                    </tbody>
                </table>
            </div>
        </div>
    </div>

 `

    // 윈도우와 스마트폰 화면 분할
    if( isMobile.any() ){ // 스마트폰인 경우 실행
        $('#answer_radio_mobile').html( sHtml );
    }else{
        $('#answer_radio_desk').html( sHtml );
    }
}

function show_check_result(){    // 채점결과를 화면에 표시
    answerQty       = gWS.getParameterByName("answerQty") || 20; 
    sHtml           = `
            <div class="row">
                <div class="col-3"> 문제</div>
                <div class="col-3"> 정답</div>
                <div class="col-3"> 제출</div>
                <div class="col-2"> 결과</div>
            </div>
         `

    for (let i=1; i<(parseInt(answerQty) + 1); i++){
        let r_row    = answer_result[ i ];
        let r_color  = "";
        if ( r_row.r == "X") {
            r_color="bg-danger";
        } 
        sHtml += `
            <div class="row">
                <div class="col-3"> ${i}번</div>
                <div class="col-3"> ${r_row.a}</div>
                <div class="col-3 ${r_color}"> ${r_row.s}</div>
                <div class="col-2 ${r_color}"> ${r_row.r}</div>
            </div>
        `
    }

    let score   = ex_resut_json["ex_score"] || 0;

    // 윈도우와 스마트폰 화면 분할
    if( isMobile.any() ){ // 스마트폰인 경우 실행
        $('#btn_submit_mobile').addClass("hide");
        $('#btn_list_mobile').removeClass("hide");
        $('#answer_radio_mobile').addClass("hide");
        $('#answer_result_mobile').removeClass("hide");
        $('#answer_result_mobile').html( sHtml );
        $("#timer_mobile").html( "점수 : " + score );
    }else{
        $('#btn_submit_desk').addClass("hide");
        $('#btn_list_desk').removeClass("hide");
        $('#answer_radio_desk').addClass("hide");
        $('#answer_result_desk').removeClass("hide");
        $('#answer_result_desk').html( sHtml );
        $("#timer_desk").html( "점수 : " + score );
    }
}

let isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i) == null ? false : true;
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
    },
    any: function () {
        return ( isMobile.Android() ||  isMobile.iOS());
    }
}

function resize_frame(){
    let page_height = $("#div_page_wrapper").height();
    let pdf_height  = page_height - ( $("div.header").height() + 30 ) ;
    if ( pdf_height > 100 ) {
        $("#pdf_viewer").height( pdf_height );
    }
}

function go_list_html(){
        if ( is_sent_answer ) {
            let exam_url = gWS.base_server + "/static/html/plan-study-exam.html?"
                            +"mb_kakao=" + mb_kakao
                            +"&mb_id=" + mb_id;
            location.href= exam_url;
        }
}

$(function () {
    // pdf 뷰어 불러오기
    set_pdf_viewer();

    // 문제 수, 시험 시간 확인
    set_answer();

    button_event();  // 답안제출

    resize_frame();

    $(".div_answer").on("click", function() {
        let q_no    = $(this).data("q");    // 문제번호
        let a_no    = $(this).data("a");    // 문제번호
        $("#answerRadio" + q_no + "_" + a_no ).prop("checked", true );
    });
   
    $( window ).resize( function() {
        resize_frame();
    }); 

    $("#answer_modal").on("hide.bs.modal", function(){   // modal 창이 닫히면
        go_list_html();
    });
    $("#btn_list_mobile").on("click",  function() {
        go_list_html();
    });
    $("#btn_list_desk").on("click",  function() {
        go_list_html();
    });
});
