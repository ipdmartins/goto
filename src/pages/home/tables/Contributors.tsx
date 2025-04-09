import {
  Badge,
  Button,
  Image,
  Modal,
  OverlayTrigger,
  Stack,
  Table,
  Tooltip,
} from "react-bootstrap";
import { BookmarkStarFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PieChartModel from "../charts/PieChartModel";

export interface IBookmarkItem {
  avatar: string;
  company: string;
  contributions: number;
  fullName: string;
  location: string;
  userName: string;
}

export interface tableProps {
  dataList: IBookmarkItem[];
}

export interface SavedContributor {
  avatar: string;
  fullName: string;
  contributions: number;
};

export default function Contributors({ dataList }: tableProps) {
  const [savedContributors, setSavedContributors] = useState<
    SavedContributor[]
  >([
    {
      avatar: "",
      fullName: "",
      contributions: 0,
    },
  ]);
  const [listSaved, setListSaved] = useState<string[]>([]);
  const [imgFailLoad, setImgFailLoad] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const handleClose = () => {
    setOpenModal(!openModal);
  };

  function getBookmarks() {
    const stored = localStorage.getItem("bookmarks");
    return stored ? JSON.parse(stored) : [];
  }

  function handleBookmark(data: IBookmarkItem) {
    const exists = savedContributors.find(
      (item) => item.avatar === data.avatar
    );

    if (!exists) {
      const newData = savedContributors;
      newData.push({
        avatar: data.avatar,
        fullName: data.fullName,
        contributions: data.contributions,
      });
      setSavedContributors(newData);
      setListSaved((prev) => [...prev, data.avatar]);
      localStorage.setItem("bookmarks", JSON.stringify(newData));
    }
  }

  useEffect(() => {
    const bookmarks = getBookmarks();
    const list: string[] = [];
    bookmarks.forEach((item: IBookmarkItem) => {
      list.push(item.avatar);
    });
    setListSaved(list);
    setSavedContributors(bookmarks);
  }, []);

  return (
    <div className="mt-4">
      <Stack direction="horizontal" gap={3} className="d-flex align-items-center">
        <h5>Top 30 Contributors</h5>
        <Badge
          className="mb-2 badge-hover"
          bg="primary"
          onClick={() => setOpenModal(true)}
        >
          View Chart
        </Badge>
        <div className="flex-grow-1" />
        <Badge
          className="mb-2 badge-hover"
          bg="primary"
          onClick={() => navigate("/contributors")}
        >
          Verify my bookmarks
        </Badge>
      </Stack>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item, index) => {
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
                <td>{item.userName}</td>
                <td>{item.contributions}</td>
                <td>{item.fullName || "N/A"}</td>
                <td>{item.company || "N/A"}</td>
                <td>{item.location || "N/A"}</td>
                <td className="text-center">
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip id={index + item.fullName}>
                        <span>
                        Click to bookmark
                        </span>
                      </Tooltip>
                    }
                  >
                    <Button
                      className="m-0 p-1"
                      variant="outline-secondary"
                      disabled={listSaved.includes(item.avatar)}
                      onClick={() => {
                        handleBookmark(item);
                      }}
                    >
                      <BookmarkStarFill
                        size={15}
                        color={
                          listSaved.includes(item.avatar)
                            ? "#0a6f2b"
                            : "#159fdb"
                        }
                      />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Modal
        show={openModal}
        size="lg"
        centered
        dialogClassName="custom-modal"
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Top Contributors Chart</Modal.Title>
        </Modal.Header>
        <PieChartModel dataList={dataList} />
      </Modal>
    </div>
  );
}
