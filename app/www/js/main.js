$(document).ready(function(){

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
      "eff_reducing_neo_deaths": 0.2937
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
      "eff_reducing_neo_deaths": 0.33
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
      "eff_reducing_neo_deaths": 0.72
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
      "eff_reducing_neo_deaths": 0.03
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
      "eff_reducing_neo_deaths": 0.2929
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
      "eff_reducing_neo_deaths": 0.1
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
      "eff_reducing_mat_deaths": 0.46
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
      "eff_reducing_mat_deaths": 0.46
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
      "eff_reducing_neo_deaths": 0.015
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
      "eff_reducing_neo_deaths": 0.5
    }
  ];

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
  $.each(ints, function(k, d){
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
          <div id="coverage_${d.name}" class="shiny-my-slider"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="elig_pop_haircut_${d.name}">Eligible Population (%)</label>
          <div id="elig_pop_haircut_${d.name}" class="shiny-my-slider"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="eff_reducing_PE_${d.name}">Efficacy (reducing PE) (%)</label>
          <div id="eff_reducing_PE_${d.name}" class="shiny-my-slider"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="eff_reducing_mat_deaths_${d.name}">Efficacy (reducing maternal PE deaths) (%)</label>
          <div id="eff_reducing_mat_deaths_${d.name}" class="shiny-my-slider"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="eff_reducing_neo_deaths_${d.name}">Efficacy (reducing neonatal PE deaths) (%)</label>
          <div id="eff_reducing_neo_deaths_${d.name}" class="shiny-my-slider"></div>
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

  ints.forEach(function(d) {
    slider_vars.forEach(function(v) {
      var slider = document.getElementById(`${v}_${d.name}`);
       noUiSlider.create(slider, {
        start: d[v] * 100,
        step: 1,
        orientation: 'horizontal',
        range: {
          'min': 0,
          'max': 100
        },
        format: wNumb({
          decimals: 0
        }),
        pips: {
          mode: 'positions',
          values: [0,25,50,75,100],
          density: 4
        }
      });
      slider.noUiSlider.on('change', function() {
        var el = $(`#${v}_${d.name}`);
        el.data('value', slider.noUiSlider.get());
        el.trigger('change');
      });
    });
  });

  var slider = document.getElementById("specificity");
   noUiSlider.create(slider, {
    start: 75, // TODO: change
    step: 1,
    orientation: 'horizontal',
    range: {
      'min': 0,
      'max': 100
    },
    format: wNumb({
      decimals: 0
    }),
    pips: {
      mode: 'positions',
      values: [0,25,50,75,100],
      density: 4
    }
  });

  var slider = document.getElementById("sensitivity");
   noUiSlider.create(slider, {
    start: 75, // TODO: change
    step: 1,
    orientation: 'horizontal',
    range: {
      'min': 0,
      'max': 100
    },
    format: wNumb({
      decimals: 0
    }),
    pips: {
      mode: 'positions',
      values: [0,25,50,75,100],
      density: 4
    }
  });

  var throttled = false;

  // window.resize callback function
  function setDimensions() {
    $("#controls").height(window.innerHeight);
    $("#output").height(window.innerHeight);
    $("#output").width(window.innerWidth - 450);
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

