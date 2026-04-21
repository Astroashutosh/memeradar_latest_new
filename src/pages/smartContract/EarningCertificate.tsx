import { useEffect, useRef, useState } from "react";
import usePageCSS from "../../hooks/usePageCSS";
import { useWallet } from "../../solana/context/WalletContext";
import { getUserData, packages, getTotalAndTodayIncome } from "../../solana/program";
import Loader from "../../utils/Loader";
 
function EarningCertificate() {
  usePageCSS("assets/earningCertificate.css");
 
  const { wallet } = useWallet();
  const certRef = useRef<HTMLDivElement>(null);
 
  const [userData, setUserData] = useState<any>(null);
  const [totalEarning, setTotalEarning] = useState(0);
  const [loading, setLoading] = useState(true);
 
  // ✅ Load user data
  useEffect(() => {
    const load = async () => {
      if (!wallet) return;
 
      try {
        const [user, earning] = await Promise.all([
          getUserData(wallet),
          getTotalAndTodayIncome(wallet)
        ]);
        setUserData(user);
        setTotalEarning(earning.total); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // ✅ loader off
      }
    };
 
    load();
  }, [wallet]);
 
  // ✅ Auto print after load
  useEffect(() => {
    if (!userData) return;
 
    const timer = setTimeout(() => {
      window.print(); // 🔥 print trigger
    }, 500);
 
    return () => clearTimeout(timer);
  }, [userData]);
 
  // ✅ Dynamic values
  const userName = "DBO";
  const rank =
  packages.find(p => p.id === userData?.currentPackage)?.name || "DBO";
  const earning = Number(totalEarning).toFixed(4);
 
  const todayDate = new Date().toLocaleDateString("en-GB");
 
  // ✅ Loader
  if (loading) {
    return <Loader />;
  }
 
  return (
    <>
      <div ref={certRef} className="rank-certificate-wrapper">
        <img
          src={`${import.meta.env.BASE_URL}img/certificate/certificate-earning-bg.jpg`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
 
        <div className="rank-name">{userName}</div>
 
        <div className="rank-achieved-text">{rank}</div>
 
        <div className="earning-text">{earning} SOL</div>
 
        <div className="rank-achieved-date">
          Date: {todayDate}
        </div>
      </div>
    </>
  );
}
 
export default EarningCertificate;