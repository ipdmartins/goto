import { Badge, Modal, Row, Stack, Table } from "react-bootstrap";
import { useState } from "react";
import RadialChartModel from "../charts/RadialChartModel";
import "./style.css";

type tableProps = {
  title: string;
  dataList: [string, number][];
};
export default function Contributions({ title, dataList }: tableProps) {
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(!openModal);
  };

  return (
    <Row>
      <Stack direction="horizontal" gap={3}>
        <h5>{`Top ${title} Contributions`}</h5>
        <Badge
          className="mb-2 badge-hover"
          bg="primary"
          onClick={() => setOpenModal(true)}
        >
          View Chart
        </Badge>
      </Stack>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{title}</th>
            <th>Contributions</th>
          </tr>
        </thead>
        <tbody>
          {dataList.map((item, index) => {
            return (
              <tr key={index + item[0]}>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
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
          <Modal.Title>{`${title} Chart`}</Modal.Title>
        </Modal.Header>
        <RadialChartModel dataChart={dataList} />
      </Modal>
    </Row>
  );
}
