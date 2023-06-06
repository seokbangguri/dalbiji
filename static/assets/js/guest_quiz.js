//------------ 학생의 시험지 목록 제공 및 시험결과 표시 

let gGuest  = {
    mb_id    : "",
    mb_pwd    : "",
    sel_guest_quiz_id    : null,
    sel_quiz    : null,
}


function proc_quiz_select(pObj){
        let sel_subject_no     = $(pObj).data("subjectno");
        let sel_subject     = $(pObj).data("subject");
        let sel_plan        = $(pObj).data("plan");
        let sel_quiz_id     = $(pObj).data("quiz_id");
        gGuest.sel_quiz = {
            subject_no:sel_subject_no,
            subject:sel_subject,
            plan:sel_plan,
            quiz_id:sel_quiz_id,
        }        
        $("tr.tr_quiz_title").each(function(idx, item){
            $(item).removeClass("active");
        });
        $(pObj).addClass("active");
}

function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

$(function(){
    if($('.custom-table').length > 0) {
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
       dataTable = $('.custom-table').DataTable({              
             "processing": true,
             "bFilter": true,                                                
             "bInfo": true,                                                  
             "bPaginate": true,                                              
             "bAutoWidth": false, 
             "lengthMenu": [ [5, 50, 100, 200, 500, -1], [5, 50, 100, 200, 500, "All"] ],
             "pageLength": 0,
             "ordering":true,
             "bScrollCollapse": true,                                         
             "language" : lang_kor
        }); 
        dataTable.on( 'search.dt', function () {
            $("tr.tr_quiz_title").on("click", function(){ // quiz 선택내용 확인
                proc_quiz_select(this);
            });
        } );

       dataTable2 = $('.custom-table2').DataTable({              
             "processing": true,
             "bFilter": true,                                                
             "bInfo": true,                                                  
             "bPaginate": true,                                              
             "bAutoWidth": false, 
             "lengthMenu": [ [500, -1], [500, "All"] ],
             "pageLength": 0,
             "ordering":false,
             "bScrollCollapse": true,                                         
             "language" : lang_kor
        }); 


    }

    //------------------------------------------
    //------------------------------------------
    let sel_guest_quiz_id     = $("#sel_guest_quiz_id").val();
    if ( sel_guest_quiz_id > "" ){
        gGuest.sel_guest_quiz_id = sel_guest_quiz_id;
    }
    //------------------------------------------
    //------- checkWide 확인
    //------------------------------------------
    if ( localStorage.getItem("checkWide") == "ON" ) {
        $('#checkWide').prop('checked',true);
        $('#div_quiz').removeClass("hide");
        $('#div_act_add').removeClass("hide");
        $('#div_act_quiz').addClass("hide");
        $('#div_act_url').removeClass("hide");
        
    }else{
        if ( $("#sel_guest_quiz_id").val() > "0" ) {
            $('#checkWide').prop('checked',false);
            $('#div_quiz').addClass("hide");
            $('#div_act_add').addClass("hide");
            $('#div_act_quiz').removeClass("hide");
            $('#div_act_url').addClass("hide");
        }
    }
    $("#btn_show_quiz").on("click", function(){ // quiz 선택내용 확인
        $('#div_quiz').removeClass("hide");
        $('#div_act_add').removeClass("hide");
        $('#div_act_quiz').addClass("hide");
        $('#div_act_url').removeClass("hide");
    });
        
    //------------------------------------------
 
    $("#checkWide").on("change", function(){ // quiz 선택내용 확인
        let checkWide    = 'OFF';
        if ( $('#checkWide').is(':checked') ) {
            checkWide    = 'ON';
        }
        localStorage.setItem("checkWide", checkWide );
    });
 
    $("tr.tr_guest_quiz").on("click", function(){ // quiz 선택내용 확인
        let sel_guest_quiz_id     = $(this).data("id");
        gGuest.sel_guest_quiz_id = sel_guest_quiz_id;
        $("tr.tr_guest_quiz").each(function(idx, item){
            $(item).removeClass("active");
        });
        $(this).addClass("active");
        //--------------------------------
        location.href   = "/admin/plan_guest_quiz/" + gGuest.sel_guest_quiz_id + "?ts=" + Date.now();
    });
     
    $("tr.tr_quiz_title").on("click", function(){ // quiz 선택내용 확인
        proc_quiz_select(this);
    });
     
    $("#btn_new_submit").on("click", function(){ // quiz 추가
        if ( gGuest.sel_quiz == null ) {
            gWS.alert_msg("퀴즈를 선택바랍니다.");
            return false;
        } 

        let data_json   = {
            url:"/admin/plan_guest_quiz/add",
            subject_no:   gGuest.sel_quiz.subject_no,
            subject:   gGuest.sel_quiz.subject,
            plan:   gGuest.sel_quiz.plan,
            quiz_id:   gGuest.sel_quiz.quiz_id
        }
        gWS.ajaxPostApi( data_json, function(res){
            if ( res.guest_quiz_id ) {
                location.href= "/admin/plan_guest_quiz/" + res.guest_quiz_id + "?ts=" + Date.now();
            }else{
                gWS.alert_msg( res.error );
            }
        });
    });

    $("#copy_url").on("show.bs.modal", function(){ // copy_url modal show
        let url     = "https://planstudy1.wizice.com/app/guest_quiz/" +  gGuest.sel_guest_quiz_id + "?ts=" + Date.now();
        $("#text_url").val( url );
    });

    $("#btn_url_copy").on("click", function(){ // url copy
        copyToClipboard(document.getElementById("text_url"));
        gWS.alert_msg("복사되었습니다.");
        $("#copy_url").modal("hide");
    });

});

