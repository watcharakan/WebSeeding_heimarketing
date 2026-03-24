// Performance: merge all scroll handlers into one with requestAnimationFrame
let ticking=false
const navbar=document.getElementById('navbar')
const backToTop=document.getElementById('backToTop')

window.addEventListener('scroll',()=>{
  if(!ticking){
    requestAnimationFrame(()=>{
      const y=window.scrollY
      navbar.classList.toggle('scrolled',y>50)
      backToTop.classList.toggle('show',y>400)
      ticking=false
    })
    ticking=true
  }
},{passive:true})

// Smooth scroll for anchor links — use passive-friendly approach
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault()
    const t=document.querySelector(a.getAttribute('href'))
    if(t){t.scrollIntoView({behavior:'smooth',block:'start'})}
    document.getElementById('navlinks').classList.remove('open')
  })
})

// Back to Top click
backToTop.addEventListener('click',()=>{
  window.scrollTo({top:0,behavior:'smooth'})
})

// Form submit handler
function handleSubmit(e){
  e.preventDefault()
  alert('ขอบคุณครับ! ทีม Heimarketing จะติดต่อกลับภายใน 24 ชั่วโมง')
  e.target.reset()
}

// Intersection Observer for fade-in animation
const obs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}
  })
},{threshold:0.1,rootMargin:'0px 0px -50px 0px'})

document.querySelectorAll('.card,.price-card,.plat,.why-item,details').forEach(el=>{
  el.classList.add('fade-in')
  obs.observe(el)
})

// Load Articles — lazy, non-blocking
if(document.getElementById('articlesGrid')){
  const loadArticles=()=>{
    fetch('articles/data.json').then(r=>r.json()).then(articles=>{
      const grid=document.getElementById('articlesGrid')
      const frag=document.createDocumentFragment()
      articles.forEach(a=>{
        const card=document.createElement('div')
        card.className='article-card fade-in'
        card.innerHTML=`
          <span class="article-badge">${a.category} | ${a.platform}</span>
          <h3>${a.title}</h3>
          <p>${a.excerpt}</p>
          <div class="article-meta">
            <span>${a.date}</span>
            <span>${a.readTime}</span>
          </div>`
        card.addEventListener('click',()=>openArticle(a))
        frag.appendChild(card)
      })
      grid.appendChild(frag)
      grid.querySelectorAll('.article-card').forEach(el=>obs.observe(el))
    }).catch(()=>{})
  }
  // Use Intersection Observer to lazy-load articles when section is near viewport
  const articlesSection=document.getElementById('articles')
  if(articlesSection){
    const lazyObs=new IntersectionObserver((entries,self)=>{
      if(entries[0].isIntersecting){loadArticles();self.disconnect()}
    },{rootMargin:'200px'})
    lazyObs.observe(articlesSection)
  }
}

// Article modal
function openArticle(a){
  document.getElementById('modalCategory').textContent=a.category+' | '+a.platform
  document.getElementById('modalTitle').textContent=a.title
  document.getElementById('modalDate').textContent=a.date
  document.getElementById('modalReadTime').textContent=a.readTime
  document.getElementById('modalPlatform').textContent=a.platform
  document.getElementById('modalBody').textContent=a.content
  const modal=document.getElementById('articleModal')
  modal.classList.add('active')
  document.body.style.overflow='hidden'
}
function closeModal(){
  document.getElementById('articleModal').classList.remove('active')
  document.body.style.overflow=''
}
document.getElementById('articleModalClose').addEventListener('click',closeModal)
document.getElementById('articleModal').addEventListener('click',e=>{
  if(e.target===e.currentTarget)closeModal()
})
document.getElementById('modalCta').addEventListener('click',closeModal)
// Close modal on Escape key
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()})

// Dark/Light Mode Toggle — apply immediately to prevent flash
const themeToggle=document.getElementById('themeToggle')
const themeIcon=document.getElementById('themeIcon')
const savedTheme=localStorage.getItem('theme')
if(savedTheme==='light'){
  document.body.classList.add('light-mode')
  themeIcon.textContent='\u2600'
}
themeToggle.addEventListener('click',()=>{
  document.body.classList.toggle('light-mode')
  const isLight=document.body.classList.contains('light-mode')
  themeIcon.textContent=isLight?'\u2600':'\u263E'
  localStorage.setItem('theme',isLight?'light':'dark')
})

// Close mobile nav when clicking outside
document.addEventListener('click',e=>{
  const navlinks=document.getElementById('navlinks')
  const menuBtn=document.querySelector('.menu-btn')
  if(navlinks.classList.contains('open') && !navlinks.contains(e.target) && !menuBtn.contains(e.target)){
    navlinks.classList.remove('open')
  }
})

// Prevent 300ms tap delay on mobile (already handled by viewport meta, but ensure touch feedback)
document.querySelectorAll('.btn,.btn-nav,.card,.plat,.price-card,.article-card,.menu-btn,.back-to-top,.float-line,.theme-toggle').forEach(el=>{
  el.style.touchAction='manipulation'
})
