$(document).ready(function() {

  var int0 = {
    "int": "Antenatal monitoring + diff CFL",
    "name": "int_am_diff_cfl",
    "on_off": true
  }

  var ints = [
    {
      "int": "Antenatal monitoring + early C-section",
      "name": "int_am_csect",
      "on_off": true,
      "applied_to": "All risk stratified",
      "location_of_care": "FRU only",
      "coverage": 1,
      "elig_pop_haircut": 1,
      "eff_reducing_PE": 0,
      "eff_reducing_mat_deaths": 0.2937,
      "eff_reducing_neo_deaths": 0.2937,
      "entry": 1
    },
    {
      "int": "Calcium",
      "name": "int_calcium",
      "on_off": true,
      "applied_to": "All risk stratified",
      "location_of_care": "FRU, PHC, and Home",
      "coverage": 0.5,
      "elig_pop_haircut": 0.6661,
      "eff_reducing_PE": 0.33,
      "eff_reducing_mat_deaths": 0.33,
      "eff_reducing_neo_deaths": 0.33,
      "entry": 2
    },
    {
      "int": "Selenium for PE",
      "name": "int_selenium",
      "on_off": false,
      "applied_to": "All risk stratified",
      "location_of_care": "FRU, PHC, and Home",
      "coverage": 0.5,
      "elig_pop_haircut": 0.6661,
      "eff_reducing_PE": 0.72,
      "eff_reducing_mat_deaths": 0.72,
      "eff_reducing_neo_deaths": 0.72,
      "entry": 3
    },
    {
      "int": "Statins",
      "name": "int_statins",
      "on_off": true,
      "applied_to": "Risk stratified & flagged high risk",
      "location_of_care": "FRU, PHC, and Home",
      "coverage": 0.5,
      "elig_pop_haircut": 0.4944,
      "eff_reducing_PE": 0.03,
      "eff_reducing_mat_deaths": 0.03,
      "eff_reducing_neo_deaths": 0.03,
      "entry": 4
    },
    {
      "int": "Aspirin",
      "name": "int_aspirin",
      "on_off": true,
      "applied_to": "All risk stratified",
      "location_of_care": "FRU, PHC, and Home",
      "coverage": 0.5,
      "elig_pop_haircut": 0.4944,
      "eff_reducing_PE": 0.2929,
      "eff_reducing_mat_deaths": 0.2929,
      "eff_reducing_neo_deaths": 0.2929,
      "entry": 5
    },
    {
      "int": "Antihypertensives",
      "name": "int_antihyper",
      "on_off": true,
      "applied_to": "Hypertensive (and risk stratified)",
      "location_of_care": "FRU and PHC",
      "coverage": 0.5,
      "elig_pop_haircut": 1,
      "eff_reducing_PE": 0,
      "eff_reducing_mat_deaths": 0.1,
      "eff_reducing_neo_deaths": 0.1,
      "entry": 6
    },
    {
      "int": "Incremental magnesium roll-out - FRU",
      "name": "int_mag_fru",
      "on_off": true,
      "applied_to": "Actually high risk (presume can discern)",
      "location_of_care": "FRU only",
      "coverage": 0.5,
      "elig_pop_haircut": 0.64,
      "eff_reducing_PE": 0,
      "eff_reducing_mat_deaths": 0.46,
      "entry": 7
    },
    {
      "int": "Incremental magnesium roll-out - PHC",
      "name": "int_mag_phc",
      "on_off": true,
      "applied_to": "Actually high risk (presume can discern)",
      "location_of_care": "PHC only",
      "coverage": 0.5,
      "elig_pop_haircut": 1,
      "eff_reducing_PE": 0,
      "eff_reducing_mat_deaths": 0.46,
      "entry": 8
    },
    {
      "int": "Intrapartum antihypertensives",
      "name": "int_intantihyper",
      "on_off": true,
      "applied_to": "Actually high risk (presume can discern)",
      "location_of_care": "FRU only",
      "coverage": 0.5,
      "elig_pop_haircut": 1,
      "eff_reducing_PE": 0,
      "eff_reducing_mat_deaths": 0.015,
      "eff_reducing_neo_deaths": 0.015,
      "entry": 9
    },
    {
      "int": "Novel drug",
      "name": "int_drug",
      "on_off": true,
      "applied_to": "All",
      "location_of_care": "FRU, PHC, and Home",
      "coverage": 0.5,
      "elig_pop_haircut": 1,
      "eff_reducing_PE": 0.5,
      "eff_reducing_mat_deaths": 0.5,
      "eff_reducing_neo_deaths": 0.5,
      "entry": 10
    }
  ];

  var pops = {
    "pop": 25642000,
    "pe_rate": 0.110204196,
    "mort_rate_mat": 0.000898843,
    "mort_rate_neo": 0.008988427,
    "anc_visits1": 0.742,
    "anc_visits4": 0.45,
    "sensitivity": 0.75,
    "specificity": 0.75,
    "riskstrat_firstweek": 4,
    "riskstrat_lastweek": 42,
    "cfr_fru_maternal": 0.000488501,
    "cfr_phc_maternal": 0.000977003,
    "cfr_fru_neonatal": 0.004885015,
    "cfr_phc_neonatal": 0.009770029,
    "sys_fru_pct": 0.16,
    "sys_phc_pct": 0.63,
    "sys_home_pct": 0.21,
    "leak_fru_phc": 0.1,
    "leak_phc_home": 0.1,
    "pop_ghtn_pct": 0.125,
    "hr_act_w_ghtn_pct": 0.8,
    "flagintime_pct": 0.95
  }

  var appl_vals = [
    "Hypertensive (and risk stratified)",
    "Hypertensive only",
    "Risk stratified & flagged high risk",
    "All risk stratified",
    "Actually high risk (presume can discern)",
    "All"
  ];

  var loc_vals = [
    "FRU only",
    "PHC only",
    "Home only",
    "FRU and PHC",
    "FRU, PHC, and Home"
  ];

  var html = '';
  $.each(ints, function(k, d) {
    html += `
    <li>
      <div class="collapsible-header mutedfocus">
        <div class="active-indicator">
          <div
            class="active-indicator-child ${d.on_off ? 'on' : ''}"
            id="indicator-${d.name}"
          >
          </div>
        </div>
        <span class="settings-icon icon-aid-kit"></span>
        <strong>${d.int}</strong>
        <div class="int-color-box entry-${d.entry}"></div>
      </div>
      <div class="collapsible-body">
        <div class="switch-wrapper">
          <div class="switch">
            <label>
              Off
              <input ${d.on_off ? 'checked' : ''}
                type="checkbox"
                class="int_check shiny-material-switch"
                id="on_off_${d.name}"
                data-int="${d.name}"
              >
              <span class="lever"></span>
              On
            </label>
          </div>
        </div>
        <div class="input-field">
          <select id="applied_to_${d.name}" class="shiny-material-dropdown">
            <option value="${appl_vals[0]}" ${d.applied_to === appl_vals[0] ? 'selected' : ''}>${appl_vals[0]}</option>
            <option value="${appl_vals[1]}" ${d.applied_to === appl_vals[1] ? 'selected' : ''}>${appl_vals[1]}</option>
            <option value="${appl_vals[2]}" ${d.applied_to === appl_vals[2] ? 'selected' : ''}>${appl_vals[2]}</option>
            <option value="${appl_vals[3]}" ${d.applied_to === appl_vals[3] ? 'selected' : ''}>${appl_vals[3]}</option>
            <option value="${appl_vals[4]}" ${d.applied_to === appl_vals[4] ? 'selected' : ''}>${appl_vals[4]}</option>
            <option value="${appl_vals[5]}" ${d.applied_to === appl_vals[5] ? 'selected' : ''}>${appl_vals[5]}</option>
          </select>
          <label>Applied to...</label>
        </div>
        <div class="input-field">
          <select id="location_of_care_${d.name}" class="shiny-material-dropdown">
            <option value="${loc_vals[0]}" ${d.location_of_care === loc_vals[0] ? 'selected' : ''}>${loc_vals[0]}</option>
            <option value="${loc_vals[1]}" ${d.location_of_care === loc_vals[1] ? 'selected' : ''}>${loc_vals[1]}</option>
            <option value="${loc_vals[2]}" ${d.location_of_care === loc_vals[2] ? 'selected' : ''}>${loc_vals[2]}</option>
            <option value="${loc_vals[3]}" ${d.location_of_care === loc_vals[3] ? 'selected' : ''}>${loc_vals[3]}</option>
            <option value="${loc_vals[4]}" ${d.location_of_care === loc_vals[4] ? 'selected' : ''}>${loc_vals[4]}</option>
          </select>
          <label>Location of care</label>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="coverage_${d.name}">Coverage (%)</label>
          <div id="coverage_${d.name}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="elig_pop_haircut_${d.name}">Eligible Population (%)</label>
          <div id="elig_pop_haircut_${d.name}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="eff_reducing_PE_${d.name}">Efficacy (reducing PE) (%)</label>
          <div id="eff_reducing_PE_${d.name}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="eff_reducing_mat_deaths_${d.name}">Efficacy (reducing maternal PE deaths) (%)</label>
          <div id="eff_reducing_mat_deaths_${d.name}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="eff_reducing_neo_deaths_${d.name}">Efficacy (reducing neonatal PE deaths) (%)</label>
          <div id="eff_reducing_neo_deaths_${d.name}" class="shiny-my-slider" data-denom="100"></div>
        </div>
      </div>
    </li>
    `
  });
  $("#inputs").append(html);

  $('.int_check').change(function() {
    var el = $(this);
    if (el.is(':checked')) {
      $('#indicator-' + el.data('int')).addClass('on');
    } else {
      $('#indicator-' + el.data('int')).removeClass('on');
    }
  });

  $('.collapsible').collapsible();
  $('select').formSelect();

  var slider_vars = [
    "coverage",
    "elig_pop_haircut",
    "eff_reducing_PE",
    "eff_reducing_mat_deaths",
    "eff_reducing_neo_deaths"
  ];

  var pips = {
    mode: 'positions',
    values: [0,25,50,75,100],
    density: 4
  };

  var format = wNumb({
    decimals: 0
  });

  ints.forEach(function(d) {
    slider_vars.forEach(function(v) {
      var slider = document.getElementById(`${v}_${d.name}`);
       noUiSlider.create(slider, {
        start: d[v] * 100,
        step: 1,
        orientation: 'horizontal',
        range: { 'min': 0, 'max': 100 },
        format: format,
        pips: pips
      });
      slider.noUiSlider.on('change', function() {
        var el = $(`#${v}_${d.name}`);
        el.data('value', slider.noUiSlider.get());
        el.trigger('change');
      });
    });
  });

  $("#pop").val(pops.pop);

  $("#pop").on("change", function(d) {
    // TODO: validate positive number
  })

  var sliders = {};

  sliders['pe_rate'] = document.getElementById("pe_rate");
  noUiSlider.create(sliders['pe_rate'], {
    start: pops.pe_rate * 100,
    step: 0.1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 20 },
    format: format,
    pips: pips
  });

  sliders['mort_rate_mat'] = document.getElementById("mort_rate_mat");
  noUiSlider.create(sliders['mort_rate_mat'], {
    start: pops.mort_rate_mat * 100000,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 1000 },
    format: format,
    pips: pips
  });

  sliders['mort_rate_neo'] = document.getElementById("mort_rate_neo");
  noUiSlider.create(sliders['mort_rate_neo'], {
    start: pops.mort_rate_neo * 1000,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['cfr_fru_maternal'] = document.getElementById("cfr_fru_maternal");
  noUiSlider.create(sliders['cfr_fru_maternal'], {
    start: pops.cfr_fru_maternal * 100000,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 400 },
    format: format,
    pips: pips
  });

  sliders['cfr_phc_maternal'] = document.getElementById("cfr_phc_maternal");
  noUiSlider.create(sliders['cfr_phc_maternal'], {
    start: pops.cfr_phc_maternal * 100000,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 400 },
    format: format,
    pips: pips
  });

  sliders['cfr_fru_neonatal'] = document.getElementById("cfr_fru_neonatal");
  noUiSlider.create(sliders['cfr_fru_neonatal'], {
    start: pops.cfr_fru_neonatal * 1000,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 40 },
    format: format,
    pips: pips
  });

  sliders['cfr_phc_neonatal'] = document.getElementById("cfr_phc_neonatal");
  noUiSlider.create(sliders['cfr_phc_neonatal'], {
    start: pops.cfr_phc_neonatal * 1000,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 40 },
    format: format,
    pips: pips
  });

  sliders['sys_fru_pct'] = document.getElementById("sys_fru_pct");
  noUiSlider.create(sliders['sys_fru_pct'], {
    start: pops.sys_fru_pct * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['sys_phc_pct'] = document.getElementById("sys_phc_pct");
  noUiSlider.create(sliders['sys_phc_pct'], {
    start: pops.sys_phc_pct * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['sys_home_pct'] = document.getElementById("sys_home_pct");
  noUiSlider.create(sliders['sys_home_pct'], {
    start: pops.sys_home_pct * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['leak_fru_phc'] = document.getElementById("leak_fru_phc");
   noUiSlider.create(sliders['leak_fru_phc'], {
    start: pops.leak_fru_phc * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['leak_phc_home'] = document.getElementById("leak_phc_home");
  noUiSlider.create(sliders['leak_phc_home'], {
    start: pops.leak_phc_home * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['specificity'] = document.getElementById("specificity");
  noUiSlider.create(sliders['specificity'], {
    start: pops.specificity * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['sensitivity'] = document.getElementById("sensitivity");
  noUiSlider.create(sliders['sensitivity'], {
    start: pops.sensitivity * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  // TODO: don't allow firstweek to be greater than lastweek
  sliders['riskstrat_firstweek'] = document.getElementById("riskstrat_firstweek");
  noUiSlider.create(sliders['riskstrat_firstweek'], {
    start: pops.riskstrat_firstweek,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 42 },
    format: format,
    pips: pips
  });

  sliders['riskstrat_lastweek'] = document.getElementById("riskstrat_lastweek");
  noUiSlider.create(sliders['riskstrat_lastweek'], {
    start: pops.riskstrat_lastweek,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 42 },
    format: format,
    pips: pips
  });

  // TODO: don't allow anc_visits4 to be greater than anc_visits1
  sliders['anc_visits1'] = document.getElementById("anc_visits1");
  noUiSlider.create(sliders['anc_visits1'], {
    start: pops.anc_visits1 * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['anc_visits4'] = document.getElementById("anc_visits4");
  noUiSlider.create(sliders['anc_visits4'], {
    start: pops.anc_visits4 * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['pop_ghtn_pct'] = document.getElementById("pop_ghtn_pct");
  noUiSlider.create(sliders['pop_ghtn_pct'], {
    start: pops.pop_ghtn_pct * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['hr_act_w_ghtn_pct'] = document.getElementById("hr_act_w_ghtn_pct");
  noUiSlider.create(sliders['hr_act_w_ghtn_pct'], {
    start: pops.hr_act_w_ghtn_pct * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  sliders['flagintime_pct'] = document.getElementById("flagintime_pct");
  noUiSlider.create(sliders['flagintime_pct'], {
    start: pops.flagintime_pct * 100,
    step: 1,
    orientation: 'horizontal',
    range: { 'min': 0, 'max': 100 },
    format: format,
    pips: pips
  });

  Object.keys(sliders).forEach(function(k) {
    sliders[k].noUiSlider.on('change', function() {
      var el = $(`#${k}`);
      el.data('value', sliders[k].noUiSlider.get());
      el.trigger('change');
    });
  });

  // initialize the one different intervention (int_am)
  if (int0.on_off === true) {
    $("#indicator-int_am_diff_cfl").addClass("on");
    $("#on_off_int_am_diff_cfl").attr("checked", true);
  }

  var throttled = false;

  // window.resize callback function
  function setDimensions() {
    $("#controls").height(window.innerHeight - 83);
    $("#outputs").height(window.innerHeight - 105);
    $("#subheader").width(window.innerWidth);
    // $("#outputs").width(window.innerWidth - 450);
  }

  // window.resize event listener
  window.addEventListener('resize', function() {
      // only run if we're not throttled
    if (!throttled) {
      // actual callback action
      setDimensions();
      // we're throttled!
      throttled = true;
      // set a timeout to un-throttle
      setTimeout(function() {
        throttled = false;
      }, 250);
    }
  });

  setDimensions();

  $('.modal').modal();
  // $('.tooltipped').tooltip();
  tippy(".tippy", {
    delay: 10,
    arrow: true,
    arrowType: 'round',
    size: 'large',
    duration: 200,
    animation: 'scale',
    dynamicTitle: true
  });
});

// countup
// var options = {
//   useEasing: true,
//   useGrouping: true,
//   separator: ',',
//   decimal: '.',
// };
// var demo = new CountUp('myTargetElement', 0, 4539, 0, 0.5, options);
// if (!demo.error) {
//   demo.start();
// } else {
//   console.error(demo.error);
// }

