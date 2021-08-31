import bcrypt from "bcrypt";

export const csrfCheck = (req, res, next) => {
  if (//직접적으로 사용자의 정보를 조작하지 않는 요청의 경우 csrfCheck 통과
    req.method === "GET" ||
    req.method === "OPTIONS" ||
    req.method === "HEAD"
  ) {
    return next();
  }

  const csrfHeader = req.get("x-csrf-token");//csrf토큰이 들어있는 커스텀 헤더를 받음
  if (!csrfHeader) {//커스텀헤더가 없는 경우 에러메세지 반환
    console.warn('Missing required "x-csrf-token" header.', req.headers.origin);
    return res.status(403).json({ message: "Failed CSRF check" });
  }

  validateCsrfToken(csrfHeader)////커스텀 헤더에 들어있는 csrf토큰 검사 후 유효하면 통과 유효하지 않을 경우 에러메세지 반환
    .then((valid) => {
      if (!valid) {
        console.warn(
          'Value provided in "x-csrf-token" header does not validate.',
          req.headers.origin,
          csrfHeader
        );
        return res.status(403).json({ message: "Failed CSRF check" });
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    });
};
//커스텀 헤더에 들어있는 csrf토큰 검사 함수
async function validateCsrfToken(csrfHeader) {
  return bcrypt.compare(process.env.CSRF_SECRET, csrfHeader);
}
