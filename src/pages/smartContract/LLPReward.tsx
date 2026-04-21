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
              // <div className="col-lg-12">
              //   <a href="javascript:void();" data-bs-toggle="modal" data-bs-target="#success-msg"
              //     className="btn btn-primary d-block " id="ticketBtn">Approved USDT</a>
              // </div>

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
  // <div className="modal fade" id="success-msg" >
  //   <div className="modal-dialog modal-dialog-centered">
  //     <div className="modal-content">
  //       <span className="modalWindow-close" data-bs-dismiss="modal" aria-label="Close"></span>
  //       <div className="modal-body text-center">
  //         <div className="sec-divider top"> </div>
  //         <div className="sec-divider bottom"> </div>
  //         <img src="/img/animated-check.gif" width="100" className="rounded-circle mb-2"/>
  //         <h3>XP Points Converted</h3>
  //         <p> Your request has been submitted successfully. Kindly wait while it is being reviewed and approved.</p>
  //       </div>
  //     </div>
  //   </div>
  // </div> 
   
//    </>
//   )
// }

// export default PreLppReward

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

function LLPReward() {
  const location = useLocation()
  const initialTab = location.state?.activeTab || "pre"
  const [activeTab, setActiveTab] = useState(initialTab)


  const preData = {
    balance: "$4200.00 USDT",
    amountPlaceholder: "Min 10 USD",
    walletAddress: "0x4S32aPO3bb6FFcb417458561A5645F5446b0s85d",
    expectedOutput: "0.220 SOL",
    minimumReceived: "0.220 SOL",
    buttonText: "Approved USDT",
    historyRoute: "/LLPRewardHistory",
    historyText: "Pre LLP Reward History",
  }

  const finalData = {
    balance: "$8500.00 USDT",
    amountPlaceholder: "Min 50 USD",
    walletAddress: "0x8K92aPO3bb6FFcb417458561A5645F5446b0x99z",
    expectedOutput: "0.550 SOL",
    minimumReceived: "0.500 SOL",
    buttonText: "Approved Final LLP",
    historyRoute: "/LLPRewardHistory",
    historyText: "Final LLP Reward History",
  }

  const currentData = activeTab === "pre" ? preData : finalData

  return (
    <>
      <main>
        <div className="container-fluid">
          <div className="SOL-page-title text-center">
            <span>New LLP Program</span>
          </div>

          <div className="subNav mb-2">
            <ul>
              <li>
                <a
                  type="button"
                  className={activeTab === "pre" ? "active" : ""}
                  onClick={() => setActiveTab("pre")}
                >
                  Pre LLP Program
                </a>
              </li>
              <li>
                <a
                  type="button"
                  className={activeTab === "final" ? "active" : ""}
                  onClick={() => setActiveTab("final")}
                >
                  Final LLP Program
                </a>
              </li>
            </ul>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-12">
              <div className="row justify-content-center">
                <div className="col-md-6 col-lg-6 col-6">
                  <div className="sol-point-box mb-2 mt-0">
                    <h4>{currentData.balance}</h4>
                    <small>Total Available Balance</small>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <div className="row">
                  <div className="col-lg-12 mb-3">
                    <label>Enter Amount (USDT)</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <img src="/img/USDC-logo.png" width="25" alt="usdc" />
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={currentData.amountPlaceholder}
                      />
                    </div>
                  </div>

                  <div className="col-lg-12 mb-3">
                    <label>Wallet Address</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <img
                            src="/img/coin/solana-logo.webp"
                            className="rounded-circle"
                            width="27"
                            alt="solana"
                          />
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={currentData.walletAddress}
                        readOnly
                      />
                    </div>
                  </div>

             
    <div className="col-lg-12">
                <a href="javascript:void();" data-bs-toggle="modal" data-bs-target="#success-msg"
                  className="btn btn-primary d-block " id="ticketBtn">{currentData.buttonText}</a>
              </div>


                  <div className="col-lg-12">
                    <div className="item-style-box d-flex justify-content-between align-items-center mt-2">
                      <small>Expected Output:</small>
                      <span className="text-warning">{currentData.expectedOutput}</span>
                    </div>
                    <div className="item-style-box d-flex justify-content-between align-items-center mt-2">
                      <small>Minimum Received:</small>
                      <span className="text-success">{currentData.minimumReceived}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <Link to={currentData.historyRoute}  state={{ activeTab }} className="btn d-block btn-outline-dark">
                  {currentData.historyText}
                  <i className="fa-regular fa-long-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
  <div className="modal fade" id="success-msg" >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <span className="modalWindow-close" data-bs-dismiss="modal" aria-label="Close"></span>
        <div className="modal-body text-center">
          <div className="sec-divider top"> </div>
          <div className="sec-divider bottom"> </div>
          <img src="/img/animated-check.gif" width="100" className="rounded-circle mb-2"/>
          <h3>XP Points Converted</h3>
          <p> Your request has been submitted successfully. Kindly wait while it is being reviewed and approved.</p>
        </div>
      </div>
    </div>
  </div> 
    </>
  )
}

export default LLPReward
