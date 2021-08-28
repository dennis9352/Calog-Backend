import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20'
import User from'../models/users.js'


passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "https://2k1.shop/api/auth_google/oauth"
  
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
          socialtype:"google",
          socialId: profile.id,
          profile_image:profile._json.picture,
          nickname:profile._json.name

       
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