time = new Date();
let tMap = {
	year: time.getFullYear(),
	month: (time.getMonth()+1),
	date: time.getDate(),
	double_digit: function(a) {
		if(a<10){
			return '0'+a;
		}else{
			return a;
		}
	},
    map: null,
    marker_s: null,
    marker_e: null,
    marker_p1: null,
    marker_p2: null,
	totalMarkerArr: [],
	drawInfoArr: [],
	resultdrawArr: [],
    marker_img: [
		"images/marker/1.png",
        "images/marker/2.png",
        "images/marker/3.png",
        "images/marker/4.png",
        "images/marker/5.png",
        "images/marker/6.png",
        "images/marker/7.png",
		"images/marker/8.png",
		"images/marker/9.png",
		"images/marker/10.png",
		"images/marker/11.png",
		"images/marker/12.png",
		"images/marker/13.png",
		"images/marker/14.png",
		"images/marker/15.png"
    ],

    initTmap: () => {
        map = new Tmapv2.Map("map_div", {
//            center : new Tmapv2.LatLng(37.38030121417301, 126.92766444856224),
				center : new Tmapv2.LatLng(JSON.parse(localStorage.getItem('location'))[1],JSON.parse(localStorage.getItem('location'))[0]),
                width : "100%",
                height : "90vh",
                //default zoom : 17,
                zoom : 17,
                zoomControl : true,
                scrollwheel : true
        });     
    },


    start_marker: ( start_x, start_y)  => {
        let start_marker = new Tmapv2.Marker({
                position : new Tmapv2.LatLng(start_y, start_x),
                icon : "images/marker/start.gif",
                iconSize : new Tmapv2.Size(38, 45),
                map : map
        });
		tMap.totalMarkerArr.push( start_marker );
    },

    end_marker: ( end_x, end_y, i ) => {
		let end_marker = new Tmapv2.Marker({
                position : new Tmapv2.LatLng(end_y, end_x),
                icon : tMap.marker_img[i],
                iconSize : new Tmapv2.Size(38, 45),
                map : map
            });
		tMap.totalMarkerArr.push( end_marker );
    },

    stop_marker: (stop_x, stop_y,i) => {
        var stop_marker = new Tmapv2.Marker({
                position : new Tmapv2.LatLng(stop_y, stop_x),
                icon :  tMap.marker_img[i],
                iconSize : new Tmapv2.Size(38, 45),
                map : map
            });
        tMap.totalMarkerArr.push( stop_marker );
    },

    addComma: ( num ) => {
        var regexp = /\B(?=(\d{3})+(?!\d))/g;
		return num.toString().replace(regexp, ',');
    },

    drawLine: ( arrPoint ) => {
        var polyline_;

		polyline_ = new Tmapv2.Polyline({
			path : arrPoint,
			strokeColor : "#0058ff",
			strokeWeight : 6,
			map : map
		});
		tMap.resultdrawArr.push(polyline_);
    },
    Move_center: ( point_x, point_y ) => {
        var lonlat = new Tmapv2.LatLng(point_y, point_x);
        map.setCenter(lonlat); // 지도의 중심 좌표를 설정합니다.
   }
    
}
