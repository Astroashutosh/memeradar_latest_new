import { useState, useEffect } from 'react'
import Sidebar from '../../components/layout/smartContract/Sidebar'
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import { useWallet } from "../../solana/context/WalletContext";
import { getUserData, getReports } from "../../solana/program";
import UpgradeModal from "../../components/modal/UpgradeModal";
import { useUpgrade } from '../../solana/context/UpgradeContext';
import { copyToClipboard } from '../../utils/helpers';

function MatchingBonus() {
  const { wallet } = useWallet();
  const [selectedPackage] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const { handleUpgrade, upgrading } = useUpgrade();
  // const handleOpenUpgrade = (pkg: any) => {
  //   setSelectedPackage(pkg);
  // };

  useEffect(() => {
    const load = async () => {
      if (!wallet) return;

      const data = await getUserData(wallet);
      // console.log(data);
      if (data) setUserData(data);

      const reports = await getReports(wallet, "matching");

      if ($.fn.DataTable.isDataTable('#example')) {
        ($('#example') as any).DataTable().destroy();
      }

      setTimeout(() => {
        ($('#example') as any).DataTable({
          data: reports,
          columns: [
            {
              data: "package",
              render: (pkg: number) => `Level ${pkg}`
            },
            // {
            //   data: "from",
            //   render: (val: string) =>
            //     val ? val.slice(0, 4) + "..." + val.slice(-4) : "-"
            // },
            {
              data: "from",
              render: (val: string) => {
                if (!val) return "-";

                const short = val.slice(0, 4) + "..." + val.slice(-4);

                return `
                <span class="nowrap">${short}
                  <a href="#" class="ms-2 copy-btn" data-address="${val}">
                    <i class="bi bi-copy"></i>
                  </a>
                  <a href="https://solscan.io/account/${val}?cluster=devnet" target="_blank" class="ms-2">
                    <i class="bi bi-box-arrow-up-right"></i>
                  </a>
                </span>
              `;
              }
            },
            {
              data: "amount",
              render: (amt: number) =>
                `${Number(amt || 0).toFixed(2)} SOL`
            },
            {
              data: "timestamp",
              render: (t: number) =>
                new Date(t * 1000).toLocaleString()
            },
            {
              data: "timestamp",
              render: (t: number) =>
                new Date(t * 1000).toLocaleString()
            }
          ],
          lengthMenu: [
            [10, 30, 50, 100, 200, -1],
            [10, 30, 50, 100, 200, "All"]
          ],
          pageLength: 10,
          destroy: true
        });
        $('#example').off('click', '.copy-btn').on('click', '.copy-btn', function (e) {
          e.preventDefault();
          const addr = $(this).data('address');
          copyToClipboard(addr, "Address copied");
        });
      }, 100);
    };

    load();

    return () => {
      if ($.fn.DataTable.isDataTable('#example')) {
        ($('#example') as any).DataTable().destroy();
      }
    };
  }, [wallet]);



  // const handleUpgrade = async () => {
  //   if (!wallet) return;
  //   if (!selectedPackage) {
  //     notifyError("Select package first");
  //     return;
  //   }

  //   try {
  //     const registered = await checkUserRegistered(wallet);
  //     console.log("registered", registered);
  //     if (registered) {
  //       await upgradePackage(wallet, selectedPackage.id);
  //       notifySuccess("Package upgraded successfully");
  //     }

  //   } catch (err: any) {
  //     console.error(err);
  //     notifyError(err.message || "Upgrade failed");
  //   }

  // };




  return (
    <>
      <main>
        <div className="container-fluid">
          <div className="row">

            <Sidebar />

            <div className="col-lg-12 col-xl-9">
              <div className="SOL-page-title text-center">
                <span> Team Matching Bonus</span>
              </div>

              <div className="row justify-content-center mb-3">
                <div className="col-md-4 col-lg-4 col-12">
                  <div className="meme-earning-wrapper">
                    <div className="meme-earning-tab">
                      <img src={`${import.meta.env.BASE_URL}img/solana-icon.png`} className="me-1" />
                      Total Income: {userData?.directIncome ?? 0} SOL
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive table-style">
                <table className="table" id="example">
                  <thead>
                    <tr>
                      <th>Rank Name</th>
                      <th>Matching Pair</th>
                      <th>Matching Bonus</th>
                      <th>Date</th>
                      <th>Release Date</th>
                    </tr>
                  </thead>
                </table>
              </div>

            </div>

          </div>
        </div>
      </main>
      {/* <UpgradeModal
        selectedPackage={selectedPackage}
        onUpgrade={handleUpgrade}
      /> */}
      <UpgradeModal
        selectedPackage={selectedPackage}
        onUpgrade={() =>
          handleUpgrade(wallet, selectedPackage, () => {
            // 🔥 optional refresh
            window.location.reload();
          })
        }
        upgrading={upgrading}
      />
      {/* Modal */}
      <div className="modal fade bd-example-modal-lg" id="paydetails" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">

            <footer>
              MemeRadar © 2026. All Rights Reserved.
            </footer>

            <div className="sec-divider top"></div>
            <div className="sec-divider bottom"></div>

            {/* Modal body same */}

          </div>
        </div>
      </div>


    </>
  )
}

export default MatchingBonus