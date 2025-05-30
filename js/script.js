// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentDiv = document.getElementById('content');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const loadingText = document.getElementById('loadingText');

    // Determine the base path for GitHub Pages
    const basePath = window.location.pathname.includes('study-notes') 
        ? '/study-notes/' 
        : '/';
    const dataPath = `${basePath}data/`;

    // Function to load a section
    const loadSection = async (sectionName, link) => {
        // Remove .json extension if present to avoid duplication
        const cleanSectionName = sectionName.replace('.json', '');
        const fullUrl = `${dataPath}${cleanSectionName}.json`;
        console.log(`Fetching: ${fullUrl}`); // Debug log

        loadingSpinner.style.display = 'block';
        loadingText.style.display = 'block';

        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');

        try {
            const response = await fetch(fullUrl);
            if (!response.ok) throw new Error(`Falha ao carregar ${fullUrl}: ${response.status} ${response.statusText}`);
            const data = await response.json();

            loadingSpinner.style.display = 'none';
            loadingText.style.display = 'none';

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
            console.error('Erro ao carregar a seção:', error);
            loadingSpinner.style.display = 'none';
            loadingText.style.display = 'none';
            contentDiv.innerHTML = `<div class="card-body"><p class="text-danger">Erro ao carregar o tópico: ${error.message}. Verifique o console.</p></div>`;
        }
    };

    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const section = link.getAttribute('data-section');
            loadSection(section, link);
        });
    });

    // Automatically load "Fundamentos de Java" on page load
    const fundamentosLink = document.querySelector('.nav-link[data-section="fundamentos-java.json"]');
    if (fundamentosLink) {
        loadSection('fundamentos-java.json', fundamentosLink);
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