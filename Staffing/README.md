# Acacy website source

Gói mã nguồn gồm hai trang đã chỉnh sửa:
- acacy-systems.html: Overview.
- staffing.html: Staffing, gồm 6 mục vòng đời nhân sự.

CSS, JavaScript và hình ảnh được nhúng trực tiếp trong các file HTML. Không cần npm, build hoặc tải thêm thư viện.

Cách cập nhật:
1. Sao lưu website hiện tại.
2. Đưa hai file HTML lên cùng thư mục trên hosting.
3. Mở acacy-systems.html để xem Overview; mở staffing.html để xem Staffing.
4. Nếu muốn Overview là trang chủ index.html, đổi tên acacy-systems.html thành index.html và thay mọi liên kết acacy-systems.html trong staffing.html thành index.html (bao gồm liên kết có #).

Các đường dẫn Fieldforce và Activation hiện là liên kết neo trong trang Overview. Gói này không có trang riêng cho hai mục đó.

Dashboard sử dụng dữ liệu minh họa. Các nút và màn hình là giao diện trình diễn, chưa kết nối backend hoặc hệ thống nghiệp vụ thực tế.
