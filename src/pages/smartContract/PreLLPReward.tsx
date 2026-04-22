// import { Link } from "react-router-dom"

// function PreLppReward() {
//   return (
//    <>
   
//      <main>
//     <div className="container-fluid">
//       <div className="SOL-page-title text-center"><span>New LLP Program</span></div>
//       <div className="subNav mb-2">
//         <ul>
//                 <li><Link to="/preLLPReward" className="active"> Pre LLP Program</Link></li>
//           <li><Link to="/finalLLP">Final LLP Program</Link></li>
//         </ul>
//       </div>

//       <div className="row justify-content-center">
//         <div className="col-md-8 col-lg-6 col-12">
//           <div className="row justify-content-center">
//             <div className="col-md-6 col-lg-6 col-6">
//               <div className="sol-point-box mb-2  mt-0">
//                 <h4> $4200.00 USDT</h4>
//                 <small> Total Available Balance</small>
//               </div>
//             </div>

//           </div>
//           <div className="form-group">
//             <div className="row">

//               <div className="col-lg-12 mb-3">
//                 <label>Enter Amount (USDT)</label>
//                 <div className="input-group">
//                   <div className="input-group-prepend">
//                     <span className="input-group-text"><img src="/img/USDC-logo.png" width="25"/> </span>
//                   </div>
//                   <input type="text" className="form-control" placeholder="Min 10 USD"/>
//                 </div>
//               </div>
//               <div className="col-lg-12 mb-3">
//                 <label>Wallet Address</label>

//                 <div className="input-group">
//                   <div className="input-group-prepend">
//                     <span className="input-group-text"> <img src="/img/coin/solana-logo.webp" className="rounded-circle"
//                         width="27"/></span>
//                   </div>
//                   <input type="text" className="form-control" value="0x4S32aPO3bb6FFcb417458561A5645F5446b0s85d"
//                   />
//                 </div>
//               </div>
//               <div className="col-lg-12">
//                 <a href="javascript:void();" data-bs-toggle="modal" data-bs-target="#success-msg"
//                   className="btn btn-primary d-block " id="ticketBtn">Approved USDT</a>
//               </div>

//               <div className="col-lg-12">
//                 <div className="item-style-box d-flex justify-content-between align-items-center mt-2">
//                   <small> Expected Output: </small>
//                   <span className="text-warning">0.220 SOL </span>
//                 </div>
//                 <div className="item-style-box d-flex justify-content-between align-items-center mt-2">
//                   <small> Minimum Received: </small>
//                   <span className="text-success">0.220 SOL </span>
//                 </div>
//               </div>
//             </div>
//           </div> 

//             <div className="mt-3">
//             <Link to="/LLPRewardHistory" className="btn d-block btn-outline-dark">Pre LLP Reward History<i className="fa-regular fa-long-arrow-right ms-1"></i></Link>

//           </div>

//         </div>
//       </div>
//     </div>
//   </main>

//   {/* <!--  Submit --> */}
//   <div className="modal fade" id="success-msg" >
//     <div className="modal-dialog modal-dialog-centered">
//       <div className="modal-content">
//         <span className="modalWindow-close" data-bs-dismiss="modal" aria-label="Close"></span>
//         <div className="modal-body text-center">
//           <div className="sec-divider top"> </div>
//           <div className="sec-divider bottom"> </div>
//           <img src="/img/animated-check.gif" width="100" className="rounded-circle mb-2"/>
//           <h3>XP Points Converted</h3>
//           <p> Your request has been submitted successfully. Kindly wait while it is being reviewed and approved.</p>
//         </div>
//       </div>
//     </div>
//   </div> 
   
//    </>
//   )
// }

// export default PreLppReward












import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserData, deposit } from "../../solana/program"; // ✅ FIX

function PreLLPReward() {

  const [userData, setUserData] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH USER DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      const wallet = localStorage.getItem("wallet");
      if (!wallet) return;

      const data = await getUserData(wallet);
      setUserData(data);
    };

    fetchData();
  }, []);

  // =========================
  // SUBMIT FUNCTION
  // =========================
  // const handleSubmit = async () => {
  //   try {
  //     if (!amount) return alert("Enter amount");

  //     const amt = Number(amount);

  //     // ✅ VALIDATION
  //     if (amt < 10 || amt > 100) {
  //       return alert("Pre LPP amount must be 10 - 100");
  //     }

  //     setLoading(true);

  //     // ✅ CONTRACT CALL
  //     await deposit(amt, false);

  //     alert("✅ Deposit Success");

  //     setAmount("");

  //     // 🔄 refresh data
  //     const wallet = localStorage.getItem("wallet");
  //     if (wallet) {
  //       const updated = await getUserData(wallet);
  //       setUserData(updated);
  //     }

  //   } catch (err: any) {
  //     console.error(err);
  //     alert(err.message || "Deposit failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };





const handleSubmit = async () => {
  try {
    if (loading) return;

    if (!userData) {
      return alert("⏳ Loading user data...");
    }

    if (!amount) return alert("Enter amount");

    const amt = Number(amount);

    console.log("PRE VALUE:", userData?.preLpp);

    // ✅ PRE ALREADY DONE BLOCK
    if (Number(userData?.preLpp || 0) > 0) {
      return alert("❌ Pre LLP already completed");
    }

    // ✅ VALIDATION
    if (amt < 10 || amt > 100) {
      return alert("Pre LPP amount must be 10 - 100");
    }

    setLoading(true);

    const tx = await deposit(amt, false);

    if (tx === "success") {
      alert("✅ Pre LLP Success (Already processed)");
    } else {
      alert("✅ Pre LLP Success");
    }

    setAmount("");

    // 🔥 WAIT (important)
    await new Promise((res) => setTimeout(res, 2000));

    const wallet = localStorage.getItem("wallet");
    if (wallet) {
      const updated = await getUserData(wallet);
      setUserData(updated);
    }

  } catch (err: any) {
    console.error(err);
    alert(err.message || "Deposit failed");
  } finally {
    setLoading(false);
  }
};




  return (
    <>
      <main>
        <div className="container-fluid">
          <div className="SOL-page-title text-center">
            <span>New LLP Program</span>
          </div>

          {/* NAV */}
          <div className="subNav mb-2">
            <ul>
              <li>
                <Link to="/preLLPReward" className="active"> {/* ✅ FIX */}
                  Pre LLP Program
                </Link>
              </li>
              <li>
                <Link to="/finalLLP">Final LLP Program</Link>
              </li>
            </ul>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-12">

              {/* BALANCE */}
              <div className="row justify-content-center">
                <div className="col-md-6 col-6">
                  <div className="sol-point-box mb-2 mt-0">
                    <h4>
                      ${userData?.lppProgramReward || 0} USDT
                    </h4>
                    <small>Total Available Balance</small>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">

                  {/* AMOUNT */}
                  <div className="col-lg-12 mb-3">
                    <label>Enter Amount (USDT)</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <img src="/img/USDC-logo.png" width="25" />
                      </span>

                      <input
                        type="number"
                        className="form-control"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Min 10 USD"
                      />
                    </div>
                  </div>

                  {/* WALLET */}
                  <div className="col-lg-12 mb-3">
                    <label>Wallet Address</label>

                    <div className="input-group">
                      <span className="input-group-text">
                        <img
                          src="/img/coin/solana-logo.webp"
                          className="rounded-circle"
                          width="27"
                        />
                      </span>

                      <input
                        type="text"
                        className="form-control"
                        value={userData?.wallet || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* BUTTON */}
                  <div className="col-lg-12">
                    {/* <button
                      onClick={handleSubmit}
                      className="btn btn-primary d-block"
                      disabled={loading}
                    > */}
                    <button
  onClick={handleSubmit}
  className="btn btn-primary d-block"
  disabled={
    loading ||
    !userData ||
    Number(userData?.preLpp || 0) > 0
  }
>
                      {loading ? "Processing..." : "Approved USDT"}
                    </button>
                  </div>

                  {/* OUTPUT */}
                  <div className="col-lg-12">
                    <div className="item-style-box d-flex justify-content-between mt-2">
                      <small>Expected Output:</small>
                      <span className="text-warning">
                        {userData?.totalDeposit || 0} SOL
                      </span>
                    </div>

                    <div className="item-style-box d-flex justify-content-between mt-2">
                      <small>Minimum Received:</small>
                      <span className="text-success">
                        {userData?.totalDeposit || 0} SOL
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* HISTORY */}
              <div className="mt-3">
                <Link
                  to="/LLPRewardHistory"
                  className="btn d-block btn-outline-dark"
                >
                  Pre LLP Reward History
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default PreLLPReward;
















// import { useState } from "react"
// import { Link, useLocation } from "react-router-dom"
// import { useEffect } from "react";
// import { getUserData,deposit } from "../../solana/program";
// // import { getUserData } from "@/lib/api"
// function LLPReward() {
//   const location = useLocation()
//   const initialTab = location.state?.activeTab || "pre"
//  const [activeTab, setActiveTab] = useState("pre");

// const [userData, setUserData] = useState(null);


// const [amount, setAmount] = useState("");
// const [loading, setLoading] = useState(false);




// // useEffect(() => {
// //   if (!userData) return;

// //   if (userData.totalDeposit > 0) {
// //     setActiveTab("final"); // ✅ auto switch
// //   } else {
// //     setActiveTab("pre");
// //   }
// // }, [userData]);
// const preData = {
//   balance: `${userData?.lppProgramReward || 0} USDT`,
//   amountPlaceholder: "Min 10 USD",
//   walletAddress: userData?.wallet || "-",
//   expectedOutput: `${userData?.totalDeposit || 0} SOL`,
//   minimumReceived: `${userData?.totalDeposit || 0} SOL`,
//   buttonText: "Approved USDT",
//   historyRoute: "/LLPRewardHistory",
//   historyText: "Pre LLP Reward History",
// };

// const finalData = {
//   balance: `${userData?.totalIncome || 0} USDT`,
//   amountPlaceholder: "Min 50 USD",
//   walletAddress: userData?.wallet || "-",
//   expectedOutput: `${userData?.totalIncome || 0} SOL`,
//   minimumReceived: `${userData?.totalIncome || 0} SOL`,
//   buttonText: "Approved Final LLP",
//   historyRoute: "/LLPRewardHistory",
//   historyText: "Final LLP Reward History",
// };

//   const currentData = activeTab === "pre" ? preData : finalData





// // const handleSubmit = async () => {
// //   try {
// //     if (!amount) {
// //       alert("Enter amount");
// //       return;
// //     }

// //     const amt = Number(amount);

// //     // ✅ contract validation
// //     if (activeTab === "pre") {
// //       if (amt < 10 || amt > 100) {
// //         return alert("Pre LPP: 10 - 100");
// //       }
// //     } else {
// //       if (amt < 101 || amt > 5000) {
// //         return alert("Final LPP: 101 - 5000");
// //       }
// //     }

// //     setLoading(true);

// //     await deposit(amt, activeTab === "final");

// //     alert("✅ Deposit Success");

// //     setAmount("");

// //   } catch (err: any) {
// //     console.error(err);
// //     alert(err.message || "Deposit failed");
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// const handleSubmit = async () => {
//   try {
//     if (!amount) return alert("Enter amount");

//     const amt = Number(amount);

//     // ✅ EXACT SAME AS SCRIPT
//     const isFinal = activeTab === "final";

//     // ✅ SAME VALIDATION
//     if (!isFinal) {
//       if (amt < 10 || amt > 100) {
//         return alert("Pre LPP: 10 - 100");
//       }
//     } else {
//       if (amt < 101 || amt > 5000) {
//         return alert("Final LPP: 101 - 5000");
//       }
//     }

//     setLoading(true);

//     // ✅ EXACT MATCH
//     await deposit(amt, isFinal);

//     alert("✅ Deposit Success");

//     setAmount("");

//   } catch (err: any) {
//     console.error(err);
//     alert(err.message || "Deposit failed");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <>
//       <main>
//         <div className="container-fluid">
//           <div className="SOL-page-title text-center">
//             <span>New LLP Program</span>
//           </div>

//           <div className="subNav mb-2">
//             <ul>
//               <li>
//                 <a
//                   type="button"
//                   className={activeTab === "pre" ? "active" : ""}
//                   onClick={() => setActiveTab("pre")}
//                 >
//                   Pre LLP Program
//                 </a>
//               </li>
//               <li>
//                 <a
//                   type="button"
//                   className={activeTab === "final" ? "active" : ""}
//                   onClick={() => setActiveTab("final")}
//                 >
//                   Final LLP Program
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div className="row justify-content-center">
//             <div className="col-md-8 col-lg-6 col-12">
//               <div className="row justify-content-center">
//                 <div className="col-md-6 col-lg-6 col-6">
//                   <div className="sol-point-box mb-2 mt-0">
//                     <h4>{currentData.balance}</h4>
//                     <small>Total Available Balance</small>
//                   </div>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <div className="row">
//                   <div className="col-lg-12 mb-3">
//                     <label>Enter Amount (USDT)</label>
//                     <div className="input-group">
//                       <div className="input-group-prepend">
//                         <span className="input-group-text">
//                           <img src="/img/USDC-logo.png" width="25" alt="usdc" />
//                         </span>
//                       </div>
//                       {/* <input
//                         type="text"
//                         className="form-control"
//                         placeholder={currentData.amountPlaceholder}
//                       /> */}
//                       <input
//   type="text"
//   className="form-control"
//   value={amount}
//   onChange={(e) => setAmount(e.target.value)}
//   placeholder={currentData.amountPlaceholder}
// />
//                     </div>
//                   </div>

//                   <div className="col-lg-12 mb-3">
//                     <label>Wallet Address</label>
//                     <div className="input-group">
//                       <div className="input-group-prepend">
//                         <span className="input-group-text">
//                           <img
//                             src="/img/coin/solana-logo.webp"
//                             className="rounded-circle"
//                             width="27"
//                             alt="solana"
//                           />
//                         </span>
//                       </div>
//                       <input
//                         type="text"
//                         className="form-control"
//                         value={currentData.walletAddress}
//                         readOnly
//                       />
//                     </div>
//                   </div>

             
//     <div className="col-lg-12">
//                 {/* <a href="javascript:void();" data-bs-toggle="modal" data-bs-target="#success-msg"
//                   className="btn btn-primary d-block " id="ticketBtn">{currentData.buttonText}</a> */}

// <button
//   onClick={handleSubmit}
//   className="btn btn-primary d-block"
//   disabled={loading}
// >
//   {loading ? "Processing..." : currentData.buttonText}
// </button>

//               </div>


//                   <div className="col-lg-12">
//                     <div className="item-style-box d-flex justify-content-between align-items-center mt-2">
//                       <small>Expected Output:</small>
//                       <span className="text-warning">{currentData.expectedOutput}</span>
//                     </div>
//                     <div className="item-style-box d-flex justify-content-between align-items-center mt-2">
//                       <small>Minimum Received:</small>
//                       <span className="text-success">{currentData.minimumReceived}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-3">
//                 <Link to={currentData.historyRoute}  state={{ activeTab }} className="btn d-block btn-outline-dark">
//                   {currentData.historyText}
//                   <i className="fa-regular fa-long-arrow-right ms-1"></i>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//   <div className="modal fade" id="success-msg" >
//     <div className="modal-dialog modal-dialog-centered">
//       <div className="modal-content">
//         <span className="modalWindow-close" data-bs-dismiss="modal" aria-label="Close"></span>
//         <div className="modal-body text-center">
//           <div className="sec-divider top"> </div>
//           <div className="sec-divider bottom"> </div>
//           <img src="/img/animated-check.gif" width="100" className="rounded-circle mb-2"/>
//           <h3>XP Points Converted</h3>
//           <p> Your request has been submitted successfully. Kindly wait while it is being reviewed and approved.</p>
//         </div>
//       </div>
//     </div>
//   </div> 
//     </>
//   )
// }

// export default LLPReward
