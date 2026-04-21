import { useState, useEffect } from 'react';
import { useWallet } from "../../../solana/context/WalletContext";
import { packages, getUserData, shorten, getSponsorDetails } from "../../../solana/program";
import type { UserData } from "../../../solana/types";
import { shareContent, copyToClipboard } from "../../../utils/helpers"
import { Link } from 'react-router-dom';
// // import UpgradeModal  from "../../modal/UpgradeModal"
// import { upgradePackage, checkUserRegistered } from "../../../solana/program";
// import { notifySuccess, notifyError } from "../../../solana/context/Notifications";

interface SidebarProps {
  onUpgradeClick: (pkg: any) => void;
}

function Sidebar({ onUpgradeClick }: SidebarProps) {
  const { wallet } = useWallet();
  const [userData, setUserData] = useState<UserData | null>(null);
// const [sponsorData, setSponsorData] = useState<any>(null);
const [sponsorData, setSponsorData] = useState<{
  sponsor?: string;
  sponsor_id?: string;
} | null>(null);
  useEffect(() => {
    const loadUser = async () => {
      if (!wallet) return;
      const data = await getUserData(wallet);
      if (data) {
        setUserData(data);
      }
    };

    loadUser();

  }, [wallet]);


  useEffect(() => {
  const loadSponsor = async () => {
    if (!wallet) return;

    const res = await getSponsorDetails(wallet);
// console.log("Sponsor detail :",res);
    if (res?.status) {
      setSponsorData(res);
    }
  };

  loadSponsor();
}, [wallet]);


  const nextPackage = packages.find(
    (p) => p.id === (userData?.currentPackage ?? 0) + 1
  );
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";
  const referralLink = wallet ? `${baseUrl}/${shorten(wallet)}` : "";
  const referralLinkCopy = wallet ? `${baseUrl}/${wallet}` : "";
  return (
    <>

      <div className="col-lg-3 d-none d-lg-none d-xl-inline">



{/* new code  start*/}

  <div className="style-wrapper mb-3 bg-gradient-violet text-center">
           <h4> New LLP Program </h4>
            <div className="row">
              <div className="col-sm-6 mt-2">
                <Link to="/LLPReward" state={{ activeTab: "pre" }} className="btn btn-primary bg-gradient-golden  d-block">
                  Start<i className="fa-regular fa-arrow-right ms-1"></i>
                </Link>
              </div>
              <div className="col-sm-6 mt-2">
                <Link to="/LLPReward" state={{ activeTab: "final" }} className="btn btn-primary d-block">
                  Upgrade<i className="fa-regular fa-arrow-right ms-1"></i>
                </Link>

              </div>
            </div>



          </div>
          <div className="style-wrapper mb-3">
            <div className="row">
              <div className="col-lg-8 pe-0 col-7">
                <div className="newcoinpump-item-trading SOLnewcoin">
                  <div className="newcoinpump-item-trading-thumbs">
                    <img src={`${import.meta.env.BASE_URL}img/logo/logo-w.png`}/>
                  </div>
                  <div className="newcoinpump-item-trading-details">
                    <div className="newcoinpump-item-trading-head">
                      <div className="newcoinTradeTitle">MemeRadar</div>
                      <div className="coinTradeName"> SOL Network</div>
                    </div>
                    <div className="newcoinpump-wallet-address">
                      <a href="#!" title="Wallet Address">0x5F0...e24c</a>
                      <a href="#!"><i className="fa-regular fa-copy ms-1"></i></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ps-0 col-5">
                <div className="coinpump-item-rate">
                  <h5>10.9393 SOL</h5>
                  <span className="text-success">$523.00</span>
                </div>
              </div>
            </div>
          </div>


{/* end new code */}



        <div className="style-wrapper mb-3">
          <div className="mb-2">
            <div className="coinpump-item-trading">
              <div className="coinpump-item-trading-thumbs">
                <img src={`${import.meta.env.BASE_URL}img/profile-img.jpg`} />
              </div>
              <div className="coinpump-item-trading-details">
                <div className="coinpump-item-trading-head">
                  <div className="coinTradeTitle">George William ⚡️🐑</div>
                  <small>{wallet ? shorten(wallet) : ""}
                    <a href="#!" onClick={(e) => {
                      e.preventDefault();
                      if (wallet) {
                        copyToClipboard(wallet, "Wallet Address copied");
                      }
                    }}><i className="fa-regular fa-copy ms-1"></i></a>
                  </small>
                </div>
                <div className="coinpump-wallet-address">
                  <span>DBO ID</span> {userData?.userId}
                </div>
              </div>
            </div>
          </div>

          <div className="rank-wrp mb-2">
            <div className="row d-flex justify-content-between align-items-center">
              <div className="col-sm-7 col-7 text-start">
                <small> Current Rank</small>
             
                <h4>{packages.find(p => p.id === userData?.currentPackage)?.name || "DBO"} </h4>
              </div>
              <div className="col-sm-5 col-5 text-end">
                <Link to="/certificate" className="btn btn-primary btn-sm bg-gradient-golden">
                  <i className="fa-regular fa-download me-1"></i>Certificate
                </Link>
              </div>
            </div>

            <div className="skStyle-wrapper">
              <div className="row">
                <div className="col-sm-6 col-6 text-center">
                  <div style={{ paddingTop: "3px" }}> <img src={`${import.meta.env.BASE_URL}img/target.png`} width="15" className="me-1" />Next Goal
                    <i className="fa fa-long-arrow-right bounceRight float-end mt-1"></i>
                  </div>
                </div>
                <div className="col-sm-6  col-6 skstyle"> {nextPackage ? nextPackage.name : "Max Rank Achieved"} </div>
              </div>
            </div>
            {/* {nextPackage && (
              <a
                href="#!"
                className="upgrade_Btn main-div2 mt-1"
                data-bs-toggle="modal"
                data-bs-target="#paymentConfirm"
                onClick={(e) => { e.preventDefault(); onUpgradeClick(nextPackage) }}
              >
                Upgrade Now
              </a>
            )} */}
          </div>

          <div className="section-head mb-1">
            <div className="section-title"> Referral Link</div>
          </div>
          <div className="item-style-box d-flex justify-content-between align-items-center mb-2">
            <small> <img src={`${import.meta.env.BASE_URL}img/social-icon/web.png`} width="20"
              className="me-1 align-bottom" />{referralLink} </small>
            <span> <a href="#!" className="btn btn-outline-dark btn-sm" title="Copy"
              onClick={(e) => {
                e.preventDefault();
                copyToClipboard(referralLinkCopy, "Referral link copied");
              }}>
              <i className="fa-light fa-copy"></i></a>
              <a href="#!" onClick={shareContent} className="btn btn-outline-dark btn-sm" title="Share"><i
                className="fa-light fa-share"></i></a></span>
          </div>

          {/* <div className="section-head mb-1">
            <div className="section-title"> Social Media</div>
          </div> */}


          {/* <div className="item-style-box mb-2">
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-8 col-8">
                <div className="social-account-connect">
                  <div className="social-account-icon">
                    <i className="fa-brands fa-x-twitter"></i>
                  </div>
                  <div className="head">@GeorgeWilliam</div>
                  <div className="account-handle">2523 Followers</div>
                </div>
              </div>
              <div className="col-lg-4 col-4 text-end">
                <a href="javascript:void();" id="x-connect-btn" className="btn btn-outline-dark btn-sm"> Connected</a>
              </div>
            </div>
          </div> */}
          <div className="section-head mb-1">
            <div className="section-title"> Platform Fee</div>
          </div>
          <div className="item-style-box d-flex justify-content-between align-items-center mb-0">
            <span><i className="fa-regular fa-tag me-1"></i>Welcome Offer </span>
            <span className="text-success"> <span className="text-decoration-line-through text-white"><i
              className="fa-regular fa-usd me-1"></i>5.00</span> Free </span>
          </div>

 <div className="section-head mb-1">
            <div className="section-title">My Sponsor</div>
          </div>
          <div className="item-style-box d-flex justify-content-between align-items-center mb-0">
            <span><i className="fa-regular fa-tag me-1"></i>   {sponsorData?.sponsor
      ? shorten(sponsorData.sponsor)
      : "Not Assigned"}</span>
            <span className="text-success"> {sponsorData?.sponsor_id ?? "-"}</span>  
          </div>


        </div >
      </div >
    </>
  )
}

export default Sidebar