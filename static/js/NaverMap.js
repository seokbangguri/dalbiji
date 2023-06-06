let gNaverMap = {
    position_arr: [[37.5290124, 126.9145545], [37.5269703, 126.9330939]],
    position_cener: new naver.maps.LatLng(37.5290124, 126.9145545),
    map: null,
    markers: [],
    polylines: [],
    marker_start: null,
    marker_goal: null,
    polyline_arr: [
        [
            126.9148920,
            37.5286641
        ],
        [
            126.9152952,
            37.5289139
        ],
        [
        126.9154518,
                37.5290102
        ],
        [
            126.9155644,
            37.5290793
        ],
        [
            126.9161321,
            37.5294273
        ],
        [
            126.9165622,
            37.5289878
        ],
        [
            126.9166991,
            37.5288497
        ],
        [
            126.9169706,
            37.5285788
        ],
        [
            126.9171382,
            37.5284192
        ],
        [
            126.9174768,
            37.5280964
        ],
        [
            126.9177481,
            37.5278435
        ],
        [
            126.9177937,
            37.5278023
        ],
        [
            126.9179580,
            37.5276363
        ],
        [
            126.9181610,
            37.5274399
        ],
        [
            126.9183725,
            37.5273085
        ],
        [
            126.9186991,
            37.5270721
        ],
        [
            126.9192875,
            37.5266514
        ],
        [
            126.9193925,
            37.5265411
        ],
        [
            126.9200302,
            37.5258844
        ],
        [
            126.9201032,
            37.5258099
        ],
        [
            126.9202242,
            37.5256825
        ],
        [
            126.9203200,
            37.5255848
        ],
        [
            126.9204033,
            37.5254996
        ],
        [
            126.9212406,
            37.5246393
        ],
        [
            126.9213239,
            37.5245540
        ],
        [
            126.9214995,
            37.5243746
        ],
        [
            126.9220243,
            37.5238328
        ],
        [
            126.9220551,
            37.5238014
        ],
        [
            126.9231477,
            37.5227080
        ],
        [
            126.9231933,
            37.5226631
        ],
        [
            126.9234248,
            37.5224317
        ],
        [
            126.9235959,
            37.5222595
        ],
        [
            126.9236791,
            37.5221734
        ],
        [
            126.9237738,
            37.5220729
        ],
        [
            126.9238229,
            37.5220217
        ],
        [
            126.9242036,
            37.5216640
        ],
        [
            126.9244601,
            37.5214173
        ],
        [
            126.9244784,
            37.5213976
        ],
        [
            126.9247646,
            37.5211232
        ],
        [
            126.9249174,
            37.5209707
        ],
        [
            126.9250748,
            37.5208083
        ],
        [
            126.9253748,
            37.5204997
        ],
        [
            126.9263362,
            37.5195309
        ],
        [
            126.9264263,
            37.5194340
        ],
        [
            126.9264468,
            37.5194125
        ],
        [
            126.9264913,
            37.5193640
        ],
        [
            126.9266602,
            37.5194775
        ],
        [
            126.9268674,
            37.5196074
        ],
        [
            126.9269609,
            37.5196683
        ],
        [
            126.9272942,
            37.5198862
        ],
        [
            126.9273550,
            37.5199216
        ],
        [
            126.9273956,
            37.5199453
        ],
        [
            126.9274666,
            37.5199880
        ],
        [
            126.9277424,
            37.5201669
        ],
        [
            126.9278731,
            37.5202495
        ],
        [
            126.9279756,
            37.5203059
        ],
        [
            126.9285636,
            37.5206639
        ],
        [
            126.9286492,
            37.5207166
        ],
        [
            126.9287506,
            37.5207784
        ],
        [
            126.9291515,
            37.5210390
        ],
        [
            126.9292991,
            37.5211281
        ],
        [
            126.9295401,
            37.5212779
        ],
        [
            126.9299084,
            37.5214997
        ],
        [
            126.9301742,
            37.5216695
        ],
        [
            126.9304704,
            37.5218620
        ],
        [
            126.9305391,
            37.5219038
        ],
        [
            126.9307554,
            37.5220382
        ],
        [
            126.9310438,
            37.5222091
        ],
        [
            126.9311654,
            37.5222836
        ],
        [
            126.9315821,
            37.5225515
        ],
        [
            126.9318704,
            37.5227394
        ],
        [
            126.9319053,
            37.5227640
        ],
        [
            126.9320168,
            37.5228348
        ],
        [
            126.9324516,
            37.5231001
        ],
        [
            126.9325271,
            37.5231482
        ],
        [
            126.9325969,
            37.5231927
        ],
        [
            126.9332390,
            37.5235771
        ],
        [
            126.9333866,
            37.5236742
        ],
        [
            126.9334857,
            37.5237342
        ],
        [
            126.9336310,
            37.5238232
        ],
        [
            126.9340770,
            37.5241066
        ],
        [
            126.9341897,
            37.5241774
        ],
        [
            126.9343440,
            37.5242755
        ],
        [
            126.9343631,
            37.5242873
        ],
        [
            126.9344870,
            37.5243663
        ],
        [
            126.9347719,
            37.5245498
        ],
        [
            126.9350749,
            37.5247495
        ],
        [
            126.9351570,
            37.5248067
        ],
        [
            126.9352279,
            37.5248593
        ],
        [
            126.9341011,
            37.5257111
        ],
        [
            126.9336183,
            37.5261063
        ],
        [
          126.9331062,
            37.5264833
        ],
        [
            126.9327977,
         37.5267126
        ],
        [
            126.9327943,
            37.5267152
        ]
    ],
    makeMap: function() {
        //지도를 생성
        var map = new naver.maps.Map('map', {
            center: gNaverMap.position_center,
            zoom: 10
        });
        gNaverMap.map = map;
    },

    makeMarker: function( position ) {
        //마커 생성
        if ( position ) {
            // for ( let latlon of position ){
                var markerOptions = {
                    position: position,
                    map: gNaverMap.map,
                    // icon: {
                    //     url: './img/pin_default.png',
                    //     size: new naver.maps.Size(25, 39),
                    //     origin: new naver.maps.Point(0, 0),
                    //     anchor: new naver.maps.Point(11, 35)
                    // }
                };
                var marker = new naver.maps.Marker(markerOptions);
                //마커 삭제를 위해 객체를 전역배열에 담아둠
                gNaverMap.markers.push( marker );
            // }
        }
        else {
            for (let location of gNaverMap.position_arr){
                let position = new naver.maps.LatLng(location[0], location[1]);
                var markerOptions = {
                    position: position,
                    map: gNaverMap.map,
                    // icon: {
                    //     url: './img/pin_default.png',
                    //     size: new naver.maps.Size(25, 39),
                    //     origin: new naver.maps.Point(0, 0),
                    //     anchor: new naver.maps.Point(11, 35)
                    // }
                };
                var marker = new naver.maps.Marker(markerOptions);
                //마커 삭제를 위해 객체를 전역배열에 담아둠
                gNaverMap.markers.push( marker );
            }
        }
    },
    
    drwaLine: function() {
        //polyline 그리기
        let = result_line_arr = [];
        for ( let arr of gNaverMap.polyline_arr) {
            let latlon = new naver.maps.LatLng(arr[1], arr[0]);
            result_line_arr.push( latlon );
        }
    
        var polyline = new naver.maps.Polyline({
            map: gNaverMap.map,
            path: result_line_arr
        });
        //polyline 삭제를 위해 객체를 전역배열에 담아둠
        gNaverMap.polylines.push( polyline )
    },

    // get_latlon: function( input_val_start, input_val_goal ) {
    //     //위치좌표를 ajax를 통해 가져온다.
    //     if ( input_val ) {
    //         APILOAD.get_geocode_ajax ( input_val_start, input_val_goal );
    //     }
    // },

    // get_latlon_goal:function( input_goal ) {
    //     //시작점의 위치좌표를 geocode를 통해 가져옴.
    //     let goal_latlon = null;
    //     $.ajax({
    //         dataType: 'json',
    //         type: 'GET',
    //         url: 'https://dapi.kakao.com/v2/local/search/address.json?query=' + encodeURIComponent(input_goal),
    //         headers : {
    //             'Authorization': 'KakaoAK 2d8dee6c148740cd323b3f1824d7198a'
    //         },
    //         success: 
    //             function(data,response, status, xhr) {
    //             alert("Success");
    //             console.log(data)
    //             gNaverMap.marker_start = data;
    //             let lat = data.documents[0].y;
    //             let lon = data.documents[0].x;
    //             let latlon = new naver.maps.LatLng(lat, lon);
    //             goal_latlon = latlon ;
    //             },
    //         error: 
    //             function(data,response, status, xhr) {
    //             alert('get location start Failed!');
    //             console.log(data)
    //             }
    //         });
    //     return goal_latlon;
    // }
    
}
