(function(){

    var agent = {
        full: navigator.userAgent.toLowerCase()
        , browser: null // edge, ie, chrome, firefox, opera, safari
        , version: null

        /**
         * agnet 문자열을 파싱하여 브라우저를 추측한다.
         * agent에 담겨있는 정보로 완벽한
         */
        , parse: function(){
            var edge = /(edge)\/([0-9.]+)/ig;// ie 에지
            var msie = /(msie)\s+([0-9.]+)/ig;
            var trident = /(trident)\/([0-9.]+)/ig; // ie 레이아웃 엔진
            var chrome = /(chrome)\/([0-9.]+)/ig;
            var firefox = /(firefox)\/([0-9.]+)/ig;
            var opera = /(opera)\/([0-9.]+)/ig;
            var safari = /(safari)\/([0-9.]+)/ig;

            var result=null;
            //this.full=' Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; Tablet PC 2.0)'; //테스트 코드
            if(result=edge.exec(this.full)) { //ie 에지
                this.browser = 'edge';
                this.version = result[2];
            }else if(result=msie.exec(this.full)){// ie
                this.browser='ie';
                this.version = result[2];
            }else if(result=trident.exec(this.full)) {// trident 레이아웃 엔진으로 추측
                this.browser = 'ie';
                if (result[2].indexOf('4') == 0) {
                    this.version = '8.0';
                } else if (result[2].indexOf('5') == 0) {
                    this.version = '9.0';
                } else if (result[2].indexOf('6') == 0) {
                    this.version = '10.0';
                } else if (result[2].indexOf('7') == 0) {
                    this.version = '11.0';
                }//end if
            }else if(result=chrome.exec(this.full)){
                this.browser='chrome';
                this.version=result[2];
            }else if(result=firefox.exec(this.full)){
                this.browser='firefox';
                this.version=result[2];
            }else if(result=opera.exec(this.full)){
                this.browser='opera';
                this.version=result[2];
            }else if(result=safari.exec(this.full)){
                this.browser='safari';
                this.version=result[2];
            }//end if
        }//end method

        , is_chrome: function(){//브라우저가 크롬인지
            return this.browser=='chrome';
        }//end method
        , is_ie: function(){//브라우저가 크롬인지
            return this.browser=='ie';
        }//end method

        /**
         * 버전을 비교한다
         * 비교구문으로 넘겨준 자리수까지만 비교한다.
         * 실제 버전이 56.0.2924.87 이어도.. 비교구문을 56.1 까지만 작성해주면 2번째 버전자리 까지만 비교를 실행해서 결과를 반환한다.
         * .
         * ex) diff_ver('> 5.0')
         *      버전 : 4.9  / 결과 : false
         *      버전 : 5.0  / 결과 : true
         *      버전 : 5  / 결과 : true
         *      버전 : 5.0.2  / 결과 : true
         *
         * 인자
         *      compare_str : 비교구문
         *          - 부등호+버전 으로 구성된다.
         *          - 부등호 없이 버전만 넘겨주게되면 == 비교한다.
         *          ex ) '>5.0' : 5.0 초과
         *          ex ) '>=5.0' : 5.0 이상
         *          ex ) '==5.0' : 정확히 5.0 인 경우만
         *          ex ) '<5.0' : 5.0 미만
         *          ex ) '<=5.0' : 5.0 이하
         *          ex ) '!=5.0' : 5.0 가 아님
         *          ex ) '<>5.0' : 5.0 가 아님
         *          ex ) '5.0' : 정확히 5.0 인 경우만
         *
         * 반환
         *      true / false
         */
        , version_compare: function(compare_str){
            var regexp_sign=/^\s*(>=|<=|>|<|==|<>|!=)?\s*([0-9a-z.]+)\s*$/ig; //부등호 분리
            var regexp_num=/([0-9a-z]+)/ig; // 점으로 연결된 숫자분리

            //비교방법
            var compare={
                varcase: function(a, b){//변수형변환처리
                    var regexp=/^[0-9]+$/i;
                    if ( regexp.test(a) && regexp.test(b) ){ //두 변수 모두
                        a=parseInt(a);
                        b=parseInt(b);
                    }//end if
                    return {
                        a: a
                        ,b: b
                    };
                }//end method
                ,lt: function(a, b){
                    var obj = this.varcase(a, b);
                    return obj.a < obj.b;
                }//end method
                ,le: function(a, b){
                    var obj = this.varcase(a, b);
                    return obj.a <= obj.b;
                }//end method
                ,eq: function(a, b){
                    var obj = this.varcase(a, b);
                    return obj.a == obj.b;
                }//end method
                ,ne: function(a, b){
                    var obj = this.varcase(a, b);
                    return obj.a != obj.b;
                }//end method
                ,ge: function(a, b){
                    var obj = this.varcase(a, b);
                    return obj.a >= obj.b;
                }//end method
                ,gt: function(a, b){
                    var obj = this.varcase(a, b);
                    return obj.a > obj.b;
                }//end method
            }//end compare
            //비교방법 끝

            //부등호 분리
            var result=regexp_sign.exec(compare_str);
            if(! result) return false; //비교구문 형식에 맞지않는 경우

            var sign=result[1]?result[1]:'==';//부호없을경우 == 처리
            var version=result[2];//부호없을경우 == 처리

            //console.log(this.version+' '+sign+' '+version);
            
            if(sign=='<') {
                sign = 'lt';
            }else if(sign=='<='){
                sign='le';
            }else if(sign=='=='){
                sign='eq';
            }else if(sign=='!=' || sign=='<>'){
                sign='ne';
            }else if(sign=='>='){
                sign='ge';
            }else if(sign=='>'){
                sign='gt';
            }//end if
            //부등호 분리 끝

            //console.log(sign);
            //console.log(version);

            //점으로 연결된 숫자분리
            var compare_nums =version.match(regexp_num);
            var orig_nums = this.version.match(regexp_num);
            if(! compare_nums || ! orig_nums) return false; //원본이나 비교구문에 버전정보가 없는경우


            if(compare_nums.length > orig_nums.length){//원본 0으로 채우기
                for(var i=orig_nums.length; i<compare_nums.length; i++){
                    orig_nums[i]='0';
                }//end for i
            }//end if
            //점으로 연결된 숫자분리 끝

            //비교
            for(var i=0; i< compare_nums.length; i++ ){
                //console.log(orig_nums[i]);
                //console.log(compare_nums[i]);

                if( i != compare_nums.length - 1 //마지막이 아니고
                    && compare['eq'](orig_nums[i], compare_nums[i]) //같은값이면
                ){
                    continue;
                }//end if

                return compare[sign](orig_nums[i], compare_nums[i]);


            }//end for i
            //비교 끝

            return false;
        }//end method
    }//end agent

    agent.parse();

    //브라우저적합도 결정
    var grade=null; // ok : 적합함 , deny : 사용불가, warning : 경고
    if( agent.browser=='chrome') {
        grade='ok';
    }else if( agent.browser=='ie'){
        if(agent.version_compare('<=8')) {// 8이하
            grade='deny';
        }else if(agent.version_compare('==11')) {// 11
            grade='ok';
        }else{
            grade='warning';
        }//end if
    }else{ //기타
        grade='warning';
    }//end if
    ////브라우저적합도 결정 끝

    //등급에따른 안내표시
    alert(grade);
    //등급에따른 안내표시 끝

    //console.log(agent.is_chrome());
    //console.log(agent.is_ie());
    //console.log(agent.version_compare(' <= 56 '));
    // console.log(agent.version_compare(' > 55.0 '));
    // console.log(agent.version_compare(' > 56.0 '));
    // console.log(agent.version_compare(' > 56.0.1 '));
    // console.log(agent.version_compare(' > 56.0.2 '));
    // console.log(agent.version_compare(' > 56.0.3 '));
    // console.log(agent.version_compare(' > 56.1 '));
    /*
    console.log(agent.version_compare('>5.0'));
    console.log(agent.version_compare(' > 5.0.454.a10'));
    console.log(agent.version_compare(' == 5.0'));
    console.log(agent.version_compare(' < 5.0 '));

    console.log(agent.version_compare('  '));
    console.log(agent.version_compare(' . '));
*/



})();//end anomy func