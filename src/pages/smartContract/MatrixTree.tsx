import { useState, useEffect } from 'react';
import loading from '/img/green-loading.gif';
import CheckIcon from '/img/check-icon.png';
import { useWallet } from "../../solana/context/WalletContext";
import {packages, getFullBinaryTreeLevels } from "../../solana/program";
import { Link } from 'react-router-dom';
function MatrixTree() {
  const { wallet } = useWallet();
  const [levelCounts, setLevelCounts] = useState<number[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(true);
  useEffect(() => {
    if (!wallet) return;

    const fetchMatrix = async () => {
      setLoadingLevels(true);

      try {
        const levels = await getFullBinaryTreeLevels(wallet);
        const counts = levels.map(level => level.length);

        setLevelCounts(counts);

      } catch (err) {
        console.error("Matrix fetch error:", err);
      }

      setLoadingLevels(false);
    };

    fetchMatrix();
  }, [wallet]);

  return (
    <>
    
    <main>
    <div className="container-fluid">
      <div className="row">
         
        <div className="col-lg-12 col-xl-12">
          <div className="SOL-page-title text-center"><span>My Matrix Tree</span></div> 
          <div className="table-responsive table-style">
            <table className="table">
            <thead>
              <tr>
                <th style={{ width: "25%" }}>Tier</th>
                <th style={{ width: "25%" }}>Matrix Tree</th>
                <th style={{ width: "26%" }} colSpan={2}>Matrix Status</th>
                <th style={{ width: "24%" }}>Action</th>
              </tr>
            </thead>
            {/* <tbody>
              {packages.map((pkg, idx) => {
                const userCount = levelCounts[idx] ?? 0;
                const maxUsers = Math.pow(2, pkg.id);
                let statusIcon;
                if (userCount === 0) {
                  statusIcon = "-";
                } else if (userCount === maxUsers) {
                  statusIcon = <img src={CheckIcon} width="20" />;
                } else {
                  statusIcon = <img src={loading} width="20" />;
                }

                return (
                  <tr key={pkg.id}>
                    <td>{pkg.id}</td>
                    <td>{maxUsers}</td>
                    <td width="13%">{userCount}</td>
                    <td width="13%">{loadingLevels ? <img src={loading} width="20" /> : statusIcon}</td>
                    <td>
                      {userCount > 0 ? (
                        <Link 
  to={`/matrixTreeDetails/${pkg.id}`} 
  className="btn btn-primary btn-sm"
>
  View
</Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })}
              
              
            </tbody> */}
            <tbody>
                {loadingLevels ? (
                    <tr>
                    <td colSpan={5} className="text-center py-4">
                        <img src={loading} width="40" />
                        <div className="mt-2">Loading Matrix Tree...</div>
                    </td>
                    </tr>
                ) : (
                    packages.map((pkg, idx) => {
                    const userCount = levelCounts[idx] ?? 0;
                    const maxUsers = Math.pow(2, pkg.id);

                    let statusIcon;

                    if (userCount === 0) {
                        statusIcon = "-";
                    } else if (userCount === maxUsers) {
                        statusIcon = <img src={CheckIcon} width="20" />;
                    } else {
                        statusIcon = <img src={loading} width="20" />;
                    }

                    return (
                        <tr key={pkg.id}>
                        <td>{pkg.id}</td>
                        <td>{maxUsers}</td>
                        <td>{userCount}</td>
                        <td>{statusIcon}</td>
                        <td>
                            {userCount > 0 ? (
                            <Link
                                to={`/matrixTreeDetails/${pkg.id}`}
                                className="btn btn-primary btn-sm"
                            >
                                View
                            </Link>
                            ) : (
                            "-"
                            )}
                        </td>
                        </tr>
                    );
                    })
                )}
                </tbody>
          </table>
          </div> 

        </div>
      </div>
    </div>
  </main>

    
    </>
  )
}

export default MatrixTree