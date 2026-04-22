// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getUserData, deposit } from "../../solana/program";

// function FinalLLP() {

//   const [userData, setUserData] = useState<any>(null);
//   const [amount, setAmount] = useState("");
//   const [loading, setLoading] = useState(false);

//   // =========================
//   // FETCH USER DATA
//   // =========================
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const wallet = localStorage.getItem("wallet");
//         if (!wallet) return;

//         const data = await getUserData(wallet);

//         console.log("USER DATA:", data); // 🔥 debug

//         setUserData(data);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   // =========================
//   // SUBMIT FUNCTION (FINAL FIXED)
//   // =========================
//   const handleSubmit = async () => {
//     try {
//       // 🔥 duplicate tx रोकना
//       if (loading) return;

//       // 🔥 userData loading check
//       if (!userData) {
//         return alert("⏳ Loading user data...");
//       }

//       if (!amount) return alert("Enter amount");

//       const amt = Number(amount);

//       console.log("PRE VALUE:", userData?.preLpp);

//       // 🔥 PRE validation
//       if (Number(userData?.preLpp || 0) === 0) {
//         return alert("❌ Complete PRE LLP first");
//       }

//       // 🔥 FINAL validation
//       if (amt < 101 || amt > 5000) {
//         return alert("Final LPP: 101 - 5000");
//       }

//       setLoading(true);

//       // 🚀 CONTRACT CALL
//       await deposit(amt, true);

//       alert("✅ Final LLP Success");

//       setAmount("");

//       // 🔄 refresh data
//       const wallet = localStorage.getItem("wallet");
//       if (wallet) {
//         const updated = await getUserData(wallet);
//         setUserData(updated);
//       }

//     } catch (err: any) {
//       console.error(err);
//       alert(err.message || "Final LLP failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <main>
//         <div className="container-fluid">
//           <div className="SOL-page-title text-center">
//             <span>Final LLP Program</span>
//           </div>

//           {/* NAV */}
//           <div className="subNav mb-2">
//             <ul>
//               <li>
//                 <Link to="/preLLPReward">Pre LLP Program</Link>
//               </li>
//               <li>
//                 <Link to="/finalLLP" className="active">
//                   Final LLP Program
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div className="row justify-content-center">
//             <div className="col-md-8 col-lg-6 col-12">

//               {/* BALANCE */}
//               <div className="row justify-content-center">
//                 <div className="col-md-6 col-6">
//                   <div className="sol-point-box mb-2 mt-0">
//                     <h4>
//                       ${userData?.totalIncome || 0} USDT
//                     </h4>
//                     <small>Total Available Balance</small>
//                   </div>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <div className="row">

//                   {/* AMOUNT */}
//                   <div className="col-lg-12 mb-3">
//                     <label>Enter Amount (USDT)</label>
//                     <div className="input-group">
//                       <span className="input-group-text">
//                         <img src="/img/USDC-logo.png" width="25" />
//                       </span>

//                       <input
//                         type="number"
//                         className="form-control"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                         placeholder="Min 101 USD"
//                       />
//                     </div>
//                   </div>

//                   {/* WALLET */}
//                   <div className="col-lg-12 mb-3">
//                     <label>Wallet Address</label>

//                     <div className="input-group">
//                       <span className="input-group-text">
//                         <img
//                           src="/img/coin/solana-logo.webp"
//                           width="27"
//                         />
//                       </span>

//                       <input
//                         type="text"
//                         className="form-control"
//                         value={userData?.wallet || ""}
//                         readOnly
//                       />
//                     </div>
//                   </div>

//                   {/* BUTTON */}
//                   <div className="col-lg-12">
//                     <button
//                       onClick={handleSubmit}
//                       className="btn btn-primary d-block"
//                       disabled={
//                         loading ||
//                         !userData ||
//                         Number(userData?.preLpp || 0) === 0
//                       }
//                     >
//                       {loading ? "Processing..." : "Approve Final LLP"}
//                     </button>
//                   </div>

//                   {/* OUTPUT */}
//                   <div className="col-lg-12">
//                     <div className="d-flex justify-content-between mt-2">
//                       <small>Expected Output:</small>
//                       <span className="text-warning">
//                         {userData?.totalIncome || 0} SOL
//                       </span>
//                     </div>

//                     <div className="d-flex justify-content-between mt-2">
//                       <small>Minimum Received:</small>
//                       <span className="text-success">
//                         {userData?.totalIncome || 0} SOL
//                       </span>
//                     </div>
//                   </div>

//                 </div>
//               </div>

//               {/* HISTORY */}
//               <div className="mt-3">
//                 <Link
//                   to="/LLPRewardHistory"
//                   className="btn d-block btn-outline-dark"
//                 >
//                   Final LLP Reward History
//                 </Link>
//               </div>

//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

// export default FinalLLP;



















import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserData, deposit } from "../../solana/program";

function FinalLLP() {

  const [userData, setUserData] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH USER DATA
  // =========================
  const fetchUser = async () => {
    try {
      const wallet = localStorage.getItem("wallet");
      if (!wallet) return;

      const data = await getUserData(wallet);
      console.log("USER DATA:", data);

      setUserData(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // =========================
  // SUBMIT FUNCTION (FINAL FIX)
  // =========================
  const handleSubmit = async () => {
    try {
      if (loading) return;

      if (!userData) {
        return alert("⏳ Loading user data...");
      }

      if (!amount) return alert("Enter amount");

      const amt = Number(amount);

      console.log("PRE VALUE:", userData?.preLpp);
      console.log("FINAL VALUE:", userData?.finalLpp);

      // ✅ PRE must be done
      if (Number(userData?.preLpp || 0) === 0) {
        return alert("❌ Complete PRE LLP first");
      }

      // ✅ FINAL range
    //   if (amt < 101 || amt > 5000) {
    //     return alert("❌ Final LPP: 101 - 5000");
    //   }


if (amt < 101) {
  return alert("❌ Final LPP minimum 101");
}

      setLoading(true);

      // 🚀 CALL CONTRACT
      const tx = await deposit(amt, true);

      // ✅ SUCCESS HANDLE
      if (tx === "success") {
        alert("✅ Final LLP Success (Already processed)");
      } else {
        alert("✅ Final LLP Success");
      }

      setAmount("");

      // 🔥 WAIT FOR BLOCKCHAIN UPDATE
      await new Promise((res) => setTimeout(res, 2000));

      await fetchUser();

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Final LLP failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main>
        <div className="container-fluid">
          <div className="SOL-page-title text-center">
            <span>Final LLP Program</span>
          </div>

          <div className="subNav mb-2">
            <ul>
              <li>
                <Link to="/preLLPReward">Pre LLP Program</Link>
              </li>
              <li>
                <Link to="/finalLLP" className="active">
                  Final LLP Program
                </Link>
              </li>
            </ul>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-12">

              <div className="row justify-content-center">
                <div className="col-md-6 col-6">
                  <div className="sol-point-box mb-2 mt-0">
                    <h4>${userData?.totalIncome || 0} USDT</h4>
                    <small>Total Available Balance</small>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">

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
                        placeholder="Min 101 USD"
                      />
                    </div>
                  </div>

                  <div className="col-lg-12 mb-3">
                    <label>Wallet Address</label>

                    <div className="input-group">
                      <span className="input-group-text">
                        <img src="/img/coin/solana-logo.webp" width="27" />
                      </span>

                      <input
                        type="text"
                        className="form-control"
                        value={userData?.wallet || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary d-block"
                    disabled={
  loading ||
  !userData ||
  Number(userData?.preLpp || 0) === 0
}
                    >
                      {loading ? "Processing..." : "Approve Final LLP"}
                    </button>
                  </div>

                  <div className="col-lg-12">
                    <div className="d-flex justify-content-between mt-2">
                      <small>Expected Output:</small>
                      <span className="text-warning">
                        {userData?.totalIncome || 0} SOL
                      </span>
                    </div>

                    <div className="d-flex justify-content-between mt-2">
                      <small>Minimum Received:</small>
                      <span className="text-success">
                        {userData?.totalIncome || 0} SOL
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              <div className="mt-3">
                <Link
                  to="/LLPRewardHistory"
                  className="btn d-block btn-outline-dark"
                >
                  Final LLP Reward History
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default FinalLLP;