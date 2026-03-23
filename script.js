// Navbar scroll effect
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>50)
})

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault()
    const t=document.querySelector(a.getAttribute('href'))
    if(t){t.scrollIntoView({behavior:'smooth',block:'start'})}
    document.getElementById('navlinks').classList.remove('open')
  })
})

// Form submit handler
function handleSubmit(e){
  e.preventDefault()
  const f=e.target
  const d=new FormData(f)
  alert('ขอบคุณครับ! ทีม Heimarketing จะติดต่อกลับภายใน 24 ชั่วโมง')
  f.reset()
}

// Intersection Observer for fade-in animation
const obs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}
  })
},{threshold:0.1})

document.querySelectorAll('.card,.price-card,.plat,.why-item,details').forEach(el=>{
  el.classList.add('fade-in')
  obs.observe(el)
})

// Add fade-in CSS dynamically
const s=document.createElement('style')
s.textContent='.fade-in{opacity:0;transform:translateY(20px);transition:opacity .5s,transform .5s}.fade-in.visible{opacity:1;transform:translateY(0)}'
document.head.appendChild(s)

// Back to Top button
const backToTop=document.getElementById('backToTop')
window.addEventListener('scroll',()=>{
  backToTop.classList.toggle('show',window.scrollY>400)
})
backToTop.addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:'smooth'})
})

// Dark/Light Mode Toggle
const themeToggle=document.getElementById('themeToggle')
const themeIcon=document.getElementById('themeIcon')
const savedTheme=localStorage.getItem('theme')
if(savedTheme==='light'){
  document.body.classList.add('light-mode')
  themeIcon.textContent='☀'
}
themeToggle.addEventListener('click',()=>{
  document.body.classList.toggle('light-mode')
  const isLight=document.body.classList.contains('light-mode')
  themeIcon.textContent=isLight?'☀':'☾'
  localStorage.setItem('theme',isLight?'light':'dark')
})
