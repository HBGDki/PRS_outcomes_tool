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

var prsDataOutputBinding = new Shiny.OutputBinding();
$.extend(prsDataOutputBinding, {
  find: function(scope) {
    return $(scope).find('.shiny-prs-data-output');
  },
  renderValue: function(el, data) {
    var makeCountUp = function(id, data) {
      var options = {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
      };

      var next = parseFloat(data);
      var el = $("#" + id);
      var prev = parseFloat(el.data("value"));
      if (isNaN(prev)) {
        prev = 0;
      } else {
        if (prev < next) {
          el.addClass("counting-up");
        } else {
          el.addClass("counting-down");
        }
      }
      var obj = new CountUp(id, prev, next, 0, 1.0, options);
      obj.start(function() {
        el.removeClass("counting-up", 1000, "easeInBack");
        el.removeClass("counting-down", 1000, "easeInBack");
      });
      el.data("value", next);
      el.html(data);
    }

    makeCountUp("out_pop", data.pop.pop);
    makeCountUp("out_pe_reduce", data.pop.pe_reduce);
    makeCountUp("out_lifesave_mat", data.pop.lifesave_mat);
    makeCountUp("out_lifesave_neo", data.pop.lifesave_neo);
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

    makeCountUp("out-lr", data.der.hr_fp + data.der.lr_tn);
    makeCountUp("out-hrfp", data.der.hr_fp);
    makeCountUp("out-lrtn", data.der.lr_tn);

    var mx = Math.max(data.der.hr_tp, data.der.lr_fn);
    $("#rs-tp").width(200 * data.der.hr_tp / mx);
    $("#rs-fn").width(200 * data.der.lr_fn / mx);

    mx = Math.max(data.der.hr_fp, data.der.lr_tn);
    $("#rs-fp").width(200 * data.der.hr_fp / mx);
    $("#rs-tn").width(200 * data.der.lr_tn / mx);

    makeCountUp("out-fhr", data.der.hr_tp + data.der.hr_fp);
    makeCountUp("out-hrtp2", data.der.hr_tp);
    makeCountUp("out-hrfp2", data.der.hr_fp);
    var mx = Math.max(data.der.hr_tp, data.der.hr_fp);
    $("#rs-tp2").width(200 * data.der.hr_tp / mx);
    $("#rs-fp2").width(200 * data.der.hr_fp / mx);

    makeCountUp("out-flr", data.der.lr_fn + data.der.lr_tn);
    makeCountUp("out-lrfn2", data.der.lr_fn);
    makeCountUp("out-lrtn2", data.der.lr_tn);
    mx = Math.max(data.der.lr_fn, data.der.lr_tn);
    $("#rs-fn2").width(200 * data.der.lr_fn / mx);
    $("#rs-tn2").width(200 * data.der.lr_tn / mx);

    makeCountUp("out-tot-hr", data.der.hr_tp + data.der.hr_fp);

    makeCountUp("out_pe_reduce", data.ints_tot.pe_reduce);
    makeCountUp("out_lifesave_mat", data.ints_tot.lifesave_mat);
    makeCountUp("out_lifesave_neo", data.ints_tot.lifesave_neo);

    // scales::show_col(ggthemes::tableau_color_pal('tableau10light')(10))
    // jsonlite::toJSON(ggthemes::tableau_color_pal('tableau10light')(10))
    var colors = {
      "a" : "#AEC7E8",
      "b" : "#FFBB78",
      "c" : "#98DF8A",
      "d" : "#FF9896",
      "e" : "#C5B0D5",
      "f" : "#C49C94",
      "g" : "#F7B6D2",
      "h" : "#C7C7C7",
      "i" : "#DBDB8D",
      "j" : "#9EDAE5"
    }


    console.log(data)
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
