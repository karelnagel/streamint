import React, { createRef, useState } from "react";
import { useContractQuery } from "../../../graphql/generated";
import { NextPage } from "next";
import Layout from "../../../components/Layout";
import { defaultProjectInfo, ProjectInfo } from "../../../interfaces/ProjectInfo";
import useSigning from "../../../hooks/useSigning";
import { useRouter } from "next/router";
import useContract from "../../../hooks/useContract";

const NewProject: NextPage = () => {
  const {
    query: { title },
  } = useRouter();
  const { data } = useContractQuery({ variables: { id: title?.toString() } });
  const [coin, setCoin] = useState("");
  const [owner, setOwner] = useState("");
  const fileInput = createRef<HTMLInputElement>();
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(defaultProjectInfo);
  const { newProject } = useContract({ contractAddress: data?.contract?.address });
  const { uploadData } = useSigning();

  const newPro = async (e: any) => {
    e.preventDefault();

    if (!data?.contract) return;
    if (!fileInput.current?.files![0]) return console.log("no image");

    const error = await newProject(coin, owner);
    if (error) return console.log(error);

    const result = uploadData(data.contract.id, data.contract.projects[0].count, projectInfo, fileInput.current.files[0]);
    if (!result) return console.log("error uploading data");

    console.log("success");
  };

  if (!data?.contract) return <h1>No contract found!</h1>;
  return (
    <>
      <Layout>
        <div>
          <h2>Start new project</h2>
          <form action="">
            <input type="text" placeholder="coin" onChange={(e) => setCoin(e.target.value)} required />
            <input type="text" placeholder="project owner" onChange={(e) => setOwner(e.target.value)} required />
            <br />
            <input type="file" ref={fileInput} />
            <input type="text" placeholder="name" onChange={(e) => setProjectInfo((p) => ({ ...p, name: e.target.value }))} />
            <input type="text" placeholder="description" onChange={(e) => setProjectInfo((p) => ({ ...p, description: e.target.value }))} />
            <input type="number" placeholder="goal" onChange={(e) => setProjectInfo((p) => ({ ...p, goal: e.target.value }))} />
            <input type="text" placeholder="url" onChange={(e) => setProjectInfo((p) => ({ ...p, external_url: e.target.value }))} />
            <input
              type="text"
              placeholder="twitter"
              onChange={(e) => setProjectInfo((p) => ({ ...p, socials: { ...p.socials, twitter: e.target.value } }))}
            />
            <button type="submit" onClick={newPro}>
              Start project
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default NewProject;
