import { GetStaticProps, NextPage } from "next";
import React from "react";
import { apolloRequest } from "../../idk/apollo";
import Layout from "../../components/Layout";
import { ProjectObject } from "../../components/ProjectObject";
import { Project, LatestProjectsDocument, LatestProjectsQueryResult } from "../../graphql/generated";

interface ProjectProps {
  projects: Project[];
}

const ProjectsPage: NextPage<ProjectProps> = ({ projects }) => {
  return (
    <Layout>
      <h1 className="my-10 text-center  text-3xl font-bold">Latest projects</h1>
      {projects && (
        <div className="flex flex-col space-y-4 max-w-screen-sm m-auto">
          {projects.map((p, i) => (
            <ProjectObject project={p} key={i} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<ProjectProps> = async () => {
  const result = await apolloRequest<LatestProjectsQueryResult>(LatestProjectsDocument, { first: 5 });
  const projects = result.data?.projects ? result.data.projects.map((p) => p as Project) : [];
  return {
    props: {
      projects,
    },
    revalidate: 60,
  };
};

export default ProjectsPage;
