let main = {	
	status: "hide",
	edit_status: "hide",
	month_date: [31,28,31,30,31,30,31,31,30,31,30,31],
	//시간 불러오기
	time: new Date(),
	year: time.getFullYear(),
	month: time.getMonth() + 1,
	date: time.getDate(),
	//한자리 수 두자리 만들기
	double_digit: function( a ){
		if(a < 10){
			a = "0"+a;
		}
		return a;
	},
	//요일 배열
	week: new Array('일','월','화','수','목','금','토'),
	//날짜
	default_date: year+'-'+month+'-'+date,
	//일정 불러오기
	get_schedules: function(data){
		$(".contact-list").empty();
		for(var i = 0; i < data.length; i++){
			$(".contact-list").append("<li><div class=\"contact-cont\"><div class=\"float-left user-img\"><a href=\"#\" class=\"avatar\"><img class=\"rounded-circle\" alt=\"\" src=\"images/tags/sch"+(i+1)+".png\" /></a></div> <div class=\"contact-info\"><span class=\"contact-name text-ellipsis\">"+data[i]['dbSchName'] +"</span><span class=\"contact-date\">"+data[i]['dbStartTime']+"~"+data[i]['dbEndTime']+"</span></div><ul class=\"contact-action\"><li class=\"dropdown dropdown-action\"><a href=\"\" class=\"dropdown-toggle action-icon\" data-toggle=\"dropdown\" aria-expanded=\"false\"><i class=\"material-icons\">more_vert</i></a><div class=\"dropdown-menu dropdown-menu-right\" id=\"li-nu"+" "+i+"\"> <a class=\"dropdown-item edit-item\" href=\"javascript:void(0)\" data-toggle=\"modal\" data-target=\"#edit_contact\">수정<div class=\"dbSchSeq\" style=\"display:none\">"+data[i]['dbSchSeq']+"</div></a ><a  class=\"dropdown-item delete-item\"  href=\"javascript:void(0)\" data-toggle=\"modal\" data-target=\"#delete_contact\" >삭제</a></div></li></ul></div></li>");
			//태그에 데이터 입력
        	$("#li-nu\\ "+i).data('seq',data[i]['dbSchSeq']);
		}
	},
	set_date_btn: function(){
		//날짜 버튼 생성
		var ses_time = new Date(main.default_date);
		$('.date_content').empty();
		for(i=0;i<main.month_date[main.month-1];i++){
			var btn_day = new Date(main.year+'-'+main.double_digit(main.month)+'-'+main.double_digit(i+1));
			$(".date_content").append("<div class=\"col-3 date-btn\"><button class=\"w-100 h-100 btn btn-primary default-date-btn\"><p id=\"date\">"+(i+1)+"</p><p id=\"day\">"+main.week[btn_day.getDay()]+"</p></button></div>");
		}
	}
};


$(function(){
		//첫 로드시 세션데이터에 위도, 경도값 저장
		if(Android.location() != '[0,0]'){
			sessionStorage.setItem("session_latitude", JSON.parse(Android.location())[0]);
            sessionStorage.setItem("session_longitude", JSON.parse(Android.location())[1]);
		}

		//세션 또는 디폴트 날짜의 버튼위치로 가로 스크롤
		var dd = main.default_date.slice(8);
		if(dd[0] == "0"){
			dd = dd.slice(1);
		}
		$("#date").each(function() {
			var h3_value = $(this).text();
			console.log(h3_value);
			if(h3_value == dd){
				$("html, body").animate({
					scrollLeft: $(this).first().offset().left}, 500);
			}
		});
		//$("html, body")
		$(".date_content").css({'flex-wrap':'nowrap'});
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
		//edit 모달 스위치 버튼
		$("#edit_contact #date_input_div").hide();
		$("#edit_contact #edit_customSwitches").on("click",function(){
			if(main.edit_status == "hide"){
				$('#edit_contact #date_input_div').show();
				main.edit_status = "show";
			}
			else if(main.edit_status == "show"){
				$('#edit_contact #date_input_div').hide();
				main.edit_status = "hide";
			}
		});

		//현재 날짜 띄우기
		//세션 데이터가 있을 때
		if(sessionStorage.getItem("session_date") !== null) {
			main.default_date = sessionStorage.getItem("session_date");
			var ses_time = new Date(main.default_date);
			main.year = ses_time.getFullYear();
			main.month = ses_time.getMonth() +1;
			main.date = ses_time.getDate();
			$("#current_date").html(main.year+"년 "+main.month+"월");
			$('#selected_date').text(main.month+"월 "+main.date+"일");
		}else{
			//세션 데이터가 없을시 디폴트 데이트
			$("#current_date").html(main.year+"년 "+main.month+"월");
			$('#selected_date').text(main.month+"월 "+main.date+"일");
		}
		//좌우 화살표 클릭 시 월 변경
		$('#left-btn').on('click', function(){
			if(main.month == 1){
				main.year = main.year - 1;
				main.month = 12;
			}else{
				main.month = main.month - 1;
			}
			main.default_date = main.year+'-'+main.double_digit(main.month)+'-'+main.double_digit(main.date);
			sessionStorage.setItem("session_date", main.default_date);
			location.reload();

		});
		$('#right-btn').on('click', function(){
			if(main.month == 12){
				main.year = main.year +1;
				main.month = 1;
			}else{
			main.month = main.month + 1;
			}
			main.default_date = main.year+'-'+main.double_digit(main.month)+'-'+main.double_digit(main.date);
			sessionStorage.setItem("session_date", main.default_date);
			location.reload();
		});
		main.set_date_btn();
		//startTime이 endTime보다 늦을 때 경고창 발생
		$(".end_time").change(function(){
			if($(".start_time").val() > $(".end_time").val()){
				$(".end_time").val("");
				Swal.fire({
					icon: 'error',
					title: '종료시간이 시작시간보다 빠릅니다!',
					showConfirmButton: false,
					timer: 1500
				})
			}
		});
		
		//첫 로드 때 기본 데이터
		var data = JSON.parse(Android.selectByDate(main.default_date));
		main.get_schedules(data);
		//날짜 버튼을 클릭 시 해당 날짜의 데이터
		$(".default-date-btn").on("click", function() {
			main.date = $(this).find('#date').text();
			main.default_date = main.year+'-'+main.double_digit(main.month)+'-'+main.double_digit(main.date);
			var data = JSON.parse(Android.selectByDate(main.default_date));
	        $("#current_date").html(main.year+"년 "+main.month+"월");
			$('#selected_date').text(main.month+"월 "+main.date+"일");
			console.log(data);
			sessionStorage.setItem("session_date", main.default_date);
			console.log(main.default_date);

			main.get_schedules(data);
		});
		
		//---수정중---
		//수정,삭제 눌렀을 시 해당 li의 dbSchSeq
		$(".edit-item").on('click',function(){
			//모달이 표시되기 전 실행
		    let edit_data = JSON.parse(Android.selectBySeq($(this).parent().data('seq')))[0];
			$('#edit_contact #inputPlace').data("seq", edit_data['dbSchSeq']);
			$('#edit_contact #inputPlace').data("lon", edit_data['dbLocLon']);
			$('#edit_contact #inputPlace').data("lat", edit_data['dbLocLat']);
			$('#edit_contact #inputPlace').data("addr", edit_data['dbAddress']);
			$('#edit_contact').on('show.bs.modal', function() {
				console.log("쇼비에스모달");
				$("#edit_contact #inputTitle").val(edit_data['dbSchName']);
				if(edit_data['dbStartTime'] !== ""){
					if(main.edit_status == "hide"){
						$("#edit_contact #edit_customSwitches").click();
						main.edit_status = "show";
						$('#edit_contact #date_input_div').show();
					}
					$("#edit_contact .start_time").val(edit_data['dbStartTime']);
					$("#edit_contact .end_time").val(edit_data['dbEndTime']);
				}else{
					if(main.edit_status =="show"){
						$("#edit_contact #edit_customSwitches").click();
						main.edit_status = "hide";
						$("#edit_contact #date_input_div").hide();
					}
					$("#edit_contact .start_time").val("");
					$("#edit_contact .end_time").val("");
				}
				$("#edit_contact #memoTextArea").val(edit_data['dbEtc']);
				$("#edit_contact #inputPlace").val(edit_data['dbAddress']);
			});

		});
		$(".delete-item").on('click',function(){
			console.log($(this).parent().data('seq'));
			Android.deleteSeq(parseInt($(this).parent().data('seq')));
			location.reload();
		});
});
window.onload = function() {
	  // 로딩창을 감추는 로직
	  $(".load").css("display", "none");
}
