// index.js

// module가져오기
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');
let flash = require('connect-flash');
let session = require('express-session');
let passport = require('./config/passport');
let app = express();

// DB setting 거의 고정
mongoose.set('useNewUrlParser', true);    // 1
mongoose.set('useFindAndModify', false);  // 1
mongoose.set('useCreateIndex', true);     // 1
mongoose.set('useUnifiedTopology', true); // 1
// 환경변수에 저장한 DB connection string 불러오기, DB 연결
mongoose.connect(process.env.MONGO_DB);

// DB object 넣기, DB와 관련된 이벤트 리스너 함수 포함
let db = mongoose.connection;

// DB연결은 앱 실행 시 단 한 번만 일어나는 이벤트여서 once사용
db.once('open', () => {
  console.log('DB connected');
});

db.on('error', err => {
  console.log('DB ERROR:', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
// json 형식의 데이터를 받는다
// form에 입력한 데이터가 bodyParser를 통해 req.body로 생성된다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// _method의 query로 들어오는 값으로 HTTP method를 바꾼다.
app.use(methodOverride('_method'));
// 이제 req.flash 사용 가능
// req.flash(문자열, 저장할_값)
app.use(flash());
// 서버에서 접속자를 구분시키는 역할
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true}));
// passport 초기화, session 연결
app.use(passport.initialize());
app.use(passport.session());
// app.use에 함수를 넣은 것을 middleware라고 한다.
// app.use에 있는 함수는 request가 올 때마다 route에 상관없이 무조건 함수가 실행
// app.use들 중 위에부터 순서대로 실행
// route에 들어가는 함수와 동일한 req, res, next 3개의 파라미터를 가진다.
// 함수안에 반드시 next()를 넣어줘야 다음으로 진행된다
// req.isAuthenticated()는 passport 함수로 현재 로그인이 되어 있는지 return
/*
req.user는 passport에서 추가하는 항목으로 로그인이 되면 session으로 부터 user를 deserialize하여 생성됩니다.(이 과정 역시 밑에서 살펴보겠습니다.)
res.locals에 위 두가지를 담는데, res.locals에 담겨진 변수는 ejs에서 바로 사용가능합니다.
res.locals.isAuthenticated는 ejs에서 user가 로그인이 되어 있는지 아닌지를 확인하는데 사용되고, res.locals.currentUser는 로그인된 user의 정보를 불러오는데 사용됩니다.
*/
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});



// route 설정
app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'));



let port = 3000;
app.listen(port, () => {
  console.log('server on! http://localhost:'+port);
});
