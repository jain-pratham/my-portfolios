
import { useState, useEffect } from 'react';


import { Mail, Phone, Github, Eye, Book, Send, ChevronDown } from 'lucide-react';



const Index = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [activePage, setActivePage] = useState('about');
  const [selectActive, setSelectActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterCategory, setFilterCategory] = useState('all');
  const [overlayImage, setOverlayImage] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);

  const projects = [
    { title: "NeuroNova-Portfolio", category: "web design", image: "NeuroNova-Portfolio.png", link: "https://neuro-nova-portfolio.vercel.app/" },
    // { title: "Card Slider", category: "web design", image: "card-slider.png", link: "" },
    // { title: "Image Carousel", category: "web design", image: "responsive-image-carousel.png", link: "" },
    // { title: "Hover Card", category: "web design", image: "hover-card.png", link: "" },
    // { title: "Profile Card", category: "web design", image: "profile.png", link: "" },
    // { title: "Spotify Player", category: "web design", image: "spotifyplayer.png", link: "" },

    { title: "Real-Time Chat Application", category: "Full Stack", image: "chat_app.png", link: "https://fullstack-chat-app-by-pratham-2.onrender.com" },
    { title: "Travelling guide review", category: "Full Stack", image: "wandarlast.png", link: "https://github.com/mangothecat07/SMS.git" },
    { title: "Book Ecommerce", category: "Full Stack", image: "book_ecommerce.png" },

    { title: "Image Number Classification", category: "AI/ML", image: "number_classification.png", link: "https://github.com/jain-pratham/Image_Identification" },
    { title: "Adaptive-Face-Recognition-Engine", category: "AI/ML", image: "Recognition-Engine.png", link: "https://github.com/jain-pratham/Adaptive-Face-Recognition-Engine" },
    { title: "Image Face Recognition", category: "AI/ML", image: "face_recognition.png", link: "https://pro1-ak7f.onrender.com/" },

    { title: "thesiswithdrpoonam.in", category: "Freelance", image: "Consultancy.png", link: "https://thesiswithdrpoonam.in/" },
  ];

  const filterProjects = (category: string) => {
    setFilterCategory(category.toLowerCase());
    setSelectedCategory(category === 'all' ? 'All' : category);
  };

  const filteredProjects = projects.filter(project =>
    filterCategory === 'all' || project.category.toLowerCase() === filterCategory
  );

  useEffect(() => {
    // Load styles
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = '/portfolio-styles.css'; // Your CSS file
    document.head.appendChild(styleLink);

    // Load Poppins font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap';
    document.head.appendChild(fontLink);

    // Load ionicons
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js';
    script.type = 'module';
    document.body.appendChild(script);

    const script2 = document.createElement('script');
    script2.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js';
    script2.setAttribute('nomodule', '');
    document.body.appendChild(script2);

    return () => {
      if (styleLink.parentNode) document.head.removeChild(styleLink);
      if (fontLink.parentNode) document.head.removeChild(fontLink);
      if (script.parentNode) document.body.removeChild(script);
      if (script2.parentNode) document.body.removeChild(script2);
    };
  }, []);

  useEffect(() => {
    if (overlayImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [overlayImage]);


  return (
    <main>
      <aside className={`sidebar ${sidebarActive ? 'active' : ''}`} data-sidebar>
        <div className="sidebar-info">
          <figure className="avatar-box">
            <img src="pratham1.jpg" alt="Pratham Jain" width="80" />
          </figure>

          <div className="info-content">
            <h1 className="name " title="Kunal Makhija">Pratham Jain</h1>
            <p className="title">Web developer & AI-ML developer</p>
          </div>

          <button className="info_more-btn" onClick={() => setSidebarActive(!sidebarActive)}>
            <span>Show Contacts</span>
            <Eye size={20} />
          </button>
        </div>

        <div className="sidebar-info_more">
          <div className="separator"></div>

          <ul className="contacts-list">
            <li className="contact-item">
              <div className="icon-box ">
                <Mail size={20} />
              </div>
              <div className="contact-info">
                <p className="contact-title">Email</p>
                <span style={{ color: '#fff' }}>jainpratham4050@...</span>
              </div>
            </li>

            <li className="contact-item">
              <div className="icon-box">
                <Phone size={20} />
              </div>
              <div className="contact-info">
                <p className="contact-title">Phone</p>
                <span style={{ color: '#fff' }}>+91 7016945985</span>
              </div>
            </li>

            <li className="contact-item">
              <div className="icon-box">
                <Github size={20} />
              </div>
              <div className="contact-info">
                <a href="https://github.com/jain-pratham" className="social-link">
                  <p style={{ color: '#fff' }}>Github</p>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <div className="main-content">
        <nav className="navbar">
          <ul className="navbar-list">
            <li className="navbar-item">
              <button className={`navbar-link ${activePage === 'about' ? 'active' : ''}`} onClick={() => setActivePage('about')}>About</button>
            </li>
            <li className="navbar-item">
              <button className={`navbar-link ${activePage === 'resume' ? 'active' : ''}`} onClick={() => setActivePage('resume')}>Resume</button>
            </li>
            <li className="navbar-item">
              <button className={`navbar-link ${activePage === 'portfolio' ? 'active' : ''}`} onClick={() => setActivePage('portfolio')}>Portfolio</button>
            </li>
            <li className="navbar-item">
              <button className={`navbar-link ${activePage === 'contact' ? 'active' : ''}`} onClick={() => setActivePage('contact')}>Contact</button>
            </li>
          </ul>
        </nav>

        <article className={`about ${activePage === 'about' ? 'active' : ''}`} data-page="about">
          <header>
            <h2 className="h2 article-title">About me</h2>
          </header>

          <section className="about-text">
            <p>
              I'm a software developer with 5 years of expertise in mobile and web application development.
              Hands-on experience in designing, developing, and deploying scalable software solutions. My expertise spans across the full software development lifecycle — from understanding business requirements to delivering high-quality, maintainable code.
            </p>
            <p>
              Throughout my career, I have worked with a diverse set of technologies and frameworks, contributing to both frontend and backend development, API design, database management, and cloud integration. I thrive in collaborative environments, enjoy solving complex problems, and continuously seek opportunities to learn and adopt emerging technologies to build efficient and impactful product.
            </p>
          </section>

          <section className="service">
            <h3 className="h3 service-title">What i'm doing</h3>
            <ul className="service-list">
              <li className="service-item">
                <div className="service-icon-box">
                  <img src="icon-design.svg" alt="design icon" width="40" />
                </div>
                <div className="service-content-box">
                  <h4 className="h4 service-item-title">AI/ML Development</h4>
                  <p className="service-item-text">High-quality AI and ML solutions at the intermediate level.</p>
                </div>
              </li>

              <li className="service-item">
                <div className="service-icon-box">
                  <img src="icon-dev.svg" alt="Web development icon" width="40" />
                </div>
                <div className="service-content-box">
                  <h4 className="h4 service-item-title">Web development</h4>
                  <p className="service-item-text">High-quality development of sites at the intermediate level.</p>
                </div>
              </li>


            </ul>
          </section>
        </article>

        <article className={`resume ${activePage === 'resume' ? 'active' : ''}`} data-page="resume">
          <header>
            <h2 className="h2 article-title">Resume</h2>
          </header>

          <section className="timeline">
            <div className="title-wrapper">
              <div className="icon-box">
                <Book size={20} />
              </div>
              <h3 className="h3">Education</h3>
            </div>

            <ol className="timeline-list">
              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">Rofel Universsity Vapi</h4>
                <span>2002 - 2025</span>
                <p className="timeline-text">Bachelor of Computer Applications</p>
              </li>
              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">Indus Universsity</h4>
                <span>2025 - 2027</span>
                <p className="timeline-text">Master of Computer Applications</p>
              </li>
            </ol>
          </section>

          <section className="timeline">
            <div className="title-wrapper">
              <div className="icon-box">
                <Send size={20} />
              </div>
              <h3 className="h3">Experience</h3>
            </div>

            <ol className="timeline-list">
              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">Freelancing</h4>
                <p className="timeline-text">
                  Built a professional website for Dr. Poonam’s consultancy services. <br />
                  <a style={{ color: "hsl(45, 100%, 72%)" }} href="https://github.com/jain-pratham/Consultancy-portfolio">Projects Repository 🔗</a>
                </p>
              </li>

              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">Full Stack Web development</h4>
                <p className="timeline-text">
                  Worked on numerous projects surrounding frontend development using Flutter. <br />
                  Some of these projects are available at: <br />
                  <a style={{ color: "hsl(45, 100%, 72%)" }} href="https://github.com/jain-pratham?tab=repositories">Projects Repository 🔗</a>
                </p>
              </li>

              <li className="timeline-item">
                <h4 className="h4 timeline-item-title">AI/ML development</h4>
                <p className="timeline-text">
                  AI-based object detection system that identifies and classifies real-world objects accurately in real time: <a style={{ color: "hsl(45, 100%, 72%)" }} href="https://github.com/jain-pratham/pro1">Object detection system 🔗</a>
                  <br />
                  An AI-powered image segmentation model that separates objects from backgrounds with high precision: <a style={{ color: "hsl(45, 100%, 72%)" }} href="https://github.com/jain-pratham/pro1">Image Segmentation 🔗</a>
                </p>
              </li>

              {/* <li className="timeline-item">
                <h4 className="h4 timeline-item-title">Mobile Application development</h4>
                <p className="timeline-text">
                  Developed several mobile applications using Flutter and Java:
                  <a href="https://github.com/mangothecat07/zero-waste-repo.git">Zero Waste - Food Donation App</a>
                  <a href="https://github.com/mangothecat07/medmatch.git">Medmatch - Medical Help and Suggestion App</a>
                  <a href="https://github.com/mangothecat07/IndusBusTracker.git">ParkVista - Parking reservation system</a>
                  <a href="https://github.com/mangothecat07/IndusBusTracker.git">IndusBusTracker - Transport Tracking and Management system</a>
                  <a href="https://github.com/mangothecat07/SMS.git">OnlyYours - Private SMS app</a>
                </p>
              </li> */}
            </ol>
          </section>

          <section className="skill">
            <h3 className="h3 skills-title">My skills</h3>
            <ul className="skills-list content-card">
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">MERN Stack (MongoDB, Express.js, React.js, Node.js)</h5>
                </div>
              </li>
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">Next.js</h5>
                </div>
              </li>
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">Tailwind CSS</h5>
                </div>
              </li>
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">Python</h5>
                </div>
              </li>
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">Supervised & Unsupervised Learning</h5>
                </div>
              </li>
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">DeepLearning (NN, CNN, RNN,  LSTM, Generative Models ,...)</h5>
                </div>
              </li>
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">Pytorch & Tensorflow</h5>
                </div>
              </li>
              <li className="skills-item">
                <div className="title-wrapper">
                  <h5 className="h5">GitHub</h5>
                </div>
              </li>
            </ul>
          </section>
        </article>

        <article className={`portfolio ${activePage === 'portfolio' ? 'active' : ''}`} data-page="portfolio">
          <header>
            <h2 className="h2 article-title">Portfolio</h2>
          </header>

          <section className="projects">
            <ul className="filter-list">
              <li className="filter-item">
                <button className={filterCategory === 'all' ? 'active' : ''} onClick={() => filterProjects('all')}>All</button>
              </li>
              <li className="filter-item">
                <button className={filterCategory === 'web design' ? 'active' : ''} onClick={() => filterProjects('Web design')}>Web design</button>
              </li>
              <li className="filter-item">
                <button className={filterCategory === 'Full Stack' ? 'active' : ''} onClick={() => filterProjects('Full Stack')}>Full Stack</button>
              </li>
              <li className="filter-item">
                <button className={filterCategory === 'AI/ML' ? 'active' : ''} onClick={() => filterProjects('AI/ML')}>AI/ML</button>
              </li>
              <li className="filter-item">
                <button className={filterCategory === 'Freelance' ? 'active' : ''} onClick={() => filterProjects('Freelance')}>Freelance</button>
              </li>
            </ul>

            <div className="filter-select-box">
              <button className={`filter-select ${selectActive ? 'active' : ''}`} onClick={() => setSelectActive(!selectActive)}>
                <div className="select-value">{selectedCategory}</div>
                <div className="select-icon">
                  <ChevronDown size={20} />
                </div>
              </button>

              <ul className="select-list">
                <li className="select-item">
                  <button onClick={() => { filterProjects('all'); setSelectActive(false); }}>All</button>
                </li>
                <li className="select-item">
                  <button onClick={() => { filterProjects('Web design'); setSelectActive(false); }}>Web design</button>
                </li>
                <li className="select-item">
                  <button onClick={() => { filterProjects('AI/ML'); setSelectActive(false); }}>AI/ML</button>
                </li>
                <li className="select-item">
                  <button onClick={() => { filterProjects('Freelance'); setSelectActive(false); }}>Freelance</button>
                </li>
              </ul>
            </div>

            <ul className="project-list">
              {filteredProjects.map((project, index) => (
                <li key={index} className="project-item active" data-filter-item data-category={project.category}>
                  <a href="#">
                    <figure className="project-img">
                      <div className="project-item-icon-box" onClick={(e) => { e.preventDefault(); setOverlayImage(project.image); }}>
                        <Eye size={20} />
                      </div>
                      <img src={project.image} alt={project.title} loading="lazy" />
                    </figure>
                    <h3 className="project-title">
                      <a
                        style={{
                          color: "#a855f7",
                          fontWeight: "600",
                          textDecoration: "none"
                        }}

                        href={project.link}
                      >
                        {project.title} 🔗
                      </a>
                    </h3>

                    <p className="project-category">{project.category}</p>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <article className={`contact ${activePage === 'contact' ? 'active' : ''}`} data-page="contact">
          <header>
            <h2 className="h2 article-title">Contact</h2>
          </header>

          <section className="mapbox" data-mapbox>
            <figure>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.9939724166793!2d72.4591485!3d23.032394399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b97329ecc23%3A0xa41622ba682229a!2sLittle%20Wings%20Holistic%20Childhood%20Centre!5e1!3m2!1sen!2sin!4v1760450984365!5m2!1sen!2sin"
                width="400"
                height="300"
                loading="lazy"
              ></iframe>
            </figure>
          </section>

          <section className="contact-form">
            <h3 className="h3 form-title">Contact Form</h3>
            <form action="https://formspree.io/f/xaqddwla" method="POST" className="form">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="fullname"
                  className="form-input"
                  placeholder="Full name"
                  required
                  onChange={(e) => setFormValid(e.currentTarget.form?.checkValidity() || false)}
                />
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Email address"
                  required
                  onChange={(e) => setFormValid(e.currentTarget.form?.checkValidity() || false)}
                />
              </div>
              <textarea
                name="message"
                className="form-input"
                placeholder="Your Message"
                required
                onChange={(e) => setFormValid(e.currentTarget.form?.checkValidity() || false)}
              ></textarea>
              <button className="form-btn" type="submit" disabled={!formValid}>
                <Send size={20} />
                <span>Send Message</span>
              </button>
            </form>
          </section>
        </article>
      </div>

      {overlayImage && (
        <div className="image-overlay" onClick={() => setOverlayImage(null)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <img src={overlayImage} alt="Full Image" />
            <button className="close-overlay" onClick={() => setOverlayImage(null)}>&times;</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Index;
