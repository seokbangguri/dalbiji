let gSBJ = {
    base_server: "",
    study_plans:  [],           //  서버에서 받은 회원의 모든 학습일정
    subject_list:  [],          // 교재명만
    subject_code_json:  {},     // 교재의 code 목록
    subject_plan_json:  {},     // 교재별 학습일정
    subject_code_list: [],

    isEmpty: function(str){
        if(typeof str == "undefined" || str == null || str == "" || str == "undefined" )
            return true;
        else
            return false ;
    },
    category_list: [
            {"id": "영문법","text": "영문법", "selected": true},
            {"id": "국어","text": "국어"},
            //{"id": 2,"text": "Option 2","selected": true},
            ////{"id": 3,"text": "Option 3","disabled": true}
        ],
    subject_list: [
            {"id": "기초영문법","text": "기초영문법", "selected": true},
            {"id": "중급영문법","text": "중급영문법"},
            {"id": "고급영문법","text": "고급영문법"},
    ],
    get_subject_list: function( category_name ){
        let result  = [];
        if ( category_name == "영문법") {
            result = [
                {"id": "기초영문법","text": "기초영문법", "selected": true},
                {"id": "중급영문법","text": "중급영문법"},
                {"id": "고급영문법","text": "고급영문법"},
            ]
        }
        if ( category_name == "국어") {
            result = [
                {"id": "기초국어","text": "기초국어", "selected": true},
                {"id": "중급국어","text": "중급국어"},
                {"id": "고급국어","text": "고급국어"},
            ]
        }
        return result
    },
    change_category_option: function(){
        $("#make_plan_category").html('').select2({data: [{id: '', text: ''}]});
        $("#make_plan_category").select2( {
                data: gSBJ.category_list,
                 width: '100%' 
        })
    },
    change_subject_option: function(){
        $("#make_plan_subject").html('').select2({data: [{id: '', text: ''}]});
        $("#make_plan_subject").select2( {
            data: gSBJ.subject_list,
             width: '100%' 
        })
    },
    prepare_data:function(){
        let frm_make_plan   = document.forms.frm_make_plan;
        let formData        = new FormData( frm_make_plan );
        let json_data       = Object.fromEntries(formData)
        return json_data;
    },
    check_form_data:function( json_data){
        return true;
    },
    showProgressBar: function(flag) {
        const imgSrc = "/static/html/assets/img/progressBar2.gif";
        let id = 'progressBar';
        let bgId = 'progressBarBg';
        
        if(flag == null) {
            if($('#'+id).length > 0) {
                flag = false;
            } else {
                flag = true;
            }
        }   
                
        if(flag) { 
            let elem = $('<div/>',{
                "id":id,
                "style":"width:220px;height:19px;"
            }).appendTo('body');
            let bgElem = $('<div/>',{"id":bgId}).appendTo('body');
            let top = (($(window).height()-elem.outerHeight())/2+$(window).scrollTop())+"px";
            let left = (($(window).width()-elem.outerWidth())/2+$(window).scrollLeft())+"px";
            
            elem.css({'z-index':1000,'position':'absolute','top':top, 'left':left, "background":"url("+imgSrc+") no-repeat 0 0"});
            bgElem.css({'width':'100%','height':'100%','position':'fixed','top':0,'left':0,'background':'#333','opacity':0.5,'z-index':999});
            
        } else {
            $('#'+id).remove();
            $('#'+bgId).remove();
        }   
    },   
}
$(window).on ('load', function (){
    
    gSBJ.change_category_option();
    gSBJ.change_subject_option();

});

