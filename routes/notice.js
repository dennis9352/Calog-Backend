import express from "express";
import Notice from "../models/notice.js";
import { isAuth } from "../middlewares/auth.js";
import dotenv from "dotenv";
import Feedback from "../models/feedback.js";
import Slack from "slack-node";
import moment from "moment";
import "moment-timezone";
import { checkPermission } from "../middlewares/checkPermission.js";
dotenv.config();
const router = express.Router();

// 슬랙 알림
const slack = new Slack();
slack.setWebhook(process.env.SLACKWEBHOOK);         //슬랙 웹훅 주소랑 연결
//일반 피드백
const send = async (feedbackInfo) => {
  slack.webhook(
    {
      text: `--------피드백알림--------\n닉네임: ${feedbackInfo.nickname}\n제목: ${feedbackInfo.title}\n내용: ${feedbackInfo.contents}\n전화번호: ${feedbackInfo.phoneNum}\n인스타그램: ${feedbackInfo.instagramId}\n날짜: ${feedbackInfo.date}\n사진: ${feedbackInfo.url}`,
      channel: "#feedbacks",
      username: "FeedbackBot",
      icon_emoji: "slack",
    },
    (error, response) => {
      if (error) {
        console.log(error);
        return;
      }
    }
  );
};
// 음식추가요청
const sendFood = async (feedbackInfo) => {
  slack.webhook(
    {
      text: `--------음식추가요청--------\n닉네임: ${feedbackInfo.nickname}\n제목: ${feedbackInfo.title}\n내용: ${feedbackInfo.contents}\n날짜: ${feedbackInfo.date}`,
      channel: "#foodfeedbacks",
      username: "FeedbackBot",
      icon_emoji: "slack",
    },
    (error, response) => {
      if (error) {
        console.log(error);
        return;
      }
    }
  );
};

// 공지사항 쓰기
router.post("/", isAuth, async (req, res) => {
  const { title, contents, date, password } = req.body;
  const user = res.locals.user;
  const adminID = process.env.ADMINID;      //관리자 아이디
  if (user.email !== adminID) {
    res.status(400).send({
      errorMessage: "관리자 권한이 없습니다.",
    });
    return;
  }
  const noticePassword = process.env.NOTICEPW;      //공지사항 비밀번호
  if (password !== noticePassword) {
    res.status(400).send({
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
    return;
  }
  try {
    await Notice.create({
      title: title,
      contents: contents,
      date: date,
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "공지사항 작성에 실패했습니다",
    });
  }
});

// 공지사항 목록
router.get("/", async (req, res) => {
  try {
    const notice = await Notice.find({});
    res.json({ notice });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "공지사항 불러오기에 실패했습니다",
    });
  }
});

router.get("/:noticeId", async (req, res) => {
  // 공지사항 디테일
  const { noticeId } = req.params;
  try {
    const notice = await Notice.findById(noticeId);
    res.json({ notice });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "공지사항 상세정보 불러오기에 실패했습니다",
    });
  }
});

// 공지사항 업데이트
router.put("/:noticeId", isAuth, async (req, res) => {
  const { noticeId } = req.params;
  const { title, contents, password } = req.body;
  const user = res.locals.user;
  const adminID = process.env.ADMINID;      //관리자 아이디
  if (user.email !== adminID) {
    res.status(400).send({
      errorMessage: "관리자 권한이 없습니다.",
    });
    return;
  }
  const noticePassword = process.env.NOTICEPW;       //공지사항 비밀번호
  if (password !== noticePassword) {
    res.status(400).send({
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
    return;
  }
  try {
    await Notice.findByIdAndUpdate(noticeId, {
      $set: {
        title: title,
        contents: contents,
      },
    }).exec();
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "공지사항 수정에 실패했습니다",
    });
  }
});

//공지사항 삭제
router.delete("/:noticeId", isAuth, async (req, res) => {

  const { noticeId } = req.params;
  const { password } = req.body;
  const user = res.locals.user;

  const adminID = process.env.ADMINID;      //관리자 아이디
  if (user.email !== adminID) {
    res.status(400).send({
      errorMessage: "관리자 권한이 없습니다.",
    });
    return;
  }
  const noticePassword = process.env.NOTICEPW;       //공지사항 비밀번호
  if (password !== noticePassword) {
    res.status(400).send({
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
    return;
  }
  try {
    await Notice.findByIdAndDelete(noticeId);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "공지사항 삭제에 실패했습니다",
    });
  }
});

//피드백 작성
router.post("/feedback", checkPermission, async (req, res) => {
  const newdate = moment();
  const todayDate = newdate.format("YYYY-MM-DD HH:mm:ss");

  let { title, contents, date, phoneNum, instagramId, url } = req.body;
  try {
    const feedback = await Feedback.create({
      title: title,
      contents: contents,
      date: date,
    });

    if (phoneNum !== undefined) {
      feedback.phoneNum = phoneNum;
    } else {
      phoneNum = "-";
    }

    if (instagramId !== undefined) {
      feedback.instagramId = instagramId;
    } else {
      instagramId = "-";
    }

    if (url !== undefined) {
      feedback.url = url;
    } else {
      url = "-";
    }

    const user = res.locals.user;
    let nickname = "";
    if (user) {
      feedback.userId = user._id;
      nickname = user.nickname;
    } else {
      nickname = "비로그인유저";
    }

    await feedback.save();

    const feedbackInfo = {
      nickname: nickname,
      title: title,
      contents: contents,
      phoneNum: phoneNum,
      instagramId: instagramId,
      date: todayDate,
      url: url,
    };
    await send(feedbackInfo);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "피드백 작성에 실패했습니다",
    });
  }
});

//음식추가요청
router.post("/feedbackFood", isAuth, async (req, res) => {
  const newdate = moment();
  const todayDate = newdate.format("YYYY-MM-DD HH:mm:ss");
  const userId = res.locals.user._id;
  const nickname = res.locals.user.nickname;
  const { contents, date } = req.body;
  const title = "음식추가요청";
  try {
    await Feedback.create({
      userId: userId,
      nickname: nickname,
      title: title,
      contents: contents,
      date: date,
    });

    const feedbackInfo = {
      nickname: nickname,
      title: title,
      contents: contents,
      date: todayDate,
    };
    await sendFood(feedbackInfo);

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "음식추가요청에 실패했습니다",
    });
  }
});

export default router;
