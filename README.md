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

### &#128187;기술스택/라이브러리
#### 라이브러리
bcrypt,express-validator,jsonwebtoken,passport,passport-google-oauth20,passport-kakao,passport-naver,validator,
eslint,prettier,eslint-config-prettier,eslint-plugin-prettier
#### 기술스택
mongodb atlas,netdata

### Backend Trouble Shooting
#### Link: [Google][googlelink]

[googlelink]: https://google.com "Go google"







