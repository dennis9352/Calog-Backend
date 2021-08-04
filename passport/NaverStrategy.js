import passport from 'passport'
import NaverStrategy from 'passport-naver';



passport.serializeUser(function (user, done) {
  done(null, user)
})
passport.deserializeUser(function (obj, done) {
  done(null, obj)
})


passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: "http://localhost:3000/api/auth_naver/oauth", // 애플리케이션을 등록할 때 입력했던 callbackURL 을 입력해준다.
      },
       async (accessToken, refreshToken, profile , cb) => {
   console.log(profile)
        try {
          const user = await User.findOne({ naverId: profile.id })
          //동일한 이메일을 가졌을 때는 이미 가입중인 사용자라면 바로 로그인하도록 아니라면 신규 사용자 생성
          if (user) {
            user.naverId = profile.id
            user.save()
            return cb(null, user)
          } else {
            const newUser = await User.create({
              
              naverId: profile.id,
           
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