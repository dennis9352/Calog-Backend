# Calog-Backend
### &#128531; 오늘 내가 먹은 칼로리가 걱정 될때는??</br></br> &#128525; Calog가 그 걱정 해결 해드리겠습니다!!</br></br> Calog로 칼로리를
- &#127859; 찾아보고
- &#9997; 기록하고
- &#127857; 나만의 식단을 만들어 보세요!!!</br>![image](https://user-images.githubusercontent.com/67377255/131629880-2b6a6f88-8765-4d5a-b739-e21b6793580f.png)
### &#10067;기획의도</br>
건강과 운동, 웰빙에 대한 사람들의 관심은 점점 증가 하고 있습니다. 이에따라 음식을 구입하거나 먹을때 가격만큼이나 칼로리 수치를 수시로 확인하는 경향이 증가 한다는 점에 착안하여 서비스 제작을 하였습니다. 또한, 시중에 나와있는 기존 서비스보다 좀더 직관적이고 쉽고 빠르게 칼로리를 기록할 수있도록 포지셔닝을 했습니다.
### 	&#128518; Calog 이런 분들에게 유용 해요!!
- 웰빙과 식단에 관심있는 2040 대학생 및 직장인
- 칼로리를 고려하여 음식메뉴를 결정 하시고자 하는 분
- 본인이 섭취한 칼로리를 매일 기록하며 관리가 필요한 분
- 칼로리를 맞춰 식단을 구성 하시고자 하는 분

### &#10024; Calog 주요 기능 &#10024;

#### 1.일반 로그인 및 사용자 편의를 위한 소셜 로그인(구글, 네이버, 카카오) 기능</br>
JWT Token을 통해 로그인 인증 및 Passport Module을 통해 소셜로그인 구현
#### 2.약 6만여개의 음식 데이터(식약처 제공 데이터)를 3번의 데이터 가공을 통해 Data Base 구축
![image](https://user-images.githubusercontent.com/67377255/131659047-a9f111e4-a190-4eb1-8a18-fb3baafe299d.png)
#### 3. Mongo Atlas를 통하여 FTS(Full Text Search) 구현
Mongo Atlas에서 한글 FTS를 지원한는 lucene nori를 통해 Full text search 구현에 성공
#### 4.검색속도 개선
Mongo Atlas 서버의 지역이 미국 버지니아로 설정 되어있어 서버 지역을 싱가폴로 변경 및 $limit 기능을 이용하여 
1000개의 데이터까지만 출력되도록 제한을 걸어 검색 속도개선
#### 5.CI/CD 구현
![image](https://user-images.githubusercontent.com/67377255/131667579-312529be-b178-4482-9c01-a85a4d7ca5e1.png)
백엔드 깃과 travis를 연동해서 travis가 CI 부분을 맡고있고 CD는 S3에 빌드파일을 저장한뒤 codedeploy을 통해서 배포, 
배포방식은 도커를 이용하여 blue and green방식으로 무중단 배포 구현 
#### 6. 보안
CSRF 공격에 대한 보안 대책으로 Security Token 을 발급하여 검증하는 방식을 사용

## ⚙Node & npm Version
node: v14.17.1  
npm: 6.14.13  

### &#128187;기술스택/라이브러리
#### 기술스택
<table width = "200" style="text-align:center;" >
  <tr>
    <th height = "40"> 종류</th>
    <th height = "40">이름</th>

  </tr>
  <tr>
    <td>서버 프레임워크</td>
    <td>Express</td>
  </tr>
  <tr>
    <td >Database</td>
    <td>MongoDB, AtlasDB</td>
  </tr>
  <tr>
    <td >서버 모니터링</td>
    <td>netData</td>
  </tr>
  <tr>
    <td >에러 모니터링</td>
    <td>sentry</td>
  </tr>
  <tr>
    <td >CI</td>
    <td>travis CI</td>
  </tr>
  <tr>
    <td >CD</td>
    <td>CodeDeploy</td>
  </tr>
  <tr>
    <td >빌드파일 저장소</td>
    <td>S3</td>
  </tr>
  <tr>
    <td >Application 구축 software</td>
    <td>Docker</td>
  </tr>
  <tr>
    <td >로드밸런스</td>
    <td>nginx</td>
  </tr>

<table width = "200" style="text-align:center;" >
  <tr>
    <th height = "40">라이브러리</th>
    <th height = "40">Appliance</th>

  </tr>
  <tr>
    <td >dotenv</td>
    <td>포트값외 중요한값 보안처리</td>
  </tr>
  <tr>
    <td >Mongoose</td>
    <td>MongoDB 데이터 모델링</td>
  </tr>
  <tr>
    <td >Cors</td>
    <td>Request Resource 제한</td>
  </tr>
   <tr>
    <td>passport,passport-google-oauth20,passport-kakao,passport-naver</td>
    <td> 소셜 로그인 </td>
  </tr>
   <tr>
    <td>bcrypt</td>
    <td> 암호화 </td>
  </tr>
  <tr>
    <td >jsonwebtoken</td>
    <td> 암호화 </td>
  </tr>
   <tr>
    <td> eslint </td>
    <td> 클린코드 </td>
  </tr>
   <tr>
    <td>prettier</td>
    <td> 클린코드 </td>
  </tr>
   <tr>
    <td>eslint-config-prettier,eslint-plugin-prettier
</td>
    <td> eslint, prettier 충돌방지 </td>
  </tr>
  <tr>
    <td>validator,express-validator
</td>
    <td> 유효성 검사 </td>
  </tr>
</table>


### &#127919; Backend Trouble Shooting


                                                           
<details>
<summary>칼로리 통계를 보여줄때 몸무게에 따른 기초대사량을 베이스로 보여주는데 예를 들어 오늘 몸무게를 수정하고 어제 먹었던 음식을 기록해야한다면 현재 몸무게가 아닌 어제의 몸무게가 들어가야하는데 어떻게 어제의 몸무게를 알수있을까?</summary>
<div markdown="1">       

  </br>몸무게를 수정할때마다 수정한 날짜와 몸무게를 같이 저장을 하자.


</div>
</details>

<details>
<summary> mongoDB 한글인식 문제</summary>
<div markdown="1">       
  </br>
    음식 name 필드에 "text"인덱싱을 해준후 $text $search로 검색을하면 더 빠르지만 검색범위가 너무 좁아진다. 
  이유는 몽고DB default_language가 영어라서 범위를 커버를 못한다. 그래서 default_language: ngram을 해줘야하는데 
  ngram은 full text search 보다 검색속도가 느리다. 

  ![image](https://user-images.githubusercontent.com/67377255/131694733-38223f08-471a-49fa-8288-52216c9b3331.png)

</div>
</details>   

<details>
<summary>검색 기능의 속도와 정확성 개선 과정</summary>
<div markdown="1">       
  </br>우선 처음에 검색기능을 구현하는데 있어 정규식과 levenshtein 라이브러리를 사용했습니다. 하지만 속도적인 부분과 연관도 부분에 있어 
  아쉬운 부분을 찾을 수 있었고 몽고DB의 인덱싱을 이용하게 됐습니다.

   ![image](https://user-images.githubusercontent.com/67377255/131695235-c3a8b20c-a9b2-4cd7-9b51-10e871ee320e.png)

    (levenshtein과 정규식 이용했을 때의 속도)

createIndex를 통해 음식 name 필드에 인덱스를 만들고 $search와 $meta score 등을 이용해서 검색을 했습니다.  정규식과 levenshtein에서 아쉬웠던 
  속도적인 부분은 월등히 상승했지만, 아쉽게도 한글 풀 텍스트 서치를 지원하지 않아,
  이번엔 정확성이 걸림돌이 되었습니다. (국 검색시 많은 데이터들이 안나오고 ‘몽고 간장 국’ 하나만 출력됨) Default languae 값을 변경하려고 했지만, 
  한국어를 지원하지 않아서 한글 풀 텍스트 서치를 지원하는 툴을 찾게됐습니다.

![image](https://user-images.githubusercontent.com/67377255/131718748-61aaadb8-e2ef-482b-a63e-b8ea6851a2f9.png)

    
  (createIndex와 $search를 이용했을 때의 속도)

    그 결과 엘라스틱 서치를 알게됐고 lucene nori를 통해 한글 풀 텍스트 서치를 지원한다는 것을 알게됐습니다. 
  속도에 있어서도 엘라스틱 서치가 월등한 성능을 보인다는 것도 알게됐습니다. 유튜브와 구글링, 인프런 등 온갖 수단을 동원하여 
  엘라스틱 서치와 키바나를 설치하려 했지만, 번번히 실패했습니다. 제가 주로 겪었던 오류는 엘라스틱 서치를 실행하면 키바나를 
  실행할 수 없게되는데,
  ‘kibana server is not ready yet’ 이라는 오류가 떴고 이에 구글링을 통해 키바나와 엘라스틱 서치의 
  버전을 같게해봤지만 문제가 여전히 발생했습니다.
  또 ‘job for elasticsearch.service failed because a fatal signal was delivered to the control process’ 오류가 
  발생하여 구글링을 해보니 
  log를 찍어보래서 status를 통해 확인해보니 ‘elasticsearch.service: failed with result 'timeout’.’ 오류를 발견했습니다. 
  이에 구글링을 통해 timeoutSec을 늘려봤지만, 여전히 아무런 효과도 보지 못했습니다. 5일 정도의 시간을 들였지만, 
  아무런 진전이 없었고 ec2 서버와의
  연결까지 계속 끊어지자 튜터님께 문의를 드리게 됐습니다. 문의 결과 ec2의 사양이 부족한 것이 문제였습니다. 팀원들과 
  의논해본 결과 이미 너무 많은 
  시간을 엘라스틱 서치의 설치에 사용했고 EC2를 업그레이드 하기 위한 월 54000원의 비용도 현실적으로 불가능하다고 판단하여
  다른 방법을 찾아보기로 했습니다.

    그렇게 마지막으로 몽고DB 아틀라스를 도전해보기로 했습니다. 엘리스틱 서치와 마찬가지로 lucene 기반으로
  nori를 사용할 수 있어 한글 풀 텍스트 
  서치 문제를 해결할 수 있었습니다. search Index에 언어 분석기로 노리를 사용했고 aggregate를 통해 인덱싱에도 성공하였습니다.
  다만 문제가 있다면 
  보다 속도가 3배 이상 느리다는 것이었습니다. 또 오타 자동 수정 등의 기능들도 완벽하게 구현되지 않아 정확성도 
  약간은 떨어지는 모습을 보였습니다.

   ![image](https://user-images.githubusercontent.com/67377255/131695492-a81b938e-a30f-462d-97fb-16a2f6ce6e0a.png)

    (몽고DB 아틀라스를 이용했을 때의 검색 속도)

    우선 속도적인 부분을 해결하기 위해 몇가지 가능성을 생각해봤습니다.

    *1. DB가 클라우드에 있어 느린가?*

    *2. Nori 형태소 분석기를 사용해서 느린가?*

    우선 아틀라스에서 영어로 테스트를 해봤지만 , 한글로 했을때와 비슷한 속도를 얻을 수 있었고 
  저희는 1번에 초점을 더 맞추게 되었습니다. 
  결과적으로 클라우드이기 때문에 로컬보다는 당연히 느릴 수 밖에 없다는 결론이 나왔고 저희는 최후의 수단으로 
  아틀라스의 지역을 기존 버지니아에서 
  싱가폴로 변경했습니다. 당연한 결과였지만, 속도가 상승했습니다. 또 이와 관련되어 현재는 food 컬렉션만 아틀라스에서 
  테스트하고 있는데 다른 컬렉션들을 
  아틀라스로 옮길 것인지 지금처럼 food 컬렉션만 아틀라스에서 사용하고 나머지를 분리해서 사용할 것인지에 대해서 고민을 하게 됐습니다. 
  하지만 아틀라스에서는 전체적인 DB 작업들의 속도가 느리다는 테스트 결과를 얻었기 때문에 두 개의 DB를 사용하잔는 결론에 달했습니다.

   ![image](https://user-images.githubusercontent.com/67377255/131695564-2a5ed53c-3284-494b-9863-03668951298f.png)

  ![image](https://user-images.githubusercontent.com/67377255/131695601-6bbcc6d3-c6ea-47b1-aabd-2b273ac050a2.png)
    (버지니아와 싱가포르의 검색 속도 비교)

    두번째로 정확성 부분은 아직 해결하는 중이지만, 오타 자동 수정 기능이 한글을 완벽히 지원하지 않는 것 같다는 사실을 파악했습니다.
  어떻게 필터를 주느냐에 따라서 어떤 키워드는 정확성이 올라가지만, 다른 키워드의 정확성은 오히려 떨어지는 경우도 있었기 때문입니다.
  또 기존에 사용하던 정규식과 인덱싱을 동시에 사용할 경우 ‘꿩’과 같은 한글자 키워드를 입력할때 오류가 발생한다는 사실을 발견했고  
  정규식을 지우는 방식을 선택했습니다.

    향후 추가적으로 해결할 문제는 여전히 정확도와 속도에 관한 것입니다. 
  더 효율적으로 인덱싱을 하여 속도를 높이고 아직 검색 결과에 있어서 연관도가 너무 떨어지는 결과들까지 출력되는데 이를 
  수정하는것에 초점을 맞출 계획입니다.

                                                                 **—중간발표후—**

    추가적인 속도를 향상을 위해서 두가지 도전을 더해봤습니다.  Region을 싱가폴로 옮긴것만으로도 
  2배의 속도향상이 있었는데 만약에 서울로 옮길 수 있다면 얼마나 더 속도가 올라 갈까라는 생각을 하게 됐습니다. 
  우선 아틀라스에서 지역을 서울로하여 클러스터를 만들 수 있는 방안이 있어 이를 시도했지만, 
  아쉽게도 저희가 사용하고 있는 M0 프리티어에서는 서울을 선택할 수 없었습니다. 
  그래서 차선책으로 다른 VPC간의 연결을 할 수 있게 해주는 Peering을 통해 아틀라스와 저희 서버 EC2를 연결하려 했지만, 
  Peering 기능도 프리티어에서는 사용할 수 없었습니다. 이 둘 기능을 사용하기 위해서는 
  최소한 월 72000원 정도의 금액을 지불해야했고 엘라스틱 서치를 사용하지 않은 이유와 마찬가지로 이는 포기할 수 밖에 없었습니다.

    위의 문제들에 더해 다른 문제가 생겼는데, 몇몇 키워드들, 특히 밥, 치킨, 피자 처럼 비교적 포괄적인 키워드들은 검색결과가 
  몇 천개씩 출력되어 검색속도가 너무 느리다는 것이었습니다. 그래서 이를 해결하기위해 $limit를 통해 1000개의 데이터만 출력되도록 
  설정했고 속도가 확연히 올라가는 것을 볼 수 있었습니다. 이렇게 과감하게 
  $limit로 1000개의 데이터만 출력되도록 한 근거는 저희 검색은 연관도 순으로 출력이 되기 때문에 1000개 이상의 데이터들은 검색한 
  키워드와 연관도가 많이 떨어지기 때문입니다.

   ![image](https://user-images.githubusercontent.com/67377255/131695674-bd08b4e1-49e3-48dd-8a6d-925adfeba320.png)
   ![image](https://user-images.githubusercontent.com/67377255/131695724-8a0abaf2-f7f3-4a53-a3eb-738356cf24ac.png)
    ($limit: 1000 설정 유무에 따른 속도 비교)

     

    다음으로 정확도 개선을 위해서 세 가지 방안을 구상했습니다. 첫번째로 정규식을 사용하는 방식입니다. 
  하지만 정규식을 사용할 경우 lucene을 nori가 아닌 keyword로 사용해야하기 때문에 시작부터 문제가 있을것이라는 생각이 들었습니다
  . 아니나 다를까 아래의 사진을 보면 lucene nori를 사용했을 보다 검색 결과의 정확도가 매우 떨어지는 것을 확인할 수 있습니다.

  ![image](https://user-images.githubusercontent.com/67377255/131695837-ed673498-c354-49b3-ad4a-48a94984c3f8.png)
![image](https://user-images.githubusercontent.com/67377255/131695885-216b190f-55b6-4d6c-a876-e4c4960053b7.png)
    ($regex를 사용 유무에 따른 정확도 비교)

    두번째로 fuzzy를 사용하여 오타를 수정함으로써 검색 정확도를 올리는 방법을 생각해봤습니다. 
  maxEdits 기능은 1개 혹은 2개를 옵션으로 선택하여 그 개수만큼 오타의 편집을 허용하는 것을 결정합니다. 
  prefixLength 기능은 출력 값의 시작 부분에서부터 정확히 일치해야하는 글자 수를 정하는 것입니다. 
  저는 이 부분을 다양하게 설정하며 여러 시도를 해봤지만,
  Lucene nori에서는 이 기능이 적용되지 않는 것 같다는 결론에 달했습니다.

  ![image](https://user-images.githubusercontent.com/67377255/131695929-c6ad90d5-e330-4249-8658-b86c9cd41d75.png)
    (fuzzy를 사용했지만, 적용이 잘 안된 듯한 결과물)

    그래서 마지막으로 저희가 겪고 있는 문제를 근본적으로 생각해봤습니다. 검색 정확도가 떨어진다고 
  판단한 이유는 가장 general한 값을 검색했을 때, 그 값이 나오지 않는다는 것이었습니다. 예를 들면  
  오이를 검색하면 ‘오이김치’, 치킨을 검색하면 
  ‘하이치킨’과 같은 값들이 가장 위에 출력되면서, 검색 키워드와 정확히 일치하는 값이 나오지 않았습니다. 
  이에 저는 데이터 베이스에 이렇게 누락된 값들을 
  추가하는 방법을 생각했습니다. 또 검색 가이드를 작성하여 검색할때 어떻게 원하는 값에 가까운 결과물을 
  얻을 수 있는지도 추가하는 방법도 생각해봤습니다. 
  그리고 향후 유저가 유입되면 검색어 사전 DB를 개설하여 사용자들이 원하는 데이터도 추가하고 오타들을 
  저장하여 사용자가 오타를 입력해도 
  정확한 검색 결과가 나오도록 할 계획입니다.


</div>
</details>


    
<details>
<summary>두개의 DB를 다중 연결할 수 있을까</summary>
<div markdown="1">       

  </br>아틀라스를 사용하며 걱정했던 점이 아틀라스의 속도가 일반 mongo db보다 느리다는 것인데, 
  그렇다면 음식 컬렉션만 아틀라스를 이용하고 나머지 컬렉션들은 기존의 mongo db를 이용할 수 있는지 알아봤다. 

    아래의 방법을 사용하여 쉽게 두개의 DB를 다중연결하여 사용할 수 있었다.

   ![image](https://user-images.githubusercontent.com/67377255/131699310-403ff8ac-198e-4ab3-9575-1f0c7aff4963.png)
   ![image](https://user-images.githubusercontent.com/67377255/131699362-19bad827-985c-43f2-a1fa-59f72ceb2193.png)
![image](https://user-images.githubusercontent.com/67377255/131699426-e6a1d23c-b222-484f-aad0-ea20c26bde37.png)
    위와같은 형태로 models/index.js를 두개로 나눠서 
    'export const 변수명 = mongoose.createConnection(mongodb 주소)를 사용하여 다른 models에서 필요한 DB에 맞게 변수를 
  import하여사용하면 두개의 다른 DB를 사용할 수 있다.

</div>
</details>


    

<details>
<summary>트래픽 처리 & 과부하 테스트</summary>
<div markdown="1">       

    서비스는 지속적으로 제공해주어야 하는데 서버가 뻗어 버리거나 예기치못한 오류로 인해서 서버가 다운되면?
  
  개발자는 현재 비즈니스 상황에 따라 적절한 엔지니어링 수준을 결정하는 능력이 되게 중요하다고 생각한다. 하지만 우리는 쥬니어개발자인 점과 동시에 런칭전의서비스는 그 수준을 결정하기가 힘들다. 그 중 트래픽은 더욱 예상을 할수가없기때문에 만약 사용자가 폭팔적으로증가했을 때 기술적 준비가 안 되어 있다면 개발자와 서비스 모두 큰 타격을 받는다고 생각해서 추후 좀 더 안정적인 서버를 위해 도커스웜을 기술적 도전으로 시도를 해봤다. 하나의 인스턴스를 매니저 노드로 그리고 다른 하나의 인스턴스에 2개의 매니저 노드로 총 3개의 replicas를 구성을 했다. 보통 현업에선 도커 오케스트레이션으로 쿠버네티스를 많이 쓰지만 러닝커브가 크고 몇개 안되는 컨테이너를 관리하기에는 도커 스웜이더 적절한거같아 도커스웜을 생각했다.

    오토 리스타트 or 셀프힐링
  
  docker 컨테이너를 띄울때 restart옵션
  "—restart on-failure[:maxretries]" 를 적용하여 exit 0(정상적인 종료)이 아닐경우 
  알아서 다시 리스타트 할수있도록 설정해놓고
  sentry로 에러가 났을시 에러로그를 수집하고 slack으로 알려줄수 있게 설정해서 프로젝트를 개선하는 방향.

    오토 스케일링

    
  쿠버네티스는 오토스케일링 옵션을 지원하나 도커 스웜은 안하므로 미리 스케일 아웃을 진행해야한다. 
  그래서 레플리카 셋업으로 매니저 노드와 워커 노드를 나눠서 레플리카로 서버를 나누어서 띄워서 트래픽을 분산시키면 
  되지만 현재 유저 확보가 되지 않은 상황에선 미리 스케일 아웃은 오버엔지니어링이라 생각해서 일단 하나의 서버로 돌리고 
  셀프 힐링 옵션만 주기로 결정.

 ![image](https://user-images.githubusercontent.com/85466642/131840068-fe5f8da7-9f8d-43e8-9d9c-1b02f7bcfc7c.png)

![image](https://user-images.githubusercontent.com/85466642/131840100-08f71335-6a65-4ef3-862c-be01ce264e70.png)

    
  loader.io를 통한 간단한 로드 테스트 결과, 15초 기준 서비스 이용자 2400명부터 에러와 과부하가 시작됐던게인스턴스 한개에 매니저노드 2대를 더 연결하고 도커스웜을적용한 서버에는 리밋이 3300명까지 늘었다.



</div>
</details>


   
<details>
<summary>DB 데이터가 중복될 경우 인덱싱이 잘될까?
</summary>
<div markdown="1">       

  </br>여러 브랜드에서 같은 이름의 상품을 출시할 경우 name 필드에 브랜드명을 붙일 것인지, 
  brand 필드를 새로 만들어서 브랜드명을 넣어줄 것인지에 대해서 백엔드와 프론트엔드 간에 의견이 갈리게 됐다.
  우리 백엔드의 입장은 brand 필드를 만들어서 브랜드명을 따로 분리할 경우 name 필드가 중복될 여지가 있고 
  그렇게 될 경우 인덱싱이 잘 될지에 대한 우려였고 프론트엔드의 입장은 name 필드에 브랜드명을 붙일 경우 그 길이가 너무 길어져서
  시각적으로 보기 좋지 않다는 것이었다. 그래서 나는 중복데이터에 대한 인덱싱이 잘 되는가에 대해서 찾아봤다. 
  결과는 인덱싱이 되긴 하지만, 중복된 값이 있을때 인덱싱을 하는 것은 효율이 떨어지는 행위라는 글을 찾게 됐다. 
  그 예시로 남여로 인덱싱을 할 경우 너무 많은 중복이 있기 때문에, 인덱싱을 하나 안하나 비슷한 결과물이 나온다는 것을 볼 수 있었다.
  이에 나는 우리 데이터는 남여로 인덱싱을 하는 것처럼 극단적으로 많은 중복은 없을 것으로 판단하고 대략 200개 
  정도의 중복 데이터를 만들어 검색 속도의 차이를 확인해봤다. 

   ![image](https://user-images.githubusercontent.com/67377255/131714980-aeb3eb5e-3c5a-41f5-a4c4-25496d8a9367.png)

   ![image](https://user-images.githubusercontent.com/67377255/131715000-cbf2b42c-6b47-45e6-8e37-3b2f9d1b5020.png)

    (꿩불고기를 200개 만들어 중복된 데이터가 있을때의 속도와 중복된 데이터가 없을때의 속도 비교)

    테스트 결과 속도에는 큰 차이가 없었고 우리는 brand 필드를 새로 만들어서 name 필드에 중복을 허용하기로 했다. 
  그렇게 name과 brand에 같이 인덱싱을 주었는데 여기서 문제가 생겼다. 
  name, brand 어느 것에 우선 순위를 두더라도 검색 정확도가 현저히 떨어졌다. 
![image](https://user-images.githubusercontent.com/67377255/131715028-cd5801e6-1113-4a1b-b189-d7c5d3825f4f.png)
    (이름에 우선순위를 두고 피자를 검색했지만, 피자라는 general한 값보다 brand와 name 필드에 
  모두 피자가 포함된 값들이 가장 높은 우선순위로 출력됨)

    위와같은 문제점 때문에 name 필드에 브랜드 이름을 붙여주는 작업을 데이터 2차 가공때 진행하기로 했다.

</div>
</details>

### &#128526; About Us

### BackEnd
<img src = "https://user-images.githubusercontent.com/67377255/131719830-818e584e-a00e-4ff0-86cc-f77de8f7e853.png" width="20%" height="height 20%">이경원
<img src = "https://user-images.githubusercontent.com/67377255/131720046-280b9260-b101-432b-aca5-d7285348e81a.png" width="20%" height="20%">오인웅
<img src = "https://user-images.githubusercontent.com/67377255/131720564-2b8d4867-e77d-40a5-89c6-a8798041e26f.png" width="20%" height="20%">박진홍

### FrontEnd
<img src = "https://user-images.githubusercontent.com/67377255/131720858-c30559f5-03bb-4ff8-9fac-446b2850d144.png" width="20%" height="20%">김나영
<img src = "https://user-images.githubusercontent.com/67377255/131720943-94c4ad6b-a0c4-46d1-befd-48c29fd99642.png" width="20%" height="20%">최지혁
<img src = "https://user-images.githubusercontent.com/67377255/131720997-e9c83da8-fbd1-4b13-96e9-ad332d1e888f.png" width="20%" height="20%">박용태

### Designer(UI/UX)
<img src = "https://user-images.githubusercontent.com/67377255/131724823-64bc315f-1860-4fb6-b384-ebbf8543f4a7.png" width="20%" height="20%">김민경
<img src = "https://user-images.githubusercontent.com/67377255/131724365-0c5846cd-6a69-4f8c-80ae-128b4a1e3ea6.png" width="20%" height="20%">이경미


