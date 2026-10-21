(() => {
    const frame = document.getElementById('staffing-frame');
    const loader = document.getElementById('staffing-loading');

    frame.addEventListener('load', () => {
        try {
            const doc = frame.contentDocument;
            const sourceHeader = doc.querySelector('body > header');
            if (sourceHeader) sourceHeader.hidden = true;

            if (!doc.querySelector('link[data-spacap-staffing]')) {
                const stylesheet = doc.createElement('link');
                stylesheet.rel = 'stylesheet';
                stylesheet.href = '../E-LEARNING_SYSTEM/staffing-integration.css?v=1';
                stylesheet.dataset.spacapStaffing = '';
                doc.head.appendChild(stylesheet);
            }

            if (!doc.querySelector('.staffing-closing-cta')) {
                doc.body.insertAdjacentHTML('beforeend', `
                    <section class="staffing-closing-cta" aria-labelledby="staffing-cta-title">
                        <div class="staffing-cta-inner">
                            <div class="staffing-cta-copy">
                                <div class="staffing-cta-badge"><i aria-hidden="true"></i>SẴN SÀNG BẮT ĐẦU?</div>
                                <h2 id="staffing-cta-title">Xây đội ngũ vững mạnh hôm nay cho những mục tiêu lớn hơn ngày mai.</h2>
                                <p>ACACY Staffing sẵn sàng đồng hành cùng doanh nghiệp trong hành trình tuyển dụng, vận hành và phát triển đội ngũ nhân sự.</p>
                                <div class="staffing-cta-actions">
                                    <a class="staffing-cta-button staffing-cta-button--primary" href="mailto:info@acacy.com.vn">Liên hệ tư vấn <b aria-hidden="true">→</b></a>
                                    <a class="staffing-cta-button staffing-cta-button--secondary" href="#top">Xem hệ thống <span aria-hidden="true">→</span></a>
                                </div>
                            </div>
                            <div class="staffing-cta-art">
                                <p class="staffing-cta-note">Nhân sự vững hôm nay để tăng trưởng ngày mai!</p>
                                <img src="../E-LEARNING_SYSTEM/assets/staffing-cta-learning.png" alt="Sách, mũ tốt nghiệp, cây xanh và bút tượng trưng cho hành trình phát triển nhân sự">
                            </div>
                        </div>
                        <div class="staffing-cta-footer">© 2026 ACACY. All rights reserved. ACACY Staffing System</div>
                    </section>
                `);
            }
        } catch (error) {
            console.warn('Không thể hoàn tất lớp tích hợp Staffing:', error);
        } finally {
            loader.hidden = true;
            loader.style.display = 'none';
        }
    });
})();
