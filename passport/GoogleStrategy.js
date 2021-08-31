import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/users.js";

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
//passport GoogleStrategy 실행(KakaoStrategy, NaverStrategy 모두 동일 로직으로 진행)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "https://2k1.shop/api/auth_google/oauth",// 애플리케이션을 등록할 때 입력했던 callbackURL 을 입력해준다.
    },
    async function (accessToken, refreshToken, profile, cb) {//profile에 소셜 계정의 유저 정보가 들어있음
      try {//이미 가입중인 사용자라면 바로 로그인하도록 아니라면 신규 사용자 생성 후 로그인
        const user = await User.findOne({ socialId: profile.id });//이미 가입된 소셜계정인지 확인
        if (user) {
          user.socialId = profile.id;
          user.save();
          return cb(null, user);
        } else {
          const newUser = await User.create({//새로운 유저인 경우 소셜계정의 유저정보를 받아 DB에 저장
            socialtype: "google",
            socialId: profile.id,
            profile_image: profile._json.picture,
            nickname: profile._json.name,
          });
          return cb(null, newUser);
        }
      } catch (error) {
        console.log(err)
        return cb(error);
      }
    }
  )
);

export default passport;
