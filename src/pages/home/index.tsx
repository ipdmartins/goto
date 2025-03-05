import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

type ContributorsProps = {
  avatar: string;
  userName: string;
  contributions: number;
  fullName: string;
  company: string;
  location: string;
};

interface RepoData {
  owner: string;
  repo: string;
  name: string;
  description: string;
  language: string;
  license: string;
  stars: number;
  followers: number;
  contributors: ContributorsProps[];
}

export default function Home() {
  const [repoData, setRepoData] = useState<RepoData>({
    owner: "",
    repo: "",
    name: "",
    description: "",
    language: "",
    license: "",
    stars: 0,
    followers: 0,
    contributors: [],
  });

  const [topCompanies, setTopCompanies] = useState<[string, number][]>([]);
  const [topLocations, setTopLocations] = useState<[string, number][]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const companyContributions: Record<string, number> = {};
    const locationContributions: Record<string, number> = {};

    try {
      const repoResp = await fetch(
        `https://api.github.com/repos/${repoData.owner}/${repoData.repo}`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        }
      );
      if (!repoResp.ok) {
        throw new Error("Failed to fetch repo data");
      }
      const repoRespData = await repoResp.json();

      const contributorsResp = await fetch(
        `https://api.github.com/repos/${repoData.owner}/${repoData.repo}/contributors?per_page=30`,
        {
          method: "GET",
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
          },
        }
      );
      if (!contributorsResp.ok) {
        throw new Error("Failed to fetch contributors data");
      }
      const contributorsRespData = await contributorsResp.json();

      const compiledData: ContributorsProps[] = [];

      console.log(contributorsRespData);

      await Promise.all(
        contributorsRespData.map(async (contributor: any) => {
          const contributorResp = await fetch(contributor.url, {
            method: "GET",
            headers: {
              Accept: "application/vnd.github.v3+json",
              Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            },
          });
          if (!contributorResp.ok) {
            throw new Error("Failed to fetch contributor data");
          }
          const contributorRespData = await contributorResp.json();

          if (contributorRespData.company) {
            companyContributions[contributorRespData.company] =
              (companyContributions[contributorRespData.company] || 0) + 1;
          }

          if (contributorRespData.location) {
            locationContributions[contributorRespData.location] =
              (locationContributions[contributorRespData.location] || 0) + 1;
          }

          compiledData.push({
            avatar: contributorRespData.avatar_url,
            userName: contributorRespData.login,
            contributions: contributor.contributions,
            fullName: contributorRespData.name,
            company: contributorRespData.company,
            location: contributorRespData.location,
          });
        })
      );

      console.log(companyContributions);
      const compileCompanies = Object.entries(companyContributions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14);
      console.log(compileCompanies);
      
      console.log(locationContributions);
      const compileLocations = Object.entries(locationContributions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14);
      console.log(compileLocations);

      setRepoData({
        ...repoData,
        name: repoRespData.name,
        description: repoRespData.description,
        language: repoRespData.language,
        license: repoRespData.license.name,
        stars: repoRespData.stargazers_count,
        followers: repoRespData.subscribers_count,
        contributors: compiledData,
      });
      setTopCompanies(compileCompanies);
      setTopLocations(compileLocations);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const search = async () => {};
    search();
  }, []);
  
  return (
    <div>
      <h1>Open-Source Contribution Analyser</h1>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group as={Row} className="mb-3" controlId="formRepoOwner">
          <Form.Label column sm="2">
            Owner
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Enter an owner name"
              value={repoData.owner}
              onChange={(e) => {
                setRepoData({ ...repoData, owner: e.target.value });
              }}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formRepoName">
          <Form.Label column sm="2">
            Repository
          </Form.Label>
          <Col sm="10">
            <Form.Control
              type="text"
              placeholder="Enter the repo name"
              value={repoData.repo}
              onChange={(e) => {
                setRepoData({ ...repoData, repo: e.target.value });
              }}
            />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
      {repoData.name != "" && (
        <>
          <div>
            <p>Name: {repoData.name}</p>
            <p>Description: {repoData.description}</p>
            <p>Language: {repoData.language}</p>
            <p>License: {repoData.license}</p>
            <p>Stars: {repoData.stars}</p>
            <p>Followers: {repoData.followers}</p>
          </div>
          <Row>
            <Col>
              <Row>
                <h3>Top Companies Contributions</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Contributions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCompanies.map((item, index) => {
                      return (
                        <tr key={index + item[0]}>
                          <td>{item[0]}</td>
                          <td>{item[1]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Row>
              <Row>
                <h3>Top Contributors by Locations</h3>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Contributions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topLocations.map((item, index) => {
                      return (
                        <tr key={index + item[0]}>
                          <td>{item[0]}</td>
                          <td>{item[1]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Row>
            </Col>
            <Col>
              <h3>Top 30 Contributors</h3>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Avatar</th>
                    <th>Username</th>
                    <th>Contributions</th>
                    <th>Full Name</th>
                    <th>Company</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {repoData.contributors.map((item, index) => {
                    return (
                      <tr key={index + item.avatar}>
                        <td>{index + 1}</td>
                        <td>
                          <Image
                            src={item.avatar}
                            rounded
                            style={{ maxWidth: "30px", height: "auto" }}
                          />
                        </td>
                        <td>{item.userName}</td>
                        <td>{item.contributions}</td>
                        <td>{item.fullName || "N/A"}</td>
                        <td>{item.company || "N/A"}</td>
                        <td>{item.location || "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
