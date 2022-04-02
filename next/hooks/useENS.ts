import { useEffect, useState } from "react";
import { getENS } from "../functions/ethers";
import { short } from "../helpers";

export default function useENS(address: string | null | undefined) {
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    useEffect(() => {
        (async ()=>{
            if (address) {
                const result = await getENS(address);
                setName(result.name ?? "");
                setAvatar(result.avatar ?? "");
            }
        })();
        return ()=>{
            setName("")
            setAvatar("")
        }
    }, [address]);
    return { name: name ? name : short(address), avatar }
}