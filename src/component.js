// Web Component implementation
import templateHTML from './template.html?raw';
import styles from './styles.css?raw';

class GymstarQuiz extends HTMLElement {
    constructor() {
        super();
        
        // Configuration
        this.config = {
            primaryColor: '#ee0928',
            fontFamily: "'Poppins', sans-serif",
            desktopText: "ZISTI SI SVOJHO TRÉNERA",
            mobileText: "NÁJDI SI TRÉNERA",
            webhookUrl: "https://n8n.srv840889.hstgr.cloud/webhook/gymstar-quiz"
        };

        // State
        this.state = {
            currentStep: 1,
            totalQuestions: 6,
            userGender: 'male',
            answers: {
                gender: '',
                goal: '',
                experience: '',
                frequency: '',
                motivation: '',
                readiness: ''
            },
            buttonPulsed: false
        };
    }

    connectedCallback() {
        // Inject trigger styles globally (they're outside Shadow DOM)
        this.injectTriggerStyles();
        
        // Inject Google Fonts
        if (!document.getElementById('gq-google-fonts')) {
            const link = document.createElement('link');
            link.id = 'gq-google-fonts';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800;900&display=swap';
            document.head.appendChild(link);
        }

        // Create shadow root for style isolation
        this.attachShadow({ mode: 'open' });
        
        // Inject styles and template
        this.shadowRoot.innerHTML = `
            <style>${styles}</style>
            ${templateHTML}
        `;

        // Initialize
        this.init();
        this.injectTriggers();
    }

    injectTriggerStyles() {
        if (document.getElementById('gq-trigger-styles')) return;
        
        const css = `
            /* DESKTOP TRIGGER (Fixed Bottom Right) */
            .gq-trigger-desktop {
                position: fixed;
                bottom: 100px;
                right: 20px;
                background-color: ${this.config.primaryColor};
                color: white;
                padding: 12px 24px;
                border-radius: 50px;
                cursor: pointer;
                font-family: ${this.config.fontFamily};
                font-weight: 900;
                font-size: 16px;
                z-index: 9999;
                border: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                transition: transform 0.2s, background-color 0.2s;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .gq-trigger-desktop:hover {
                transform: scale(1.05);
                background-color: #c40510;
            }
            @media (max-width: 991px) {
                .gq-trigger-desktop { display: none !important; }
            }

            /* MOBILE TRIGGER (Menu Item Style) */
            .gq-trigger-mobile-li {
                list-style: none;
                text-align: center;
                margin: 10px 0;
                padding: 0;
                display: block;
            }
            .gq-trigger-mobile-btn {
                background-color: ${this.config.primaryColor};
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 50px;
                font-family: ${this.config.fontFamily};
                font-weight: 900;
                font-size: 14px;
                text-transform: uppercase;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                display: inline-block;
                width: 80%;
                max-width: 250px;
            }
            @media (min-width: 992px) {
                .gq-trigger-mobile-li { display: none !important; }
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'gq-trigger-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }


    init() {
        // Get elements from shadow DOM
        const shadow = this.shadowRoot;
        
        // Event listeners for quiz options
        shadow.querySelectorAll('.gq-option').forEach(option => {
            option.addEventListener('click', () => {
                const action = option.dataset.action;
                const value = option.dataset.value;
                this.handleSelection(action, value);
            });
        });

        // Back button
        shadow.getElementById('gqBackBtn').addEventListener('click', () => this.prevStep());
        
        // Close button
        shadow.getElementById('gqCloseBtn').addEventListener('click', () => this.closeQuiz());

        // Form buttons
        shadow.getElementById('gqShowFormBtn').addEventListener('click', () => this.nextStep(8));
        shadow.getElementById('gqSubmitBtn').addEventListener('click', () => this.submitForm());

        // Phone input pulse effect
        const phoneInput = shadow.getElementById('gqPhoneInput');
        const submitBtn = shadow.getElementById('gqSubmitBtn');
        
        phoneInput.addEventListener('input', () => {
            const val = phoneInput.value;
            if (!this.state.buttonPulsed && val.length >= 10) {
                this.state.buttonPulsed = true;
                setTimeout(() => {
                    submitBtn.classList.add('entice');
                }, 500);
            }
        });
    }

    injectTriggers() {
        // Desktop Trigger (Fixed)
        if (!document.getElementById('gq-trigger-desktop')) {
            const btn = document.createElement('button');
            btn.id = 'gq-trigger-desktop';
            btn.className = 'gq-trigger-desktop';
            btn.textContent = this.config.desktopText;
            btn.onclick = () => this.openQuiz();
            document.body.appendChild(btn);
        }

        // Mobile Trigger (Menu Item)
        if (!document.getElementById('gq-trigger-mobile')) {
            const selectors = [
                'ul.mod-menu',
                'nav ul.nav',
                'nav ul',
                '.navbar-nav',
                '.navigation > ul'
            ];

            let menu = null;
            for (const sel of selectors) {
                menu = document.querySelector(sel);
                if (menu) break;
            }

            if (menu) {
                const li = document.createElement('li');
                li.className = 'gq-trigger-mobile-li';
                
                const btn = document.createElement('button');
                btn.id = 'gq-trigger-mobile';
                btn.className = 'gq-trigger-mobile-btn';
                btn.textContent = this.config.mobileText;
                btn.onclick = (e) => {
                    e.preventDefault();
                    this.openQuiz();
                };

                li.appendChild(btn);
                menu.appendChild(li);
                console.log('GymStar Quiz: Mobile trigger injected into menu.');
            } else {
                console.warn('GymStar Quiz: Could not find menu.');
            }
        }
    }

    openQuiz() {
        const overlay = this.shadowRoot.getElementById('gq-overlay');
        
        requestAnimationFrame(() => {
            overlay.classList.add('active');
            
            // RESET STATE ON OPEN
            this.state.currentStep = 1;
            this.state.buttonPulsed = false;
            
            // RESET SLIDES
            const slides = this.shadowRoot.querySelectorAll('.gq-slide');
            slides.forEach(slide => {
                slide.classList.remove('active', 'exit-left', 'exit-right', 'enter-left');
                if (slide.dataset.step === "1") {
                    slide.classList.add('active');
                }
            });

            // RESET UI
            this.updateUI(1);
        });
    }

    closeQuiz() {
        const overlay = this.shadowRoot.getElementById('gq-overlay');
        overlay.classList.remove('active');
    }

    handleSelection(action, value) {
        this.state.answers[action] = value;
        
        // GENDER LOGIC
        if (action === 'gender') {
            this.selectGender(value);
        }
        // READINESS LOGIC
        else if (action === 'readiness') {
            this.startLoading();
        }
        // DEFAULT MAPPING
        else {
            const stepMap = {
                'goal': 3,
                'experience': 4,
                'frequency': 5,
                'motivation': 6
            };
            
            if (stepMap[action]) {
                this.nextStep(stepMap[action]);
            }
        }
    }

    selectGender(gender) {
        this.state.userGender = gender;
        this.state.answers.gender = gender === 'male' ? 'Muž' : 'Žena';
        
        const readyText = this.shadowRoot.getElementById('gqDynamicReadyText');
        const cellulitisOption = this.shadowRoot.querySelector('.gq-cellulitis-option');
        
        if (gender === 'female') {
            readyText.innerText = "Si pripravená";
            cellulitisOption.style.display = 'block';
        } else {
            readyText.innerText = "Si pripravený";
            cellulitisOption.style.display = 'none';
        }
        this.nextStep(2);
    }

    nextStep(step) {
        if (typeof step !== 'number') return;
        
        const currentSlide = this.shadowRoot.querySelector(`.gq-slide[data-step="${this.state.currentStep}"]`);
        const nextSlide = this.shadowRoot.querySelector(`.gq-slide[data-step="${step}"]`);

        if (nextSlide) {
            if (currentSlide) {
                currentSlide.classList.remove('active', 'enter-left');
                currentSlide.classList.add('exit-left');
            }

            nextSlide.classList.remove('exit-left', 'exit-right', 'enter-left');
            void nextSlide.offsetWidth;
            nextSlide.classList.add('active');

            this.state.currentStep = step;
            this.updateUI(step);
        }
    }

    prevStep() {
        if (this.state.currentStep <= 1) return;
        
        let targetStep = this.state.currentStep - 1;
        
        if (this.state.currentStep === 8) {
            targetStep = 7;
        }
        
        const currentSlide = this.shadowRoot.querySelector(`.gq-slide[data-step="${this.state.currentStep}"]`);
        const prevSlide = this.shadowRoot.querySelector(`.gq-slide[data-step="${targetStep}"]`);
        
        if (currentSlide && prevSlide) {
            currentSlide.classList.remove('active', 'enter-left', 'exit-left');
            currentSlide.classList.add('exit-right');

            prevSlide.classList.remove('active', 'exit-left', 'exit-right');
            prevSlide.classList.add('enter-left');
            void prevSlide.offsetWidth;

            setTimeout(() => {
                prevSlide.classList.remove('enter-left');
                prevSlide.classList.add('active');
            }, 10);

            this.state.currentStep = targetStep;
            this.updateUI(this.state.currentStep);
        }
    }

    startLoading() {
        this.state.buttonPulsed = false;
        this.shadowRoot.getElementById('gqSubmitBtn').classList.remove('entice');

        const step6 = this.shadowRoot.querySelector('.gq-slide[data-step="6"]');
        step6.classList.remove('active');
        step6.classList.add('exit-left');

        const loader = this.shadowRoot.getElementById('gqLoadingSlide');
        
        loader.classList.remove('exit-left', 'exit-right');
        void loader.offsetWidth;
        loader.classList.add('active');

        this.shadowRoot.getElementById('gqProgressBar').style.opacity = '0';
        this.shadowRoot.getElementById('gqBackBtn').classList.remove('visible');
        this.shadowRoot.getElementById('gqMainHeader').style.opacity = '0';

        setTimeout(() => {
            this.shadowRoot.getElementById('gqSpinner').style.display = 'none';
            this.shadowRoot.getElementById('gqCheckmark').classList.add('show');
            this.shadowRoot.getElementById('gqLoadText').innerText = "Hotovo!";
            
            setTimeout(() => {
                loader.classList.remove('active');
                loader.classList.add('exit-left');
                this.nextStep(7);
            }, 1000);
        }, 1500);
    }

    updateUI(step) {
        const backBtn = this.shadowRoot.getElementById('gqBackBtn');
        const progressBar = this.shadowRoot.getElementById('gqProgressBar');
        const mainHeader = this.shadowRoot.getElementById('gqMainHeader');
        
        if (step > 1 && step < 7) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }

        if (step >= 7) {
            progressBar.style.opacity = '0';
            mainHeader.style.opacity = '0';
            mainHeader.style.pointerEvents = 'none';
        } else {
            progressBar.style.opacity = '1';
            mainHeader.style.opacity = '1';
            mainHeader.style.pointerEvents = 'all';
            this.updateProgress(step);
        }
    }

    updateProgress(step) {
        if (step > this.state.totalQuestions) return;

        const progressInner = this.shadowRoot.querySelector('.gq-progress-inner');
        if (!progressInner) return;

        const beadWidth = 12;
        const totalWidth = progressInner.offsetWidth - beadWidth;
        
        const fillElement = this.shadowRoot.getElementById('gqProgressFill');
        const fillWidth = (totalWidth * (step - 1) / (this.state.totalQuestions - 1));
        fillElement.style.width = `${fillWidth}px`;

        for (let i = 1; i <= this.state.totalQuestions; i++) {
            const bead = this.shadowRoot.getElementById(`bead${i}`);
            if (!bead) continue;
            
            bead.className = 'gq-bead';
            
            if (i < step) {
                bead.classList.add('completed');
            } else if (i === step) {
                bead.classList.add('active');
            }
        }
    }

    submitForm() {
        const phone = this.shadowRoot.getElementById('gqPhoneInput').value.trim();
        const notes = this.shadowRoot.getElementById('gqNotesInput').value.trim();
        
        if (!phone || phone.length < 9) {
            alert('Prosím, zadajte platné telefónne číslo.');
            return;
        }
        
        const payload = {
            phone: phone,
            notes: notes,
            trainer: 'Andrea Kavuličová',
            answers: this.state.answers,
            timestamp: new Date().toISOString()
        };
        
        console.log('Submitting:', payload);
        
        fetch(this.config.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Ďakujeme! Čoskoro vás budeme kontaktovať.');
            this.closeQuiz();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ďakujeme! Čoskoro vás budeme kontaktovať.');
            this.closeQuiz();
        });
    }
}

// Register custom element
customElements.define('gymstar-quiz', GymstarQuiz);
