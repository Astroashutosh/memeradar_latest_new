import { useState, useEffect } from 'react';
import Loader from '../../utils/Loader';
import Header from '../../components/layout/smartContract/Header'
import Sidebar from '../../components/layout/smartContract/Sidebar'
import JoiningSlider from '../../components/dashboard/JoiningSlider'
import { useWallet } from "../../solana/context/WalletContext";
import { useUpgrade } from '../../solana/context/UpgradeContext';

// import { useLegacyCountdown } from "../../utils/helpers";
import { notifySuccess, notifyError } from "../../solana/context/Notifications";
import {  getUserData,claimMatchingBonus, getLevelPartners, getTotalAndTodayIncome, getIncomeBreakdown } from "../../solana/program";
import UpgradeModal from "../../components/modal/UpgradeModal";
import { Link } from 'react-router-dom';
function SmartContract() {
  const { wallet } = useWallet();
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userPackage, setUserPackage] = useState<number>(0);
  // const { countdown, countdown1 } = useLegacyCountdown();
  // const [upgrading, setUpgrading] = useState(false);
const [networkCount, setNetworkCount] = useState(0);
const { handleUpgrade, upgrading } = useUpgrade();
// const [showClaimModal, setShowClaimModal] = useState(false);
// const [loading, setLoading] = useState(false);
const [totalEarning, setTotalEarning] = useState(0);
const [todayEarning, setTodayEarning] = useState(0);
const [lapsIncome, setLapsIncome] = useState(0);
const [incomeData, setIncomeData] = useState({
  sponsor: { total: 0, today: 0 },
  direct: { total: 0, today: 0 },
  pool: { total: 0, today: 0 },
  level: { total: 0, today: 0 },
  matching: { total: 0, today: 0 },
  silver: { total: 0, today: 0 },
});

useEffect(() => {
  if (!wallet) return;
 
  const loadAllData = async () => {
    setLoading(true);
 
    try {
      const [
        user,
        levels,
        incomeRes,
        earningRes
      ] = await Promise.all([
        getUserData(wallet),
        getLevelPartners(wallet, 10),
        getIncomeBreakdown(wallet),
        getTotalAndTodayIncome(wallet)
      ]);
      console.log("earningRes",earningRes);
      // ✅ user data
      if (user) {
        setUserData(user);
        setUserPackage(user.currentPackage);
      }
 
      // ✅ network
      setNetworkCount(levels.flat().length);
 
      // ✅ income
      setIncomeData(incomeRes);
      setTotalEarning(earningRes.total);
      setTodayEarning(earningRes.today);
      setLapsIncome(earningRes.lapsTotal);
 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  loadAllData();
}, [wallet]);
 
  // const handleSelectPackage = (pkg: any) => {
  //   if (userPackage >= pkg.id) {
  //     notifyError("Package already active");
  //     return;
  //   }
  //   setSelectedPackage(pkg);
  // };
 

useEffect(() => {
  const loadUser = async () => {
    if (!wallet) return;

    setLoading(true);

    try {
      const user = await getUserData(wallet);
      console.log('user',user);
      if (user) {
        setUserData(user);
        setUserPackage(user.currentPackage);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadNetwork = async () => {
    if (!wallet) return;

    try {
      const levels = await getLevelPartners(wallet, 10);
      const total = levels.flat().length;
      setNetworkCount(total);
    } catch (err) {
      console.error(err);
    }
  };

  loadUser();
  loadNetwork();
}, [wallet]);

  // const handleOpenUpgrade = (pkg: any) => {
  //   setSelectedPackage(pkg);
  // };

const handleClaimMatching = async () => {
  if (!wallet) return;


  try {


   await claimMatchingBonus(wallet);

    notifySuccess("Matching bonus claimed successfully");


    const updated = await getUserData(wallet);
    setUserData(updated);

 } catch (err: any) {
  console.error("Full Error:", err);

  let errorMsg = "Claim failed";

  if (err?.error?.errorMessage) {
    errorMsg = err.error.errorMessage;
  }

  else if (err?.error?.errorCode?.code) {
    errorMsg = err.error.errorCode.code;
  }

  else if (err?.logs) {
    const log = err.logs.find((l: string) =>
      l.includes("Error Message")
    );

    if (log) {
      errorMsg = log.split("Error Message: ")[1];
    }
  }

  else if (err?.message) {
    errorMsg = err.message;
  }

  notifyError(errorMsg);
}
  //  finally {
  //   setLoading(false);
  //   setShowClaimModal(false);
  // }
};


  return (
    <>
           {loading && <Loader />}

      <Header />
      <main>
        <div className="container-fluid mb-3">

          <JoiningSlider />
 
          <div className="row">


            <Sidebar />
            <div className="col-lg-12 col-xl-6 order-md-3 order-xl-2 ">

              <div className="row">

     <div className="col-md-6 col-lg-6 mb-3">
                  <Link to="/sponsorBonus" className="stats-box">
                    <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} />
                    </div>
                    <h2 className="title">LPP Program Reward</h2>
                    <h3><span className="partnerSponsorBonus">{userData?.sponsorIncome ?? 0} </span> SOL</h3>
                  </Link>
                </div>

                       <div className="col-md-6 col-lg-6 mb-3">
              <a href="Power-Multiplier.html" className="stats-box">
                
                <h2 className="title">Power Multiplier </h2>
                <div className="earningPower">
                  <span className="earning-option active">
                    <span className="earning-check"><i className="bi bi-check-lg"></i></span>
                    <span className="earning-value">5X</span>
                  </span>
                  <span className="earning-option">
                    <span className="earning-check"></span>
                    <span className="earning-value">20X</span>
                  </span>
                  <span className="earning-option">
                    <span className="earning-check"></span>
                    <span className="earning-value">30X</span>
                  </span>
                  <span className="earning-option">
                    <span className="earning-check"></span>
                    <span className="earning-value">50X</span>
                  </span>
                </div>
              </a>
            </div>


                <div className="col-md-6 col-lg-6 mb-3">
                  <Link to="/sponsorBonus" className="stats-box">
                    <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} />
                    </div>
                    <h2 className="title">Direct Kick Bonus</h2>
                    <h3><span className="partnerSponsorBonus">{userData?.sponsorIncome ?? 0} </span> </h3>
                  </Link>
                </div>
                <div className="col-md-6 col-lg-6 mb-3">
                  <Link to="/directBonus" className="stats-box">
                    <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} />
                    </div>
                    <h2 className="title">Team Starter Bonus</h2>
                    <h3><span className="partnerSponsorBonus">{userData?.directIncome ?? 0} </span> </h3>
                  </Link>
                </div>
             

                <div className="col-md-6 col-lg-6 mb-3">
                  <Link to="/levelBonus" className="stats-box">
                    <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} />
                    </div>
                    <h2 className="title">Down Ladder Bonus</h2>
                    <h3><span className="partnerSponsorBonus">{userData?.levelIncome ?? 0} </span> </h3>
                  </Link>
                </div>

                <div className="col-md-6 col-lg-6 mb-3">
                  <div className="stats-box">
                    <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} />
                    </div>
                    <h2 className="title">Up Ladder Bonus</h2>
                    <Link to="/matchingBonus">
                      <h3><span className="partnerSponsorBonus">{userData?.matchingIncome ?? 0} </span> </h3>
                    </Link>

                  </div>
                </div>
                <div className="col-md-6 col-lg-6 mb-3">
                  <div className="stats-box">
                    <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} />
                    </div>
                    <h2 className="title">Leadership Bonus</h2>
                    <Link to="/globalPoolBonus">
                      <h3><span className="partnerSponsorBonus">{userData?.silverBonus ?? 0} </span> </h3>
                    </Link>

                  </div>
                </div>

   <div className="col-md-6 col-lg-6 mb-3">
                  <Link to="/poolBonus" className="stats-box">
                    <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} />
                    </div>
                    <h2 className="title">Boss Reward</h2>
                    <h3><span className="partnerSponsorBonus">{userData?.poolIncome ?? 0} </span> SOL</h3>
                  </Link>
                </div>

   <div className="col-md-6 col-lg-6 mb-3">
                  <Link to="/poolBonus" className="stats-box">
                    <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} />
                    </div>
                    <h2 className="title">Meme Pool Reward</h2>
                    <h3><span className="partnerSponsorBonus">{userData?.poolIncome ?? 0} </span> </h3>
                  </Link>
                </div>

   <div className="col-md-6 col-lg-6 mb-3">
                  <Link to="/poolBonus" className="stats-box">
                    <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/usdt-icon.png`} />
                    </div>
                    <h2 className="title">Big Wish Reward</h2>
                    <h3><span className="partnerSponsorBonus">{userData?.poolIncome ?? 0} </span> </h3>
                  </Link>
                </div>


                <div className="col-md-6 col-lg-6  col-6 mb-3">
                  <Link to="/networkTeam" className="stats-box">
 <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/network-team.png`} />
                    </div>
                    <h2 className="title">Network Team</h2>
                    <h3><span className="partnerSponsorBonus">
                      {/* {userData?.totalMatrixTeam ?? 0} */}
                      {networkCount}
                      </span></h3>
                  </Link>
                </div>
                <div className="col-md-6 col-lg-6  col-6 mb-3">
                  <Link to="/directTeam" className="stats-box">
 <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/direct-team.png`} />
                    </div>
                    <h2 className="title">Direct Team</h2>
                    <h3><span className="partnerSponsorBonus">{userData?.partnerCount ?? 0}</span></h3>
                  </Link>
                </div>
                <div className="col-md-6 col-lg-6 mb-3">
                  <Link to="/rewardboard" className="stats-box">
                    <div className="stats-icon">
                      <img src={`${import.meta.env.BASE_URL}img/xp-point.png`} />
                    </div>
                    <h2 className="title">Total XP Points</h2>
                    <h3><span className="partnerSponsorBonus">{userData?.xpPoints ?? 0}</span></h3>
                  </Link>
                </div>

                <div className="col-md-6 col-lg-6 mb-3">
                  <Link to="/lostIncome">
                    <div className="stats-box bg-gradient-violet" style={{ lineHeight: "0.3" }}>
                      <div className="stats-icon">
                        <img src={`${import.meta.env.BASE_URL}img/solana-icon.png`} />
                      </div>
                      <h2 className="title mb-0 fxs-small" style={{ opacity: "initial" }}><i
                        className="bi bi-exclamation-triangle-fill"></i>
                        Total Lost
                        Bonus </h2>
                      {/* <h3 className="totallapsIncome">{userData?.lapsIncome ?? 0} SOL</h3> */}
                      <h3 className="totallapsIncome">{lapsIncome.toFixed(4)} SOL</h3>
                      <div style={{ fontSize: "10px", marginTop: "5px" }}>Take action now to keep your bonus!</div>
                    </div>
                  </Link>
                </div>
                {/* <div className="col-md-6 col-lg-6 mb-3">
                  <Link to="/mpLostDetails">
                    <div className="stats-box bg-gradient-green" style={{ lineHeight: "0.3" }}>
                      <div className="row">
                        <div className="col-lg-6 col-6">
                          <h2 className="title mb-0 fxs-small" style={{ opacity: "initial" }}><i
                            className="bi bi-exclamation-triangle-fill"></i> Total Lost Left MP</h2>
                          <h3 className="totallapsIncome">{userData?.lostLeft ?? 0}</h3>
                        </div>
                        <div className="col-lg-6 col-6 text-end">
                          <h2 className="title mb-0 fxs-small" style={{ opacity: "initial" }}><i
                            className="bi bi-exclamation-triangle-fill"></i> Total Lost Right MP</h2>
                          <h3 className="totallapsIncome">{userData?.lostRight ?? 0}</h3>
                        </div>
                      </div>
                      <div style={{ fontSize: "10px", marginTop: "5px" }}>Take action now to keep your Matching Bonus!</div>
                    </div>
                  </Link>
                </div> */}



              </div>
            </div>
            <div className="col-lg-6 col-xl-3 col-md-6 order-lg-2 order-md-2">
              <div className="row">
                <div className="col-lg-12 mb-3">
                  <div className="border-box-style mt-4">
                    <div className="border-box-style-body earning_details">
                      <div className="sol_earning_amount mb-2">
                        <h4> {totalEarning.toFixed(4)} SOL </h4>
                        <small> Total Earning</small>
                      </div>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="text-start">LPP Program Reward </td>
                            <td className="">{incomeData.sponsor.total.toFixed(4)} SOL</td>
                          </tr>
                          <tr>
                            <td className="text-start">Power Multiplier</td>
                            <td className="">{incomeData.direct.total.toFixed(4)} SOL </td>
                          </tr>
                          <tr>
                            <td className="text-start">Direct Kick Bonus</td>
                            <td className="">{incomeData.pool.total.toFixed(4)} SOL</td>
                          </tr>
                          <tr>
                            <td className="text-start">Team Starter Bonus </td>
                            <td className=""> {incomeData.matching.total.toFixed(4)} SOL</td>
                          </tr>
                          <tr>
                            <td className="text-start">Down Ladder Bonus</td>
                            <td className="">{incomeData.level.total.toFixed(4)} SOL</td>
                          </tr>
                          <tr>
                            <td className="text-start">Up Ladder Bonus </td>
                            <td className="">{incomeData.silver.total.toFixed(4)} SOL</td>
                          </tr>

 <tr>
                        <td className="text-start">Leadership Bonus </td>
                        <td className="">$0.1425</td>
                      </tr>

                      <tr>
                        <td className="text-start">Boss Reward </td>
                        <td className="">$1.0012</td>
                      </tr>
                      <tr>
                        <td className="text-start">Meme-Pool Reward </td>
                        <td className="">$0.1242</td>
                      </tr>
                      <tr>
                        <td className="text-start">Big Wish Reward </td>
                        <td className="">$0.3452</td>
                      </tr>

                        </tbody>
                      </table>
                      <Link to="/earningCertificate" target="_blank" className="btn btn-primary btn-sm rounded">
                        <i className="fa-regular fa-download me-1"></i>Download Certificate
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="border-box-style mt-3 bg-gradient-blue">
                    <div className="border-box-style-body earning_details">
                      <div className="sol_earning_amount mb-2 bg-gradient-golden">
                        <h4>{todayEarning.toFixed(4)} SOL</h4>
                        <small> Today Earning</small>
                      </div>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td className="text-start">LPP Program Reward </td>
                            <td className="">{incomeData.sponsor.today.toFixed(4)} SOL</td>
                          </tr>
                          <tr>
                            <td className="text-start">Power Multiplier</td>
                            <td className="">{incomeData.direct.today.toFixed(4)} SOL</td>
                          </tr>
                          <tr>
                            <td className="text-start">Direct Kick Bonus</td>
                            <td className="">{incomeData.pool.today.toFixed(4)} SOL</td>
                          </tr>
                          <tr>
                            <td className="text-start">Team Starter Bonus</td>
                            <td className="">{incomeData.matching.today.toFixed(4)} SOL</td>
                          </tr>
                          <tr>
                            <td className="text-start">Down Ladder Bonus</td>
                            <td className="">{incomeData.level.today.toFixed(4)} SOL</td>
                          </tr>
                          <tr>
                            <td className="text-start">Up Ladder Bonus </td>
                            <td className="">{incomeData.silver.today.toFixed(4)} SOL</td>
                          </tr>

 <tr>
                        <td className="text-start">Leadership Bonus </td>
                        <td className="">$0.1425</td>
                      </tr>

                      <tr>
                        <td className="text-start">Boss Reward </td>
                        <td className="">$1.0012</td>
                      </tr>
                      <tr>
                        <td className="text-start">Meme-Pool Reward </td>
                        <td className="">$0.1242</td>
                      </tr>
                      <tr>
                        <td className="text-start">Big Wish Reward </td>
                        <td className="">$0.3452</td>
                      </tr>


                        </tbody>
                      </table>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>




{/* new section start */}

  <div className="addresses-verification">
        <div className="addresses-verification-card">
          <div className="addresses-verification-inner">
            <div className="addresses-verification-head">
              <h3><i className="fa-solid fa-bullhorn"></i>Important Addresses &amp; Verification</h3>
              <p>For full transparency and verification, please find the official details of the MemeRadar Project
                below.</p>
            </div>

            <div className="row address-grid">
              <div className="col-lg-6">
                <div className="address-tile">
                  <div className="address-label"><i className="fa-solid fa-file-contract"></i>Coin Contract Address</div>
                  <div className="address-copy">
                    <div className="address-value">0x5722CE859D00D6C59354c0750263180fFdc8ab7f</div>
                    <div className="address-actions">
                      <a href="#!" className="address-action" aria-label="Copy contract address"><i
                          className="fa-regular fa-copy"></i></a>
                      <a href="#!" className="address-action open" aria-label="Open contract address"><i
                          className="fa-solid fa-up-right-from-square"></i></a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="address-tile">
                  <div className="address-label"><i className="fa-solid fa-wallet"></i>Payout Wallet Address</div>
                  <div className="address-copy">
                    <div className="address-value">0x5722CE859D00D6C59354c0750263180fFdc8ab7f</div>
                    <div className="address-actions">
                      <a href="#!" className="address-action" aria-label="Copy contract address"><i
                          className="fa-regular fa-copy"></i></a>
                      <a href="#!" className="address-action open" aria-label="Open contract address"><i
                          className="fa-solid fa-up-right-from-square"></i></a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="address-tile">
                  <div className="address-label"><i className="fa-solid fa-droplet"></i>Pancakeswap Liquidity Address</div>
                  <div className="address-copy">
                    <div className="address-value">0x5722CE859D00D6C59354c0750263180fFdc8ab7f</div>
                    <div className="address-actions">
                      <a href="#!" className="address-action" aria-label="Copy contract address"><i
                          className="fa-regular fa-copy"></i></a>
                      <a href="#!" className="address-action open" aria-label="Open contract address"><i
                          className="fa-solid fa-up-right-from-square"></i></a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="address-tile">
                  <div className="address-label"><i className="fa-solid fa-lock"></i>Liquidity Lock Hash</div>
                  <div className="address-copy">
                    <div className="address-value">0x5722CE859D00D6C59354c0750263180fFdc8ab7f</div>
                    <div className="address-actions">
                      <a href="#!" className="address-action" aria-label="Copy contract address"><i
                          className="fa-regular fa-copy"></i></a>
                      <a href="#!" className="address-action open" aria-label="Open contract address"><i
                          className="fa-solid fa-up-right-from-square"></i></a>
                    </div>
                  </div>
                </div>
              </div>


              <div className="col-lg-12">
                <div className="address-tile">
                  <div className="address-label"><i className="fa-solid fa-user-slash"></i>Ownership Renounced Hash</div>
                  <div className="address-copy">
                    <div className="address-value">0x5722CE859D00D6C59354c0750263180fFdc8ab7f</div>
                    <div className="address-actions">
                      <a href="#!" className="address-action" aria-label="Copy contract address"><i
                          className="fa-regular fa-copy"></i></a>
                      <a href="#!" className="address-action open" aria-label="Open contract address"><i
                          className="fa-solid fa-up-right-from-square"></i></a>
                    </div>
                  </div>
                </div>
              </div>



            </div>

            <div className="addresses-verification-footer">
              <p><i className="fa-solid fa-circle-check"></i>These are the official and verified addresses &amp; transaction
                details for transparency and trust.</p>
              <p>For any clarification, feel free to contact us anytime. MemeRadar Team</p>
            </div>
          </div>
        </div>
      </div>


{/* end new section */}


          <div className="row">
            <div className="col-sm-12 col-lg-3 col-xl-3 mt-3 mt-lg-0">
              <Link to="zoom-meeting.html" className="meeting-box">
                <div className="meetingContent">
                  <img src={`${import.meta.env.BASE_URL}img/zoom-meet-logo.png`} /> <br />
                  <span className="btn btn-warning btn-sm mt-2"><i className="fa-regular fa-eye me-1"></i>Upcoming Meetings </span>
                </div>
              </Link>
            </div>

            <div className="col-sm-12 col-lg-9 col-xl-9 text-center mt-3 mt-lg-0">
              <Link to="lucky-draw.html"> <img src={`${import.meta.env.BASE_URL}img/lucky-draw-status.gif`} className="rounded" /></Link>
            </div>

          </div>
        </div >

      </main >
      {/* <UpgradeModal
        selectedPackage={selectedPackage}
        onUpgrade={handleUpgrade}
         upgrading={upgrading} 
      /> */}

<UpgradeModal
  selectedPackage={selectedPackage}
  onUpgrade={() =>
    handleUpgrade(wallet, selectedPackage, () => {
      window.location.reload();
    })
  }
  upgrading={upgrading}
/>

      {/* <!--  Recovery Phrase--> */}
      <div className="modal fade" id="RecoveryPhrase" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <span className="modalWindow-close" data-bs-dismiss="modal" aria-label="Close"></span>
            <div className="modal-body text-center">
              <div className="sec-divider top"> </div>
              <div className="sec-divider bottom"> </div>
              <h3> Upgrade your package with <span className="text-warning">Platinum</span> & above and Unlock your wallet
                address Secret Recovery Phrase.</h3>
            </div>
          </div>
        </div>
      </div>


{/* claim now modal */}

 <div className="modal fade" id="claimConfirm" tabIndex={-1}>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">

      <span
        className="modalWindow-close"
        data-bs-dismiss="modal"
        aria-label="Close"
      ></span>

      <div className="modal-body text-center">
        <div className="sec-divider top"></div>
        <div className="sec-divider bottom"></div>

        {/* ICON */}
        <img
          src={`${import.meta.env.BASE_URL}img/usdt-icon.png`}
          width="80"
        />

        {/* BONUS AMOUNT */}
        {/* <div className="badgeStyle text-center mb-2">
          <h5>{userData?.nextBonus ?? 0} SOL</h5>
        </div> */}

        {/* TITLE */}
        <h3>
          Claim Your{" "}
          <span className="text-success">
            Matching Bonus
          </span>
        </h3>

        {/* DESCRIPTION */}
        <div className="fs-small mb-2">
          Are you sure you want to claim your matching bonus now?
        </div>

        {/* BUTTON */}
        <Link
          to="#"
          className="btn btn-primary ms-1"
          onClick={(e) => {
            e.preventDefault();
            handleClaimMatching();
          }}
        >
          Confirm Claim
          <i className="fa-regular fa-arrow-right ms-1"></i>
        </Link>

      </div>
    </div>
  </div>
</div>

    </>
  )
}

export default SmartContract
