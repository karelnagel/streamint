import { useEffect, useState } from "react";
import { Donation } from "../graphql/generated";
import { coinName, short, toCoin } from "../idk/helpers";
import { getENS } from "../lib/ethers";

export function NewDonation({ donation }: { donation?: Donation }) {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState<string>();
  const [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    const effect = async () => {
      if (donation) {
        const { name, avatar } = await getENS(donation.donator.id);
        setName(name);
        setAvatar(avatar);
        setVisible(true);
        setTimeout(() => setVisible(false), 20000);
      }
    };
    effect();
  }, [donation]);

  return donation && visible ? (
    <div
      onClick={() => setVisible(false)}
      className="cursor-pointer bg-stream1 shadow-md flex items-center overflow-hidden space-x-10 uppercase font-bold text-lg pr-2 text-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {avatar && <img alt="" src={avatar} className="w-16 h-16" />}

      <p className="my-4 ml-4">{name ?? short(donation.donator.id)}</p>
      <p>
        {toCoin(donation.amount, donation.collection.coin)} {coinName(donation.collection.coin)}
      </p>
      <p>{`'${donation.message}'`}</p>
    </div>
  ) : (
    <div></div>
  );
}
