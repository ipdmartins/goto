import { useEffect, useState } from "react";
import { SavedContributor } from "../home/tables/Contributors";
import { Badge, Col, Image, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function Contributors() {
  const [savedContributors, setSavedContributors] = useState<
    SavedContributor[]
  >([]);
  const [imgFailLoad, setImgFailLoad] = useState(false);
  const contributor = useSelector((state: RootState) => state.contributor);
  const navigate = useNavigate();

  function getBookmarks(): SavedContributor[] {
    const stored = localStorage.getItem("bookmarks");
    return stored ? JSON.parse(stored) : [];
  }

  useEffect(() => {
    const bookmarks = getBookmarks();
    setSavedContributors(bookmarks);
  }, []);

  return (
    <div>
      <Badge
        className="mb-2 badge-hover"
        bg="secondary"
        onClick={() => navigate(-1)}
      >
        {"‹‹back"}
      </Badge>
      <h4 className="text-center mt-4 mb-3">Bookmarked Contributors</h4>
      <h6 className="text-center">Top Repo contributor</h6>
      <div className="d-flex justify-content-center mb-3">
        <Row>
          <Col sm={2}>
            <Image
              src={contributor?.contributor?.avatar}
              alt=""
              rounded
              style={{ maxWidth: "40px", height: "auto" }}
              loading="lazy"
              onError={() => setImgFailLoad(true)}
            />
          </Col>
          <Col className="ms-3 mt-2"><span>{contributor?.contributor?.fullName}</span></Col>
        </Row>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Contributions</th>
          </tr>
        </thead>
        <tbody>
          {savedContributors.map((item, index) => {
            return (
              <tr key={index + item.avatar}>
                <td>{index + 1}</td>
                <td>
                  {!imgFailLoad ? (
                    <Image
                      src={item.avatar}
                      rounded
                      style={{ maxWidth: "30px", height: "auto" }}
                      loading="lazy"
                      onError={() => setImgFailLoad(true)}
                    />
                  ) : (
                    <span>Image failed to load</span>
                  )}
                </td>
                <td>{item.fullName}</td>
                <td>{item.contributions}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
