// ========================================
// Navbar
// ========================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobile.classList.toggle('active');
  });

  mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobile.classList.remove('active');
    });
  });
}

// ========================================
// Hero Image Slider (Full-screen background)
// ========================================
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-bg-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length || !dots.length) return;
  let current = 0;
  let interval;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAuto() {
    interval = setInterval(next, 4000);
  }

  function stopAuto() {
    clearInterval(interval);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(parseInt(dot.dataset.index));
      startAuto();
    });
  });

  startAuto();
}

// ========================================
// Countdown Timer
// ========================================
function initCountdown() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 7);
  endDate.setHours(endDate.getHours() + 12);
  endDate.setMinutes(endDate.getMinutes() + 45);

  function update() {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ========================================
// Stat Counter Animation
// ========================================
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let observed = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !observed) {
        observed = true;
        statNumbers.forEach(el => {
          const target = parseInt(el.dataset.target);
          animateCounter(el, target);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) observer.observe(statsBar);
}

function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(step);
}

// ========================================
// FAQ Accordion
// ========================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

// ========================================
// Form Submission
// ========================================
function initForm() {
  const form = document.getElementById('giveawayForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const region = document.getElementById('region').value;
    const city = getCityValue();
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const age = document.getElementById('age').value;
    const maritalStatus = document.getElementById('maritalStatus').value;
    const homeOwner = document.getElementById('homeOwner').value;
    const prizePreference = document.getElementById('prizePreference').value;
    const terms = document.getElementById('terms').checked;

    if (!fullName || !email || !address || !region || !city || !state || !zip || !phone || !age || !maritalStatus || !homeOwner || !prizePreference || !terms) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById('email').focus();
      return;
    }

    if (parseInt(age) < 18) {
      document.getElementById('age').focus();
      return;
    }

    const submission = {
      id: Date.now(),
      fullName,
      email,
      address,
      region,
      city,
      state,
      zip,
      phone,
      occupation: document.getElementById('occupation').value.trim(),
      age,
      maritalStatus,
      homeOwner,
      prizePreference,
      timestamp: new Date().toISOString()
    };

    const submissions = JSON.parse(localStorage.getItem('giveawaySubmissions') || '[]');
    submissions.push(submission);
    localStorage.setItem('giveawaySubmissions', JSON.stringify(submissions));

    document.getElementById('successModal').classList.add('active');
    form.reset();
  });
}

// ========================================
// Modal
// ========================================
function closeModal() {
  document.getElementById('successModal').classList.remove('active');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// ========================================
// Testimonial Carousel
// ========================================
function initTestimonialCarousel() {
  const cards = document.querySelectorAll('.testimonial-track .testimonial-card');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  if (!cards.length) return;

  let current = 0;
  let autoInterval;

  function goTo(index) {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + cards.length) % cards.length;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
    // Collapse any open expand sections in the new card
    cards[current].querySelectorAll('.testimonial-expand.active').forEach(el => el.classList.remove('active'));
    const btn = cards[current].querySelector('.testimonial-read-more');
    if (btn) btn.textContent = 'Read Full Story';
  }

  function startAuto() {
    autoInterval = setInterval(() => goTo(current + 1), 8000);
  }

  function stopAuto() {
    clearInterval(autoInterval);
  }

  prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { stopAuto(); goTo(parseInt(dot.dataset.index)); startAuto(); });
  });

  goTo(0);
  startAuto();
}

function toggleTestimonial(btn) {
  const card = btn.closest('.testimonial-card');
  const expand = card.querySelector('.testimonial-expand');
  if (expand.classList.contains('active')) {
    expand.classList.remove('active');
    btn.textContent = 'Read Full Story';
  } else {
    expand.classList.add('active');
    btn.textContent = 'Show Less';
  }
}

// ========================================
// Region, State & City Selector
// ========================================
const regionStates = {
  america: [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
    "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
    "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
    "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
    "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
    "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
    "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
    "Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador",
    "Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island",
    "Quebec","Saskatchewan","Yukon"
  ],
  europe: [
    "Albania","Andorra","Austria","Belarus","Belgium","Bosnia and Herzegovina",
    "Bulgaria","Croatia","Cyprus","Czech Republic (Czechia)","Denmark","Estonia",
    "Finland","France","Germany","Greece","Hungary","Iceland","Ireland","Italy",
    "Kosovo","Latvia","Liechtenstein","Lithuania","Luxembourg","Malta",
    "Moldova","Monaco","Montenegro","Netherlands","North Macedonia","Norway",
    "Poland","Portugal","Romania","Russia","San Marino","Serbia","Slovakia",
    "Slovenia","Spain","Sweden","Switzerland","Turkey","Ukraine",
    "United Kingdom","Vatican City (Holy See)"
  ]
};

const europeCities = {
  "Albania": ["Tirana","Durrës","Vlorë","Elbasan","Shkodër","Korçë","Fier","Berat"],
  "Andorra": ["Andorra la Vella","Escaldes-Engordany","Encamp","La Massana","Sant Julià de Lòria","Ordino"],
  "Austria": ["Vienna","Graz","Linz","Salzburg","Innsbruck","Klagenfurt","Villach","Wels","St. Pölten","Dornbirn"],
  "Belarus": ["Minsk","Gomel","Mogilev","Vitebsk","Grodno","Brest","Babruysk","Baranovichi"],
  "Belgium": ["Brussels","Antwerp","Ghent","Charleroi","Liège","Bruges","Namur","Leuven","Mons","Aalst"],
  "Bosnia and Herzegovina": ["Sarajevo","Banja Luka","Tuzla","Zenica","Mostar","Bijeljina","Brčko","Bihac"],
  "Bulgaria": ["Sofia","Plovdiv","Varna","Burgas","Ruse","Stara Zagora","Pleven","Sliven","Dobrich","Shumen"],
  "Croatia": ["Zagreb","Split","Rijeka","Osijek","Zadar","Slavonski Brod","Pula","Karlovac","Varaždin","Šibenik"],
  "Cyprus": ["Nicosia","Limassol","Larnaca","Paphos","Famagusta","Kyrenia"],
  "Czech Republic (Czechia)": ["Prague","Brno","Ostrava","Plzeň","Olomouc","Liberec","České Budějice","Hradec Králové","Pardubice","Ústí nad Labem"],
  "Denmark": ["Copenhagen","Aarhus","Odense","Aalborg","Esbjerg","Randers","Kolding","Horsens","Vejle","Roskilde"],
  "Estonia": ["Tallinn","Tartu","Narva","Pärnu","Kohtla-Järve","Viljandi","Maardu","Rakvere"],
  "Finland": ["Helsinki","Espoo","Tampere","Vantaa","Oulu","Turku","Jyväskylä","Lahti","Kuopio","Pori"],
  "France": ["Paris","Marseille","Lyon","Toulouse","Nice","Nantes","Strasbourg","Montpellier","Bordeaux","Lille","Rennes","Reims","Toulon","Saint-Étienne","Le Havre","Grenoble","Dijon","Angers","Nîmes","Clermont-Ferrand"],
  "Germany": ["Berlin","Hamburg","Munich","Cologne","Frankfurt","Stuttgart","Düsseldorf","Leipzig","Dortmund","Essen","Bremen","Dresden","Hannover","Nuremberg","Duisburg","Bochum","Wuppertal","Bielefeld","Bonn","Münster"],
  "Greece": ["Athens","Thessaloniki","Patras","Heraklion","Larissa","Volos","Rhodes","Ioannina","Chania","Chalkidiki"],
  "Hungary": ["Budapest","Debrecen","Szeged","Miskolc","Pécs","Győr","Nyíregyháza","Kecskemét","Székesfehérvár","Szombathely"],
  "Iceland": ["Reykjavik","Kópavogur","Hafnarfjörður","Akureyri","Garðabær","Mosfellsbær","Selfoss"],
  "Ireland": ["Dublin","Cork","Limerick","Galway","Waterford","Drogheda","Kilkenny","Sligo","Wexford","Dundalk"],
  "Italy": ["Rome","Milan","Naples","Turin","Palermo","Genoa","Bologna","Florence","Catania","Venice","Verona","Messina","Padua","Trieste","Brescia","Taranto","Prato","Modena","Reggio Calabria","Perugia"],
  "Kosovo": ["Pristina","Prizren","Peja","Mitrovica","Ferizaj","Gjilan","Gjakovë","Podujevë"],
  "Latvia": ["Riga","Daugavpils","Liepāja","Jelgava","Jūrmala","Ventspils","Rēzekne","Valmiera","Jēkabpils"],
  "Liechtenstein": ["Vaduz","Schaan","Balzers","Triesen","Eschen","Mauren","Triesenberg","Ruggell"],
  "Lithuania": ["Vilnius","Kaunas","Klaipėda","Šiauliai","Panevėžys","Alytus","Marijampolė","Mažeikiai","Utena","Telšiai"],
  "Luxembourg": ["Luxembourg City","Esch-sur-Alzette","Differdange","Dudelange","Ettelbruck","Diekirch","Wiltz","Echternach"],
  "Malta": ["Valletta","Birkirkara","Mosta","Qormi","Sliema","Żabbar","St. Paul's Bay","San Ġwann","Rabat","Żejtun"],
  "Moldova": ["Chișinău","Tiraspol","Bălți","Bender","Cahul","Ungheni","Soroca","Orhei","Comrat","Drochia"],
  "Monaco": ["Monaco-Ville","Monte Carlo","La Condamine","Fontvieille","Larvotto","Moneghetti"],
  "Montenegro": ["Podgorica","Nikšić","Herceg Novi","Plav","Cetinje","Budva","Kotor","Tivat","Bar","Ulcinj"],
  "Netherlands": ["Amsterdam","Rotterdam","The Hague","Utrecht","Eindhoven","Tilburg","Groningen","Almere","Breda","Nijmegen","Enschede","Haarlem","Arnhem","Amersfoort","Apeldoorn","'s-Hertogenbosch","Zwolle","Leiden","Maastricht","Delft"],
  "North Macedonia": ["Skopje","Bitola","Kumanovo","Prilep","Tetovo","Ohrid","Veles","Strumica","Štip","Gostivar"],
  "Norway": ["Oslo","Bergen","Trondheim","Stavanger","Drammen","Fredrikstad","Kristiansand","Sandnes","Tromsø","Sarpsborg"],
  "Poland": ["Warsaw","Kraków","Łódź","Wrocław","Poznań","Gdańsk","Szczecin","Bydgoszcz","Lublin","Białystok","Katowice","Gdynia","Częstochowa","Radom","Sosnowiec","Toruń","Rzeszów","Kielce","Gliwice","Olsztyn"],
  "Portugal": ["Lisbon","Porto","Vila Nova de Gaia","Faro","Coimbra","Braga","Funchal","Setúbal","Évora","Leiria"],
  "Romania": ["Bucharest","Cluj-Napoca","Timișoara","Iași","Constanța","Craiova","Brașov","Galați","Ploiești","Oradea","Brăila","Arad","Pitești","Sibiu","Bacău","Târgu Mureș","Baia Mare","Buzău","Botoșani","Satu Mare"],
  "Russia": ["Moscow","Saint Petersburg","Novosibirsk","Yekaterinburg","Kazan","Nizhny Novgorod","Chelyabinsk","Samara","Omsk","Rostov-on-Don","Ufa","Krasnoyarsk","Voronezh","Perm","Volgograd","Krasnodar","Saratov","Tyumen","Tolyatti","Izhevsk"],
  "San Marino": ["San Marino","Borgo Maggiore","Serravalle","Domagnano","Fiorentino","Acquaviva","Montegiardino"],
  "Serbia": ["Belgrade","Novi Sad","Niš","Kragujevac","Subotica","Zrenjanin","Pančevo","Čačak","Kruševac","Novi Pazar"],
  "Slovakia": ["Bratislava","Košice","Prešov","Žilina","Nitra","Banská Bystrica","Trnava","Trenčín","Martin","Poprad"],
  "Slovenia": ["Ljubljana","Maribor","Celje","Kranj","Koper","Velenje","Novo Mesto","Ptuj","Trbovlje","Kamnik"],
  "Spain": ["Madrid","Barcelona","Valencia","Seville","Zaragoza","Málaga","Murcia","Palma de Mallorca","Las Palmas","Bilbao","Alicante","Córdoba","Valladolid","Vigo","Gijón","Granada","A Coruña","Vitoria-Gasteiz","Santa Cruz de Tenerife","Pamplona"],
  "Sweden": ["Stockholm","Gothenburg","Malmö","Uppsala","Västerås","Örebro","Linköping","Helsingborg","Jönköping","Norrköping","Lund","Umeå","Gävle","Södertälje","Eskilstuna","Halmstad","Växjö","Karlstad","Sundsvall","Östersund"],
  "Switzerland": ["Zurich","Geneva","Basel","Bern","Lausanne","Winterthur","Lucerne","St. Gallen","Lugano","Biel/Bienne","Thun","Bellinzona","Fribourg","Schaffhausen","Chur","Neuchâtel","Urnach","Sion","Zug","Interlaken"],
  "Turkey": ["Istanbul","Ankara","Izmir","Bursa","Antalya","Adana","Konya","Gaziantep","Mersin","Diyarbakır","Kayseri","Eskişehir","Samsun","Denizli","Trabzon","Malatya","Erzurum","Manisa","Sivas","Batman"],
  "Ukraine": ["Kyiv","Kharkiv","Odesa","Dnipro","Donetsk","Zaporizhzhia","Lviv","Mykolaiv","Luhansk","Vinnytsia","Simferopol","Kherson","Poltava","Chernihiv","Cherkasy","Sumy","Zhytomyr","Khmelnytskyi","Rivne","Ivano-Frankivsk"],
  "United Kingdom": ["London","Birmingham","Manchester","Glasgow","Liverpool","Leeds","Edinburgh","Bristol","Sheffield","Coventry","Bradford","Cardiff","Belfast","Nottingham","Hull","Newcastle upon Tyne","Stoke-on-Trent","Southampton","Derby","Portsmouth"],
  "Vatican City (Holy See)": ["Vatican City"]
};

function updateStates() {
  const region = document.getElementById('region').value;
  const stateSelect = document.getElementById('state');
  const cityContainer = document.getElementById('cityContainer');
  stateSelect.innerHTML = '';

  if (!region || !regionStates[region]) {
    stateSelect.innerHTML = '<option value="" disabled selected>Select region first</option>';
    resetCityToInput();
    return;
  }

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.textContent = `Select ${region === 'america' ? 'State / Province' : 'Country'}`;
  stateSelect.appendChild(placeholder);

  regionStates[region].forEach(state => {
    const opt = document.createElement('option');
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });

  resetCityToInput();
}

function updateCities() {
  const region = document.getElementById('region').value;
  const state = document.getElementById('state').value;
  const cityContainer = document.getElementById('cityContainer');

  if (region === 'europe' && state && europeCities[state]) {
    let select = document.getElementById('citySelect');
    if (!select) {
      cityContainer.innerHTML = `
        <select id="citySelect" name="city" required>
          <option value="" disabled selected>Select city</option>
        </select>
      `;
      select = document.getElementById('citySelect');
    } else {
      select.innerHTML = '<option value="" disabled selected>Select city</option>';
    }

    europeCities[state].forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      select.appendChild(opt);
    });
  } else {
    resetCityToInput();
  }
}

function resetCityToInput() {
  const cityContainer = document.getElementById('cityContainer');
  const currentInput = cityContainer.querySelector('input');
  if (!currentInput) {
    cityContainer.innerHTML = '<input type="text" id="cityInput" name="city" placeholder="City" required />';
  }
}

function getCityValue() {
  const region = document.getElementById('region').value;
  if (region === 'europe') {
    const select = document.getElementById('citySelect');
    return select ? select.value : '';
  }
  const input = document.getElementById('cityInput');
  return input ? input.value.trim() : '';
}

// ========================================
// Scroll Animations
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.prize-card, .step-card, .section-header, .entry-card, .faq-list, .care-card'
  );

  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ========================================
// Smooth scroll for anchor links
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSlider();
  initCountdown();
  initStatCounters();
  initTestimonialCarousel();
  initFAQ();
  initForm();
  initScrollAnimations();
  initSmoothScroll();
});
