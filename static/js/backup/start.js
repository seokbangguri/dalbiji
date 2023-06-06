$(function() {

	//지도 생성
	tMap.initTmap();
	//'session_date'가 있을 때
	if(sessionStorage.getItem('session_date') !== null) {
		$(".current-date").val(sessionStorage.getItem('session_date'));
	}
	//'session_date'가 없을 때
	else{
		$(".current-date").val(tMap.year + "-" + tMap.double_digit(tMap.month) + "-" + tMap.double_digit(tMap.date));
	}

	//일정 좌표 배열 1. stop_goal_arr = 출발,도착점 좌표 2. stp_arr = 중간 경유 좌표
	let stop_goal_arr = [];
	let stp_arr = [];
	//기본 디폴트 데이터
	var data = JSON.parse(Android.selectByDate($(".current-date").val()));
	console.log(data);
	console.log(data.length);
	//일정 내용 삽입
	if(data[0] !== undefined){
		for(i=0;i<JSON.parse(Android.selectByDate($(".current-date").val())).length;i++){
			if ( data[i]['dbAddress']) {
				$(".schedule").append("<li class=\"row\"><div class=\"col-4 marker\"><img src=\"images/marker/"+(i+1)+".png\"></div><div class=\"col-8\"><div class=\"row data-rank\">"+(i+1)+"순위"+"</div><div class=\"row data-name\">"+data[i]['dbSchName']+"</div><div class=\"row data-time\">"+data[i]['dbStartTime']+" ~ "+data[i]['dbEndTime']+"</div></div></li>");
			}
		}
		//현위치,마지막 위치
		if(sessionStorage.getItem("session_latitude") == null && sessionStorage.getItem("session_longitude") == null) {
			stop_goal_arr.push([data[data.length-1]['dbLocLon'],data[data.length-1]['dbLocLat']]);
		} else {
			stop_goal_arr.push([sessionStorage.getItem("session_longitude"),sessionStorage.getItem("session_latitude")]);
			stop_goal_arr.push([data[data.length-1]['dbLocLon'],data[data.length-1]['dbLocLat']]);
		}

		console.log("stop_goal_arr_1: " + stop_goal_arr);
		console.log("stp_arr_1: " + stp_arr);



		//출발,도착 마커 및 배열
		tMap.start_marker( stop_goal_arr[0][0], stop_goal_arr[0][1] );
		var data_len = data.length - 1;
		tMap.end_marker( stop_goal_arr[1][0], stop_goal_arr[1][1], data_len );
		//출발,도착 제외 경유지들 마커 및 배열
		for( var i=0; i<data.length-1; i++ ) {
			//경유지들 마커찍기
			tMap.stop_marker(data[i]['dbLocLon'],data[i]['dbLocLat'],i);
			let stp = [data[i]['dbLocLon'],data[i]['dbLocLat']];
			stp_arr.push(stp);
		}




		//지도 중앙 맞춤
		tMap.Move_center( stop_goal_arr[0][0], stop_goal_arr[0][1] );
		//경로표시
		console.log("stop_goal_arr: " + stop_goal_arr);
		console.log("stp_arr: " + stp_arr);
		//라인 그리기
		APILOAD.get_tMap_route( stop_goal_arr,stp_arr );
	}
	else{
		$(".schedule").append("<li><div class=\"row no-sch\">등록된 일정이 없습니다.</div></li>");
		tMap.start_marker(sessionStorage.getItem("session_longitude"),sessionStorage.getItem("session_latitude"));
	}

	//날짜 선택시 데이터 불러오기
	$(".current-date").change(function(){
		sessionStorage.setItem("session_date",$(".current-date").val());
		location.reload();
	});

	$("#myposition").on("click", function(){
		tMap.Move_center(stop_goal_arr[0][0],stop_goal_arr[0][1]);
		console.log("center");
	});
});


window.onload = function() {
	  // 로딩창을 감추는 로직
	  $(".load").css("display", "none");
}
