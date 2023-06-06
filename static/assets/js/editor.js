let EDITOR  = {


    makeForm:function( formName, textData,  pFormImageId, pCanvasId, pCanvasId4Text,num) {
        var formName    = formName;
        var thisForm    = EDITOR.text_options[formName];
        var form_keys   = Object.keys(thisForm);
        for ( var i = 0; i < form_keys.length; i++) {
            console.log("1");
            var sKey    = form_keys[i];
            var ti = thisForm[ sKey ];
            ti.txt  = textData[ sKey ];
            EDITOR.add_text_to_form( ti.txt, ti.x, ti.y, ti.f, 
                    pFormImageId, pCanvasId, pCanvasId4Text,form_keys.length,num );
        }
    },
    text_to_image_autosize: function( pText, pFont, pCanvasId) {
        // text 를 이미지로 변환
        let pObjCanvas  = $("#" + pCanvasId );
        let cW          = 1920;
        let cH          = 1280;
        pObjCanvas.width( cW );   //처음에는 영역을 설정
        pObjCanvas.height( cH );
        var composeCtx  = pObjCanvas[0].getContext('2d');
        composeCtx.clearRect(0,0, cW, cH); 
        // canvas 에 text  넣기
        composeCtx.font = pFont;
        var text    = composeCtx.measureText( pText ); // 텍스트를 넣고 측정
        cW          = text.width;
        cH          = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;
        if (!cH ) {
            cH = 14;
        }

        pObjCanvas.width( cW );   //처음에는 영역을 설정
        pObjCanvas.height( cH );
        composeCtx  = pObjCanvas[0].getContext('2d');
        composeCtx.clearRect(0,0, cW, cH); 
        composeCtx.font = pFont;
        composeCtx.fillText( pText, 0, cH, cW);
        composeCtx.textBaseLine = 'bottom';
        // canvase 의 이미지를 리턴
        var imgData  = pObjCanvas[0].toDataURL('image/svg+xml');
        return imgData;

    },
    text_to_image: function( pText, pW, pH, pFont, pCanvasId) {
        // text 를 이미지로 변환
        let pObjCanvas  = $("#" + pCanvasId );
        pObjCanvas.width( pW );   //처음에는 영역을 설정
        pObjCanvas.height( pH );
        var composeCtx  = pObjCanvas[0].getContext('2d');
        composeCtx.clearRect(0,0, pW, pH); 
        // canvas 에 text  넣기
        composeCtx.font = pFont;
        composeCtx.fillText( pText, 0, pH, pW);
        composeCtx.textBaseLine = 'bottom';
        // canvase 의 이미지를 리턴
        var imgData  = pObjCanvas[0].toDataURL('image/svg+xml');
        return imgData;
    },
    add_text_to_form: function( pText, pX, pY, pFont, pFormImageId, pCanvasId, pCanvasId4Text,leng,num) {
            // pText 를 pFormImageId 의 이미지에 넣기
            //-- 이미지 병합용 canvas 초기화
            let pObjFImage  = $("#" + pFormImageId );
            let cWidth  = pObjFImage.width();
            let cHeight = pObjFImage.height();
            let pObjCanvas  = $("#" + pCanvasId );
            pObjCanvas.width( cWidth  );
            pObjCanvas.height( cHeight );

            var composeCtx  = pObjCanvas[0].getContext('2d');
            composeCtx.clearRect(0,0, cWidth, cHeight); 
            //-- 겹치기 모드설정
            composeCtx.globalCompositeOperation = "source-over"; 
            //-- 서식 이미지를  이미지 변합용 canvas 에 불러오기
            var formImage   = new Image();
            formImage.onload = function() {
                composeCtx.globalAlpha = 1;
                composeCtx.fillStyle = "rgb(255,255,255)";
                composeCtx.fillRect(0,0, cWidth, cHeight);
                composeCtx.drawImage(formImage, 0, 0); // 서식이므로 0, 0 에 넣기

                // text이미지 넣기 
                var addImage   = new Image();
                addImage.onload = function() {
                    EDITOR.add_text_count += 1;
                    composeCtx.fillStyle = "rgba(255,255,255,0)";
                    composeCtx.drawImage(addImage,pX, pY);
                    console.log("EDITOR:"+EDITOR.add_text_count);
                    var dataURL = pObjCanvas[0].toDataURL();
                    $("#img_risk").attr("src", dataURL );
                    //-- add_text 했다고 처리
                    if(leng+1 == EDITOR.add_text_count){
                        setTimeout(()=> EDITOR.bobsave(num),1000);
                    }
                    
                };
                //addImage.src = EDITOR.text_to_image( pText, pW, pH, pFont, pCanvasId4Text )
                addImage.src = EDITOR.text_to_image_autosize( pText, pFont, pCanvasId4Text );
            }
            formImage.src   = $("#" + pFormImageId).attr("src");
        
    },
    after_save_call_fun: null,
    save_pdf: function( file_name, doc) {
        //----- pdf 저장
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))   {
               // var s_base64    = doc.output('datauristring');
               // var s_base64    = doc.output('datauri');
                var pdf_base64 = doc.output('datauristring')
                var s_base64 = pdf_base64.substr(51,);
                window.Android.save_pdf( file_name, s_base64 );
                $.confirm({
                    title: 'Excel등록 확인',
                    boxWidth: '300px',
                    boxHeight: '300px',
                    titleClass: 'work_no_title',
                    useBootstrap: false,
                    content: 'PDF파일이 저장되었습니다.' ,
                    title: '',
                    buttons: {
                        formSubmit: {
                            text: '확인',
                            btnClass: 'btn-green btn_work_no_save',
                            action : function(){
                                history.back();
                            }
                        }
                    },
                    onContentReady: function () {
                    }
                });
            }
            else
            {
                 doc.save( file_name);
                 if ( EDITOR.after_save_call_fun != null){
                    setTimeout( EDITOR.after_save_call_fun, 200);
                }
            }

    },
    selected_sign_no: ""    // 선택한 서명하기 버튼번호 예) 001_01

}


