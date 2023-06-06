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
                    let latlon = new naver.maps.LatLng(parseFloat(result.documents[0].y), parseFloat(result.documents[0].x));
                    gNaverMap.makeMarker( latlon );
                    val_arr.push(parseFloat(result.documents[0].x));
                    val_arr.push(parseFloat(result.documents[0].y));
                    return_input_val.push( val_arr );
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

    get_position_ajax: function( start_goal_arr ) {
        let start_point = 'start=' + start_goal_arr[0][0] + ',' + start_goal_arr[0][1];
        let goal_point = 'goal=' + start_goal_arr[1][0] + ',' + start_goal_arr[1][1];
        // 출발점과 도착점의 빠른길찾기 경로를 가져온다.
        $.ajax({
            dataType: 'jsonp',
            type: 'GET',
            async: false,
            // url: 'https://cors-anywhere.herokuapp.com/https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?'+start_point+'&' + goal_point + '&' + 'option=trafast',
            url: 'https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving?'+start_point+'&' + goal_point + '&' + 'option=trafast',
            headers : {
                'X-NCP-APIGW-API-KEY-ID': 'kmkbkwnbn1',
                'X-NCP-APIGW-API-KEY':'dXDK4Lfcgd9r0jnldN47ZKRbZR2rrtvaDxufhzBf'
            },
            success: function(result){
                console.log(result);
                // callback(result);
            },  
            error: 
                function(data,response, status, xhr) {
                alert('빠른길찾기 경로 request 실패');
                console.log(data)
                }
            });   
    },
    get_tMap_route: ( position_arr ) => {
        let start_x = position_arr[0][0];
        let start_y = position_arr[0][1];
        let end_x = position_arr[0][1];
        let end_y = position_arr[0][1];
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
                "reqCoordType" : "WGS84GEO",
                "resCoordType" : "EPSG3857",
                "startName" : "출발지",
                "endName" : "도착지"
            },
            success : function(response) {
                alert("success");
                console(response);
            },
            error : function(request, status, error) {
                console.log("code:" + request.status + "\n"
                        + "message:" + request.responseText + "\n"
                        + "error:" + error);
            }
        });
    }
}

// $.ajax({
//     dataType: 'json',
//     type: 'GET',
//     url: 'https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving?start=127.1058342,37.359708&goal=129.075986,35.179470&option=trafast',
//     headers : {
//     'X-NCP-APIGW-API-KEY-ID' : 'lx0zt0rv7a',
//     'X-NCP-APIGW-API-KEY' : 'mQGizpgo9iiv1Nakh1KV4qFiuPOfyLbTF4rwrqcu'
//     },
//     success: function(data,response, status, xhr) {
//     alert("Success");
//     console.log(data)
//     },
//     error: function(data,response, status, xhr) {
//     alert('Failed!');
//     console.log(data)
//     }
//     });