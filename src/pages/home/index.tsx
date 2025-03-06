import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import {
  addRepository,
  IRepoData,
  IContributorsProps,
} from "../../redux/repoSlice";
import { AppDispatch, RootState } from "../../redux/store";
import Contributions from "./tables/Contributions";
import Contributors from "./tables/Contributors";

export default function Home() {
  const [repoData, setRepoData] = useState<IRepoData>({
    owner: "",
    repo: "",
    name: "",
    description: "",
    language: "",
    license: "",
    stars: 0,
    followers: 0,
    contributors: [],
    topCompanies: [],
    topLocations: [],
    lastUpdated: 0,
  });
  const dispatch = useDispatch<AppDispatch>();
  const repositories = useSelector(
    (state: RootState) => state.repositories.repositories
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchRepo = `${repoData.owner}/${repoData.repo}`;
    localStorage.setItem("currentRepo", JSON.stringify(searchRepo));

    const repoExists = repositories[searchRepo];
    const oneHour = 60 * 60 * 1000;
    if (repoExists && Date.now() - repoExists.lastUpdated < oneHour) {
      setRepoData(repoExists);
      return;
    }

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

      const compiledData: IContributorsProps[] = [];

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

      const compileCompanies = Object.entries(companyContributions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 14);

      const compileLocations = Object.entries(locationContributions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 14);

      setRepoData({
        ...repoData,
        name: repoRespData.name,
        description: repoRespData.description,
        language: repoRespData.language,
        license: repoRespData.license.name,
        stars: repoRespData.stargazers_count,
        followers: repoRespData.subscribers_count,
        contributors: compiledData,
        topCompanies: compileCompanies,
        topLocations: compileLocations,
      });

      dispatch(
        addRepository({
          owner: repoData.owner,
          repo: repoData.repo,
          name: repoRespData.name,
          description: repoRespData.description,
          language: repoRespData.language,
          license: repoRespData.license.name,
          stars: repoRespData.stargazers_count,
          followers: repoRespData.subscribers_count,
          contributors: compiledData,
          topCompanies: compileCompanies,
          topLocations: compileLocations,
          lastUpdated: Date.now(),
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("currentRepo");
    
    if (stored) {
      const format = JSON.parse(stored);
      const repoExists = repositories[format];
      if(repoExists){
        setRepoData(repoExists);
      }
    }
  }, [])

  return (
    <div>
      <h4 className="text-center mb-4">Open-Source Contribution Analyser</h4>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row className="g-3 align-items-end">
          <Col xs="auto">
            <Form.Group controlId="formRepoOwner">
              <Form.Label>Owner</Form.Label>
              <Form.Control
                style={{ width: "400px" }}
                type="text"
                placeholder="Enter a repository owner"
                value={repoData.owner}
                onChange={(e) => {
                  setRepoData({ ...repoData, owner: e.target.value });
                }}
              />
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Form.Group controlId="formRepoName">
              <Form.Label>Repository</Form.Label>
              <Form.Control
                style={{ width: "400px" }}
                type="text"
                placeholder="Enter the repo name"
                value={repoData.repo}
                onChange={(e) => {
                  setRepoData({ ...repoData, repo: e.target.value });
                }}
              />
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
      {repoData.name != "" && (
        <>
          <Card className="p-2">
            <Card.Title>Repository details</Card.Title>
            <Row className="mt-2">
              <Col sm={5}>
                <Form.Group controlId="nameRepoForm">
                  <Form.Label className="mb-0">Name</Form.Label>
                  <Form.Control onChange={()=>{}} value={repoData.name} />
                </Form.Group>
              </Col>
              <Col sm={7}>
                <Form.Group controlId="descRepoForm">
                  <Form.Label className="mb-0">Description</Form.Label>
                  <Form.Control onChange={()=>{}} value={repoData.description} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Form.Group controlId="languageRepoForm">
                  <Form.Label className="mb-0">Language</Form.Label>
                  <Form.Control onChange={()=>{}} value={repoData.language} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="licenseRepoForm">
                  <Form.Label className="mb-0">License</Form.Label>
                  <Form.Control onChange={()=>{}} value={repoData.license} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="starsRepoForm">
                  <Form.Label className="mb-0">Stars</Form.Label>
                  <Form.Control onChange={()=>{}} value={repoData.stars} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="followersRepoForm">
                  <Form.Label className="mb-0">Followers</Form.Label>
                  <Form.Control onChange={()=>{}} value={repoData.followers} />
                </Form.Group>
              </Col>
            </Row>
          </Card>
          <Contributors dataList={repoData.contributors} />
          <Row className="mt-4 p-3">
            <Col className="me-2">
              <Contributions
                title="Companies"
                dataList={repoData.topCompanies}
              />
            </Col>
            <Col className="ms-2">
              <Contributions
                title="Locations"
                dataList={repoData.topLocations}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
