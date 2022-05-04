import { Collection } from "../graphql/generated";
import { create, urlSource } from 'ipfs-http-client'
import { network } from "../config";

export async function ipfsUpload(collection: Collection, file?: any) {
    const image = file ? await uploadImage(file) : collection.image
    if (!image) return null
    console.log("image "+image)

    const hash = await uploadJson({ name: collection.name, description: collection.description, goal: collection.goal, url: collection.url, image, socials: collection.socials, donationOptions: collection.donationOptions })
    if (!hash) return null
    console.log("hash "+hash)

    const url = `https://streamint.infura-ipfs.io/ipfs/${hash}`
    const result = await pinToGraph(url)
    return result ? hash : null;
}

async function pinToGraph(url: string) {
    try {
        const client = create({ url: network.graphIpfs })
        const file = await client.add(urlSource(url))
        console.log("Pinned to graph!", url)
        return true
    }
    catch (e) {
        console.log(e)
        return false;
    }
}

const authorization = "Basic " + btoa(process.env.NEXT_PUBLIC_IPFS_PUBLIC + ":" + process.env.NEXT_PUBLIC_IPFS_PRIVATE);

async function uploadImage(file: any) {
    try {
        const ipfs = create({
            url: "https://ipfs.infura.io:5001/api/v0",
            headers: {
                authorization,
            },
        });
        const result = await ipfs.add(file)
        return result.cid.toString()
    }
    catch (e) {
        console.log(e);
        return null
    }
}
async function uploadJson(object: {}) {
    try {
        const ipfs = create({
            url: "https://ipfs.infura.io:5001/api/v0",
            headers: {
                authorization,
            },
        });
        const data = JSON.stringify(object, null, 2)
        const result = await ipfs.add(data)
        return result.cid.toString()
    }
    catch (e) {
        console.log(e);
        return null
    }
}