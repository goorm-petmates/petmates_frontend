import React, { useEffect, useState } from 'react';
import MemberFormModal from '../../components/MemberFormModal';
import '../../styles/StyleSignUp.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from "axios";
import Post from '../../components/Post';
import HeaderWithNav from '../../components/HeaderWithNav';
import Footer from '../../components/Footer';
function SignUp() {
  const navigate = useNavigate();
  const navigateToPage = () => {
    if (!userNickName || !userPhone || !enroll_company.address) {
      alert("모든 필수 입력 항목을 채워주세요.");
    } else navigate('/login');
  };
  const [showModal, setShowModal] = useState(false); // Modal을 보여주기 위한 상태 추가
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(!showModal);
  };

  // 유효성 검사
  const [userNickName, setUserNickName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const [errorNickName, setErrorNickName] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  // 스페이스바 입력 무시
  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };
  const handleNickName = (e) => {
    setUserNickName(e.target.value);

    // 공백 여부 체크
    if (e.data === " " || e.data === 0) {
      setErrorNickName("공백은 입력할 수 없습니다.");
    }

    if (userNickName.length < 2 || userNickName.length > 10) {
      return setErrorNickName("2~10자 이내로 입력하세요 ");
    } if (!/^[가-힣a-zA-Z]+$/.test(userNickName)) {
      return setErrorNickName("한글 또는 영문만 사용 가능합니다");
    } else {
      return setErrorNickName("사용 가능한 닉네임입니다");
    }
  }

  const handlePhone = (e) => {
    setUserPhone(e.target.value);

    // 공백 여부 체크
    if (e.data === " " || e.data === 0) {
      alert("공백은 입력할 수 없습니다.");
    }

    if (/^\d+$/.test(userPhone)) {
      if (userPhone.length === 11) {
        return setErrorPhone("사용 가능한 휴대전화 번호입니다");
      } else {
        return setErrorPhone("휴대전화 11자를 입력하세요");
      }
    } else {
      return setErrorPhone("숫자만 입력해주세요");
    }
  }

  // 카카오 로그인 api
  const REST_API_KEY='2a0545dc2cd35dfd52e96098d3ef9162'
  const REDIRECT_URI = 'http://localhost:3000/kakao/callback'

  const [query, setQuery] = useSearchParams();
  const [code, setCode] = useState("");
  const [accessToken, setAccessToken] = useState()

  //1.리다이렉트 시에 받은 코드를 통해서 카카오 서버에 인증받을 code를 가져오기
  useEffect(() => {
    console.log("code : ", code);
    setCode(query.get("code"));
  }, []);

  //2.rest api로 토큰 가져오기
  const tokenRequest = async () => {
    await axios.post(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
      {}, {
        headers : "Content-type : application/x-www-form-urlencoded;charset=utf-8"
      })
      .then(res => {setAccessToken(res.data.access_token);
        console.log(res)})
      .catch(error => console.log(error))
      .finally(res => console.log(res))
  }

  //3.rest api로 카카오 서버에서 정보 받아오기
  const getInfo = () => {
    console.log(accessToken)
    axios.post("https://kapi.kakao.com/v2/user/me",{},
      {
        headers : {
          Authorization : `Bearer ${accessToken}`,
          "Content-type": " application/x-www-form-urlencoded"
        }
      }).then(res => console.log("profile_image_url : ",res.data.kakao_account.profile.profile_image_url));
  }


  const [enroll_company, setEnroll_company] = useState({
    address:'',
  });
  const [popup, setPopup] = useState(false);

  const handleInput = (e) => {
    setEnroll_company({
      ...enroll_company,
      [e.target.name]:e.target.value,
    })
  }
  const handleComplete = (data) => {
    setPopup(!popup);
  }

  return (
    <div>
      <HeaderWithNav/>

      <div className="MemberInput">
        <div className="Signup-title"> 회 원 가 입</div>
        <div className="Signup-text">
          <span className="Signup-span" style={{ color: 'red' }}>(*)</span>
          표시는 필수입력 항목입니다.
        </div>

        <div className='MemberInputAline'>
          <label className="aline-input-label">닉네임(*)</label>
          <input id="nickName" type="text"
                 className="aline-input"
                 placeholder="2~10자의 한글, 영문, 숫자 조합"
                 value={userNickName}
                 onInput={handleNickName}
                 onKeyDown={handleKeyDown} />
          <button className="input-aline-button" onClick={openModal}>중복 확인</button>
          {errorNickName && (
            <div style={{ color: 'red',
              marginTop:"5px",
              fontSize: '10px' }}>
              {errorNickName}</div>
          )}
        </div>

        <div className="input-email">
          <label>이메일(*)</label>
          <input id="email" type="text"
                 className="signup-member-input"
                 placeholder="2~10자의 한글, 영문, 숫자 조합"
                 value="qwer@qwer.com"
                 onInput={handleNickName}
                 onKeyDown={handleKeyDown} />
        </div>

        <div className="input-phone">
          <label>휴대폰번호(*)</label>
          <input id="phone" type="text"
                 className="signup-member-input"
                 placeholder="ex) 0101234567"
                 value={userPhone}
                 onInput={handlePhone}
                 onKeyDown={handleKeyDown} />
          {errorPhone && (
            <div style={{ color: 'red', marginTop: '-7px', fontSize: '10px' }}>
              {errorPhone}</div>
          )}
        </div>

        <div className="input-address">
          <label>주소(*)</label>
          <button className="address-button"
                  onClick={handleComplete}>
            우편번호 찾기</button>
          {popup && <Post company={enroll_company} setcompany={setEnroll_company}></Post>}

          <input id="address" type="text"
                 className="signup-member-input signup-address-input"
                 placeholder="주소"
                 onKeyDown={handleKeyDown}
                 required={true}
                 name="address"
                 onChange={handleInput}
                 value={enroll_company.address}
          />
        </div>
        <button className="MemberJoinButton" onClick={navigateToPage}>
          가입하기
        </button>

        {showModal && (
          <MemberFormModal
            title="중복확인"
            text="이미 등록된 닉네임 입니다. 새로운 닉네임으로 다시 가입해주세요 :)"
            onClose={closeModal}
          />
        )}
      </div>
      <div>
      </div>

      <div className="signup-kakao-api">
        <button onClick={tokenRequest}>토큰 발급</button>
        <button onClick={getInfo}>정보 받아오기</button>
      </div>
      <Footer/>
    </div>
  );
}

export default SignUp;