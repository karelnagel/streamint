import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Collection,
  Donation,
  Supporter,
  useAccountCollectionsLazyQuery,
  useAccountDonationsLazyQuery,
  useAccountSupportedLazyQuery,
} from "../../graphql/generated";
import { useRouter } from "next/router";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import { TokenObject } from "../../components/TokenObject";
import { CollectionObject } from "../../components/CollectionObject";
import { NextPage } from "next";
import { coinName, getImage, toCoin } from "../../idk/helpers";
import Image from "next/image";
import Link from "next/link";
import { useEnsName, useEnsAvatar, useNetwork } from "wagmi";
import { collectionUrl } from "../../idk/urls";

const AccountPage: NextPage = () => {
  const router = useRouter();
  const { account, tab } = router.query as { account: string; tab?: string };
  const [value, setValue] = useState(0);

  const { activeChain: chain } = useNetwork();
  const [getDonations, donations] = useAccountDonationsLazyQuery({ variables: { owner: account }, context: { network: chain?.name } });
  const [getCollections, collections] = useAccountCollectionsLazyQuery({ variables: { owner: account }, context: { network: chain?.name } });
  const [getSupported, supported] = useAccountSupportedLazyQuery({ variables: { owner: account }, context: { network: chain?.name } });
  const { data: name } = useEnsName({ address: account });
  const { data: avatar } = useEnsAvatar({ addressOrName: account });
  useEffect(() => {
    if (tab) setValue(Number(tab));
  }, [tab]);

  useEffect(() => {
    if (value === 0) getCollections();
    else if (value === 1) getDonations();
    else if (value === 2) getSupported();
  }, [getCollections, getDonations, getSupported, value]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  if (!account) return <h1>No account found!</h1>;
  return (
    <>
      <Layout>
        <div className="max-w-screen-md mx-auto flex flex-col space-y-10 my-10 items-center">
          <div className="w-32 h-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="rounded-full shadow-lg" src={avatar ?? "/logo.png"} alt={name ?? account} />
          </div>
          <p className="uppercase font-bold text-lg">{name ?? account}</p>
          <Tabs value={value} onChange={handleChange} centered variant="fullWidth" className="w-full">
            <Tab label="Collections" />
            <Tab label="Donations" />
            <Tab label="Supported collections" />
          </Tabs>
          <div className="max-w-md flex flex-col space-y-4">
            {value === 0 &&
              (collections.loading ? (
                <CircularProgress />
              ) : (
                collections.data?.collections.map((c, i) => <CollectionObject collection={c as Collection} key={i} />)
              ))}
            {value === 1 &&
              (donations.loading ? <CircularProgress /> : donations.data?.donations.map((d, i) => <TokenObject key={i} token={d as Donation} />))}
            {value === 2 &&
              (supported.loading ? (
                <CircularProgress />
              ) : (
                supported.data?.supporters.map((s, i) => <SupporterObject key={i} supporter={s as Supporter} />)
              ))}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AccountPage;

function SupporterObject({ supporter, network }: { supporter: Supporter; network?: string }) {
  const { activeChain: chain } = useNetwork();

  return (
    <Link href={collectionUrl(supporter.collection.id, chain?.name)} passHref>
      <div className="flex justify-center items-center bg-project space-x-10 p-4 rounded-lg cursor-pointer">
        <div className="relative w-20 h-20">
          <Image alt="" src={getImage(supporter.collection.image)} layout="fill" />
        </div>
        <div>
          <p>{supporter.collection.name}</p>
          <p>
            {toCoin(supporter.donated)} {coinName(supporter.collection.coin.id)}
          </p>
          <p>{supporter.donationsCount} times</p>
        </div>
      </div>
    </Link>
  );
}
