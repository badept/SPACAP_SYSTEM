# Activation — hướng dẫn chỉnh sửa

Code nằm trực tiếp trong thư mục này. Mở các trang HTML bằng trình duyệt hoặc dùng Live Server.

## Chọn đúng file

| Phần cần sửa | HTML | CSS | JavaScript |
| --- | --- | --- | --- |
| Giới thiệu, dashboard, thẻ năng lực | index.html | index.css | index.js |
| Nhóm người dùng, bảng Admin, so sánh, chỉ số | index.html | activation-roles.css | activation-roles.js |
| Quy trình và danh mục tính năng | activation-overview.html | activation-overview.css | activation-overview.js |
| Trải nghiệm App | activation-app.html | activation-app.css | activation-app.js |
| Điện thoại trong trang App | activation-app.html và template JS | activation-app-phone.css | activation-app.js |
| Responsive trang App | activation-app.html | activation-app-responsive.css | — |
| Header, footer, logo | Các trang HTML | header-footer.css | — |
| Trang Sampling đang chờ nội dung | activation-sampling.html | header-footer.css | — |

## Quy ước class

Tên dùng chữ thường và dấu gạch ngang: tiền tố khu vực + tên thành phần.

| Tiền tố | Phạm vi | Ví dụ |
| --- | --- | --- |
| site- | Header/footer/logo dùng chung | site-header, site-nav-link, site-footer |
| ui- | Thành phần giao diện dùng chung | ui-icon, ui-section-label, ui-skip-link |
| activation- | Trang giới thiệu | activation-capability-card, activation-dashboard |
| roles- | Phân tích nhóm người dùng | roles-audience-tab, roles-comparison-table |
| overview- | Tổng quan tính năng | overview-flow-card, overview-feature-menu-links |
| app- | Trải nghiệm và điện thoại | app-journey-link, app-detail-panel, app-phone-screen |
| state- | Trạng thái do JS điều khiển | state-active, state-selected, state-error |

Biến thể dùng hai dấu gạch ngang, ví dụ app-button--outline và activation-capability--sampling.
Tra tên cũ → tên mới trong [class-names.csv](class-names.csv).
Khi đổi class, cập nhật cả HTML, CSS, template JS, querySelector và classList.
ID và data-* là điểm nối cho điều hướng/tương tác; tên file roles mới vẫn dùng neo #role-analysis để giữ các liên kết.

## Nội dung động và CSS

- Nội dung App được khai báo trong screens; renderPhone dựng màn hình điện thoại, show cập nhật phần chi tiết.
- placeholderScreens gom thông tin các màn hình đang chờ ảnh; các màn hình này hiện chỉ hiển thị nội dung minh họa.
- Thứ tự CSS App: activation-app.css → activation-app-phone.css → activation-app-responsive.css → header-footer.css.
- Giữ các quy tắc hidden, dialog, responsive và giảm chuyển động còn được tương tác sử dụng.
- CSS ngắn được viết trên một dòng; khối nhiều thuộc tính được xuống dòng để dễ sửa. Thứ tự cascade và media query được giữ nguyên.
- Các ảnh gốc trong assets được giữ lại để tiếp tục phát triển nội dung.
