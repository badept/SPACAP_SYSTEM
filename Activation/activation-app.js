(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  // Transparent vector glyphs keep the same feature symbols without screenshot backgrounds.
  const icon = (name) => {
    const symbol = name === 'login' ? 'lock' : name;
    return `<svg class="ui-icon" data-icon="${name}" aria-hidden="true"><use href="#i-${symbol}"/></svg>`;
  };
  const button = (label, action, cls = 'app-button') => `<button type="button" class="${cls}" data-action="${action}">${label}</button>`;
  const route = (id, label, cls = 'app-phone-tile') =>
    `<button type="button" class="${cls}" data-screen="${id}">${icon(screens.find((screen) => screen.id === id)?.icon || 'file')}<span>${label}</span></button>`;
  const systemAScreens = [
    {
      id: 'login',
      group: 'Bắt đầu',
      title: 'Đăng nhập & bảo mật tài khoản',
      icon: 'login',
      description: 'Tài khoản được Admin cấp và kiểm soát trong suốt quá trình làm việc.',
    },
    {
      id: 'home',
      group: 'Trang chủ',
      title: 'Trang chủ',
      icon: 'home',
      description: 'Cung cấp các chức năng chính của App.',
      actions: ['Chọn cửa hàng, Quick Test, Lịch làm việc, Tài liệu hoặc Báo cáo cửa hàng.'],
      result: 'Mở chức năng được lựa chọn.',
    },
    {
      id: 'quick-test',
      group: 'Trang chủ',
      title: 'Quick Test trước chấm công',
      icon: 'quick-test',
      description: 'Đảm bảo nhân viên nắm đúng kiến thức trước khi bắt đầu công việc tại điểm bán.',
      actions: [
        'Trả lời đủ 3 câu hỏi trên điện thoại.',
        'Gửi bài để xem số câu trả lời đúng.',
        'Đạt 3/3 câu để mở chấm công; có thể làm lại nếu chưa đạt.',
      ],
      result: 'Kết quả được tính theo câu trả lời thực tế trong bản trải nghiệm.',
    },
    {
      id: 'schedule',
      group: 'Trang chủ',
      title: 'Lịch làm việc',
      icon: 'calendar',
      description: 'Giúp nhân viên xem ngày, cửa hàng, ca và thời gian làm việc.',
      actions: ['Chọn ngày hoặc ca làm việc.'],
      result: 'Hiển thị thông tin lịch được phân công.',
    },
    {
      id: 'documents',
      group: 'Trang chủ',
      title: 'Tài liệu',
      icon: 'file',
      description: 'Cung cấp tài liệu hướng dẫn, quy định và thông tin chương trình.',
      actions: ['Chọn tài liệu cần xem.'],
      result: 'Mở nội dung tài liệu.',
    },
    {
      id: 'store-report',
      group: 'Trang chủ',
      title: 'Báo cáo cửa hàng',
      icon: 'store-report',
      description: 'Theo dõi hoặc xem lại kết quả báo cáo theo cửa hàng.',
      actions: ['Chọn cửa hàng hoặc kỳ báo cáo.'],
      result: 'Hiển thị kết quả đã ghi nhận.',
    },
    {
      id: 'store',
      group: 'Cửa hàng',
      title: 'Cửa hàng',
      icon: 'store',
      description: 'Giúp nhân viên nhận dữ liệu cửa hàng được phân công.',
      actions: ['Bấm nút mũi tên để đồng bộ.', 'Chờ App cập nhật dữ liệu.'],
      result: 'Hiển thị danh sách cửa hàng có lịch làm việc hôm nay.',
    },
    {
      id: 'sync',
      group: 'Cửa hàng',
      title: 'Đồng bộ dữ liệu',
      icon: 'sync',
      description: 'Cập nhật dữ liệu cửa hàng và công việc mới nhất.',
      actions: ['Bấm nút mũi tên đồng bộ.', 'Chờ quá trình cập nhật hoàn tất.'],
      result: 'Danh sách cửa hàng hôm nay sẵn sàng.',
    },
    {
      id: 'stores',
      group: 'Cửa hàng',
      title: 'Danh sách cửa hàng',
      icon: 'store',
      description: 'Hiển thị các cửa hàng nhân viên phải thực hiện trong ngày.',
      actions: ['Xem danh sách cửa hàng.', 'Chọn một cửa hàng.'],
      result: 'Mở màn hình Cửa hàng chi tiết.',
    },
    {
      id: 'store-detail',
      group: 'Chi tiết cửa hàng',
      title: 'Cửa hàng chi tiết',
      icon: 'store',
      description: 'Tập hợp thông tin và công việc tại cửa hàng đã chọn.',
      actions: ['Xem Thông tin, Ảnh tổng quan hoặc Báo cáo phải hoàn thành.'],
      result: 'Mở nội dung tương ứng.',
    },
    {
      id: 'store-information',
      step: 7,
      reference: true,
      group: 'Chi tiết cửa hàng',
      title: 'Thông tin cửa hàng',
      icon: 'info',
      description: 'Hiển thị tên, mã, địa chỉ và thông tin liên quan đến cửa hàng.',
      actions: ['Xem và đối chiếu thông tin cửa hàng.'],
      result: 'Xác nhận đúng điểm bán cần thực hiện.',
    },
    {
      id: 'photo',
      step: 8,
      reference: true,
      group: 'Chi tiết cửa hàng',
      title: 'Ảnh tổng quan',
      icon: 'photo',
      description: 'Ghi nhận hình ảnh tổng thể tại điểm bán.',
      actions: ['Xem hoặc ghi nhận ảnh tổng quan.'],
      result: 'Hình ảnh được liên kết với cửa hàng.',
    },
    {
      id: 'required-reports',
      step: 9,
      reference: true,
      group: 'Báo cáo phải hoàn thành',
      title: 'Báo cáo phải hoàn thành',
      icon: 'briefcase',
      description: 'Hiển thị danh sách công việc bắt buộc tại cửa hàng.',
      actions: ['Chọn báo cáo cần xem.'],
      result: 'Mở màn hình báo cáo tương ứng.',
    },
    {
      id: 'attendance',
      step: 10,
      reference: true,
      group: 'Báo cáo phải hoàn thành',
      title: 'Chấm công',
      icon: 'attendance',
      description: 'Ghi nhận thời gian và vị trí làm việc.',
      actions: ['Mở màn hình Chấm công.'],
      result: 'Dữ liệu chấm công được ghi nhận.',
    },
    {
      id: 'inventory',
      step: 11,
      reference: true,
      group: 'Báo cáo phải hoàn thành',
      title: 'Tồn kho',
      icon: 'inventory',
      description: 'Ghi nhận số lượng tồn kho tại cửa hàng.',
      actions: ['Mở màn hình Tồn kho.'],
      result: 'Dữ liệu tồn kho được ghi nhận.',
    },
    {
      id: 'price',
      step: 12,
      reference: true,
      group: 'Báo cáo phải hoàn thành',
      title: 'Báo cáo giá',
      icon: 'price',
      description: 'Ghi nhận giá bán tại điểm bán.',
      actions: ['Mở màn hình Báo cáo giá.'],
      result: 'Giá bán được ghi nhận.',
    },
    {
      id: 'program',
      step: 13,
      reference: true,
      group: 'Báo cáo phải hoàn thành',
      title: 'BC Chương trình',
      icon: 'program',
      description: 'Ghi nhận tình trạng triển khai chương trình.',
      actions: ['Mở màn hình BC Chương trình.'],
      result: 'Kết quả chương trình được ghi nhận.',
    },
    {
      id: 'competitor',
      step: 14,
      reference: true,
      group: 'Báo cáo phải hoàn thành',
      title: 'Báo cáo đối thủ',
      icon: 'competitor',
      description: 'Ghi nhận hoạt động của đối thủ tại điểm bán.',
      actions: ['Mở màn hình Báo cáo đối thủ.'],
      result: 'Thông tin đối thủ được ghi nhận.',
    },
    {
      id: 'display',
      step: 15,
      reference: true,
      group: 'Báo cáo phải hoàn thành',
      title: 'Chụp hình trưng bày POSM',
      icon: 'camera',
      description: 'Ghi nhận hình ảnh trưng bày POSM.',
      actions: ['Mở màn hình và chụp ảnh trưng bày.'],
      result: 'Hình ảnh POSM được ghi nhận.',
    },
    {
      id: 'sales',
      step: 16,
      reference: true,
      group: 'Báo cáo phải hoàn thành',
      title: 'Bán hàng và quà tặng',
      icon: 'sales',
      description: 'Ghi nhận bán hàng và quà tặng tại điểm bán.',
      actions: ['Mở màn hình Bán hàng và quà tặng.'],
      result: 'Kết quả bán hàng được ghi nhận.',
    },
    {
      id: 'breaktime',
      step: 17,
      reference: true,
      group: 'Báo cáo phải hoàn thành',
      title: 'Breaktime',
      icon: 'breaktime',
      description: 'Ghi nhận thời gian nghỉ trong ca.',
      actions: ['Mở màn hình Breaktime.'],
      result: 'Thời gian nghỉ được ghi nhận.',
    },
    {
      id: 'traffic',
      step: 18,
      reference: true,
      group: 'Báo cáo phải hoàn thành',
      title: 'Báo cáo Traffic',
      icon: 'traffic',
      description: 'Ghi nhận lượng người tiếp cận tại điểm bán.',
      actions: ['Mở màn hình Báo cáo Traffic.'],
      result: 'Dữ liệu traffic được ghi nhận.',
    },
  ];

  const primarySteps = ['login', 'home', 'store', 'sync', 'stores', 'store-detail'];
  systemAScreens.forEach((screen) => {
    if (!screen.step) screen.step = primarySteps.includes(screen.id) ? primarySteps.indexOf(screen.id) + 1 : 2;
  });
  const systemSContent = window.ACTIVATION_SYSTEM_S_CONTENT || {};
  const systemSScreens = systemAScreens.map((screen) => {
    const customContent = systemSContent[screen.id] || {};
    return {
      ...screen,
      ...customContent,
      actions: customContent.actions ? [...customContent.actions] : screen.actions ? [...screen.actions] : undefined,
    };
  });
  const shelfReportContent = systemSContent['shelf-report'] || {};
  const shelfReportScreen = {
    id: 'shelf-report',
    step: 15,
    reference: true,
    group: 'Báo cáo phải hoàn thành',
    title: 'Báo cáo ụ/kệ',
    icon: 'inventory',
    description: 'Ghi nhận tình trạng, số lượng và hình ảnh ụ/kệ tại điểm bán.',
    actions: ['Mở màn hình Báo cáo ụ/kệ.', 'Nhập thông tin và ghi nhận hình ảnh thực tế.'],
    result: 'Thông tin ụ/kệ được ghi nhận.',
    ...shelfReportContent,
    actions: shelfReportContent.actions
      ? [...shelfReportContent.actions]
      : ['Mở màn hình Báo cáo ụ/kệ.', 'Nhập thông tin và ghi nhận hình ảnh thực tế.'],
  };
  const competitorIndex = systemSScreens.findIndex((screen) => screen.id === 'competitor');
  systemSScreens.forEach((screen) => {
    if (screen.step > 14) screen.step += 1;
  });
  systemSScreens.splice(competitorIndex + 1, 0, shelfReportScreen);
  const systems = {
    a: { label: 'Hệ thống A', assetFolder: 'app-a', screens: systemAScreens },
    s: { label: 'Hệ thống S', assetFolder: 'app-s', screens: systemSScreens },
  };
  let activeSystem = 'a';
  let screens = systems[activeSystem].screens;
  let reportScreens = screens.filter((screen) => screen.group === 'Báo cáo phải hoàn thành' && screen.id !== 'required-reports');
  const freshState = () => ({
    name: 'Nguyễn Minh Anh',
    username: 'activation.demo',
    password: 'Demo@2026',
    inactive: false,
    changed: false,
    records: [],
  });
  const systemStates = { a: freshState(), s: freshState() };
  const systemCurrentScreens = { a: 'schedule', s: 'schedule' };
  let state = systemStates[activeSystem],
    current = 0,
    toastTimer,
    phoneImageAutoTimer;
  const modal = $('#app-modal');
  const imageDialog = $('#phone-image-dialog');
  const expandedImage = $('.app-image-expanded');
  const imageSizeToggle = $('.app-image-size-toggle');
  function openPhoneImage(source) {
    imageDialog.classList.remove('state-native');
    imageSizeToggle.setAttribute('aria-pressed', 'false');
    imageSizeToggle.textContent = 'Kích thước gốc';
    $('#phone-image-title').textContent = source.alt || 'Xem ảnh';
    expandedImage.alt = source.alt;
    expandedImage.onload = () => {
      expandedImage.style.setProperty('--source-width', `${expandedImage.naturalWidth}px`);
    };
    expandedImage.style.setProperty('--source-width', `${source.naturalWidth || 960}px`);
    expandedImage.src = source.currentSrc || source.src;
    if (!imageDialog.open) imageDialog.showModal();
    $('#phone-image-scroll').scrollTo(0, 0);
  }

  const notice = (message) => {
    $('#toast').textContent = message;
    $('#toast').classList.add('state-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#toast').classList.remove('state-shown'), 2000);
  };
  const openModal = (title, content) => {
    $('#modal-title').textContent = title;
    $('#modal-body').innerHTML = content;
    if (!modal.open) modal.showModal();
  };
  function renderJourneyMenu() {
    const groups = [...new Set(screens.map((screen) => screen.group))];
    $('#journey-menu').innerHTML = groups
      .map(
        (group, index) =>
          `<details class="app-journey-group" ${index < 2 ? 'open' : ''}><summary>${group}</summary><div class="app-journey-items">${screens
            .filter((screen) => screen.group === group)
            .map((screen, i) => route(screen.id, `${String(i + 1).padStart(2, '0')}. ${screen.title}`, 'app-journey-link'))
            .join('')}</div></details>`,
      )
      .join('');
  }

  function loginDetail() {
    const isSystemS = activeSystem === 's';
    const steps = [
      ['user', 'create', '1. Admin tạo tài khoản', isSystemS ? 'Cấp tài khoản đăng nhập cho nhân viên.' : 'Cấp tên đăng nhập và mật khẩu tạm thời.'],
      ['login', 'try-login', '2. Nhân viên đăng nhập', isSystemS ? 'Đăng nhập bằng tài khoản được Admin cấp.' : 'Sử dụng thông tin được Admin cung cấp.'],
      [isSystemS ? 'home' : 'lock', isSystemS ? 'home' : 'password', isSystemS ? '3. Truy cập Trang chủ' : '3. Đổi mật khẩu lần đầu', isSystemS ? 'Sử dụng các chức năng theo quyền được cấp.' : 'Bắt buộc đổi mật khẩu để bảo vệ tài khoản.'],
      [isSystemS ? 'lock' : 'home', isSystemS ? 'password' : 'home', isSystemS ? '4. Đổi mật khẩu' : '4. Truy cập Trang chủ', isSystemS ? 'Thay đổi mật khẩu tại mục Cá nhân khi cần.' : 'Bắt đầu sử dụng các chức năng được phân quyền.'],
    ];
    const stepCards = steps.map(([glyph, action, title, text]) => {
      const content = `${icon(glyph)}<strong>${title}</strong><small>${text}</small>`;
      return isSystemS
        ? `<article class="app-login-step">${content}</article>`
        : `<button type="button" class="app-login-step" data-action="${action}">${content}</button>`;
    }).join('');
    return `<div class="app-login-flow">${stepCards}</div>
      <article class="app-account-alert"><span class="app-alert-icon">${icon('key')}</span><div><strong>Quên mật khẩu</strong><p>${isSystemS ? 'Liên hệ Admin để được hỗ trợ đặt lại mật khẩu.' : 'Người dùng có thể chọn Quên mật khẩu hoặc liên hệ Admin để được reset mật khẩu.'}</p></div>${button('RESET MẬT KHẨU', 'reset', 'app-alert-action')}</article>
      <article class="app-account-alert app-account-alert--inactive"><span class="app-alert-icon" aria-hidden="true">⊘</span><div><strong>Nhân viên nghỉ việc</strong><p>${isSystemS ? 'Admin chuyển tài khoản sang Inactive và ngừng quyền truy cập.' : 'Admin chuyển tài khoản sang trạng thái Inactive. Nhân viên không thể tiếp tục đăng nhập vào App.'}</p></div>${button(state.inactive ? 'KÍCH HOẠT LẠI' : 'INACTIVE', 'inactive', 'app-alert-action')}</article>`;
  }
  function quickTestDetail() {
    const steps = [
      [icon('quick-test'), '01 · Mở Quick Test', 'Bắt đầu bài kiểm tra trước khi chấm công.'],
      ['☷', '02 · Nhận bộ câu hỏi', 'Hệ thống thay đổi câu hỏi ở mỗi lần làm.'],
      ['✓', '03 · Trả lời câu hỏi', 'Hoàn thành toàn bộ câu hỏi và gửi kết quả.'],
      ['⊙', '04 · Kiểm tra kết quả', 'Đối chiếu điểm với điều kiện của chương trình.'],
    ];
    return `<div class="app-quick-test-detail"><div class="app-quick-test-steps">${steps.map(([glyph, title, text]) => `<article class="app-quick-test-card"><span class="app-quick-test-icon">${glyph}</span><strong>${title}</strong><p>${text}</p></article>`).join('')}</div><article class="app-quick-test-condition"><span class="app-quick-test-icon">⊙</span><div><strong>Điều kiện mở chấm công</strong><p>Nhân viên phải đạt số câu đúng tối thiểu theo cấu hình của chương trình.</p><div class="app-quick-test-requirements"><b>Yêu cầu 9/10</b><b>Yêu cầu 10/10</b></div><em>Mức đạt được cấu hình theo từng dự án.</em></div></article><div class="app-quick-test-results"><article class="app-quick-test-result state-passed"><span class="app-quick-test-icon">✓</span><div><strong>Đạt yêu cầu</strong><p>Đủ điều kiện thực hiện chấm công.</p><b>9/10 – Đạt</b>${route('attendance', 'Tiếp tục chấm công', 'app-button app-quick-test-action')}</div></article><article class="app-quick-test-result state-failed"><span class="app-quick-test-icon">↻</span><div><strong>Chưa đạt yêu cầu</strong><p>Chưa được chấm công và phải làm lại.</p><b>8/10 – Chưa đạt</b>${button('Làm lại Quick Test', 'retry', 'app-button app-quick-test-action')}</div></article></div><article class="app-quick-test-note"><span class="app-quick-test-icon">↗</span><p><strong>Bộ câu hỏi mới cho mỗi lần làm lại</strong><br>Nhân viên có thể làm lại nhiều lần đến khi đạt yêu cầu. Mỗi lần làm, hệ thống sẽ thay đổi bộ câu hỏi.</p></article></div>`;
  }
  function show(id, focus = false) {
    const index = screens.findIndex((screen) => screen.id === id);
    if (index < 0) return;
    current = index;
    systemCurrentScreens[activeSystem] = id;
    const screen = screens[current];
    document.querySelectorAll('.app-journey-link').forEach((link) => {
      const active = link.dataset.screen === id;
      if (active) {
        link.setAttribute('aria-current', 'step');
        link.closest('details').open = true;
      } else link.removeAttribute('aria-current');
    });
    $('#step-badge').textContent = `BƯỚC ${String(screen.step).padStart(2, '0')}`;
    $('#detail-title-icon').innerHTML = icon(screen.icon);
    $('#detail-title').textContent = screen.title;
    $('#detail-description').textContent = screen.description;
    const actions = screen.actions || [
      'Nhập đầy đủ thông tin trên màn hình điện thoại.',
      'Kiểm tra dữ liệu và thêm ghi chú nếu cần.',
      'Nhấn Lưu báo cáo, sau đó xem lại tại Báo cáo cửa hàng.',
    ];
    $('.app-detail-panel').classList.toggle('app-detail--reference', !!screen.reference);
    $('.app-detail-panel').classList.toggle('app-detail--reports', id === 'required-reports');
    $('#detail-body').innerHTML =
      id === 'login'
        ? loginDetail()
        : id === 'quick-test'
          ? quickTestDetail()
          : screen.reference
            ? `<div class="app-standard-detail"><section class="app-detail-section"><h3 class="app-detail-section-title">${icon('user')}<span>Người dùng thực hiện</span></h3><ul class="app-instruction-list">${actions.map((action) => `<li>${action}</li>`).join('')}</ul></section><section class="app-detail-section"><h3 class="app-detail-section-title">${icon('result')}<span>Kết quả</span></h3><p>${screen.result}</p>${id === 'required-reports' ? reportCards() : ''}</section></div>`
            : `<div class="app-standard-detail"><h3 class="app-detail-section-title">${icon('user')}<span>Người dùng thực hiện</span></h3><ul class="app-instruction-list">${actions.map((action) => `<li>${action}</li>`).join('')}</ul><div class="app-result-box"><strong class="app-detail-section-title">${icon('result')}<span>KẾT QUẢ</span></strong>${screen.result}</div>${activeSystem === 's' && id === 'home' ? '' : `<div class="app-detail-shortcuts">${route('home', 'Trang chủ', 'app-button app-button--outline')}</div>`}</div>`;
    $('#next-step').textContent = current === screens.length - 1 ? 'Hoàn thành ✓' : 'Tiếp theo →';
    renderPhone();
    const activeLink = $('.app-journey-link[aria-current="step"]'),
      menu = $('#journey-menu');
    const menuBounds = menu.getBoundingClientRect(),
      linkBounds = activeLink.getBoundingClientRect();
    if (linkBounds.top < menuBounds.top || linkBounds.bottom > menuBounds.bottom)
      menu.scrollTop += linkBounds.top - menuBounds.top - menu.clientHeight / 2 + linkBounds.height / 2;
    if (focus) {
      $('#detail-title').focus({ preventScroll: true });
      if (matchMedia('(max-width: 1000px)').matches)
        $('.app-detail-panel').scrollIntoView({
          block: 'start',
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
    }
  }
  function reportCards() {
    return `<div class="app-report-catalog">${reportScreens.map((screen) => `<article class="app-report-card"><h4>${icon(screen.icon)}${screen.title}</h4><p>${screen.description}</p>${route(screen.id, 'Xem màn hình', 'app-button')}</article>`).join('')}</div>`;
  }
  function phoneHeader(screen) {
    return `<div class="app-phone-toolbar"><button type="button" class="app-phone-back" data-action="phone-back" aria-label="Về bước trước">‹</button><strong>${screen.id === 'home' ? 'Activation' : escape(screen.title)}</strong><button type="button" class="app-phone-home" data-action="home" aria-label="Về Trang chủ">⌂</button></div>`;
  }
  const systemAPhoneImageSets = {
    login: [
      { form: true, label: 'Đăng nhập' },
      { src: 'assets/app-a/doimk.png', label: 'Đổi mật khẩu' },
      { src: 'assets/app-a/doimktc.png', label: 'Đổi mật khẩu thành công' },
    ],
    'quick-test': [
      { src: 'assets/app-a/quikytest.png', label: 'Quick Test — bài kiểm tra' },
      { src: 'assets/app-a/quikytesttc.png', label: 'Quick Test — hoàn thành bài kiểm tra', uncropped: true },
      { src: 'assets/app-a/quikytestds.png', label: 'Quick Test — danh sách bài kiểm tra' },
    ],
    schedule: [
      { src: 'assets/app-a/llm.png', label: 'Lịch làm việc' },
      { src: 'assets/app-a/llmct.png', label: 'Chi tiết lịch làm việc' },
    ],
    documents: [
      { src: 'assets/app-a/tlieu.png', label: 'Danh sách tài liệu' },
      { src: 'assets/app-a/tlieu1.png', label: 'Chi tiết tài liệu' },
    ],
    'store-report': [
      { src: 'assets/app-a/bcch.png', label: 'Tổng quan báo cáo cửa hàng' },
      { src: 'assets/app-a/bcch1.png', label: 'Chi tiết báo cáo cửa hàng' },
      { src: 'assets/app-a/bcch2.png', label: 'Báo cáo cửa hàng — màn hình 3' },
    ],
    store: [{ src: 'assets/app-a/cuahang.png', label: 'Cửa hàng' }],
    sync: [{ src: 'assets/app-a/dongbo.png', label: 'Đồng bộ dữ liệu' }],
    stores: [{ src: 'assets/app-a/dsch.png', label: 'Danh sách cửa hàng' }],
    'store-detail': [{ src: 'assets/app-a/chct.png', label: 'Cửa hàng chi tiết' }],
    'store-information': [{ src: 'assets/app-a/chct.png', label: 'Thông tin cửa hàng' }],
    photo: [{ src: 'assets/app-a/hinhtongquang.png', label: 'Ảnh tổng quan cửa hàng' }],
    'required-reports': [{ src: 'assets/app-a/bcpht.png', label: 'Báo cáo phải hoàn thành' }],
    attendance: [
      { src: 'assets/app-a/checkin.png', label: 'Chấm công — Check-in' },
      { src: 'assets/app-a/checkinanh.png', label: 'Chấm công — Ảnh check-in' },
      { src: 'assets/app-a/checkout.png', label: 'Chấm công — Check-out' },
    ],
    inventory: [
      { src: 'assets/app-a/tonkho.png', label: 'Tồn kho — màn hình 1' },
      { src: 'assets/app-a/tonkho1.png', label: 'Tồn kho — màn hình 2' },
      { src: 'assets/app-a/tonkho2.png', label: 'Tồn kho — màn hình 3' },
      { src: 'assets/app-a/tonkho3.png', label: 'Tồn kho — màn hình 4' },
    ],
    price: [
      { src: 'assets/app-a/bcgia.png', label: 'Báo cáo giá — màn hình 1' },
      { src: 'assets/app-a/bcgia1.png', label: 'Báo cáo giá — màn hình 2' },
      { src: 'assets/app-a/bcgia2.png', label: 'Báo cáo giá — màn hình 3' },
      { src: 'assets/app-a/bcgia3.png', label: 'Báo cáo giá — màn hình 4' },
    ],
    program: [
      { src: 'assets/app-a/bcct.png', label: 'BC Chương trình — màn hình 1' },
      { src: 'assets/app-a/bcct1.png', label: 'BC Chương trình — màn hình 2' },
      { src: 'assets/app-a/bcct2.png', label: 'BC Chương trình — màn hình 3' },
    ],
    competitor: [
      { src: 'assets/app-a/bcdt.png', label: 'Báo cáo đối thủ — màn hình 1' },
      { src: 'assets/app-a/bcdt1.png', label: 'Báo cáo đối thủ — màn hình 2' },
      { src: 'assets/app-a/bcdt2.png', label: 'Báo cáo đối thủ — màn hình 3' },
    ],
    display: [
      { src: 'assets/app-a/trungbay.png', label: 'Chụp hình trưng bày POSM — màn hình 1' },
      { src: 'assets/app-a/trungbay1.png', label: 'Chụp hình trưng bày POSM — màn hình 2' },
      { src: 'assets/app-a/trungbay2.png', label: 'Chụp hình trưng bày POSM — màn hình 3' },
    ],
    sales: [
      { src: 'assets/app-a/bh_qt.png', label: 'Bán hàng và quà tặng — màn hình 1' },
      { src: 'assets/app-a/bh_qt1.png', label: 'Bán hàng và quà tặng — màn hình 2' },
      { src: 'assets/app-a/bh_qt2.png', label: 'Bán hàng và quà tặng — màn hình 3' },
      { src: 'assets/app-a/bh_qt3.png', label: 'Bán hàng và quà tặng — màn hình 4' },
      { src: 'assets/app-a/bh_qt4.png', label: 'Bán hàng và quà tặng — màn hình 5' },
      { src: 'assets/app-a/bh_qt5.png', label: 'Bán hàng và quà tặng — màn hình 6' },
    ],
    breaktime: [
      { src: 'assets/app-a/breaktime.png', label: 'Breaktime — màn hình 1' },
      { src: 'assets/app-a/breaktime1.png', label: 'Breaktime — màn hình 2' },
      { src: 'assets/app-a/breaktime2.png', label: 'Breaktime — màn hình 3' },
      { src: 'assets/app-a/breaktime3.png', label: 'Breaktime — màn hình 4' },
      { src: 'assets/app-a/breaktime4.png', label: 'Breaktime — màn hình 5' },
    ],
    traffic: [
      { src: 'assets/app-a/traffic.png', label: 'Báo cáo Traffic — màn hình 1' },
      { src: 'assets/app-a/traffic1.png', label: 'Báo cáo Traffic — màn hình 2' },
      { src: 'assets/app-a/traffic2.png', label: 'Báo cáo Traffic — màn hình 3' },
      { src: 'assets/app-a/traffic3.png', label: 'Báo cáo Traffic — màn hình 4' },
    ],
  };
  const clonePhoneImageSets = (sets, assetFolder) =>
    Object.fromEntries(
      Object.entries(sets).map(([id, items]) => [
        id,
        items.map((item) => ({
          ...item,
          src: item.src?.replace('assets/app-a/', `assets/${assetFolder}/`),
        })),
      ]),
    );
  const systemSPhoneImageSets = clonePhoneImageSets(systemAPhoneImageSets, 'app-s');
  const hiddenSystemSImages = new Set([
    'llmct.png',
    'llmct1.png',
    'tonkho3.png',
    'bcgia3.png',
    'bcch1.png',
    'bcch2.png',
    'bh_qt3.png',
    'bh_qt4.png',
    'bh_qt5.png',
  ]);
  Object.keys(systemSPhoneImageSets).forEach((screenId) => {
    systemSPhoneImageSets[screenId] = systemSPhoneImageSets[screenId].filter((item) => {
      const fileName = item.src?.split('/').pop();
      return !fileName || !hiddenSystemSImages.has(fileName);
    });
  });
  // Tài liệu Hệ thống S: màn hình quản lý, danh sách sản phẩm và chi tiết sản phẩm.
  systemSPhoneImageSets.documents = [
    { src: 'assets/app-s/tlieu.png', label: 'Tài liệu — quản lý tài liệu' },
    { src: 'assets/app-s/tlieu1.png', label: 'Tài liệu — thông tin sản phẩm' },
    { src: 'assets/app-s/tlieu2.png', label: 'Tài liệu — chi tiết sản phẩm' },
  ];
  // Báo cáo Traffic Hệ thống S: dùng bộ ảnh mới và làm mới cache ảnh cũ.
  systemSPhoneImageSets.traffic = [
    { src: 'assets/app-s/traffic.png?v=20261001', label: 'Báo cáo Traffic — màn hình 1' },
    { src: 'assets/app-s/traffic1.png?v=20261001', label: 'Báo cáo Traffic — màn hình 2' },
    { src: 'assets/app-s/traffic2.png?v=20261001', label: 'Báo cáo Traffic — màn hình 3' },
    { src: 'assets/app-s/traffic3.png?v=20261001', label: 'Báo cáo Traffic — màn hình 4' },
  ];
  // Bộ Báo cáo đối thủ dùng hai kiểu ảnh: ảnh đầy đủ có status bar và ảnh form đã bỏ status bar.
  // Gắn crop riêng để tiêu đề "Chương trình khuyến mãi" không bị cắt mất.
  systemSPhoneImageSets.competitor[0].cropStatusOnly = true;
  systemSPhoneImageSets.competitor[1].uncropped = true;
  systemSPhoneImageSets.competitor[2].cropStatusOnly = true;
  // Báo cáo giá: chỉ bỏ thanh trạng thái (giờ, Wi-Fi, pin), giữ nguyên header ứng dụng.
  systemSPhoneImageSets.price.forEach((item) => {
    item.cropStatusOnly = true;
  });
  // Ảnh Báo cáo ụ/kệ: bỏ thanh trạng thái nhưng giữ nguyên header "Báo cáo thị phần".
  systemSPhoneImageSets['shelf-report'] = [
    { src: 'assets/app-s/bcuk.png', label: 'Báo cáo ụ/kệ — màn hình 1', cropStatusOnly: true },
    { src: 'assets/app-s/bcuk1.png', label: 'Báo cáo ụ/kệ — màn hình 2', cropStatusOnly: true },
    { src: 'assets/app-s/bcuk2.png', label: 'Báo cáo ụ/kệ — màn hình 3', cropStatusOnly: true },
  ];
  // Bán hàng và quà tặng: ba ảnh báo cáo đổi quà, sau đó là năm bước đổi quà.
  systemSPhoneImageSets.sales = [
    { src: 'assets/app-s/bhdq.jpg', label: 'Bán hàng và quà tặng — báo cáo đổi quà 1', cropStatusPercent: 7 },
    { src: 'assets/app-s/bhdq1.jpg', label: 'Bán hàng và quà tặng — báo cáo đổi quà 2', cropStatusPercent: 6 },
    { src: 'assets/app-s/bhdq2.jpg', label: 'Bán hàng và quà tặng — báo cáo đổi quà 3', cropStatusPercent: 5 },
    { src: 'assets/app-s/bcdq.png', label: 'Bán hàng và quà tặng — đổi quà 1', cropStatusPercent: 7 },
    { src: 'assets/app-s/bcdq1.png', label: 'Bán hàng và quà tặng — đổi quà 2', cropStatusPercent: 7 },
    { src: 'assets/app-s/bcdq2.png', label: 'Bán hàng và quà tặng — đổi quà 3', cropStatusPercent: 7 },
    { src: 'assets/app-s/bcdq3.png', label: 'Bán hàng và quà tặng — đổi quà 4', cropStatusPercent: 7 },
    { src: 'assets/app-s/bcdq4.png', label: 'Bán hàng và quà tặng — đổi quà 5', cropStatusPercent: 7 },
  ];
  // Hệ thống S dùng chung ảnh cuahang.png cho Cửa hàng và Danh sách cửa hàng.
  systemSPhoneImageSets.stores = [
    { src: 'assets/app-s/cuahang.png', label: 'Danh sách cửa hàng Hệ thống S' },
  ];
  // Login của Hệ thống S là ảnh chụp toàn màn hình, không dùng form HTML của Hệ thống A.
  systemSPhoneImageSets.login[0] = {
    src: 'assets/app-s/login.png',
    label: 'Đăng nhập Hệ thống S',
  };
  systemSPhoneImageSets.login.splice(1, 0, {
    src: 'assets/app-s/login1.jpg',
    label: 'Đăng nhập Hệ thống S — màn hình 2',
    cropNetworkNotice: true,
  });
  const systemPhoneImageSets = {
    a: systemAPhoneImageSets,
    s: systemSPhoneImageSets,
  };
  const systemPhoneImageIndexes = {
    a: Object.fromEntries(Object.keys(systemPhoneImageSets.a).map((id) => [id, 0])),
    s: Object.fromEntries(Object.keys(systemPhoneImageSets.s).map((id) => [id, 0])),
  };
  let phoneImageSets = systemPhoneImageSets[activeSystem];
  let phoneImageIndexes = systemPhoneImageIndexes[activeSystem];
  function switchSystem(systemId) {
    if (!systems[systemId] || systemId === activeSystem) return;
    activeSystem = systemId;
    screens = systems[activeSystem].screens;
    reportScreens = screens.filter((screen) => screen.group === 'Báo cáo phải hoàn thành' && screen.id !== 'required-reports');
    state = systemStates[activeSystem];
    phoneImageSets = systemPhoneImageSets[activeSystem];
    phoneImageIndexes = systemPhoneImageIndexes[activeSystem];
    const layout = $('.app-experience-layout');
    layout.dataset.system = activeSystem;
    layout.setAttribute('aria-label', `Trải nghiệm ${systems[activeSystem].label}`);
    const journeyLogo = $('#journey-system-logo');
    journeyLogo.textContent = activeSystem.toUpperCase();
    journeyLogo.setAttribute('aria-label', systems[activeSystem].label);
    document.querySelectorAll('.app-system-button').forEach((element) => {
      const selected = element.dataset.system === activeSystem;
      element.classList.toggle('state-active', selected);
      element.setAttribute('aria-pressed', String(selected));
    });
    $('#phone-screen').replaceChildren();
    renderJourneyMenu();
    const savedScreen = systemCurrentScreens[activeSystem];
    show(screens.some((screen) => screen.id === savedScreen) ? savedScreen : 'schedule');
    notice(`Đang hiển thị ${systems[activeSystem].label}.`);
  }
  function changePhoneImage(direction) {
    const id = screens[current].id;
    const images = phoneImageSets[id];
    if (!images) return;
    phoneImageIndexes[id] = (phoneImageIndexes[id] + direction + images.length) % images.length;
    renderPhone();
  }
  function schedulePhoneImageAutoAdvance(screenId, images, imageIndex) {
    const imageIndexes = images
      .map((item, index) => (item.src ? index : -1))
      .filter((index) => index >= 0);
    if (imageIndexes.length < 2 || !images[imageIndex]?.src) return;
    const scheduledSystem = activeSystem;
    phoneImageAutoTimer = setTimeout(() => {
      if (activeSystem !== scheduledSystem || screens[current]?.id !== screenId) return;
      if (document.hidden || modal.open || imageDialog.open) {
        schedulePhoneImageAutoAdvance(screenId, images, phoneImageIndexes[screenId]);
        return;
      }
      const activeIndex = phoneImageIndexes[screenId];
      const activePosition = Math.max(0, imageIndexes.indexOf(activeIndex));
      phoneImageIndexes[screenId] = imageIndexes[(activePosition + 1) % imageIndexes.length];
      renderPhone();
    }, 3000);
  }
  function syncPhoneHeader(image) {
    const phoneScreen = $('#phone-screen');
    phoneScreen.style.removeProperty('--app-phone-header-color');
    if (!image) return;
    const fallbackColor = activeSystem === 's' ? '#0b6949' : '#005aba';
    const imageFileName = image.getAttribute('src')?.split('/').pop()?.split('?')[0];
    const configuredColor = window.ACTIVATION_PHONE_HEADER_COLORS?.[activeSystem]?.[imageFileName];
    if (configuredColor) {
      phoneScreen.style.setProperty('--app-phone-header-color', configuredColor);
      return;
    }

    const sampleColor = () => {
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d', { willReadFrequently: true });
        const samplePoints = [0.04, 0.25, 0.5, 0.75, 0.96];
        const sourceY = Math.round(image.naturalHeight * 0.058);
        const sourceHeight = Math.max(2, Math.round(image.naturalHeight * 0.014));
        const sourceWidth = Math.max(2, Math.round(image.naturalWidth * 0.045));
        canvas.width = samplePoints.length;
        canvas.height = 1;
        samplePoints.forEach((point, index) => {
          const sourceX = Math.max(0, Math.min(image.naturalWidth - sourceWidth, Math.round(image.naturalWidth * point - sourceWidth / 2)));
          context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, index, 0, 1, 1);
        });
        const pixels = context.getImageData(0, 0, samplePoints.length, 1).data;
        const colorStops = samplePoints.map((point, index) => {
          const offset = index * 4;
          const red = pixels[offset];
          const green = pixels[offset + 1];
          const blue = pixels[offset + 2];
          const strongestChannel = Math.max(red, green, blue);
          const weakestChannel = Math.min(red, green, blue);
          const color = strongestChannel > 70 && strongestChannel - weakestChannel > 18
            ? `rgb(${red}, ${green}, ${blue})`
            : fallbackColor;
          return `${color} ${Math.round(point * 100)}%`;
        });
        phoneScreen.style.setProperty('--app-phone-header-color', `linear-gradient(90deg, ${colorStops.join(', ')})`);
      } catch {
        phoneScreen.style.setProperty('--app-phone-header-color', fallbackColor);
      }
    };

    if (image.complete && image.naturalWidth) sampleColor();
    else image.addEventListener('load', sampleColor, { once: true });
  }
  function renderPhone() {
    clearTimeout(phoneImageAutoTimer);
    const screen = screens[current];
    const images = phoneImageSets[screen.id];
    const imageIndex = phoneImageIndexes[screen.id];
    const showLoginForm = !!images?.[imageIndex]?.form;
    $('.app-phone-scene').classList.toggle('app-phone-scene--schedule', !!images && !showLoginForm);
    document.querySelectorAll('.app-schedule-arrow').forEach((element) => {
      element.hidden = !images || images.length < 2;
      const direction = element.dataset.action === 'schedule-prev' ? 'trước' : 'tiếp theo';
      element.setAttribute('aria-label', `Xem ảnh ${screen.title.toLowerCase()} ${direction}`);
    });
    if (images) {
      if ($('.app-schedule-image-viewport')?.dataset.screen !== screen.id) {
        const login = screen.id === 'login' ? `<div class="app-login-slide">${loginPhoneContent()}</div>` : '';
        $('#phone-screen').innerHTML = login + `<div class="app-schedule-image-viewport" data-screen="${screen.id}">${images.map((item, index) => item.src ? `<img class="app-schedule-image${item.uncropped ? ' app-schedule-image--uncropped' : ''}${item.cropStatusOnly ? ' app-schedule-image--crop-status-only' : ''}${item.cropStatusPercent ? ` app-schedule-image--crop-status-${item.cropStatusPercent}` : ''}${item.cropNetworkNotice ? ' app-schedule-image--crop-network-notice' : ''}" data-image-index="${index}" src="${item.src}" alt="${item.label}" role="button" tabindex="0" aria-label="Phóng to: ${item.label}" aria-haspopup="dialog" data-action="enlarge-image" title="Nhấn để xem ảnh rõ hơn" draggable="false" loading="eager" ${index === imageIndex ? '' : 'hidden'}>` : '').join('')}</div>`;
        if (screen.id === 'login') {
          $('.app-eye-button').setAttribute('aria-label', 'Hiện mật khẩu');
          $('.app-eye-button').setAttribute('aria-pressed', 'false');
        }
      }
      $('.app-schedule-image-viewport').hidden = showLoginForm;
      const loginSlide = $('.app-login-slide');
      if (loginSlide) loginSlide.hidden = !showLoginForm;
      document.querySelectorAll('.app-schedule-image').forEach((element) => {
        element.hidden = Number(element.dataset.imageIndex) !== imageIndex;
      });
      syncPhoneHeader($('.app-schedule-image:not([hidden])'));
      $('#phone-screen').scrollTop = 0;
      schedulePhoneImageAutoAdvance(screen.id, images, imageIndex);
      return;
    }
    let body = '';
    if (screen.id === 'home')
      body = `<div class="app-home-image-wrapper"><img src="assets/${systems[activeSystem].assetFolder}/home.png" alt="Màn hình Trang chủ App" class="app-home-image" role="button" tabindex="0" aria-label="Phóng to: Màn hình Trang chủ App" aria-haspopup="dialog" data-action="enlarge-image" title="Nhấn để xem ảnh rõ hơn"></div>`;
    $('#phone-screen').innerHTML = screen.id === 'home'
      ? body
      : phoneHeader(screen) + body + '<span class="app-demo-label">ACACY ONE · Bản trải nghiệm</span>';
    $('#phone-screen').scrollTop = 0;
  }

  function loginPhoneContent() {
    return `<div class="app-phone-brand">Acacy</div><svg class="app-login-art" viewBox="18 135 273 144" role="img" aria-label="Bản đồ và cửa hàng"><image href="assets/${systems[activeSystem].assetFolder}/login.png" width="310" height="692"/></svg><form class="app-phone-login" data-form="login"><input name="username" aria-label="Tên đăng nhập" placeholder="Tên đăng nhập" autocomplete="off" required><div class="app-password-field"><input name="password" type="password" aria-label="Mật khẩu" placeholder="Mật khẩu" autocomplete="off" required>${button(icon('eye'), 'toggle-password', 'app-eye-button')}</div>${button('Quên mật khẩu?', 'reset', 'app-phone-forgot')}<button class="app-phone-submit" type="submit">Đăng nhập</button>${button('Điền tài khoản demo', 'fill-demo', 'app-phone-forgot')}</form><p class="app-phone-version"><span>Phiên bản</span><br>1.0.2.7</p><p class="app-phone-address">Tầng 2, Tòa Nhà Morning Star, số 57 Quốc Lộ 13, Phường Bình Thạnh, TPHCM</p>`;
  }
  function passwordModal() {
    openModal(
      'Đổi mật khẩu lần đầu',
      `<p>Đặt mật khẩu mới cho tài khoản demo. Không sử dụng mật khẩu của tài khoản thật.</p><form data-form="password"><label>Mật khẩu mới<input type="password" name="password" minlength="8" required autocomplete="new-password"></label><label>Nhập lại mật khẩu<input type="password" name="confirm" minlength="8" required autocomplete="new-password"></label><button class="app-button" type="submit">Lưu & vào Trang chủ →</button></form>`,
    );
  }
  function resetModal() {
    openModal(
      'Reset mật khẩu',
      `<p>Nhập tên tài khoản demo để đặt lại mật khẩu trong phiên này.</p><form data-form="reset"><label>Tên đăng nhập<input name="username" value="${escape(state.username)}" required autocomplete="off"></label><button class="app-button" type="submit">Reset mật khẩu</button></form>`,
    );
  }
  const actions = {
    'schedule-prev': () => changePhoneImage(-1),
    'schedule-next': () => changePhoneImage(1),
    'close-modal': () => modal.close(),
    home: () => show('home'),
    'phone-back': () => show(current ? screens[current - 1].id : 'login'),
    'fill-demo': () => {
      phoneImageIndexes.login = 0;
      if (screens[current].id !== 'login') show('login');
      else renderPhone();
      const form = $('[data-form="login"]');
      form.elements.username.value = state.username;
      form.elements.password.value = state.password;
      notice('Đã điền tài khoản demo. Nhấn Đăng nhập để tiếp tục.');
    },
    'try-login': () => {
      actions['fill-demo']();
      $('.app-phone-login input').focus();
    },
    'toggle-password': () => {
      const input = $('.app-password-field input'),
        hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      $('.app-eye-button').setAttribute('aria-label', hidden ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
      $('.app-eye-button').setAttribute('aria-pressed', String(hidden));
    },
    password: passwordModal,
    reset: resetModal,
    create: () =>
      openModal(
        'Admin tạo tài khoản',
        `<p>Tạo tài khoản mẫu trong phiên trải nghiệm. Mật khẩu tạm thời: <strong>Demo@2026</strong>.</p><form data-form="create"><label>Họ tên nhân viên<input name="name" value="${escape(state.name)}" maxlength="60" required></label><label>Tên đăng nhập<input name="username" value="${escape(state.username)}" pattern="[A-Za-z0-9._-]{3,40}" title="Từ 3–40 ký tự: chữ không dấu, số, dấu chấm, gạch dưới hoặc gạch ngang" required></label><button class="app-button" type="submit">Tạo tài khoản demo</button></form>`,
      ),
    inactive: () =>
      openModal(
        state.inactive ? 'Kích hoạt lại tài khoản' : 'Chuyển tài khoản sang Inactive',
        `<p>${state.inactive ? 'Cho phép tài khoản demo đăng nhập trở lại.' : 'Sau khi xác nhận, tài khoản demo sẽ không thể đăng nhập. Bạn có thể kích hoạt lại bằng nút này.'}</p>${button(state.inactive ? 'Kích hoạt lại' : 'Xác nhận Inactive', 'confirm-inactive')}`,
      ),
    'confirm-inactive': () => {
      state.inactive = !state.inactive;
      modal.close();
      show('login');
      notice(state.inactive ? 'Tài khoản demo đã chuyển sang Inactive.' : 'Tài khoản demo đã được kích hoạt lại.');
    },
    retry: () => {
      phoneImageIndexes['quick-test'] = 0;
      if (screens[current].id !== 'quick-test') show('quick-test');
      else renderPhone();
    },
    restart: () =>
      openModal(
        'Bắt đầu lại trải nghiệm',
        `<p>Xóa các báo cáo và thao tác demo trong phiên này để quay về bước đăng nhập.</p>${button('Bắt đầu lại', 'confirm-restart')}`,
      ),
    'confirm-restart': () => {
      systemStates[activeSystem] = freshState();
      state = systemStates[activeSystem];
      Object.keys(phoneImageIndexes).forEach((id) => { phoneImageIndexes[id] = 0; });
      modal.close();
      show('login');
      notice('Đã bắt đầu lại trải nghiệm.');
    },
    'view-records': () => {
      modal.close();
      show('store-report');
    },
  };
  document.addEventListener('click', (event) => {
    const source = event.target.closest('img[data-action="enlarge-image"]');
    if (source) {
      openPhoneImage(source);
      return;
    }
    const target = event.target.closest('button');
    if (!target) return;
    if (target.dataset.system) switchSystem(target.dataset.system);
    else if (target.dataset.screen) show(target.dataset.screen, true);
    else if (target.dataset.action) actions[target.dataset.action]?.();
  });
  document.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('img[data-action="enlarge-image"]')) {
      event.preventDefault();
      openPhoneImage(event.target);
    }
  });
  $('.app-image-close').addEventListener('click', () => imageDialog.close());
  imageSizeToggle.addEventListener('click', () => {
    const nativeSize = imageDialog.classList.toggle('state-native');
    imageSizeToggle.setAttribute('aria-pressed', String(nativeSize));
    imageSizeToggle.textContent = nativeSize ? 'Vừa màn hình' : 'Kích thước gốc';
  });
  imageDialog.addEventListener('click', (event) => {
    if (event.target !== imageDialog) return;
    const rect = imageDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) imageDialog.close();
  });
  $('#prev-step').addEventListener('click', () => {
    if (current) show(screens[current - 1].id, true);
    else location.href = 'activation-overview.html';
  });
  $('#next-step').addEventListener('click', () => {
    if (current < screens.length - 1) show(screens[current + 1].id, true);
    else
      openModal(
        'Hoàn thành hành trình',
        `<p>Bạn đã khám phá các bước trên App Activation. Phiên này có <strong>${state.records.length} báo cáo</strong> đã lưu.</p>${button('Xem báo cáo', 'view-records')} ${button('Trải nghiệm lại', 'confirm-restart', 'app-button app-button--outline')}`,
      );
  });
  document.addEventListener('input', (event) => {
    if (event.target.name === 'confirm') event.target.setCustomValidity('');
  });

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!form.dataset.form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    switch (form.dataset.form) {
      case 'login':
        if (state.inactive) {
          notice('Tài khoản đang Inactive. Kích hoạt lại tài khoản để đăng nhập.');
          return;
        }
        if (data.get('username') !== state.username || data.get('password') !== state.password) {
          notice('Thông tin chưa đúng. Chọn “Điền tài khoản demo” để thử.');
          return;
        }
        if (!state.changed) passwordModal();
        else {
          show('home');
          notice('Đăng nhập demo thành công.');
        }
        break;
      case 'password':
        if (data.get('password') !== data.get('confirm')) {
          form.elements.confirm.setCustomValidity('Mật khẩu nhập lại chưa khớp.');
          form.elements.confirm.reportValidity();
          return;
        }
        state.password = data.get('password');
        state.changed = true;
        modal.close();
        show('home');
        notice('Đã đổi mật khẩu demo.');
        break;
      case 'reset':
        if (data.get('username') !== state.username) {
          notice('Không tìm thấy tài khoản demo này.');
          return;
        }
        state.password = 'Demo@2026';
        state.changed = false;
        openModal(
          'Đã reset mật khẩu demo',
          `<p>Mật khẩu tạm thời: <strong>Demo@2026</strong>.<br>Hãy đăng nhập và đổi mật khẩu ở lần tiếp theo. Không có email hay yêu cầu nào được gửi ra ngoài.</p>${button('Về đăng nhập', 'reset-done')}`,
        );
        break;
      case 'create':
        state.name = data.get('name').trim();
        state.username = data.get('username');
        state.password = 'Demo@2026';
        state.inactive = false;
        state.changed = false;
        modal.close();
        show('login');
        actions['fill-demo']();
        break;
    }
  });
  actions['reset-done'] = () => {
    modal.close();
    show('login');
    actions['fill-demo']();
  };
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      const rect = modal.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
    }
  });
  renderJourneyMenu();
  show('schedule');
})();
