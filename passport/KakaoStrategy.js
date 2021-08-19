import passport from 'passport';
import Kakao from 'passport-kakao';
import User from'../models/users.js'

const KakaoStrategy = Kakao.Strategy;

console.log(KakaoStrategy)

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new KakaoStrategy
  ({
    clientID: process.env.K_API_KEY,
    callbackURL: "https://2k1.shop/api/auth_kakao/oauth"
    
  },
  async function(accessToken, refreshToken, profile, cb) {
   
    try {
     
      const user = await User.findOne({ socialId: profile.id })
      //동일한 이메일을 가졌을 때는 이미 가입중인 사용자라면 바로 로그인하도록 아니라면 신규 사용자 생성
      if (user) {
        user.socialId = profile.id
        user.save()
        return cb(null, user)
      } else {
        const newUser = await User.create({
          socialtype:"kakao",
          socialId: profile.id,
          nickname:profile._json.properties.nickname,
          email:profile._json.kakao_account.email,
          gender:profile._json.kakao_account.gender,
          profile_image:profile._json.properties.profile_image
       
        })
        return cb(null, newUser)
      }
    } catch (error) {
      return cb(error)
    }
  }
)
)

export default passport;