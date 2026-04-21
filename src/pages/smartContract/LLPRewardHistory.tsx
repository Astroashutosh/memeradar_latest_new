// import React from 'react'

// function LLPRewardHistory() {
//   return (
//     <>
//    <main>
//     <div className="container-fluid">
//       <div className="SOL-page-title text-center"><span>New LLP Program</span></div>
//       <div className="subNav mb-2">
//           <ul>
//           <li><a href="pre-LLP-reward-history.html" className="active"> Pre LLP Program History</a></li>
//           <li><a href="final-LLP-reward-history.html"  >Final LLP Reward History</a></li>
//         </ul>
//       </div>

//       <div className="row justify-content-center">
//         <div className="col-md-8 col-lg-6 col-12">
          
//           <div className="fundBalance-table mt-3">
//             <ul>
              
//               <li>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div className="fundBalance-coin d-flex">
//                     <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} className="coinIcon"/>
//                     <div className="ms-2">
//                       #LLP00001
//                       <span className="llp-status-badge active"><i className="fa-solid fa-circle"></i>Active</span>
//                       <div className="small text-muted"><i className="fa-regular fa-calendar"></i> Friday, 04-10-2026 </div>
//                     </div>
//                   </div>
//                   <div className="text-end">
//                     <h4 className="m-0 text-success">100.00 USDT</h4>
//                     <small>Daily ROI: 0.7%</small>
//                   </div>
//                 </div>
//                 <div className="token-bonding-progress mt-2">
//                   <div className="token-bonding-head d-flex justify-content-between align-items-center">
//                     <span>$51.00</span>
//                     <span className="progress-bar__value">
//                       3.85%
//                     </span>
//                   </div>
//                   <div className="progress-bar__wrapper">
//                     <progress id="progress-bar" value="50" max="100"></progress>
//                   </div>
//                 </div>
//               </li>

//                <li>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div className="fundBalance-coin d-flex">
//                     <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} className="coinIcon"/>
//                     <div className="ms-2">
//                       #LLP00001
//                       <span className="llp-status-badge inactive"><i className="fa-solid fa-circle"></i>Inactive</span>
//                       <div className="small text-muted"><i className="fa-regular fa-calendar"></i> Friday, 04-10-2026 </div>
//                     </div>
//                   </div>
//                   <div className="text-end">
//                     <h4 className="m-0 text-success">100.00 USDT</h4>
//                     <small>Daily ROI: 0.7%</small>
//                   </div>
//                 </div>
//                 <div className="token-bonding-progress mt-2">
//                   <div className="token-bonding-head d-flex justify-content-between align-items-center">
//                     <span>$100.00</span>
//                     <span className="progress-bar__value">
//                       3.85%
//                     </span>
//                   </div>
//                   <div className="progress-bar__wrapper">
//                     <progress id="progress-bar" value="100" max="100"></progress>
//                   </div>
//                 </div>
//               </li>
//             </ul>
//           </div>

//            <div className="mt-3">
//             <a href="final-LLP-reward-history.html" className="btn d-block btn-outline-dark">New Investment Final LLP Program<i className="fa-regular fa-long-arrow-right ms-1"></i></a>
//           </div>

//         </div>
//       </div>
//     </div>
//   </main>




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
//     </div>
   
//    </>
//   )
// }

// export default LLPRewardHistory








import  { useState } from 'react'
import { useLocation } from 'react-router-dom'


function LLPRewardHistory() {
  const location = useLocation()
  const initialTab = location.state?.activeTab || 'pre'
  const [activeTab, setActiveTab] = useState(initialTab)
  const preLLPData = [
    {
      id: '#LLP00001',
      status: 'Active',
      statusClass: 'active',
      date: 'Friday, 04-10-2026',
      amount: '100.00 USDT',
      roi: '0.7%',
      earned: '$51.00',
      progressText: '3.85%',
      progressValue: 50,
    },
    {
      id: '#LLP00002',
      status: 'Inactive',
      statusClass: 'inactive',
      date: 'Friday, 04-10-2026',
      amount: '100.00 USDT',
      roi: '0.7%',
      earned: '$100.00',
      progressText: '100%',
      progressValue: 100,
    },
  ]

  const finalLLPData = [
    {
      id: '#FLLP00001',
      status: 'Active',
      statusClass: 'active',
      date: 'Monday, 14-10-2026',
      amount: '250.00 USDT',
      roi: '1.2%',
      earned: '$120.00',
      progressText: '48%',
      progressValue: 48,
    },
    {
      id: '#FLLP00002',
      status: 'Inactive',
      statusClass: 'inactive',
      date: 'Tuesday, 15-10-2026',
      amount: '500.00 USDT',
      roi: '1.5%',
      earned: '$500.00',
      progressText: '100%',
      progressValue: 100,
    },
  ]

  const currentData = activeTab === 'pre' ? preLLPData : finalLLPData

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
                  className={activeTab === 'pre' ? 'active' : ''}
                  onClick={() => setActiveTab('pre')}
                >
                  Pre LLP Program History
                </a>
              </li>
              <li>
                <a
                  type="button"
                  className={activeTab === 'final' ? 'active' : ''}
                  onClick={() => setActiveTab('final')}
                >
                  Final LLP Reward History
                </a>
              </li>
            </ul>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-12">
              <div className="fundBalance-table mt-3">
                <ul>
                  {currentData.map((item, index) => (
                    <li key={index}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="fundBalance-coin d-flex">
                          <img src="/img/usdt-icon.png" className="coinIcon" alt="coin" />
                          <div className="ms-2">
                            {item.id}
                            <span className={`llp-status-badge ${item.statusClass}`}>
                              <i className="fa-solid fa-circle"></i>
                              {item.status}
                            </span>
                            <div className="small text-muted">
                              <i className="fa-regular fa-calendar"></i> {item.date}
                            </div>
                          </div>
                        </div>

                        <div className="text-end">
                          <h4 className="m-0 text-success">{item.amount}</h4>
                          <small>Daily ROI: {item.roi}</small>
                        </div>
                      </div>

                      <div className="token-bonding-progress mt-2">
                        <div className="token-bonding-head d-flex justify-content-between align-items-center">
                          <span>{item.earned}</span>
                          <span className="progress-bar__value">{item.progressText}</span>
                        </div>
                        <div className="progress-bar__wrapper">
                          <progress value={item.progressValue} max="100"></progress>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* <div className="mt-3">
                <button className="btn d-block btn-outline-dark w-100">
                  {activeTab === 'pre'
                    ? 'New Investment Pre LLP Program'
                    : 'New Investment Final LLP Program'}
                  <i className="fa-regular fa-long-arrow-right ms-1"></i>
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </main>

      <div className="modal fade" id="success-msg">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <span className="modalWindow-close" data-bs-dismiss="modal" aria-label="Close"></span>
            <div className="modal-body text-center">
              <div className="sec-divider top"></div>
              <div className="sec-divider bottom"></div>
              <img
                src="/img/animated-check.gif"
                width="100"
                className="rounded-circle mb-2"
                alt="success"
              />
              <h3>XP Points Converted</h3>
              <p>
                Your request has been submitted successfully. Kindly wait while it is being
                reviewed and approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LLPRewardHistory
