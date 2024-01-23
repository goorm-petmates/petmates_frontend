import '../../styles/StyleLogin.css';
import Header from "../../components/Header";
import LeftAside from "../../components/LeftAside";
import RightAside from "../../components/RightAside";
import Nav from "../../components/Nav";
import HeaderWithNav from '../../components/HeaderWithNav';
import Footer from '../../components/Footer';
function Login() {
  const REST_API_KEY='2a0545dc2cd35dfd52e96098d3ef9162'
  const REDIRECT_URI = 'http://localhost:3000/kakao/callback'

  return (
    <div className>
      <HeaderWithNav/>

      <div className="login">
        <img className="login-logo" alt="Logo" src="/imgs/Logo.png" />
        <p className="login-info">
          서비스 이용을 위해 로그인 해주세요 :)
        </p>
        <button className="kakao-button">
          <a
            href={`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`}>REST
            <img src="/imgs/kakaoLogin.png" alt="kakao icon" />
          </a>
        </button>
      </div>
      <Footer/>
    </div>
  );
}

export default Login;