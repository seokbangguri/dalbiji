//------------ 학생 전체의 시험지 차트 테스트

function setChart(json_data){
    am5.ready(function() {
        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("chartdiv");
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Animated.new(root)
        ]);
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            pinchZoomX:true
        }));
        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xRenderer = am5xy.AxisRendererX.new(root, { minGridDistance: 30 });
        xRenderer.labels.template.setAll({
            rotation: -90,
            centerY: am5.p50,
            centerX: am5.p100,
            paddingRight: 15
        });
        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            maxDeviation: 0.3,
            categoryField: "mb_name",
            renderer: xRenderer,
            tooltip: am5.Tooltip.new(root, {})
        }));
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0.3,
            min: 0,
            max: 100,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));
        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
            name: "Series 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "score",
            sequencedInterpolation: true,
            categoryXField: "mb_name",
            tooltip: am5.Tooltip.new(root, {
                labelText:"{valueY}"
            })
        }));
        series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
        series.columns.template.adapters.add("fill", function(fill, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });
        series.columns.template.adapters.add("stroke", function(stroke, target) {
            return chart.get("colors").getIndex(series.columns.indexOf(target));
        });
        // Set data
        var data = json_data
        xAxis.data.setAll(data);
        series.data.setAll(data);
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);
    }); // end am5.ready()
}

function set_rank_table_tbody( res ) {
    var data = res;

    var lang_kor = {
        "decimal" : "",
        "emptyTable" : "데이터가 없습니다.",
        "info" : "_START_ - _END_ (총 _TOTAL_ 개)",
        "infoEmpty" : "0개",
        "infoFiltered" : "(전체 _MAX_ 개 중 검색결과)",
        "infoPostFix" : "",
        "thousands" : ",",
        "lengthMenu" : "_MENU_ 개씩 보기",
        "loadingRecords" : "로딩중...",
        "processing" : "처리중...",
        "search" : "검색 : ",
        "zeroRecords" : "검색된 데이터가 없습니다.",
        "paginate" : {
            "first" : "첫 페이지",
            "last" : "마지막 페이지",
            "next" : "다음",
            "previous" : "이전"
        },
        "aria" : {
            "sortAscending" : " :  오름차순 정렬",
            "sortDescending" : " :  내림차순 정렬"
        }
    };

    var dataTable = $('#rank_table').DataTable({              
             "processing": true,
             "bFilter": true,                                                
             "bInfo": true,                                                  
             "bPaginate": true,                                              
             "bAutoWidth": false, 
             "data": res,
             "aoColumns" : [
                 { "width" : "30px" }, 
                 { "width" : "30px" },
                 { "width" : "30px" },
                 { "width" : "30px" },
                 { "width" : "30px" }
             ],
             "columns" : [
                { "data" : "mb_name" },
                { "data" : "score"  },
                { "data" : "ex_cnt"  },
                { "data" : "ex_end_dt"  },
                { "data" : "scroe_rank"  }
             ],
             "lengthMenu": [ [100, 200, 500, -1], [100, 200, 500, "All"] ],
             "pageLength": -1,
             "ordering":true,
             "bScrollCollapse": true,                                         
             "language" : lang_kor,
              "buttons": [
                {
                   "extend": 'excelHtml5',
                   "charset": 'UTF-8',
                   "title": '',
                   "text" : 'Excel',
                },
                {
                   "extend": 'print',
                   "charset": 'UTF-8',
                   "title": '',
                   "text" : 'Print',
                }
            ]
    }); 

    dataTable.buttons().container()
        .appendTo( '#rank_table_div .col-md-6:eq(0)' );


}

function ajax_score_rank_require( exam_info_id ){
    let pUrl = '/exam/manager/rank';
    let json_data = { 'exam_info_id' : exam_info_id, 'url' : pUrl };
    gWS.ajaxPostApi( json_data, set_rank_table_tbody );

}

$(function(){
    let res         = JSON.parse( gWS.getParameterByName("res") );
    let json_data   = res.student_score;
    let exam_info_id = res.exam_info_id;
    setChart( json_data );

    ajax_score_rank_require ( exam_info_id );
});

