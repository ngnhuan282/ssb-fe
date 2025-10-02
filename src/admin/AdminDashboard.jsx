import React, { useState } from "react";
import "./AdminDashboard.css";
import {
  FaUsers,
  FaBus,
  FaRoute,
  FaUserTie,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaSearch,
  FaBell,
  FaClock,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const stats = {
    students: 250,
    drivers: 12,
    buses: 15,
    routes: 8,
    activeBuses: 12,
  };

  const students = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      grade: "Lớp 5A",
      route: "Tuyến 1",
      status: "active",
    },
    {
      id: 2,
      name: "Trần Thị B",
      grade: "Lớp 4B",
      route: "Tuyến 2",
      status: "active",
    },
    {
      id: 3,
      name: "Lê Văn C",
      grade: "Lớp 3A",
      route: "Tuyến 1",
      status: "inactive",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      grade: "Lớp 6A",
      route: "Tuyến 3",
      status: "active",
    },
  ];

  const drivers = [
    {
      id: 1,
      name: "Trần Văn Bảo",
      phone: "0901234567",
      bus: "Xe 01",
      route: "Tuyến 1",
      status: "on-duty",
    },
    {
      id: 2,
      name: "Lê Thị Cún",
      phone: "0912345678",
      bus: "Xe 02",
      route: "Tuyến 2",
      status: "on-duty",
    },
    {
      id: 3,
      name: "Phạm Văn Danh",
      phone: "0923456789",
      bus: "Xe 03",
      route: "Tuyến 3",
      status: "off-duty",
    },
  ];

  const buses = [
    {
      id: 1,
      plate: "29A-12345",
      capacity: 30,
      status: "running",
      driver: "Trần Văn Bảo",
      route: "Tuyến 1",
      location: "Quận 1",
    },
    {
      id: 2,
      plate: "29B-67890",
      capacity: 30,
      status: "running",
      driver: "Lê Thị Cún",
      route: "Tuyến 2",
      location: "Quận 2",
    },
    {
      id: 3,
      plate: "29C-11111",
      capacity: 30,
      status: "maintenance",
      driver: "-",
      route: "-",
      location: "Garage",
    },
  ];

  const routes = [
    {
      id: 1,
      name: "Tuyến 1",
      from: "Quận 1",
      to: "Trường ABC",
      students: 25,
      distance: "8.5 km",
    },
    {
      id: 2,
      name: "Tuyến 2",
      from: "Quận 2",
      to: "Trường ABC",
      students: 30,
      distance: "12 km",
    },
    {
      id: 3,
      name: "Tuyến 3",
      from: "Quận 10",
      to: "Trường ABC",
      students: 20,
      distance: "6 km",
    },
  ];

  const schedules = [
    {
      id: 1,
      date: "2025-10-01",
      time: "07:00",
      route: "Tuyến 1",
      bus: "Xe 01",
      driver: "Trần Văn Bảo",
    },
    {
      id: 2,
      date: "2025-10-01",
      time: "07:15",
      route: "Tuyến 2",
      bus: "Xe 02",
      driver: "Lê Thị Cún",
    },
    {
      id: 3,
      date: "2025-10-02",
      time: "07:00",
      route: "Tuyến 1",
      bus: "Xe 01",
      driver: "Trần Văn Bảo",
    },
  ];

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card stat-students">
          <div className="stat-icon">
            <FaUsers size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.students}</h3>
            <p>Học sinh</p>
          </div>
        </div>

        <div className="stat-card stat-drivers">
          <div className="stat-icon">
            <FaUserTie size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.drivers}</h3>
            <p>Tài xế</p>
          </div>
        </div>

        <div className="stat-card stat-buses">
          <div className="stat-icon">
            <FaBus size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.buses}</h3>
            <p>Xe buýt</p>
          </div>
        </div>

        <div className="stat-card stat-routes">
          <div className="stat-icon">
            <FaRoute size={32} />
          </div>
          <div className="stat-info">
            <h3>{stats.routes}</h3>
            <p>Tuyến đường</p>
          </div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card">
          <h3>
            <FaBus /> Xe đang hoạt động
          </h3>
          <div className="active-buses-list">
            {buses
              .filter((b) => b.status === "running")
              .map((bus) => (
                <div key={bus.id} className="active-bus-item">
                  <div className="bus-badge running">●</div>
                  <div>
                    <strong>{bus.plate}</strong>
                    <p>
                      {bus.route} - {bus.location}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="overview-card">
          <h3>
            <FaClock /> Lịch trình hôm nay
          </h3>
          <div className="schedule-list">
            {schedules
              .filter((s) => s.date === "2025-10-01")
              .map((schedule) => (
                <div key={schedule.id} className="schedule-item">
                  <div className="schedule-time">{schedule.time}</div>
                  <div className="schedule-info">
                    <strong>{schedule.route}</strong>
                    <p>
                      {schedule.bus} - {schedule.driver}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>
          <FaUsers /> Quản lý học sinh
        </h2>
        <button className="btn-primary">
          <FaPlus /> Thêm học sinh
        </button>
      </div>
      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Tìm kiếm học sinh..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Lớp</th>
              <th>Tuyến xe</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.route}</td>
                <td>
                  <span className={`badge ${student.status}`}>
                    {student.status === "active" ? "Đang học" : "Nghỉ học"}
                  </span>
                </td>
                <td>
                  <button className="btn-icon">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDrivers = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>
          <FaUserTie /> Quản lý tài xế
        </h2>
        <button className="btn-primary">
          <FaPlus /> Thêm tài xế
        </button>
      </div>
      <div className="search-bar">
        <FaSearch />
        <input type="text" placeholder="Tìm kiếm tài xế..." />
      </div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Điện thoại</th>
              <th>Xe được phân công</th>
              <th>Tuyến đường</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.id}</td>
                <td>{driver.name}</td>
                <td>{driver.phone}</td>
                <td>{driver.bus}</td>
                <td>{driver.route}</td>
                <td>
                  <span className={`badge ${driver.status}`}>
                    {driver.status === "on-duty" ? "Đang làm việc" : "Nghỉ"}
                  </span>
                </td>
                <td>
                  <button className="btn-icon">
                    <FaEdit />
                  </button>
                  <button className="btn-icon">
                    <FaEnvelope />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBuses = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>
          <FaBus /> Quản lý xe buýt
        </h2>
        <button className="btn-primary">
          <FaPlus /> Thêm xe
        </button>
      </div>
      <div className="buses-grid">
        {buses.map((bus) => (
          <div key={bus.id} className="bus-card">
            <div className="bus-card-header">
              <h3>{bus.plate}</h3>
              <span className={`badge ${bus.status}`}>
                {bus.status === "running"
                  ? "Đang chạy"
                  : bus.status === "maintenance"
                  ? "Bảo trì"
                  : "Đang dừng"}
              </span>
            </div>
            <div className="bus-card-body">
              <p>
                <strong>Sức chứa:</strong> {bus.capacity} chỗ
              </p>
              <p>
                <strong>Tài xế:</strong> {bus.driver}
              </p>
              <p>
                <strong>Tuyến:</strong> {bus.route}
              </p>
              <p>
                <strong>Vị trí:</strong> <FaMapMarkerAlt /> {bus.location}
              </p>
            </div>
            <div className="bus-card-footer">
              <button className="btn-secondary">Xem chi tiết</button>
              <button className="btn-secondary">
                <FaEdit /> Sửa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRoutes = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>
          <FaRoute /> Quản lý tuyến đường
        </h2>
        <button className="btn-primary">
          <FaPlus /> Thêm tuyến
        </button>
      </div>
      <div className="routes-grid">
        {routes.map((route) => (
          <div key={route.id} className="route-card">
            <div className="route-card-header">
              <h3>{route.name}</h3>
              <span className="route-distance">{route.distance}</span>
            </div>
            <div className="route-card-body">
              <div className="route-path">
                <div className="route-point start">
                  <FaMapMarkerAlt /> {route.from}
                </div>
                <div className="route-line"></div>
                <div className="route-point end">
                  <FaMapMarkerAlt /> {route.to}
                </div>
              </div>
              <p className="route-students">
                <FaUsers /> {route.students} học sinh
              </p>
            </div>
            <div className="route-card-footer">
              <button className="btn-secondary">Xem bản đồ</button>
              <button className="btn-secondary">
                <FaEdit /> Sửa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>
          <FaCalendarAlt /> Quản lý lịch trình
        </h2>
        <button className="btn-primary">
          <FaPlus /> Tạo lịch trình
        </button>
      </div>
      <div className="schedule-filters">
        <select>
          <option>Tuần này</option>
          <option>Tháng này</option>
          <option>Tùy chỉnh</option>
        </select>
        <select>
          <option>Tất cả tuyến</option>
          <option>Tuyến 1</option>
          <option>Tuyến 2</option>
        </select>
      </div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Tuyến đường</th>
              <th>Xe buýt</th>
              <th>Tài xế</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.date}</td>
                <td>{schedule.time}</td>
                <td>{schedule.route}</td>
                <td>{schedule.bus}</td>
                <td>{schedule.driver}</td>
                <td>
                  <button className="btn-icon">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="content-section">
      <div className="section-header">
        <h2>
          <FaEnvelope /> Gửi tin nhắn
        </h2>
      </div>
      <div className="message-compose">
        <div className="message-form">
          <div className="form-group">
            <label>Người nhận</label>
            <select>
              <option>Chọn đối tượng</option>
              <option>Tất cả tài xế</option>
              <option>Tất cả phụ huynh</option>
              <option>Tài xế cụ thể</option>
              <option>Phụ huynh cụ thể</option>
            </select>
          </div>
          <div className="form-group">
            <label>Tiêu đề</label>
            <input type="text" placeholder="Nhập tiêu đề tin nhắn..." />
          </div>
          <div className="form-group">
            <label>Nội dung</label>
            <textarea
              rows="6"
              placeholder="Nhập nội dung tin nhắn..."
            ></textarea>
          </div>
          <button className="btn-primary">
            <FaEnvelope /> Gửi tin nhắn
          </button>
        </div>
        <div className="recent-messages">
          <h3>Tin nhắn gần đây</h3>
          <div className="message-item">
            <div className="message-header">
              <strong>Thông báo nghỉ</strong>
              <span className="message-time">10:30 AM</span>
            </div>
            <p>Gửi đến: Tất cả phụ huynh</p>
          </div>
          <div className="message-item">
            <div className="message-header">
              <strong>Lịch trình mới</strong>
              <span className="message-time">09:15 AM</span>
            </div>
            <p>Gửi đến: Tất cả tài xế</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <FaBus size={32} />
          <h2>Admin SSB</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <FaChartLine /> Tổng quan
          </button>
          <button
            className={activeTab === "students" ? "active" : ""}
            onClick={() => setActiveTab("students")}
          >
            <FaUsers /> Học sinh
          </button>
          <button
            className={activeTab === "drivers" ? "active" : ""}
            onClick={() => setActiveTab("drivers")}
          >
            <FaUserTie /> Tài xế
          </button>
          <button
            className={activeTab === "buses" ? "active" : ""}
            onClick={() => setActiveTab("buses")}
          >
            <FaBus /> Xe buýt
          </button>
          <button
            className={activeTab === "routes" ? "active" : ""}
            onClick={() => setActiveTab("routes")}
          >
            <FaRoute /> Tuyến đường
          </button>
          <button
            className={activeTab === "schedule" ? "active" : ""}
            onClick={() => setActiveTab("schedule")}
          >
            <FaCalendarAlt /> Lịch trình
          </button>
          <button
            className={activeTab === "messages" ? "active" : ""}
            onClick={() => setActiveTab("messages")}
          >
            <FaEnvelope /> Tin nhắn
          </button>
        </nav>
      </div>

      <div className="admin-content">
        <div className="admin-header">
          <h1>
            {activeTab === "overview" && "Tổng quan hệ thống"}
            {activeTab === "students" && "Quản lý học sinh"}
            {activeTab === "drivers" && "Quản lý tài xế"}
            {activeTab === "buses" && "Quản lý xe buýt"}
            {activeTab === "routes" && "Quản lý tuyến đường"}
            {activeTab === "schedule" && "Quản lý lịch trình"}
            {activeTab === "messages" && "Gửi tin nhắn"}
          </h1>
          <div className="admin-header-actions">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">5</span>
            </button>
          </div>
        </div>

        <div className="admin-main">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "students" && renderStudents()}
          {activeTab === "drivers" && renderDrivers()}
          {activeTab === "buses" && renderBuses()}
          {activeTab === "routes" && renderRoutes()}
          {activeTab === "schedule" && renderSchedule()}
          {activeTab === "messages" && renderMessages()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
