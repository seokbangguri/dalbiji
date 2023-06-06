$(window).on ('load', function (){
    $('#table_list thead tr').clone(true).appendTo( '#table_list thead' );
    $('#table_list thead tr:eq(1) th').each( function (i) {
            if ( i>0 ){
                var title = $(this).text();
                $(this).html( '<input type="text" class="data_filter_input" placeholder="Search '+title+'" />' );
                $( 'input.data_filter_input', this ).on( 'keyup change', function () {
                    if ( gWS.data_table.column(i).search() !== this.value ) {
                        gWS.data_table
                            .column(i)
                            .search( this.value )
                            .draw();
                    }
                } );
            }
    } );

    gWS.data_table = $('#table_list').DataTable();
    gWS.data_table.destroy();
    gWS.data_table  = $('#table_list')
        .DataTable( {
            "bFilter": true,
            orderCellsTop: true,
            fixedHeader: true,
            "bPaginate": false,
            "sScrollY": (screen.availHeight - 320) + "px",
            "bScrollCollapse": true,

        }); 

    gWS.kakao_key   = gWS.getParameterByName("kakao");
    if ( gWS.isEmpty( gWS.kakao_key ) ){
        gWS.kakao_key   = $("#kakao_id").val();
    }
    gWS.getStudyLogsData( {'kakao': gWS.kakao_key } );

    $("#table_list .member").on("click", function(){
        gWS.kakao_key = $(event.target).data("kakao");
        gWS.getStudyLogsData( {'kakao': gWS.kakao_key } );
    })
    $("input:radio[name=sel_period]").click( function() {
        gWS.showMemberStudyLogs( gWS.chart_data_4_study_logs );
    });
    $("#sel_show_label").click( function() {
        gWS.showMemberStudyLogs( gWS.chart_data_4_study_logs );
    });

});
