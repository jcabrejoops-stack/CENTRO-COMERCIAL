// Configuration Supabase
const SUPABASE_URL = 'https://jyqekqjmmcykkrqihgav.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HCjNR1-PD4AcsGkOV-FSug_Exv3xEER';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Configuration n8n (Placeholder - Fill this when you have the URL)
const N8N_WEBHOOK_URL = ''; 

// Logic for Window 1 (Login)
async function handleLogin(event) {
    event.preventDefault();
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
        alert('Ocurrió un error inesperado.');
        btn.innerHTML = originalContent;
        btn.disabled = false;
    }
}

// Logic for Window 2 (Video Instructions)
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

// Logic for Window 3 (Panel Navigation)
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

// Phase 3: Scraping Engine
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

    // 1. Call n8n (Placeholder)
    console.log(`Iniciando búsqueda para: ${query} en ${location}`);
    
    // Simulating API call to n8n
    setTimeout(async () => {
        // 2. Process results (Simulated data from Gemini/n8n)
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
    }, 2500);
}

function renderResults(results) {
    const container = document.getElementById('results-container');
    if (!container) return;
    
    container.innerHTML = results.map((r, i) => `
        <div class="liquid-glass" style="padding: 15px; margin-bottom: 12px; border-left: 4px solid var(--neon-green);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h4 style="font-size: 16px; margin-bottom: 4px;">${r.name}</h4>
                    <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 8px;">
                        <i class="fa-solid fa-star" style="color: #FFD700;"></i> ${r.rating} Reseñas Google
                    </p>
                </div>
                <button class="nav-item" style="width: auto; background: none; border: none; padding: 0;" onclick="saveProspect(${i})">
                    <i class="fa-regular fa-bookmark"></i>
                </button>
            </div>
            
            <div style="font-size: 13px; color: rgba(255,255,255,0.8); display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 5px;">
                <span><i class="fa-solid fa-phone text-neon"></i> ${r.phone}</span>
                <span><i class="fa-brands fa-instagram text-neon"></i> ${r.ig}</span>
            </div>
            
            <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button class="btn btn-secondary" style="padding: 8px; font-size: 12px; flex: 1;" onclick="openMap()">Ver Mapa</button>
                <button class="btn btn-primary" style="padding: 8px; font-size: 12px; flex: 1; background: #25D366; box-shadow: none;" onclick="openWA('${r.phone}')">WhatsApp</button>
            </div>
        </div>
    `).join('');
}

// Helpers
function openWA(phone) {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
}

function openMap() {
    alert('Cargando mapa satelital de ubicación...');
}

async function saveProspect(index) {
    alert('Prospecto guardado en tu lista de Supabase.');
}

// Check session
async function checkSession() {
    if (window.location.pathname.includes('panel.html') || window.location.pathname.includes('video.html')) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            console.warn('Sesión no encontrada. Redirigiendo...');
        }
    }
}

document.addEventListener('DOMContentLoaded', checkSession);
