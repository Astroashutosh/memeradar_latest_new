import { useState, useEffect } from 'react'
import loadingImg from '/img/green-loading.gif';
import checkIcon from '/img/check-icon.png';
import { useWallet } from "../../solana/context/WalletContext";
import { getDirectPartners, packages, shorten } from "../../solana/program";
import { copyToClipboard } from '../../utils/helpers';
import PaginationWrapper from '../../utils/PaginationWrapper';
function DirectTeam() {
  const { wallet } = useWallet();
  const [directPartners, setDirectPartners] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [selectedPartner, setSelectedPartner] = useState<any>(null);
  // useEffect(() => {
  //   const loadPartners = async () => {
  //     if (!wallet) return;
  //     const partners = await getDirectPartners(wallet);
  //     console.log("all parteners data ",partners);
  //     setDirectPartners(partners);
  //   };

  //   loadPartners();
  // }, [wallet]);


useEffect(() => {
  const loadPartners = async () => {
    if (!wallet) return;

    setLoading(true); // start loading
    try {
      const partners = await getDirectPartners(wallet);
      setDirectPartners(partners);
    } catch (error) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false); // stop loading
    }
  };

  loadPartners();
}, [wallet]);


  return (
    <>

      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-xl-12">
              <div className="SOL-page-title text-center"><span>My Direct Team</span></div>
              <div className="table-responsive table-style">
                <table className="table">

                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Date</th>
                      <th>Name</th>
                      <th>DBO ID</th>
                      <th>Contact</th>
                      <th>Address</th>
                      {/* <th>Starter</th>
                  <th>Advisor</th>
                  <th>Bronze</th>
                  <th>Silver</th>
                  <th>Gold</th>
                  <th>Platinum</th>
                  <th>Sapphire</th>
                  <th>Diamond</th>
                  <th>Director</th>
                  <th>President</th> */}
                      {packages.map((pkg) => (
                        <th key={pkg.id}>{pkg.name}</th>
                      ))}
                    </tr>
                  </thead>
{/* 
                  <tbody>

                    {directPartners.length === 0 ? (
                      <tr>
                        <td colSpan={4 + packages.length} className="text-center">
                          No direct partners found
                        </td>
                      </tr>
                    ) : (
                      directPartners.map((partner, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                         
                          <td>
  {partner.joinedAt
    ? new Date(partner.joinedAt).toLocaleString("en-IN")
    : "-"}
</td>
                          <td>{"-"}</td>
                          <td>{partner.dboId}</td>
                          <td>{"-"}</td>
                      

 <td className="nowrap">{shorten(partner.wallet)}
  
                          <a href="#!" className="ms-2" onClick={(e) => {e.preventDefault();
                              copyToClipboard(partner.wallet, "Address copied");}}>
                            <i className="bi bi-copy"></i>
                          </a>
                      
                          <a href={`https://solscan.io/account/${partner.wallet}`} target="_blank" className="ms-2" >
                            <i className="bi bi-box-arrow-up-right"></i>
                          </a>
                        </td>


                          {packages.map((pkg) => (
                            <td key={pkg.id}>
                              {partner.currentPackage >= pkg.id ? (
                                <img src={checkIcon} alt="check" width="20" />
                              ) : (
                                "-"
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}

                    
                  </tbody> */}

<tbody>

  {loading ? (
    <tr>
      <td colSpan={6 + packages.length} className="text-center">
        <img src={loadingImg} alt="Loading..." style={{ width: "50px" }} />
        <div className="mt-2">Loading Direct Team...</div>
      </td>
    </tr>
  ) : directPartners.length === 0 ? (
    <tr>
      <td colSpan={6 + packages.length} className="text-center">
        No direct partners found
      </td>
    </tr>
  ) : (
    directPartners.map((partner, index) => (
      <tr key={index}>
        <td>{index + 1}</td>

        <td>
          {partner.joinedAt
            ? new Date(partner.joinedAt).toLocaleString("en-IN")
            : "-"}
        </td>

        <td>DBO</td>
        <td>{partner.dboId}</td>
<td>
  <a
    href="#!"
    className="btn btn-outline-dark btn-sm"
    data-bs-toggle="modal"
    data-bs-target="#contactDetails"
    onClick={() => setSelectedPartner(partner)}
  >
    view
  </a>
</td>

        <td className="nowrap">
          {shorten(partner.wallet)}

          <a href="#!" className="ms-2" onClick={(e) => {
            e.preventDefault();
            copyToClipboard(partner.wallet, "Address copied");
          }}>
            <i className="bi bi-copy"></i>
          </a>

          <a href={`https://solscan.io/account/${partner.wallet}?cluster=devnet`} target="_blank" className="ms-2">
            <i className="bi bi-box-arrow-up-right"></i>
          </a>
        </td>

        {packages.map((pkg) => (
          <td key={pkg.id}>
            {partner.currentPackage >= pkg.id ? (
              <img src={checkIcon} alt="check" width="20" />
            ) : (
              "-"
            )}
          </td>
        ))}
      </tr>
    ))
  )}

</tbody>



                </table>
              </div>
            </div>
          </div>
          <PaginationWrapper itemsPerPage={10} />
        </div>
      </main>



{/* Contect modal */}

  <div className="modal fade" id="contactDetails" >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <span className="modalWindow-close" data-bs-dismiss="modal" aria-label="Close"></span>
        <div className="modal-body">
          <div className="sec-divider top"> </div>
          <div className="sec-divider bottom"> </div>
          <div className="badgeStyle text-center mb-2">
     <h5>DBO ID: {selectedPartner?.dboId || "-"}</h5>
          </div>
          <div className="item-style-box mb-2">
            <div className="social-account-connect">
              <div className="social-account-icon">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <div className="head">Whatsapp</div>
              <div className="account-handle"><a href={`tel:${selectedPartner?.phone || ""}`} target="_blank">
  {selectedPartner?.phone || "-"}
</a></div>
            </div>
          </div>
          <div className="item-style-box mb-2">
            <div className="social-account-connect">
              <div className="social-account-icon">
                <i className="fa-brands fa-telegram"></i>
              </div>
              <div className="head">Telegram</div>
              <div className="account-handle"><a href={`https://t.me/${selectedPartner?.telegram || ""}`} target="_blank">
  {selectedPartner?.telegram || "-"}
</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    </>
  )
}

export default DirectTeam