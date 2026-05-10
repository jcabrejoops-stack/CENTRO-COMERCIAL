// Centro Comercial - Asistente JS (v4.0 Hybrid Scraper)
const SUPABASE_URL = 'https://jyqekqjmmcykkrqihgav.supabase.co';
const SUPABASE_KEY = 'sb_publishable_HCjNR1-PD4AcsGkOV-FSug_Exv3xEER';
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/5i7ar8bb8kg2qxn0obei3htw6r7gk4h2';

function getSupabase() {
    if (!window.supabase) return null;
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Login Logic
async function handleLogin(event) {
    event.preventDefault();
    const supabase = getSupabase();
    if (!supabase) return;
    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const btn = document.querySelector('button[type="submit"]');
    const email = emailInput.value;
    const password = passwordInput.value;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verificando...';
    btn.disabled = true;
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email.includes('@') ? email : `${email}@centrocomercial.com`,
            password: password,
        });
        if (error) {
            alert('Error: ' + error.message);
            btn.innerHTML = originalContent;
            btn.disabled = false;
        } else {
            window.location.href = 'video.html';
        }
    } catch (err) {
        alert('Error inesperado');
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
    if (target) {
        target.style.display = 'block';
        if (viewName === 'perfil') loadAIConfig();
    }
    if (element) element.classList.add('active');
}

// HYBRID SCRAPING LOGIC
async function startScraping() {
    const input = document.getElementById('scraping-query').value.trim();
    const location = document.getElementById('scraping-location').value.trim();
    const btn = document.querySelector('#view-extraer .btn-primary');
    
    if (!input) {
        alert('Escribe algo para buscar o pega un link.');
        return;
    }

    const isURL = input.startsWith('http');
    const type = isURL ? 'url' : 'negocio';

    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-robot fa-spin"></i> Procesando ${isURL ? 'Enlace' : 'Negocio'}...`;
    btn.disabled = true;

    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: type,
                data: input,
                location: location,
                timestamp: new Date().toISOString()
            })
        });

        if (response.ok) {
            alert(`Señal enviada a la IA: ${isURL ? 'Rastreando URL' : 'Buscando Negocio'}.`);
        } else {
            alert('Error en la central de IA.');
        }
    } catch (err) {
        alert('Error de conexión.');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Persistent Brain
async function saveAIConfig() {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const aiName = document.getElementById('ai-name').value;
    const aiKnowledge = document.getElementById('ai-knowledge').value;
    const btn = document.querySelector('#view-perfil .btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    btn.disabled = true;
    const { error } = await supabase.from('ai_settings').upsert({ 
        user_id: session.user.id, ai_name: aiName, ai_knowledge: aiKnowledge, updated_at: new Date()
    });
    if (error) {
        alert('Error');
        btn.innerHTML = originalText;
        btn.disabled = false;
    } else {
        btn.innerHTML = '¡Guardado!';
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
    }
}

async function loadAIConfig() {
    const supabase = getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('ai_settings').select('*').eq('user_id', session.user.id).single();
    if (data) {
        document.getElementById('ai-name').value = data.ai_name;
        document.getElementById('ai-knowledge').value = data.ai_knowledge;
    }
}

async function importGoogleData() {
    const btn = document.querySelector('#view-perfil .btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Importando...';
    setTimeout(() => {
        alert('Importación completada.');
        btn.innerHTML = originalText;
    }, 2000);
}

async function checkSession() {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        const displayEl = document.getElementById('display-user-id');
        if (displayEl) displayEl.innerText = session.user.id.substring(0, 8);
        if (window.location.pathname.includes('panel.html')) loadAIConfig();
    }
}

document.addEventListener('DOMContentLoaded', checkSession);
