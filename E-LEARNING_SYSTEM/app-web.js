document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('[data-header]');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    const videoButton = document.querySelector('[data-video-button]');
    const videoDialog = document.querySelector('[data-video-dialog]');
    const videoClose = document.querySelector('[data-video-close]');
    const webappVisual = document.querySelector('.webapp-visual');
    const featureCards = [...document.querySelectorAll('.feature-card')];
    const featureTabs = [...document.querySelectorAll('[data-feature-tab]')];
    const featureDots = [...document.querySelectorAll('[data-feature-dot]')];
    const showcasePanel = document.querySelector('#feature-slide');
    const showcaseNumber = document.querySelector('[data-showcase-number]');
    const showcaseKicker = document.querySelector('[data-showcase-kicker]');
    const showcaseTitle = document.querySelector('[data-showcase-title]');
    const showcaseDescription = document.querySelector('[data-showcase-description]');
    const showcaseBenefits = document.querySelector('[data-showcase-benefits]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    const showcaseFeatures = [{
            kicker: 'Chuẩn hóa nội dung đào tạo trên một hệ thống',
            title: 'Xây dựng nội dung',
            description: 'Tổ chức và quản lý nội dung đào tạo theo từng cấp, từ dự án, chương trình đến khóa học, bài học và câu hỏi.',
            benefits: ['Quản lý dự án và chương trình đào tạo', 'Xây dựng khóa học, bài học và tài liệu', 'Thiết lập ngân hàng câu hỏi'],
            web: [
                'assets/web/web-training-projects.png',
                'assets/web/web-programs.png',
                'assets/web/web-courses.png',
                'assets/web/web-lessons.png',
                'assets/web/web-questions.png',
                'assets/web/web-lesson-materials.png'
            ],
            app: ['assets/app/app-training-home.jpg']
        },
        {
            kicker: 'Kết nối khóa học với đúng người học',
            title: 'Phân bổ khóa học',
            description: 'Quản lý danh sách học viên và các khóa học trong hệ thống, hỗ trợ triển khai nội dung\nđào tạo đến người học.',
            benefits: ['Quản lý danh sách học viên', 'Tổ chức khóa học theo chương trình', 'Người học tiếp cận nội dung trên App'],
            web: [
                'assets/web/web-training-projects.png',
                'assets/web/web-courses.png',
                'assets/web/web-learners.png'
            ],
            app: [
                'assets/app/app-training-home.jpg',
                'assets/app/app-not-started.jpg'
            ]
        },
        {
            kicker: 'Tiếp cận bài học thuận tiện trên thiết bị di động',
            title: 'Học tập linh hoạt',
            description: 'Người học có thể tiếp tục bài học, xem tài liệu và nhận thông báo trên App, giúp việc học thuận tiện hơn trong quá trình làm việc.',
            benefits: ['Tiếp tục các bài học đang thực hiện', 'Truy cập thư viện tài liệu học tập', 'Theo dõi thông báo từ hệ thống'],
            web: [
                'assets/web/web-lessons.png',
                'assets/web/web-lesson-materials.png'
            ],
            app: [
                'assets/app/app-learning-continue.jpg',
                'assets/app/app-library.jpg',
                'assets/app/app-notification.jpg'
            ]
        },
        {
            kicker: 'Đánh giá kết quả học tập theo tiêu chí rõ ràng',
            title: 'Kiểm tra & đánh giá',
            description: 'Quản lý câu hỏi và lịch kiểm tra trên Web, đồng thời hỗ trợ người học thực hiện bài kiểm tra với các điều kiện được thiết lập.',
            benefits: ['Quản lý câu hỏi kiểm tra', 'Thiết lập thời gian, tỷ lệ đạt và số lần thi', 'Hỗ trợ reset và gia hạn bài thi'],
            web: [
                'assets/web/web-questions.png',
                'assets/web/web-study-exam-schedule.png',
                'assets/web/web-exam-reset-extension.png'
            ],
            app: ['assets/app/app-test.jpg']
        },
        {
            kicker: 'Định hướng phát triển năng lực theo lộ trình',
            title: 'Lộ trình & năng lực',
            description: 'Xây dựng lộ trình đào tạo gắn với các tiêu chí năng lực, giúp tổ chức định hướng học tập và người học theo dõi tiến trình của mình.',
            benefits: ['Thiết lập lộ trình đào tạo', 'Quản lý tiêu chí và cấp độ năng lực', 'Theo dõi tiến trình theo lộ trình trên App'],
            web: [
                'assets/web/web-learning-paths.png',
                'assets/web/web-training-criteria.png'
            ],
            app: ['assets/app/app-report-path.jpg']
        },
        {
            kicker: 'Theo dõi tiến độ và ghi nhận kết quả học tập',
            title: 'Kết quả & báo cáo',
            description: 'Người học theo dõi tiến độ và kết quả các khóa học trên App; hệ thống Web hỗ trợ xuất dữ liệu từ màn hình quản lý lịch học và thi.',
            benefits: ['Theo dõi tiến độ học tập', 'Xem kết quả khóa học đã đạt và chưa đạt', 'Hỗ trợ xuất báo cáo lịch học và thi trên Web'],
            web: ['assets/web/web-study-exam-schedule.png'],
            app: [
                'assets/app/app-report-progress.jpg',
                'assets/app/app-report-course.jpg'
            ]
        }
    ];

    const createDeviceCarousel = (type) => {
        const root = document.querySelector(`[data-device-carousel="${type}"]`);
        if (!root) return null;

        const layers = [...root.querySelectorAll(`[data-device-image="${type}"]`)];
        const emptyState = root.querySelector(`[data-device-empty="${type}"]`);
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

        const imageAlt = (index) => `${featureTitle} — màn hình ${type === 'web' ? 'Web' : 'App'} ${index + 1}`;

        const preload = (source) => new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = resolve;
            image.onerror = reject;
            image.src = source;
        });

        const scheduleAutoplay = () => {
            clearAutoplay();
            if (slides.length < 2 || hovered || document.hidden || reducedMotion) return;
            autoplayTimer = window.setTimeout(() => {
                show(currentIndex + 1, true);
            }, 3000);
        };

        const showInstantly = (index) => {
            clearTransition();
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
            activeLayer = nextLayerIndex;
            currentIndex = nextIndex;
            transitionTimer = window.setTimeout(() => {
                oldLayer.classList.remove('is-leaving');
                oldLayer.removeAttribute('src');
                oldLayer.alt = '';
                transitionTimer = null;
            }, 500);
            scheduleAutoplay();
        };

        const setSlides = (nextSlides, title, emptyMessage = '') => {
            clearAutoplay();
            clearTransition();
            const token = ++renderToken;
            slides = [...nextSlides];
            featureTitle = title;
            currentIndex = 0;
            root.classList.toggle('is-empty', slides.length === 0);
            if (!slides.length) {
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

    const selectShowcaseFeature = (index) => {
        if (!showcaseFeatures[index] || !showcasePanel) return;
        const feature = showcaseFeatures[index];
        featureTabs.forEach((tab, tabIndex) => {
            const selected = tabIndex === index;
            tab.classList.toggle('is-active', selected);
            tab.setAttribute('aria-selected', String(selected));
            tab.tabIndex = selected ? 0 : -1;
        });
        featureDots.forEach((dot, dotIndex) => {
            const selected = dotIndex === index;
            dot.classList.toggle('is-active', selected);
            if (selected) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
        showcasePanel.setAttribute('aria-labelledby', `feature-tab-${index + 1}`);
        showcaseNumber.textContent = String(index + 1).padStart(2, '0');
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
        if (webCarousel) webCarousel.setSlides(feature.web, feature.title);
        if (appCarousel) appCarousel.setSlides(feature.app, feature.title, feature.appEmpty || 'Không có màn hình App cho chức năng này');
    };

    featureTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectShowcaseFeature(index));
        tab.addEventListener('keydown', (event) => {
            let nextIndex = index;
            if (event.key === 'ArrowRight') nextIndex = (index + 1) % featureTabs.length;
            else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + featureTabs.length) % featureTabs.length;
            else if (event.key === 'Home') nextIndex = 0;
            else if (event.key === 'End') nextIndex = featureTabs.length - 1;
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
        selectShowcaseFeature((activeIndex - 1 + featureTabs.length) % featureTabs.length);
    });
    if (nextFeature) nextFeature.addEventListener('click', () => {
        const activeIndex = featureTabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
        selectShowcaseFeature((activeIndex + 1) % featureTabs.length);
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

    selectShowcaseFeature(0);

    if (featureCards.length && webappVisual) {
        let previousSelection = '';
        let randomCardTimer = null;

        const dimRandomCards = () => {
            const indexes = featureCards.map((_, index) => index);
            for (let index = indexes.length - 1; index > 0; index -= 1) {
                const randomIndex = Math.floor(Math.random() * (index + 1));
                [indexes[index], indexes[randomIndex]] = [indexes[randomIndex], indexes[index]];
            }

            const dimCount = 2 + Math.floor(Math.random() * 2);
            let selectedIndexes = indexes.slice(0, dimCount).sort((a, b) => a - b);
            let signature = selectedIndexes.join('-');

            if (signature === previousSelection && featureCards.length > dimCount) {
                const replacement = indexes.find((index) => !selectedIndexes.includes(index));
                selectedIndexes[selectedIndexes.length - 1] = replacement;
                selectedIndexes = selectedIndexes.sort((a, b) => a - b);
                signature = selectedIndexes.join('-');
            }

            previousSelection = signature;
            featureCards.forEach((card, index) => card.classList.toggle('is-dimmed', selectedIndexes.includes(index)));
            webappVisual.classList.add('is-randomized');
        };

        const scheduleRandomCards = () => {
            window.clearTimeout(randomCardTimer);
            randomCardTimer = window.setTimeout(() => {
                dimRandomCards();
                scheduleRandomCards();
            }, 2100 + Math.random() * 1500);
        };

        dimRandomCards();
        if (!reducedMotion) scheduleRandomCards();

        document.addEventListener('visibilitychange', () => {
            window.clearTimeout(randomCardTimer);
            if (!document.hidden && !reducedMotion) {
                dimRandomCards();
                scheduleRandomCards();
            }
        });
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