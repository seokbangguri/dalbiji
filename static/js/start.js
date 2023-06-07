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
	//localStorage.setItem("location", JSON.stringify(JSON.parse(Android.location())));
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

	//지도 중앙 맞춤
	tMap.Move_center(JSON.parse(localStorage.getItem("location"))[0],JSON.parse(localStorage.getItem("location"))[1]);

	//기본 디폴트 데이터
	var data = JSON.parse(APILOAD.sorting_by_time(Android.selectByDate($(".current-date").val())));
	var currentTime = time.getHours() + ':' + time.getMinutes();
    var today = tMap.year+'-'+tMap.double_digit(tMap.month)+'-'+tMap.double_digit(tMap.date);

	//일정 내용 삽입
    if(data[0] !== undefined){
        for(i=0;i<JSON.parse(Android.selectByDate($(".current-date").val())).length;i++){
            //이전 날짜 볼 때
            if ( $(".current-date").val() < today || $(".current-date").val() > today){
                if ( data[i]['dbAddress']) {
                    $(".schedule").append("<li class=\"row\"><div class=\"col-4 marker\"><img src=\"images/marker/"+(i+1)+".png\"></div><div class=\"col-8\"><div class=\"row data-rank\">"+(i+1)+"순위"+"</div><div class=\"row data-name\">"+data[i]['dbSchName']+"</div><div class=\"row data-time\">"+data[i]['dbStartTime']+" ~ "+data[i]['dbEndTime']+"</div></div></li>");
                    let push_arr = [ data[i]["dbLocLon"], data[i]["dbLocLat"] ]; //장소값이 있는 데이터만 경로,마커 표시 하기위함
                    START.location_arr.push({"arr" : push_arr, "nu": i });
                    console.log(START.location_arr);
                }
            }
            //오늘 날짜 볼 때
            else{
                if(data[i]['dbEndTime'] == ''){
                    var passtime = true;
                }
                else{
                    var passtime = false;
                    var endTime = data[i]['dbEndTime'];
                }
                if( endTime < currentTime && passtime == false){
                    if ( data[i]['dbAddress']) {
                        $(".schedule").append("<li class=\"row\" style=\"opacity: 0.5;\"><div class=\"col-4 marker\"><img src=\"images/marker/"+(i+1)+".png\"></div><div class=\"col-8\"><div class=\"row data-rank\">"+(i+1)+"순위"+"</div><div class=\"row data-name\">"+data[i]['dbSchName']+"</div><div class=\"row data-time\">"+data[i]['dbStartTime']+" ~ "+data[i]['dbEndTime']+"</div></div></li>");
                    }
                }
                else{
                    if ( data[i]['dbAddress']) {
                        $(".schedule").append("<li class=\"row\"><div class=\"col-4 marker\"><img src=\"images/marker/"+(i+1)+".png\"></div><div class=\"col-8\"><div class=\"row data-rank\">"+(i+1)+"순위"+"</div><div class=\"row data-name\">"+data[i]['dbSchName']+"</div><div class=\"row data-time\">"+data[i]['dbStartTime']+" ~ "+data[i]['dbEndTime']+"</div></div></li>");
                        let push_arr = [ data[i]["dbLocLon"], data[i]["dbLocLat"] ]; //장소값이 있는 데이터만 경로,마커 표시 하기위함
                        START.location_arr.push( {"arr" : push_arr, "nu": i });
                        console.log(START.location_arr);
                    }
                }
            }
        }

        //현위치 마커
        tMap.start_marker(JSON.parse(localStorage.getItem("location"))[0],JSON.parse(localStorage.getItem("location"))[1]);

		//현위치좌표 배열형태로 시작점으로 지정
        START.start_end_arr.push( JSON.parse(localStorage.getItem("location")));
        if(START.location_arr.length > 0){
        for ( let num = 0; num < START.location_arr.length; num++ ) {
            if ( num == START.location_arr.length - 1 ) {
                tMap.end_marker( START.location_arr[num]['arr'][0], START.location_arr[num]['arr'][1] , START.location_arr[num]['nu'] );
                START.start_end_arr.push( [ START.location_arr[num]['arr'][0], START.location_arr[num]['arr'][1] ]);
            }
            else {
                tMap.stop_marker( START.location_arr[num]['arr'][0], START.location_arr[num]['arr'][1], START.location_arr[num]['nu'] );
                START.via_arr.push( [ START.location_arr[num]['arr'][0], START.location_arr[num]['arr'][1] ]);
            }
        }

		//라인 그리기
		APILOAD.get_tMap_route( START.start_end_arr ,START.via_arr );
	}
	//일정이 없을 시 현위치 마커만 표시
	else{
		$(".schedule").append("<li><div class=\"row no-sch\">등록된 일정이 없습니다.</div></li>");
		tMap.start_marker(JSON.parse(localStorage.getItem("location"))[0],JSON.parse(localStorage.getItem("location"))[1]);
	}

	//날짜 선택시 데이터 불러오기
	$(".current-date").change(function(){
		sessionStorage.setItem("session_date",$(".current-date").val());
		location.reload();
	});

	$("#myposition").on("click", function(){
		tMap.Move_center(JSON.parse(localStorage.getItem("location"))[0],JSON.parse(localStorage.getItem("location"))[1]);
		map.setZoom(17);
		console.log("center");
	});
});


window.onload = function() {
	  // 로딩창을 감추는 로직
	  $(".load").css("display", "none");
}
