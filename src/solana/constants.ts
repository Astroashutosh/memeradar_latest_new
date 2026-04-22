import { PublicKey, Connection } from '@solana/web3.js';


// export const PROGRAM_ID = new PublicKey('3V2QQEjA76GXcPaK5o37KqoX77wrCiaZhoeK9zfkr7if');
export const PROGRAM_ID = new PublicKey('32WC5MqV17V7jttcEvkw7citNtyn4EaXFvAoVpBYs636');


export const globalPda = new PublicKey('6P8mGk4xYroggewr4XDhn3APvL8SVA252g3FtDmcvgpA');


export const vaultPda = new PublicKey("5cwrasJ16W3B19sfW2WfkKeZGVBqZCkXr3874CfXjo6L");

export const CLUSTER_URL = 'https://api.devnet.solana.com';
export const connection = new Connection(CLUSTER_URL, "confirmed");
export const ZERO = new PublicKey("11111111111111111111111111111111");

export const baseurl = "https://demo.dsvinfosolutions.com/bullbnb-solana-design/";
