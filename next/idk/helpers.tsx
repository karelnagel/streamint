import { BigNumber, ethers } from "ethers";
import { ipfsGateway, networks } from "../config";

export function getProjectId(title: string, projectId: string | number) {
  return `${title}_p${projectId}`;
}
export function getTokenId(title: string, tokenId: string | number) {
  return `${title}_t${tokenId}`;
}

export function short(address: string | null | undefined) {
  if (!address) return "";
  return `${address.substr(0, 5)}...${address.substr(address.length - 5)}`;
}

export const sameAddr = (address1?: string, address2?: string) => {
  if (!address1 || !address2) return false;
  return address1.toLowerCase() === address2.toLowerCase();
};

export function getImage(hash: string) {
  return `${ipfsGateway}${hash}`;
}

export const toCoin = (wei: string, coin?: string) => {
  const decimals =
    networks
      .map((n) => n.coins)
      .flat()
      .find((c) => c.address === coin)?.decimals ?? 18;
  return wei ? ethers.utils.formatUnits(wei, decimals) : "0.0";
};

export const toWei = (ether: string, coin?: string) => {
  const decimals =
    networks
      .map((n) => n.coins)
      .flat()
      .find((c) => c.address === coin)?.decimals ?? 18;

  const etherWithOutOverflow = ether.slice(0, ether.indexOf(".") + decimals + 1);
  return ether ? ethers.utils.parseUnits(etherWithOutOverflow, decimals) : BigNumber.from(0);
};

export const toWeiStr = (ether: string, coin?: string) => {
  return toWei(ether, coin).toString();
};

export const coinName = (address?: string) => {
  return (
    networks
      .map((n) => n.coins)
      .flat()
      .find((c) => sameAddr(c.address, address))?.coin ?? "ERC20"
  );
};
