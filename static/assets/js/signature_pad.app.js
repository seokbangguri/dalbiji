var wrapper = document.getElementById("signature-pad");
var clearButton = wrapper.querySelector("[data-action=clear]");
var changeColorButton = wrapper.querySelector("[data-action=change-color]");
var undoButton = wrapper.querySelector("[data-action=undo]");
var saveSIGNButton = wrapper.querySelector("[data-action=save-sign]");
var savePNGButton = wrapper.querySelector("[data-action=save-png]");
var saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
var saveSVGButton = wrapper.querySelector("[data-action=save-svg]");
var canvas = wrapper.querySelector("canvas");
var signaturePad = new SignaturePad(canvas, {
  // It's Necessary to use an opaque color when saving image as JPEG;
  // this option can be omitted if only saving as PNG or SVG
  backgroundColor: 'rgba(255, 255, 255, 0)'
});

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
  // When zoomed out to less than 100%, for some very strange reason,
  // some browsers report devicePixelRatio as less than 1
  // and only part of the canvas is cleared then.
  var ratio =  Math.max(window.devicePixelRatio || 1, 1);

  // This part causes the canvas to be cleared
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);

  // This library does not listen for canvas changes, so after the canvas is automatically
  // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
  // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
  // that the state of this library is consistent with visual state of the canvas, you
  // have to clear it manually.
  signaturePad.clear();
}

// On mobile devices it might make more sense to listen to orientation change,
// rather than window resize events.
window.onresize = resizeCanvas;
resizeCanvas();
function download(dataURL, filename) {
  if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
    window.open(dataURL);
  } else {
    var blob = dataURLToBlob(dataURL);
    var url = window.URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  }
}

// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function dataURLToBlob(dataURL) {
  // Code taken from https://github.com/ebidel/filer.js
  var parts = dataURL.split(';base64,');
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

clearButton.addEventListener("click", function (event) {
  signaturePad.clear();
});

undoButton.addEventListener("click", function (event) {
  var data = signaturePad.toData();

  if (data) {
    data.pop(); // remove the last dot or line
    signaturePad.fromData(data);
  }
});

changeColorButton.addEventListener("click", function (event) {
  var r = Math.round(Math.random() * 255);
  var g = Math.round(Math.random() * 255);
  var b = Math.round(Math.random() * 255);
  var color = "rgb(" + r + "," + g + "," + b +")";

  signaturePad.penColor = color;
});

savePNGButton.addEventListener("click", function (event) {
  if (signaturePad.isEmpty()) {
    $.alert("먼저 서명을 해주십시요.");
  } else {
    var dataURL = signaturePad.toDataURL();
    download(dataURL, "signature.png");
  }
});

saveJPGButton.addEventListener("click", function (event) {
      if (signaturePad.isEmpty()) {
        $.alert("먼저 서명을 해주십시요.");
      } else {
        var dataURL = signaturePad.toDataURL("image/jpeg");
        download(dataURL, "signature.jpg");
      }
});
$(document).ready( function() {

    saveSIGNButton.addEventListener("click", function (event) {
          if (signaturePad.isEmpty()) {
            $.alert("먼저 서명을 해주십시요.");
          } else {
                //-- 이미지 병합용 canvas 초기화
                let cWidth  = $("#img_risk").width();
                let cHeight = $("#img_risk").height();
                $("#canvas_for_compose").width( cWidth  );
                $("#canvas_for_compose").height( cHeight );
                var composeCtx  = $("#canvas_for_compose")[0].getContext('2d');
                composeCtx.clearRect(0,0,cWidth,cHeight); 
                //-- 겹치기 모드설정
                composeCtx.globalCompositeOperation = "source-over"; 
                //-- 서식 이미지를  이미지 변합용 canvas 에 불러오기
                var formImage   = new Image();
                formImage.onload = function() {
                    composeCtx.globalAlpha = 1;
                    composeCtx.fillStyle = "rgb(255,255,255)";
                    composeCtx.fillRect(0,0,1000,1000);
                    composeCtx.drawImage(formImage, 0, 0);
                    var signImage   = new Image();
                    signImage.onload = function() {
                            composeCtx.fillStyle = "rgba(255,255,255,0)";
                            if ( EDITOR.selected_sign_no == "001_01") {
                                composeCtx.drawImage(signImage,800,1200,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "002_01") {
                                composeCtx.drawImage(signImage,350,450,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "002_02") {
                                composeCtx.drawImage(signImage,800,370,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "002_03") {
                                composeCtx.drawImage(signImage,800,430,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "003_01") {
                                composeCtx.drawImage(signImage,800,1100,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "005_01") {
                                composeCtx.drawImage(signImage,270,1030,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "005_02") {
                                composeCtx.drawImage(signImage,710,1230,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "006_01") {
                                composeCtx.drawImage(signImage,400,300,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "006_02") {
                                composeCtx.drawImage(signImage,830,1000,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "006_03") {
                                composeCtx.drawImage(signImage,830,1230,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "007_01") {
                                composeCtx.drawImage(signImage,550,1000,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "008_01") {
                                composeCtx.drawImage(signImage,300,400,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "008_02") {
                                composeCtx.drawImage(signImage,800,350,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "008_03") {
                                composeCtx.drawImage(signImage,800,410,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "009_01") {
                                composeCtx.drawImage(signImage,300,795,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "009_02") {
                                composeCtx.drawImage(signImage,400,910,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "009_03") {
                                composeCtx.drawImage(signImage,400,970,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "010_01") {
                                composeCtx.drawImage(signImage,400,450,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "011_01") {
                                composeCtx.drawImage(signImage,350,220,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "011_02") {
                                composeCtx.drawImage(signImage,390,950,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "012_01") {
                                composeCtx.drawImage(signImage,400,180,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "012_02") {
                                composeCtx.drawImage(signImage,800,950,150,150);
                            }
                            if ( EDITOR.selected_sign_no == "012_03") {
                                composeCtx.drawImage(signImage,800,1150,150,150);
                            }
                            var dataURL = $("#canvas_for_compose")[0].toDataURL();
                            $("#img_risk").attr("src", dataURL );
                        };


                signImage.src = signaturePad.toDataURL();
                hide_div_sign();
                }
            formImage.src   = $("#img_risk").attr("src");
            }
      });
});

saveSVGButton.addEventListener("click", function (event) {
  if (signaturePad.isEmpty()) {
    $.alert("먼저 서명을 해주십시요.");
  } else {
    var dataURL = signaturePad.toDataURL('image/svg+xml');
    download(dataURL, "signature.svg");
  }
});

function img_click( s_no ) {
    EDITOR.selected_sign_no = s_no;
    $("#btnSign").trigger('click');
    return false;
}

