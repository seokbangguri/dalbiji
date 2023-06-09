let START = {
	location_arr : [],
	start_end_arr: [],		//[0] : 현위치, [1] : 마지막 경유지
	via_arr: []				// 중간 경유지들 모음
}




$(function() {

	// 데이터 초기화
	START.location_arr = [];
	
	//현재위치
	//let current_location = JSON.parse(Android.location());

	//현재위치 저장
	localStorage.setItem("location", JSON.stringify(JSON.parse(Android.location())));
	//localStorage.setItem("location", current_location);


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

	//현위치 마커
	tMap.start_marker(JSON.parse(localStorage.getItem("location"))[0],JSON.parse(localStorage.getItem("location"))[1]);

	//지도 중앙 맞춤
	tMap.Move_center(JSON.parse(localStorage.getItem("location"))[0],JSON.parse(localStorage.getItem("location"))[1]);

	//기본 디폴트 데이터
	var data = JSON.parse(Android.selectByDate($(".current-date").val()));

	//일정 내용 삽입
	if(data[0] !== undefined){
		for(i=0;i<JSON.parse(Android.selectByDate($(".current-date").val())).length;i++){
			if ( data[i]['dbAddress']) {
				$(".schedule").append("<li class=\"row\"><div class=\"col-4 marker\"><img src=\"images/marker/"+(i+1)+".png\"></div><div class=\"col-8\"><div class=\"row data-rank\">"+(i+1)+"순위"+"</div><div class=\"row data-name\">"+data[i]['dbSchName']+"</div><div class=\"row data-time\">"+data[i]['dbStartTime']+" ~ "+data[i]['dbEndTime']+"</div></div></li>");
				let push_arr = [ data[i]["dbLocLon"], data[i]["dbLocLat"] ]; //장소값이 있는 데이터만 경로,마커 표시 하기위함
				START.location_arr.push( push_arr );
			}
		}
		//현위치좌표 배열형태로 시작점으로 지정
		START.start_end_arr.push( JSON.parse(localStorage.getItem("location")));

		for ( let num = 0; num < START.location_arr.length; num++ ) {
			if ( num == START.location_arr.length - 1 ) {
				tMap.end_marker( START.location_arr[num][0], START.location_arr[num][1] , num );
				START.start_end_arr.push( [ START.location_arr[num][0], START.location_arr[num][1] ]);
			}
			else {
				tMap.stop_marker( START.location_arr[num][0], START.location_arr[num][1], num );
				START.via_arr.push( [ START.location_arr[num][0], START.location_arr[num][1] ]);
			}
		}

		//라인 그리기
		APILOAD.get_tMap_route( START.start_end_arr ,START.via_arr );
	}
	//일정이 없을 시 현위치 마커만 표시
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
		tMap.Move_center(JSON.parse(localStorage.getItem("location"))[0],JSON.parse(localStorage.getItem("location"))[1]);
		console.log("center");
	});
});


window.onload = function() {
	  // 로딩창을 감추는 로직
	  $(".load").css("display", "none");
}
