import { useState, useEffect } from 'react'
import loadingImg from '/img/green-loading.gif';
import { useWallet } from "../../solana/context/WalletContext";
import { getLevelPartners, packages, shorten } from "../../solana/program";
import { copyToClipboard } from '../../utils/helpers';

function NetworkTeam() {
  const { wallet } = useWallet();
  const [levelPartners, setLevelPartners] = useState<any[][]>([]);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const loadLevels = async () => {
  //     if (!wallet) return;
  //     const levels = await getLevelPartners(wallet, 5);
  //     console.log(levels);
  //     setLevelPartners(levels);
  //   };

  //   loadLevels();
  // }, [wallet]);

useEffect(() => {
  const loadLevels = async () => {
    if (!wallet) return;

    setLoading(true);
    try {
      const levels = await getLevelPartners(wallet, 5);
      setLevelPartners(levels);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadLevels();
}, [wallet]);


  const users = levelPartners[selectedLevel - 1] || [];
  return (
    <>

      <main>
        <div className="container-fluid">
          <div className="row">

            <div className="col-lg-12 col-xl-12">
              <div className="SOL-page-title text-center"><span>My Network Team</span></div>
              <div className="row justify-content-between mb-3">
                <div className="col-lg-3 col-6">
                  <label>Select Level</label>
                  <select value={selectedLevel} onChange={(e) => setSelectedLevel(Number(e.target.value))}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-3 col-6 text-end"> Total DBO's: {users.length}
                </div>
              </div>
              <div className="table-responsive table-style">
                <table className="table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>DBO ID</th>
                      <th>Wallet Address</th>
                      <th>Registration Date</th>
                      <th>Package</th>
                      {/* <th>Level</th> */}
                    </tr>
                  </thead>
                  

                  <tbody>

                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center">
                          <img src={loadingImg} alt="Loading..." style={{ width: "50px" }} />
                          <div className="mt-2">Loading Network Team...</div>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center">No Users</td>
                      </tr>
                    ) : (
                      users.map((user: any, index: number) => (
                        <tr key={user.wallet}>
                          <td>{index + 1}</td>
                          <td>DBO</td>
                          <td>{user.id}</td>
                          <td className="nowrap">
                            {shorten(user.wallet)}
                            <a href="#!" className="ms-2" onClick={(e) => {
                              e.preventDefault();
                              copyToClipboard(user.wallet, "Address copied");
                            }}>
                              <i className="bi bi-copy"></i>
                            </a>
  
                            <a href={`https://solscan.io/account/${user.wallet}?cluster=devnet`} target="_blank" className="ms-2" >
                              <i className="bi bi-box-arrow-up-right"></i>
                            </a>
                          </td>
                          <td>
                            {user.joinedAt
                              ? new Date(user.joinedAt).toLocaleString("en-IN")
                              : "-"}
                          </td>
                          <td>{packages[user.package - 1]?.name || "-"}</td>
                        </tr>
                      ))
                    )}

                  </tbody>
                </table>
              </div>
              {/* <div className="mt-3">
            <ul className="pagination">
              <li className="page-item"><a className="page-link" href="#">Previous</a></li>
              <li className="page-item active"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item"><a className="page-link" href="#">Next</a></li>
            </ul>
          </div> */}

            </div>
          </div>
        </div>
      </main>

    </>
  )
}

export default NetworkTeam