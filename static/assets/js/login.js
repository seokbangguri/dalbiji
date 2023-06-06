
function form_submit() {
        var username        = $("#username").val();
        var password        = $("#password").val();
        localStorage.setItem("ps_username", username );
        localStorage.setItem("ps_password", password );
        $("#form_login").attr( "action", "/app/login" );
        return true;

}
$(window).on ('load', function (){

    
    var key_val = "";

    //
    var ps_username        = localStorage.getItem( "ps_username" );
    var ps_password        = localStorage.getItem( "ps_password" );
    if ( ps_username ) {
        $("#username").val( ps_username);
    }
    if ( ps_password ) {
        $("#password").val( ps_password);
    }

    // 로그인 되기전에 입력한 값을 localStorage 에 저장
    $("#form_login").submit( function() {
        return form_submit();
    });

    
});
