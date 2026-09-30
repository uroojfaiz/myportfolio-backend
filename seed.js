// Run once after setting up MongoDB: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Category = require('./models/Category');
const Content = require('./models/Content');

const DEFAULT_CATEGORIES = [
  { key: 'frontend',  label: 'Frontend',            icon: 'code',     color: '#7C93B3' },
  { key: 'backend',   label: 'Backend',              icon: 'terminal', color: '#D9A441' },
  { key: 'database',  label: 'Database',             icon: 'database', color: '#7FC7C0' },
  { key: 'tools',     label: 'Tools & DevOps',       icon: 'layers',   color: '#8B93A6' },
  { key: 'fullstack', label: 'Full-Stack (MERN)',    icon: 'globe',    color: '#F0C419' },
  { key: 'ai',        label: 'AI Projects',          icon: 'cpu',      color: '#B98CE0' },
  { key: 'data',      label: 'Data & Excel',         icon: 'chart',    color: '#8FBF8F' },
  { key: 'sql',       label: 'SQL',                  icon: 'database', color: '#C98A9E' },
  { key: 'learning',  label: 'Currently Learning',   icon: 'book',     color: '#C79A12' },
];

const DEFAULT_SKILLS = [
  { name: 'React', category: 'frontend', level: 85 },
  { name: 'Node.js', category: 'backend', level: 80 },
  { name: 'Express', category: 'backend', level: 80 },
  { name: 'MongoDB', category: 'database', level: 78 },
  { name: 'JavaScript', category: 'frontend', level: 85 },
  { name: 'Tailwind CSS', category: 'frontend', level: 75 },
  { name: 'REST APIs & JWT', category: 'backend', level: 78 },
  { name: 'Figma', category: 'tools', level: 65 },
  { name: 'Git & GitHub', category: 'tools', level: 80 },
  { name: 'SQL', category: 'learning', level: 35 },
];

const DEFAULT_PROJECTS = [
  { name: 'Mela', category: 'fullstack', desc: 'Daraz-style full-featured e-commerce platform with a complete admin panel — cart, orders, product management, and payments flow.', tools: ['React','Node.js','Express','MongoDB','Admin Panel'], live: '', media: '' },
  { name: 'QuillNest', category: 'ai', desc: 'Production-ready blogging platform with AI-assisted writing features, built as a flagship portfolio piece.', tools: ['MERN','OpenAI API','AI Features'], live: '', media: '' },
  { name: 'Chaska', category: 'fullstack', desc: 'Food delivery application, fully deployed with real-time order flow and cloud media handling.', tools: ['MERN','Socket.IO','Cloudinary'], live: 'https://chaska-frontend.vercel.app', media: '' },
  { name: 'Kaarwan', category: 'fullstack', desc: 'LinkedIn-style professional networking app with five distinct reaction types and Google OAuth.', tools: ['MERN','Passport.js','OAuth'], live: 'https://mylinkedln-frontend.vercel.app', media: '' },
  { name: 'ResumeForge', category: 'ai', desc: 'Resume builder SaaS with six templates, an AI-powered ATS checker, and PDF/DOCX parsing.', tools: ['MERN','OpenAI','JWT + Google OAuth'], live: '', media: '' },
  { name: 'SkillNest', category: 'fullstack', desc: 'Skills and learning tracker with an XP system, public portfolios, and an admin analytics dashboard.', tools: ['MERN','Socket.IO','Recharts'], live: '', media: '' },
  { name: 'VidForge AI', category: 'ai', desc: 'AI video generation SaaS with canvas-based export, animated SVG avatars, and text-to-speech narration.', tools: ['MERN','Web Speech API','Canvas API'], live: '', media: '' },
  { name: 'InkSpace', category: 'fullstack', desc: 'Full-featured blogging platform with rich text editing, moderation, and role-based access control.', tools: ['MERN','TipTap','Cloudinary','RBAC'], live: '', media: '' },
];

// Everything below is editable later from the site itself (admin → Site Editor).
const DEFAULT_SITE = {
  brand: { name: 'Urooj', suffix: '.dev' },
  theme: { mode: 'dark', accent: '#F0C419', allowVisitorToggle: true },
  hero: {
    kicker: 'Available for opportunities',
    headline: 'Urooj — MERN Stack Developer.',
    highlight: 'Developer.',
    lead: 'Building production-grade MERN applications — from e-commerce and blogging platforms to AI-assisted tools — with an eye on system design and clean architecture.',
    primaryLabel: 'View Projects',
    primaryHref: '#projects',
    secondaryLabel: 'Get In Touch',
    secondaryHref: '#contact',
    statusRole: 'MERN Stack Developer',
    statusBased: 'Karachi, Pakistan',
    statusFocus: 'Full-stack → System Design',
    statusTyping: 'building & shipping',
  },
  stats: [
    { value: '8', label: 'projects built', source: 'projects' },
    { value: '6', label: 'live deployments', source: 'live' },
    { value: '10', label: 'core technologies', source: 'skills' },
    { value: '5', label: 'current semester', source: 'manual' },
  ],
  marquee: ['React','Node.js','Express','MongoDB','Tailwind CSS','JWT Auth','Socket.IO','OpenAI API','Figma','Git & GitHub'],
  about: {
    title: 'About',
    p1: "I'm an Information Technology student, currently training as a MERN Stack Developer while building real, deployed applications rather than tutorials — from a Daraz-style e-commerce platform to AI-assisted SaaS tools.",
    p2: 'My near-term goal is a full-stack developer role in a fintech or banking IT department; my longer-term direction is system design and software architecture.',
    facts: [
      { k: 'education', v: 'BS Information Technology, SMIU' },
      { k: 'training', v: 'MERN Stack, Saylani Mass IT' },
      { k: 'stack', v: 'MongoDB · Express · React · Node' },
      { k: 'targeting', v: 'Banking / Fintech IT, Software Houses' },
      { k: 'direction', v: 'Full-stack → System Design' },
    ],
  },
  services: [
    { name: 'Full-Stack Web Development', desc: 'Complete MERN applications from database schema to deployed frontend — built to run in production, not just locally.' },
    { name: 'Frontend Development', desc: 'Responsive, animated React interfaces with clean component architecture and Tailwind-based styling.' },
    { name: 'Backend & API Development', desc: 'REST APIs with Express and Node, JWT/OAuth authentication, and role-based access control.' },
    { name: 'AI-Integrated Applications', desc: 'Features powered by AI APIs — content generation, ATS checking, AI chat — wired into a normal web app.' },
    { name: 'Admin Dashboards & Analytics', desc: 'Admin panels with charts, moderation tools, and real-time updates via Socket.IO.' },
    { name: 'Database Design (MongoDB)', desc: 'Schema design and data modeling for applications that need to scale cleanly.' },
  ],
  roadmap: [
    { label: 'MERN Stack', desc: 'Core stack — MongoDB, Express, React, Node. In active use across all shipped projects.', status: 'done', tag: 'Learned' },
    { label: 'Excel', desc: 'Data handling and analysis fundamentals — current focus.', status: 'now', tag: 'Learning now' },
    { label: 'SQL', desc: 'Relational databases and querying — next on the roadmap.', status: 'next', tag: 'Up next' },
    { label: 'Machine Learning', desc: 'Applied ML fundamentals, building on the Generative AI program already underway.', status: 'next', tag: 'Planned' },
  ],
  profile: {
    name: 'Urooj',
    role: 'MERN Stack Developer',
    location: 'Karachi, Pakistan',
    email: 'uroojfaizm@gmail.com',
    phone: '+92 3257662346',
    github: 'https://github.com/uroojfaiz',
    linkedin: 'https://www.linkedin.com/in/urooj-faiz-muhammad-b5aa98341/',
    resumeFile: '',
    summaryShort: 'MERN Stack Developer building production-grade full-stack applications, with a growing focus on system design and architecture.',
    summaryLong: 'Information Technology student and MERN Stack Developer trainee focused on building real, deployed full-stack applications rather than tutorial projects — spanning e-commerce, blogging, and AI-assisted tools. Currently expanding into data analysis (Excel, SQL) and machine learning while working toward a full-stack developer role in a banking or fintech IT department, with a longer-term goal of moving into system design and software architecture.',
  },
  education: { degree: 'BS Information Technology', school: 'Sindh Madressatul Islam University (SMIU), Karachi', status: '5th Semester — in progress' },
  training: [
    { name: 'MERN Stack Web Development', org: 'Saylani Mass IT Training', status: 'In progress' },
    { name: 'Generative AI Program', org: 'Enrolled', status: 'In progress' },
  ],
  seo: {
    title: 'Urooj — MERN Stack Developer',
    description: 'MERN Stack Developer building production-grade full-stack applications, with a growing focus on system design and architecture. Based in Karachi, Pakistan.',
    siteUrl: '',
    ogImage: '',
  },
  footer: 'built with vanilla JS, on purpose.',
};

async function seed(){
  await mongoose.connect(process.env.MONGODB_URI);

  const catCount = await Category.countDocuments();
  if(catCount === 0){
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log(`Inserted ${DEFAULT_CATEGORIES.length} categories.`);
  } else {
    console.log('Categories collection already has data — skipped.');
  }

  const skillCount = await Skill.countDocuments();
  if(skillCount === 0){
    await Skill.insertMany(DEFAULT_SKILLS);
    console.log(`Inserted ${DEFAULT_SKILLS.length} skills.`);
  } else {
    console.log('Skills collection already has data — skipped.');
  }

  const projectCount = await Project.countDocuments();
  if(projectCount === 0){
    await Project.insertMany(DEFAULT_PROJECTS);
    console.log(`Inserted ${DEFAULT_PROJECTS.length} projects.`);
  } else {
    console.log('Projects collection already has data — skipped.');
  }

  const site = await Content.findOne({ key: 'site' });
  if(!site){
    await Content.create({ key: 'site', data: DEFAULT_SITE });
    console.log('Inserted editable site content (hero, about, services, roadmap, profile, theme).');
  } else {
    console.log('Site content already exists — skipped.');
  }

  await mongoose.disconnect();
  console.log('Done. Languages, certificates, experience & testimonials start empty — add them from the site as admin.');
}

seed().catch(err => { console.error(err); process.exit(1); });
