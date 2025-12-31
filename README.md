🥗 Food Rescue System - Giải Cứu Thực Phẩm Thông Minh
Food Rescue là một hệ sinh thái ứng dụng (Backend & Mobile) được thiết kế để kết nối các cửa hàng thực phẩm với người dùng nhằm giải cứu các món ăn sắp hết hạn sử dụng. Dự án tích hợp Trí tuệ nhân tạo (AI) để tối ưu hóa quá trình ra quyết định và giảm thiểu lãng phí thực phẩm.

📱 Các Thành Phần Hệ Thống
Dự án bao gồm hai phần chính:

Backend API: Xử lý logic nghiệp vụ, quản lý dữ liệu và tích hợp AI.

Mobile App (Android): Giao diện người dùng hiện đại xây dựng bằng Kotlin Jetpack Compose.

🚀 Tính Năng Nổi Bật
🤖 Trợ Lý AI Tư Vấn (Gemini AI): Chatbot thông minh giúp người dùng chọn món dựa trên ngân sách, lịch sử mua hàng và danh sách thực phẩm thực tế đang có.

📍 Định Vị & GPS: Tìm kiếm và hiển thị quán ăn gần nhất dựa trên vị trí thực tế của người dùng.

⏰ Thời Gian Thực (Countdown): Đồng hồ đếm ngược cho các món ăn sắp hết hạn để tạo sự cấp bách cho việc giải cứu.

🔔 Thông Báo Đa Kênh: Hệ thống Notification báo trạng thái đơn hàng và nhắc nhở "giờ vàng" giải cứu.

🧹 Tự Động Vận Hành (Cron Job): Hệ thống tự động đóng món hết hạn và dọn dẹp dữ liệu/hình ảnh thừa vào lúc 00:00 hàng ngày.

📖 Tài Liệu API: Swagger UI giúp tra cứu và thử nghiệm API trực quan.

🛠 Công Nghệ Sử Dụng
Backend (Node.js)
Framework: Express.js

Database: PostgreSQL (Sequelize ORM)

AI Engine: Google Gemini Pro API

Security: JWT (JSON Web Token), Bcrypt

Docs: Swagger UI (OpenAPI 3.0)

Automation: Node-cron

Mobile App (Android)
Language: Kotlin

UI Toolkit: Jetpack Compose (Declarative UI)

Networking: Retrofit 2, OkHttp

Async: Kotlin Coroutines & Flow

Image Loading: Coil

Architecture: MVVM (Model-View-ViewModel)

📂 Cấu Trúc Thư Mục Dự Án
Plaintext

food-rescue-project/
├── backend/                # Source code Node.js
│   ├── src/
│   │   ├── config/         # DB, Swagger, Gemini Config
│   │   ├── controllers/    # Xử lý logic nghiệp vụ
│   │   ├── models/         # Định nghĩa bảng Database
│   │   ├── routes/         # Định nghĩa các đầu Endpoint API
│   │   ├── middleware/     # Auth & Phân quyền
│   │   └── utils/          # Cron Jobs & Helpers
│   └── DataBase.env        # File cấu hình môi trường
└── android-app/            # Source code Kotlin (Android Studio)
    ├── app/src/main/java/  # Logic UI, ViewModel, Repository
    └── ui/theme/           # Jetpack Compose UI Components
