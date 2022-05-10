import React, { useContext, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useContentQuery } from "../../graphql/generated";
import { Context } from "../../idk/context";
import { sameAddr, toCoin, toWei } from "../../idk/helpers";
import { TextField } from "@mui/material";
import Button from "../../components/Button";
import { uploadJson } from "../../lib/ipfs";
import useChain from "../../hooks/useChain";
import { publicKey } from "../../config";

const ProjectContent: NextPage = () => {
  const { title } = useRouter().query;
  const { user, load, setSnack } = useContext(Context);
  const { data } = useContentQuery({ variables: { title: title?.toString() }, pollInterval: 10000 });
  const { addContent } = useChain({ contractAddress: data?.collection?.address.id });

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [content, setContent] = useState("");

  const startVoteForm = async (e: any) => {
    e.preventDefault();
    load!(async () => {
      const jse = require("jsencrypt");
      var encrypt = new jse.JSEncrypt();
      encrypt.setPublicKey(publicKey);
      const encryptedContent = encrypt.encrypt(content);
      const hash = await uploadJson({ description, price, content: encryptedContent });
      if (!hash) return setSnack!("Error uploading content");
      console.log("Uploaded " + hash);

      const result = await addContent(hash);
      if (result) return setSnack!(result);
    }, "Adding content");
  };

  return (
    <Layout className="flex flex-col items-center space-y-10">
      <h1 className="text-3xl">Content</h1>
      {data?.collection && (
        <div className="w-full max-w-screen-sm mx-auto">
          {sameAddr(data.collection.owner?.id, user?.address) && (
            <div className="">
              <h3>Add content</h3>
              <form action="" onSubmit={startVoteForm}>
                <TextField
                  label="Description (visible to everyone)"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                />
                <TextField
                  label="Price to see"
                  inputProps={{ step: "any" }}
                  type="number"
                  value={toCoin(price, data.collection.coin.id)}
                  onChange={(e) => setPrice(toWei(e.currentTarget.value, data.collection?.coin.id).toString())}
                  required
                />
                <TextField
                  label="Content (visible to everyone who hold enough tokens)"
                  required
                  value={content}
                  onChange={(e) => setContent(e.currentTarget.value)}
                />

                <Button submit>Add content</Button>
              </form>
            </div>
          )}
          <div className="space-y-10">
            {data.collection.content.map((c) => (
              <div key={c.id}>
                <p>{c.description}</p>
                <p>{c.price}</p>
                <p>{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <Button href={`/${title}`}>Back</Button>
    </Layout>
  );
};

export default ProjectContent;
