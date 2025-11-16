const mockBusData = [
  {
    id: "01",
    name: "Xe 01",
    plate: "29A-12345",
    driver: "Trần Văn Bảo",
    route: {
      name: "Tuyến 1: Quận 1 - Quận 3",
      stops: [
        {
          id: "s1",
          name: "Điểm đón 1 (Quận 1)",
          status: "pending",
          time: "06:30",
          position: { lat: 10.7769, lng: 106.7009 }, // Chợ Bến Thành
        },
        {
          id: "s2",
          name: "Điểm đón 2 (Lê Lợi)",
          status: "pending",
          time: "06:40",
          position: { lat: 10.7743, lng: 106.6983 }, // Đường Lê Lợi
        },
        {
          id: "s3",
          name: "Điểm đón 3 (Nguyễn Huệ)",
          status: "pending",
          time: "06:50",
          position: { lat: 10.774, lng: 106.7035 }, // Đường Nguyễn Huệ
        },
        {
          id: "s4",
          name: "Điểm đón 4 (Quận 3)",
          status: "pending",
          time: "07:00",
          position: { lat: 10.786, lng: 106.69 }, // Quận 3
        },
        {
          id: "s5",
          name: "Trường học",
          status: "pending",
          time: "07:15",
          position: { lat: 10.7624, lng: 106.6822 }, // Trường học
        },
      ],
    },
    students: 25,
    status: "running",
    position: { lat: 10.7769, lng: 106.7009 }, // Bắt đầu từ điểm đón 1
  },
  {
    id: "02",
    name: "Xe 02",
    plate: "29B-67890",
    driver: "Lê Thị Cún",
    route: {
      name: "Tuyến 2: Quận 2 - Bình Thạnh",
      stops: [
        {
          id: "s6",
          name: "Điểm đón A (Quận 2)",
          status: "completed",
          time: "06:30",
          position: { lat: 10.7941, lng: 106.72 },
        },
        {
          id: "s7",
          name: "Điểm đón B (Thảo Điền)",
          status: "current",
          time: "06:45",
          position: { lat: 10.805, lng: 106.74 },
        },
        {
          id: "s8",
          name: "Điểm đón C (Bình Thạnh)",
          status: "pending",
          time: "07:00",
          position: { lat: 10.81, lng: 106.71 },
        },
        {
          id: "s9",
          name: "Trường học",
          status: "pending",
          time: "07:15",
          position: { lat: 10.7624, lng: 106.6822 },
        },
      ],
    },
    students: 25,
    status: "running",
    position: { lat: 10.794155, lng: 106.7 },
  },
  {
    id: "03",
    name: "Xe 03",
    plate: "29C-11111",
    driver: "Phạm Văn Danh",
    route: {
      name: "Tuyến 3: Quận 10 - Tân Bình",
      stops: [
        {
          id: "s10",
          name: "Điểm đón X (Quận 10)",
          status: "pending",
          time: "06:45",
          position: { lat: 10.7627, lng: 106.6601 },
        },
        {
          id: "s11",
          name: "Điểm đón Y (Tân Bình)",
          status: "pending",
          time: "07:00",
          position: { lat: 10.7991, lng: 106.6544 },
        },
        {
          id: "s12",
          name: "Trường học",
          status: "pending",
          time: "07:15",
          position: { lat: 10.7624, lng: 106.6822 },
        },
      ],
    },
    students: 25,
    status: "stopped",
    position: { lat: 10.762622, lng: 106.660172 },
  },
];

export default mockBusData;
