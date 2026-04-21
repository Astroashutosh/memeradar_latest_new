import { PublicKey, Connection } from '@solana/web3.js';

// export const PROGRAM_ID = new PublicKey('2BeffbNsCspUKr15Rcnz5N2mNqrxbvMrKC2fGES2NPAC');
// export const PROGRAM_ID = new PublicKey('3k981PCtLfaMi4Td8XUe1tXtRWpBgBxQvZ34UfzQiZT9');
export const PROGRAM_ID = new PublicKey('3V2QQEjA76GXcPaK5o37KqoX77wrCiaZhoeK9zfkr7if');

// export const globalPda = new PublicKey('CPVMZh57xAWqgN3DmjC3nhkaKoywqnfXU3jyBU8b2FUL');
// export const globalPda = new PublicKey('4JX8tqa3mUEKVWBrEsLmfYQHfShZyW8YDBfDE33JhDGb');
export const globalPda = new PublicKey('6P8mGk4xYroggewr4XDhn3APvL8SVA252g3FtDmcvgpA');

// export const vaultPda = new PublicKey("7S2AwHoPCcQ5G2R1yNkuTMPFicWUw7G42pP3VbPjvPaU");
// export const vaultPda = new PublicKey("9b7i985YNCi6vqFXDhC2c5EBXmzBiH9rbyvCyrzMVRU");
export const vaultPda = new PublicKey("5cwrasJ16W3B19sfW2WfkKeZGVBqZCkXr3874CfXjo6L");

export const CLUSTER_URL = 'https://api.devnet.solana.com';
export const connection = new Connection(CLUSTER_URL, "confirmed");
export const ZERO = new PublicKey("11111111111111111111111111111111");

export const baseurl = "https://demo.dsvinfosolutions.com/bullbnb-solana-design/";
