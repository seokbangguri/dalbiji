let TMAP = {
	url:"https://apis.openapi.sk.com/tmap/pois",
	appkey: 'l7xx3456096962854ec98aa6c8218aca5c5b'
}
//현재 날짜
time = new Date();
year = time.getFullYear();
month = time.getMonth() + 1;
date = time.getDate();
//한자리수 두자리 만들기
if(month < 10){
	month = "0"+month;
}
if(date < 10){
	date = "0"+date;
}

$(function() {

	//장소값이 있는 일정이 몇개인지 확인
	let data = JSON.parse(Android.selectByDate(sessionStorage.getItem("session_date")));
	console.log(data.length);
	let count = 0;
	for(i=0; i<data.length; i++) {
		if(data[i]['dbAddress'] !== undefined) {
			count++;
		}
	}

	$('.search_btn').click(function() {
		event.preventDefault(); // 폼의 제출 동작을 막음
		// 검색어 가져오기
		const keyword = $('#inputPlace').val();

		$.ajax({
			url: TMAP.url,
			data: {
				appKey: TMAP.appkey,
				searchKeyword : keyword,
				version: 1
			},
			method: 'GET',
			dataType: 'json',
			success: function(data) {
				// 검색 결과 표시하기
				const searchResults = $('#searchResults');

				// result_data 가 Undefined라면 예외처리
				try {
					let result_data = JSON.parse(JSON.stringify(data.searchPoiInfo.pois.poi));
					searchResults.empty(); // 이전 검색 결과 삭제
					for (row of result_data) {
						console.log("row: " + JSON.stringify(row));
						const li = $('<li></li>').text(row.name);
						li.addClass("select-addr");
						li.data("lat", row.frontLat);
						li.data("lon", row.frontLon);
						li.data("addr", row.name);
						li.click(function() {
							const lat = $(this).data('lat');
							const lon = $(this).data('lon');
							const addr = $(this).data('addr');
							console.log("선택한 li의 위도: " + lat + ", 경도: " + lon + ", 주소: " + addr);
							$("#inputPlace").data("lat", lat);
							$("#inputPlace").data("lon", lon);
							$("#inputPlace").data("addr", addr);
							$("#inputPlace").val( $(this).text());
								searchResults.empty(); // 이전 검색 결과 삭제
						});
						searchResults.append(li);
					}
				}
				catch {
					Swal.fire({
						icon: 'warning',
						title: '검색결과가 존재하지 않습니다.',
						showConfirmButton: false,
						timer: 1500
					})
				}
			},
			error: function(xhr, status, error) {
				console.log("req error");
			}
		});
	});

	$('#edit_contact .search_btn').click(function() {
		event.preventDefault(); // 폼의 제출 동작을 막음
		// 검색어 가져오기
		const keyword = $('#edit_contact #inputPlace').val();

		$.ajax({
			url: TMAP.url,
			data: {
				appKey: TMAP.appkey,
				searchKeyword : keyword,
				version: 1
			},
			method: 'GET',
			dataType: 'json',
			success: function(data) {
				// 검색 결과 표시하기
				const searchResults = $('#edit_contact #searchResults');

				// result_data 가 Undefined라면 예외처리
				try {
					let result_data = JSON.parse(JSON.stringify(data.searchPoiInfo.pois.poi));
					searchResults.empty(); // 이전 검색 결과 삭제
					for (row of result_data) {
						console.log("row: " + JSON.stringify(row));
						const li = $('<li></li>').text(row.name);
						li.addClass("select-addr");
						li.data("lat", row.frontLat);
						li.data("lon", row.frontLon);
						li.data("addr", row.name);
						li.click(function() {
							const lat = $(this).data('lat');
							const lon = $(this).data('lon');
							const addr = $(this).data('addr');
							console.log("선택한 li의 위도: " + lat + ", 경도: " + lon + ", 주소: " + addr);
							$("#edit_contact #inputPlace").data("lat", lat);
							$("#edit_contact #inputPlace").data("lon", lon);
							$("#edit_contact #inputPlace").data("addr", addr);
							$("#edit_contact #inputPlace").val( $(this).text());
							searchResults.empty(); // 이전 검색 결과 삭제
						});
						searchResults.append(li);
					}
				}
				catch {
					Swal.fire({
						icon: 'warning',
						title: '검색결과가 존재하지 않습니다.',
						showConfirmButton: false,
						timer: 1500
					})
				}
			},
			error: function(xhr, status, error) {
				console.log("req error");
			}
		});
	});

	//일정 추가 모달의 저장
	$('.save').on("click", function() {
		//장소있는 일정이 6개 이상인 경우 장소값이 있으면 저장 불가
		if (count >= 6 && $('#inputPlace').val() !== '') {
			Swal.fire({
				icon: 'error',
				title: '장소값이 있는 일정은 6개 이하만 가능합니다!',
				showConfirmButton: false,
				timer: 1500
			})
			$(".close").click();
		}
		else {
		
		// 저장버튼을 클릭하면 android room에 insert
		let title = $("#inputTitle").val();
		let start_time = $(".start_time").val();
		let end_time = $(".end_time").val();
		let addr = $("#inputPlace").data("addr");
		let lat = $("#inputPlace").data("lat");
		let lon = $("#inputPlace").data("lon");
		let memo = $("#memoTextArea").val();

		if ( !title ) {
			//예외처리
			Swal.fire({
				icon: 'warning',
				title: '제목은 필수 항목입니다.',
				showConfirmButton: true,
				timer: 1500
			})
			return;
		}

		let json_data = {
			"bas_dt": main.default_date,
			"dbSchName": title, //일정 제목
			"dbStartTime": start_time, //일정 시작 시간
			"dbEndTime": end_time, //일정 끝 시간
			"dbComplete": "NO", //일정 완료 여부
			"dbAddress": addr, //주소
			"dbLocLat": lat,
			"dbLocLon": lon,
			"dbEtc": memo
		}
		//저장이 완료되면 alert 후 창닫기
		let insert_status = Android.insert( JSON.stringify(json_data) );
		if ( JSON.parse(insert_status).status == "OK" ) {
			Swal.fire({
				icon: 'success',
				title: '저장 완료!',
				showConfirmButton: false,
				timer: 1500
			})
			$(".close").click();
			setTimeout(() => {
				location.reload();
			}, 1500);
		}
		else {
			Swal.fire({
				icon: 'error',
				title: '저장 에러!',
				showConfirmButton: false,
				timer: 1500
			})
			$(".close").click();
		}
		}
	});
	//일정 수정의 모달 저장
	$(".update_save").on("click", function () {
		// 저장버튼을 클릭하면 android room에 insert
		let title = $("#edit_contact #inputTitle").val();
		if(main.edit_status == "hide"){
			var start_time = "";
	        var end_time = "";
		}else{
			var start_time = $("#edit_contact .start_time").val();
			var end_time = $("#edit_contact .end_time").val();
		}
		let addr = $("#edit_contact #inputPlace").data("addr");
		let lat = $("#edit_contact #inputPlace").data("lat");
		let lon = $("#edit_contact #inputPlace").data("lon");
		let memo = $("#edit_contact #memoTextArea").val();
		let seq = $('#edit_contact #inputPlace').data('seq');

		if ( !title ) {
			//예외처리
			Swal.fire({
				icon: 'warning',
				title: '제목은 필수 항목입니다.',
				showConfirmButton: true,
				timer: 1500
			})
			return;
		}

		let json_data = {
			dbSchSeq: seq,
			bas_dt: main.default_date,
			dbSchName: title, //일정 제목
			dbStartTime: start_time, //일정 시작 시간
			dbEndTime: end_time, //일정 끝 시간
			dbComplete: "NO", //일정 완료 여부
			dbAddress: addr, //주소
			dbLocLat: lat, //위도
			dbLocLon: lon, //경도
			dbEtc: memo, //메모
		};
		//수정이 완료되면 alert 후 창닫기
		let update_status = Android.update(JSON.stringify(json_data));
		if (JSON.parse(update_status).status == "OK") {
			Swal.fire({
				icon: 'success',
				title: '수정 완료!',
				showConfirmButton: false,
				timer: 1500
			})
			$(".close").click();
			setTimeout(() => {
				location.reload();
			}, 1500);
		} else {
			Swal.fire({
				icon: 'error',
				title: '수정 실패!',
				showConfirmButton: false,
				timer: 1500
			})
			$(".close").click();
			setTimeout(() => {
				$(".close").click();
			}, 1500);
		}
	});


	//modal창 닫으면 초기화
	$('.modal').on('hidden.bs.modal', function (e) {
			$(this).find('form')[0].reset();
			$('#edit_contact #date_input_div').hide();
            main.edit_status = "hide";
	});
});
