$(document).ready(function(){
    //$("#signature-pad").hide();
    $("#btnSeo").on("click",function(){
    });

    $("#btnSeong").on("click",function(){
        EDITOR.selected_sign_no = "001_01";
    });

    $("#a_edit_name").on("click",function(){
        var url = "https://szimek.github.io/signature_pad/";

        window.open( url );
        //$("#edit_name").modal({backdrop: 'static'});
        //setTimeout( function() { 
        //    $(".modal-backdrop").remove(); 
        //    $("#edit_name").css( { "margin-top": "60px;" } );
        //    //$("#sidebar").hide();
        //}, 500 );
    });

    $("#a_delete_name").on("click",function(){
        $("#delete_name").modal({backdrop: 'static'});
        setTimeout( function() { $(".modal-backdrop").remove(); }, 500 );
    });

    $("#a_edit_sign").on("click",function(){
        $("#edit_sign").modal({backdrop: 'static'});
        setTimeout( function() { 
            $(".modal-backdrop").remove(); 
            //$("#sidebar").hide();
            $("#edit_sign").css( { "margin-top": "60px;" } );
        }, 500 );
    });

    $("#a_delete_sign").on("click",function(){
        $("#delete_sign").modal({backdrop: 'static'});
        setTimeout( function() { $(".modal-backdrop").remove(); }, 500 );
    });

});


