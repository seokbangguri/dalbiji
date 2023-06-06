$(function(){
    $(".fc-right").hide();
});
let main = {
    status: "hide"
};

$(function(){
    //년월일 버튼 제거
    $(".fc-right").hide();
    //시간입력 토글버튼 클릭마다 시간 input 태그를 보여준다.
    $("#date_input_div").hide();
    $("#customSwitches").on("click",function(){
        if(main.status == "hide"){
            $("#date_input_div").show();
            main.status = "show";
        }
        else if(main.status == "show"){
            $("#date_input_div").hide();
            main.status = "hide";
        }
    })
});

