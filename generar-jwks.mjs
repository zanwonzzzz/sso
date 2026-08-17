import { generateKeyPair, exportJWK } from 'jose';

const { privateKey } = await generateKeyPair('RS256', { extractable: true });
const jwk = await exportJWK(privateKey);
jwk.use = 'sig';
jwk.alg = 'RS256';
jwk.kid = 'sig-' + Date.now();

console.log(JSON.stringify({ keys: [jwk] }));