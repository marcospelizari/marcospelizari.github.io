// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentDiv = document.getElementById('content');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const loadingText = document.getElementById('loadingText');

    // Function to load a topic
    const loadTopic = async (url, link) => {
        // Show loading state
        loadingSpinner.style.display = 'block';
        loadingText.style.display = 'block';

        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            const data = await response.json();

            // Hide loading state
            loadingSpinner.style.display = 'none';
            loadingText.style.display = 'none';

            // Render content with accordion for subsections
            contentDiv.innerHTML = `
                <div class="card-body">
                    <h2 class="card-title text-white border-bottom border-primary pb-2">${data.title}</h2>
                    <p class="card-text text-white">${data.description}</p>
                    <div class="accordion" id="topicAccordion">
                        ${data.subsections.map((subsection, index) => `
                            <div class="accordion-item bg-dark border-0 section">
                                <h3 class="accordion-header">
                                    <button class="accordion-button collapsed bg-dark text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="false" aria-controls="collapse-${index}">
                                        ${subsection.subtitle}
                                    </button>
                                </h3>
                                <div id="collapse-${index}" class="accordion-collapse collapse" data-bs-parent="#topicAccordion">
                                    <div class="accordion-body bg-dark text-white">
                                        ${subsection.examples.map(example => {
                                            // Split explanation at <br>
                                            const responses = example.explanation.split('<br>');
                                            return `
                                                <div class="example mb-3 p-3 rounded">
                                                    ${responses.map(response => {
                                                        const isIdeal = response.includes('Resposta Ideal');
                                                        const isSimple = response.includes('Resposta Simples');
                                                        return `
                                                            <p class="text-light mb-2 ${isIdeal ? 'ideal-response' : isSimple ? 'simple-response' : ''}">${response}</p>
                                                        `;
                                                    }).join('')}
                                                    ${example.code ? `<pre class="bg-secondary text-light p-3 rounded">${example.code}</pre>` : ''}
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading topic:', error);
            loadingSpinner.style.display = 'none';
            loadingText.style.display = 'none';
            contentDiv.innerHTML = '<div class="card-body"><p class="text-danger">Erro ao carregar o tópico. Verifique o console.</p></div>';
        }
    };

    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const section = link.getAttribute('data-section');
            const url = `data/${section}`;
            loadTopic(url, link);
        });
    });

    // Automatically load "Fundamentos de Java" on page load
    const fundamentosLink = document.querySelector('.nav-link[data-section="fundamentos-java.json"]');
    if (fundamentosLink) {
        const url = 'data/fundamentos-java.json';
        loadTopic(url, fundamentosLink);
    }
});

// Back-to-top button functionality
function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide back-to-top button based on scroll
window.onscroll = function () {
    const topBtn = document.getElementById('topBtn');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        topBtn.style.display = 'block';
    } else {
        topBtn.style.display = 'none';
    }
};