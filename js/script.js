const contentDiv = document.getElementById('content');

// Função para renderizar uma seção
function renderSection(sectionData) {
    let sectionHTML = `
        <div class="section">
            <h2>${sectionData.title}</h2>
            ${sectionData.description ? `<p>${sectionData.description}</p>` : ''}
    `;
    sectionData.subsections.forEach(subsection => {
        sectionHTML += `
            ${subsection.subtitle ? `<h3>${subsection.subtitle}</h3>` : ''}
            ${subsection.description ? `<p>${subsection.description}</p>` : ''}
        `;
        if (subsection.examples && subsection.examples.length > 0) {
            subsection.examples.forEach(example => {
                const explanation = example.explanation || 'Resposta Ideal (Júnior): Não disponível<br>Resposta Simples: Não disponível';
                const [idealResponse, simpleResponse] = explanation.includes('<br>')
                    ? explanation.split('<br>')
                    : [explanation, 'Não disponível'];

                const idealText = (idealResponse || 'Não disponível').replace('Resposta Ideal (Júnior): ', '');
                const simpleText = (simpleResponse || 'Não disponível').replace('Resposta Simples: ', '');

                sectionHTML += `
                    <div class="example">
                        <p><strong>${example.title}</strong></p>
                        ${example.code ? `<pre><code>${example.code}</code></pre>` : ''}
                        <p class="response ideal-response"><strong>Resposta Ideal (Júnior):</strong> ${idealText}</p>
                        <p class="response simple-response"><strong>Resposta Simples:</strong> ${simpleText}</p>
                        ${example.starAnalysis ? `<p class="star-analysis"><strong>Análise STAR:</strong> ${example.starAnalysis}</p>` : ''}
                    </div>
                `;
            });
        }
        if (subsection.listItems && subsection.listItems.length > 0) {
            sectionHTML += `<ul>`;
            subsection.listItems.forEach(item => {
                sectionHTML += `<li>${item}</li>`;
            });
            sectionHTML += `</ul>`;
        }
        if (subsection.image) {
            sectionHTML += `<img src="${subsection.image}" alt="${subsection.imageAlt}">`;
        }
    });
    sectionHTML += `</div>`;
    contentDiv.innerHTML = sectionHTML;
}

// Função para carregar uma seção dinamicamente
async function loadSection(sectionName) {
    try {
        const response = await fetch(`./data/${sectionName}.json`);
        if (!response.ok) throw new Error(`Falha ao carregar ${sectionName}.json`);
        const sectionData = await response.json();
        renderSection(sectionData);
    } catch (error) {
        console.error('Erro ao carregar a seção:', error);
        contentDiv.innerHTML = `<p style="color: red;">Erro ao carregar o conteúdo: ${error.message}. Verifique o console para mais detalhes.</p>`;
    }
}

// Adicionar evento de clique para os links da barra lateral
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionName = link.getAttribute('data-section');

        // Remover a classe active de todos os links
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.remove('active');
        });

        // Marcar o link clicado como ativo
        link.classList.add('active');

        // Carregar a seção correspondente
        loadSection(sectionName);

        // Rolar para o topo da página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Carregar a primeira seção por padrão (Fundamentos Java)
loadSection('fundamentos-java');
document.querySelector(`.nav-link[data-section="fundamentos-java"]`).classList.add('active');

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("topBtn").style.display = "block";
    } else {
        document.getElementById("topBtn").style.display = "none";
    }
}
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}