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

// jwt 시크릿키 및 만료일 설정
const jwtSecretKey = process.env.JWT_SECRET;
const jwtExpiresInDays = "2d";
// 패스워드 복잡도 설정
const bcryptSaltRounds = 12;
//일반 회원가입 시 유효성 검사 설정 
const validateRegister = [
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),//이메일 형식에 맞게 기입 했는지 확인
  body("password")//빈칸 없음, 최소 5자 이상 설정
    .trim()
    .isLength({ min: 5 })
    .withMessage("password should be at least 5 characters"),
  body("nickname").notEmpty().withMessage("nickname is missing"),//닉네임 필수 입력
  validate,
];
//닉네임 중복 검사 시 유효성 검사
const validatedupnickname = [
  body("nickname").notEmpty().withMessage("nickname is missing"),
  validate,
];
//이메일 중복 검사 시 유효성 검사
const validatedupemail = [
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  validate,
];

//이메일 중복체크
router.post("/duplicate-email", validatedupemail, async (req, res) => {
  const { email } = await req.body;
  const found_email = await User.findOne({ email: email });//해당 이메일이 이미 존제 하는 지 확인

  if (found_email) {//해당 이메일이 존제 하는 경우 에러메세지를 반환
    return res.status(409).json({ message: `${email} already exists` });
  }
  res.status(201).json({ result: "success" });
});
//닉네임 중복체크
router.post("/duplicate-nickname", validatedupnickname, async (req, res) => {
  const { nickname } = await req.body;
  const found_nickname = await User.findOne({ nickname: nickname });//해당 닉네임이 이미 존제 하는 지 확인
  if (found_nickname) {//해당 닉네임이 존제 하는 경우 에러메세지를 반환
    return res.status(409).json({ message: `${nickname} already exists` });
  }
  res.status(201).json({ result: "success" });
});

//회원가입
router.post("/register", validateRegister, async (req, res) => {
  try {
    const { email, password, nickname } = await req.body;//회원 가입 시 필요한 정보를 받음
    const found_email = await User.findOne({ email: email });//해당 이메일이 이미 존제 하는 지 확인
    const found_nickname = await User.findOne({ nickname: nickname });//해당 닉네임이 이미 존제 하는 지 확인
    if (found_email) {//해당 이메일이 존제 하는 경우 에러메세지를 반환
      return res.status(409).json({ message: `${email} already exists` });
    }
    if (found_nickname) {//해당 닉네임이 존제 하는 경우 에러메세지를 반환
      return res.status(409).json({ message: `${nickname} already exists` });
    }
    const hashed = await bcrypt.hash(password, bcryptSaltRounds);//입력된 패스워드 암호화
    const userInfo = {
      email,
      password: hashed,
      nickname,
    };
    await User.create(userInfo, (err, user) => {//입력정보와 암호화된 패스워드를 DB에 저장
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
    const user = await User.findOne({ email: email });//입력된 이메일을 DB에 존제하는지 찾음
    if (!user) {//이메일이 존제하지 않는경우 에러메세지 반환
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);//입력된 패스워드와 DB에 저장된 암호화된 패스워드를 비교
    if (!isValidPassword) {//유효한 패스워드가 아닌경우 에러메세지를 반환
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = createJwtToken(user._id);//입력정보가 유효한 경우 jwt 토큰생성
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "로그인에 실패하였습니다" });
  }
});
//JWT Token 생성 함수
function createJwtToken(id) {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
}

//로그인 유저 정보조회
router.get("/me", isAuth, async (req, res) => {
  res.send({ user: res.locals.user });//isAuth 미들웨어를 통해 res.locals에 저장된 유저정보를 반환
});
//csrf토큰 발급
router.get("/csrf-token", async (req, res) => {
  const csrfToken = await generateCSRFToken();//사이트 접속 후 프론트에서 요청 시 토큰 발급
  res.status(200).json({ csrfToken });
});
//csrf 토큰 생성 함수
async function generateCSRFToken() {
  return bcrypt.hash(process.env.CSRF_SECRET, 1);
}

//프로필 이미지 수정
router.post("/update-profile-image", isAuth, async (req, res) => {
  try {
    const { user } = res.locals;//isAuth 미들웨어를 통해 res.locals에 저장된 유저정보를 받음
    const userId = user._id;//해당 유저의 objectid를 받음
    const modified_image = req.body.url;//이미지 url을 받음
    const target = await User.findOne({ _id: userId });//해당 유저를 DB에서 찾음
    target.profile_image = modified_image;
    target.save();//업데이트할 이미지 url을 DB에 저장
    res.status(200).json({ result: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: "이미지 수정에 실패하였습니다" });
  }
});

//닉네임 수정(위의 프로필 이미지 수정과 로직이 똑같음)
router.put("/update-nickname", isAuth, async (req, res) => {
  try {
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

    const date = new Date();
    const ryear = date.getFullYear();
    const rmonth = date.getMonth() + 1;
    const rdate = date.getDate();

    const registerDate = `${ryear}-${rmonth >= 10 ? rmonth : "0" + rmonth}-${
      rdate >= 10 ? rdate : "0" + rdate
    }`;

    targetUser.gender = gender;
    targetUser.weight = Number(weight);
    targetUser.height = Number(height);
    targetUser.age = Number(age);

    if (gender === "남자") {
      const bmr = 66.47 + (13.75 * weight + 5 * height - 6.76 * age);
      targetUser.bmr = {
        bmr: Number(Math.round(bmr)),
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
      if (editUser.bmr[editUser.bmr.length - 1].date === registerDate) {
        editUser.bmr[editUser.bmr.length - 1].bmr = Number(Math.round(bmr));
        editUser.markModified("bmr");
        editUser.save();
      } else {
        editUser.bmr.push({ bmr: Number(Math.round(bmr)), date: registerDate });
        editUser.markModified("bmr");
        editUser.save();
      }
    } else if (gender === "여자") {
      //여자일때
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
