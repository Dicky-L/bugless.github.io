<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

type Project = { id:string; no:string; name:string; category:string; tags:string[]; summary:string; kind:string; symbol:string; theme:string }
const projects:Project[]=[
{id:'01',no:'01',name:'Signal / One',category:'Digital',tags:['All','Digital'],summary:'让复杂的数字体验，变得简单而有力量。',kind:'DIGITAL EXPERIENCE',symbol:'◈',theme:'mint'},
{id:'02',no:'02',name:'Form & Feeling',category:'Branding',tags:['All','Branding'],summary:'在形式与感受之间，建立独特的品牌语言。',kind:'BRAND IDENTITY',symbol:'✳',theme:'coral'},
{id:'03',no:'03',name:'Monograph',category:'Web',tags:['All','Web'],summary:'将内容、节奏和互动融合为一体。',kind:'WEB EXPERIENCE',symbol:'◎',theme:'blue'},
{id:'04',no:'04',name:'Orbit Studio',category:'Digital',tags:['All','Digital'],summary:'探索下一代创意工具的视觉边界。',kind:'INTERACTIVE SYSTEM',symbol:'✶',theme:'violet'}
]
const filter=ref('All')
const filtered=computed(()=>projects.filter(p=>p.tags.includes(filter.value)))
const selected=ref<Project|null>(null)
const mobileOpen=ref(false)
const submitted=ref(false)
const submitting=ref(false)
const name=ref('')
const email=ref('')
const service=ref('品牌官网')
const message=ref('')
const year=new Date().getFullYear()
const cursor=ref({x:0,y:0})
const reduceMotion=ref(false)
const progress=ref(0)
const contactDraft=computed(()=>[
  'AETHER / PROJECT INQUIRY',
  '姓名 / Name: '+name.value,
  '邮箱 / Email: '+email.value,
  '需求类型 / Service: '+service.value,
  '需求说明 / Brief: '+message.value
].join('\n'))
const basePath=import.meta.env.BASE_URL
let revealObserver:IntersectionObserver|null=null
let scrollHandler:(()=>void)|null=null
let pointerHandler:((event:PointerEvent)=>void)|null=null
function jump(id:string){mobileOpen.value=false;document.getElementById(id)?.scrollIntoView({behavior:reduceMotion.value?'instant':'smooth'} as ScrollIntoViewOptions)}
function showProject(project:Project){selected.value=project;document.body.classList.add('modal-open')}
function closeProject(){selected.value=null;document.body.classList.remove('modal-open')}
function submit(){
  if(!name.value.trim()||!email.value.trim()||!message.value.trim())return
  submitting.value=true
  const subject=encodeURIComponent('AETHER 官网演示 · '+service.value+' · '+name.value.trim())
  const body=encodeURIComponent(contactDraft.value)
  const a=document.createElement('a')
  a.href='mailto:hello@example.com?subject='+subject+'&body='+body
  a.click()
  submitting.value=false
  submitted.value=true
}
async function changeFilter(value:string){filter.value=value;await nextTick();initReveals()}
function onKey(event:KeyboardEvent){if(event.key==='Escape')closeProject()}
function initReveals(){
  if(reduceMotion.value)return
  const elements=document.querySelectorAll<HTMLElement>('[data-reveal]:not(.observed)')
  elements.forEach(el=>{el.classList.add('observed');revealObserver?.observe(el)})
}
onMounted(()=>{
  reduceMotion.value=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  revealObserver=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');revealObserver?.unobserve(e.target)}})
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'})
  initReveals()
  if(!reduceMotion.value){
    gsap.to('.hero-orb',{rotate:360,duration:40,repeat:-1,ease:'none'})
    gsap.to('.ring-a',{rotate:-360,duration:54,repeat:-1,ease:'none'})
    gsap.to('.ring-b',{rotate:360,duration:58,repeat:-1,ease:'none'})
    gsap.fromTo('.hero-copy > *',{y:26,opacity:0},{y:0,opacity:1,duration:1.0,stagger:0.14,ease:'power3.out',delay:0.08})
  }
  scrollHandler=()=>{const d=document.documentElement;progress.value=d.scrollHeight>d.clientHeight?(d.scrollTop/(d.scrollHeight-d.clientHeight))*100:0}
  window.addEventListener('scroll',scrollHandler,{passive:true})
  pointerHandler=(event:PointerEvent)=>{cursor.value={x:event.clientX,y:event.clientY};document.documentElement.style.setProperty('--mouse-x',event.clientX+'px');document.documentElement.style.setProperty('--mouse-y',event.clientY+'px')}
  window.addEventListener('pointermove',pointerHandler,{passive:true})
  window.addEventListener('keydown',onKey)
})
onUnmounted(()=>{revealObserver?.disconnect();ScrollTrigger.getAll().forEach(x=>x.kill());if(scrollHandler)window.removeEventListener('scroll',scrollHandler);if(pointerHandler)window.removeEventListener('pointermove',pointerHandler);window.removeEventListener('keydown',onKey);document.body.classList.remove('modal-open')})
</script>

<template>
  <div class="site-shell">
    <div class="page-progress" :style="{width: progress+'%'}"></div>
    <header class="site-header">
      <a class="brand" :href="basePath" aria-label="AETHER 首页">AETHER<span class="brand-plus">✳</span><sup>®</sup></a>
      <nav class="desktop-nav" aria-label="主导航">
        <a href="#work" @click.prevent="jump('work')">作品 / WORK</a>
        <a href="#services" @click.prevent="jump('services')">能力 / WHAT WE DO</a>
        <a href="#about" @click.prevent="jump('about')">关于 / ABOUT</a>
      </nav>
      <div class="nav-end"><span class="availability"><span></span> AVAILABLE FOR PROJECTS</span><a href="#contact" class="top-contact" @click.prevent="jump('contact')">开启合作 <span>↗</span></a><button class="menu-button" aria-label="打开菜单" :aria-expanded="mobileOpen" @click="mobileOpen=!mobileOpen">{{mobileOpen?'✕':'☰'}}</button></div>
    </header>
    <div v-if="mobileOpen" class="mobile-nav"><a href="#work" @click.prevent="jump('work')">精选作品</a><a href="#services" @click.prevent="jump('services')">服务能力</a><a href="#about" @click.prevent="jump('about')">关于我们</a><a href="#contact" @click.prevent="jump('contact')">联系合作</a></div>

    <main>
      <section class="hero" id="top">
        <div class="hero-noise"></div><div class="hero-mesh"></div>
        <div class="hero-upper"><span>INDEPENDENT CREATIVE DIGITAL STUDIO</span><span>BASED EVERYWHERE · BUILT FOR TOMORROW</span></div>
        <div class="hero-copy">
          <span class="eyebrow"><span class="eyebrow-line"></span> IDEA. FORM. FEELING.</span>
          <h1>WE MAKE<br/><span class="serif-line">THE <em>FUTURE</em></span><br/>FEEL REAL<span class="period">.</span></h1>
          <p>我们为勇于不同的品牌，创造有感知力的数字体验。<br/>以设计为语言，以技术为引擎，让每一种可能更进一步。</p>
          <div class="hero-actions"><a class="pill-button primary" href="#work" @click.prevent="jump('work')">探索精选作品 <span>↗</span></a><a class="text-button" href="#about" @click.prevent="jump('about')">了解我们的理念 <span>↗</span></a></div>
        </div>
        <div class="hero-art" aria-hidden="true"><div class="halo halo-back"></div><div class="hero-orb"><div class="ring ring-a"></div><div class="ring ring-b"></div><div class="orb-core"></div><div class="orb-shine"></div></div><div class="halo halo-front"></div><div class="orbit-note orbit-one">A / 01<br/>UNLIMITED IDEAS</div><div class="orbit-note orbit-two">FORM FOLLOWS<br/>FEELING ↗</div></div>
        <div class="hero-bottom"><span>01 / 04 — THE INTRODUCTION</span><a href="#work" @click.prevent="jump('work')" class="scroll-cue">SCROLL TO EXPLORE <span>↓</span></a><span>© AETHER {{ year }}</span></div>
      </section>

      <div class="ticker" aria-hidden="true"><div class="ticker-track"><span>DESIGN THAT MOVES <b>✳</b> IDEAS THAT MATTER <b>✳</b> EXPERIENCES THAT LAST <b>✳</b> DESIGN THAT MOVES <b>✳</b> IDEAS THAT MATTER <b>✳</b> EXPERIENCES THAT LAST <b>✳</b></span></div></div>

      <section id="about" class="about-section section-wrap">
        <div class="section-kicker" data-reveal>01 / THE POINT OF VIEW</div>
        <div class="about-content"><h2 data-reveal>GOOD DESIGN<br/>IS NOT AN OPTION.<br/><span>IT'S THE DIFFERENCE.</span></h2><div class="about-side" data-reveal><div class="mini-star">✳</div><p>在这个看似相似的世界里，我们相信真正的好设计，能让每一次接触都变得与众不同。</p><p class="text-muted">不依附于某个行业，不受限于某种形式。我们关注体验本身，也关注每一行代码背后的细节。</p><a href="#services" @click.prevent="jump('services')" class="underline-link">探索我们能做什么 <span>↗</span></a></div></div>
        <div class="stats-row" data-reveal><div><strong>01<span> /</span></strong><small>UNIQUE PERSPECTIVE</small></div><div><strong>∞<span> /</span></strong><small>CREATIVE POSSIBILITIES</small></div><div><strong>100<span>%</span></strong><small>ATTENTION TO DETAIL</small></div></div>
      </section>

      <section id="work" class="work-section section-wrap">
        <div class="section-heading" data-reveal><div><div class="section-kicker">02 / SELECTED EXPLORATIONS</div><h2>WORKS IN<br/><i>PROGRESS.</i></h2></div><p>每个项目都是一种可能性。<br/>以下均为原创概念作品，使用模拟内容展示视觉与交互能力。</p></div>
        <div class="filters" aria-label="筛选作品"><button v-for="tag in ['All','Branding','Digital','Web']" :key="tag" :class="{active:filter===tag}" :aria-pressed="filter===tag" @click="changeFilter(tag)">{{tag==='All'?'全部作品':tag}} <span v-if="filter===tag">↗</span></button></div>
        <div class="project-grid">
          <button v-for="project in filtered" :key="project.id" class="project-card" :class="'theme-'+project.theme" data-reveal @click="showProject(project)">
            <div class="project-visual"><div class="project-topline"><span>{{project.no}} / CONCEPT</span><span>↗</span></div><div class="project-symbol">{{project.symbol}}</div><div class="project-watermark">{{project.name.toUpperCase()}}</div><span class="project-kind">{{project.kind}}</span></div>
            <div class="project-info"><div><h3>{{project.name}}</h3><p>{{project.summary}}</p></div><span class="project-arrow">↗</span></div>
          </button>
        </div>
        <p class="project-disclaimer">* 所有名称、视觉和展示项目均为独立概念演示，不代表真实客户合作记录。</p>
      </section>

      <section id="services" class="services-section"><div class="section-wrap">
        <div class="section-kicker light" data-reveal>03 / THE EXPERTISE</div>
        <div class="services-heading" data-reveal><h2>FROM THE<br/>FIRST <em>SPARK</em><br/>TO EVERY PIXEL<span>.</span></h2><p>从一个想法到可以被真实体验的产品，我们把创意、设计和工程整合在一起。</p></div>
        <div class="services-list">
          <div class="service-item" data-reveal><span class="service-no">01</span><div><h3>Brand Experiences</h3><p>品牌官网 · 视觉语言 · 数字叙事</p></div><span class="service-icon">↗</span></div>
          <div class="service-item" data-reveal><span class="service-no">02</span><div><h3>Digital Products</h3><p>交互原型 · 企业平台 · Web 应用</p></div><span class="service-icon">↗</span></div>
          <div class="service-item" data-reveal><span class="service-no">03</span><div><h3>Creative Engineering</h3><p>动态交互 · 前端工程 · 响应式体验</p></div><span class="service-icon">↗</span></div>
          <div class="service-item" data-reveal><span class="service-no">04</span><div><h3>Beyond the Ordinary</h3><p>动效体验 · 视觉探索 · 独特表达</p></div><span class="service-icon">↗</span></div>
        </div>
      </div></section>

      <section class="manifesto"><div class="manifesto-circle" aria-hidden="true">✳</div><div class="section-wrap"><div class="section-kicker" data-reveal>THE PHILOSOPHY</div><h2 data-reveal>LESS NOISE.<br/><span>MORE </span><i>MAGIC.</i></h2><p data-reveal>好的数字体验，不应该被复杂性定义。</p></div></section>

      <section id="contact" class="contact-section section-wrap">
        <div class="section-kicker" data-reveal>04 / LET'S TALK</div>
        <div class="contact-layout"><div class="contact-copy" data-reveal><h2>GOT AN<br/>IDEA<span>?</span></h2><p>下一件值得期待的作品，或许就从这次对话开始。</p><span class="contact-deco">✳</span></div>
          <form class="contact-form" @submit.prevent="submit" data-reveal>
            <div class="form-row"><label>称呼 / YOUR NAME <input v-model="name" type="text" placeholder="怎么称呼你？" maxlength="70" autocomplete="name" required/></label><label>邮箱 / EMAIL ADDRESS <input v-model="email" type="email" placeholder="hello@yourbrand.com" maxlength="140" autocomplete="email" required/></label></div>
            <label>项目类型 / PROJECT TYPE <select v-model="service"><option>品牌官网</option><option>数字产品 / Web 应用</option><option>交互体验</option><option>其他想法</option></select></label>
            <label>关于项目 / TELL US MORE <textarea v-model="message" rows="3" maxlength="1500" required placeholder="聊聊你的想法、目标或希望解决的问题……"></textarea></label>
            <button type="submit" class="pill-button primary form-submit" :disabled="submitting">生成邮件咨询 <span>↗</span></button>
            <p v-if="submitted" class="form-note success-note">已尝试打开邮件客户端。请在邮件应用中确认收件人和内容后发送；本站不会在后台存储或提交表单。</p><p v-else class="form-note">演示模式：提交时会打开本地邮件客户端，不会将内容发送到服务器。请将示例收件人替换为真实邮箱后再使用。</p>
          </form>
        </div>
      </section>
    </main>
    <footer class="footer"><div><span class="footer-brand">AETHER<span>✳</span></span><small>INDEPENDENT DIGITAL CONCEPT · MADE TO FEEL DIFFERENT</small></div><div class="footer-links"><a href="#top" @click.prevent="jump('top')">回到顶部 ↑</a><a href="https://github.com/Dicky-L/bugless.github.io" target="_blank" rel="noreferrer">GITHUB ↗</a></div><p>© {{year}} AETHER / ORIGINAL PORTFOLIO CONCEPT. ALL DATA & PROJECTS ARE DEMONSTRATIONS.</p></footer>

    <div v-if="selected" class="modal-backdrop" role="presentation" @click.self="closeProject"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="project-title"><button class="modal-close" @click="closeProject" aria-label="关闭作品详情">✕</button><span class="eyebrow dark-eyebrow">{{selected.kind}} · {{selected.no}}</span><div class="modal-symbol" :class="'theme-'+selected.theme">{{selected.symbol}}</div><h2 id="project-title">{{selected.name}}</h2><p>{{selected.summary}}</p><p>这是为展示品牌表达、色彩系统、信息架构和交互视觉而制作的概念案例，并非实际商业客户项目。</p><button class="pill-button primary" @click="closeProject">返回作品列表 <span>↗</span></button></div></div>
  </div>
</template>
