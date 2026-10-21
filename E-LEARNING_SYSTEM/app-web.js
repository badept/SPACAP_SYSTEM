document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('[data-header]');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    const videoButton = document.querySelector('[data-video-button]');
    const videoDialog = document.querySelector('[data-video-dialog]');
    const videoClose = document.querySelector('[data-video-close]');
    const webappVisual = document.querySelector('.webapp-visual');
    const featureCards = [...document.querySelectorAll('.feature-card')];
    const featureTabList = document.querySelector('.showcase-tabs');
    const featureTabs = [...document.querySelectorAll('[data-feature-tab]')];
    const featureDots = [...document.querySelectorAll('[data-feature-dot]')];
    const showcasePanel = document.querySelector('#feature-slide');
    const showcaseNumber = document.querySelector('[data-showcase-number]');
    const showcaseKicker = document.querySelector('[data-showcase-kicker]');
    const showcaseTitle = document.querySelector('[data-showcase-title]');
    const showcaseDescription = document.querySelector('[data-showcase-description]');
    const showcaseBenefits = document.querySelector('[data-showcase-benefits]');
    const audienceButtons = [...document.querySelectorAll('[data-audience-button]')];
    let activeAudience = 'management';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    audienceButtons.forEach((button) => button.addEventListener('click', () => {
        activeAudience = button.dataset.audienceButton;
        audienceButtons.forEach((candidate) => {
            const isSelected = candidate.dataset.audienceButton === activeAudience;
            candidate.classList.toggle('is-active', isSelected);
            candidate.setAttribute('aria-pressed', String(isSelected));
        });
        const currentFeatureIndex = featureTabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
        updateFeatureAvailability();
        const availableIndexes = getAvailableFeatureIndexes();
        const nextFeatureIndex = activeAudience === 'sup' || activeAudience === 'employee' ?
            availableIndexes[0] :
            availableIndexes.includes(currentFeatureIndex) ? currentFeatureIndex : availableIndexes[0];
        selectShowcaseFeature(nextFeatureIndex);
    }));

    const updateHeader = () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 16);
    };

    const closeMenu = () => {
        if (nav) nav.classList.remove('is-open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    };

    if (menuToggle) menuToggle.addEventListener('click', () => {
        const isOpen = nav ? nav.classList.toggle('is-open') : false;
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    if (nav) nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    if (videoButton) videoButton.addEventListener('click', () => {
        if (videoDialog && typeof videoDialog.showModal === 'function') videoDialog.showModal();
    });

    if (videoClose) videoClose.addEventListener('click', () => {
        if (videoDialog) videoDialog.close();
    });
    if (videoDialog) videoDialog.addEventListener('click', (event) => {
        if (event.target === videoDialog) videoDialog.close();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });

    const allManagementShowcaseFeatures = [{
            tabLabel: 'Tổng quan<br>đào tạo',
            kicker: 'Theo dõi toàn cảnh hoạt động đào tạo',
            title: 'Tổng quan đào tạo',
            description: 'Xem thông tin tổng quan về hoạt động đào tạo, giúp bộ phận phụ trách có cái nhìn tập trung về tình trạng học tập và kết quả của người học.',
            benefits: ['Tình hình đào tạo được hiển thị tập trung', 'Theo dõi các thông tin học tập tổng quan', 'Theo dõi tỷ lệ hoàn thành đào tạo'],
            web: ['assets/web-nv/nv-web-tong-quan.png'],
            app: []
        },
        {
            tabLabel: 'Nội dung &amp;<br>học liệu',
            kicker: 'Quản lý tài liệu học tập tập trung',
            title: 'Nội dung & học liệu',
            description: 'Thư viện tập hợp các tài liệu phục vụ đào tạo, giúp bộ phận phụ trách quản lý, sắp xếp và cung cấp nguồn học liệu để người học dễ dàng truy cập khi cần.',
            benefits: ['Tập trung tài liệu trong thư viện học tập', 'Sắp xếp và quản lý tài liệu đào tạo', 'Cung cấp học liệu phục vụ tra cứu'],
            web: ['assets/web-nv/nv-web-thu-vien.png', 'assets/web-nv/nv-web-tai-lieu-chi-tiet.png'],
            web: [
                'assets/web/web-training-projects.png',
                'assets/web/web-programs.png',
                'assets/web/web-lessons.png'
            ],
            app: []
        },
        {
            tabLabel: 'Danh mục<br>khóa học',
            kicker: 'Hệ thống hóa các khóa học đào tạo',
            title: 'Danh mục khóa học',
            description: 'Các khóa học được tập hợp và phân loại trong một danh mục thống nhất, giúp bộ phận đào tạo dễ dàng quản lý, tìm kiếm và theo dõi các chương trình đang triển khai.',
            benefits: ['Tập hợp danh sách khóa học trên hệ thống', 'Phân loại các khóa học theo chương trình', 'Tra cứu thông tin từng khóa học'],
            web: ['assets/web-nv/nv-web-danh-sach-khoa-hoc.png'],
            web: [
                'assets/web/web-courses.png',
                'assets/web/web-learners.png'
            ],
            app: []
        },
        {
            tabLabel: 'Lộ trình &amp;<br>năng lực',
            kicker: 'Quản lý lộ trình đào tạo theo chương trình',
            title: 'Lộ trình & năng lực',
            description: 'Quản lý danh sách lộ trình đào tạo trên hệ thống, giúp bộ phận phụ trách tổ chức các nội dung học tập theo chương trình và định hướng phát triển năng lực người học.',
            benefits: ['Xem danh sách lộ trình đào tạo', 'Quản lý thông tin và nội dung lộ trình', 'Tổ chức đào tạo theo định hướng năng lực'],
            web: ['assets/web-nv/nv-web-bao-cao-nang-luc.png'],
            web: [
                'assets/web/web-learning-paths.png',
                'assets/web/web-training-criteria.png'
            ],
            app: []
        },
        {
            tabLabel: 'Câu hỏi &amp;<br>Coaching',
            kicker: 'Tổ chức nội dung câu hỏi phục vụ đào tạo',
            title: 'Câu hỏi & Coaching',
            description: 'Quản lý danh sách câu hỏi phục vụ hoạt động đào tạo và Coaching trên hệ thống, giúp đội ngũ dự án thuận tiện tra cứu, tổ chức và theo dõi nội dung câu hỏi theo từng chương trình.',
            benefits: ['Quản lý câu hỏi theo khóa học và bài học', 'Quản lý danh sách câu hỏi Coaching', 'Tra cứu câu hỏi theo dự án đào tạo'],
            web: [
                'assets/web/web-questions.png',
                'assets/web/web-coaching-questions.png'
            ],
            app: []
        },
        {
            tabLabel: 'Kết quả<br>hoàn thành',
            kicker: 'Ghi nhận tình trạng hoàn thành đào tạo',
            title: 'Kết quả hoàn thành',
            description: 'Tổng hợp các nội dung đào tạo đã được người học hoàn thành, giúp bộ phận phụ trách xác nhận tình trạng hoàn thành và theo dõi kết quả thực hiện chương trình.',
            benefits: ['Tổng hợp các nội dung đào tạo đã hoàn thành', 'Ghi nhận trạng thái hoàn thành của người học', 'Theo dõi kết quả hoàn thành chương trình'],
            web: ['assets/web-nv/nv-web-hoan-thanh.png'],
            web: [
                'assets/web/web-study-exam-schedule.png',
                'assets/web/web-exam-reset-extension.png'
            ],
            app: []
        }
    ];

    const supOfficeShowcaseFeatures = [{
            tabLabel: 'Báo cáo<br>đội ngũ',
            kicker: 'Theo dõi hiệu quả đào tạo của đội ngũ',
            title: 'Báo cáo đội ngũ',
            description: 'Tổng hợp số liệu về tình hình tham gia và hoàn thành đào tạo của nhân viên, giúp đội ngũ dự án nắm bắt hiệu quả triển khai chương trình và theo dõi kết quả đào tạo của đội ngũ phụ trách.',
            benefits: ['Xem số lượng nhân viên tham gia đào tạo', 'Theo dõi tỷ lệ hoàn thành chương trình', 'Tổng hợp kết quả đào tạo của đội ngũ'],
            deviceLayout: 'both',
            web: ['assets/web-sup/sup-web-tong-quan-full.png', 'assets/web-sup/sup-web-tong-quan-chi-tiet-full.png'],
            app: ['assets/app-sup/sup-app-tong-quan.png', 'assets/app-sup/tld-app-theo-doi-sup.png']
        },
        {
            tabLabel: 'Theo dõi kết quả<br>nhân viên',
            kicker: 'Nắm bắt kết quả đào tạo theo từng cá nhân',
            title: 'Theo dõi kết quả nhân viên',
            description: 'Hiển thị thông tin học tập và kết quả đào tạo của từng nhân viên, giúp người phụ trách theo dõi tình hình thực hiện chương trình và nhận biết các trường hợp chưa hoàn thành đào tạo.',
            benefits: ['Xem danh sách nhân viên được đào tạo', 'Theo dõi kết quả học tập từng cá nhân', 'Nhận biết nhân viên chưa hoàn thành đào tạo'],
            deviceLayout: 'both',
            web: ['assets/web-sup/sup-web-theo-doi-nhan-vien-full.png', 'assets/web-sup/sup-web-theo-doi-nhan-vien-chi-tiet-full.png'],
            app: ['assets/app-sup/sup-app-theo-doi-ca-nhan.png', 'assets/app-sup/tld-app-chi-tiet-ca-nhan.png']
        },
        {
            tabLabel: 'Phân tích<br>kết quả',
            kicker: 'Đánh giá hiệu quả đào tạo qua số liệu',
            title: 'Phân tích kết quả',
            description: 'Trình bày kết quả đào tạo thông qua các số liệu và biểu đồ, giúp người phụ trách so sánh mức độ hoàn thành giữa các nhóm nhân viên và nhận diện những nội dung đào tạo cần quan tâm.',
            benefits: ['Xem biểu đồ kết quả đào tạo', 'So sánh tỷ lệ hoàn thành theo nhóm', 'Nhận diện các nội dung có kết quả thấp'],
            deviceLayout: 'both',
            web: ['assets/web-sup/sup-web-phan-tich-ca-nhan-full.png', 'assets/web-sup/sup-web-phan-tich-ca-nhan-chi-tiet-full.png'],
            app: ['assets/app-sup/tld-app-tong-quan.png', 'assets/app-sup/sup-app-chi-tiet-nang-luc.png']
        }
    ];

    const managementShowcaseFeatures = allManagementShowcaseFeatures.slice(0, 1);
    const projectShowcaseFeatures = [
        ...allManagementShowcaseFeatures.slice(1),
        ...supOfficeShowcaseFeatures
    ];

    const employeeShowcaseFeatures = [{
            tabLabel: 'Khóa học &amp;<br>bài học',
            kicker: 'Chủ động học tập theo chương trình được giao',
            title: 'Khóa học & bài học',
            description: 'Người học truy cập các khóa học được phân bổ, xem nội dung bài học và thực hiện chương trình đào tạo trực tiếp trên Web hoặc App.',
            benefits: ['Xem các khóa học được phân bổ', 'Truy cập và học nội dung từng bài', 'Học tập linh hoạt trên Web và App'],
            web: ['assets/web-nv/nv-web-khoa-hoc-dang-hoc.png', 'assets/web-nv/nv-web-chi-tiet-bai-hoc.png'],
            web: [
                'assets/web-nv/nv-web-khoa-hoc-dang-hoc.png',
                'assets/web-nv/nv-web-chi-tiet-bai-hoc.png',
                'assets/web-nv/nv-web-thu-vien.png'
            ],
            app: ['assets/app-nv/nv-app-trang-chu.png', 'assets/app-nv/nv-app-khoa-le.png']
        },
        {
            tabLabel: 'Kiểm tra<br>kiến thức',
            kicker: 'Đánh giá mức độ tiếp thu sau học tập',
            title: 'Kiểm tra kiến thức',
            description: 'Người học thực hiện bài kiểm tra trên App để đánh giá kiến thức đã tiếp thu, đồng thời xem kết quả và xác định mức độ đáp ứng yêu cầu của bài kiểm tra.',
            benefits: ['Xem yêu cầu và thông tin bài kiểm tra', 'Thực hiện bài kiểm tra trên App', 'Xem điểm số và trạng thái đạt yêu cầu'],
            web: ['assets/web-nv/nv-web-ket-qua-bai-kiem-tra.png'],
            web: [
                'assets/web-nv/nv-web-chua-hoan-thanh.png',
                'assets/web-nv/nv-web-ket-qua-bai-kiem-tra.png'
            ],
            app: ['assets/app-nv/nv-app-chi-tiet-bai-kiem-tra.png', 'assets/app-nv/nv-app-lam-bai-kiem-tra.png']
        },
        {
            tabLabel: 'Tiến độ &amp;<br>lộ trình',
            kicker: 'Nhận biết nội dung cần tiếp tục hoàn thành',
            title: 'Tiến độ & lộ trình',
            description: 'Người học theo dõi tiến độ thực hiện lộ trình đào tạo, nhận biết những bài học hoặc bài kiểm tra chưa hoàn thành để chủ động tiếp tục chương trình.',
            benefits: ['Xem các nội dung trong lộ trình học tập', 'Theo dõi trạng thái hoàn thành từng nội dung', 'Nhận biết bài học và bài kiểm tra cần tiếp tục'],
            web: ['assets/web-nv/nv-web-lo-trinh-khoa-le.png'],
            web: [
                'assets/web-nv/nv-web-lo-trinh-khoa-le.png',
                'assets/web-nv/nv-web-bao-cao-nang-luc.png'
            ],
            app: ['assets/app-nv/nv-app-lo-trinh.png', 'assets/app-nv/nv-app-tien-do.png']
        },
        {
            tabLabel: 'Kết quả &amp;<br>chứng nhận',
            kicker: 'Ghi nhận thành tích sau đào tạo',
            title: 'Kết quả & chứng nhận',
            description: 'Kết quả học tập và chứng nhận đạt được được ghi nhận trên hệ thống, giúp người học xem lại những thành tích đã hoàn thành trong quá trình đào tạo.',
            benefits: ['Xem kết quả học tập đã được ghi nhận', 'Xem chứng nhận đạt được sau đào tạo', 'Theo dõi các thành tích đã hoàn thành'],
            web: [],
            web: [
                'assets/web-nv/nv-web-hoan-thanh.png'
            ],
            app: ['assets/app-nv/nv-app-ket-qua.png', 'assets/app-nv/nv-app-chung-chi.png']
        }
    ];

    // Put learning-path progress before the knowledge test in the employee flow.
    [employeeShowcaseFeatures[1], employeeShowcaseFeatures[2]] =
        [employeeShowcaseFeatures[2], employeeShowcaseFeatures[1]];

    const createDeviceCarousel = (type) => {
        const root = document.querySelector(`[data-device-carousel="${type}"]`);
        if (!root) return null;

        const screen = root.querySelector(`[data-device-screen="${type}"]`);
        const layers = [...root.querySelectorAll(`[data-device-image="${type}"]`)];
        const emptyState = root.querySelector(`[data-device-empty="${type}"]`);
        const previousButton = root.querySelector(`[data-device-previous="${type}"]`);
        const nextButton = root.querySelector(`[data-device-next="${type}"]`);
        const pagination = root.querySelector(`[data-device-pagination="${type}"]`);
        const caption = root.querySelector('[data-device-caption]');
        let slides = [];
        let featureTitle = '';
        let currentIndex = 0;
        let activeLayer = 0;
        let autoplayTimer = null;
        let transitionTimer = null;
        let renderToken = 0;
        let hovered = false;

        const clearAutoplay = () => {
            window.clearTimeout(autoplayTimer);
            autoplayTimer = null;
        };

        const clearTransition = () => {
            window.clearTimeout(transitionTimer);
            transitionTimer = null;
        };

        const resetScreenScroll = () => {
            if (type === 'app' && screen) screen.scrollTop = 0;
            if (type === 'app' && screen) {
                try {
                    screen.scrollTo({ top: 0, behavior: 'instant' });
                } catch (_) {
                    screen.scrollTop = 0;
                }
            }
        };

        const imageAlt = (index) => `${featureTitle} — màn hình ${type === 'web' ? 'Web' : 'App'} ${index + 1}`;

        const updateCaption = (index) => {
            if (!caption) return;
            const source = slides[index];
            const group = source.includes('/web-sup/') || source.includes('/app-sup/') ? 'sup' :
                source.includes('/web-nv/') || source.includes('/app-nv/') ? 'nv' : '';
            caption.textContent = group === 'sup' ? 'Quản lý đội ngũ' : group === 'nv' ? 'Học tập cá nhân' : '';
            caption.hidden = !group;
        };

        const updatePagination = () => {
            if (!pagination) return;
            [...pagination.children].forEach((dot, index) => {
                const selected = index === currentIndex;
                dot.classList.toggle('is-active', selected);
                if (selected) dot.setAttribute('aria-current', 'true');
                else dot.removeAttribute('aria-current');
            });
        };

        const renderPagination = () => {
            if (!pagination) return;
            if (slides.length <= 1) {
                pagination.hidden = true;
                pagination.replaceChildren();
                if (previousButton) previousButton.hidden = true;
                if (nextButton) nextButton.hidden = true;
                return;
            }
            pagination.hidden = false;
            if (previousButton) previousButton.hidden = false;
            if (nextButton) nextButton.hidden = false;
            pagination.replaceChildren(...slides.map((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', `Xem ảnh ${index + 1} / ${slides.length}`);
                dot.addEventListener('click', () => show(index));
                return dot;
            }));
            updatePagination();
        };

        const preload = (source) => new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = reject;
            image.src = source;
        });

        const scheduleAutoplay = () => {
            clearAutoplay();
            if (slides.length < 2 || hovered || document.hidden || reducedMotion) return;
            if (type === 'app' && screen && (screen.classList.contains('is-dragging') || screen.scrollTop > 30)) return;
            autoplayTimer = window.setTimeout(() => {
                show(currentIndex + 1, true);
            }, 3000);
        };

        const showInstantly = (index) => {
            clearTransition();
            resetScreenScroll();
            currentIndex = index;
            activeLayer = 0;
            layers.forEach((layer, layerIndex) => {
                layer.classList.remove('is-active', 'is-leaving');
                if (layerIndex === 0) {
                    layer.src = slides[index];
                    layer.alt = imageAlt(index);
                    layer.classList.add('is-active');
                } else {
                    layer.removeAttribute('src');
                    layer.alt = '';
                }
            });
            updatePagination();
            updateCaption(index);
        };

        const show = async(requestedIndex, animate = true) => {
            clearAutoplay();
            if (!slides.length) return;
            const nextIndex = (requestedIndex + slides.length) % slides.length;
            const token = ++renderToken;

            if (!animate || reducedMotion || nextIndex === currentIndex) {
                showInstantly(nextIndex);
                scheduleAutoplay();
                return;
            }

            try {
                await preload(slides[nextIndex]);
            } catch {
                scheduleAutoplay();
                return;
            }
            if (token !== renderToken) return;

            clearTransition();
            const oldLayer = layers[activeLayer];
            const nextLayerIndex = activeLayer === 0 ? 1 : 0;
            const nextLayer = layers[nextLayerIndex];
            nextLayer.src = slides[nextIndex];
            nextLayer.alt = imageAlt(nextIndex);
            nextLayer.classList.remove('is-active', 'is-leaving');
            void nextLayer.offsetWidth;

            oldLayer.classList.remove('is-active');
            oldLayer.classList.add('is-leaving');
            nextLayer.classList.add('is-active');
            resetScreenScroll();
            activeLayer = nextLayerIndex;
            currentIndex = nextIndex;
            updatePagination();
            updateCaption(nextIndex);
            transitionTimer = window.setTimeout(() => {
                oldLayer.classList.remove('is-leaving');
                oldLayer.removeAttribute('src');
                oldLayer.alt = '';
                transitionTimer = null;
            }, 400);
            scheduleAutoplay();
        };

        const setSlides = (nextSlides, title, emptyMessage = '') => {
            clearAutoplay();
            clearTransition();
            const token = ++renderToken;
            slides = nextSlides.map((slide) => typeof slide === 'string' ? slide : slide.src);
            featureTitle = title;
            currentIndex = 0;
            root.classList.toggle('is-empty', slides.length === 0);
            root.classList.toggle('has-multiple-slides', slides.length > 1);
            renderPagination();
            if (!slides.length) {
                if (previousButton) previousButton.hidden = true;
                if (nextButton) nextButton.hidden = true;
                layers.forEach((layer) => {
                    layer.classList.remove('is-active', 'is-leaving');
                    layer.removeAttribute('src');
                    layer.alt = '';
                });
                if (emptyState) {
                    const label = emptyState.querySelector('span');
                    if (label) label.textContent = emptyMessage;
                    else emptyState.textContent = emptyMessage;
                    emptyState.hidden = false;
                }
                return;
            }

            if (emptyState) emptyState.hidden = true;
            preload(slides[0]).then(() => {
                if (token !== renderToken) return;
                showInstantly(0);
                slides.slice(1).forEach((source) => {
                    const image = new Image();
                    image.src = source;
                });
                scheduleAutoplay();
            }).catch(() => {
                if (token !== renderToken) return;
                layers.forEach((layer) => {
                    layer.classList.remove('is-active', 'is-leaving');
                    layer.removeAttribute('src');
                    layer.alt = '';
                });
                root.classList.add('is-empty');
                if (emptyState) {
                    const label = emptyState.querySelector('span');
                    if (label) label.textContent = 'Không tải được màn hình minh họa';
                    else emptyState.textContent = 'Không tải được màn hình minh họa';
                    emptyState.hidden = false;
                }
            });
        };

        root.addEventListener('pointerenter', () => {
            hovered = true;
            clearAutoplay();
        });
        root.addEventListener('pointerleave', () => {
            hovered = false;
            scheduleAutoplay();
        });
        if (previousButton) previousButton.addEventListener('click', () => show(currentIndex - 1));
        if (nextButton) nextButton.addEventListener('click', () => show(currentIndex + 1));

        if (type === 'app' && screen) {
            let isDragging = false;
            let startY = 0;
            let startScrollTop = 0;

            const onPointerDown = (e) => {
                if (e.button !== 0 && e.pointerType === 'mouse') return;
                isDragging = true;
                startY = e.clientY;
                startScrollTop = screen.scrollTop;
                screen.classList.add('is-dragging');
                clearAutoplay();
                try {
                    screen.setPointerCapture(e.pointerId);
                } catch (_) {}
            };

            const onPointerMove = (e) => {
                if (!isDragging) return;
                const deltaY = e.clientY - startY;
                screen.scrollTop = startScrollTop - deltaY;
            };

            const stopDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                screen.classList.remove('is-dragging');
                try {
                    if (screen.hasPointerCapture(e.pointerId)) {
                        screen.releasePointerCapture(e.pointerId);
                    }
                } catch (_) {}
                if (!hovered && screen.scrollTop < 20) {
                    scheduleAutoplay();
                }
            };

            screen.addEventListener('pointerdown', onPointerDown);
            screen.addEventListener('pointermove', onPointerMove);
            screen.addEventListener('pointerup', stopDrag);
            screen.addEventListener('pointercancel', stopDrag);

            screen.addEventListener('wheel', () => {
                clearAutoplay();
                if (!hovered && screen.scrollTop < 20) {
                    scheduleAutoplay();
                }
            }, { passive: true });

            layers.forEach((layer) => {
                layer.setAttribute('draggable', 'false');
                layer.addEventListener('dragstart', (e) => e.preventDefault());
            });
        }

        return {
            setSlides,
            resume: scheduleAutoplay,
            pause: clearAutoplay,
            destroy: () => {
                clearAutoplay();
                clearTransition();
                renderToken += 1;
            }
        };
    };

    const webCarousel = createDeviceCarousel('web');
    const appCarousel = createDeviceCarousel('app');

    const getCurrentShowcaseFeatures = () => activeAudience === 'sup' ?
        projectShowcaseFeatures :
        activeAudience === 'employee' ? employeeShowcaseFeatures :
        managementShowcaseFeatures;

    const updateFeatureTabLabels = () => {
        const features = getCurrentShowcaseFeatures();
        featureTabs.forEach((tab, index) => {
            const label = tab.querySelector('span:last-child');
            const feature = features[index];
            if (!label || !feature) return;
            label.innerHTML = feature.tabLabel;
        });
    };

    const getAvailableFeatureIndexes = () =>
        getCurrentShowcaseFeatures().map((_, index) => index);

    const updateFeatureAvailability = () => {
        updateFeatureTabLabels();
        const availableIndexes = getAvailableFeatureIndexes();
        featureTabs.forEach((tab, index) => {
            const isAvailable = availableIndexes.includes(index);
            tab.hidden = !isAvailable;
            if (!isAvailable) {
                tab.classList.remove('is-active');
                tab.setAttribute('aria-selected', 'false');
                tab.tabIndex = -1;
            }
        });
        featureDots.forEach((dot, index) => {
            const isAvailable = availableIndexes.includes(index);
            dot.hidden = !isAvailable;
            if (!isAvailable) {
                dot.classList.remove('is-active');
                dot.removeAttribute('aria-current');
            }
        });
        if (featureTabList) {
            featureTabList.dataset.featureCount = String(availableIndexes.length);
            featureTabList.dataset.audience = activeAudience;
        }
        if (showcasePanel) {
            showcasePanel.dataset.audience = activeAudience;
        }
        const hasMultipleFeatures = availableIndexes.length > 1;
        if (previousFeature) previousFeature.hidden = !hasMultipleFeatures;
        if (nextFeature) nextFeature.hidden = !hasMultipleFeatures;
        const pagination = document.querySelector('.showcase-pagination');
        if (pagination) pagination.hidden = !hasMultipleFeatures;
    };

    const selectShowcaseFeature = (index) => {
        const availableIndexes = getAvailableFeatureIndexes();
        if (!availableIndexes.includes(index)) index = availableIndexes[0];
        if (!showcasePanel) return;
        const features = getCurrentShowcaseFeatures();
        const feature = features[index];
        if (!feature) return;
        featureTabs.forEach((tab, tabIndex) => {
            const selected = tabIndex === index;
            tab.classList.toggle('is-active', selected);
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
        });
        if (featureTabList && featureTabList.scrollWidth > featureTabList.clientWidth) {
            const activeTab = featureTabs[index];
            featureTabList.scrollTo({
                left: activeTab.offsetLeft - (featureTabList.clientWidth - activeTab.offsetWidth) / 2,
                behavior: reducedMotion ? 'auto' : 'smooth'
            });
        }
        featureDots.forEach((dot, dotIndex) => {
            const selected = dotIndex === index;
            dot.classList.toggle('is-active', selected);
            if (selected) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
        showcasePanel.setAttribute('aria-labelledby', `feature-tab-${index + 1}`);
        showcaseNumber.textContent = String(index + 1).padStart(2, '0');
        showcasePanel.dataset.audience = activeAudience;
        showcasePanel.dataset.deviceLayout = feature.deviceLayout || 'default';
        showcaseKicker.textContent = feature.kicker;
        showcaseTitle.textContent = feature.title;
        showcaseDescription.textContent = feature.description;
        showcaseBenefits.replaceChildren(...feature.benefits.map((benefit) => {
            const item = document.createElement('li');
            const check = document.createElement('span');
            check.setAttribute('aria-hidden', 'true');
            check.textContent = '✓';
            item.append(check, document.createTextNode(benefit));
            return item;
        }));
        if (webCarousel) webCarousel.setSlides(feature.web || [], feature.title, 'Không có màn hình Web cho chức năng này');
        if (appCarousel) appCarousel.setSlides(feature.app || [], feature.title, 'Không có màn hình App cho chức năng này');
    };

    featureTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectShowcaseFeature(index));
        tab.addEventListener('keydown', (event) => {
            const availableIndexes = getAvailableFeatureIndexes();
            const position = Math.max(0, availableIndexes.indexOf(index));
            let nextIndex = index;
            if (event.key === 'ArrowRight') nextIndex = availableIndexes[(position + 1) % availableIndexes.length];
            else if (event.key === 'ArrowLeft') nextIndex = availableIndexes[(position - 1 + availableIndexes.length) % availableIndexes.length];
            else if (event.key === 'Home') nextIndex = availableIndexes[0];
            else if (event.key === 'End') nextIndex = availableIndexes[availableIndexes.length - 1];
            else return;
            event.preventDefault();
            featureTabs[nextIndex].focus();
            selectShowcaseFeature(nextIndex);
        });
    });

    featureDots.forEach((dot, index) => dot.addEventListener('click', () => selectShowcaseFeature(index)));
    const previousFeature = document.querySelector('[data-feature-previous]');
    const nextFeature = document.querySelector('[data-feature-next]');
    if (previousFeature) previousFeature.addEventListener('click', () => {
        const activeIndex = featureTabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
        const availableIndexes = getAvailableFeatureIndexes();
        const position = Math.max(0, availableIndexes.indexOf(activeIndex));
        selectShowcaseFeature(availableIndexes[(position - 1 + availableIndexes.length) % availableIndexes.length]);
    });
    if (nextFeature) nextFeature.addEventListener('click', () => {
        const activeIndex = featureTabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
        const availableIndexes = getAvailableFeatureIndexes();
        const position = Math.max(0, availableIndexes.indexOf(activeIndex));
        selectShowcaseFeature(availableIndexes[(position + 1) % availableIndexes.length]);
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (webCarousel) webCarousel.pause();
            if (appCarousel) appCarousel.pause();
        } else {
            if (webCarousel) webCarousel.resume();
            if (appCarousel) appCarousel.resume();
        }
    });

    window.addEventListener('beforeunload', () => {
        if (webCarousel) webCarousel.destroy();
        if (appCarousel) appCarousel.destroy();
    });

    updateFeatureAvailability();
    selectShowcaseFeature(0);

    if (featureCards.length && webappVisual) {
        let previousSelection = '';
        let randomCardTimer = null;
        let visualInViewport = true;

        const randomizeCards = () => {
            const indexes = featureCards.map((_, index) => index);
            for (let index = indexes.length - 1; index > 0; index -= 1) {
                const randomIndex = Math.floor(Math.random() * (index + 1));
                [indexes[index], indexes[randomIndex]] = [indexes[randomIndex], indexes[index]];
            }

            // Chọn ngẫu nhiên 2 hoặc 3 card để tự hiển thị nổi bật
            const activeCount = 2 + Math.floor(Math.random() * 2);
            let selectedIndexes = indexes.slice(0, activeCount).sort((a, b) => a - b);
            let signature = selectedIndexes.join('-');

            if (signature === previousSelection && featureCards.length > activeCount) {
                const replacement = indexes.find((index) => !selectedIndexes.includes(index));
                if (replacement !== undefined) {
                    selectedIndexes[selectedIndexes.length - 1] = replacement;
                    selectedIndexes = selectedIndexes.sort((a, b) => a - b);
                    signature = selectedIndexes.join('-');
                }
            }

            previousSelection = signature;

            // 2-3 card được chọn sẽ hiển thị rõ (sáng / nổi bật), các card còn lại mờ đi
            featureCards.forEach((card, index) => {
                const isSelected = selectedIndexes.includes(index);
                card.classList.toggle('is-dimmed', !isSelected);
                card.classList.toggle('is-highlighted', isSelected);
            });
            webappVisual.classList.add('is-randomized');
        };

        const scheduleRandomCards = () => {
            window.clearTimeout(randomCardTimer);
            randomCardTimer = window.setTimeout(() => {
                if (!visualInViewport || document.hidden) {
                    scheduleRandomCards();
                    return;
                }
                randomizeCards();
                scheduleRandomCards();
            }, 1500);
        };

        const startRandomCards = () => {
            if (reducedMotion) return;
            if (randomCardTimer) return;
            randomizeCards();
            scheduleRandomCards();
        };

        const pauseRandomCards = () => {
            window.clearTimeout(randomCardTimer);
            randomCardTimer = null;
        };

        const featureVisibility = new IntersectionObserver(([entry]) => {
            visualInViewport = entry.isIntersecting;
            if (visualInViewport) {
                startRandomCards();
            } else {
                pauseRandomCards();
            }
        }, { threshold: .05 });
        featureVisibility.observe(webappVisual);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                pauseRandomCards();
            } else if (visualInViewport) {
                startRandomCards();
            }
        });

        startRandomCards();
    }

    if (!reducedMotion) {
        document.querySelectorAll('[data-tilt]').forEach((card) => {
            card.addEventListener('pointermove', (event) => {
                if (event.pointerType === 'touch') return;
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width - .5;
                const y = (event.clientY - rect.top) / rect.height - .5;
                card.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
                card.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
            });
            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            });
        });
    }
});
