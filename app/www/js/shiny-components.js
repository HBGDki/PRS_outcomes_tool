const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var int_lookup = {
  "am_diff_cfl": "Baseline from using this tool", // "Antenatal monitoring + diff CFL",
  "am_csect": "Antenatal monitoring + early C-section",
  "calcium": "Calcium",
  "selenium": "Selenium for PE",
  "statins": "Statins",
  "aspirin": "Aspirin",
  "antihyper": "Antihypertensives",
  "mag_fru": "Incremental magnesium roll-out - FRU",
  "mag_phc": "Incremental magnesium roll-out - PHC",
  "intantihyper": "Intrapartum antihypertensives",
  "drug": "Novel drug",
};

var mySliderBinding = new Shiny.InputBinding();
$.extend(mySliderBinding, {
  find: function(scope) {
    return $(scope).find(".shiny-my-slider");
  },
  getValue: function(el) {
    // console.log($(el).attr('id'))
    // console.log($(el).data('value'))
    var denom = parseFloat($(el).data('denom'))
    return parseFloat($(el).data('value')) / denom;
  },
  subscribe: function(el, callback) {
    $(el).on("change.mySliderBinding", function(e) {
      callback();
    });
  },
  unsubscribe: function(el) {
    $(el).off(".mySliderBinding");
  }
});

Shiny.inputBindings.register(mySliderBinding);


var myMultiSliderBinding = new Shiny.InputBinding();
$.extend(myMultiSliderBinding, {
  find: function(scope) {
    return $(scope).find(".shiny-my-multi-slider");
  },
  getValue: function(el) {
    debugger;
    // console.log($(el).attr('id'))
    // console.log($(el).data('value'))
    var denom = parseFloat($(el).data('denom'))
    var data = $(el).data('value');
    if (data !== undefined) {
      for (var i = 0; i < data.length; i++) {
        data[i] = parseFloat(data[i]) / denom;
      }
    }
    return data;
  },
  subscribe: function(el, callback) {
    $(el).on("change.myMultiSliderBinding", function(e) {
      callback();
    });
  },
  unsubscribe: function(el) {
    $(el).off(".myMultiSliderBinding");
  }
});

Shiny.inputBindings.register(myMultiSliderBinding);



var scenarioStateBinding = new Shiny.InputBinding();
$.extend(scenarioStateBinding, {
  find: function(scope) {
    return $(scope).find(".shiny-scenario-state");
  },
  getValue: function(el) {
    var ret = $.map([1, 2, 3], function(d) {
      var sfx = `_sc${d}`;
      return parseFloat($(`#output_content${sfx}`).data("baseline") + 1);
    });
    return ret;
  },
  subscribe: function(el, callback) {
    $(el).on("change.scenarioStateBinding", function(e) {
      callback();
    });
  },
  unsubscribe: function(el) {
    $(el).off(".scenarioStateBinding");
  }
});

Shiny.inputBindings.register(scenarioStateBinding);




var myTimer;

var prsDataOutputBinding = new Shiny.OutputBinding();
$.extend(prsDataOutputBinding, {
  find: function(scope) {
    return $(scope).find('.shiny-prs-data-output');
  },
  renderValue: function(el, data) {
    var makeCountUp = function(id, data) {
      clearTimeout(myTimer);

      var options = {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
      };

      var next = parseFloat(data);
      var el = $("#" + id);
      el.removeClass("counting-up"); // to deal with previous counter still running
      el.removeClass("counting-down"); // to deal with previous counter still running
      var prev = parseFloat(el.data("value"));
      if (isNaN(prev)) {
        prev = 0;
      } else {
        if (prev < next) {
          el.addClass("counting-up");
        } else if (prev > next) {
          el.addClass("counting-down");
        }
      }
      var obj = new CountUp(id, prev, next, 0, 1.0, options);
      obj.start(function() {
        myTimer = setTimeout(function() {
          el.removeClass("counting-up");
          el.removeClass("counting-down");
        }, 500);
      });
      el.data("value", next);
      // el.html(data);
    }

    if (data.pop === undefined || data.der === undefined || data.ints === undefined || data.ints_tot === undefined) {
      return;
    }

    var sfx = `_sc${data.idx}`;

    makeCountUp(`out_pop${sfx}`, data.pop.pop);
    makeCountUp(`out_pe_rate${sfx}`, data.pop.pe_rate * 100);
    makeCountUp(`out_n_pe${sfx}`, data.der.n_pe);
    makeCountUp(`out_mort_rate_mat${sfx}`, data.pop.mort_rate_mat * 100000);
    makeCountUp(`out_mort_rate_neo${sfx}`, data.pop.mort_rate_neo * 1000);
    makeCountUp(`out_cfr_fru_maternal${sfx}`, data.pop.cfr_fru_maternal * 100000);
    makeCountUp(`out_cfr_phc_maternal${sfx}`, data.pop.cfr_phc_maternal * 100000);
    makeCountUp(`out_cfr_fru_neonatal${sfx}`, data.pop.cfr_fru_neonatal * 1000);
    makeCountUp(`out_cfr_phc_neonatal${sfx}`, data.pop.cfr_phc_neonatal * 1000);
    makeCountUp(`out_sys_fru_pct${sfx}`, data.pop.sys_fru_pct * 100);
    makeCountUp(`out_sys_phc_pct${sfx}`, data.pop.sys_phc_pct * 100);
    makeCountUp(`out_sys_home_pct${sfx}`, data.pop.sys_home_pct * 100);
    makeCountUp(`out_leak_fru_phc${sfx}`, data.pop.leak_fru_phc * 100);
    makeCountUp(`out_leak_phc_home${sfx}`, data.pop.leak_phc_home * 100);
    makeCountUp(`out_sensitivity${sfx}`, data.pop.sensitivity * 100);
    makeCountUp(`out_specificity${sfx}`, data.pop.specificity * 100);
    makeCountUp(`out_anc_visits1${sfx}`, data.pop.anc_visits1 * 100);
    makeCountUp(`out_anc_visits4${sfx}`, data.pop.anc_visits4 * 100);
    makeCountUp(`out_riskstrat_firstweek${sfx}`, data.pop.riskstrat_firstweek);
    makeCountUp(`out_riskstrat_lastweek${sfx}`, data.pop.riskstrat_lastweek);
    makeCountUp(`out_n_riskstrat${sfx}`, data.der.n_riskstrat);
    makeCountUp(`out_riskstrat_pct${sfx}`, data.der.riskstrat_pct * 100);
    makeCountUp(`out_hr_flagged${sfx}`, data.der.hr_flagged);
    makeCountUp(`out_hr_flagged_pct${sfx}`, data.der.hr_flagged_pct * 100);
    makeCountUp(`out_hr_tp${sfx}`, data.der.hr_tp);
    makeCountUp(`out_hr_tp_pct${sfx}`, data.der.hr_tp_pct * 100);
    makeCountUp(`out_hr_fp${sfx}`, data.der.hr_fp);
    makeCountUp(`out_hr_fp_pct${sfx}`, data.der.hr_fp_pct * 100);
    makeCountUp(`out_lr_flagged${sfx}`, data.der.lr_flagged);
    makeCountUp(`out_lr_flagged_pct${sfx}`, data.der.lr_flagged_pct * 100);
    makeCountUp(`out_lr_tn${sfx}`, data.der.lr_tn);
    makeCountUp(`out_lr_tn_pct${sfx}`, data.der.lr_tn_pct * 100);
    makeCountUp(`out_lr_fn${sfx}`, data.der.lr_fn);
    makeCountUp(`out_lr_fn_pct${sfx}`, data.der.lr_fn_pct * 100);

    makeCountUp(`out_pop_big${sfx}`, data.pop.pop);
    makeCountUp(`out-rs-big${sfx}`, data.der.n_riskstrat);
    makeCountUp(`out-rs-pct-big${sfx}`, data.der.riskstrat_pct * 100);


    var confu_vals = [data.der.hr_fp, data.der.lr_fn, data.der.hr_tp, data.der.lr_tn];
    var confu_max = Math.max(...confu_vals)

    // // try to resize the quadrants to get more resolution...
    // var idx = confu_vals.indexOf(Math.max(...confu_vals));

    // var maxdim = 400 * confu_vals[idx] / confu_max;
    // var qw, qh;
    // if ([1, 3].indexOf(idx) > -1) {
    //   qw = Math.max(125, 400 - maxdim);
    // } else {
    //   qw = Math.min(400 - 125, maxdim);
    // }
    // if ([2, 3].indexOf(idx) > -1) {
    //   qh = Math.max(125, 400 - maxdim);
    // } else {
    //   qh = Math.min(400 - 125, maxdim);
    // }

    $(`#conf-fp${sfx}`).width(150 * data.der.hr_fp / confu_max).height(150 * data.der.hr_fp / confu_max);
    $(`#conf-fn${sfx}`).width(150 * data.der.lr_fn / confu_max).height(150 * data.der.lr_fn / confu_max);
    $(`#conf-tp${sfx}`).width(150 * data.der.hr_tp / confu_max).height(150 * data.der.hr_tp / confu_max);
    $(`#conf-tn${sfx}`).width(150 * data.der.lr_tn / confu_max).height(150 * data.der.lr_tn / confu_max);

    var confu_tot = data.der.hr_fp + data.der.lr_fn + data.der.hr_tp + data.der.lr_tn;
    makeCountUp(`out_hr_tp2${sfx}`, data.der.hr_tp);
    makeCountUp(`out_hr_tp_pct2${sfx}`, 100 * data.der.hr_tp / confu_tot);
    makeCountUp(`out_hr_fp2${sfx}`, data.der.hr_fp);
    makeCountUp(`out_hr_fp_pct2${sfx}`, 100 * data.der.hr_fp / confu_tot);
    makeCountUp(`out_lr_tn2${sfx}`, data.der.lr_tn);
    makeCountUp(`out_lr_tn_pct2${sfx}`, 100 * data.der.lr_tn / confu_tot);
    makeCountUp(`out_lr_fn2${sfx}`, data.der.lr_fn);
    makeCountUp(`out_lr_fn_pct2${sfx}`, 100 * data.der.lr_fn / confu_tot);


    makeCountUp(`out-hr${sfx}`, data.der.hr_tp + data.der.lr_fn);
    makeCountUp(`out-hrtp${sfx}`, data.der.hr_tp);
    makeCountUp(`out-lrfn${sfx}`, data.der.lr_fn);
    makeCountUp(`out-hrtp-pct${sfx}`, 100 * data.der.hr_tp / (data.der.hr_tp + data.der.lr_fn));
    makeCountUp(`out-lrfn-pct${sfx}`, 100 * data.der.lr_fn / (data.der.hr_tp + data.der.lr_fn));
    var mx = Math.max(data.der.hr_tp, data.der.lr_fn);
    $(`#rs-tp${sfx}`).width(200 * data.der.hr_tp / mx);
    $(`#rs-fn${sfx}`).width(200 * data.der.lr_fn / mx);

    makeCountUp(`out-lr${sfx}`, data.der.hr_fp + data.der.lr_tn);
    makeCountUp(`out-hrfp${sfx}`, data.der.hr_fp);
    makeCountUp(`out-lrtn${sfx}`, data.der.lr_tn);
    makeCountUp(`out-hrfp-pct${sfx}`, 100 * data.der.hr_fp / (data.der.hr_fp + data.der.lr_tn));
    makeCountUp(`out-lrtn-pct${sfx}`, 100 * data.der.lr_tn / (data.der.hr_fp + data.der.lr_tn));
    mx = Math.max(data.der.hr_fp, data.der.lr_tn);
    $(`#rs-fp${sfx}`).width(200 * data.der.hr_fp / mx);
    $(`#rs-tn${sfx}`).width(200 * data.der.lr_tn / mx);

    makeCountUp(`out-fhr${sfx}`, data.der.hr_tp + data.der.hr_fp);
    makeCountUp(`out-hrtp2${sfx}`, data.der.hr_tp);
    makeCountUp(`out-hrfp2${sfx}`, data.der.hr_fp);
    makeCountUp(`out-hrtp2-pct${sfx}`, 100 * data.der.hr_tp / (data.der.hr_tp + data.der.hr_fp));
    makeCountUp(`out-hrfp2-pct${sfx}`, 100 * data.der.hr_fp / (data.der.hr_tp + data.der.hr_fp));
    var mx = Math.max(data.der.hr_tp, data.der.hr_fp);
    $(`#rs-tp2${sfx}`).width(200 * data.der.hr_tp / mx);
    $(`#rs-fp2${sfx}`).width(200 * data.der.hr_fp / mx);

    makeCountUp(`out-flr${sfx}`, data.der.lr_fn + data.der.lr_tn);
    makeCountUp(`out-lrfn2${sfx}`, data.der.lr_fn);
    makeCountUp(`out-lrtn2${sfx}`, data.der.lr_tn);
    makeCountUp(`out-lrfn2-pct${sfx}`, 100 * data.der.lr_fn / (data.der.lr_fn + data.der.lr_tn));
    makeCountUp(`out-lrtn2-pct${sfx}`, 100 * data.der.lr_tn / (data.der.lr_fn + data.der.lr_tn));
    mx = Math.max(data.der.lr_fn, data.der.lr_tn);
    $(`#rs-fn2${sfx}`).width(200 * data.der.lr_fn / mx);
    $(`#rs-tn2${sfx}`).width(200 * data.der.lr_tn / mx);

    makeCountUp(`out-tot-hr${sfx}`, data.der.hr_tp + data.der.hr_fp);

    makeCountUp(`out_pe_reduce${sfx}`, data.ints_tot.pe_reduce);
    makeCountUp(`out_lifesave_mat${sfx}`, data.ints_tot.lifesave_mat);
    makeCountUp(`out_lifesave_neo${sfx}`, data.ints_tot.lifesave_neo);
    makeCountUp(`out_n_treated${sfx}`, data.ints_tot.n_patient);

    var pe_denom = data.pop.pop * data.pop.pe_rate;
    var mat_denom = data.pop.pop * data.pop.mort_rate_mat;
    var neo_denom = data.pop.pop * data.pop.mort_rate_neo;

    makeCountUp(`out_pe_reduce_denom${sfx}`, pe_denom);
    makeCountUp(`out_lifesave_mat_denom${sfx}`, mat_denom);
    makeCountUp(`out_lifesave_neo_denom${sfx}`, neo_denom);

    makeCountUp(`out_pe_reduce_pct${sfx}`, 100 * data.ints_tot.pe_reduce / pe_denom);
    makeCountUp(`out_lifesave_mat_pct${sfx}`, 100 * data.ints_tot.lifesave_mat / mat_denom);
    makeCountUp(`out_lifesave_neo_pct${sfx}`, 100 * data.ints_tot.lifesave_neo / neo_denom);

    /*----------------------*/

    data.ints.pe_reduce.map(function(d, i) {
      var el = $(`#pe_reduce-entry-${i}${sfx}`);
      el.width(280 * (d / data.ints_tot.pe_reduce));
      el.attr("title", `${int_lookup[data.ints.name[i]]}: ${numberWithCommas(d)} (${Math.round(1000 * d / data.ints_tot.pe_reduce) / 10}%)`);
    });

    data.ints.lifesave_mat.map(function(d, i) {
      var el = $(`#lifesave_mat-entry-${i}${sfx}`);
      el.width(280 * (d / data.ints_tot.lifesave_mat));
      el.attr("title", `${int_lookup[data.ints.name[i]]}: ${numberWithCommas(d)} (${Math.round(1000 * d / data.ints_tot.lifesave_mat) / 10}%)`);
    });

    data.ints.lifesave_neo.map(function(d, i) {
      var el = $(`#lifesave_neo-entry-${i}${sfx}`);
      el.width(280 * (d / data.ints_tot.lifesave_neo));
      el.attr("title", `${int_lookup[data.ints.name[i]]}: ${numberWithCommas(d)} (${Math.round(1000 * d / data.ints_tot.lifesave_neo) / 10}%)`);
    });

    data.ints.n_patient.map(function(d, i) {
      var el = $(`#n_treated-entry-${i}${sfx}`);
      el.width(280 * (d / data.ints_tot.n_patient));
      el.attr("title", `${int_lookup[data.ints.name[i]]}: ${numberWithCommas(d)} (${Math.round(1000 * d / data.ints_tot.n_patient) / 10}%)`);
    });

    // scales::show_col(ggthemes::tableau_color_pal('tableau10light')(10))
    // jsonlite::toJSON(ggthemes::tableau_color_pal('tableau10light')(10))

     var txt = `Those who seek care in the right time. Based on an India-specific distribution of ANC visit times and based on first week of risk stratification at ${data.pop.riskstrat_firstweek} weeks, last week of risk stratification at ${data.pop.riskstrat_lastweek} weeks and ${Math.round(data.pop.anc_visits1 * 100)}% of the population having at least one visit.`

     $(`#rs-num-info${sfx}`).attr("title", txt);

    // console.log(data)
  }
});
Shiny.outputBindings.register(prsDataOutputBinding);


// var countUpOutputBinding = new Shiny.OutputBinding();
// $.extend(countUpOutputBinding, {
//   find: function(scope) {
//     return $(scope).find('.shiny-countup-output');
//   },
//   renderValue: function(el, data) {
//     var options = {
//       useEasing: true,
//       useGrouping: true,
//       separator: ',',
//       decimal: '.',
//     };
//     var next = parseFloat(data);
//     var prev = parseFloat($(el).data("value"));
//     if (isNaN(prev)) {
//       prev = 0;
//     } else {
//       if (prev < next) {
//         $(el).addClass("counting-up");
//       } else {
//         $(el).addClass("counting-down");
//       }
//     }
//     var obj = new CountUp(el, prev, next, 0, 1.0, options);
//     obj.start(function() {
//       $(el).removeClass("counting-up");
//       $(el).removeClass("counting-down");
//     });
//     $(el).data("value", next);
//     // console.log(data)
//     // $(el).html(data);
//   }
// });
// Shiny.outputBindings.register(countUpOutputBinding);
