let APILOAD = {
    get_geocode_ajax: function( input_val_start, input_val_goal ) {
        //시작점의 위치좌표를 geocode를 이용해 가져옴.
        let input_val_arr = [];
        let return_input_val = [];
        input_val_arr.push( input_val_start );
        input_val_arr.push( input_val_goal );
        
        for ( let val of input_val_arr ) {
            let val_arr = [];
            $.ajax({
                dataType: 'json',
                type: 'GET',
                async:false,
                url: 'https://dapi.kakao.com/v2/local/search/address.json?query=' + encodeURIComponent( val ),
                headers : {
                    'Authorization': 'KakaoAK 2d8dee6c148740cd323b3f1824d7198a'
                },
                success: function(result){
                    val_arr.push(parseFloat(result.documents[0].x));
                    val_arr.push(parseFloat(result.documents[0].y));
                    return_input_val.push( val_arr );
					console.log(return_input_val);
                },  
                error: 
                    function(data,response, status, xhr) {
                    alert('마커 좌표 가져오기 실패');
                    console.log(data)
                    }
            });
        }   
        return return_input_val
    },

	//경유지 추가시 좌표값 불러옴
	get_geocode_one_ajax: function( input ) {
		let val_arr =[];
		$.ajax({
			dataType: 'json',
			type: 'GET',
			async:false,
			url: 'https://dapi.kakao.com/v2/local/search/address.json?query=' + encodeURIComponent( input ),
			headers : {
				'Authorization': 'KakaoAK 2d8dee6c148740cd323b3f1824d7198a'
			},
			success: function(result){
				val_arr.push(parseFloat(result.documents[0].x));
				val_arr.push(parseFloat(result.documents[0].y));
				console.log(val_arr);
			},  
			error: 
				function(data,response, status, xhr) {
				alert('마커 좌표 가져오기 실패');
				console.log(data)
				}
		});
		return val_arr;

	},

	//경유지 좌표값 배열
	get_stoppoints_geocode: function(a,b,c,d,e) {
		let stp_arr = [];
		if(a) {
            stp_arr.push(APILOAD.get_place_name(a));
        }
        if(b) {
            stp_arr.push(APILOAD.get_place_name(b));
        }
        if(c) {
            stp_arr.push(APILOAD.get_place_name(c));
        }
        if(d) {
            stp_arr.push(APILOAD.get_place_name(d));
        }
        if(e) {
            stp_arr.push(APILOAD.get_place_name(e));
        }

		return stp_arr;
	},
	//키워드로 검색하기
	get_place_name: function( input ) {
		let total_arr = [];
		for(let i of input) {
			let val_arr =[];
			$.ajax({
				dataType: 'json',
				type: 'GET',
				async:false,
				url: 'https://dapi.kakao.com/v2/local/search/keyword.json?query=' + encodeURIComponent( i ),
				headers : {
					'Authorization': 'KakaoAK 2d8dee6c148740cd323b3f1824d7198a'
				},
				success: function(result){
					val_arr.push(parseFloat(result.documents[0].x));
					val_arr.push(parseFloat(result.documents[0].y));
					total_arr.push(val_arr);
					console.log(total_arr);
				},  
				error: 
					function(data,response, status, xhr) {
					//alert('마커 좌표 가져오기 실패');
					console.log(data)
					}
			});
		}
		return total_arr;

	},

    get_tMap_route: ( position_arr, stp_arr ) => {
        let start_x = String(position_arr[0][0]);
        let start_y = String(position_arr[0][1]);
        let end_x = String(position_arr[1][0]);
        let end_y = String(position_arr[1][1]);
		let str = stp_arr.join("_");
		let passList = String(str);
        $.ajax({
            method : "POST",
            url : "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
            async : false,
            data : {
                "appKey" : "l7xx3456096962854ec98aa6c8218aca5c5b",
                "startX" : start_x,
                "startY" : start_y,
                "endX" : end_x,
                "endY" : end_y,
				"passList" : passList,
                "reqCoordType" : "WGS84GEO",
                "resCoordType" : "EPSG3857",
                "startName" : "출발지",
                "endName" : "도착지"
            },
            success : function(response) {
                var resultData = response.features;
						//결과 출력
						var tDistance = "총 거리 : "
								+ ((resultData[0].properties.totalDistance) / 1000)
										.toFixed(1) + "km";
						var tTime = " 총 시간 : "
								+ ((resultData[0].properties.totalTime) / 60)
										.toFixed(0) + "분";

						$("#result-distance").text(tDistance);
						$("#result-time").text(tTime);
						
						//기존 그려진 라인 & 마커가 있다면 초기화
						if (tMap.resultdrawArr.length > 0) {
							for ( var i in tMap.resultdrawArr) {
								tMap.resultdrawArr[i]
										.setMap(null);
							}
							tMap.resultdrawArr = [];
						}
						tMap.drawInfoArr = [];

						for ( var i in resultData) { //for문 [S]
							var geometry = resultData[i].geometry;
							var properties = resultData[i].properties;
							var polyline_;


							if (geometry.type == "LineString") {
								for ( var j in geometry.coordinates) {
									// 경로들의 결과값(구간)들을 포인트 객체로 변환 
									var latlng = new Tmapv2.Point(
											geometry.coordinates[j][0],
											geometry.coordinates[j][1]);
									// 포인트 객체를 받아 좌표값으로 변환
									var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
											latlng);
									// 포인트객체의 정보로 좌표값 변환 객체로 저장
									var convertChange = new Tmapv2.LatLng(
											convertPoint._lat,
											convertPoint._lng);
									// 배열에 담기
									tMap.drawInfoArr.push(convertChange);
								}
							} else {
								var markerImg = "";
								var pType = "";
								var size;

								if (properties.pointType == "S") { //출발지 마커
									markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
									pType = "S";
									size = new Tmapv2.Size(94, 38);
								} else if (properties.pointType == "E") { //도착지 마커
									markerImg = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
									pType = "E";
									size = new Tmapv2.Size(94, 38);
								} else { //각 포인트 마커
									markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
									pType = "P";
									size = new Tmapv2.Size(0, 0);
								}

								// 경로들의 결과값들을 포인트 객체로 변환 
								var latlon = new Tmapv2.Point(
										geometry.coordinates[0],
										geometry.coordinates[1]);

								// 포인트 객체를 받아 좌표값으로 다시 변환
								var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
										latlon);

								var routeInfoObj = {
									markerImage : markerImg,
									lng : convertPoint._lng,
									lat : convertPoint._lat,
									pointType : pType
								};

								// Marker 추가
								marker_p = new Tmapv2.Marker(
										{
											position : new Tmapv2.LatLng(
													routeInfoObj.lat,
													routeInfoObj.lng),
											icon : routeInfoObj.markerImage,
											iconSize : size,
											map : map
										});
							}
						}//for문 [E]
						tMap.drawLine(tMap.drawInfoArr);
						var res_time = "";
						var res_dis = "";
						//값 추가 맟 단위 변환
						if (((resultData[0].properties.totalTime) / 60).toFixed(0) > 60){
							res_time = (((resultData[0].properties.totalTime) / 3600).toFixed(0) + "시간");
						}
						else {
							res_time = (((resultData[0].properties.totalTime) / 60).toFixed(0) + "분");
						}
						if (((resultData[0].properties.totalDistance) / 1000).toFixed(1) < 1){
							res_dis = (((resultData[0].properties.totalDistance)).toFixed(1) + "m");
						}
						else {
							res_dis = (((resultData[0].properties.totalDistance) / 1000).toFixed(1) + "km");
						}
						$(".time").text(res_time);
						$(".distance").text(res_dis);

            },
            error : function(request, status, error) {
                console.log("code:" + request.status + "\n"
                        + "message:" + request.responseText + "\n"
                        + "error:" + error);
				//로딩바 제거
            }
        });
    },

	//dbStartTime 순으로 배열 재배치
	sorting_by_time: (jsonArray) => {

		// JSON을 JavaScript 객체로 변환
		var objArray = JSON.parse(jsonArray);

		// 'dbstarttime'을 가지고 있는 데이터와 가지고 있지 않은 데이터를 분리
		var dataWithStartTime = [];
		var dataWithoutStartTime = [];

		objArray.forEach(function(obj) {
			if (obj.dbStartTime !== "") {
				dataWithStartTime.push(obj);
			} else {
				dataWithoutStartTime.push(obj);
			}
		});

		// 'dbstarttime'을 가지고 있는 데이터를 'dbstarttime'을 기준으로 오름차순으로 정렬
		dataWithStartTime.sort(function(a, b) {
			var dateA = a.dbStartTime;
			var dateB = b.dbStartTime;
			return dateA.localeCompare(dateB);
		});

		// 정렬된 데이터와 가지고 있지 않은 데이터를 합쳐서 새로운 배열 생성
		var sortedArray = dataWithStartTime.concat(dataWithoutStartTime);

		// 정렬된 배열을 다시 JSON 형식으로 변환
		var sortedJsonArray = JSON.stringify(sortedArray);

		console.log(sortedJsonArray);
		return sortedJsonArray;

	}

}

