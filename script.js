document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Header fluide au scroll
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Moteur d'animations au scroll (Ultra-smooth Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Se déclenche quand 15% de l'élément est visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajoute la classe active pour déclencher la transition CSS
                entry.target.classList.add('active');
                // Optionnel : arrêter d'observer une fois animé
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // 3. Validation de formulaire ergonomique et ENVOI VIA FORMSPREE
    const contactForm = document.querySelector('.elegant-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            
            // 1. Récupération des données du formulaire
            const formData = new FormData(contactForm);
            
            // Animation de chargement
            submitBtn.style.width = submitBtn.offsetWidth + 'px';
            btnText.style.opacity = '0';
            
            setTimeout(() => {
                btnText.textContent = "Envoi en cours...";
                btnText.style.opacity = '1';
            }, 300);

            // 2. Envoi vers Formspree (AJAX)
            // ⚠️ REMPLACEZ L'URL CI-DESSOUS PAR CELLE FOURNIE PAR FORMSPREE
            fetch("https://formspree.io/f/mwvaneky", {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json' // Très important pour éviter d'être redirigé vers leur page
                }
            })
            .then(response => {
                if (response.ok) {
                    // SUCCÈS : L'email est parti chez Formspree
                    btnText.style.opacity = '0';
                    
                    setTimeout(() => {
                        btnText.textContent = "Dossier transmis";
                        submitBtn.style.backgroundColor = "#7C8A7D"; // Votre vert sauge
                        submitBtn.style.borderColor = "#7C8A7D";
                        btnText.style.opacity = '1';
                    }, 300);
                    
                    // Réinitialisation après 4 secondes
                    setTimeout(() => {
                        contactForm.reset();
                        btnText.style.opacity = '0';
                        
                        setTimeout(() => {
                            btnText.textContent = "Transmettre le dossier";
                            submitBtn.style.backgroundColor = "";
                            submitBtn.style.borderColor = "";
                            submitBtn.style.width = "auto";
                            btnText.style.opacity = '1';
                        }, 300);
                    }, 4000);
                } else {
                    // ERREUR CÔTÉ FORMSPREE (ex: spam détecté)
                    response.json().then(data => {
                        console.error("Erreur Formspree :", data);
                        btnText.style.opacity = '0';
                        setTimeout(() => {
                            btnText.textContent = "Erreur, réessayez";
                            btnText.style.opacity = '1';
                            submitBtn.style.backgroundColor = "#B55A42"; // Rouge rust
                        }, 300);
                    });
                }
            })
            .catch(error => {
                // ERREUR RÉSEAU
                console.error("Erreur réseau :", error);
                btnText.style.opacity = '0';
                setTimeout(() => {
                    btnText.textContent = "Erreur de connexion";
                    btnText.style.opacity = '1';
                    submitBtn.style.backgroundColor = "#B55A42";
                }, 300);
            });
        });
    }
});