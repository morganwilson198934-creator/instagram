// ========================================
// CMS Data Management Module
// ========================================

var CMS = (function() {
  var API_BASE = window.location.origin;

  var KEYS = {
    winners: 'ig_cms_winners',
    content: 'ig_cms_content',
    submissions: 'giveawaySubmissions'
  };

  // ===== API helpers =====
  function apiGet(path) {
    return fetch(API_BASE + path).then(function(r) {
      if (!r.ok) throw new Error('API error');
      return r.json();
    });
  }

  function apiPost(path, data) {
    return fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function(r) {
      if (!r.ok) throw new Error('API error');
      return r.json();
    });
  }

  function apiPut(path, data) {
    return fetch(API_BASE + path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function(r) {
      if (!r.ok) throw new Error('API error');
      return r.json();
    });
  }

  function apiDelete(path) {
    return fetch(API_BASE + path, { method: 'DELETE' }).then(function(r) {
      if (!r.ok) throw new Error('API error');
      return r.json();
    });
  }

  // ===== Synchronous getters (for backward compat, reads cache) =====
  var _cache = { winners: null, content: null, submissions: null };

  function getWinners() {
    return _cache.winners || [];
  }

  function saveWinners(winners) {
    _cache.winners = winners;
    return apiPost('/api/winners', winners);
  }

  function loadWinners() {
    return apiGet('/api/winners').then(function(data) {
      _cache.winners = data;
      return data;
    }).catch(function() {
      _cache.winners = [];
      return [];
    });
  }

  function getContent() {
    return _cache.content || {};
  }

  function saveContent(content) {
    _cache.content = content;
    return apiPost('/api/content', content);
  }

  function loadContent() {
    return apiGet('/api/content').then(function(data) {
      _cache.content = data;
      return data;
    }).catch(function() {
      return {};
    });
  }

  function getSubmissions() {
    return _cache.submissions || [];
  }

  function saveSubmissions(submissions) {
    _cache.submissions = submissions;
  }

  function loadSubmissions() {
    return apiGet('/api/submissions').then(function(data) {
      _cache.submissions = data;
      return data;
    }).catch(function() {
      _cache.submissions = [];
      return [];
    });
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
    getWinners: getWinners,
    saveWinners: saveWinners,
    loadWinners: loadWinners,
    getContent: getContent,
    saveContent: saveContent,
    loadContent: loadContent,
    getSubmissions: getSubmissions,
    saveSubmissions: saveSubmissions,
    loadSubmissions: loadSubmissions,
    getNextWinnersSN: getNextWinnersSN,
    exportJSON: exportJSON,
    importJSON: importJSON
  };
})();
