import { ethers } from "ethers/";
import { domain } from "../idk/settings";

export async function getENS(address: string, provider?: ethers.providers.BaseProvider) {
    if (!provider) provider = new ethers.providers.InfuraProvider(process.env.NEXT_PUBLIC_NETWORK, process.env.NEXT_PUBLIC_INFURA_ID)

    try {
        const name = await provider.lookupAddress(address) ?? undefined
        const avatar = await provider.getAvatar(address) ?? undefined
        return { name, avatar }
    }
    catch (e) {
        console.log(e)
    }
    return {}
}
export function verifySignature(type: {}, data: {}, signature: string) {
    return ethers.utils.verifyTypedData(domain, type, data, signature)
}