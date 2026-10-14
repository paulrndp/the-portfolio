// Personal details, skills, experience, and education are based on the supplied résumé.
// Public profile links are sourced from the résumé and the owner's original portfolio.
window.PORTFOLIO = {
  name: "Paul John Jimenez",
  role: "C# / .NET Software Engineer",
  location: "Pampanga, Philippines",
  intro: "Building reliable APIs and business applications.",
  aboutLead: "Reliable systems. Thoughtful engineering.",
  about: "I'm a C#/.NET Software Engineer with 4+ years of professional experience in backend and full-stack development. I build and maintain APIs and business applications, focusing on security, performance, and maintainability.",
  aboutExtra: "I enjoy solving technical problems, improving existing systems, and delivering practical software solutions.",
  email: "paulrndp@gmail.com",
  phone: "+63 947 614 5612",
  phoneLink: "+639476145612",
  github: "https://github.com/paulrndp",
  linkedin: "https://linkedin.com/in/paul-john-jimenez-064692124/",
  portfolio: "https://paulrndp.github.io/the-portfolio/",
  skills: ["C#", "Python", ".NET", "ASP.NET Core", "Entity Framework Core", "PostgreSQL", "Docker", "Vue 3"],
  skillGroups: [
    { title: "Backend Development", items: ["C#", "Python", ".NET", "ASP.NET Core / MVC", "Entity Framework / EF Core", "REST APIs", "Authentication", "RBAC"] },
    { title: "Databases & Caching", items: ["PostgreSQL", "TimescaleDB", "MySQL", "Redis", "SQL"] },
    { title: "Testing & Quality", items: ["xUnit", "NUnit", "Unit / integration testing"] },
    { title: "Tools & DevOps", items: ["Git", "GitLab CI/CD", "Docker", "Postman", "Swagger / OpenAPI"] },
    { title: "Frontend Technologies", items: ["JavaScript", "TypeScript", "Vue 3", "Nuxt"] }
  ],
  experience: [
    { company: "WISE Group - Automasjon & Data / Muir Matheson", location: "Stavanger, Norway", dates: "Apr 2025 – Present", role: "Software Engineer (.NET Developer)", mode: "Part-time", highlights: [{ before: "Build and maintain ASP.NET Core REST APIs for ", linkText: "Orbalux", url: "https://orbalux.com/", after: ", a multi-tenant telemetry and dashboard platform." }, "Enforce tenant ownership checks and role-based permissions across backend APIs.", "Refactor dashboard, widget, sharing, and scheduled snapshot operations into reusable backend services.", "Add PostgreSQL concurrency and regression tests; resolve caching, profile-security, and configuration-import defects."] },
    { company: "NCAS Inc.", location: "Quezon City, Philippines", dates: "Jul 2022 – Jan 2025", role: "Software Engineer (.NET Developer)", mode: "Full-time", highlights: ["Developed full-stack applications and reusable APIs using C#, ASP.NET MVC / .NET Core, and Entity Framework.", "Optimized database queries and backend code to improve application response times.", "Implemented role-based access control and input validation; supported production upgrades, hotfixes, and rollbacks.", "Created unit and integration tests, reviewed code, and mentored junior developers."] }
  ],
  additionalExperience: [
    { company: "Innodata", dates: "Jul 2021 – Jun 2022", role: "Data Analyst (Web Scraper)", description: "Extracted structured datasets using XPath, regular expressions, and Sequentum." },
    { company: "McVean Pacific Int'l Offshoring Inc.", dates: "May 2020 – Jun 2021", role: "Software Engineer (Java / Kotlin)", description: "Built smart contracts using Java and Kotlin." },
    { company: "MVP Asia Pacific", dates: "Jun 2018 – Oct 2018", role: "Quality Assurance Specialist (Intern)", description: "Tested applications, reported defects, and supported regression testing." },
    { company: "Projisoft Solutions", dates: "Jul 2014 – Jan 2015", role: "Junior Software Developer (Freelance)", description: "Delivered .NET / VB.NET inventory and attendance tools and PHP web functionality." },
    { company: "CodeWiz", dates: "2012 – 2013", role: "Software Developer; Programmer Intern", description: "Developed C#/.NET Windows applications and SAP Crystal Reports." }
  ],
  education: [
    { institution: "Holy Angel University", dates: "2015 – 2020", qualification: "B.S. Information Technology, Major in Web Development" },
    { institution: "Greatways Technical Institute", dates: "2010 – 2012", qualification: "Computer Programming" },
    { institution: "TESDA", dates: "Jun 2012", qualification: "National Certificate IV in Computer Programming" }
  ],
  // Professional summaries and live-site preview sources are provided by the owner.
  // Professional stack badges are supplied by the owner or architecture file.
  // Personal project copy, repository links, and artwork were carried forward
  // from the original portfolio and verified against the public repositories.
  projects: [
    { title: "Orbalux", group: "professional", type: "CLOUD-NATIVE SAAS", description: "A SaaS platform for collecting and visualising environmental and operational data.", details: "Orbalux collects and visualises environmental and operational data. My contribution: maintain ASP.NET Core APIs, enforce tenant access, refactor shared backend services, and add automated tests.", tags: ["SaaS", "Data visualisation", "System integration"], stack: ["Vue.js", "TypeScript", "Nuxt", "C#", ".NET", "Docker"], visual: "dashboard", preview: "./assests/imgs/orbalux-preview.png", placeholder: false, detailsPending: false, url: "https://orbalux.com/" },
    { title: "HRSnap", group: "professional", type: "HR & ATTENDANCE MANAGEMENT", description: "An HR and attendance platform for employee records, leave history, and memos, with time tracking through connected apps and biometric systems.", details: "HRSnap brings employee records and daily attendance into one platform. The Employee Information System gives easy access to vacation leave (VL), sick leave (SL), employment status, memos, and employee history. The Daily Time Recorder integrates with TRAiL, WorkMate, MyTracks, and biometric systems for real-time reporting of clock-ins and clock-outs. It identifies late and absent employees, tracks AWOL, habitual tardiness, and absenteeism, and prompts administrators to review whether a memo should be issued.", tags: ["Employee records", "Real-time attendance", "Biometric integration"], stack: ["C#", ".NET", "Entity Framework", "MySQL", "Microservices", "Razor", "MVC"], visual: "tasks", preview: "./assests/imgs/hrsnap-preview.png", placeholder: false, detailsPending: false, url: "https://hrsnap.ncassoftdev.com/" },
    { title: "BreakTheShake", group: "professional", type: "QR-ENABLED SAFETY PLATFORM", description: "A platform for Epilepsy Safety Tag enrollment and profiles. QR-enabled tags provide access to user-authorised emergency contacts, medical details, and instructions.", tags: ["QR safety tags", "Emergency profiles", "Enrollment"], stack: ["Vue 3", "Vite", "Pinia", "Vue Router", "C#", "ASP.NET Core", ".NET 10", "Entity Framework Core", "MySQL", "JWT", "AWS"], visual: "safety", preview: "./assests/imgs/breaktheshake-preview.png", placeholder: false, detailsPending: false, url: "https://btstag.com/Home/welcome" },
    { title: "Hannah M.", group: "personal", type: "CMS PERSONAL BLOG", description: "A content management platform for creating, editing, organising, and publishing personal blog posts.", stack: ["C#", ".NET", "MVC", "HTML", "CSS", "JavaScript"], preview: "./assests/imgs/personal/work-1.png", previewFit: "contain", previewLabel: "GITHUB", placeholder: false, url: "https://github.com/paulrndp/HannahM-Personal-Blog" },
    { title: "Chatter", group: "personal", type: "REAL-TIME CHAT APPLICATION", description: "A real-time public chat application built with ASP.NET Core SignalR and user identity, inspired by Slack-style conversations.", stack: ["C#", "ASP.NET Core", "SignalR", "Authentication", "JavaScript"], preview: "./assests/imgs/personal/work-2.png", previewFit: "contain", previewLabel: "GITHUB", placeholder: false, url: "https://github.com/paulrndp/Chatter" },
    { title: "Note-Tella", group: "personal", type: "NOTE-TAKING WEB APPLICATION", description: "A straightforward note-taking app for creating, editing, deleting, organising, and revisiting notes.", stack: ["C#", "ASP.NET Core / MVC", "Entity Framework", "JavaScript"], preview: "./assests/imgs/personal/work-3.png", previewFit: "contain", previewLabel: "GITHUB", placeholder: false, url: "https://github.com/paulrndp/Notella-note-taking-web-app-csharp-mvc" },
    { title: "Songify", group: "personal", type: "SPOTIFY WEB API APPLICATION", description: "A web application that uses the Spotify API to surface current music releases and help users discover artists and trends.", stack: ["C#", "ASP.NET Core / MVC", "REST APIs", "JavaScript"], preview: "./assests/imgs/personal/work-4.png", previewFit: "contain", previewLabel: "GITHUB", placeholder: false, url: "https://github.com/paulrndp/SpotifyWebAPI-mvc-csharp" },
    { title: "Identity Authentication", group: "personal", type: "SOCIAL AUTHENTICATION DEMO", description: "A demonstration of secure account authentication through Google and Facebook sign-in.", stack: ["C#", "ASP.NET Core", "Authentication", "JavaScript"], preview: "./assests/imgs/personal/work-5.png", previewFit: "contain", previewLabel: "GITHUB", placeholder: false, url: "https://github.com/paulrndp/Identity-Authentication" },
    { title: "ToDo List", group: "personal", type: "TASK MANAGEMENT APPLICATION", description: "A task-management application for organising and tracking daily activities.", stack: ["C#", "ASP.NET Core / MVC", "Entity Framework", "SignalR", "SQL Server"], preview: "./assests/imgs/personal/work-6.png", previewFit: "contain", previewLabel: "GITHUB", placeholder: false, url: "https://github.com/paulrndp/TodoList" }
  ]
};
