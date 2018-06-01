$(document).ready(function() {

  // var int0 = {
  //   "int": "Antenatal monitoring + diff CFL",
  //   "name": "int_am_diff_cfl",
  //   "on_off": true
  // }

  var scenarios = [
    {
      "name": "India Baseline",
      "ints_fe": [
        {
          "int": "Antenatal monitoring + early C-section",
          "name": "int_am_csect",
          "on_off": true,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU only",
          "coverage": 1,
          "elig_pop_haircut": 1,
          "eff_reducing_PE": 0,
          "eff_reducing_mat_deaths": 0.29374,
          "eff_reducing_neo_deaths": 0.29374,
          "entry": 1
        },
        {
          "int": "Calcium",
          "name": "int_calcium",
          "on_off": true,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.666134086,
          "eff_reducing_PE": 0.33,
          "eff_reducing_mat_deaths": 0.33,
          "eff_reducing_neo_deaths": 0.33,
          "entry": 2
        },
        {
          "int": "Aspirin",
          "name": "int_aspirin",
          "on_off": true,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.49436655,
          "eff_reducing_PE": 0.292922754,
          "eff_reducing_mat_deaths": 0.292922754,
          "eff_reducing_neo_deaths": 0.292922754,
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
        }
      ],
      "ints_fu": [
        {
          "int": "Selenium for PE",
          "name": "int_selenium",
          "on_off": false,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.666134086,
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
          "elig_pop_haircut": 0.49436655,
          "eff_reducing_PE": 0.03,
          "eff_reducing_mat_deaths": 0.03,
          "eff_reducing_neo_deaths": 0.03,
          "entry": 4
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
      ],
      "pops": {
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
    },
    {
      "name": "India Feasible Only",
      "ints_fe": [
        {
          "int": "Antenatal monitoring + early C-section",
          "name": "int_am_csect",
          "on_off": true,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU only",
          "coverage": 1,
          "elig_pop_haircut": 1,
          "eff_reducing_PE": 0,
          "eff_reducing_mat_deaths": 0.29374,
          "eff_reducing_neo_deaths": 0.29374,
          "entry": 1
        },
        {
          "int": "Calcium",
          "name": "int_calcium",
          "on_off": true,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.666134086,
          "eff_reducing_PE": 0.33,
          "eff_reducing_mat_deaths": 0.33,
          "eff_reducing_neo_deaths": 0.33,
          "entry": 2
        },
        {
          "int": "Aspirin",
          "name": "int_aspirin",
          "on_off": true,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.49436655,
          "eff_reducing_PE": 0.292922754,
          "eff_reducing_mat_deaths": 0.292922754,
          "eff_reducing_neo_deaths": 0.292922754,
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
        }
      ],
      "ints_fu": [
        {
          "int": "Selenium for PE",
          "name": "int_selenium",
          "on_off": false,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.666134086,
          "eff_reducing_PE": 0.72,
          "eff_reducing_mat_deaths": 0.72,
          "eff_reducing_neo_deaths": 0.72,
          "entry": 3
        },
        {
          "int": "Statins",
          "name": "int_statins",
          "on_off": false,
          "applied_to": "Risk stratified & flagged high risk",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.49436655,
          "eff_reducing_PE": 0.03,
          "eff_reducing_mat_deaths": 0.03,
          "eff_reducing_neo_deaths": 0.03,
          "entry": 4
        },
        {
          "int": "Incremental magnesium roll-out - FRU",
          "name": "int_mag_fru",
          "on_off": false,
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
          "on_off": false,
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
          "on_off": false,
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
          "on_off": false,
          "applied_to": "All",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 1,
          "eff_reducing_PE": 0.5,
          "eff_reducing_mat_deaths": 0.5,
          "eff_reducing_neo_deaths": 0.5,
          "entry": 10
        }
      ],
      "pops": {
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
    },
    {
      "name": "India No Interventions",
      "ints_fe": [
        {
          "int": "Antenatal monitoring + early C-section",
          "name": "int_am_csect",
          "on_off": false,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU only",
          "coverage": 1,
          "elig_pop_haircut": 1,
          "eff_reducing_PE": 0,
          "eff_reducing_mat_deaths": 0.29374,
          "eff_reducing_neo_deaths": 0.29374,
          "entry": 1
        },
        {
          "int": "Calcium",
          "name": "int_calcium",
          "on_off": false,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.666134086,
          "eff_reducing_PE": 0.33,
          "eff_reducing_mat_deaths": 0.33,
          "eff_reducing_neo_deaths": 0.33,
          "entry": 2
        },
        {
          "int": "Aspirin",
          "name": "int_aspirin",
          "on_off": false,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.49436655,
          "eff_reducing_PE": 0.292922754,
          "eff_reducing_mat_deaths": 0.292922754,
          "eff_reducing_neo_deaths": 0.292922754,
          "entry": 5
        },
        {
          "int": "Antihypertensives",
          "name": "int_antihyper",
          "on_off": false,
          "applied_to": "Hypertensive (and risk stratified)",
          "location_of_care": "FRU and PHC",
          "coverage": 0.5,
          "elig_pop_haircut": 1,
          "eff_reducing_PE": 0,
          "eff_reducing_mat_deaths": 0.1,
          "eff_reducing_neo_deaths": 0.1,
          "entry": 6
        }
      ],
      "ints_fu": [
        {
          "int": "Selenium for PE",
          "name": "int_selenium",
          "on_off": false,
          "applied_to": "All risk stratified",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.666134086,
          "eff_reducing_PE": 0.72,
          "eff_reducing_mat_deaths": 0.72,
          "eff_reducing_neo_deaths": 0.72,
          "entry": 3
        },
        {
          "int": "Statins",
          "name": "int_statins",
          "on_off": false,
          "applied_to": "Risk stratified & flagged high risk",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 0.49436655,
          "eff_reducing_PE": 0.03,
          "eff_reducing_mat_deaths": 0.03,
          "eff_reducing_neo_deaths": 0.03,
          "entry": 4
        },
        {
          "int": "Incremental magnesium roll-out - FRU",
          "name": "int_mag_fru",
          "on_off": false,
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
          "on_off": false,
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
          "on_off": false,
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
          "on_off": false,
          "applied_to": "All",
          "location_of_care": "FRU, PHC, and Home",
          "coverage": 0.5,
          "elig_pop_haircut": 1,
          "eff_reducing_PE": 0.5,
          "eff_reducing_mat_deaths": 0.5,
          "eff_reducing_neo_deaths": 0.5,
          "entry": 10
        }
      ],
      "pops": {
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

  var makeIntsControls = function(k, d, icon, idx, obj) {
    var sfx = `_sc${idx}`;
    var html = `
    <li>
      <div class="collapsible-header mutedfocus">
        <div class="active-indicator">
          <div
            class="active-indicator-child ${d.on_off ? 'on' : ''}"
            id="indicator-${d.name}"
          >
          </div>
        </div>
        ${icon}
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
                id="on_off_${d.name}${sfx}"
                data-int="${d.name}"
              >
              <span class="lever"></span>
              On
            </label>
          </div>
        </div>
        <div class="input-field">
          <select id="applied_to_${d.name}${sfx}" class="shiny-material-dropdown">
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
          <select id="location_of_care_${d.name}${sfx}" class="shiny-material-dropdown">
            <option value="${loc_vals[0]}" ${d.location_of_care === loc_vals[0] ? 'selected' : ''}>${loc_vals[0]}</option>
            <option value="${loc_vals[1]}" ${d.location_of_care === loc_vals[1] ? 'selected' : ''}>${loc_vals[1]}</option>
            <option value="${loc_vals[2]}" ${d.location_of_care === loc_vals[2] ? 'selected' : ''}>${loc_vals[2]}</option>
            <option value="${loc_vals[3]}" ${d.location_of_care === loc_vals[3] ? 'selected' : ''}>${loc_vals[3]}</option>
            <option value="${loc_vals[4]}" ${d.location_of_care === loc_vals[4] ? 'selected' : ''}>${loc_vals[4]}</option>
          </select>
          <label>Location of care</label>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="coverage_${d.name}${sfx}">Coverage (%)</label>
          <div id="coverage_${d.name}${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="elig_pop_haircut_${d.name}${sfx}">Eligible Population (%)</label>
          <div id="elig_pop_haircut_${d.name}${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="eff_reducing_PE_${d.name}${sfx}">Efficacy (reducing PE) (%)</label>
          <div id="eff_reducing_PE_${d.name}${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="eff_reducing_mat_deaths_${d.name}${sfx}">Efficacy (reducing maternal PE deaths) (%)</label>
          <div id="eff_reducing_mat_deaths_${d.name}${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="eff_reducing_neo_deaths_${d.name}${sfx}">Efficacy (reducing neonatal PE deaths) (%)</label>
          <div id="eff_reducing_neo_deaths_${d.name}${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
      </div>
    </li>
    `;
    obj.append(html);
  }

  $.each([0, 1, 2], function(idx) {
    var obj = $(`#inputs_sc${idx + 1}`);
    var sfx = `_sc${idx + 1}`;
    var html = `
    <li>
      <div class="collapsible-header mutedfocus">
        <span class="settings-icon icon-earth"></span>
        <strong>Demographics</strong>
      </div>
      <div class="collapsible-body">
        <div class="input-field">
          <input id="pop${sfx}" type="number" class="validate">
          <label class="slider-label" for="pop">Population</label>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="pe_rate">Pre-eclampsia rate</label>
          <div id="pe_rate${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="mort_rate_mat">maternal mort. (deaths per 100,000 live births, cond. PE)</label>
          <div id="mort_rate_mat${sfx}" class="shiny-my-slider" data-denom="100000"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="mort_rate_neo">neonatal mort. (deaths per 1,000 live births, cond. PE)</label>
          <div id="mort_rate_neo${sfx}" class="shiny-my-slider" data-denom="1000"></div>
        </div>

        <div class="slider-field">
          <label class="slider-label" for="cfr_fru_maternal">FRU maternal case fatality (per 100,000)</label>
          <div id="cfr_fru_maternal${sfx}" class="shiny-my-slider" data-denom="100000"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="cfr_phc_maternal">PHC maternal case fatality (per 100,000)</label>
          <div id="cfr_phc_maternal${sfx}" class="shiny-my-slider" data-denom="100000"></div>
        </div>

        <div class="slider-field">
          <label class="slider-label" for="cfr_fru_neonatal">FRU neonatal case fatality (per 1,000)</label>
          <div id="cfr_fru_neonatal${sfx}" class="shiny-my-slider" data-denom="1000"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="cfr_phc_neonatal">PHC neonatal case fatality (per 1,000)</label>
          <div id="cfr_phc_neonatal${sfx}" class="shiny-my-slider" data-denom="1000"></div>
        </div>

      </div>
    </li>
    <li>
      <div class="collapsible-header mutedfocus">
        <span class="settings-icon icon-cog"></span>
        <strong>Systems</strong>
      </div>
      <div class="collapsible-body">
        <div class="slider-field">
          <label class="slider-label" for="sys_fru_pct">% at FRU (of facility)</label>
          <div id="sys_fru_pct${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="sys_phc_pct">% at PHC (of facility)</label>
          <div id="sys_phc_pct${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="sys_home_pct">% at home</label>
          <div id="sys_home_pct${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="leak_fru_phc">systems leakage FRU -&gt; PHC</label>
          <div id="leak_fru_phc${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="leak_phc_home">systems leakage PHC -&gt; Home</label>
          <div id="leak_phc_home${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
      </div>
    </li>
    <li>
      <div class="collapsible-header mutedfocus">
        <span class="settings-icon icon-user-check"></span>
        <strong>ANC Visits</strong>
      </div>
      <div class="collapsible-body">
        <div class="slider-field">
          <label class="slider-label" for="anc_visits1">Percentage who have at least 1 ANC visit</label>
          <div id="anc_visits1${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="anc_visits4">Percentage who have at least 4 ANC visits</label>
          <div id="anc_visits4${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>

      </div>
    </li>
    <li>
      <div class="collapsible-header mutedfocus">
        <span class="settings-icon icon-dots-three-horizontal"></span>
        <strong>Other Assumptions</strong>
      </div>
      <div class="collapsible-body">

        <div class="slider-field">
          <label class="slider-label" for="pop_ghtn_pct">% of population that has gestational hypertension</label>
          <div id="pop_ghtn_pct${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="hr_act_w_ghtn_pct">% actually high risk that has GHTN</label>
          <div id="hr_act_w_ghtn_pct${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="flagintime_pct">% patients flagged at right time</label>
          <div id="flagintime_pct${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>

      </div>
    </li>
    <li class="input-spacer"></li>
    <li>
      <div class="collapsible-header mutedfocus">
        <span class="settings-icon icon-equalizer"></span>
        <strong>Risk Stratification TPP</strong>
      </div>
      <div class="collapsible-body">
        <div class="slider-field">
          <label class="slider-label" for="sensitivity">Sensitivity</label>
          <div id="sensitivity${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="specificity">Specificity</label>
          <div id="specificity${sfx}" class="shiny-my-slider" data-denom="100"></div>
        </div>

        <div class="slider-field">
          <label class="slider-label" for="riskstrat_firstweek">First week for risk stratification</label>
          <div id="riskstrat_firstweek${sfx}" class="shiny-my-slider" data-denom="1"></div>
        </div>
        <div class="slider-field">
          <label class="slider-label" for="riskstrat_lastweek">Last week for risk stratification</label>
          <div id="riskstrat_lastweek${sfx}" class="shiny-my-slider" data-denom="1"></div>
        </div>
      </div>
    </li>
    `;

    html += `
      <div class="ints-control-header-container">
        <div class="ints-control-header">Feasible Standard of Care</div>
        <div id="fe-all-off${sfx}" class="ints-all-on-off">all on</div>
        <div id="fe-all-on${sfx}" class="ints-all-on-off">all off</div>
      </div>
    `;

    obj.append(html);

    $.each(scenarios[idx].ints_fe, function(k, d) {
      makeIntsControls(k, d, "<span class='settings-icon icon-aid-kit'></span>", idx + 1, obj)
    });

    html = `
      <div class="ints-control-header-container">
        <div class="ints-control-header">Future Standard of Care</div>
        <div id="fu-all-off${sfx}" class="ints-all-on-off">all on</div>
        <div id="fu-all-on${sfx}" class="ints-all-on-off">all off</div>
      </div>
    `;
    obj.append(html)

    $.each(scenarios[idx].ints_fu, function(k, d) {
      makeIntsControls(k, d, "<i class='settings-icon2 material-icons'>update</i>", idx + 1, obj)
    });

  });

  //*********************

  var makeOutput = function(data, idx) {
    var sfx = `_sc${idx}`;
    var output = `
    <div">
      <div class="info-more">
        <div class="big-numbers">
          <div class="big-number-wrapper">
            <span class="big-number-label">Population: </span>
            <span id="out_pop_big${sfx}" class="counter big-counter">&nbsp;</span>
          </div>

          <div class="numbers-down-arrow"><i class="material-icons">arrow_downward</i></div>

          <div class="big-number-wrapper">
            <span class="big-number-label">
              <span><i id="rs-num-info${sfx}" class="material-icons info-icon tippy" data-tippy-placement="bottom" title="">info_outline</i></span>
              Risk stratified:
            </span>
            <span class="big-counter">
              <span class="counter" id="out-rs-big${sfx}"></span>
              <span class="big-counter-secondary">
                (<span class="counter" id="out-rs-pct-big${sfx}"></span>%)
              </span>
            </span>
          </div>

          <div class="numbers-down-arrow"><i class="material-icons">arrow_downward</i></div>

          <div id="rs-less-detail${sfx}">
            <div id="conf-bounding">
              <div id="conf-fp${sfx}" class="conf-fp conf-box conf-box-red"></div>
              <div id="conf-fn${sfx}" class="conf-fn conf-box conf-box-red"></div>
              <div id="conf-tp${sfx}" class="conf-tp conf-box conf-box-green"></div>
              <div id="conf-tn${sfx}" class="conf-tn conf-box conf-box-green"></div>
              <div class="conf-fp-bb conf-bb">
                <div class="conf-text">
                  <span id="out_hr_fp2${sfx}" class="shiny-countup-output"></span><br/>
                  (<span id="out_hr_fp_pct2${sfx}" class="shiny-countup-output"></span>%)
                </div>
              </div>
              <div class="conf-fn-bb conf-bb">
                <div class="conf-text">
                   <span id="out_lr_fn2${sfx}" class="shiny-countup-output"></span><br/>
                  (<span id="out_lr_fn_pct2${sfx}" class="shiny-countup-output"></span>%)
                </div>
              </div>
              <div class="conf-tp-bb conf-bb">
                <div class="conf-text">
                  <span id="out_hr_tp2${sfx}" class="shiny-countup-output"></span><br/>
                  (<span id="out_hr_tp_pct2${sfx}" class="shiny-countup-output"></span>%)
                </div>
              </div>
              <div class="conf-tn-bb conf-bb">
                <div class="conf-text">
                   <span id="out_lr_tn2${sfx}" class="shiny-countup-output"></span><br/>
                  (<span id="out_lr_tn_pct2${sfx}" class="shiny-countup-output"></span>%)
                </div>
              </div>
              <div class="conf-fp-label conf-label">Flagged high risk<br/>but truly low risk</div>
              <div class="conf-tp-label conf-label">Flagged high risk<br/>and truly high risk</div>
              <div class="conf-fn-label conf-label">Flagged low risk<br/>but truly high risk</div>
              <div class="conf-tn-label conf-label">Flagged low risk<br/>and truly low risk</div>
            </div>
            <div class="rs-detail-buttons">
              <span id="rs-more-detail-button${sfx}" class="fake-href">More detail</span>
            </div>
          </div>

          <div id="rs-more-detail${sfx}" class="hidden">
            <div class="rs-box">
              <div class="rs-header">
                Actually High Risk (<span class="counter" id="out-hr"></span>)
              </div>
              <div class="rs-bar-bounding">
                <div id="rs-tp${sfx}" class="rs-bar-left rs-green"></div>
                <div id="rs-fn${sfx}" class="rs-bar-right rs-red"></div>
                <div class="rs-bounding rs-bounding-left">
                  flagged high risk (sensitivity)<br/>
                  <span class="rs-num counter" id="out-hrtp${sfx}"></span>
                  (<span class="rs-num counter" id="out-hrtp-pct${sfx}"></span>%)
                </div>
                <div class="rs-bounding rs-bounding-right">
                  flagged as low risk<br/>
                  <span class="rs-num counter" id="out-lrfn${sfx}"></span>
                  (<span class="rs-num counter" id="out-lrfn-pct${sfx}"></span>%)
                </div>
              </div>
            </div>

            <div class="vpad1"></div>

            <div class="rs-box">
              <div class="rs-header">
                Actually Low Risk (<span class="counter" id="out-lr${sfx}"></span>)
              </div>
              <div class="rs-bar-bounding">
                <div id="rs-fp${sfx}" class="rs-bar-left rs-red"></div>
                <div id="rs-tn${sfx}" class="rs-bar-right rs-green"></div>
                <div class="rs-bounding rs-bounding-left">
                  flagged as high risk<br/>
                  <span class="rs-num counter" id="out-hrfp${sfx}"></span>
                  (<span class="rs-num counter" id="out-hrfp-pct${sfx}"></span>%)
                </div>
                <div class="rs-bounding rs-bounding-right">
                  flagged low risk (specificity)<br/>
                  <span class="rs-num counter" id="out-lrtn${sfx}"></span>
                  (<span class="rs-num counter" id="out-lrtn-pct${sfx}"></span>%)
                </div>
              </div>
            </div>

            <div class="vpad"></div>

            <div class="rs-box">
              <div class="rs-header">
                Flagged High Risk (<span class="counter" id="out-fhr${sfx}"></span>)
              </div>
              <div class="rs-bar-bounding">
                <div id="rs-tp2${sfx}" class="rs-bar-left rs-green"></div>
                <div id="rs-fp2${sfx}" class="rs-bar-right rs-red"></div>
                <div class="rs-bounding rs-bounding-left">
                  actually high risk (PPV)<br/>
                  <span class="rs-num counter" id="out-hrtp2${sfx}"></span>
                  (<span class="rs-num counter" id="out-hrtp2-pct${sfx}"></span>%)
                </div>
                <div class="rs-bounding rs-bounding-right">
                  actually low risk<br/>
                  <span class="rs-num counter" id="out-hrfp2${sfx}"></span>
                  (<span class="rs-num counter" id="out-hrfp2-pct${sfx}"></span>%)
                </div>
              </div>
            </div>

            <div class="vpad1"></div>

            <div class="rs-box">
              <div class="rs-header">
                Flagged Low Risk (<span class="counter" id="out-flr${sfx}"></span>)
              </div>
              <div class="rs-bar-bounding">
                <div id="rs-fn2${sfx}" class="rs-bar-left rs-red"></div>
                <div id="rs-tn2${sfx}" class="rs-bar-right rs-green"></div>
                <div class="rs-bounding rs-bounding-left">
                  actually high risk<br/>
                  <span class="rs-num counter" id="out-lrfn2${sfx}"></span>
                  (<span class="rs-num counter" id="out-lrfn2-pct${sfx}"></span>%)
                </div>
                <div class="rs-bounding rs-bounding-right">
                  actually low risk (NPV)<br/>
                  <span class="rs-num counter" id="out-lrtn2${sfx}"></span>
                  (<span class="rs-num counter" id="out-lrtn2-pct${sfx}"></span>%)
                </div>
              </div>
            </div>
            <div class="rs-detail-buttons">
              <span id="rs-less-detail-button${sfx}" class="fake-href">Less detail</span>
            </div>
          </div>

          <div class="numbers-down-arrow"><i class="material-icons">arrow_downward</i></div>

          <div class="section-header">Interventions</div>

          <div class="interventions">
            <div class="int-header">
              <span class="semibold">Reduction in Pre-Eclampsia</span>
              <span class="int-header-smalltext">(pre-intervention cases: <span class="counter" id="out_pe_reduce_denom${sfx}"></span>)</span>
            </div>
            <div class="bar-wrapper">
              <div class="barchart">
                <div class="bar-entry entry-0 tippy" id="pe_reduce-entry-0${sfx}"></div>
                <div class="bar-entry entry-1 tippy" id="pe_reduce-entry-1${sfx}"></div>
                <div class="bar-entry entry-2 tippy" id="pe_reduce-entry-2${sfx}"></div>
                <div class="bar-entry entry-3 tippy" id="pe_reduce-entry-3${sfx}"></div>
                <div class="bar-entry entry-4 tippy" id="pe_reduce-entry-4${sfx}"></div>
                <div class="bar-entry entry-5 tippy" id="pe_reduce-entry-5${sfx}"></div>
                <div class="bar-entry entry-6 tippy" id="pe_reduce-entry-6${sfx}"></div>
                <div class="bar-entry entry-7 tippy" id="pe_reduce-entry-7${sfx}"></div>
                <div class="bar-entry entry-8 tippy" id="pe_reduce-entry-8${sfx}"></div>
                <div class="bar-entry entry-9 tippy" id="pe_reduce-entry-9${sfx}"></div>
                <div class="bar-entry entry-10 tippy" id="pe_reduce-entry-10${sfx}"></div>
              </div>
              <div class="bar-counter">
                <span class="counter med-counter" id="out_pe_reduce${sfx}"></span>
                (<span class="counter med-counter" id="out_pe_reduce_pct${sfx}"></span>%)
              </div>
            </div>

            <div class="int-header">
              <span class="semibold">Reduction in maternal deaths</span>
              <span class="int-header-smalltext">(pre-intervention cases: <span class="counter" id="out_lifesave_mat_denom${sfx}"></span>)</span>
            </div>
            <div class="bar-wrapper">
              <div class="barchart">
                <div class="bar-entry entry-0 tippy" id="lifesave_mat-entry-0${sfx}"></div>
                <div class="bar-entry entry-1 tippy" id="lifesave_mat-entry-1${sfx}"></div>
                <div class="bar-entry entry-2 tippy" id="lifesave_mat-entry-2${sfx}"></div>
                <div class="bar-entry entry-3 tippy" id="lifesave_mat-entry-3${sfx}"></div>
                <div class="bar-entry entry-4 tippy" id="lifesave_mat-entry-4${sfx}"></div>
                <div class="bar-entry entry-5 tippy" id="lifesave_mat-entry-5${sfx}"></div>
                <div class="bar-entry entry-6 tippy" id="lifesave_mat-entry-6${sfx}"></div>
                <div class="bar-entry entry-7 tippy" id="lifesave_mat-entry-7${sfx}"></div>
                <div class="bar-entry entry-8 tippy" id="lifesave_mat-entry-8${sfx}"></div>
                <div class="bar-entry entry-9 tippy" id="lifesave_mat-entry-9${sfx}"></div>
                <div class="bar-entry entry-10 tippy" id="lifesave_mat-entry-10${sfx}"></div>
              </div>
              <div class="bar-counter">
                <span class="counter med-counter" id="out_lifesave_mat${sfx}"></span>
                (<span class="counter med-counter" id="out_lifesave_mat_pct${sfx}"></span>%)
              </div>
            </div>

            <div class="int-header">
              <span class="semibold">Reduction in neonatal deaths</span>
              <span class="int-header-smalltext">(pre-intervention cases: <span class="counter" id="out_lifesave_neo_denom${sfx}"></span>)</span>
            </div>
            <div class="bar-wrapper">
              <div class="barchart">
                <div class="bar-entry entry-0 tippy" id="lifesave_neo-entry-0${sfx}"></div>
                <div class="bar-entry entry-1 tippy" id="lifesave_neo-entry-1${sfx}"></div>
                <div class="bar-entry entry-2 tippy" id="lifesave_neo-entry-2${sfx}"></div>
                <div class="bar-entry entry-3 tippy" id="lifesave_neo-entry-3${sfx}"></div>
                <div class="bar-entry entry-4 tippy" id="lifesave_neo-entry-4${sfx}"></div>
                <div class="bar-entry entry-5 tippy" id="lifesave_neo-entry-5${sfx}"></div>
                <div class="bar-entry entry-6 tippy" id="lifesave_neo-entry-6${sfx}"></div>
                <div class="bar-entry entry-7 tippy" id="lifesave_neo-entry-7${sfx}"></div>
                <div class="bar-entry entry-8 tippy" id="lifesave_neo-entry-8${sfx}"></div>
                <div class="bar-entry entry-9 tippy" id="lifesave_neo-entry-9${sfx}"></div>
                <div class="bar-entry entry-10 tippy" id="lifesave_neo-entry-10${sfx}"></div>
              </div>
              <div class="bar-counter">
                <span class="counter med-counter" id="out_lifesave_neo${sfx}"></span>
                (<span class="counter med-counter" id="out_lifesave_neo_pct${sfx}"></span>%)
              </div>
            </div>

            <h6 class="int-header">Number treated</h6>
            <div class="bar-wrapper">
              <div class="barchart">
                <div class="bar-entry entry-0 tippy" id="n_treated-entry-0${sfx}"></div>
                <div class="bar-entry entry-1 tippy" id="n_treated-entry-1${sfx}"></div>
                <div class="bar-entry entry-2 tippy" id="n_treated-entry-2${sfx}"></div>
                <div class="bar-entry entry-3 tippy" id="n_treated-entry-3${sfx}"></div>
                <div class="bar-entry entry-4 tippy" id="n_treated-entry-4${sfx}"></div>
                <div class="bar-entry entry-5 tippy" id="n_treated-entry-5${sfx}"></div>
                <div class="bar-entry entry-6 tippy" id="n_treated-entry-6${sfx}"></div>
                <div class="bar-entry entry-7 tippy" id="n_treated-entry-7${sfx}"></div>
                <div class="bar-entry entry-8 tippy" id="n_treated-entry-8${sfx}"></div>
                <div class="bar-entry entry-9 tippy" id="n_treated-entry-9${sfx}"></div>
                <div class="bar-entry entry-10 tippy" id="n_treated-entry-10${sfx}"></div>
              </div>
              <div class="bar-counter">
                <span class="counter med-counter" id="out_n_treated${sfx}"></span>
              </div>
            </div>
          </div>
          <div class="numbers-down-arrow"><i class="material-icons">arrow_downward</i></div>
          <div class="section-header">Details</div>
        </div>

        <div class="info-table">
          <table>
            <tr><td class="info-table-head">Population demographics</td><td></td></tr>
            <tr>
              <td>Population</td>
              <td class="info-table-value">
                <span id="out_pop${sfx}" class="counter"></span>
              </td>
            </tr>
            <tr>
              <td>Pre-eclampsia rate</td>
              <td class="info-table-value">
                <span id="out_pe_rate${sfx}" class="counter"></span>%
              </td>
            </tr>
            <tr>
              <td># of patients w pre-eclampsia</td> <!-- der -->
              <td class="info-table-value">
                <span id="out_n_pe${sfx}" class="counter"></span>
              </td>
            </tr>
            <tr>
              <td>% maternal mortality rate (per 100,000, cond. PE)</td>
              <td class="info-table-value">
                <span id="out_mort_rate_mat${sfx}" class="counter"></span>
              </td>
            </tr>
            <tr>
              <td>% neonatal mortality rate (per 1,000 cond. PE)</td>
              <td class="info-table-value">
                <span id="out_mort_rate_neo${sfx}" class="counter"></span>
              </td>
            </tr>
            <tr>
              <td>Case fatality rate (FRU) - maternal (per 100,000)</td>
              <td class="info-table-value">
                <span id="out_cfr_fru_maternal${sfx}" class="counter"></span>
              </td>
            </tr>
            <tr>
              <td>Case fatality rate (PHC) - maternal (per 100,000)</td>
              <td class="info-table-value">
                <span id="out_cfr_phc_maternal${sfx}" class="counter"></span>
              </td>
            </tr>
            <tr>
              <td>Case fatality rate (FRU) - neonatal (per 1,000)</td>
              <td class="info-table-value">
                <span id="out_cfr_fru_neonatal${sfx}" class="counter"></span>
              </td>
            </tr>
            <tr>
              <td>Case fatality rate (PHC) - neonatal (per 1,000)</td>
              <td class="info-table-value">
                <span id="out_cfr_phc_neonatal${sfx}" class="counter"></span>
              </td>
            </tr>
            <tr><td class="info-table-head">Systems</td><td></td></tr>
            <tr>
              <td>% at FRU (of facility)</td>
              <td class="info-table-value">
                <span id="out_sys_fru_pct${sfx}" class="counter"></span>%
              </td>
            </tr>
            <tr>
              <td>% at PHC (of facility)</td>
              <td class="info-table-value">
                <span id="out_sys_phc_pct${sfx}" class="counter"></span>%
              </td>
            </tr>
            <tr>
              <td>% at home</td>
              <td class="info-table-value">
                <span id="out_sys_home_pct${sfx}" class="counter"></span>%
              </td>
            </tr>
            <tr>
              <td>FRU -&gt; PHC</td>
              <td class="info-table-value">
                <span id="out_leak_fru_phc${sfx}" class="counter"></span>%
              </td>
            </tr>
            <tr>
              <td>PHC -&gt; Home</td>
              <td class="info-table-value">
                <span id="out_leak_phc_home${sfx}" class="counter"></span>%
              </td>
            </tr>
            <tr><td class="info-table-head">Risk stratification TPP</td><td></td></tr>
            <tr>
              <td>Sensitivity</td>
              <td class="info-table-value">
                <span id="out_sensitivity${sfx}" class="counter"></span>%
              </td>
            </tr>
            <tr>
              <td>Specificity</td>
              <td class="info-table-value">
                <span id="out_specificity${sfx}" class="counter"></span>%
              </td>
            </tr>
            <tr>
              <td>First week for risk stratification</td>
              <td class="info-table-value">
                <span id="out_riskstrat_firstweek${sfx}" class="counter"></span>
              </td>
            </tr>
            <tr>
              <td>Last week for risk stratification</td>
              <td class="info-table-value">
                <span id="out_riskstrat_lastweek${sfx}" class="counter"></span>
              </td>
            </tr>
            <tr><td class="info-table-head">ANC visits</td><td></td></tr>
            <tr>
              <td>At least 1</td>
              <td class="info-table-value">
                <span id="out_anc_visits1${sfx}" class="counter"></span>%
              </td>
            </tr>
            <tr>
              <td>At least 4</td>
              <td class="info-table-value">
                <span id="out_anc_visits4${sfx}" class="counter"></span>%
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    `;

    $(`#output_sc${idx}`).append(output);

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
    var makeIntsSliders = function(d, idx) {
      slider_vars.forEach(function(v) {
        var slider = document.getElementById(`${v}_${d.name}_sc${idx}`);
        noUiSlider.create(slider, {
          start: d[v] * 100,
          step: 1,
          orientation: 'horizontal',
          range: { 'min': 0, 'max': 100 },
          format: format,
          pips: pips
        });
        slider.noUiSlider.on('change', function() {
          var el = $(`#${v}_${d.name}_sc${idx}`);
          el.data('value', slider.noUiSlider.get());
          el.trigger('change');
        });
      });
    }

    var idx1 = idx - 1;
    data.ints_fe.forEach(function(d) {
      makeIntsSliders(d, idx);
    });

    data.ints_fu.forEach(function(d) {
      makeIntsSliders(d, idx);
    });

    $(`#pop${sfx}`).val(data.pops.pop);

    // $("#pop").on("change", function(d) {
    //   // TODO: validate positive number
    // })

    var sliders = {};

    sliders[`pe_rate${sfx}`] = document.getElementById(`pe_rate${sfx}`);
    noUiSlider.create(sliders[`pe_rate${sfx}`], {
      start: data.pops.pe_rate * 100,
      step: 0.1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 20 },
      format: format,
      pips: pips
    });

    sliders[`mort_rate_mat${sfx}`] = document.getElementById(`mort_rate_mat${sfx}`);
    noUiSlider.create(sliders[`mort_rate_mat${sfx}`], {
      start: data.pops.mort_rate_mat * 100000,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 1000 },
      format: format,
      pips: pips
    });

    sliders[`mort_rate_neo${sfx}`] = document.getElementById(`mort_rate_neo${sfx}`);
    noUiSlider.create(sliders[`mort_rate_neo${sfx}`], {
      start: data.pops.mort_rate_neo * 1000,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`cfr_fru_maternal${sfx}`] = document.getElementById(`cfr_fru_maternal${sfx}`);
    noUiSlider.create(sliders[`cfr_fru_maternal${sfx}`], {
      start: data.pops.cfr_fru_maternal * 100000,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 400 },
      format: format,
      pips: pips
    });

    sliders[`cfr_phc_maternal${sfx}`] = document.getElementById(`cfr_phc_maternal${sfx}`);
    noUiSlider.create(sliders[`cfr_phc_maternal${sfx}`], {
      start: data.pops.cfr_phc_maternal * 100000,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 400 },
      format: format,
      pips: pips
    });

    sliders[`cfr_fru_neonatal${sfx}`] = document.getElementById(`cfr_fru_neonatal${sfx}`);
    noUiSlider.create(sliders[`cfr_fru_neonatal${sfx}`], {
      start: data.pops.cfr_fru_neonatal * 1000,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 40 },
      format: format,
      pips: pips
    });

    sliders[`cfr_phc_neonatal${sfx}`] = document.getElementById(`cfr_phc_neonatal${sfx}`);
    noUiSlider.create(sliders[`cfr_phc_neonatal${sfx}`], {
      start: data.pops.cfr_phc_neonatal * 1000,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 40 },
      format: format,
      pips: pips
    });

    sliders[`sys_fru_pct${sfx}`] = document.getElementById(`sys_fru_pct${sfx}`);
    noUiSlider.create(sliders[`sys_fru_pct${sfx}`], {
      start: data.pops.sys_fru_pct * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`sys_phc_pct${sfx}`] = document.getElementById(`sys_phc_pct${sfx}`);
    noUiSlider.create(sliders[`sys_phc_pct${sfx}`], {
      start: data.pops.sys_phc_pct * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`sys_home_pct${sfx}`] = document.getElementById(`sys_home_pct${sfx}`);
    noUiSlider.create(sliders[`sys_home_pct${sfx}`], {
      start: data.pops.sys_home_pct * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`leak_fru_phc${sfx}`] = document.getElementById(`leak_fru_phc${sfx}`);
     noUiSlider.create(sliders[`leak_fru_phc${sfx}`], {
      start: data.pops.leak_fru_phc * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`leak_phc_home${sfx}`] = document.getElementById(`leak_phc_home${sfx}`);
    noUiSlider.create(sliders[`leak_phc_home${sfx}`], {
      start: data.pops.leak_phc_home * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`specificity${sfx}`] = document.getElementById(`specificity${sfx}`);
    noUiSlider.create(sliders[`specificity${sfx}`], {
      start: data.pops.specificity * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`sensitivity${sfx}`] = document.getElementById(`sensitivity${sfx}`);
    noUiSlider.create(sliders[`sensitivity${sfx}`], {
      start: data.pops.sensitivity * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    // TODO: don't allow firstweek to be greater than lastweek
    sliders[`riskstrat_firstweek${sfx}`] = document.getElementById(`riskstrat_firstweek${sfx}`);
    noUiSlider.create(sliders[`riskstrat_firstweek${sfx}`], {
      start: data.pops.riskstrat_firstweek,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 1, 'max': 42 },
      format: format,
      pips: pips
    });

    sliders[`riskstrat_lastweek${sfx}`] = document.getElementById(`riskstrat_lastweek${sfx}`);
    noUiSlider.create(sliders[`riskstrat_lastweek${sfx}`], {
      start: data.pops.riskstrat_lastweek,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 1, 'max': 42 },
      format: format,
      pips: pips
    });

    // TODO: don't allow anc_visits4 to be greater than anc_visits1
    sliders[`anc_visits1${sfx}`] = document.getElementById(`anc_visits1${sfx}`);
    noUiSlider.create(sliders[`anc_visits1${sfx}`], {
      start: data.pops.anc_visits1 * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`anc_visits4${sfx}`] = document.getElementById(`anc_visits4${sfx}`);
    noUiSlider.create(sliders[`anc_visits4${sfx}`], {
      start: data.pops.anc_visits4 * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`pop_ghtn_pct${sfx}`] = document.getElementById(`pop_ghtn_pct${sfx}`);
    noUiSlider.create(sliders[`pop_ghtn_pct${sfx}`], {
      start: data.pops.pop_ghtn_pct * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`hr_act_w_ghtn_pct${sfx}`] = document.getElementById(`hr_act_w_ghtn_pct${sfx}`);
    noUiSlider.create(sliders[`hr_act_w_ghtn_pct${sfx}`], {
      start: data.pops.hr_act_w_ghtn_pct * 100,
      step: 1,
      orientation: 'horizontal',
      range: { 'min': 0, 'max': 100 },
      format: format,
      pips: pips
    });

    sliders[`flagintime_pct${sfx}`] = document.getElementById(`flagintime_pct${sfx}`);
    noUiSlider.create(sliders[`flagintime_pct${sfx}`], {
      start: data.pops.flagintime_pct * 100,
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

    // // initialize the one different intervention (int_am)
    // if (int0.on_off === true) {
    //   $("#indicator-int_am_diff_cfl").addClass("on");
    //   $("#on_off_int_am_diff_cfl").attr("checked", true);
    // }

    $(`#rs-more-detail-button${sfx}`).on("click", function() {
      $(`#rs-more-detail${sfx}`).removeClass("hidden");
      $(`#rs-less-detail${sfx}`).addClass("hidden");
    });

    $(`#rs-less-detail-button${sfx}`).on("click", function() {
      $(`#rs-less-detail${sfx}`).removeClass("hidden");
      $(`#rs-more-detail${sfx}`).addClass("hidden");
    });

    $(`#fe-all-off${sfx}`).on("click", function() {
      data.ints_fe.forEach(function(d) {
        var el = $(`#on_off_${d.name}${sfx}`);
        if (!el.is(':checked')) {
          el.click();
        }
      });
    });

    $(`#fu-all-off${sfx}`).on("click", function() {
      data.ints_fu.forEach(function(d) {
        var el = $(`#on_off_${d.name}${sfx}`);
        if (!el.is(':checked')) {
          el.click();
        }
      });
    });

    $(`#fe-all-on${sfx}`).on("click", function() {
      // on_off_int_am_csect
      data.ints_fe.forEach(function(d) {
        var el = $(`#on_off_${d.name}${sfx}`);
        if (el.is(':checked')) {
          el.click();
        }
      });
    });

    $(`#fu-all-on${sfx}`).on("click", function() {
      // on_off_int_am_csect
      data.ints_fu.forEach(function(d) {
        var el = $(`#on_off_${d.name}${sfx}`);
        if (el.is(':checked')) {
          el.click();
        }
      });
    });

    $(`#output-header-text-sc${idx}`).html(data.name);
  }

  makeOutput(scenarios[0], 1);

  $("#inputs_sc2").addClass("hidden");
  $("#inputs_sc3").addClass("hidden");

  $("#output-header-sc2").addClass("hidden");
  $("#output_sc2").addClass("hidden");
  $("#output-header-sc3").addClass("hidden");
  $("#output_sc3").addClass("hidden");

  $("#output-header-sc1").on("click", function() {
    $("#output-header-sc1").removeClass("inactive");
    $("#output-header-sc2").addClass("inactive");
    $("#output-header-sc3").addClass("inactive");

    $("#inputs_sc1").removeClass("hidden");
    $("#inputs_sc2").addClass("hidden");
    $("#inputs_sc3").addClass("hidden");

    $("#output-header-top-sc1").addClass("hidden");
    $("#output-header-top-sc2").addClass("hidden");
    $("#output-header-top-sc3").addClass("hidden");

    $("#output-header-text-sc1").attr("contenteditable", true);
    $("#output-header-text-sc2").attr("contenteditable", false);
    $("#output-header-text-sc3").attr("contenteditable", false);
  });

  $("#output-header-sc2").on("click", function() {
    $("#output-header-sc1").addClass("inactive");
    $("#output-header-sc2").removeClass("inactive");
    $("#output-header-sc3").addClass("inactive");

    $("#inputs_sc1").addClass("hidden");
    $("#inputs_sc2").removeClass("hidden");
    $("#inputs_sc3").addClass("hidden");

    $("#output-header-top-sc1").removeClass("hidden");
    $("#output-header-top-sc2").addClass("hidden");
    $("#output-header-top-sc3").addClass("hidden");

    $("#output-header-text-sc1").attr("contenteditable", false);
    $("#output-header-text-sc2").attr("contenteditable", true);
    $("#output-header-text-sc3").attr("contenteditable", false);
  });

  $("#output-header-sc3").on("click", function() {
    $("#output-header-sc1").addClass("inactive");
    $("#output-header-sc2").addClass("inactive");
    $("#output-header-sc3").removeClass("inactive");

    $("#inputs_sc1").addClass("hidden");
    $("#inputs_sc2").addClass("hidden");
    $("#inputs_sc3").removeClass("hidden");

    $("#output-header-top-sc1").removeClass("hidden");
    $("#output-header-top-sc2").removeClass("hidden");
    $("#output-header-top-sc3").addClass("hidden");

    $("#output-header-text-sc1").attr("contenteditable", false);
    $("#output-header-text-sc2").attr("contenteditable", false);
    $("#output-header-text-sc3").attr("contenteditable", true);
  });

  //*********************

  var sc_opts = `<option value="0" selected>${scenarios[0].name}</option>`;
  for (var i = 1; i < scenarios.length; i++) {
    sc_opts += `<option value="${i}">${scenarios[i].name}</option>`;
  }
  $("#sc-options").html(sc_opts);

  $("#select-basis").on("click", function() {
    var idx = parseInt($("#sc-options").val());

    var nActive = 3 - $(".output-header.hidden").length;

    makeOutput(scenarios[idx], 2);
    $("#output-header-sc2").click();
    $("#output-header-sc2").removeClass("hidden");
    $("#output_sc2").removeClass("hidden");
    Shiny.unbindAll();
    Shiny.bindAll();

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

  //*********************

  $('.int_check').change(function() {
    var el = $(this);
    if (el.is(':checked')) {
      $('#indicator-' + el.data('int')).addClass('on');
    } else {
      $('#indicator-' + el.data('int')).removeClass('on');
    }
  });

  tippy(".tippy", {
    delay: 10,
    arrow: true,
    arrowType: 'round',
    size: 'large',
    duration: 200,
    animation: 'scale',
    dynamicTitle: true
  });

  $('.collapsible').collapsible();
  $('select').formSelect();

  //*********************

  var throttled = false;

  // window.resize callback function
  function setDimensions() {
    $("#controls").height(window.innerHeight - 83);
    $("#outputs").height(window.innerHeight - 50);
    $("#outputs").width(window.innerWidth - 360);
    $("#output_sc1").height(window.innerHeight - 105);
    $("#output_sc2").height(window.innerHeight - 105);
    $("#output_sc3").height(window.innerHeight - 105);
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

