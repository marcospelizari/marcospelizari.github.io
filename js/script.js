document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    const contentDiv = document.getElementById('content');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const loadingText = document.getElementById('loadingText');
    const searchInput = document.getElementById('searchInput');

    // Base path for GitHub Pages
    const basePath = window.location.pathname.includes('study-notes') 
        ? '/study-notes/' 
        : '/';
    const dataPath = `${basePath}data/`;

    // Cache for loaded JSONs
    const jsonCache = new Map();

    // Load a section
    const loadSection = async (sectionName, link) => {
        const cleanSectionName = sectionName.replace('.json', '');
        const fullUrl = `${dataPath}${cleanSectionName}.json`;
        console.log(`Fetching: ${fullUrl}`);

        loadingSpinner.style.display = 'block';
        loadingText.style.display = 'block';

        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');

        try {
            let data;
            if (jsonCache.has(cleanSectionName)) {
                data = jsonCache.get(cleanSectionName);
            } else {
                const response = await fetch(fullUrl);
                if (!response.ok) throw new Error(`Falha ao carregar ${fullUrl}: ${response.status} ${response.statusText}`);
                data = await response.json();
                jsonCache.set(cleanSectionName, data);
            }

            loadingSpinner.style.display = 'none';
            loadingText.style.display = 'none';

            contentDiv.innerHTML = `
                <div class="card-body">
                    <h2 class="card-title text-white border-bottom border-primary pb-2">${data.title}</h2>
                    <p class="card-text text-white">${data.description}</p>
                    ${data.version ? `<p class="text-muted small">Versão: ${data.version}</p>` : ''}
                    ${data.resumo ? `
                        <div class="resumo mb-4 p-3 rounded bg-secondary">
                            ${data.resumo.map(paragrafo => `<p class="text-light">${paragrafo}</p>`).join('')}
                        </div>
                    ` : ''}
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
                                        ${subsection.examples.map(example => `
                                            <div class="example mb-3 p-3 rounded">
                                                <p class="text-muted"><strong>Pergunta de Entrevista:</strong> ${example.interview_question}</p>
                                                <p class="text-light mb-2">${example.explanation}</p>
                                                ${example.code ? `
                                                    <div class="code-block">
                                                        <pre><code class="language-${getCodeLanguage(cleanSectionName, example.code)}">${example.code}</code></pre>
                                                    </div>
                                                ` : ''}
                                                ${example.references && example.references.length ? `
                                                    <div class="references-container">
                                                        <p class="text-muted mb-1"><strong>Referências:</strong></p>
                                                        <ul class="list-unstyled references-list">
                                                            ${example.references.map(ref => `<li><a href="${ref}" target="_blank" class="text-primary">${ref}</a></li>`).join('')}
                                                        </ul>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            // Ensure Prism.js highlights code after rendering
            setTimeout(() => Prism.highlightAll(), 0);
            window.scrollTo(0, 0); // Força rolagem ao topo após carregar a seção
        } catch (error) {
            console.error('Erro ao carregar a seção:', error);
            loadingSpinner.style.display = 'none';
            loadingText.style.display = 'none';
            contentDiv.innerHTML = `<div class="card-body"><p class="text-danger">Erro ao carregar o tópico: ${error.message}. Verifique o console.</p></div>`;
        }
    };

    // Determine code language for Prism.js
    function getCodeLanguage(sectionName, code) {
        if (sectionName.includes('docker-devops') && code.includes('version:') && code.includes('services:')) return 'yaml';
        if (code.includes('public class') || code.includes('@')) return 'java';
        return 'plaintext';
    }

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            const title = section.querySelector('.accordion-button').textContent.toLowerCase();
            const content = section.querySelector('.accordion-body').textContent.toLowerCase();
            section.style.display = title.includes(searchTerm) || content.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            const section = link.getAttribute('data-section');
            loadSection(section, link);
        });
    });

    // Load "Fundamentos de Java" on page load
    const fundamentosLink = document.querySelector('[data-section="essencial/fundamentos-java.json"]');
    if (fundamentosLink) {
        loadSection('essencial/fundamentos-java.json', fundamentosLink);
    }
});

// Back-to-top button
function topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide back-to-top button
window.onscroll = function () {
    const topBtn = document.getElementById('topBtn');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        topBtn.style.display = 'block';
    } else {
        topBtn.style.display = 'none';
    }
};