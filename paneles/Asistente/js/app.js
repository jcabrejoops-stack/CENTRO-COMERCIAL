// Centro Comercial - Asistente JS (v2.0 Robust)
const SUPABASE_URL = 'https://jyqekqjmmcykkrqihgav.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HCjNR1-PD4AcsGkOV-FSug_Exv3xEER';

// Login Logic
async function handleLogin(event) {
    event.preventDefault();
    
    // Ensure supabase is loaded
    if (!window.supabase) {
        alert('Cargando motor de seguridad... reintenta en 2 segundos.');
        return;
    }

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const btn = document.querySelector('button[type="submit"]');
    
    if (!emailInput || !passwordInput || !btn) return;

    const email = emailInput.value;
    const password = passwordInput.value;
    
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';
    btn.disabled = true;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.includes('@') ? email : `${email}@centrocomercial.com`,
            password: password,
        });

        if (error) {
            alert('Error de acceso: ' + error.message);
            btn.innerHTML = originalContent;
            btn.disabled = false;
        } else {
            window.location.href = 'video.html';
        }
    } catch (err) {
        alert('Ocurrió un error inesperado al conectar.');
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

// Navigation Logic
function switchView(viewName, element) {
    const sections = ['mapa', 'extraer', 'mensajes', 'listas', 'perfil'];
    sections.forEach(s => {
        const el = document.getElementById('view-' + s);
        if (el) el.style.display = 'none';
    });
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));
    
    const target = document.getElementById('view-' + viewName);
    if (target) target.style.display = 'block';
    if (element) element.classList.add('active');
}

// Video Flow logic
function toggleContinueBtn() {
    const checkbox = document.getElementById('entendido');
    const btn = document.getElementById('btnContinuar');
    if (checkbox && btn) {
        const isChecked = checkbox.checked;
        btn.style.pointerEvents = isChecked ? 'auto' : 'none';
        btn.style.opacity = isChecked ? '1' : '0.5';
        if (isChecked) {
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-secondary');
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
        }
    }
}

// Scraping Logic (Simulated)
async function startScraping() {
    const query = document.getElementById('scraping-query').value;
    const location = document.getElementById('scraping-location').value;
    const btn = document.querySelector('#view-extraer .btn-primary');
    
    if (!query || !location) {
        alert('Por favor completa ambos campos.');
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-gear fa-spin" style="margin-right: 8px;"></i> Activando IA Scraping...';
    btn.disabled = true;

    setTimeout(() => {
        const mockResults = [
            { name: "OdontoDigital " + location, phone: "+52 55123456", ig: "@odonto_digital", rating: 4.9 },
            { name: "Inmobiliaria Gold", phone: "+52 55987654", ig: "@gold_realestate", rating: 4.5 },
            { name: "Estética Premium", phone: "+52 55223344", ig: "@estetica_p", rating: 4.2 }
        ];

        renderResults(mockResults);
        btn.innerHTML = originalText;
        btn.disabled = false;
        document.getElementById('scraping-results').style.display = 'block';
        document.getElementById('results-count').innerText = `${mockResults.length} resultados encontrados`;
    }, 2000);
}

function renderResults(results) {
    const container = document.getElementById('results-container');
    if (!container) return;
    container.innerHTML = results.map(r => `
        <div class="liquid-glass" style="padding: 15px; margin-bottom: 12px; border-left: 4px solid var(--neon-green);">
            <h4 style="font-size: 16px; margin-bottom: 4px;">${r.name}</h4>
            <div style="font-size: 13px; color: rgba(255,255,255,0.8); display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px;">
                <span><i class="fa-solid fa-phone"></i> ${r.phone}</span>
                <span><i class="fa-brands fa-instagram"></i> ${r.ig}</span>
            </div>
        </div>
    `).join('');
}
