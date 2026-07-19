// ========================================
// CMS Data Management Module
// ========================================

var CMS = (function() {
  var KEYS = {
    winners: 'ig_cms_winners',
    content: 'ig_cms_content',
    submissions: 'giveawaySubmissions'
  };

  var defaultWinners = [
    { name: "Austin Christian", state: "Texas", sn: "IG – 001" },
    { name: "James Peterson", state: "Ohio", sn: "IG – 002" },
    { name: "Teena Maxey", state: "Illinois", sn: "IG – 003" },
    { name: "Mark Douglas Miller", state: "Minnesota", sn: "IG – 004" },
    { name: "Lawrence", state: "Texas", sn: "IG – 005" },
    { name: "Mitchell", state: "South Dakota", sn: "IG – 006" },
    { name: "James Brown", state: "New York", sn: "IG – 007" },
    { name: "Tuulikki Slatvik", state: "Finland", sn: "IG – 008" },
    { name: "Caroline Thomas", state: "New Jersey", sn: "IG – 009" },
    { name: "Kimijo Smith", state: "Lexington", sn: "IG – 010" },
    { name: "Rose Murphy", state: "Canada", sn: "IG – 011" },
    { name: "John Carter", state: "Florida", sn: "IG – 012" },
    { name: "Matter Joseph", state: "South Carolina", sn: "IG – 013" },
    { name: "Crystal Kennedy Bradley", state: "West Virginia", sn: "IG – 014" },
    { name: "Josephine Jackson", state: "Ohio", sn: "IG – 015" },
    { name: "Anna Silva", state: "Texas", sn: "IG – 016" },
    { name: "Jere E Farmer", state: "Tennessee", sn: "IG – 017" },
    { name: "Austin Williams", state: "Florida", sn: "IG – 018" },
    { name: "Mandy Podvorec", state: "Pennsylvania", sn: "IG – 019" },
    { name: "Cathy M Finley", state: "Huntersville NC", sn: "IG – 020" },
    { name: "Liliana James", state: "California", sn: "IG – 021" },
    { name: "Kevin Manning", state: "Massachusetts", sn: "IG – 022" },
    { name: "Tina Williams", state: "Florida", sn: "IG – 023" },
    { name: "Donna Jones", state: "Pennsylvania", sn: "IG – 024" },
    { name: "Moses James", state: "South Carolina", sn: "IG – 025" },
    { name: "Jean Perry", state: "Illinois", sn: "IG – 026" },
    { name: "Sarah Maxwell", state: "Florida", sn: "IG – 027" },
    { name: "Evans Sanchez", state: "New York", sn: "IG – 028" },
    { name: "Richard IV Taylor", state: "Lawrenceville Georgia", sn: "IG – 029" },
    { name: "Anita Blake", state: "Colorado", sn: "IG – 030" },
    { name: "Thelma Jackson", state: "Georgia", sn: "IG – 031" },
    { name: "Austin Anderson", state: "Mississippi", sn: "IG – 032" },
    { name: "Mary Magdalene", state: "Oklahoma", sn: "IG – 033" },
    { name: "Williams Maxwell", state: "Florida", sn: "IG – 034" },
    { name: "Patricia Torres", state: "Oklahoma", sn: "IG – 035" },
    { name: "Annie Hannah", state: "Beverly Hill", sn: "IG – 036" },
    { name: "Terry Lackey", state: "Illinois", sn: "IG – 037" },
    { name: "Kathy Nadine", state: "South Dakota", sn: "IG – 038" },
    { name: "Sherry Montoya", state: "San Francisco", sn: "IG – 039" },
    { name: "Franklin Donald", state: "Mississippi", sn: "IG – 040" },
    { name: "Florence Michael", state: "New York", sn: "IG – 041" },
    { name: "Michelle Wade", state: "Mississippi", sn: "IG – 042" },
    { name: "Dubois Yves", state: "Toulouse", sn: "IG – 043" },
    { name: "Redford Alex", state: "Texas", sn: "IG – 044" },
    { name: "Evans John", state: "Germany", sn: "IG – 045" },
    { name: "Vladimír Salay", state: "Slovakia", sn: "IG – 046" },
    { name: "Sarah Rose", state: "New Jersey", sn: "IG – 047" },
    { name: "Tony Devine", state: "Italy", sn: "IG – 048" },
    { name: "Rosana Mariel Rodrigo", state: "Sant Fe, Argentina", sn: "IG – 049" },
    { name: "Evans Jefferson", state: "UK", sn: "IG – 050" },
    { name: "Charles E Floyd", state: "Tulsa Oklahoma", sn: "IG – 051" },
    { name: "Mary Joseph", state: "Texas", sn: "IG – 052" },
    { name: "Matter", state: "Texas", sn: "IG – 053" },
    { name: "Patrick Johnson", state: "San Antonio", sn: "IG – 054" },
    { name: "Rachel Coleman", state: "Arizona", sn: "IG – 055" },
    { name: "Fedrick Williams", state: "Florida", sn: "IG – 056" },
    { name: "David Maxwell", state: "Beverly Hills", sn: "IG – 057" },
    { name: "Andrew", state: "Georgia", sn: "IG – 058" },
    { name: "Barbra", state: "Beverly Hills", sn: "IG – 059" },
    { name: "Jane DeMay", state: "Beverly Hills", sn: "IG – 060" },
    { name: "Wendy Ann", state: "San Diego", sn: "IG – 061" },
    { name: "Janet", state: "Texas", sn: "IG – 062" },
    { name: "Melissa Rondinone", state: "Chicago", sn: "IG – 063" },
    { name: "Joan M Armet", state: "Oklahoma", sn: "IG – 064" },
    { name: "Amy Pollock", state: "New Jersey", sn: "IG – 065" },
    { name: "Linda Martin", state: "New York", sn: "IG – 066" },
    { name: "Sandi K Pann", state: "Florida", sn: "IG – 067" },
    { name: "Megan Shepherd", state: "Texas", sn: "IG – 068" },
    { name: "Laura Fell", state: "Oklahoma", sn: "IG – 069" },
    { name: "Cathy Dunn", state: "Florida", sn: "IG – 070" }
  ];

  var defaultContent = {
    prizeAmount: "320,000.00",
    stats: { entries: 15420, winners: 50, categories: 5 },
    prizes: [
      { name: "iPhone 16 Pro Max", desc: "Latest Apple flagship phone with 256GB storage", qty: "1 Winner", icon: "prize-iphone.svg", badge: "Grand Prize", isGrand: true },
      { name: "AirPods Pro 2", desc: "Active noise cancellation with spatial audio", qty: "3 Winners", icon: "prize-airpods.svg", badge: "", isGrand: false },
      { name: "Apple Watch SE", desc: "Stay connected and track your fitness", qty: "5 Winners", icon: "prize-watch.svg", badge: "", isGrand: false },
      { name: "$100 Gift Card", desc: "Redeemable at your favorite online stores", qty: "10 Winners", icon: "prize-giftcard.svg", badge: "", isGrand: false },
      { name: "Merch Bundle", desc: "Exclusive branded merchandise pack", qty: "31 Winners", icon: "prize-merch.svg", badge: "", isGrand: false }
    ],
    testimonials: [
      {
        name: "Geraldine Emily", date: "June 12, 2026", image: "Winner 1.png", amount: "$320,000.00",
        highlight: "I had to double-check: 'How many zeros are there?'",
        paragraphs: [
          "A woman says she's on \"cloud nine\" after winning a $320,000 prize through our Instagram Online Giveaway that prompted her to move up her retirement plans by months.",
          "\"December 25 was supposed to be my last day to work, but as soon as I realized I had this kind of money, I figured I can do it now,\" Geraldine said. \"I went in and said goodbye to everybody and turned my computer in.\""
        ],
        expanded: [
          "Once the reality set in, Geraldine was so happy when she got a message from our online agent about how she can claim her wins. But any hope of a restful night quickly disappeared.",
          "\"I was up all night,\" she said. \"I couldn't sleep. I didn't let anybody know until the next day. I was pacing up and down, trying to figure out what I should do next.\"",
          "Geraldine, who worked for a computer services company for 26 years, said the chance to help her family is even more meaningful than the win itself. A mother of two and grandmother of five, she plans to share the winnings with her family.",
          "\"Thanks Instagram, this is so amazing!!\""
        ],
        tags: ["#WinnerStory", "#InstagramGiveaway", "#LifeChanging"]
      },
      {
        name: "Mark Newmarket", date: "May 30, 2026", image: "Winner 2.png", amount: "$320,000.00",
        highlight: "I stared at my phone for five minutes — I couldn't believe what I was seeing.",
        paragraphs: [
          "Mark Newmarket, a carpenter from Newmarket, won $320,000 through the Instagram Online Giveaway. He entered on a Saturday morning while having his coffee and completely forgot about it.",
          "\"I was scrolling through my messages and saw the notification. I thought it was spam at first,\" Mark laughed. \"Then I clicked on it and read it three times. My coffee got cold because I just sat there frozen.\""
        ],
        expanded: [
          "Mark has been working as a carpenter for over 20 years, building furniture and cabinets. He always dreamed of opening his own workshop but could never afford the startup costs.",
          "\"I called my wife and told her to sit down. She didn't believe me until I showed her the email. Then she started screaming so loud the neighbors came over to check on us,\" he shared with a big smile.",
          "Mark plans to finally open his own custom woodworking shop and has already started looking at commercial spaces. He also wants to put money aside for his two children's college funds.",
          "\"After all these years of hard work, this feels like a miracle. Thank you Instagram!\""
        ],
        tags: ["#DreamBuilder", "#GiveawayReal", "#NewChapter"]
      },
      {
        name: "Daljit Brampton", date: "October 4, 2022", image: "Winner 3.png", amount: "$320,000.00",
        highlight: "My wife thought I was joking — I had to show her the screen three times!",
        paragraphs: [
          "Daljit Brampton, a truck driver from Brampton, won $320,000 through the Instagram Online Giveaway. He entered during a rest stop on a long haul and didn't think much of it after.",
          "\"I was parked at a truck stop in Ohio when I got the message. I read it and my heart started racing,\" Daljit recalled. \"I called my wife right away and she said 'Daljit, stop fooling around.' I had to FaceTime her just to prove it.\""
        ],
        expanded: [
          "Daljit has been driving trucks for 15 years, spending long weeks on the road away from his family. He always dreamed of bringing his parents from India to Canada but could never afford it.",
          "\"I Facetimed my parents back home. When I told them, my mother put her hands together and started praying. My father had tears in his eyes. It was the most beautiful moment of my life,\" he shared.",
          "The family is now planning a trip to India to bring his parents over, and Daljit has already started building a new home with a dedicated room for them.",
          "\"God answers prayers in ways you never expect. This is a blessing beyond words.\""
        ],
        tags: ["#FamilyReunion", "#Blessed", "#DreamComeTrue"]
      },
      {
        name: "Rose Murphy", date: "March 3, 2026", image: "Winner 4.png", amount: "$320,000.00",
        highlight: "My daughter grabbed my phone and screamed — we'd won $320,000!",
        paragraphs: [
          "Rose Murphy, a nurse from Canada, entered the giveaway while on her night shift break. She'd been following the page for weeks and finally decided to fill out the form.",
          "\"I was so tired that night. I almost didn't enter. Something just told me to do it,\" Rose said. \"Three days later, my daughter saw the winning notification before I did.\""
        ],
        expanded: [
          "Rose has worked 12-hour shifts at the hospital for over a decade. The money will help her open the small bakery she's always dreamed of — a dream she put on hold when she became a single mother.",
          "\"I used to bake cakes for my daughter's school events and everyone always said they were the best. Now I can finally make it a business,\" she said with tears in her eyes.",
          "Rose also plans to put money aside for her daughter's university education. \"She wants to study medicine like me, but I want her to do it without the debt I had.\"",
          "\"From one mom to another — never give up on your dreams.\""
        ],
        tags: ["#NurseWins", "#DreamBig", "#SingleMom"]
      }
    ],
    faq: [
      { q: "When will the winners be announced?", a: "Winners will be announced on our Instagram page within 48 hours after the giveaway ends. Make sure you have notifications turned on so you don't miss it!" },
      { q: "Can I enter multiple times?", a: "Each person can submit one entry through the form. However, you can earn bonus entries by tagging friends and sharing the post to your story!" },
      { q: "Who is eligible to participate?", a: "The giveaway is open to all Instagram users aged 18 and above. Participants must have a public Instagram account to be eligible for prize fulfillment." },
      { q: "How are winners selected?", a: "Winners are selected randomly using a verified random selection tool to ensure fairness and transparency. All entries have an equal chance of winning." },
      { q: "When will I receive my prize?", a: "Prizes will be delivered within 14 business days after the winner has been verified and contact details have been confirmed via DM." }
    ],
    customerCare: {
      phone: "+1 (719) 466-6623",
      email: "admin@instagiveaway.com"
    }
  };

  function getWinners() {
    try {
      var data = localStorage.getItem(KEYS.winners);
      if (data) return JSON.parse(data);
    } catch(e) {}
    return defaultWinners.slice();
  }

  function saveWinners(winners) {
    localStorage.setItem(KEYS.winners, JSON.stringify(winners));
  }

  function getContent() {
    try {
      var data = localStorage.getItem(KEYS.content);
      if (data) {
        var parsed = JSON.parse(data);
        return Object.assign({}, defaultContent, parsed);
      }
    } catch(e) {}
    return JSON.parse(JSON.stringify(defaultContent));
  }

  function saveContent(content) {
    localStorage.setItem(KEYS.content, JSON.stringify(content));
  }

  function getSubmissions() {
    try {
      var data = localStorage.getItem(KEYS.submissions);
      if (data) return JSON.parse(data);
    } catch(e) {}
    return [];
  }

  function getNextWinnersSN(winners) {
    var maxNum = 0;
    winners.forEach(function(w) {
      var match = w.sn.match(/(\d+)$/);
      if (match) {
        var num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    var next = maxNum + 1;
    return 'IG – ' + String(next).padStart(3, '0');
  }

  function exportJSON(data, filename) {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(callback) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        try {
          var data = JSON.parse(ev.target.result);
          callback(null, data);
        } catch(err) {
          callback(err);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  return {
    KEYS: KEYS,
    defaultWinners: defaultWinners,
    defaultContent: defaultContent,
    getWinners: getWinners,
    saveWinners: saveWinners,
    getContent: getContent,
    saveContent: saveContent,
    getSubmissions: getSubmissions,
    getNextWinnersSN: getNextWinnersSN,
    exportJSON: exportJSON,
    importJSON: importJSON
  };
})();
