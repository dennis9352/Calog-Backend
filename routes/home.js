import express from "express";
import Food from "../models/food.js";
import Favorite from "../models/favorite.js";
import MostUsed from "../models/mostUsed.js";
import { checkPermission } from "../middlewares/checkPermission.js";
import Recent from "../models/recent.js";
import { isAuth } from "../middlewares/auth.js";
import Recommend from "../models/recommend.js";
const router = express.Router();


//검색 API

router.get("/search/:keyword", checkPermission, async (req, res) => {
  try {
    const keyword = decodeURIComponent(req.params.keyword); //decodeURIComponent를 사용해야 params로 받는 keyword값을 한글로 받을 수 있음.
    const nameKey = String(keyword); //키워드 값을 String으로 감싸줘야 query에 변수로써 적용가능
    const { user } = res.locals; //로그인한 유저와  로그인 안한 유저 둘다 검색 가능, 로그인 되어있으면 user 선언
    const food = await Food.aggregate([  //aggregate를 통해 $search와 $project, $limit라는 세 가지 명령어르 실행할 수 있음, food는 list 형태
      {
        $search: {
          index: "haha", //haha라는 index에 lucene nori를 이용한 인덱싱을 해둠(아틀라스 페이지에서)
          text: {
            query: nameKey, //검색할 값을 nameKey(params로 받는 키워드)라는 변수로 설정
            path: "name", //검색할 필드를 입력
          },
        },
      },
      {
        $project: {
          name: 1, //보여줄 필드들에 1(true)를 부여함.
          kcal: 1,
          forOne: 1,
          measurement: 1,
          score: {
            $meta: "searchScore", //연관도 점수
          },
        },
      },
      {
        $limit: 1000, //1000개로 검색 출력 갯수를 제한하여 정확도와 속도를 일정 수준 보정
      },
    ]);

    if (!user) { //로그인 안했으면 일반적인 검색창, 즐겨찾기(isLike) 반영안됨.
      for (let i = 0; i < food.length; i++) {
        const foodId = food[i]["_id"];
        food[i].foodId = foodId;
      }

      if (food.length === 0) {
        res.sendStatus(204); //검색결과 없음.
        return;
      } else {
        res.json({ food }); //문제 없을 시 food 내려줌.
      }
    } else if (user) { //로그인했을때(즐겨찾기 있는 경우와 없는 경우로 나뉨)
      const userId = user._id;
      const favoriteFood = await Favorite.findOne({ userId: userId }); //로그인 했으면 Favorite db collection에서 userId에 속해있는 foodId(즐겨찾기목록) 가져옴.

      if (!favoriteFood) { //로그인한 유저가 즐겨찾기한 음식이 없을 경우
        for (let i = 0; i < food.length; i++) {
          const foodId = food[i]._id; //검색된 음식들에 foodId값을 붙여줌.
          food[i].foodId = foodId;
        }
        if (food.length === 0) {
          res.sendStatus(204); //검색결과 없음.
          return;
        } else {
          res.json({ food });
        }
      } else if (favoriteFood) { //로그인한 유저가 즐겨찾기 목록이 있을경우
        const favoriteList = favoriteFood.foodId; //[foodId1, foodId2...] 형식의 리스트 형태

        for (let i = 0; i < food.length; i++) {
          if (favoriteList.includes(food[i]["_id"])) { //즐겨찾기에 등록된 음식 목록에 검색한 음식이 포함되면 foodId와 isLike값을 붙여줌.
            const foodId = food[i]._id;
            food[i].foodId = foodId;
            food[i].isLike = true;
          } else {
            const foodId = food[i]._id;
            food[i].foodId = foodId;
          }
        }

        if (food.length === 0) {
          res.sendStatus(204); //검색결과 없음.
          return;
        } else {
          res.json({ food }); //문제 없을 시 foodList 값 내려줌.
        }
      }
    }

  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "검색중 에러발생",
    });
    return;
  }
});


//키워드별 조회수 기록 API

router.post("/search/mostUsed", async (req, res) => {
  try {
    const { keyword } = req.body;
    const existKeyword = await MostUsed.findOne({ keyword: keyword }); //MostUsed 컬렉션에 검색한 keyword가 있는지 확인

    if (!existKeyword) {
      //검색한 keyword가 존재하지 않으면
      const times = 1; //times에 1을 할당
      await MostUsed.create({ keyword: keyword, times: times }); //MostUsed에 keyword와 times(=1)을 필드로 create함
    } else {
      existKeyword.times++; //검색한 keyword가 이미 존재한다면 times의 숫자를 1만큼 증가시킴
      existKeyword.save();
    }
    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "키워드 조회수 기록중 에러발생",
    });
    return;
  }
});

//인기검색어 조회 API

router.get("/mostUsedKey", async (req, res) => {
  try {
    const mostUsedKey = await MostUsed.find({}).sort("-times").limit(10); //MostUsed에서 조회수를 내림차순으로 10개까지 mostUsedKey 변수에 할당

    res.json({
      mostUsedKey, //json 형태로 저장된 10개의 값을 보냄
    });
     
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "인기검색어 조회중 오류발생",
    });
    return;
  }
});


//검색결과 상세페이지(음식) API

router.get("/search/detail/:foodId", async (req, res) => {
  try {
    const { foodId } = req.params;
    const foodDetail = await Food.findOne({ _id: foodId }); //params로 foodId를 받아 Food db collection에서 아이디에 맞는 데이터를 조회

    res.json({
      foodDetail, //조회 해석 나온 데이터의 필드 전체를 보냄
    });

  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "상세보기 조회중 에러발생",
    });
    return;
  }
});


//최근 검색어 등록 API

router.post("/recentKey", isAuth, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user._id;
    const { keyword } = req.body;
    const recentKey = await Recent.findOne({ userId: userId });

    if (!recentKey) { //recentKey에 최근 검색 리스트가 없을때
      await Recent.create({ userId: userId, keyword: [keyword] });
    } else { //recentKey에 최근 검색 리스트가 있을때

      if (recentKey.keyword.length < 10) { //배열이 10개 미만일때
        if (recentKey.keyword.includes(keyword)) { //키워드가 이미 리스트에 존재할때
          recentKey.keyword.remove(keyword); //기존 것을 지우고 새로 검색된 것을 배열의 맨 마지막에 추가
          recentKey.keyword.push(keyword);
          recentKey.save();
        } else { //키워드가 리스트에 존재하지 않을때
          recentKey.keyword.push(keyword); //배열의 마지막에 키워드를 추가
          recentKey.save();
        }
      } else { //배열이 10개 이상일때
        if (recentKey.keyword.includes(keyword)) { //키워드가 이미 리스트에 존재할때
          recentKey.keyword.remove(keyword);
          const lastKey = recentKey.keyword[0]; //배열의 첫 값과 존재하는 키워드 값을 삭제하고 새로운 키워드를 배열의 마지막에 추가
          recentKey.keyword.remove(lastKey);
          recentKey.keyword.push(keyword);
          recentKey.save();
        } else { //키워드가 리스트에 존재하지 않을때
          const lastKey = recentKey.keyword[0]; //배열의 첫 값을 삭제하고 새로운 키워드를 배열의 마지막에 추가
          recentKey.keyword.remove(lastKey);
          recentKey.keyword.push(keyword);
          recentKey.save();
        }
      }
    }
    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "최근 검색어 등록중 에러발생",
    });
    return;
  }
});


//최근 검색어 조회 API

router.get("/recentkey", isAuth, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user._id;
    const recentKey = await Recent.findOne({ userId: userId }); //Recent 컬렉션에서 최근 검색한 값 유무를 확인

    if (!recentKey) {
      res.sendStatus(204);
      return;
    } else {
      const keywordList = recentKey.keyword.reverse(); //최근 검색어가 있다면 그 값을 역순으로 나열(최근순이 됨)
      res.send(keywordList);
    }

  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "최근 검색어 등록중 에러발생",
    });
    return;
  }
});


//최근 검색어 삭제 API

router.delete("/recentkey", isAuth, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user._id;
    const { keyword } = req.body;

    const recentKey = await Recent.findOne({ userId: userId });
    recentKey.keyword.remove(keyword);
    recentKey.save();
    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "최근 검색어 삭제중 에러발생",
    });
    return;
  }
});


//추천 검색어 API

router.get("/recommend", async (req, res) => {
  try {
    const recommendFood = await Recommend.aggregate([ //Recommend 컬렉션에서 랜덤한 값 10개를 가져옴
      {
        $sample: { size: 10 },
      },
    ]);
    res.json({ recommendFood });

  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "추천 검색어 조회중 에러발생",
    });
    return;
  }
});

//데이터 추가 API

router.post("/addData", async (req, res) => {
  try {
    let {
      name,
      forOne,
      kcal,
      measurement,
      protein,
      fat,
      carbo,
      sugars,
      natrium,
      cholesterol,
      fattyAcid,
      transFattyAcid,
      unFattyAcid,
    } = req.body;

    await Food.create({
      name: name,
      forOne: forOne,
      kcal: kcal,
      measurement: measurement,
      protein: protein,
      fat: fat,
      carbo: carbo,
      sugars: sugars,
      natrium: natrium,
      cholesterol: cholesterol,
      fattyAcid: fattyAcid,
      transFattyAcid: transFattyAcid,
      unFattyAcid: unFattyAcid,
    });

    res.sendStatus(200);
    
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "데이터 추가중 에러발생",
    });
    return;
  }
});

export default router;
