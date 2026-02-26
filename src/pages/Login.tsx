import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../api/services";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await ApiService.login(email, password);
    if (res.isAdded) {
      login(res.token, res.role);
      navigate(res.role === "Admin" ? "/admin" : "/operator");
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-white ">
        <div className="w-full max-w-6xl rounded-xl shadow-lg flex flex-col lg:flex-row overflow-hidden">

          <div className="w-full lg:w-3/5 bg-[#F0F7FF] min-h-[400px] lg:min-h-[740px] pt-14 pl-12">
            <div className="flex items-center justify-center mb-16 gap-4">
              <span className="w-10 h-10 bg-[#1F8CF9] rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-[20px]">
                  print
                </span>
              </span>

              <h1 className="text-[32px] leading-[26px] font-bold text-[#1F8CF9]">
                Annai Printers
              </h1>
            </div>

            <h2 className="text-[28px] leading-[48px] font-extrabold text-[#16181D]">
              Welcome to
            </h2>

            <div className="inline-block bg-white shadow p-0.5">
              <span className="text-[28px] font-bold text-[#1F8CF9]">
                Annai Printers
              </span>
            </div>

            <div className="mt-4 max-w-md">
              <p className="text-[#575E6BFF] text-[17px]">
                Your comprehensive suite for automated billing, revenue recognition, and financial reporting. Sign in to manage your enterprise accounts and track daily settlements.
              </p>
            </div>

            <div className="mt-12 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#1F8CF91A] rounded-full flex items-center justify-center">
                <span className="material-icons text-[#1F8CF9FF] text-[16px]">check_circle</span>
              </div>

              <div>
                <p className="text-[#16181DFF] font-semibold">
                  Track Everyday Bills
                </p>

                <p className="text-[#575E6BFF] font-normal">
                  Real time generation and distribution.
                </p>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#1F8CF91A] rounded-full flex items-center justify-center">
                <span className="material-icons text-[#1F8CF9FF] text-[16px]">check_circle</span>
              </div>

              <div>
                <p className="text-[#16181DFF] font-semibold">
                  Download Everyday Record
                </p>

                <p className="text-[#575E6BFF] font-normal">
                  Live insights into your cash flow health.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5 bg-white min-h-[400px] lg:min-h-[740px] p-16">
            <h1 className="text-[24px] text-[#16181DFF] font-bold leading-8">
              Staff Login
            </h1>

            <p className="text-[13px] text-[#575E6BFF] leading-5 mt-2">
              Please enter your credentials to access the billing portal.
            </p>

            <div className="mt-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="">User Id</label>
                <div className="relative"> {/* CHANGED: relative wrapper */}

                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[#575E6B] text-[16px]">
                    person
                  </span>
                  <input type="text" className="w-[333px] h-[53px] pl-10 pr-3 text-[14px] leading-[22px] bg-white border
                   border-[#E0E2E6] rounded-md outline-none hover:border-[#E0E2E6] focus:border-[#1F8CF9] disabled:text-[#575E6B]" placeholder="Enter your Id" 
                   onChange={(e) => setEmail(e.target.value)}/>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="">Password</label>
                <div className="relative"> {/* CHANGED */}

                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[#575E6B] text-[16px]">
                    lock
                  </span>
                  <input type="password" className=" w-[333px] h-[53px] pl-10 pr-3 text-[14px] leading-[22px] bg-white border border-[#E0E2E6] 
                    rounded-md outline-none hover:border-[#E0E2E6] focus:border-[#1F8CF9]" placeholder="Enter password" 
                    onChange={(e) => setPassword(e.target.value)}/>
                </div>
              </div>

              <button className="w-full h-[48px] flex items-center justify-center text-[16px] font-semibold leading-[26px] text-white bg-[#1F8CF9]
               rounded-md shadow-[0px_2px_4px_rgba(0,0,0,0.07)] hover:bg-[#1F8CF9] active:bg-[#1F8CF9] disabled:opacity-40" 
               onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}