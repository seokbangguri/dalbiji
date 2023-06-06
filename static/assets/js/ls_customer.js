//------------ 

let dataTable = null;


function show_manager_table() {
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


    if($('#manager_table').length > 0) {
       dataTable = $('#manager_table').DataTable({              
             "bFilter": true,                                                
             "bInfo": true,                                                  
             "bPaginate": true,                                              
             "bAutoWidth": false, 
             "lengthMenu": [ [100, 200, 500, -1], [100, 200, 500, "All"] ],
             "pageLength": -1,
             "ordering":true,
             "bScrollCollapse": true,                                         
             "language" : lang_kor
        }); 
    }
}
  


function main_list(  ){
    show_manager_table();
    $("#manager_table_filter").addClass("hide"); 
    return 'ok';
}

function set_filter(){
    let region = $("#region").val();
    let cus_nm = $("#cus_nm").val();

    let s_filter    = "";
    if ( !gWS.isEmpty( region) ) {
            //$("#manager_table .show.region").addClass("hide"); 
            s_filter     += region;
    }
    if ( !gWS.isEmpty(cus_nm) ) {
            s_filter     += " " + cus_nm;
    }

    if (s_filter > "") {
        dataTable.search(s_filter).draw();
    }else{
        dataTable.search("").draw();
    }
}

let gCS = {
    proc_keep: function(ls_carrier_hist_id, user_q_keep ){
        // 수령확인
        json_data   = { 'url': '/ls/carrier/keep',
                        'ls_carrier_hist_id': ls_carrier_hist_id,
                        'user_q_keep': user_q_keep
                        }
        gWS.ajaxPostApi( json_data, gCS.proc_keep_return );
    },
    proc_keep_return: function(res){
        location.reload();
    },
    proc_fwd: function(ls_carrier_id, user_q_fwd ){
        // 외주처 출고
        json_data   = { 'url': '/ls/carrier/fwd',
                        'ls_carrier_id': ls_carrier_id,
                        'user_q_fwd': user_q_fwd
                        }
        gWS.ajaxPostApi( json_data, gCS.proc_fwd_return );
    },
    proc_fwd_return: function(res){
        location.reload();
    }
    
    
}

/*          
qqq-setTouchSpin
---------------------------------------------------------------------------------------------------------------------
[Description]   |       Set input[type="text"] make a TouchSpin and TouchSpin event handling
[Dependency]    |       PATH="/static/global/vendor/bootstrap-touchspin/jquery.bootstrap-touchspin.min.js"
[Caution!]      |       This method have context dependency [hr_manager_item]
[Return]        |       No return value
---------------------------------------------------------------------------------------------------------------------
[Arguments]     |       No arguments 
---------------------------------------------------------------------------------------------------------------------
*/
function setTouchSpin(action){
    const SPIN = { CHIP:"", VALUE:0, KEY:"", SUPPLIER:"" };
    setTimeout(function(){
        $("input.form-control.touch-spin").data("plugin", "touchSpin").TouchSpin({
            min: 0,
            max: 100,
            step: 1,
            decimals: 0,
            boostat: 5,
            maxboostedstep: 10,
        });
    },300);
    
    $("input.form-control.touch-spin").on({
        "touchspin.on.startupspin": function(e){
            e.stopPropagation();
        },
        "touchspin.on.startdownspin": function(e){
            e.stopPropagation();
        },
        "touchspin.uponce": function(e) {
            e.stopPropagation();
        }
    });
    console.log("setTouchSpin finished");

};

$(document).ready(function(){
    $(".carrier_num").on("click", function(e) {
        $(".carrier_num").each(function(idx, item){
            $(item).removeClass("active");
        });
        $(this).addClass("active");
        let ls_carrier_id   = $(this).data("id");
        $(".carrier.div_count").each(function(idx, item){
            $(item).addClass("hide");
        });
        $("#div_carrier_" + ls_carrier_id ).removeClass("hide");    // 선택한 캐리어종류의 현황을 표시
    });

    $("#btn_keep").on("click", function(e) {
        if ( job_in_count == 0 ){
            event.preventDefault();
            gWS.alert_msg("수령할 입고중 캐리어가 없습니다.");
            return false;
        }
        if (1==2){
            let c_id    = $(this).data("id");
            let tr_obj  = $("#tr_" + c_id );
            let customer_id     = tr_obj.data("mb_id")||'';
            let customer_name   = tr_obj.data("mb_name")||'';
            let carrier_num     = tr_obj.data("carrier_num")||'';
            let q_in            = tr_obj.data("q_in")||'0';
            let q_keep          = tr_obj.data("q_keep")||'0';
            let q_empty         = tr_obj.data("q_empty")||'0';
            let q_out           = tr_obj.data("q_out")||'0';
            let date_modified   = tr_obj.data("date_modified")||'0';
            
            $("#ls_carrier_id_keep").val( c_id );
            $("#customer_id_keep").val( customer_name + " ( " + customer_id + " ) " );
            $("#carrier_num_keep").val( carrier_num );
            $("#q_in").val( q_in );  //-- 출고수량
            //$("#qty_keep").val( q_in );  //-- 확인수량 은 직접 입력하도록 하기 위해 값을 안채움
        }
        $("#confirm_keep").modal("show");
    });

    $("#btn_fwd").on("click", function(e) {
        let total_q_in  = 0;
        for (var i=0; i< ls_carrier_list.length; i++){
            total_q_in  += ls_carrier_list[i].q_in;
        }
        if ( total_q_in == 0) {
            event.preventDefault();
            gWS.alert_msg("외주처 출고할 캐리어가 없습니다.");
            return false;
        }
        $("#confirm_fwd").modal("show");
    });

    $("#div_total_count").on("click", function(e) {
        $("#div_carrier_detail").toggleClass("hide");
    });
    $(".carrier_action").on("click", function(e) {
        if ( $(this).hasClass("carrier_in") ) {
            $("#confirm_keep").modal("show");
        }
    });
    $(".btn_keep_action ").on("click", function(e) {
        // 수령확인
        event.preventDefault();
        let ls_carrier_hist_id  =   $(this).data("id");
        let db_qty  = $("#q_keep_" + ls_carrier_hist_id ).data("qty"); // db 에 있는 수량
        let in_qty  = $("#q_keep_" + ls_carrier_hist_id ).val();        // 사용자가 입력한 수량
        if ( gWS.isEmpty( in_qty) ) {
            gWS.alert_msg("수량을 입력바랍니다.");
            return;
        } 
        db_qty      = parseInt( db_qty );   
        in_qty      = parseInt( in_qty );   
        if ( db_qty != in_qty ) {    //  db 수량만 다르면 NG 이므로 한번 더 확인
            msg     = "수량이 틀립니다. <br> 정말로 저장하시겠습니까?<br>  이 경우, 수량오류로 LS전선관리자에게 연락됩니다.  ";

            $.confirm( {
                theme: "Material",
                boxWidth: '600px',
                content: msg,
                //autoClose: '닫기|5000',
                title: "수령확인",
                buttons: { 
                    "저장": function() {
                        gCS.proc_keep(ls_carrier_hist_id, in_qty );
                    },
                    "취소": function() {
                    }
                }
            });

        } else{
                        gCS.proc_keep(ls_carrier_hist_id, in_qty );
        }        
    });
    $(".btn_fwd_action ").on("click", function(e) {
        // 외주처출고 확인
        event.preventDefault();
        let ls_carrier_id   =   $(this).data("id");
        let carrier_num     =   $(this).data("num");
        let db_qty  = $("#q_fwd_" + ls_carrier_id ).data("qty"); // db 에 있는 수량
        let fwd_qty  = $("#q_fwd_" + ls_carrier_id ).val();        // 사용자가 입력한 수량
        if ( gWS.isEmpty( fwd_qty) ) {
            gWS.alert_msg("수량을 입력바랍니다.");
            return;
        } 
        db_qty      = parseInt( db_qty );   
        fwd_qty      = parseInt( fwd_qty );   
        if ( db_qty < fwd_qty ) {    //  db 수량보다 많으면 안됨
            msg     = "현재 보유중인 " + carrier_num + "의  만권 "+ db_qty + "개 보다 많이 출고할 수는 없습니다.  ";
            gWS.alert_msg("수량을 입력바랍니다.");
            return;
        } 
        gCS.proc_fwd(ls_carrier_id, fwd_qty );
                
    });

    main_list();

    setTouchSpin();

    // ls_carrier_id 값이 있다면
    if ( ls_carrier_id ) {
    }
});

