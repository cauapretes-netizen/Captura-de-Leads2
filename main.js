const SUPABASE_URL = 'https://ieriliqpbkiejxjjutmx.supabase.co/rest/v1/Leads'
const SUPABASE_API_KEY = 'sb_publishable_zWDnM-5UVCn1SuJbYiaB5A_Hm2DyyrK'

const form = document.getElementById('leadForm')
const messageEl = document.getElementById('message')
const submitBtn = document.getElementById('submitBtn')
const btnText = document.getElementById('btnText')
const btnLoader = document.getElementById('btnLoader')

function showMessage(text, type) {
  messageEl.textContent = text
  messageEl.className = `message ${type}`
  messageEl.classList.remove('hidden')

  setTimeout(() => {
    messageEl.classList.add('hidden')
  }, 5000)
}

function setLoading(isLoading) {
  if (isLoading) {
    submitBtn.disabled = true
    btnText.classList.add('hidden')
    btnLoader.classList.remove('hidden')
  } else {
    submitBtn.disabled = false
    btnText.classList.remove('hidden')
    btnLoader.classList.add('hidden')
  }
}

async function submitLead(nome, telefone) {
  const response = await fetch(SUPABASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ nome, telefone })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Erro ao cadastrar lead')
  }

  return response
}

document.getElementById('ddd').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '')
})

document.getElementById('numero').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '')
})

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const nome = document.getElementById('nome').value.trim()
  const ddd = document.getElementById('ddd').value.trim()
  const numero = document.getElementById('numero').value.trim()

  if (!nome || !ddd || !numero) {
    showMessage('Por favor, preencha todos os campos', 'error')
    return
  }

  if (ddd.length !== 2) {
    showMessage('DDD deve ter 2 dígitos', 'error')
    return
  }

  if (numero.length < 8 || numero.length > 9) {
    showMessage('Número deve ter 8 ou 9 dígitos', 'error')
    return
  }

  const telefone = `(${ddd}) ${numero}`

  setLoading(true)

  try {
    await submitLead(nome, telefone)
    showMessage('Lead cadastrado com sucesso!', 'success')
    form.reset()
  } catch (error) {
    console.error('Erro:', error)
    showMessage('Erro ao cadastrar lead. Tente novamente.', 'error')
  } finally {
    setLoading(false)
  }
})
