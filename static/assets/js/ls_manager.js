//------------ 

let student_json = null;
let dataTable = null;
let dt = null; //modal datatable

let mb_kakao    = null;
let mb_id       = null;


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


$(function(){
    $("#region").on("keyup",  function() {
        set_filter();
    });
    $("#cus_nm").on("keyup",  function() {
        set_filter();
    });
    $("#confirm_keep").on("show.bs.modal", function(e) {
        let c_id    = $(event.target).data("id");
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
        $("#qty_num").val( q_in );  //-- 확인수량
    });
    main_list();
});

