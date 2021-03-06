import { ethers, upgrades } from "hardhat";

const url = "https://streamint.xyz/api/tokens/";
async function main() {
  const Contract = await ethers.getContractFactory("Factory");

  const contract = await upgrades.deployProxy(Contract, [url], {
    kind: "uups",
  });
  await contract.deployed();

  console.log(`CONTRACT=<ADDRESS> yarn verify`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
