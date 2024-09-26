import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

//Components
import InputField from "../components/input/InputField";
import Loader from "../components/loader/";

//Functions
import { SuccessMsg, ErrorMsg } from "../components/alerts";
import { postLoginDataEmail } from "../api/authAPI";
import {
  getLoginAction,
  getSaveTokenAction,
  getSaveProfileAction
} from "../redux/actions";

//Images
import logo from "../img/logo.png";
import cross_black from "../img/cross_black.svg";

const Login = ({ onClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function Login(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await postLoginDataEmail({ email, password });
      if (data.success) {
        setLoading(false);
        setSuccess(true);
        setMessage(data.message);
        saveData(data);
      }
    } catch (err) {
      setSuccess(false);
      setLoading(false);
      setMessage("Server Issue, Try again later");
      console.log(err);
    }
  }

  async function saveData(data) {
    setSuccess(data.success);
    setMessage(data.message);
    localStorage.setItem("isLoggedIn", true);
    Cookies.set("access-token", data.data.tokens.access, {
      path: "/",
      expires: new Date().setDate(new Date().getDate() + 1)
    });
    Cookies.set("refresh-token", data.data.tokens.refresh, {
      path: "/",
      expires: new Date().setDate(new Date().getDate() + 1)
    });
    Cookies.set("uuid", data.data.uuid, {
      path: "/",
      expires: new Date().setDate(new Date().getDate() + 1)
    });
    Cookies.set("user", data);
    dispatch(getLoginAction());
    dispatch(
      getSaveTokenAction({
        accessToken: data.data.tokens.access,
        refreshToken: data.data.tokens.refresh
      })
    );
    dispatch(getSaveProfileAction(data));
    setLoading(false);
    navigate("/");
  }

  return (
    <div className="fixed top-0 z-50 w-full bg-[#219653]">
      <div className="absolute top-2 right-2 ">
        <img
          src={cross_black}
          className="cursor-pointer hover:opacity-90 bg-[#E5E5E5] rounded-full p-2 shadow-xl"
          alt="crosss black"
          onClick={() => onClick(false)}
        />
      </div>
      {loading && <Loader />}

      <div className="flex justify-center py-9 rounded-2xl">
        <div
          className="px-9 relative w-2/3 bg-[#219653]"
          style={{
            paddingTop: "5rem",
            paddingBottom: "5rem"
          }}
        >
          <form
            onSubmit={Login}
            className="bg-white mx-auto relative p-9 pt-3 drop-shadow-md rounded-3xl flex flex-col justify-center text-center w-2/3"
          >
            <div className="absolute -top-12 float-center flex flex-col left-1/2 -translate-x-1/2">
              <img
                className="h-24 w-24 border-full mx-auto"
                style={{
                  filter: "drop-shadow(0px 4px 4px rgba(104, 172, 93, 0.25))"
                }}
                src={logo}
                alt="logo"
              />
            </div>
            <h1 className="text-2xl font-bold" style={{ marginTop: "3rem" }}>
              Login Here
            </h1>
            {success && <SuccessMsg msg={message} />}
            {error && <ErrorMsg msg={message} />}
            <p className="font mb-4">Login Using Email</p>
            <InputField
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
            />
            <InputField
              placeholder="Password*"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <button
              className="px-6 py-1 w-32 mx-auto rounded-lg text-white text-xl font-semibold bg-[#219653] hover:opacity-90"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
