import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/users.js";
import { isAuth } from "../middlewares/auth.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validator.js";
import dotenv from "dotenv";
// import { DataExchange } from "aws-sdk";
dotenv.config();

const router = express.Router();

// TODO: Make it secure!
const jwtSecretKey = process.env.JWT_SECRET;
const jwtExpiresInDays = "2d";
const bcryptSaltRounds = 12;

const validateRegister = [
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("password should be at least 5 characters"),
  body("nickname").notEmpty().withMessage("nickname is missing"),
  validate,
];

const validatedupnickname = [
  body("nickname").notEmpty().withMessage("nickname is missing"),
  validate,
];

const validatedupemail = [
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  validate,
];

//이메일 중복체크
router.post("/duplicate-email", validatedupemail, async (req, res) => {
  const { email } = await req.body;
  const found_email = await User.findOne({ email: email });

  if (found_email) {
    return res.status(409).json({ message: `${email} already exists` });
  }

  res.status(201).json({ result: "success" });
});
//닉네임 중복체크
router.post("/duplicate-nickname", validatedupnickname, async (req, res) => {
  const { nickname } = await req.body;

  const found_nickname = await User.findOne({ nickname: nickname });

  if (found_nickname) {
    return res.status(409).json({ message: `${nickname} already exists` });
  }

  res.status(201).json({ result: "success" });
});

//회원가입
router.post("/register", validateRegister, async (req, res) => {
  try {
    const { email, password, nickname } = await req.body;

    const found_email = await User.findOne({ email: email });
    const found_nickname = await User.findOne({ nickname: nickname });
    if (found_email) {
      return res.status(409).json({ message: `${email} already exists` });
    }
    if (found_nickname) {
      return res.status(409).json({ message: `${nickname} already exists` });
    }
    const hashed = await bcrypt.hash(password, bcryptSaltRounds);
    const userInfo = {
      email,
      password: hashed,
      nickname,
    };
    await User.create(userInfo, function (err, user) {
      if (err) return res.status(400).json(err);
      res.status(201).json({ result: "success" });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "등록 실패",
    });
  }
});

//로그인 API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = createJwtToken(user._id);
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "로그인에 실패하였습니다" });
  }
});

function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}

//로그인 유저 정보조회
router.get("/me", isAuth, async (req, res) => {
  console.log(res.locals);
  res.send({ user: res.locals.user });
});
//csrf토큰 발급
router.get("/csrf-token", async (req, res) => {
  const csrfToken = await generateCSRFToken();
  res.status(200).json({ csrfToken });
});

async function generateCSRFToken() {
  return bcrypt.hash(process.env.CSRF_SECRET, 1);
}

//프로필 이미지 수정
router.post("/update-profile-image", isAuth, async (req, res) => {
  try {
    console.log(req.body);
    const { user } = res.locals;
    const userId = user._id;
    const modified_image = req.body.url;
    const target = await User.findOne({ _id: userId });
    target.profile_image = modified_image;
    target.save();
    res.status(200).json({ result: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "이미지 수정에 실패하였습니다" });
  }
});

//닉네임 수정
router.post("/update-nickname", isAuth, async (req, res) => {
  try {
    console.log(req.body.nickname);
    const { user } = res.locals;
    const userId = user._id;
    const modified_nickname = req.body.nickname;
    const target = await User.findOne({ _id: userId });
    target.nickname = modified_nickname;
    target.save();
    res.status(200).json({ result: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "닉네임 수정에 실패하였습니다" });
  }
});


//바디스펙 기록

router.post("/bodySpec", isAuth, async (req, res) => {
  //isAuth
  try {
    const { user } = res.locals;
    const userId = user._id;
    const { gender, weight, height, age } = req.body;
    const targetUser = await User.findOne({ _id: userId });

    const date = new Date(); //오늘 날짜를 받아서 year, month, date로 각각 할당
    const ryear = date.getFullYear();
    const rmonth = date.getMonth() + 1;
    const rdate = date.getDate();
    const registerDate = `${ryear}-${rmonth >= 10 ? rmonth : "0" + rmonth}-${
      rdate >= 10 ? rdate : "0" + rdate
    }`; //10이 넘지 않으면 0을 십의 자릿수에 붙여 무조건 두자릿수로 만들어준다.

    targetUser.gender = gender;
    targetUser.weight = Number(weight);
    targetUser.height = Number(height);
    targetUser.age = Number(age);

    if (gender === "남자") {
      const bmr = 66.47 + (13.75 * weight + 5 * height - 6.76 * age);
      targetUser.bmr = {
        bmr: Number(Math.round(bmr)), //소수로 안남기고 반올림을 해줌
        date: registerDate,
      };
    } else if (gender === "여자") {
      const bmr = 655.1 + (9.56 * weight + 1.85 * height - 4.68 * age);
      targetUser.bmr = {
        bmr: Number(Math.round(bmr)),
        date: registerDate,
      };
    }
    targetUser.save();
    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "바디스펙 입력중 에러발생",
    });
    return;
  }
});


//바디스펙 수정

router.put("/bodySpec/edit", isAuth, async (req, res) => {
  try {
    const { user } = res.locals;
    const userId = user._id;
    const { gender, weight, height, age } = req.body;
    await User.updateOne(
      { _id: userId },
      { $set: { gender: gender, weight: weight, height: height, age: age } }
    );

    const editUser = await User.findOne({ _id: userId });

    const date = new Date();
    const ryear = date.getFullYear();
    const rmonth = date.getMonth() + 1;
    const rdate = date.getDate();
    const registerDate = `${ryear}-${rmonth >= 10 ? rmonth : "0" + rmonth}-${
      rdate >= 10 ? rdate : "0" + rdate
    }`;

    if (gender === "남자") {
      const bmr = 66.47 + (13.75 * weight + 5 * height - 6.76 * age);
      if (editUser.bmr[editUser.bmr.length - 1].date === registerDate) { //bmr의 가장 마지막 값의 날짜가 수정하는 날짜와 같으면 마지막 값을 새로 입력하는 값으로 대체
        editUser.bmr[editUser.bmr.length - 1].bmr = Number(Math.round(bmr));
        editUser.markModified("bmr"); //markModified를 해주지 않으면 수정한 값이 저장되지 않음
        editUser.save();
      } else { //bmr의 마지막 값의 날짜와 수정하는 날짜가 다르면 배열의 마지막에 수정되는 bmr값을 추가함.
        editUser.bmr.push({ bmr: Number(Math.round(bmr)), date: registerDate });
        editUser.markModified("bmr");
        editUser.save();
      }
    } else if (gender === "여자") { //여자일때
      const bmr = 655.1 + (9.56 * weight + 1.85 * height - 4.68 * age);
      if (editUser.bmr[editUser.bmr.length - 1].date === registerDate) {
        editUser.bmr[editUser.bmr.length - 1].bmr = Number(Math.round(bmr));
        editUser.markModified("bmr");
        editUser.save();
      } else {
        editUser.bmr.push({ bmr: Number(Math.round(bmr)), date: registerDate });
        editUser.markModified("bmr");
        editUser.save();
      }
    }
    res.sendStatus(200);

  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "바디스펙 수정중 에러발생",
    });
    return;
  }
});

export default router;
