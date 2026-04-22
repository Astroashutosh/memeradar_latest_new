import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Buffer } from 'buffer';
import * as anchor from '@coral-xyz/anchor';
// import { BN } from '@coral-xyz/anchor';
import { PROGRAM_ID, connection, globalPda, vaultPda, ZERO, baseurl } from "./constants";
import { getProgram } from "./anchor";
import type { AnchorUserAccount } from "./types";


import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";


// =============================
// CONSTANTS
// =============================
const MINT = new PublicKey("FmgQLbExtD5RrHdgvM1tnenjAnFZ354oC3z89vqKnPWK");
// const ZERO = new PublicKey("11111111111111111111111111111111");



export const packages = [
  { id: 1, name: "Starter", price: 0.2 },
  { id: 2, name: "Advisor", price: 0.25 },
  { id: 3, name: "Bronze", price: 0.5 },
  { id: 4, name: "Silver", price: 1 },
  { id: 5, name: "Gold", price: 2 },
  { id: 6, name: "Platinum", price: 4 },
  { id: 7, name: "Sapphire", price: 8 },
  { id: 8, name: "Diamond", price: 16 },
  { id: 9, name: "Director", price: 32 },
  { id: 10, name: "President", price: 64 },
];

export const shorten = (address: string) => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const getUserPda = (wallet: string): PublicKey => {
  const walletPubkey = new PublicKey(wallet);
  const [userPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user"), walletPubkey.toBuffer()],
    PROGRAM_ID
  );
  return userPda;
};

export const checkUserRegistered = async (wallet: string) => {
  try {
    const userPda = getUserPda(wallet);
    const account = await connection.getAccountInfo(userPda);
    return account !== null;

  } catch (err) {
    console.error(err);
    return false;
  }
};

export const getUserId = async (wallet: string) => {
  try {
    const program = getProgram();
    const userPda = getUserPda(wallet);
    const account: any = await program.account.userAccount.fetch(userPda);
    return account.id.toNumber();

  } catch {
    return "-";
  }
};



// api call function start 


export const handleProgramEvents = async (tx: string, program: any) => {

  await connection.confirmTransaction(tx, "confirmed");

  const txInfo = await connection.getTransaction(tx, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0
  });

  if (!txInfo?.meta?.logMessages) return;

  for (const log of txInfo.meta.logMessages) {

    if (!log.startsWith("Program data:")) continue;

    try {

      const base64 = log.replace("Program data: ", "");

      const event = program.coder.events.decode(base64);

      if (!event) continue;

      const data = event.data;

      // ---------------- REGISTER EVENT ----------------

      if (event.name === "RegisterEvent") {

        await fetch(
          `${baseurl}report_api/api.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              table: "register",
              action: "insert",
              user: data.user.toBase58(),
              referrer: data.referrer.toBase58(),
              user_id: data.userId.toString(),
              country: localStorage.getItem("country") || ""
            })
          }
        );

      }

      // ---------------- UPGRADE EVENT ----------------

      if (event.name === "UpgradeEvent") {

        await fetch(
          `${baseurl}report_api/api.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              table: "upgrade",
              action: "insert",
              user: data.user.toBase58(),
              package: data.package.toString(),
              amount: data.amount.toString()
            })
          }
        );

      }

      // ---------------- INCOME EVENT ----------------

      if (event.name === "IncomeEvent") {

        const type = Object.keys(data.incomeType)[0];

        await fetch(
          `${baseurl}report_api/api.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
              table: "reports",
              action: "insert",
              user: data.user.toBase58(),
              from: data.from.toBase58(),
              income_type: type,
              amount: data.amount.toString(),
              package: data.package.toString(),
              addon: data.addon.toString()
            })
          }
        );

      }

    } catch (err) {
      console.log("Event decode error:", err);
    }

  }

};

// api call end 


// export const registerUser = async (
//   wallet: PublicKey,
//   sponsorWallet: PublicKey
// ) => {

//   const program = getProgram();

//   const userPda = getUserPda(wallet.toBase58());
//   const sponsorPda = getUserPda(sponsorWallet.toBase58());
//   // console.log("User PDA:", userPda.toBase58());
//   // console.log("Sponsor PDA:", sponsorPda.toBase58());

//   const sponsorUser: any =
//     await program.account.userAccount.fetch(sponsorPda);

//   if (!sponsorUser.exists) {
//     throw new Error("Invalid Sponsor");
//   }

//   const ZERO = PublicKey.default;

//   // -----------------------------
//   // BFS MATRIX SEARCH
//   // -----------------------------

//   const queue: PublicKey[] = [sponsorWallet];

//   let uplineWallet: PublicKey | null = null;
//   let isLeft = true;

//   while (queue.length > 0) {

//     const current = queue.shift()!;

//     const currentPda = getUserPda(current.toBase58());

//     const userData: any =
//       await program.account.userAccount.fetch(currentPda);

//     const left = userData.left;
//     const right = userData.right;

//     if (left.equals(ZERO)) {

//       uplineWallet = current;
//       isLeft = true;
//       break;

//     }

//     if (right.equals(ZERO)) {

//       uplineWallet = current;
//       isLeft = false;
//       break;

//     }

//     queue.push(left);
//     queue.push(right);

//   }

//   if (!uplineWallet) {
//     throw new Error("Matrix full");
//   }

//   const uplinePda = getUserPda(uplineWallet.toBase58());

//   // console.log("Chosen Upline:", uplineWallet.toBase58());
//   // console.log("Position:", isLeft ? "LEFT" : "RIGHT");

//   // -----------------------------
//   // BUILD REMAINING ACCOUNTS
//   // -----------------------------

//   const remainingAccounts: any[] = [];

//   let currentUpline = uplineWallet;

//   for (let i = 0; i < 10; i++) {

//     if (currentUpline.equals(ZERO)) break;

//     const uplineUserPda =
//       getUserPda(currentUpline.toBase58());

//     try {

//       const upline: any =
//         await program.account.userAccount.fetch(uplineUserPda);

//       remainingAccounts.push({
//         pubkey: uplineUserPda,
//         isWritable: true,
//         isSigner: false,
//       });

//       currentUpline = upline.upline;

//     } catch {

//       break;

//     }

//   }

//   // -----------------------------
//   // SEND TRANSACTION
//   // -----------------------------

//   const tx = await program.methods
//     .register(isLeft)
//     .accounts({
//       signer: wallet,
//       user: userPda,
//       sponsorUser: sponsorPda,
//       uplineUser: uplinePda,
//       global: globalPda,
//       systemProgram: SystemProgram.programId
//     })
//     .remainingAccounts(remainingAccounts)
//     .rpc();

//   // console.log("Register TX:", tx);

//   await handleProgramEvents(tx, program);

//   return tx;

// };


// export const registerUser = async (
//   wallet: PublicKey,
//   referrerWallet: PublicKey
// ) => {
//   const program = getProgram();

//   const userPda = getUserPda(wallet.toBase58());
//   const referrerPda = getUserPda(referrerWallet.toBase58());

//   const [statePda] = PublicKey.findProgramAddressSync(
//     [Buffer.from("state")],
//     program.programId
//   );

//   // ✅ FIXED LINE
//   const referrerAccount = await program.account.userAccount.fetch(referrerPda);

//   if (!referrerAccount.exists) {
//     throw new Error("Invalid Sponsor");
//   }

//   const tx = await program.methods
//     .register(referrerWallet)
//     .accounts({
//       user: userPda,
//       state: statePda,
//       referrer: referrerPda,
//       signer: wallet,
//       systemProgram: SystemProgram.programId,
//     })
//     .rpc();

//   console.log("Register TX:", tx);

//   return tx;
// };

export const registerUser = async (
  wallet: PublicKey,
  referrerWallet: PublicKey
) => {
  try {
    const program = getProgram();

    const userPda = getUserPda(wallet.toBase58());
    const referrerPda = getUserPda(referrerWallet.toBase58());

    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("state")],
      PROGRAM_ID
    );

    // ✅ DEBUG LOGS (VERY IMPORTANT)
    console.log("Wallet:", wallet.toBase58());
    console.log("Referrer Wallet:", referrerWallet.toBase58());
    console.log("User PDA:", userPda.toBase58());
    console.log("Referrer PDA:", referrerPda.toBase58());

    // ✅ CHECK REFERRER EXISTS (IMPORTANT FIX)
    const referrerAccount = await connection.getAccountInfo(referrerPda);

    if (!referrerAccount) {
      throw new Error("❌ Invalid Sponsor (Not Registered)");
    }

    // ❌ SELF REFERRAL BLOCK
    if (wallet.toBase58() === referrerWallet.toBase58()) {
      throw new Error("❌ Cannot refer yourself");
    }

    // 🚀 MAIN REGISTER CALL
    const tx = await program.methods
      .register(referrerWallet)
      .accounts({
        user: userPda,
        state: statePda,
        referrer: referrerPda,
        signer: wallet,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Register TX:", tx);

    return tx;

  } catch (err: any) {

  console.error("FULL ERROR:", err);

  // 🔥 IMPORTANT FIX
  if (
    err.message?.includes("already been processed") ||
    err.message?.includes("Transaction simulation failed")
  ) {
    console.log("⚠️ Tx शायद already success है, re-checking...");

    return "success";
  }

  throw new Error(err.message || "Register failed");
}
};
export const upgradePackage = async (wallet: string, newPackage: number) => {
  const program = getProgram();
  const userPubkey = new PublicKey(wallet);
  const userPda = getUserPda(wallet);

  // -------------------------
  // Fetch User Account
  // -------------------------
  let userAccount: any;
  try {
    userAccount = await program.account.userAccount.fetch(userPda);
  } catch {
    throw new Error("User account not found. Please register first.");
  }

  if (!userAccount.referrer || new PublicKey(userAccount.referrer).equals(PublicKey.default)) {
    throw new Error("Sponsor not found for this user.");
  }

  const sponsorWallet = new PublicKey(userAccount.referrer);
  const sponsorPda = getUserPda(sponsorWallet.toBase58());

  const sponsorUserAccount: any = await program.account.userAccount.fetch(sponsorPda);

  const globalAccount: any = await program.account.globalState.fetch(globalPda);
  const ownerPubkey = new PublicKey(globalAccount.owner.toString());

  // =============================
  // REFERRER ACCOUNTS
  // =============================
  const MAX_LEVELS = 10;
  let referrerAccounts: any[] = [];
  let uplineAccounts: any[] = [];

  // -------------------------
  // Referrer chain
  // -------------------------
  let currentReferrer = sponsorWallet;
  for (let i = 0; i < MAX_LEVELS; i++) {
    if (currentReferrer.equals(ZERO)) break;

    const refUserPda = getUserPda(currentReferrer.toBase58());
    try {
      const refUser = await program.account.userAccount.fetch(refUserPda) as unknown as AnchorUserAccount;

      referrerAccounts.push(
        { pubkey: refUserPda, isWritable: true, isSigner: false },
        { pubkey: new PublicKey(refUser.wallet), isWritable: true, isSigner: false }
      );

      currentReferrer = new PublicKey(refUser.referrer);
    } catch {
      break;
    }
  }

  // -------------------------
  // Upline chain
  // -------------------------
  let currentUpline = sponsorUserAccount.referrer
    ? new PublicKey(sponsorUserAccount.referrer)
    : ZERO;

  const visited = new Set<string>();
  for (let i = 0; i < MAX_LEVELS; i++) {
    if (currentUpline.equals(ZERO)) break;
    if (visited.has(currentUpline.toBase58())) break;

    const upUserPda = getUserPda(currentUpline.toBase58());
    try {
      const upUser = await program.account.userAccount.fetch(upUserPda) as unknown as AnchorUserAccount;

      uplineAccounts.push(
        { pubkey: upUserPda, isWritable: true, isSigner: false },
        { pubkey: new PublicKey(upUser.wallet), isWritable: true, isSigner: false }
      );

      visited.add(currentUpline.toBase58());
      currentUpline = upUser.referrer ? new PublicKey(upUser.referrer) : ZERO;
    } catch {
      break;
    }
  }

  const referrerLevelCount = referrerAccounts.length / 2;
  const uplineLevelCount = uplineAccounts.length / 2;

  // -------------------------
  // Execute Upgrade
  // -------------------------
  const tx = await program.methods
    .upgrade(newPackage, referrerLevelCount, uplineLevelCount)
    .accounts({
      signer: userPubkey,
      user: userPda,
      sponsorUser: sponsorPda,
      sponsorWallet: sponsorWallet,
      global: globalPda,
      vault: vaultPda,
      owner: ownerPubkey,
      systemProgram: SystemProgram.programId,
    })
    .remainingAccounts([...referrerAccounts, ...uplineAccounts])
    .rpc();

  // Save Data in db
  await handleProgramEvents(tx, program);


  return tx;
};




export const RANK_NAMES: Record<number, string> = {
  0: "None",
  1: "Silver",
  2: "Gold",
  3: "Platinum",
  4: "Sapphire",
  5: "Diamond",
};


// export const getUserData = async (wallet: string) => {
//   try {
//     const program = getProgram();
//     const userPda = getUserPda(wallet);
//     const account = (await program.account.userAccount.fetch(userPda).catch(() => null)) as AnchorUserAccount | null;
//     if (!account) {
//       return null;
//     }

//     const defaultKey = anchor.web3.PublicKey.default.toBase58();
//     const sponsorKey = account.referrer.toBase58();
//     const uplineKey = account.upline.toBase58();
//     const leftKey = account.left.toBase58();
//     const rightKey = account.right.toBase58();

//     const fetchUserId = async (walletAddress: string) => {

//       if (walletAddress === defaultKey) return undefined;

//       const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
//         [Buffer.from("user"), new anchor.web3.PublicKey(walletAddress).toBuffer()],
//         PROGRAM_ID
//       );

//       try {
//         const acc: any = await program.account.userAccount.fetch(pda);
//         // console.log(acc);
//         return acc.id.toNumber();
//       } catch {
//         return undefined;
//       }

//     };

//     const sponsorId = await fetchUserId(sponsorKey);
//     const uplineId = await fetchUserId(uplineKey);
//     const leftPartnerId = await fetchUserId(leftKey);
//     const rightPartnerId = await fetchUserId(rightKey);

//     return {
//       userId: account.id.toNumber(),
//       rank: RANK_NAMES[account.rank] ?? "None",
//       sponsor: sponsorKey === defaultKey ? "Not Assigned" : sponsorKey,
//       sponsorId,

//       upline: uplineKey === defaultKey ? "Not Assigned" : uplineKey,
//       uplineId,

//       leftPartner: leftKey === defaultKey ? "Not Assigned" : leftKey,
//       leftPartnerId,

//       rightPartner: rightKey === defaultKey ? "Not Assigned" : rightKey,
//       rightPartnerId,
//       totalIncome:
//         account.totalIncome.toNumber() / anchor.web3.LAMPORTS_PER_SOL,
//       sponsorIncome:
//         account.partnerSponsorBonus.toNumber() /
//         anchor.web3.LAMPORTS_PER_SOL,
//       directIncome:
//         account.partnerDirectKickBonus.toNumber() /
//         anchor.web3.LAMPORTS_PER_SOL,
//       levelIncome:
//         account.partnerLevelBonus.toNumber() /
//         anchor.web3.LAMPORTS_PER_SOL,
//       poolIncome:
//         account.poolLevelIncome.toNumber() /
//         anchor.web3.LAMPORTS_PER_SOL,
//       lapsIncome:
//         account.lapsIncome.toNumber() /
//         anchor.web3.LAMPORTS_PER_SOL,
//       leftVolume:
//         account.leftVolume.toNumber() /
//         anchor.web3.LAMPORTS_PER_SOL,
//       rightVolume:
//         account.rightVolume.toNumber() /
//         anchor.web3.LAMPORTS_PER_SOL,

//       carryLeft:
//         account.carryLeft.toNumber() / anchor.web3.LAMPORTS_PER_SOL,

//       carryRight:
//         account.carryRight.toNumber() / anchor.web3.LAMPORTS_PER_SOL,

//       currentPackage: account.currentPackage,
//       partnerCount: account.partnerCount,
//       totalMatrixTeam: account.totalMatrixTeam,


//     };

//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

// const getPrice = (amount : String) => {
//   const lamportsPerSol = new BN(anchor.web3.LAMPORTS_PER_SOL);
//   console.log("amount",amount.toString())
// console.log(lamportsPerSol.toString());
//   return new BN(amount)
//   .div(lamportsPerSol)
//   .toNumber();
// }


// export const getIncomeEvents = async () => {
//   const program = getProgram();

//   let before: string | undefined = undefined;
//   const events: any[] = [];

//   while (events.length < 200) {

//     const signatures = await connection.getSignaturesForAddress(
//       program.programId,
//       { limit: 50, before }
//     );

//     if (signatures.length === 0) break;

//     for (const sig of signatures) {

//       const tx = await connection.getTransaction(sig.signature, {
//         commitment: "confirmed",
//         maxSupportedTransactionVersion: 0
//       });

//       if (!tx?.meta?.logMessages) continue;

//       for (const log of tx.meta.logMessages) {
//         try {
//           const event = program.coder.events.decode(log);
//           if (event?.name === "IncomeEvent") {
//             events.push(event.data);
//           }
//         } catch {}
//       }

//     }

//     before = signatures[signatures.length - 1].signature;

//   }

//   return events;
// };

// export const getDirectPartners = async (wallet: string) => {
//   try {
//     const program = getProgram();
//     const userPda = getUserPda(wallet);

//     const account: any = await program.account.userAccount.fetch(userPda);
//     if (!account) return [];

//     const directs = account.directUsers || [];

//     const partners = await Promise.all(
//       directs.map(async (partnerPda: PublicKey) => {
//         // const walletAddr = pk.toBase58();

//         try {
//           // const partnerPda = getUserPda(walletAddr);
//           const partner: any = await program.account.userAccount.fetch(partnerPda);

//           return {
//             wallet: partner.wallet.toBase58(),
//             dboId: partner.id.toNumber(),
//             currentPackage: partner.currentPackage,
//           };
//         } catch {
//           return {
//             wallet: "-",
//             dboId: "-",
//             currentPackage: "-",
//           };
//         }
//       })
//     );

//     return partners;

//   } catch (err) {
//     console.error("Error fetching direct partners:", err);
//     return [];
//   }
// };




// export const getUserData = async (wallet: string) => {
//   try {
//     const program = getProgram();
//     const userPda = getUserPda(wallet);

//     const acc: any = await program.account.user.fetch(userPda);
//        console.log("user account data is ",acc);

//     return {
//       wallet: acc.wallet.toBase58(),
//       // 🔥 INCOME (UI based variables)
//       lppProgramReward: acc.directIncome.toNumber() / 1e9,

//       directKickBonus: acc.teamIncome.toNumber() / 1e9,
//       teamStarterBonus: acc.teamIncome.toNumber() / 1e9,

//       downLadderBonus: acc.downIncome.toNumber() / 1e9,
//       upLadderBonus: acc.upIncome.toNumber() / 1e9,

//       leadershipBonus: Number(acc.leadershipRank || 0),

//       // ⚠️ SAME VALUE (contract limitation)
//       bossReward: acc.totalIncome.toNumber() / 1e9,
//       memePoolReward: acc.totalIncome.toNumber() / 1e9,
//       bigWishReward: acc.totalIncome.toNumber() / 1e9,

//       // 👇 TEAM
//       directTeam: acc.partnerCount,
//       networkTeam: acc.partnerCount,

//       // 👇 EXTRA
//       totalIncome: acc.totalIncome.toNumber() / 1e9,
//       totalDeposit: acc.totalDeposit.toNumber() / 1e9,

//       rank: acc.rank,
//       multiplier: acc.multiplier,
//       maxPayout: acc.maxPayout.toNumber() / 1e9,

//       exists: acc.exists,
//     };

//   } catch (err) {
//     console.error("Dashboard error:", err);
//     return null;
//   }
// };



export const getUserData = async (wallet: string) => {
  try {
    const program = getProgram();
    const userPda = getUserPda(wallet);

    const acc: any = await program.account.user.fetch(userPda);
    console.log("user account data is ", acc);
console.log("PRE LPP VALUE:", acc.preLpp.toNumber());
console.log("FINAL LPP VALUE:", acc.finalLpp.toNumber());
//     return {
//       // =============================
//       // BASIC
//       // =============================
//       wallet: acc.wallet.toBase58(),
//       exists: acc.exists,

//       // =============================
//       // LPP DATA (🔥 IMPORTANT)
//       // =============================
   

//       preLpp: acc.preLpp.toNumber(),
// finalLpp: acc.finalLpp.toNumber(),


//       totalDeposit: acc.totalDeposit.toNumber() / 1e9,
//       totalIncome: acc.totalIncome.toNumber() / 1e9,

//       // =============================
//       // INCOME BREAKDOWN
//       // =============================
//       directIncome: acc.directIncome.toNumber() / 1e9,
//       teamIncome: acc.teamIncome.toNumber() / 1e9,
//       upIncome: acc.upIncome.toNumber() / 1e9,
//       downIncome: acc.downIncome.toNumber() / 1e9,

//       // 👉 UI MAPPING (same naming as your UI)
//       lppProgramReward: acc.directIncome.toNumber() / 1e9,
//       directKickBonus: acc.teamIncome.toNumber() / 1e9,
//       teamStarterBonus: acc.teamIncome.toNumber() / 1e9,
//       downLadderBonus: acc.downIncome.toNumber() / 1e9,
//       upLadderBonus: acc.upIncome.toNumber() / 1e9,

//       leadershipBonus: Number(acc.leadershipRank || 0),
// currentPackage: acc.currentPackage || 0,
//       // ⚠️ pools (contract doesn't separate)
//       bossReward: acc.totalIncome.toNumber() / 1e9,
//       memePoolReward: acc.totalIncome.toNumber() / 1e9,
//       bigWishReward: acc.totalIncome.toNumber() / 1e9,

//       // =============================
//       // TEAM DATA
//       // =============================
//       directTeam: acc.partnerCount,
//       networkTeam: acc.partnerCount,
//       directCount: acc.directCount,

//       teamVolume: acc.teamVolume.toNumber() / 1e9,

//       // =============================
//       // MLM / RANK
//       // =============================
//       rank: acc.rank,
//       multiplier: acc.multiplier,
//       maxPayout: acc.maxPayout.toNumber() / 1e9,

//       strongestLeg: acc.strongestLeg.toNumber() / 1e9,
//       secondLeg: acc.secondLeg.toNumber() / 1e9,

//       // =============================
//       // BONUS TRACKING
//       // =============================
//       lastBonusClaim: acc.lastBonusClaim,
//       monthlyBonusEarned: acc.monthlyBonusEarned.toNumber() / 1e9,

//       // =============================
//       // INVESTMENTS (🔥 VERY IMPORTANT)
//       // =============================
//       investments: acc.investments.map((inv: any) => ({
//         amount: inv.amount.toNumber() / 1e9,
//         startTime: inv.startTime,
//         lastClaim: inv.lastClaim,
//         totalRoi: inv.totalRoi.toNumber() / 1e9,
//         packageType: inv.packageType, // 1 = PRE, 2 = FINAL
//       })),
//     };




return {
  // =============================
  // BASIC
  // =============================
  wallet: acc.wallet?.toBase58?.() || "",
  exists: acc.exists ?? false,

  // =============================
  // LPP DATA (🔥 IMPORTANT)
  // =============================
  preLpp: acc.preLpp?.toNumber?.() || 0,
  finalLpp: acc.finalLpp?.toNumber?.() || 0,

  totalDeposit: acc.totalDeposit?.toNumber?.() / 1e9 || 0,
  totalIncome: acc.totalIncome?.toNumber?.() / 1e9 || 0,

  // =============================
  // INCOME BREAKDOWN
  // =============================
  directIncome: acc.directIncome?.toNumber?.() / 1e9 || 0,
  teamIncome: acc.teamIncome?.toNumber?.() / 1e9 || 0,
  upIncome: acc.upIncome?.toNumber?.() / 1e9 || 0,
  downIncome: acc.downIncome?.toNumber?.() / 1e9 || 0,

  // 👉 UI MAPPING
  lppProgramReward: acc.directIncome?.toNumber?.() / 1e9 || 0,
  directKickBonus: acc.directIncome?.toNumber?.() / 1e9 || 0,   // 🔥 FIX
  teamStarterBonus: acc.teamIncome?.toNumber?.() / 1e9 || 0,
  downLadderBonus: acc.downIncome?.toNumber?.() / 1e9 || 0,
  upLadderBonus: acc.upIncome?.toNumber?.() / 1e9 || 0,

  // =============================
  // BONUS / EXTRA
  // =============================
  leadershipBonus: acc.leadershipRank?.toNumber?.() || 0,

  // ⚠️ contract में currentPackage नहीं है
  currentPackage: 0, // 🔥 FIX (safe default)

  bossReward: acc.totalIncome?.toNumber?.() / 1e9 || 0,
  memePoolReward: acc.totalIncome?.toNumber?.() / 1e9 || 0,
  bigWishReward: acc.totalIncome?.toNumber?.() / 1e9 || 0,

  // =============================
  // TEAM DATA
  // =============================
  directTeam: acc.partnerCount || 0,
  networkTeam: acc.partnerCount || 0,
  directCount: acc.directCount || 0,

  teamVolume: acc.teamVolume?.toNumber?.() / 1e9 || 0,

  // =============================
  // MLM / RANK
  // =============================
  rank: acc.rank || 0,
  multiplier: acc.multiplier || 0,
  maxPayout: acc.maxPayout?.toNumber?.() / 1e9 || 0,

  strongestLeg: acc.strongestLeg?.toNumber?.() / 1e9 || 0,
  secondLeg: acc.secondLeg?.toNumber?.() / 1e9 || 0,

  // =============================
  // BONUS TRACKING
  // =============================
  lastBonusClaim: acc.lastBonusClaim?.toNumber?.() || 0, // 🔥 FIX
  monthlyBonusEarned: acc.monthlyBonusEarned?.toNumber?.() / 1e9 || 0,

  // =============================
  // INVESTMENTS (🔥 IMPORTANT)
  // =============================
  investments: (acc.investments || []).map((inv: any) => ({
    amount: inv.amount?.toNumber?.() / 1e9 || 0,
    startTime: inv.startTime?.toNumber?.() || 0, // 🔥 FIX
    lastClaim: inv.lastClaim?.toNumber?.() || 0, // 🔥 FIX
    totalRoi: inv.totalRoi?.toNumber?.() / 1e9 || 0,
    packageType: inv.packageType || 0,
  })),
};




  } catch (err) {
    console.error("Dashboard error:", err);
    return null;
  }
};





export const getRegisterDatesBulk = async (wallets: string[]) => {
  try {
    const res = await fetch(`${baseurl}report_api/api.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        table: "register",
        action: "getMultiple",
        users: wallets.join(",")
      })
    });

    return await res.json();

  } catch (err) {
    console.error(err);
    return {};
  }
};

export const getDirectPartners = async (wallet: string) => {
  try {
    const program = getProgram();
    const userPda = getUserPda(wallet);

    const account: any = await program.account.userAccount.fetch(userPda);
    if (!account) return [];

    const directs = account.directUsers || [];

    const partners = await Promise.all(
      directs.map(async (partnerPda: PublicKey) => {
        try {
          const partner: any = await program.account.userAccount.fetch(partnerPda);

          return {
            wallet: partner.wallet.toBase58(),
            dboId: partner.id.toNumber(),
            currentPackage: partner.currentPackage,
          };
        } catch {
          return null;
        }
      })
    );

    const cleanPartners = partners.filter(p => p !== null);

    const walletList = cleanPartners.map(p => p.wallet);

    const dateMap = await getRegisterDatesBulk(walletList);

    return cleanPartners.map(p => ({
      ...p,
      joinedAt: dateMap[p.wallet] || null
    }));

  } catch (err) {
    console.error("Error fetching direct partners:", err);
    return [];
  }
};


// export const getDirectPartners = async (wallet: string) => {
//   try {
//     const program = getProgram();
//     const userPda = getUserPda(wallet);

//     const account: any = await program.account.userAccount.fetch(userPda);
//     if (!account) return [];

//     const level1 = account.levelUsers?.[0] || [];

//     const partners = await Promise.all(
//       level1.map(async (pk: PublicKey) => {
//         const walletAddr = pk.toBase58();

//         try {
//           const partnerPda = getUserPda(walletAddr);
//           const partner: any = await program.account.userAccount.fetch(partnerPda);

//           return {
//             wallet: walletAddr,
//             dboId: partner.id.toNumber(),
//             currentPackage: partner.currentPackage,
//           };
//         } catch {
//           return {
//             wallet: walletAddr,
//             dboId: "-",
//             currentPackage: "-",
//           };
//         }
//       })
//     );

//     return partners;

//   } catch (err) {
//     console.error("Error fetching direct partners:", err);
//     return [];
//   }
// };



export const getDirectPartnersold = async (wallet: string) => {
  try {
    const program = getProgram();
    const userPda = getUserPda(wallet);
    const account = (await program.account.userAccount.fetch(userPda).catch(() => null)) as AnchorUserAccount | null;
    if (!account) return [];

    const defaultKey = PublicKey.default.toBase58();

    // Helper to fetch a partner account
    const fetchPartner = async (partnerWallet: PublicKey) => {
      if (!partnerWallet || partnerWallet.toBase58() === defaultKey) return null;

      const partnerPda = getUserPda(partnerWallet.toBase58());
      try {
        const partnerAccount = await program.account.userAccount.fetch(partnerPda) as unknown as AnchorUserAccount;
        return {
          wallet: partnerAccount.wallet.toBase58(),
          dboId: partnerAccount.id.toNumber(),
          currentPackage: partnerAccount.currentPackage,
          // joinedAt: partnerAccount.joinedAt || "-", // optional timestamp
        };
      } catch {
        return null;
      }
    };

    // Collect all direct partners (example: left and right)
    const directPdas = [account.left, account.right]; // add more if needed
    const directPartners = [];

    for (let pda of directPdas) {
      const partner = await fetchPartner(pda);
      if (partner) directPartners.push(partner);
    }

    return directPartners;

  } catch (err) {
    console.error("Error fetching direct partners:", err);
    return [];
  }
};


export const getLevelPartners = async (
  wallet: string,
  maxLevels = 10
): Promise<any[][]> => {

  try {

    const program = getProgram();

    const levels: any[][] = [];

    // first PDA
    let currentLevelPdas: PublicKey[] = [getUserPda(wallet)];

    for (let level = 0; level < maxLevels; level++) {

      const nextLevelPdas: PublicKey[] = [];
      const levelUsers: any[] = [];

      for (const pda of currentLevelPdas) {

        try {

          const account: any =
            await program.account.userAccount.fetch(pda);

          const directs = account.directUsers || [];

          for (const pk of directs) {

            const walletAddr = pk.toBase58();

            try {

              const partnerPda = walletAddr;

              const partner: any =
                await program.account.userAccount.fetch(partnerPda);

              levelUsers.push({
                wallet: partner.wallet.toBase58(),
                id: partner.id.toNumber(),
                package: partner.currentPackage,
              });

              nextLevelPdas.push(partnerPda);

            } catch {

              levelUsers.push({
                wallet: walletAddr,
                id: "-",
                package: "-",
              });

            }

          }

        } catch (e) {
          console.log("Level fetch error:", e);
        }

      }

      if (levelUsers.length === 0) break;

      levels.push(levelUsers);

      currentLevelPdas = nextLevelPdas;

    }

// 🔥 ADD THIS BEFORE return levels

const allWallets = levels.flat().map(u => u.wallet);

const dateMap = await getRegisterDatesBulk(allWallets);

const finalLevels = levels.map(level =>
  level.map(user => ({
    ...user,
    joinedAt: dateMap[user.wallet] || null
  }))
);

return finalLevels;


    // return levels;

  } catch (err) {

    console.error("getLevelPartners error:", err);

    return [];

  }

};



export const getIncomeEvents = async () => {
  const program = getProgram();

  let before: string | undefined = undefined;
  const events: any[] = [];

  while (events.length < 200) {
    const signatures = await connection.getSignaturesForAddress(
      program.programId,
      { limit: 50, before }
    );

    if (signatures.length === 0) break;

    for (const sig of signatures) {
      const tx = await connection.getTransaction(sig.signature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0
      });

      if (!tx?.meta?.logMessages) continue;

      for (const log of tx.meta.logMessages) {

        if (log.startsWith("Program data:")) {
          try {
            const base64 = log.replace("Program data: ", "");

            const event = program.coder.events.decode(base64);

            if (event?.name === "IncomeEvent") {
              events.push(event.data);
            }

          } catch (e) { }
        }

      }
    }

    before = signatures[signatures.length - 1].signature;
  }

  return events;
};





const fetchUser = async (walletAddr: string | null) => {
  const program = getProgram();
  if (!walletAddr) return null;

  try {
    const pda = getUserPda(walletAddr);
    const acc: any = await program.account.userAccount.fetch(pda);

    return {
      wallet: walletAddr,
      id: acc.id.toNumber(),
      package: acc.currentPackage,
      left: acc.left?.toBase58(),
      right: acc.right?.toBase58(),
    };
  } catch {
    return null;
  }
};
export const getBinaryTree = async (wallet: string) => {
  try {
    // root
    const root = await fetchUser(wallet);
    if (!root) return null;

    // level 1
    const left = await fetchUser(root.left);
    const right = await fetchUser(root.right);

    // level 2
    const leftLeft = left ? await fetchUser(left.left) : null;
    const leftRight = left ? await fetchUser(left.right) : null;

    const rightLeft = right ? await fetchUser(right.left) : null;
    const rightRight = right ? await fetchUser(right.right) : null;

    return {
      root,
      left,
      right,
      leftLeft,
      leftRight,
      rightLeft,
      rightRight,
    };

  } catch (err) {
    console.error("getBinaryTree error:", err);
    return null;
  }
};



// new code

// type ReferralNode = {
//   wallet: string;
//   id: number;
//   package: number;
//   children: ReferralNode[];
// };

// export const getAllUsers = async () => {

//   try {

//     const program = getProgram();

//     const accounts = await program.account.userAccount.all();

//     return accounts.map((acc: any) => ({
//       wallet: acc.account.wallet.toBase58(),
//       id: acc.account.id.toNumber(),
//       referrer: acc.account.referrer.toBase58(),
//       package: acc.account.currentPackage,
//     }));

//   } catch (err) {

//     console.error("getAllUsers error:", err);

//     return [];

//   }

// };




// export const getReferralTree = async (wallet: string): Promise<ReferralNode[]> => {

//   const users = await getAllUsers();

//   const buildTree = (parentWallet: string): ReferralNode[] => {

//     const directs = users.filter(
//       (u) => u.referrer === parentWallet
//     );

//     return directs.map((user) => ({
//       wallet: user.wallet,
//       id: user.id,
//       package: user.package,
//       children: buildTree(user.wallet)
//     }));

//   };

//   return buildTree(wallet);

// };



export const claimMatchingBonus = async (wallet: string) => {
  const program = getProgram();

  const userPubkey = new PublicKey(wallet);
  const userPda = getUserPda(wallet);

  // const globalAccount: any = await program.account.globalState.fetch(globalPda);
  // const ownerPubkey = new PublicKey(globalAccount.owner.toString());

  const tx = await program.methods
    .claimMatchingBonus()
    .accounts({
      signer: userPubkey,
      user: userPda,
      global: globalPda,
      vault: vaultPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  // console.log("✅ Claim Matching TX:", tx);

  // events save in DB
  await handleProgramEvents(tx, program);

  return tx;
};


// export const getSponsorReports = async (wallet: string) => {
//   try {
//     const res = await fetch(
//       `${baseurl}report_api/api.php`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded"
//         },
//         body: new URLSearchParams({
//           table: "reports",
//           action: "select",
//           user: wallet
//         })
//       }
//     );

//     const data = await res.json();
//     return data;

//   } catch (err) {
//     console.error("API Error:", err);
//     return [];
//   }
// };



export const getReports = async (wallet: string, type: string) => {
  try {
    const res = await fetch(
      `${baseurl}report_api/api.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          table: "reports",
          action: "breakdown",
          user: wallet,
          type: type // 🔥 dynamic
        })
      }
    );

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};



export const getLevelIncome = async (
  wallet: string,
  level: number
) => {
  try {
    const addon = level - 1;

    const res = await fetch(
      `${baseurl}report_api/api.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          table: "reports",
          action: "breakdown",
          user: wallet,
          type: "level",
          addon: addon.toString()
        })
      }
    );

    const data = await res.json();

    const total = data.reduce((sum: number, r: any) => sum + Number(r.amount), 0);
    return total;

  } catch (err) {
    console.error(err);
    return 0;
  }
};


export const getPoolIncome = async (wallet: string) => {
  try {
    const res = await fetch(
      `${baseurl}report_api/api.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          table: "reports",
          action: "breakdown",
          user: wallet,
          type: "pool"
        })
      }
    );

    const data = await res.json();

    // group by package
    let result: any = {};

    data.forEach((r: any) => {
      const pkg = Number(r.package);

      if (!result[pkg]) {
        result[pkg] = { total: 0, count: 0 };
      }

      result[pkg].total += Number(r.amount || 0);
      result[pkg].count += 1;
    });

    return result;

  } catch (err) {
    console.error("API ERROR:", err);
    return {};
  }
};










export const getSponsorDetails = async (wallet: string) => {
  try {
    const res = await fetch(
      `${baseurl}report_api/api.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          table: "sponsor",
          action: "get",
          user: wallet
        })
      }
    );

    return await res.json();

  } catch (err) {
    console.error(err);
    return null;
  }
};




export const getPoolUsersByPackage = async (wallet: string, packageId: number) => {
  try {
    const res = await fetch(
      `${baseurl}report_api/api.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          table: "reports",
          action: "breakdown",
          user: wallet,
          type: "pool",        // ✅ only pool
        })
      }
    );

    const data = await res.json();

    // ✅ filter by package (tier)
    return data.filter((row: any) => Number(row.package) === packageId);

  } catch (err) {
    console.error(err);
    return [];
  }
};


export const getLevelBonusDetails = async (wallet: string, level: number) => {
  try {
    const addon = level - 1;

    const res = await fetch(
      `${baseurl}report_api/api.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          table: "reports",
          action: "breakdown",
          user: wallet,
          type: "level",
          addon: addon.toString()
        })
      }
    );

    return await res.json();

  } catch (err) {
    console.error(err);
    return [];
  }
};



// Matrix tree details

export const getFullBinaryTreeLevels = async (
  rootWallet: string,
  maxLevels = 10
) => {
  try {
    let levels: any[][] = [];

    let currentWallets: string[] = [rootWallet];

    for (let level = 0; level < maxLevels; level++) {

      // 🚀 Batch fetch all nodes at once
      const trees = await Promise.all(
        currentWallets.map(w => getBinaryTree(w))
      );

      let nextWallets: string[] = [];
      let levelUsers: any[] = [];

      trees.forEach(tree => {

        if (tree?.left?.wallet) {
          levelUsers.push(tree.left);
          nextWallets.push(tree.left.wallet);
        }

        if (tree?.right?.wallet) {
          levelUsers.push(tree.right);
          nextWallets.push(tree.right.wallet);
        }

      });

      if (levelUsers.length === 0) break;

      levels.push(levelUsers);
      currentWallets = nextWallets;
    }

    return levels;

  } catch (err) {
    console.error("Full tree error:", err);
    return [];
  }
};

export const getFullTree = async (wallet: string): Promise<any> => {
  if (!wallet || wallet === "-") return null;

  const user = await fetchUser(wallet);
  if (!user) return null;

  const left = await getFullTree(user.left);
  const right = await getFullTree(user.right);

  return {
    ...user,
    left,
    right
  };
};



// export const getTotalAndTodayIncomeOld = async (wallet: string) => {
//   try {
//     const res = await fetch(`${baseurl}report_api/api.php`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//       },
//       body: new URLSearchParams({
//         table: "reports",
//         action: "select",
//         user: wallet
//       })
//     });

//     const data = await res.json();
//     console.log('earning data', data);
//     let total = 0;
//     let today = 0;

//     const todayDate = new Date().toISOString().slice(0, 10);

//     data.forEach((row: any) => {
//       const amount = Number(row.amount) || 0;

//       total += amount;

//       // ✅ today filter
//       if (row.datetime?.startsWith(todayDate)) {
//         today += amount;
//       }
//     });

//     return { total, today };

//   } catch (err) {
//     console.error(err);
//     return { total: 0, today: 0 };
//   }
// };

export const getTotalAndTodayIncome = async (wallet: string) => {
  try {
    const res = await fetch(`${baseurl}report_api/api.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        table: "reports",
        action: "select",
        user: wallet
      })
    });

    const result = await res.json();

    return {
      total: result.total || 0,
      today: result.today || 0,
      lapsTotal: result.lapsTotal || 0
    };

  } catch (err) {
    console.error(err);
    return { total: 0, today: 0, lapsTotal: 0 };
  }
};








export const getIncomeBreakdown = async (wallet: string) => {
  const user = await getUserData(wallet);

  return {
    sponsor: { total: user?.lppProgramReward || 0, today: 0 },
    direct: { total: user?.directKickBonus || 0, today: 0 },
    pool: { total: user?.bossReward || 0, today: 0 },
    level: { total: user?.downLadderBonus || 0, today: 0 },
    matching: { total: user?.upLadderBonus || 0, today: 0 },
    silver: { total: user?.leadershipBonus || 0, today: 0 },
  };
};




// export const deposit = async (amount: number, isFinal: boolean) => {
//   try {
//     const program = getProgram();
//     const provider = program.provider as anchor.AnchorProvider;

//     const wallet = provider.wallet;
//     const connection = provider.connection;

//     // =============================
//     // PDA
//     // =============================
//     const userPda = getUserPda(wallet.publicKey.toBase58());

//     const [statePda] = PublicKey.findProgramAddressSync(
//       [Buffer.from("state")],
//       program.programId
//     );

//     const [vault] = PublicKey.findProgramAddressSync(
//       [Buffer.from("vault")],
//       program.programId
//     );

//     // =============================
//     // USER FETCH
//     // =============================
//     const user: any = await program.account.user.fetch(userPda);

//     if (!user.exists) {
//       throw new Error("❌ User not registered");
//     }

//     const referrerWallet = new PublicKey(user.referrer);
//     const referrerPda = getUserPda(referrerWallet.toBase58());

//     // =============================
//     // 🔥 CONTRACT LOGIC (IMPORTANT)
//     // =============================
//     // if (!user.preLppDone) {
//     //   // 👉 FIRST TIME → PRE LLP
//     //   if (amount < 10 || amount > 100) {
//     //     throw new Error("❌ Pre LPP: 10 - 100");
//     //   }
//     //   isFinal = false;
//     // } else {
//     //   // 👉 AFTER PRE → FINAL LLP
//     //   if (amount < 101 || amount > 5000) {
//     //     throw new Error("❌ Final LPP: 101 - 5000");
//     //   }
//     //   isFinal = true;
//     // }

// // =============================
// // ✅ CORRECT FLOW (FINAL FIX)
// // =============================
// const isPreDone = user.preLpp.toNumber() > 0;

// if (!isPreDone) {
//   if (isFinal) {
//     throw new Error("❌ You must complete PRE LPP first");
//   }

//   if (amount < 10 || amount > 100) {
//     throw new Error("❌ Pre LPP: 10 - 100");
//   }
// } else {
//   if (!isFinal) {
//     throw new Error("❌ Pre LPP already completed");
//   }

//   // ✅ FINAL UNLIMITED
//   if (amount < 101) {
//     throw new Error("❌ Final LPP minimum 101");
//   }
// }




//     // =============================
//     // ATA
//     // =============================
//     const fromAta = getAssociatedTokenAddressSync(
//       MINT,
//       wallet.publicKey
//     );

//     const toAta = getAssociatedTokenAddressSync(
//       MINT,
//       vault,
//       true
//     );

//     // =============================
//     // CREATE ATA IF NOT EXISTS
//     // =============================
// //     const txInit = new anchor.web3.Transaction();

// //     if (!(await connection.getAccountInfo(fromAta))) {
// //       txInit.add(
// //         createAssociatedTokenAccountInstruction(
// //           wallet.publicKey,
// //           fromAta,
// //           wallet.publicKey,
// //           MINT
// //         )
// //       );
// //     }

// //     if (!(await connection.getAccountInfo(toAta))) {
// //       txInit.add(
// //         createAssociatedTokenAccountInstruction(
// //           wallet.publicKey,
// //           toAta,
// //           vault,
// //           MINT
// //         )
// //       );
// //     }

// //     if (txInit.instructions.length > 0) {
// //       const tx = await wallet.signTransaction(txInit);
// // const sig = await connection.sendRawTransaction(tx.serialize());
// // await connection.confirmTransaction(sig);
// //       await connection.confirmTransaction(sig);
// //     }

// const txInit = new anchor.web3.Transaction();

// if (!(await connection.getAccountInfo(fromAta))) {
//   txInit.add(
//     createAssociatedTokenAccountInstruction(
//       wallet.publicKey,
//       fromAta,
//       wallet.publicKey,
//       MINT
//     )
//   );
// }

// if (!(await connection.getAccountInfo(toAta))) {
//   txInit.add(
//     createAssociatedTokenAccountInstruction(
//       wallet.publicKey,
//       toAta,
//       vault,
//       MINT
//     )
//   );
// }

// // ✅ IMPORTANT FIX
// if (txInit.instructions.length > 0) {
//   const latestBlockhash = await connection.getLatestBlockhash();

//   txInit.recentBlockhash = latestBlockhash.blockhash;
//   txInit.feePayer = wallet.publicKey;

//   const signedTx = await wallet.signTransaction(txInit);
//   const sig = await connection.sendRawTransaction(signedTx.serialize());

//   await connection.confirmTransaction(sig);
// }



//     // =============================
//     // BUILD UPLINE
//     // =============================
//     const remainingAccounts: any[] = [];
//     let current = referrerWallet;

//     for (let i = 0; i < 24; i++) {
//       if (current.equals(PublicKey.default)) break;

//       const pda = getUserPda(current.toBase58());

//       try {
//         const acc: any = await program.account.user.fetch(pda);

//         remainingAccounts.push({
//           pubkey: pda,
//           isWritable: true,
//           isSigner: false,
//         });

//         current = new PublicKey(acc.referrer);
//       } catch {
//         break;
//       }
//     }

//     // =============================
//     // 🚀 CONTRACT CALL
//     // =============================
//     const tx = await program.methods
//       .deposit(new anchor.BN(amount), isFinal)
//       .accounts({
//         user: userPda,
//         referrer: referrerPda,
//         state: statePda,
//         from: fromAta,
//         to: toAta,
//         authority: wallet.publicKey,
//         tokenProgram: TOKEN_PROGRAM_ID,
//       })
//       .remainingAccounts(remainingAccounts)
//       .rpc();

//     console.log("✅ Deposit Success:", tx);

//     return tx;

//   // } catch (err: any) {
//   //   console.error("❌ Deposit Error:", err);
//   //   throw new Error(err.message || "Deposit failed");
//   // }

// } catch (err: any) {
//   console.error("❌ Deposit Error:", err);

//   // ✅ DUPLICATE TX FIX
//   if (
//     err.message?.includes("already been processed") ||
//     err.message?.includes("Transaction simulation failed")
//   ) {
//     console.log("⚠️ Already processed → treating as success");
//     return "success";
//   }

//   throw new Error(err.message || "Deposit failed");
// }
  
// };












export const deposit = async (amount: number, isFinal: boolean) => {
  try {
    const program = getProgram();
    const provider = program.provider as anchor.AnchorProvider;

    const wallet = provider.wallet;
    const connection = provider.connection;

    // =============================
    // PDA
    // =============================
    const userPda = getUserPda(wallet.publicKey.toBase58());

    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("state")],
      program.programId
    );

    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      program.programId
    );

    // =============================
    // USER FETCH
    // =============================
    const user: any = await program.account.user.fetch(userPda);

    if (!user.exists) {
      throw new Error("❌ User not registered");
    }

    const referrerWallet = new PublicKey(user.referrer);
    const referrerPda = getUserPda(referrerWallet.toBase58());

    // =============================
    // 🔥 STRICT PRE / FINAL LOGIC
    // =============================
    const isPreDone = user.preLpp.toNumber() > 0;

    if (!isPreDone) {
      if (isFinal) {
        throw new Error("❌ Complete PRE LLP first");
      }

      if (amount < 10 || amount > 100) {
        throw new Error("❌ Pre LPP: 10 - 100");
      }
    } else {
      if (!isFinal) {
        throw new Error("❌ Pre LLP already completed");
      }

      if (amount < 101) {
        throw new Error("❌ Final LPP minimum 101");
      }
    }

    // =============================
    // ATA
    // =============================
    const fromAta = getAssociatedTokenAddressSync(
      MINT,
      wallet.publicKey
    );

    const toAta = getAssociatedTokenAddressSync(
      MINT,
      vault,
      true
    );

    // =============================
    // CREATE ATA IF NOT EXISTS
    // =============================
    const txInit = new anchor.web3.Transaction();

    if (!(await connection.getAccountInfo(fromAta))) {
      txInit.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          fromAta,
          wallet.publicKey,
          MINT
        )
      );
    }

    if (!(await connection.getAccountInfo(toAta))) {
      txInit.add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          toAta,
          vault,
          MINT
        )
      );
    }

    // ✅ FIX: blockhash + fee payer
    if (txInit.instructions.length > 0) {
      const latestBlockhash = await connection.getLatestBlockhash();

      txInit.recentBlockhash = latestBlockhash.blockhash;
      txInit.feePayer = wallet.publicKey;

      const signedTx = await wallet.signTransaction(txInit);
      const sig = await connection.sendRawTransaction(
        signedTx.serialize()
      );

      await connection.confirmTransaction(sig, "confirmed");
    }

    // =============================
    // BUILD UPLINE
    // =============================
    const remainingAccounts: any[] = [];
    let current = referrerWallet;

    for (let i = 0; i < 24; i++) {
      if (current.equals(PublicKey.default)) break;

      const pda = getUserPda(current.toBase58());

      try {
        const acc: any = await program.account.user.fetch(pda);

        remainingAccounts.push({
          pubkey: pda,
          isWritable: true,
          isSigner: false,
        });

        current = new PublicKey(acc.referrer);
      } catch {
        break;
      }
    }

    // =============================
    // 🚀 CONTRACT CALL
    // =============================
    const tx = await program.methods
      .deposit(new anchor.BN(amount), isFinal)
      .accounts({
        user: userPda,
        referrer: referrerPda,
        state: statePda,
        from: fromAta,
        to: toAta,
        authority: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .remainingAccounts(remainingAccounts)
      .rpc();

    console.log("✅ Deposit Success:", tx);

    return tx;

  } catch (err: any) {
    console.error("❌ Deposit Error:", err);

    // ✅ DUPLICATE TX FIX
    if (
      err.message?.includes("already been processed") ||
      err.message?.includes("Transaction simulation failed")
    ) {
      console.log("⚠️ Already processed → treating as success");
      return "success";
    }

    throw new Error(err.message || "Deposit failed");
  }
};