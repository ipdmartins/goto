import { Badge, Button, Image, Modal, Stack, Table } from "react-bootstrap";
import { useState } from "react";
import PieChartModel from "../charts/PieChartModel";

export interface tableProps {
  dataList: 
    {
      avatar: string;
      company: string;
      contributions: number;
      fullName: string;
      location: string;
      userName: string;
    }[];
};
export default function Contributors({ dataList }: tableProps) {
    const [openModal, setOpenModal] = useState(false);
  
    const handleClose = () => {
      setOpenModal(!openModal);
    };
  
  return (
    <div className="mt-4">
      <Stack direction="horizontal" gap={3}>
      <h5>Top 30 Contributors</h5>
        <Badge
          className="mb-2 badge-hover"
          bg="info"
          onClick={() => setOpenModal(true)}
        >
          View Chart
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
                <td><Button>teste</Button></td>
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
