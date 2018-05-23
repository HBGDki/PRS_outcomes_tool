const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var int_lookup = {
  "am_diff_cfl": "Antenatal monitoring + diff CFL",
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

    makeCountUp("out_pop", data.pop.pop);
    makeCountUp("out_pe_rate", data.pop.pe_rate * 100);
    makeCountUp("out_n_pe", data.der.n_pe);
    makeCountUp("out_mort_rate_mat", data.pop.mort_rate_mat * 100000);
    makeCountUp("out_mort_rate_neo", data.pop.mort_rate_neo * 1000);
    makeCountUp("out_cfr_fru_maternal", data.pop.cfr_fru_maternal * 100000);
    makeCountUp("out_cfr_phc_maternal", data.pop.cfr_phc_maternal * 100000);
    makeCountUp("out_cfr_fru_neonatal", data.pop.cfr_fru_neonatal * 1000);
    makeCountUp("out_cfr_phc_neonatal", data.pop.cfr_phc_neonatal * 1000);
    makeCountUp("out_sys_fru_pct", data.pop.sys_fru_pct * 100);
    makeCountUp("out_sys_phc_pct", data.pop.sys_phc_pct * 100);
    makeCountUp("out_sys_home_pct", data.pop.sys_home_pct * 100);
    makeCountUp("out_leak_fru_phc", data.pop.leak_fru_phc * 100);
    makeCountUp("out_leak_phc_home", data.pop.leak_phc_home * 100);
    makeCountUp("out_sensitivity", data.pop.sensitivity * 100);
    makeCountUp("out_specificity", data.pop.specificity * 100);
    makeCountUp("out_anc_visits1", data.pop.anc_visits1 * 100);
    makeCountUp("out_anc_visits4", data.pop.anc_visits4 * 100);
    makeCountUp("out_riskstrat_firstweek", data.pop.riskstrat_firstweek);
    makeCountUp("out_riskstrat_lastweek", data.pop.riskstrat_lastweek);
    makeCountUp("out_n_riskstrat", data.der.n_riskstrat);
    makeCountUp("out_riskstrat_pct", data.der.riskstrat_pct * 100);
    makeCountUp("out_hr_flagged", data.der.hr_flagged);
    makeCountUp("out_hr_flagged_pct", data.der.hr_flagged_pct * 100);
    makeCountUp("out_hr_tp", data.der.hr_tp);
    makeCountUp("out_hr_tp_pct", data.der.hr_tp_pct * 100);
    makeCountUp("out_hr_fp", data.der.hr_fp);
    makeCountUp("out_hr_fp_pct", data.der.hr_fp_pct * 100);
    makeCountUp("out_lr_flagged", data.der.lr_flagged);
    makeCountUp("out_lr_flagged_pct", data.der.lr_flagged_pct * 100);
    makeCountUp("out_lr_tn", data.der.lr_tn);
    makeCountUp("out_lr_tn_pct", data.der.lr_tn_pct * 100);
    makeCountUp("out_lr_fn", data.der.lr_fn);
    makeCountUp("out_lr_fn_pct", data.der.lr_fn_pct * 100);
    makeCountUp("out_hr_tp2", data.der.hr_tp);
    makeCountUp("out_hr_tp_pct2", data.der.hr_tp_pct * 100);
    makeCountUp("out_hr_fp2", data.der.hr_fp);
    makeCountUp("out_hr_fp_pct2", data.der.hr_fp_pct * 100);
    makeCountUp("out_lr_tn2", data.der.lr_tn);
    makeCountUp("out_lr_tn_pct2", data.der.lr_tn_pct * 100);
    makeCountUp("out_lr_fn2", data.der.lr_fn);
    makeCountUp("out_lr_fn_pct2", data.der.lr_fn_pct * 100);

    makeCountUp("out_pop_big", data.pop.pop);
    makeCountUp("out-rs-big", data.der.n_riskstrat);
    makeCountUp("out-rs-pct-big", data.der.riskstrat_pct * 100);

    makeCountUp("out-hr", data.der.hr_tp + data.der.lr_fn);
    makeCountUp("out-hrtp", data.der.hr_tp);
    makeCountUp("out-lrfn", data.der.lr_fn);
    makeCountUp("out-hrtp-pct", 100 * data.der.hr_tp / (data.der.hr_tp + data.der.lr_fn));
    makeCountUp("out-lrfn-pct", 100 * data.der.lr_fn / (data.der.hr_tp + data.der.lr_fn));
    var mx = Math.max(data.der.hr_tp, data.der.lr_fn);
    $("#rs-tp").width(200 * data.der.hr_tp / mx);
    $("#rs-fn").width(200 * data.der.lr_fn / mx);

    makeCountUp("out-lr", data.der.hr_fp + data.der.lr_tn);
    makeCountUp("out-hrfp", data.der.hr_fp);
    makeCountUp("out-lrtn", data.der.lr_tn);
    makeCountUp("out-hrfp-pct", 100 * data.der.hr_fp / (data.der.hr_fp + data.der.lr_tn));
    makeCountUp("out-lrtn-pct", 100 * data.der.lr_tn / (data.der.hr_fp + data.der.lr_tn));
    mx = Math.max(data.der.hr_fp, data.der.lr_tn);
    $("#rs-fp").width(200 * data.der.hr_fp / mx);
    $("#rs-tn").width(200 * data.der.lr_tn / mx);

    makeCountUp("out-fhr", data.der.hr_tp + data.der.hr_fp);
    makeCountUp("out-hrtp2", data.der.hr_tp);
    makeCountUp("out-hrfp2", data.der.hr_fp);
    makeCountUp("out-hrtp2-pct", 100 * data.der.hr_tp / (data.der.hr_tp + data.der.hr_fp));
    makeCountUp("out-hrfp2-pct", 100 * data.der.hr_fp / (data.der.hr_tp + data.der.hr_fp));
    var mx = Math.max(data.der.hr_tp, data.der.hr_fp);
    $("#rs-tp2").width(200 * data.der.hr_tp / mx);
    $("#rs-fp2").width(200 * data.der.hr_fp / mx);

    makeCountUp("out-flr", data.der.lr_fn + data.der.lr_tn);
    makeCountUp("out-lrfn2", data.der.lr_fn);
    makeCountUp("out-lrtn2", data.der.lr_tn);
    makeCountUp("out-lrfn2-pct", 100 * data.der.lr_fn / (data.der.lr_fn + data.der.lr_tn));
    makeCountUp("out-lrtn2-pct", 100 * data.der.lr_tn / (data.der.lr_fn + data.der.lr_tn));
    mx = Math.max(data.der.lr_fn, data.der.lr_tn);
    $("#rs-fn2").width(200 * data.der.lr_fn / mx);
    $("#rs-tn2").width(200 * data.der.lr_tn / mx);

    makeCountUp("out-tot-hr", data.der.hr_tp + data.der.hr_fp);

    makeCountUp("out_pe_reduce", data.ints_tot.pe_reduce);
    makeCountUp("out_lifesave_mat", data.ints_tot.lifesave_mat);
    makeCountUp("out_lifesave_neo", data.ints_tot.lifesave_neo);

    /*----------------------*/

    data.ints.pe_reduce.map(function(d, i) {
      var el = $("#pe_reduce-entry-" + i);
      el.width(300 * (d / data.ints_tot.pe_reduce));
      el.attr("title", `${int_lookup[data.ints.name[i]]}: ${numberWithCommas(d)} (${Math.round(1000 * d / data.ints_tot.pe_reduce) / 10}%)`);
    });

    data.ints.lifesave_mat.map(function(d, i) {
      var el = $("#lifesave_mat-entry-" + i);
      el.width(300 * (d / data.ints_tot.lifesave_mat));
      el.attr("title", `${int_lookup[data.ints.name[i]]}: ${numberWithCommas(d)} (${Math.round(1000 * d / data.ints_tot.lifesave_mat) / 10}%)`);
    });

    data.ints.lifesave_neo.map(function(d, i) {
      var el = $("#lifesave_neo-entry-" + i);
      el.width(300 * (d / data.ints_tot.lifesave_neo));
      el.attr("title", `${int_lookup[data.ints.name[i]]}: ${numberWithCommas(d)} (${Math.round(1000 * d / data.ints_tot.lifesave_neo) / 10}%)`);
    });

    // scales::show_col(ggthemes::tableau_color_pal('tableau10light')(10))
    // jsonlite::toJSON(ggthemes::tableau_color_pal('tableau10light')(10))

     var txt = `Those who seek care in the right time. Based on an India-specific distribution of ANC visit times and based on first week of risk stratification of ${data.pop.riskstrat_firstweek}, last week of risk stratification of ${data.pop.riskstrat_lastweek} and ${Math.round(data.pop.anc_visits1 * 100)}% of the population having at least one visit.`

     $("#rs-num-info").attr("title", txt);

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
